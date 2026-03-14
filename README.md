# XinMall（威星）

> 一站式数码生活服务平台 —— 从产品了解到交易购买的全链路解决方案

---

## 🌟 项目亮点

```
┌─────────────────────────────────────────────────────────────┐
│                    🚀 技术亮点                               │
├─────────────────────────────────────────────────────────────┤
│  ⚡ 最新技术栈    Spring Boot 4.0.3 + Java 21 LTS          │
│  📦 完整功能链    用户→商品→订单→消息→店铺                  │
│  💬 即时通讯      WebSocket 实时消息推送                    │
│  🔥 高性能缓存    Redis 多级缓存策略                        │
│  🔐 安全可靠      JWT + Spring Security                     │
│  📖 API 文档      Knife4j 在线调试                          │
│  ✅ 测试覆盖      单元测试覆盖核心业务                      │
└─────────────────────────────────────────────────────────────┘
```

| 优势 | 说明 |
|------|------|
| **技术先进** | Spring Boot 4.0.3 + Java 21 最新 LTS 版本 |
| **架构完善** | 分层架构、统一响应、全局异常处理、缓存策略 |
| **功能完整** | 用户、商品、订单、消息、店铺全链路功能 |
| **即时通讯** | WebSocket 实时消息推送，在线状态管理 |
| **性能优化** | Redis 多级缓存，热点数据缓存策略 |
| **代码质量** | 单元测试覆盖核心业务，Mock 测试隔离 |
| **API 文档** | Knife4j 自动生成，在线调试支持 |
| **安全可靠** | JWT 认证、Spring Security 权限控制 |

---

## 📖 项目简介

XinMall 是一个整合 **酷安 + 闲鱼 + ZOL中关村在线** 核心功能的垂直数码服务平台，为用户提供从产品了解、社区讨论到交易购买的完整体验。

### 核心定位

| 平台 | 整合功能 | XinMall 对应模块 |
|------|----------|------------------|
| **酷安** | 数码社区、测评、攻略、讨论 | 论坛系统、帖子、话题 |
| **闲鱼** | C2C二手交易、个人开店 | 商品发布、店铺管理、订单交易 |
| **ZOL中关村在线** | 产品参数库、型号查询、价格对比 | 产品库、型号搜索、分类索引 |

### 目标用户

- 🎯 **数码爱好者**：寻找测评、分享经验、参与讨论
- 💰 **二手交易用户**：买卖二手数码产品
- 🔍 **选购咨询用户**：查询参数、对比价格、获取购买建议

---

## 🛠️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **uni-app** | 3.x | 跨平台框架（H5/小程序/App） |
| **Vue** | 3.3+ | 渐进式 JavaScript 框架 |
| **TypeScript** | 5.0+ | 类型安全 |
| **Pinia** | 2.3+ | 状态管理 |
| **Sass** | 1.62+ | CSS 预处理器 |
| **Vite** | 5.2+ | 构建工具 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Spring Boot** | 4.0.3 | 最新版本 Java 后端框架 |
| **Java** | 21 | LTS 长期支持版本 |
| **MyBatis-Plus** | 3.5.15 | ORM 框架，简化数据库操作 |
| **Spring Security** | - | 安全框架 |
| **JWT** | 0.12.5 | Token 认证 |
| **Redis** | 8.4.0 | 缓存中间件 |
| **WebSocket** | - | 即时通讯 |
| **Knife4j** | 4.5.0 | API 文档生成 |
| **MySQL** | 8.x | 关系型数据库 |

---

## 📁 项目结构

```
XinMall2/
├── FE/                              # 前端项目
│   ├── src/
│   │   ├── api/                     # API 接口层
│   │   ├── composables/             # 组合式函数
│   │   ├── design/                  # 设计系统（主题、令牌）
│   │   ├── pages/                   # 主包页面（TabBar）
│   │   ├── pages-sub/               # 分包页面
│   │   │   ├── auth/                # 认证授权
│   │   │   ├── content/             # 内容社区（论坛、帖子）
│   │   │   ├── seller/              # 卖家模块（店铺、商品）
│   │   │   ├── trade/               # 交易模块（购物车、订单）
│   │   │   └── user/                # 用户中心
│   │   ├── stores/                  # Pinia 状态管理
│   │   ├── ui-kit/                  # UI 组件库
│   │   │   ├── atoms/               # 原子组件
│   │   │   ├── molecules/           # 分子组件
│   │   │   └── organisms/           # 有机组件
│   │   └── utils/                   # 工具函数
│   └── package.json
│
└── BE/                              # 后端项目
    └── XinMall/
        ├── src/main/java/
        │   ├── common/              # 公共模块
        │   │   ├── cache/           # 缓存服务
        │   │   ├── constant/        # 常量定义
        │   │   ├── enums/           # 枚举类
        │   │   ├── exception/       # 异常处理
        │   │   ├── result/          # 统一响应
        │   │   └── security/        # 安全模块
        │   ├── config/              # 配置类
        │   ├── controller/          # 控制器层
        │   ├── dto/                 # 数据传输对象
        │   ├── entity/              # 实体类
        │   ├── mapper/              # 数据访问层
        │   ├── service/             # 业务逻辑层
        │   └── websocket/           # WebSocket 模块
        └── docs/
            └── sql/                 # 数据库脚本
                ├── init.sql         # 初始化脚本（22张表）
                └── test-data.sql    # 测试数据
```

---

## ✨ 功能特性

### ✅ 已完成功能

#### 用户系统
- 用户注册/登录（JWT Token 认证）
- 用户中心（个人信息/头像/密码修改）
- 收货地址管理（增删改查/默认地址）
- 实名认证（预留接口）

#### 产品库系统
- 分类树查询（多级分类）
- 品牌列表（按分类筛选）
- 产品型号搜索（关键词/分类/品牌/价格区间）
- 产品详情（参数规格展示）

#### 商品交易系统
- 商品发布（关联型号/成色描述/图片上传）
- 商品搜索（关键词/分类/价格/成色筛选）
- 商品上下架管理
- 订单创建（购买流程）
- 订单状态流转（待付款→待发货→待收货→已完成）
- 订单取消/退款

#### 即时通讯系统
- WebSocket 实时消息推送
- 在线状态管理
- 会话管理（创建/置顶/免打扰）
- 消息已读/未读状态

#### 店铺系统
- 店铺创建/编辑
- 店铺信息展示
- 店铺数据统计（商品数/销量/粉丝数）

#### 其他功能
- 收藏功能（商品/店铺收藏）
- 文件上传（图片/视频）
- 搜索历史记录
- 热搜榜

### ⏳ 预留接口

| 功能 | 状态 | 说明 |
|------|:----:|------|
| 支付集成 | 接口预留 | 支付宝/微信支付接口已预留 |
| Elasticsearch | 可扩展 | 全文搜索可按需引入 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Java 21+
- MySQL 8.0+
- Redis 8.x
- Maven 3.6+

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/XinMall.git
cd XinMall
```

### 2. 数据库初始化

```sql
-- 创建数据库
CREATE DATABASE xinmall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
# 执行初始化脚本
mysql -u root -p xinmall < BE/XinMall/docs/sql/init.sql
mysql -u root -p xinmall < BE/XinMall/docs/sql/test-data.sql
```

### 3. 启动后端

```bash
cd BE/XinMall

# 编译
mvn clean install

# 启动
mvn spring-boot:run
```

### 4. 启动前端

```bash
cd FE

# 安装依赖
npm install

# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin
```

### 5. 访问服务

| 服务 | 地址 |
|------|------|
| 后端 API | http://localhost:8080 |
| API 文档 | http://localhost:8080/doc.html |
| 前端 H5 | http://localhost:5173 |

---

## 📊 数据库设计

共 **22 张表**，按模块划分：

| 模块 | 表数量 | 主要表 |
|------|:------:|--------|
| 用户模块 | 3 | user, user_profile, user_address |
| 产品库模块 | 8 | category, brand, product_model, attribute... |
| 商品交易模块 | 3 | goods, order, evaluation |
| 消息模块 | 2 | conversation, message |
| 系统模块 | 4 | shop, collection, upload_file, search_history |

---

## 🧪 测试覆盖

单元测试覆盖核心业务逻辑：

| 测试类 | 测试用例数 | 覆盖范围 |
|--------|:----------:|----------|
| UserServiceTest | 8 | 注册/登录/密码修改 |
| GoodsServiceTest | 8 | 发布/上下架/搜索 |
| OrderServiceTest | 13 | 创建/取消/发货/收货/退款 |

运行测试：

```bash
cd BE/XinMall
mvn test
```

---

## 📖 API 文档

启动后端后访问 Knife4j 文档：http://localhost:8080/doc.html

### 公开接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/auth/register | POST | 用户注册 |
| /api/auth/login | POST | 用户登录 |
| /api/category/tree | GET | 分类树 |
| /api/brand/list | GET | 品牌列表 |
| /api/product/search | GET | 产品搜索 |

### 认证接口

需要在 Header 中携带 `Authorization: Bearer {token}`

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/user/info | GET | 用户信息 |
| /api/goods | POST | 发布商品 |
| /api/order | POST | 创建订单 |
| /api/message | POST | 发送消息 |

---

## 🗺️ 路线图

### ✅ 已完成（v1.0）

- [x] 项目基础架构（Spring Boot 4 + Java 21）
- [x] 用户认证系统（JWT + Spring Security）
- [x] 产品库系统（分类/品牌/型号）
- [x] 商品交易系统（发布/搜索/订单）
- [x] 即时通讯系统（WebSocket）
- [x] 店铺管理系统
- [x] 缓存系统（Redis）
- [x] 单元测试覆盖

### 🚀 规划中

- [ ] 支付系统集成（接口已预留）
- [ ] 后台管理系统
- [ ] Elasticsearch 全文搜索（可选）
- [ ] 推荐算法

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

MIT License

---

<p align="center">
  <b>XinMall</b> —— 让数码生活更简单
</p>
