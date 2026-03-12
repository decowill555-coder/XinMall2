# 统一响应模块使用指南

> 本文档说明统一响应模块的设计与使用方法。

---

## 📦 模块概述

统一响应模块位于 `common` 包下，提供标准化的 API 响应格式，确保前后端数据交互的一致性。

```
common/
├── result/
│   ├── Result.java           # 统一响应封装类
│   └── PageResult.java       # 分页响应封装类
└── enums/
    └── ResultCode.java       # 响应状态码枚举
```

---

## 🔧 响应格式规范

### 标准响应格式

所有 API 接口统一返回以下 JSON 格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | Integer | 状态码，200 表示成功，其他表示错误 |
| `message` | String | 响应消息，成功时为提示信息，失败时为错误原因 |
| `data` | T | 响应数据，可为任意类型 |

### 分页响应格式

分页接口返回的 `data` 结构：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [ ... ],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `list` | List\<T\> | 数据列表 |
| `total` | Long | 总记录数 |
| `page` | Long | 当前页码 |
| `size` | Long | 每页大小 |
| `pages` | Long | 总页数 |

---

## 📝 Result 类使用方法

### 成功响应

```java
// 无数据返回
return Result.success();

// 返回数据
return Result.success(userVO);

// 自定义消息
return Result.success("登录成功", token);
```

### 创建成功响应

```java
// 创建资源成功
return Result.created();

// 创建资源成功并返回数据
return Result.created(newOrder);
```

### 错误响应

```java
// 使用预定义错误码
return Result.error(ResultCode.USER_NOT_FOUND);

// 使用预定义错误码 + 自定义消息
return Result.error(ResultCode.BAD_REQUEST, "用户名不能为空");

// 自定义错误码和消息
return Result.error(1001, "自定义错误信息");

// 通用错误
return Result.error("操作失败");
```

### 常用快捷方法

```java
// 400 错误
return Result.badRequest("参数格式错误");

// 401 未授权
return Result.unauthorized();
return Result.unauthorized("Token已过期");

// 403 禁止访问
return Result.forbidden();
return Result.forbidden("无权访问该资源");

// 404 未找到
return Result.notFound("商品不存在");
```

### 判断响应状态

```java
Result<UserVO> result = userService.getUser(id);
if (result.isSuccess()) {
    UserVO user = result.getData();
}
```

---

## 📄 PageResult 类使用方法

### 从 MyBatis-Plus IPage 转换

```java
@GetMapping("/list")
public Result<PageResult<GoodsVO>> list(@RequestParam(defaultValue = "1") Long page,
                                         @RequestParam(defaultValue = "10") Long size) {
    IPage<Goods> goodsPage = goodsService.page(new Page<>(page, size));
    PageResult<GoodsVO> pageResult = PageResult.of(goodsPage);
    return Result.success(pageResult);
}
```

### 手动构建

```java
List<UserVO> list = userService.getUserList();
Long total = userService.count();

PageResult<UserVO> pageResult = PageResult.of(list, total, 1L, 10L);
return Result.success(pageResult);
```

### 空分页

```java
// 默认空分页
return Result.success(PageResult.empty());

// 指定页码的空分页
return Result.success(PageResult.empty(1L, 10L));
```

### 分页判断

```java
PageResult<GoodsVO> pageResult = ...;

if (pageResult.hasNext()) {
    // 有下一页
}

if (pageResult.hasPrevious()) {
    // 有上一页
}
```

---

## 🏷️ ResultCode 状态码规范

### 状态码分类

| 范围 | 分类 | 说明 |
|------|------|------|
| 200-299 | 成功 | 操作成功相关 |
| 400-499 | 客户端错误 | 请求参数、权限等问题 |
| 500-599 | 服务端错误 | 服务器内部错误 |
| 1000-1999 | 用户模块 | 用户相关业务错误 |
| 2000-2999 | 商品模块 | 商品相关业务错误 |
| 3000-3999 | 订单模块 | 订单相关业务错误 |
| 4000-4999 | 店铺模块 | 店铺相关业务错误 |
| 5000-5999 | 文件模块 | 文件上传相关错误 |
| 6000-6999 | 地址模块 | 地址相关业务错误 |

### 常用状态码

```java
// 成功
ResultCode.SUCCESS          // 200 操作成功
ResultCode.CREATED          // 201 创建成功

// 客户端错误
ResultCode.BAD_REQUEST      // 400 请求参数错误
ResultCode.UNAUTHORIZED     // 401 未授权
ResultCode.FORBIDDEN        // 403 权限不足
ResultCode.NOT_FOUND        // 404 资源不存在

// 服务端错误
ResultCode.INTERNAL_SERVER_ERROR  // 500 服务器内部错误

// 业务错误
ResultCode.USER_NOT_FOUND         // 1001 用户不存在
ResultCode.GOODS_NOT_FOUND        // 2001 商品不存在
ResultCode.ORDER_NOT_FOUND        // 3001 订单不存在
```

### 扩展状态码

在 `ResultCode.java` 中添加新的状态码：

```java
public enum ResultCode {
    // ... 现有状态码

    // 支付模块 (7000-7999)
    PAYMENT_FAILED(7001, "支付失败"),
    PAYMENT_TIMEOUT(7002, "支付超时"),
    REFUND_FAILED(7003, "退款失败");
}
```

---

## 💡 最佳实践

### Controller 层示例

```java
@RestController
@RequestMapping("/api/user")
@Tag(name = "用户接口", description = "用户相关操作")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "获取用户信息")
    public Result<UserVO> getUser(@PathVariable Long id) {
        UserVO user = userService.getUserVO(id);
        if (user == null) {
            return Result.error(ResultCode.USER_NOT_FOUND);
        }
        return Result.success(user);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<UserVO> register(@RequestBody @Valid RegisterRequest request) {
        UserVO user = userService.register(request);
        return Result.created(user);
    }

    @GetMapping("/list")
    @Operation(summary = "用户列表")
    public Result<PageResult<UserVO>> list(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long size) {
        PageResult<UserVO> result = userService.getUserList(page, size);
        return Result.success(result);
    }
}
```

### Service 层示例

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserVO getUserVO(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return null;
        }
        return convertToVO(user);
    }

    @Override
    @Transactional
    public UserVO register(RegisterRequest request) {
        // 检查手机号是否已注册
        if (userMapper.selectByPhone(request.getPhone()) != null) {
            throw new BusinessException(ResultCode.PHONE_ALREADY_REGISTERED);
        }
        // ... 注册逻辑
    }
}
```

---

## ⚠️ 注意事项

1. **统一使用 Result 包装**：所有 Controller 接口必须返回 `Result<T>` 类型
2. **不要直接抛出异常**：业务异常应通过 `BusinessException` 抛出，由全局异常处理器统一处理
3. **状态码复用**：优先使用已定义的状态码，避免重复定义
4. **分页参数**：分页接口统一使用 `page` 和 `size` 作为参数名
5. **空数据处理**：返回空列表时使用 `Collections.emptyList()` 或 `PageResult.empty()`

---

*文档版本：v1.0*
*最后更新：2026-03-11*
