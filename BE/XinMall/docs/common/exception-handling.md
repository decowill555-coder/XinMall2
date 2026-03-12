# 异常处理模块使用指南

> 本文档说明异常处理模块的设计与使用方法。

***

## 📦 模块概述

异常处理模块位于 `common/exception` 包下，提供统一的异常定义和处理机制，确保 API 错误响应格式一致。

```
common/
└── exception/
    ├── BusinessException.java         # 业务异常类
    └── GlobalExceptionHandler.java    # 全局异常处理器
```

***

## 🎯 设计目标

1. **统一错误响应**：所有异常都返回统一的 `Result` 格式
2. **业务异常分离**：业务逻辑错误通过 `BusinessException` 抛出，与系统异常区分
3. **自动捕获处理**：通过 `@RestControllerAdvice` 自动捕获异常，无需手动处理
4. **日志记录**：自动记录异常日志，便于问题排查

***

## 🔧 BusinessException 业务异常类

### 类定义

```java
@Getter
public class BusinessException extends RuntimeException {
    private final Integer code;
    private final String message;
}
```

### 构造方法

| 构造方法                                                       | 说明                           |
| ---------------------------------------------------------- | ---------------------------- |
| `BusinessException()`                                      | 默认使用 `INTERNAL_SERVER_ERROR` |
| `BusinessException(String message)`                        | 自定义消息，使用 500 状态码             |
| `BusinessException(Integer code, String message)`          | 自定义状态码和消息                    |
| `BusinessException(ResultCode resultCode)`                 | 使用预定义错误码                     |
| `BusinessException(ResultCode resultCode, String message)` | 使用预定义错误码 + 自定义消息             |

### 静态工厂方法

```java
BusinessException.of(String message)
BusinessException.of(ResultCode resultCode)
BusinessException.of(ResultCode resultCode, String message)
BusinessException.of(Integer code, String message)
```

### 使用示例

```java
@Service
public class UserServiceImpl implements UserService {

    @Override
    public User getById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    public void register(RegisterRequest request) {
        if (userMapper.selectByPhone(request.getPhone()) != null) {
            throw BusinessException.of(ResultCode.PHONE_ALREADY_REGISTERED);
        }
    }

    @Override
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (!passwordMatches(oldPassword, user.getPassword())) {
            throw new BusinessException(ResultCode.PASSWORD_ERROR, "原密码错误");
        }
    }
}
```

***

## 🛡️ GlobalExceptionHandler 全局异常处理器

### 处理的异常类型

| 异常类型                                      | HTTP状态 | 错误码  | 说明                    |
| ----------------------------------------- | ------ | ---- | --------------------- |
| `BusinessException`                       | 200    | 自定义  | 业务异常                  |
| `MethodArgumentNotValidException`         | 400    | 422  | `@Valid` 校验失败         |
| `BindException`                           | 400    | 400  | 参数绑定失败                |
| `ConstraintViolationException`            | 400    | 422  | 约束校验失败                |
| `MissingServletRequestParameterException` | 400    | 400  | 缺少必要参数                |
| `MethodArgumentTypeMismatchException`     | 400    | 400  | 参数类型错误                |
| `HttpMessageNotReadableException`         | 400    | 400  | 请求体格式错误               |
| `HttpRequestMethodNotSupportedException`  | 405    | 405  | 请求方法不支持               |
| `NoHandlerFoundException`                 | 404    | 404  | 资源不存在                 |
| `AccessDeniedException`                   | 403    | 403  | 权限不足（Spring Security） |
| `BadCredentialsException`                 | 401    | 1003 | 密码错误（Spring Security） |
| `AuthenticationException`                 | 401    | 401  | 认证失败（Spring Security） |
| `IllegalArgumentException`                | 400    | 400  | 非法参数                  |
| `Exception`                               | 500    | 500  | 其他未知异常                |

### 响应示例

#### 业务异常

```json
{
  "code": 1001,
  "message": "用户不存在",
  "data": null
}
```

#### 参数校验失败

```json
{
  "code": 422,
  "message": "手机号不能为空, 密码长度必须在6-20之间",
  "data": null
}
```

#### 权限不足

```json
{
  "code": 403,
  "message": "权限不足，拒绝访问",
  "data": null
}
```

#### 系统异常

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

***

## 📝 使用场景

### 1. Service 层抛出业务异常

```java
@Service
public class OrderServiceImpl implements OrderService {

    @Override
    public Order createOrder(CreateOrderRequest request) {
        Goods goods = goodsMapper.selectById(request.getGoodsId());
        
        if (goods == null) {
            throw new BusinessException(ResultCode.GOODS_NOT_FOUND);
        }
        
        if (goods.getStatus() != GoodsStatus.ON_SALE) {
            throw new BusinessException(ResultCode.GOODS_OFF_SHELF);
        }
        
        if (goods.getStock() < request.getQuantity()) {
            throw new BusinessException(ResultCode.GOODS_STOCK_INSUFFICIENT);
        }
        
        // 创建订单逻辑...
    }
}
```

### 2. Controller 层参数校验

```java
@RestController
@RequestMapping("/api/user")
public class UserController {

    @PostMapping("/register")
    public Result<UserVO> register(@RequestBody @Valid RegisterRequest request) {
        return Result.created(userService.register(request));
    }
}

@Data
public class RegisterRequest {
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String password;
}
```

校验失败时自动返回：

```json
{
  "code": 422,
  "message": "手机号格式不正确, 密码长度必须在6-20之间",
  "data": null
}
```

### 3. 权限控制

配合 Spring Security 使用，当用户权限不足时自动返回 403 错误：

```java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/users")
    public Result<List<UserVO>> listUsers() {
        // 只有管理员可以访问
    }
}
```

***

## 📊 异常处理流程

```
请求进入
    ↓
Controller 处理
    ↓
Service 执行业务逻辑
    │
    ├── 正常执行 → 返回 Result.success()
    │
    └── 抛出异常
            ↓
    GlobalExceptionHandler 捕获
            ↓
    根据异常类型处理
            ↓
    返回 Result.error()
```

***

## ⚠️ 最佳实践

### 1. 优先使用预定义错误码

```java
// ✅ 推荐
throw new BusinessException(ResultCode.USER_NOT_FOUND);

// ❌ 不推荐
throw new BusinessException("用户不存在");
```

### 2. 需要自定义消息时使用预定义错误码 + 消息

```java
// ✅ 推荐 - 保持错误码一致性
throw new BusinessException(ResultCode.BAD_REQUEST, "用户名格式不正确，只能包含字母和数字");

// ❌ 不推荐 - 使用 500 错误码
throw new BusinessException("用户名格式不正确");
```

### 3. 不要捕获业务异常

```java
// ❌ 错误 - 不要捕获业务异常
try {
    userService.register(request);
} catch (BusinessException e) {
    return Result.error(e.getCode(), e.getMessage());
}

// ✅ 正确 - 让全局处理器处理
userService.register(request);
return Result.success();
```

### 4. 合理使用日志级别

| 异常类型                      | 日志级别  | 说明          |
| ------------------------- | ----- | ----------- |
| `BusinessException`       | WARN  | 业务异常，预期内的错误 |
| `AuthenticationException` | WARN  | 认证失败        |
| `Exception`               | ERROR | 系统异常，需要排查   |

### 5. 参数校验使用 `@Valid`

```java
// ✅ 推荐 - 使用 @Valid 注解
@PostMapping
public Result<Void> create(@RequestBody @Valid CreateRequest request) {
    // ...
}

// ❌ 不推荐 - 手动校验
@PostMapping
public Result<Void> create(@RequestBody CreateRequest request) {
    if (StringUtils.isBlank(request.getName())) {
        throw new BusinessException("名称不能为空");
    }
    // ...
}
```

***

## 🔍 常见问题

### Q1: 为什么业务异常返回 HTTP 200？

业务异常是预期内的错误，客户端应该根据 `code` 字段判断业务是否成功，而不是 HTTP 状态码。这样前端处理逻辑更统一。

### Q2: 如何添加新的错误码？

在 `ResultCode.java` 中添加新的枚举值：

```java
public enum ResultCode {
    // ... 现有错误码
    
    // 支付模块 (7000-7999)
    PAYMENT_FAILED(7001, "支付失败"),
    PAYMENT_TIMEOUT(7002, "支付超时");
}
```

### Q3: 如何处理事务回滚？

`BusinessException` 继承自 `RuntimeException`，在 `@Transactional` 方法中抛出时会自动回滚：

```java
@Transactional
public void createOrder(CreateOrderRequest request) {
    Goods goods = goodsMapper.selectById(request.getGoodsId());
    if (goods.getStock() < request.getQuantity()) {
        throw new BusinessException(ResultCode.GOODS_STOCK_INSUFFICIENT);
        // 事务会自动回滚
    }
    // ...
}
```

### Q4: 如何自定义异常处理？

如果需要特殊处理某种异常，可以在 `GlobalExceptionHandler` 中添加新的处理方法：

```java
@ExceptionHandler(CustomException.class)
public Result<Void> handleCustomException(CustomException e, HttpServletRequest request) {
    log.warn("自定义异常: {} - {}", request.getRequestURI(), e.getMessage());
    return Result.error(e.getCode(), e.getMessage());
}
```

***

## 📁 相关文件

- [ResultCode.java](../src/main/java/com/example/xinmall/common/enums/ResultCode.java) - 响应状态码枚举
- [Result.java](../src/main/java/com/example/xinmall/common/result/Result.java) - 统一响应封装
- [BusinessException.java](../src/main/java/com/example/xinmall/common/exception/BusinessException.java) - 业务异常类
- [GlobalExceptionHandler.java](../src/main/java/com/example/xinmall/common/exception/GlobalExceptionHandler.java) - 全局异常处理器

***

*文档版本：v1.0*
*最后更新：2026-03-11*
