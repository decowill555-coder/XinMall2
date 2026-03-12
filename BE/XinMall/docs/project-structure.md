# XinMall 后端项目结构说明

> 本文档详细说明后端项目的目录结构和各模块职责。

---

## 📁 项目整体结构

```
XinMall/
├── docs/                               # 文档目录
│   ├── database-design.md              # 数据库设计文档
│   └── project-structure.md            # 项目结构说明（本文件）
├── src/
│   ├── main/
│   │   ├── java/com/example/xinmall/
│   │   │   ├── XinMallApplication.java # 启动类
│   │   │   ├── common/                 # 公共模块
│   │   │   ├── config/                 # 配置类
│   │   │   ├── security/               # 安全模块
│   │   │   ├── entity/                 # 实体类
│   │   │   ├── dto/                    # 数据传输对象
│   │   │   ├── mapper/                 # Mapper接口
│   │   │   ├── service/                # 服务层
│   │   │   ├── controller/             # 控制器
│   │   │   └── utils/                  # 工具类
│   │   └── resources/
│   │       ├── application.yml         # 配置文件
│   │       └── mapper/                 # MyBatis XML
│   └── test/                           # 测试目录
├── pom.xml                             # Maven配置
└── README.md                           # 项目说明
```

---

## 📦 各模块详细说明

### 1. common（公共模块）

存放项目通用的基础类，如统一响应、异常处理、常量定义等。

```
common/
├── result/                             # 统一响应
│   ├── Result.java                     # 统一响应封装类
│   └── PageResult.java                 # 分页响应封装类
├── exception/                          # 异常处理
│   ├── BusinessException.java          # 业务异常类
│   └── GlobalExceptionHandler.java     # 全局异常处理器
├── constant/                           # 常量定义
│   ├── Constants.java                  # 通用常量
│   └── RedisKey.java                   # Redis Key常量
└── enums/                              # 通用枚举
    └── ResultCode.java                 # 响应状态码枚举
```

**职责说明**：

| 文件/文件夹 | 职责 |
|------------|------|
| `Result.java` | 统一API响应格式，包含 code、message、data |
| `PageResult.java` | 分页数据封装，包含 list、total、page、size |
| `BusinessException.java` | 自定义业务异常，用于抛出业务错误 |
| `GlobalExceptionHandler.java` | 全局异常捕获，统一返回错误格式 |
| `Constants.java` | 定义系统常量，如默认值、状态码等 |
| `ResultCode.java` | 定义API响应状态码枚举 |

---

### 2. config（配置模块）

存放 Spring Boot 配置类，用于配置框架行为。

```
config/
├── MybatisPlusConfig.java              # MyBatis-Plus配置
├── RedisConfig.java                    # Redis配置
├── SecurityConfig.java                 # Spring Security配置
├── Knife4jConfig.java                  # API文档配置
├── WebConfig.java                      # Web配置（跨域、拦截器等）
└── CorsConfig.java                     # 跨域配置
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `MybatisPlusConfig.java` | 配置分页插件、自动填充、逻辑删除等 |
| `RedisConfig.java` | 配置Redis序列化、缓存策略等 |
| `SecurityConfig.java` | 配置Security过滤链、权限控制 |
| `Knife4jConfig.java` | 配置API文档、分组信息 |
| `WebConfig.java` | 配置静态资源、拦截器、参数解析器 |

---

### 3. security（安全模块）

存放认证授权相关代码，处理用户登录、Token验证等。

```
security/
├── JwtUtils.java                       # JWT工具类
├── JwtFilter.java                      # JWT认证过滤器
├── UserDetailsServiceImpl.java         # 用户详情服务实现
├── AuthenticationEntryPointImpl.java   # 认证失败处理
└── AccessDeniedHandlerImpl.java        # 权限不足处理
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `JwtUtils.java` | 生成Token、解析Token、验证Token有效性 |
| `JwtFilter.java` | 拦截请求，验证Token，设置用户上下文 |
| `UserDetailsServiceImpl.java` | 实现Spring Security的用户加载接口 |
| `AuthenticationEntryPointImpl.java` | 处理未登录访问受保护资源 |
| `AccessDeniedHandlerImpl.java` | 处理权限不足的情况 |

---

### 4. entity（实体模块）

存放数据库表对应的实体类，按业务模块分包。

```
entity/
├── user/                               # 用户模块
│   ├── enums/                          # 用户模块枚举
│   │   ├── Gender.java                 # 性别枚举
│   │   ├── UserStatus.java             # 用户状态枚举
│   │   └── AuthStatus.java             # 认证状态枚举
│   ├── User.java                       # 用户实体
│   ├── UserProfile.java                # 用户扩展资料
│   └── UserAddress.java                # 收货地址
├── product/                            # 产品库模块
│   ├── enums/                          # 产品库模块枚举
│   ├── Category.java                   # 分类实体
│   ├── Brand.java                      # 品牌实体
│   └── ...                             # 其他实体
├── trade/                              # 商品交易模块
│   ├── enums/                          # 交易模块枚举
│   ├── Goods.java                      # 商品实体
│   ├── Order.java                      # 订单实体
│   └── Evaluation.java                 # 评价实体
├── message/                            # 消息模块
│   ├── enums/                          # 消息模块枚举
│   ├── Conversation.java               # 会话实体
│   └── Message.java                    # 消息实体
└── system/                             # 系统模块
    ├── enums/                          # 系统模块枚举
    ├── Shop.java                       # 店铺实体
    ├── Collection.java                 # 收藏实体
    └── UploadFile.java                 # 上传文件实体
```

**职责说明**：

| 文件夹 | 职责 |
|--------|------|
| `entity/` | 存放与数据库表一一对应的实体类 |
| `entity/*/enums/` | 存放该模块特有的枚举类型 |

**实体类规范**：

```java
@Data                                    // Lombok注解
@TableName("table_name")                 // 指定表名
public class EntityName {
    
    @TableId(type = IdType.AUTO)         // 主键自增
    private Long id;
    
    private String field;                // 普通字段
    
    private StatusEnum status;           // 枚举字段
    
    @TableLogic                          // 逻辑删除
    private Integer deleted;
}
```

---

### 5. dto（数据传输对象模块）

存放 DTO（Data Transfer Object），用于前后端数据交互。

```
dto/
├── user/                               # 用户模块DTO
│   ├── request/                        # 请求DTO
│   │   ├── LoginRequest.java           # 登录请求
│   │   ├── RegisterRequest.java        # 注册请求
│   │   └── UpdateUserRequest.java      # 更新用户请求
│   └── response/                       # 响应DTO
│       ├── UserVO.java                 # 用户视图对象
│       └── UserProfileVO.java          # 用户资料视图对象
├── product/                            # 产品库模块DTO
│   ├── request/
│   └── response/
├── trade/                              # 商品交易模块DTO
│   ├── request/
│   └── response/
└── common/                             # 通用DTO
    └── PageRequest.java                # 分页请求
```

**职责说明**：

| 文件夹 | 职责 |
|--------|------|
| `dto/*/request/` | 存放接口请求参数对象 |
| `dto/*/response/` | 存放接口响应数据对象 |

**DTO 与 Entity 的区别**：

| 类型 | 用途 | 说明 |
|------|------|------|
| Entity | 数据库映射 | 与数据库表一一对应 |
| Request DTO | 接收参数 | 只包含接口需要的字段 |
| Response DTO | 返回数据 | 只包含需要返回的字段，可脱敏 |

---

### 6. mapper（数据访问层）

存放 MyBatis-Plus Mapper 接口，负责数据库操作。

```
mapper/
├── user/                               # 用户模块Mapper
│   ├── UserMapper.java                 # 用户Mapper
│   ├── UserProfileMapper.java          # 用户资料Mapper
│   └── UserAddressMapper.java          # 收货地址Mapper
├── product/                            # 产品库模块Mapper
│   ├── CategoryMapper.java             # 分类Mapper
│   ├── BrandMapper.java                # 品牌Mapper
│   └── ...
├── trade/                              # 商品交易模块Mapper
│   ├── GoodsMapper.java                # 商品Mapper
│   ├── OrderMapper.java                # 订单Mapper
│   └── EvaluationMapper.java           # 评价Mapper
├── message/                            # 消息模块Mapper
│   ├── ConversationMapper.java         # 会话Mapper
│   └── MessageMapper.java              # 消息Mapper
└── system/                             # 系统模块Mapper
    ├── ShopMapper.java                 # 店铺Mapper
    ├── CollectionMapper.java           # 收藏Mapper
    └── UploadFileMapper.java           # 上传文件Mapper
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `XxxMapper.java` | 定义数据库操作接口，继承 `BaseMapper<T>` |

**Mapper 规范**：

```java
public interface UserMapper extends BaseMapper<User> {
    // 继承BaseMapper后自动拥有：
    // - selectById(id)
    // - selectList(wrapper)
    // - insert(entity)
    // - updateById(entity)
    // - deleteById(id)
    
    // 自定义方法（复杂查询）
    User selectUserWithProfile(@Param("userId") Long userId);
}
```

---

### 7. service（服务层）

存放业务逻辑代码，是核心业务处理层。

```
service/
├── user/                               # 用户模块Service
│   ├── UserService.java                # 用户服务接口
│   └── impl/
│       └── UserServiceImpl.java        # 用户服务实现
├── product/                            # 产品库模块Service
│   ├── CategoryService.java
│   └── impl/
│       └── CategoryServiceImpl.java
├── trade/                              # 商品交易模块Service
│   ├── GoodsService.java
│   ├── OrderService.java
│   └── impl/
│       ├── GoodsServiceImpl.java
│       └── OrderServiceImpl.java
├── message/                            # 消息模块Service
│   ├── ConversationService.java
│   └── impl/
│       └── ConversationServiceImpl.java
└── system/                             # 系统模块Service
    ├── ShopService.java
    └── impl/
        └── ShopServiceImpl.java
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `XxxService.java` | 定义业务接口 |
| `XxxServiceImpl.java` | 实现业务逻辑，调用Mapper |

**Service 规范**：

```java
// 接口
public interface UserService {
    User getById(Long id);
    User getByPhone(String phone);
    void register(RegisterRequest request);
    String login(LoginRequest request);
}

// 实现
@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public User getById(Long id) {
        return userMapper.selectById(id);
    }
    
    // ... 其他方法实现
}
```

---

### 8. controller（控制器层）

存放 API 接口，负责接收请求和返回响应。

```
controller/
├── user/                               # 用户模块Controller
│   ├── AuthController.java             # 认证接口（登录、注册）
│   ├── UserController.java             # 用户接口
│   └── UserAddressController.java      # 地址接口
├── product/                            # 产品库模块Controller
│   ├── CategoryController.java         # 分类接口
│   ├── BrandController.java            # 品牌接口
│   └── ProductModelController.java     # 产品型号接口
├── trade/                              # 商品交易模块Controller
│   ├── GoodsController.java            # 商品接口
│   ├── OrderController.java            # 订单接口
│   └── EvaluationController.java       # 评价接口
├── message/                            # 消息模块Controller
│   ├── ConversationController.java     # 会话接口
│   └── MessageController.java          # 消息接口
└── system/                             # 系统模块Controller
    ├── ShopController.java             # 店铺接口
    ├── CollectionController.java       # 收藏接口
    └── UploadController.java           # 上传接口
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `XxxController.java` | 定义API接口，接收请求参数，调用Service，返回响应 |

**Controller 规范**：

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
        return Result.success(userService.getUserVO(id));
    }
}
```

---

### 9. utils（工具类模块）

存放通用工具类。

```
utils/
├── JwtUtils.java                       # JWT工具类（如security中已有可省略）
├── RedisUtils.java                     # Redis工具类
├── FileUtils.java                      # 文件工具类
├── DateUtils.java                      # 日期工具类
├── StringUtils.java                    # 字符串工具类
└── ValidationUtils.java                # 参数校验工具类
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `RedisUtils.java` | 封装Redis常用操作 |
| `FileUtils.java` | 文件上传、下载、删除等操作 |
| `DateUtils.java` | 日期格式化、转换等操作 |

---

### 10. resources（资源目录）

存放配置文件和MyBatis XML。

```
resources/
├── application.yml                     # 主配置文件
├── application-dev.yml                 # 开发环境配置
├── application-prod.yml                # 生产环境配置
└── mapper/                             # MyBatis XML文件
    ├── user/
    │   └── UserMapper.xml              # 用户Mapper XML
    ├── product/
    │   └── ProductModelMapper.xml      # 产品型号Mapper XML
    └── ...
```

**职责说明**：

| 文件 | 职责 |
|------|------|
| `application.yml` | 主配置文件，配置数据库、Redis、端口等 |
| `application-dev.yml` | 开发环境专用配置 |
| `application-prod.yml` | 生产环境专用配置 |
| `mapper/*.xml` | 复杂SQL语句（多表关联、复杂查询） |

---

## 🔄 分层架构说明

```
┌─────────────────────────────────────────────────────────────┐
│                      Controller 层                          │
│                    （接收请求、返回响应）                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service 层                            │
│                    （业务逻辑处理）                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Mapper 层                             │
│                    （数据库操作）                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       数据库                                 │
│                      (MySQL)                                │
└─────────────────────────────────────────────────────────────┘
```

**数据流向**：

```
请求 → Controller → Service → Mapper → 数据库
                ↓
              DTO → Entity → 数据库
                ↓
响应 ← Controller ← Service ← Mapper ← 数据库
```

---

## 📋 模块依赖关系

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Controller  │────▶│    Service   │────▶│    Mapper    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     DTO      │     │    Entity    │     │   Database   │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       │
       ▼
┌──────────────┐
│   Request    │
│   Response   │
└──────────────┘
```

---

## 🎯 开发规范

### 1. 命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| Entity | 名词，驼峰 | `User`、`ProductModel` |
| DTO Request | 动作+Request | `LoginRequest`、`CreateOrderRequest` |
| DTO Response | 名词+VO | `UserVO`、`OrderDetailVO` |
| Mapper | Entity+Mapper | `UserMapper` |
| Service | Entity+Service | `UserService` |
| ServiceImpl | Entity+ServiceImpl | `UserServiceImpl` |
| Controller | Entity+Controller | `UserController` |

### 2. 包导入规范

```java
// 推荐顺序
import java.*;                    // Java标准库
import javax.*;                   // Java扩展库
import org.*;                     // 第三方库
import com.baomidou.*;            // MyBatis-Plus
import com.example.xinmall.*;     // 项目内部
```

### 3. 注解使用规范

```java
@RestController                   // Controller类
@RequestMapping("/api/xxx")       // Controller类或方法
@Service                          // Service实现类
@Autowired                        // 依赖注入
@Transactional                    // 事务控制
@Tag / @Operation                 // API文档注解
```

---

## 📊 当前项目进度

| 模块 | Entity | Enum | Mapper | Service | Controller |
|------|--------|------|--------|---------|------------|
| 用户模块 | ✅ | ✅ | ⏳ | ⏳ | ⏳ |
| 产品库模块 | ✅ | ✅ | ⏳ | ⏳ | ⏳ |
| 商品交易模块 | ✅ | ✅ | ⏳ | ⏳ | ⏳ |
| 消息模块 | ✅ | ✅ | ⏳ | ⏳ | ⏳ |
| 系统模块 | ✅ | ✅ | ⏳ | ⏳ | ⏳ |
| 公共模块 | - | - | - | - | - |

---

*文档版本：v1.0*
*最后更新：2026-03-10*
