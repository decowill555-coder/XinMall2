# XinMall 项目开发进度报告

> 文档版本：v1.0  
> 更新时间：2026-03-12  
> 文档状态：已完成

---

## 一、项目概述

XinMall 是一个整合了**闲鱼购物**、**ZOL中关村产品库**、**酷安话题社区**的垂直数码电商平台。

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Spring Boot | 4.0.3 |
| ORM框架 | MyBatis-Plus | 3.3.2 |
| 数据库 | MySQL | 8.x |
| 缓存 | Redis | 8.4.0 |
| 安全框架 | Spring Security | - |
| Token认证 | JWT | 0.12.5 |
| API文档 | Knife4j | 4.5.0 |
| JDK | Java | 21 |

---

## 二、开发进度总览

### 后端模块完成情况

| 模块 | Entity | Enum | DTO | Mapper | Service | Controller | 状态 |
|------|:------:|:----:|:---:|:------:|:-------:|:----------:|:----:|
| 公共模块 | - | ✅ | ✅ | - | - | - | 完成 |
| 用户模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| 产品库模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| 商品交易模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| 消息模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| 系统模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| SPU模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| Community模块 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 完成 |
| Search模块 | - | ✅ | ✅ | - | ✅ | ✅ | 完成 |

### 前端完成情况

| 功能 | 状态 |
|------|:----:|
| 页面结构 | ✅ 完成 |
| UI 组件库 | ✅ 完成 |
| API 接口层 | ✅ 完成 |
| 状态管理 | ✅ 完成 |

---

## 三、已创建文件清单

### 3.1 公共模块 (common)

```
common/
├── constant/
│   ├── Constants.java              # 通用常量
│   └── RedisKey.java               # Redis Key常量
├── enums/
│   └── ResultCode.java             # 响应状态码枚举
├── exception/
│   ├── BusinessException.java      # 业务异常类
│   └── GlobalExceptionHandler.java # 全局异常处理器
├── handler/
│   └── MyMetaObjectHandler.java    # MyBatis自动填充
├── result/
│   ├── Result.java                 # 统一响应封装
│   └── PageResult.java             # 分页响应封装
└── security/
    ├── JwtUtils.java               # JWT工具类
    ├── JwtAuthenticationTokenFilter.java
    ├── handler/
    │   ├── AccessDeniedHandlerImpl.java
    │   └── AuthenticationEntryPointImpl.java
    └── service/
        └── UserDetailsServiceImpl.java
```

### 3.2 配置模块 (config)

```
config/
├── CorsConfig.java                 # 跨域配置
├── Knife4jConfig.java              # API文档配置
├── MybatisPlusConfig.java          # MyBatis-Plus配置
├── RedisConfig.java                # Redis配置
├── SecurityConfig.java             # Spring Security配置
└── WebConfig.java                  # Web配置
```

### 3.3 用户模块 (user)

**DTO 层**
```
dto/user/
├── request/
│   ├── LoginRequest.java           # 登录请求
│   ├── RegisterRequest.java        # 注册请求
│   ├── UpdateUserRequest.java      # 更新用户信息
│   ├── UpdatePasswordRequest.java  # 修改密码
│   ├── AddressRequest.java         # 地址请求
│   └── RealNameRequest.java        # 实名认证请求
└── response/
    ├── UserVO.java                 # 用户视图对象
    ├── UserProfileVO.java          # 用户资料视图
    ├── UserAddressVO.java          # 地址视图
    └── LoginVO.java                # 登录响应
```

**Mapper 层**
```
mapper/user/
├── UserMapper.java
├── UserProfileMapper.java
└── UserAddressMapper.java
```

**Service 层**
```
service/user/
├── UserService.java
└── impl/
    └── UserServiceImpl.java
```

**Controller 层**
```
controller/user/
├── AuthController.java             # 认证接口
├── UserController.java             # 用户接口
└── UserAddressController.java      # 地址接口
```

### 3.4 产品库模块 (product)

**DTO 层**
```
dto/product/
├── request/
│   └── ProductModelQueryRequest.java
└── response/
    ├── CategoryVO.java
    ├── BrandVO.java
    ├── ProductModelVO.java
    └── ProductModelDetailVO.java
```

**Mapper 层**
```
mapper/product/
├── CategoryMapper.java
├── BrandMapper.java
├── BrandCategoryMapper.java
├── AttributeMapper.java
├── AttributeOptionMapper.java
├── CategoryAttributeMapper.java
├── ProductModelMapper.java
└── ProductModelAttributeMapper.java
```

**Service 层**
```
service/product/
├── CategoryService.java
├── BrandService.java
├── ProductModelService.java
└── impl/
    ├── CategoryServiceImpl.java
    ├── BrandServiceImpl.java
    └── ProductModelServiceImpl.java
```

**Controller 层**
```
controller/product/
├── CategoryController.java
├── BrandController.java
└── ProductModelController.java
```

### 3.5 商品交易模块 (trade)

**DTO 层**
```
dto/trade/
├── request/
│   ├── GoodsPublishRequest.java
│   ├── GoodsQueryRequest.java
│   ├── OrderCreateRequest.java
│   ├── ShipRequest.java
│   └── EvaluationRequest.java
└── response/
    ├── GoodsVO.java
    ├── GoodsDetailVO.java
    ├── OrderVO.java
    ├── OrderDetailVO.java
    └── EvaluationVO.java
```

**Mapper 层**
```
mapper/trade/
├── GoodsMapper.java
├── OrderMapper.java
└── EvaluationMapper.java
```

**Service 层**
```
service/trade/
├── GoodsService.java
├── OrderService.java
├── EvaluationService.java
└── impl/
    ├── GoodsServiceImpl.java
    ├── OrderServiceImpl.java
    └── EvaluationServiceImpl.java
```

**Controller 层**
```
controller/trade/
├── GoodsController.java
├── OrderController.java
└── EvaluationController.java
```

### 3.6 消息模块 (message)

**DTO 层**
```
dto/message/
├── request/
│   └── SendMessageRequest.java
└── response/
    ├── ConversationVO.java
    └── MessageVO.java
```

**Mapper 层**
```
mapper/message/
├── ConversationMapper.java
└── MessageMapper.java
```

**Service 层**
```
service/message/
├── ConversationService.java
├── MessageService.java
└── impl/
    ├── ConversationServiceImpl.java
    └── MessageServiceImpl.java
```

**Controller 层**
```
controller/message/
├── ConversationController.java
└── MessageController.java
```

### 3.7 系统模块 (system)

**DTO 层**
```
dto/system/
├── request/
│   ├── ShopCreateRequest.java
│   └── CollectionRequest.java
└── response/
    ├── ShopVO.java
    └── UploadFileVO.java
```

**Mapper 层**
```
mapper/system/
├── ShopMapper.java
├── CollectionMapper.java
└── UploadFileMapper.java
```

**Service 层**
```
service/system/
├── ShopService.java
├── CollectionService.java
├── UploadService.java
└── impl/
    ├── ShopServiceImpl.java
    ├── CollectionServiceImpl.java
    └── UploadServiceImpl.java
```

**Controller 层**
```
controller/system/
├── ShopController.java
├── CollectionController.java
└── UploadController.java
```

### 3.8 SPU 模块 (spu)

**Entity 层**
```
entity/spu/
├── enums/
│   └── SpuStatus.java              # SPU状态枚举
├── Spu.java                        # SPU实体
├── SpuFollow.java                  # SPU关注实体
└── SpuPriceTrend.java              # SPU价格趋势实体
```

**DTO 层**
```
dto/spu/
├── request/
│   └── SpuQueryRequest.java        # SPU查询请求
└── response/
    ├── SpuVO.java                  # SPU视图对象
    ├── SpuDetailVO.java            # SPU详情视图
    ├── SpuProductVO.java           # SPU关联商品
    ├── SpuPostVO.java              # SPU关联帖子
    └── SpuEvaluationVO.java        # SPU关联评价
```

**Mapper 层**
```
mapper/spu/
├── SpuMapper.java
├── SpuFollowMapper.java
└── SpuPriceTrendMapper.java
```

**Service 层**
```
service/spu/
├── SpuService.java
└── impl/
    └── SpuServiceImpl.java
```

**Controller 层**
```
controller/spu/
└── SpuController.java
```

### 3.9 Community 模块 (community)

**Entity 层**
```
entity/community/
├── enums/
│   ├── CommunityMemberRole.java    # 成员角色枚举
│   ├── PostStatus.java             # 帖子状态枚举
│   └── PostType.java               # 帖子类型枚举
├── Community.java                  # 社区实体
├── CommunityMember.java            # 社区成员实体
├── Post.java                       # 帖子实体
├── Comment.java                    # 评论实体
├── PostLike.java                   # 帖子点赞实体
└── CommentLike.java                # 评论点赞实体
```

**DTO 层**
```
dto/community/
├── request/
│   ├── PostQueryRequest.java       # 帖子查询请求
│   ├── CreatePostRequest.java      # 创建帖子请求
│   └── CreateCommentRequest.java   # 创建评论请求
└── response/
    ├── CommunityVO.java            # 社区视图对象
    ├── CommunityDetailVO.java      # 社区详情视图
    ├── PostVO.java                 # 帖子视图对象
    ├── PostDetailVO.java           # 帖子详情视图
    └── CommentVO.java              # 评论视图对象
```

**Mapper 层**
```
mapper/community/
├── CommunityMapper.java
├── CommunityMemberMapper.java
├── PostMapper.java
├── CommentMapper.java
├── PostLikeMapper.java
└── CommentLikeMapper.java
```

**Service 层**
```
service/community/
├── CommunityService.java
├── PostService.java
├── CommentService.java
└── impl/
    ├── CommunityServiceImpl.java
    ├── PostServiceImpl.java
    └── CommentServiceImpl.java
```

**Controller 层**
```
controller/community/
├── CommunityController.java
├── PostController.java
└── CommentController.java
```

### 3.10 Search 模块 (search)

**DTO 层**
```
dto/search/
├── request/
│   └── SearchRequest.java          # 搜索请求
└── response/
    ├── SearchResultVO.java         # 搜索结果视图
    ├── HotSearchVO.java            # 热门搜索视图
    ├── SearchSuggestionVO.java     # 搜索建议视图
    └── SearchItemVO.java           # 搜索项视图
```

**Service 层**
```
service/search/
├── SearchService.java
└── impl/
    └── SearchServiceImpl.java
```

**Controller 层**
```
controller/search/
└── SearchController.java
```

---

## 四、API 接口清单

### 4.1 用户模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户注册 | POST | /api/auth/register | 手机号+密码注册 |
| 用户登录 | POST | /api/auth/login | 返回JWT Token |
| 获取用户信息 | GET | /api/user/info | 获取当前用户 |
| 更新用户信息 | PUT | /api/user/info | 更新昵称、头像等 |
| 修改密码 | PUT | /api/user/password | 修改登录密码 |
| 获取用户资料 | GET | /api/user/profile | 获取实名认证状态 |
| 申请实名认证 | POST | /api/user/real-name | 提交实名认证 |
| 地址列表 | GET | /api/user/address | 获取收货地址列表 |
| 添加地址 | POST | /api/user/address | 添加收货地址 |
| 更新地址 | PUT | /api/user/address/{id} | 更新收货地址 |
| 删除地址 | DELETE | /api/user/address/{id} | 删除收货地址 |
| 设为默认 | PUT | /api/user/address/{id}/default | 设为默认地址 |

### 4.2 产品库模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 分类树 | GET | /api/category/tree | 获取完整分类树 |
| 子分类 | GET | /api/category/children | 获取指定分类的子分类 |
| 品牌列表 | GET | /api/brand/list | 按分类获取品牌 |
| 品牌详情 | GET | /api/brand/{id} | 获取品牌详情 |
| 搜索品牌 | GET | /api/brand/search | 按名称搜索品牌 |
| 产品搜索 | GET | /api/product/search | 搜索产品型号 |
| 产品详情 | GET | /api/product/{id} | 获取产品详情及参数 |

### 4.3 商品交易模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 发布商品 | POST | /api/goods | 发布二手商品 |
| 商品列表 | GET | /api/goods | 商品搜索/筛选 |
| 商品详情 | GET | /api/goods/{id} | 商品详情 |
| 更新商品 | PUT | /api/goods/{id} | 更新商品信息 |
| 下架商品 | PUT | /api/goods/{id}/off | 下架商品 |
| 上架商品 | PUT | /api/goods/{id}/on | 重新上架 |
| 我的发布 | GET | /api/goods/my | 我发布的商品 |
| 创建订单 | POST | /api/order | 创建购买订单 |
| 订单列表 | GET | /api/order | 我的订单列表 |
| 卖家订单 | GET | /api/order/seller | 卖家订单列表 |
| 订单详情 | GET | /api/order/{id} | 订单详情 |
| 取消订单 | PUT | /api/order/{id}/cancel | 取消订单 |
| 发货 | PUT | /api/order/{id}/ship | 卖家发货 |
| 确认收货 | PUT | /api/order/{id}/receive | 买家确认收货 |
| 提交评价 | POST | /api/evaluation | 提交订单评价 |
| 商品评价 | GET | /api/evaluation/goods/{goodsId} | 商品评价列表 |
| 回复评价 | POST | /api/evaluation/{id}/reply | 卖家回复评价 |

### 4.4 消息模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 会话列表 | GET | /api/conversation | 获取会话列表 |
| 创建会话 | POST | /api/conversation/create | 获取或创建会话 |
| 置顶会话 | PUT | /api/conversation/{id}/pin | 置顶会话 |
| 取消置顶 | PUT | /api/conversation/{id}/unpin | 取消置顶 |
| 消息免打扰 | PUT | /api/conversation/{id}/mute | 开启免打扰 |
| 取消免打扰 | PUT | /api/conversation/{id}/unmute | 关闭免打扰 |
| 删除会话 | DELETE | /api/conversation/{id} | 删除会话 |
| 清空未读 | PUT | /api/conversation/{id}/clear-unread | 清空未读数 |
| 消息列表 | GET | /api/message | 获取聊天记录 |
| 发送消息 | POST | /api/message | 发送消息 |
| 标记已读 | PUT | /api/message/{id}/read | 标记消息已读 |
| 全部已读 | PUT | /api/message/read-all | 全部标记已读 |

### 4.5 系统模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建店铺 | POST | /api/shop | 创建个人店铺 |
| 我的店铺 | GET | /api/shop/my | 获取我的店铺 |
| 店铺详情 | GET | /api/shop/{id} | 获取店铺信息 |
| 更新店铺 | PUT | /api/shop/{id} | 更新店铺信息 |
| 关闭店铺 | PUT | /api/shop/{id}/close | 关闭店铺 |
| 重新开店 | PUT | /api/shop/{id}/reopen | 重新开店 |
| 店铺列表 | GET | /api/shop/list | 店铺列表 |
| 添加收藏 | POST | /api/collection | 收藏商品/店铺 |
| 取消收藏 | DELETE | /api/collection | 取消收藏 |
| 是否收藏 | GET | /api/collection/check | 检查收藏状态 |
| 我的收藏 | GET | /api/collection/my | 收藏列表 |
| 收藏数量 | GET | /api/collection/count | 收藏计数 |
| 上传文件 | POST | /api/upload | 上传图片/文件 |
| 删除文件 | DELETE | /api/upload/{id} | 删除文件 |
| 文件信息 | GET | /api/upload/{id} | 获取文件信息 |

### 4.6 SPU 模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| SPU列表 | GET | /api/spu | 获取SPU列表 |
| SPU详情 | GET | /api/spu/{id} | 获取SPU详情 |
| 关注SPU | POST | /api/spu/{id}/follow | 关注SPU |
| 取消关注 | DELETE | /api/spu/{id}/follow | 取消关注 |
| SPU商品 | GET | /api/spu/{id}/products | 获取关联商品 |
| SPU帖子 | GET | /api/spu/{id}/posts | 获取关联帖子 |
| SPU评价 | GET | /api/spu/{id}/evaluations | 获取关联评价 |
| 已关注SPU | GET | /api/spu/followed | 获取已关注的SPU |
| 价格趋势 | GET | /api/spu/{id}/price-trend | 获取价格趋势 |

### 4.7 Community 模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 社区列表 | GET | /api/community | 获取社区列表 |
| 社区详情 | GET | /api/community/{id} | 获取社区详情 |
| 加入社区 | POST | /api/community/{id}/join | 加入社区 |
| 退出社区 | DELETE | /api/community/{id}/join | 退出社区 |
| 社区成员 | GET | /api/community/{id}/members | 获取社区成员 |
| 已加入社区 | GET | /api/community/joined | 获取已加入的社区 |
| 帖子列表 | GET | /api/post | 获取帖子列表 |
| 发布帖子 | POST | /api/post | 发布帖子 |
| 帖子详情 | GET | /api/post/{id} | 获取帖子详情 |
| 删除帖子 | DELETE | /api/post/{id} | 删除帖子 |
| 点赞帖子 | POST | /api/post/{id}/like | 点赞帖子 |
| 取消点赞 | DELETE | /api/post/{id}/like | 取消点赞 |
| 评论列表 | GET | /api/comment | 获取评论列表 |
| 发表评论 | POST | /api/comment | 发表评论 |
| 删除评论 | DELETE | /api/comment/{id} | 删除评论 |
| 点赞评论 | POST | /api/comment/{id}/like | 点赞评论 |
| 取消点赞 | DELETE | /api/comment/{id}/like | 取消点赞 |

### 4.8 Search 模块 API

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 综合搜索 | GET | /api/search | 综合搜索 |
| 搜索建议 | GET | /api/search/suggestions | 搜索建议 |
| 热门搜索 | GET | /api/search/hot | 热门搜索词 |
| 热门型号 | GET | /api/search/hot-models | 热门型号 |
| 搜索商品 | GET | /api/search/products | 搜索商品 |
| 搜索型号 | GET | /api/search/models | 搜索型号 |
| 搜索社区 | GET | /api/search/communities | 搜索社区 |

---

## 五、数据库设计

### 表结构概览

| 模块 | 表数量 | 主要表 |
|------|--------|--------|
| 用户 | 3张 | user, user_profile, user_address |
| 产品库 | 8张 | category, brand, product_model, attribute... |
| 商品 | 3张 | goods, order, evaluation |
| 消息 | 2张 | conversation, message |
| 系统 | 3张 | shop, collection, upload_file |
| SPU | 3张 | spu, spu_follow, spu_price_trend |
| Community | 6张 | community, community_member, post, comment, post_like, comment_like |
| **总计** | **29张** | |

详细设计请参考：[database-design.md](./database-design.md)

---

## 六、后续工作建议

### 6.1 待完成事项

| 优先级 | 任务 | 说明 |
|--------|------|------|
| 高 | 创建数据库表 | 根据设计文档创建MySQL表 |
| 高 | 配置application.yml | 数据库连接、Redis、文件上传路径 |
| 高 | 初始化测试数据 | 分类、品牌、产品型号基础数据 |
| 中 | 单元测试 | 核心业务逻辑测试 |
| 中 | 接口联调 | 前后端接口联调 |
| 低 | 支付集成 | 第三方支付接口 |
| 低 | IM即时通讯 | WebSocket实时消息 |

### 6.2 启动步骤

1. **创建数据库**
```sql
CREATE DATABASE xinmall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **配置 application.yml**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/xinmall
    username: root
    password: your_password
```

3. **启动 Redis**
```bash
redis-server
```

4. **启动项目**
```bash
cd XinMall2/BE/XinMall
mvn spring-boot:run
```

5. **访问 API 文档**
```
http://localhost:8080/doc.html
```

---

## 七、文件统计

| 类型 | 数量 |
|------|------|
| Entity 实体类 | 29 |
| Enum 枚举类 | 21 |
| DTO 类 | 40+ |
| Mapper 接口 | 22 |
| Service 接口 | 17 |
| Service 实现 | 17 |
| Controller | 20 |
| 配置类 | 6 |
| **Java 文件总计** | **170+** |

---

*文档版本：v2.0*  
*创建时间：2026-03-12*  
*最后更新：2026-03-14*
