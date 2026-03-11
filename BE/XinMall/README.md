# XinMall 后端服务

> XinMall - 垂直数码电商平台后端服务

---

## 项目简介

XinMall 是一个整合了**闲鱼购物**、**ZOL中关村产品库**、**酷安话题社区**的垂直数码电商平台。

### 核心功能

| 功能模块 | 说明 |
|----------|------|
| 用户系统 | 注册登录、实名认证、收货地址管理 |
| 产品库 | 多级分类、动态参数、品牌型号管理 |
| 商品交易 | 二手商品发布、订单管理、评价系统 |
| 消息系统 | 用户即时通讯、会话管理 |
| 店铺系统 | 卖家店铺、商品管理、数据统计 |

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 21 | JDK 版本 |
| Spring Boot | 4.0.3 | 核心框架 |
| MyBatis-Plus | 3.3.2 | ORM 框架 |
| MySQL | 8.x | 数据库 |
| Redis | 8.4.0 | 缓存 |
| Spring Security | - | 安全框架 |
| JWT | 0.12.5 | Token 认证 |
| Knife4j | 4.5.0 | API 文档 |
| Hutool | 5.8.26 | 工具库 |

---

## 项目结构

```
XinMall/
├── docs/                           # 文档目录
│   └── database-design.md          # 数据库设计文档
├── src/
│   ├── main/
│   │   ├── java/com/example/xinmall/
│   │   │   ├── common/             # 公共模块
│   │   │   │   ├── config/         # 配置类
│   │   │   │   ├── exception/      # 异常处理
│   │   │   │   ├── result/         # 统一响应
│   │   │   │   └── constant/       # 常量定义
│   │   │   ├── security/           # 安全模块
│   │   │   ├── entity/             # 实体类
│   │   │   ├── dto/                # 数据传输对象
│   │   │   ├── mapper/             # Mapper 接口
│   │   │   ├── service/            # 服务层
│   │   │   └── controller/         # 控制器
│   │   └── resources/
│   │       ├── application.yml     # 配置文件
│   │       └── mapper/             # MyBatis XML
│   └── test/                       # 测试目录
├── pom.xml                         # Maven 配置
└── README.md                       # 项目说明
```

---

## 快速开始

### 环境要求

- JDK 21+
- Maven 3.8+
- MySQL 8.0+
- Redis 8.0+

### 本地运行

1. **克隆项目**

```bash
git clone https://github.com/your-repo/XinMall.git
cd XinMall/XinMall2/BE/XinMall
```

2. **配置数据库**

修改 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/xinmall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

3. **初始化数据库**

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE xinmall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入表结构（待补充）
# mysql -u root -p xinmall < docs/init.sql
```

4. **启动 Redis**

```bash
# Windows
cd Redis-8.4.0-Windows-x64-msys2
./redis-server.exe

# Linux/Mac
redis-server
```

5. **启动项目**

```bash
# Maven 方式
./mvnw spring-boot:run

# 或使用 IDE 运行 XinMallApplication.java
```

6. **访问 API 文档**

启动成功后访问：http://localhost:8080/doc.html

---

## API 文档

启动项目后，访问 Knife4j 接口文档：

- 地址：http://localhost:8080/doc.html
- 说明：包含所有接口的详细说明和在线测试功能

---

## 数据库设计

详细的数据库设计请参考：[database-design.md](./docs/database-design.md)

### 表结构概览

| 模块 | 表数量 | 主要表 |
|------|--------|--------|
| 用户 | 3张 | user, user_profile, user_address |
| 产品库 | 8张 | category, brand, product_model, attribute... |
| 商品 | 3张 | goods, order, evaluation |
| 消息 | 2张 | conversation, message |
| 系统 | 3张 | shop, collection, upload_file |
| **总计** | **20张** | |

---

## 开发规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | 大驼峰 | `UserService` |
| 方法名 | 小驼峰 | `getUserById` |
| 常量 | 全大写下划线 | `MAX_SIZE` |
| 包名 | 全小写 | `com.example.xinmall` |

### 状态码规范

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### Git 提交规范

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 Bug |
| docs | 文档更新 |
| style | 代码格式 |
| refactor | 重构 |
| test | 测试相关 |
| chore | 构建/工具相关 |

---

## 常见问题

### Q1: 启动报错 "Unknown database 'xinmall'"

**解决**：请先创建数据库

```sql
CREATE DATABASE xinmall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Q2: 启动报错 "Unable to connect to Redis"

**解决**：请确保 Redis 已启动

```bash
# 检查 Redis 是否运行
redis-cli ping
# 应返回 PONG
```

### Q3: API 文档页面空白

**解决**：检查是否正确配置了 Knife4j，确保 Spring Security 放行了 `/doc.html` 和 `/swagger-resources/**`

---

## 相关链接

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [Knife4j 官方文档](https://doc.xiaominfo.com/)

---

## 许可证

MIT License

---

*最后更新：2026-03-10*
