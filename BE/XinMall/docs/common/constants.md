# 常量定义模块使用指南

> 本文档说明常量定义模块的设计与使用方法。

***

## 📦 模块概述

常量定义模块位于 `common/constant` 包下，集中管理项目中的所有常量，避免硬编码，提高代码可维护性。

```
common/
└── constant/
    ├── Constants.java     # 通用常量
    └── RedisKey.java      # Redis Key 常量
```

***

## 🎯 设计目标

**避免硬编码**：所有魔法值都定义为常量

- **集中管理**：常量统一存放，便于查找和修改
- **语义清晰**：常量命名具有明确的业务含义
- **类型安全**：使用常量而非字符串，编译期检查

***

## 🔧 Constants 通用常量类

### 类定义

```java
public final class Constants {
    private Constants() {}  // 私有构造，防止实例化
}
```

### 常量分类

#### 1. 基础配置

```java
public static final String DEFAULT_CHARSET = "UTF-8";
```

#### 2. 分页参数

```java
public static final Integer DEFAULT_PAGE = 1;           // 默认页码
public static final Integer DEFAULT_PAGE_SIZE = 10;     // 默认每页大小
public static final Integer MAX_PAGE_SIZE = 100;        // 最大每页大小
```

**使用示例：**

```java
@GetMapping("/list")
public Result<PageResult<UserVO>> list(
    @RequestParam(defaultValue = "#{T(com.example.xinmall.common.constant.Constants).DEFAULT_PAGE}") Integer page,
    @RequestParam(defaultValue = "#{T(com.example.xinmall.common.constant.Constants).DEFAULT_PAGE_SIZE}") Integer size) {
    // ...
}
```

#### 3. Token 配置

```java
public static final String TOKEN_HEADER = "Authorization";           // Token 请求头
public static final String TOKEN_PREFIX = "Bearer ";                 // Token 前缀
public static final Long TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L;        // Token 有效期（7天）
public static final Long REFRESH_TOKEN_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000L; // 刷新 Token 有效期（30天）
```

**使用示例：**

```java
// 生成 Token
String token = JwtUtils.generateToken(userId);
response.setHeader(Constants.TOKEN_HEADER, Constants.TOKEN_PREFIX + token);

// 解析 Token
String header = request.getHeader(Constants.TOKEN_HEADER);
if (header != null && header.startsWith(Constants.TOKEN_PREFIX)) {
    String token = header.substring(Constants.TOKEN_PREFIX.length());
}
```

#### 4. 用户相关

```java
public static final String DEFAULT_PASSWORD = "123456";           // 默认密码
public static final Integer PASSWORD_MIN_LENGTH = 6;              // 密码最小长度
public static final Integer PASSWORD_MAX_LENGTH = 20;             // 密码最大长度
public static final String CURRENT_USER = "currentUser";          // 当前用户属性名
public static final String USER_ID = "userId";                    // 用户ID属性名
```

#### 5. 正则表达式

```java
public static final String PHONE_REGEX = "^1[3-9]\\d{9}$";
public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
public static final String USERNAME_REGEX = "^[a-zA-Z0-9_]{4,20}$";
```

**使用示例：**

```java
@Data
public class RegisterRequest {
    
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = Constants.PHONE_REGEX, message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = Constants.USERNAME_REGEX, message = "用户名格式不正确")
    private String username;
}
```

#### 6. 验证码配置

```java
public static final Long VERIFY_CODE_EXPIRE_TIME = 5 * 60 * 1000L;   // 验证码有效期（5分钟）
public static final Integer VERIFY_CODE_LENGTH = 6;                   // 验证码长度
```

**使用示例：**

```java
// 生成验证码
String code = RandomUtil.randomNumbers(Constants.VERIFY_CODE_LENGTH);

// 存储验证码
String key = RedisKey.getVerifyCodeKey(phone);
redisTemplate.opsForValue().set(key, code, Constants.VERIFY_CODE_EXPIRE_TIME, TimeUnit.MILLISECONDS);
```

#### 7. 文件上传

```java
public static final Long UPLOAD_MAX_SIZE = 10 * 1024 * 1024L;        // 最大上传大小（10MB）
public static final String[] ALLOWED_IMAGE_TYPES = {"jpg", "jpeg", "png", "gif", "webp"};
public static final String[] ALLOWED_FILE_TYPES = {"jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "xls", "xlsx"};
```

**使用示例：**

```java
public void validateFile(MultipartFile file) {
    if (file.getSize() > Constants.UPLOAD_MAX_SIZE) {
        throw new BusinessException(ResultCode.FILE_SIZE_EXCEEDED);
    }
    
    String extension = FileUtil.getSuffix(file.getOriginalFilename());
    if (!ArrayUtil.contains(Constants.ALLOWED_IMAGE_TYPES, extension)) {
        throw new BusinessException(ResultCode.FILE_TYPE_NOT_ALLOWED);
    }
}
```

#### 8. 日期格式

```java
public static final String DATE_FORMAT = "yyyy-MM-dd";
public static final String TIME_FORMAT = "HH:mm:ss";
public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
```

**使用示例：**

```java
String dateStr = DateUtil.format(new Date(), Constants.DATETIME_FORMAT);
Date date = DateUtil.parse(dateStr, Constants.DATETIME_FORMAT);
```

#### 9. 订单配置

```java
public static final String ORDER_NO_PREFIX = "ORD";                  // 订单号前缀
public static final String PAYMENT_NO_PREFIX = "PAY";                // 支付单号前缀
public static final String REFUND_NO_PREFIX = "REF";                 // 退款单号前缀
public static final Integer ORDER_CANCEL_HOURS = 24;                 // 订单取消时限（小时）
public static final Integer ORDER_AUTO_CONFIRM_DAYS = 7;             // 自动确认收货天数
public static final Integer ORDER_AUTO_COMPLETE_DAYS = 15;           // 自动完成天数
```

**使用示例：**

```java
// 生成订单号
String orderNo = Constants.ORDER_NO_PREFIX + DateUtil.format(new Date(), "yyyyMMddHHmmss") + RandomUtil.randomNumbers(6);

// 检查订单是否可取消
LocalDateTime createTime = order.getCreateTime();
if (LocalDateTime.now().isAfter(createTime.plusHours(Constants.ORDER_CANCEL_HOURS))) {
    throw new BusinessException("订单已超过可取消时限");
}
```

#### 10. 业务限制

```java
public static final Integer SHOP_GOODS_LIMIT = 1000;     // 店铺商品数量上限
public static final Integer USER_ADDRESS_LIMIT = 20;     // 用户地址数量上限
```

#### 11. 通用状态

```java
public static final String SUCCESS = "success";
public static final String FAIL = "fail";
public static final String YES = "Y";
public static final String NO = "N";

public static final Integer STATUS_NORMAL = 0;           // 正常状态
public static final Integer STATUS_DISABLED = 1;         // 禁用状态
public static final Integer STATUS_DELETED = 2;          // 删除状态
```

***

## 🔑 RedisKey Redis Key 常量类

### 类定义

```java
public final class RedisKey {
    private RedisKey() {}
    private static final String PREFIX = "xinmall:";
}
```

### Key 命名规范

```
xinmall:{模块}:{业务}:{标识}
```

示例：

- `xinmall:user:token:123` - 用户 123 的 Token
- `xinmall:goods:stock:456` - 商品 456 的库存
- `xinmall:order:detail:789` - 订单 789 的详情

### Key 分类

#### 1. 用户模块

```java
public static final String USER_TOKEN = PREFIX + "user:token:";           // 用户 Token
public static final String USER_REFRESH_TOKEN = PREFIX + "user:refresh:token:"; // 刷新 Token
public static final String USER_INFO = PREFIX + "user:info:";             // 用户信息缓存
public static final String USER_PHONE = PREFIX + "user:phone:";           // 手机号映射

public static String getUserTokenKey(Long userId) {
    return USER_TOKEN + userId;
}
```

**使用示例：**

```java
// 存储 Token
String tokenKey = RedisKey.getUserTokenKey(userId);
redisTemplate.opsForValue().set(tokenKey, token, Constants.TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

// 获取 Token
String token = redisTemplate.opsForValue().get(RedisKey.getUserTokenKey(userId));

// 缓存用户信息
String userInfoKey = RedisKey.getUserInfoKey(userId);
redisTemplate.opsForValue().set(userInfoKey, JSON.toJSONString(userVO), 1, TimeUnit.HOURS);
```

#### 2. 验证码

```java
public static final String VERIFY_CODE = PREFIX + "verify:code:";         // 验证码
public static final String VERIFY_CODE_LIMIT = PREFIX + "verify:limit:";  // 验证码发送限制

public static String getVerifyCodeKey(String phone) {
    return VERIFY_CODE + phone;
}
```

**使用示例：**

```java
// 发送验证码前检查限制
String limitKey = RedisKey.getVerifyCodeLimitKey(phone);
Integer count = redisTemplate.opsForValue().get(limitKey);
if (count != null && count >= 5) {
    throw new BusinessException("验证码发送次数已达上限");
}

// 存储验证码
String codeKey = RedisKey.getVerifyCodeKey(phone);
redisTemplate.opsForValue().set(codeKey, code, Constants.VERIFY_CODE_EXPIRE_TIME, TimeUnit.MILLISECONDS);

// 验证验证码
String storedCode = redisTemplate.opsForValue().get(RedisKey.getVerifyCodeKey(phone));
if (!code.equals(storedCode)) {
    throw new BusinessException(ResultCode.VERIFICATION_CODE_ERROR);
}
```

#### 3. 商品模块

```java
public static final String GOODS_STOCK = PREFIX + "goods:stock:";         // 商品库存
public static final String GOODS_DETAIL = PREFIX + "goods:detail:";       // 商品详情缓存
public static final String GOODS_LIST = PREFIX + "goods:list:";           // 商品列表缓存

public static String getGoodsStockKey(Long goodsId) {
    return GOODS_STOCK + goodsId;
}

public static String getGoodsListKey(Long categoryId, Integer page, Integer size) {
    return GOODS_LIST + categoryId + ":" + page + ":" + size;
}
```

**使用示例：**

```java
// 库存预扣减（使用 Lua 脚本保证原子性）
String stockKey = RedisKey.getGoodsStockKey(goodsId);
Long remain = redisTemplate.opsForValue().decrement(stockKey);
if (remain < 0) {
    redisTemplate.opsForValue().increment(stockKey);
    throw new BusinessException(ResultCode.GOODS_STOCK_INSUFFICIENT);
}

// 缓存商品详情
String detailKey = RedisKey.getGoodsDetailKey(goodsId);
redisTemplate.opsForValue().set(detailKey, JSON.toJSONString(goodsVO), 30, TimeUnit.MINUTES);
```

#### 4. 分类和品牌

```java
public static final String CATEGORY_LIST = PREFIX + "category:list";      // 分类列表
public static final String CATEGORY_DETAIL = PREFIX + "category:detail:"; // 分类详情
public static final String BRAND_LIST = PREFIX + "brand:list";            // 品牌列表
public static final String BRAND_DETAIL = PREFIX + "brand:detail:";       // 品牌详情
```

#### 5. 订单模块

```java
public static final String ORDER_NO = PREFIX + "order:no";                // 订单号生成
public static final String ORDER_DETAIL = PREFIX + "order:detail:";       // 订单详情缓存
public static final String ORDER_USER_LIST = PREFIX + "order:user:";      // 用户订单列表
public static final String ORDER_LOCK = PREFIX + "order:lock:";           // 订单锁

public static String getOrderLockKey(Long orderId) {
    return ORDER_LOCK + orderId;
}
```

**使用示例：**

```java
// 订单分布式锁
String lockKey = RedisKey.getOrderLockKey(orderId);
Boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, "1", 30, TimeUnit.SECONDS);
if (!locked) {
    throw new BusinessException("订单正在处理中，请勿重复操作");
}
try {
    // 处理订单逻辑
} finally {
    redisTemplate.delete(lockKey);
}
```

#### 6. 购物车

```java
public static final String CART_USER = PREFIX + "cart:user:";             // 用户购物车
public static final String CART_ITEM = PREFIX + "cart:item:";             // 购物车商品项

public static String getCartUserKey(Long userId) {
    return CART_USER + userId;
}
```

#### 7. 收藏

```java
public static final String COLLECTION_USER = PREFIX + "collection:user:"; // 用户收藏列表
public static final String COLLECTION_GOODS = PREFIX + "collection:goods:"; // 商品收藏数

public static String getCollectionUserKey(Long userId) {
    return COLLECTION_USER + userId;
}
```

#### 8. 消息

```java
public static final String MESSAGE_UNREAD = PREFIX + "message:unread:";   // 未读消息数
public static final String CONVERSATION_LIST = PREFIX + "conversation:list:"; // 会话列表

public static String getMessageUnreadKey(Long userId) {
    return MESSAGE_UNREAD + userId;
}
```

**使用示例：**

```java
// 增加未读消息数
String unreadKey = RedisKey.getMessageUnreadKey(userId);
redisTemplate.opsForValue().increment(unreadKey);

// 获取未读消息数
Integer unread = redisTemplate.opsForValue().get(RedisKey.getMessageUnreadKey(userId));

// 清空未读消息数
redisTemplate.opsForValue().set(RedisKey.getMessageUnreadKey(userId), "0");
```

#### 9. 搜索

```java
public static final String SEARCH_HISTORY = PREFIX + "search:history:";   // 搜索历史
public static final String SEARCH_HOT = PREFIX + "search:hot";            // 热门搜索

public static String getSearchHistoryKey(Long userId) {
    return SEARCH_HISTORY + userId;
}
```

#### 10. 限流

```java
public static final String RATE_LIMIT = PREFIX + "rate:limit:";           // 接口限流
public static final String API_ACCESS_COUNT = PREFIX + "api:access:";     // API 访问统计

public static String getRateLimitKey(String ip) {
    return RATE_LIMIT + ip;
}
```

**使用示例：**

```java
// IP 限流
String limitKey = RedisKey.getRateLimitKey(ip);
Long count = redisTemplate.opsForValue().increment(limitKey);
if (count == 1) {
    redisTemplate.expire(limitKey, 1, TimeUnit.MINUTES);
}
if (count > 100) {
    throw new BusinessException("请求过于频繁，请稍后再试");
}
```

***

## ⚠️ 最佳实践

### 1. 使用常量而非硬编码

```java
// ❌ 错误
if (user.getStatus() == 0) { ... }

// ✅ 正确
if (user.getStatus() == Constants.STATUS_NORMAL) { ... }
```

### 2. 使用静态方法生成 Key

```java
// ❌ 错误
String key = "xinmall:user:token:" + userId;

// ✅ 正确
String key = RedisKey.getUserTokenKey(userId);
```

### 3. Key 设置过期时间

```java
// ✅ 缓存必须设置过期时间
redisTemplate.opsForValue().set(key, value, 30, TimeUnit.MINUTES);
```

### 4. 扩展常量

在 `Constants.java` 中添加新常量：

```java
// 支付模块配置
public static final Integer PAYMENT_TIMEOUT_MINUTES = 30;
public static final String PAYMENT_CALLBACK_URL = "/api/payment/callback";
```

在 `RedisKey.java` 中添加新 Key：

```java
// 支付模块
public static final String PAYMENT_ORDER = PREFIX + "payment:order:";
public static final String PAYMENT_LOCK = PREFIX + "payment:lock:";

public static String getPaymentOrderKey(Long orderId) {
    return PAYMENT_ORDER + orderId;
}
```

***

## 📁 相关文件

- [Constants.java](../src/main/java/com/example/xinmall/common/constant/Constants.java) - 通用常量
- [RedisKey.java](../src/main/java/com/example/xinmall/common/constant/RedisKey.java) - Redis Key 常量

***

*文档版本：v1.0*
*最后更新：2026-03-11*
