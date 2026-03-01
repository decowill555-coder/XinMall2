# XinMall 前端项目

> 数码产品垂直电商平台 - 基于 Vue 3 + TypeScript + uni-app 的企业级前端解决方案

## 项目简介

XinMall 是一个面向数码产品交易的垂直电商平台（C2B2C 模式），类似于"闲鱼"但更专业、更标准化。项目采用 **原子化设计 (Atomic Design)** 理念，完全不依赖第三方 UI 组件库，所有组件自研，保证极致性能和完全可控的交互体验。

### 核心特性

- 🎨 **自研设计系统** - Glassmorphism 毛玻璃风格，Design Tokens 驱动
- 📦 **原子化组件库** - Atoms / Molecules / Organisms 三层架构
- 🚀 **跨端发布** - 一套代码，支持 H5 / 微信小程序 / App
- 🔐 **完整权限系统** - RBAC 角色权限模型
- 📡 **状态管理** - Pinia + 本地持久化
- 🌙 **主题切换** - 明暗模式 + 5 种主题色

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 | ^3.3.0 |
| 构建 | Vite | ^5.2.8 |
| 状态管理 | Pinia | ^2.3.1 |
| 类型 | TypeScript | ^5.0.2 |
| 样式 | SCSS | ^1.62.1 |
| 跨端 | uni-app | ^3.0.0 |
| 工具库 | dayjs | ^1.11.10 |
| 数学计算 | decimal.js | ^10.4.3 |
| 国际化 | vue-i18n | ^9.2.2 |

## 项目结构

```
src/
├── api/                 # API 接口层
├── design/              # 设计系统 (Tokens + Mixins)
├── pages/               # 主包页面
├── stores/              # Pinia 状态管理
├── ui-kit/              # 自研组件库
│   ├── atoms/          # 原子组件
│   ├── molecules/      # 分子组件
│   └── organisms/      # 组织组件
├── utils/               # 工具库
├── App.vue
└── main.ts
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式 - H5
npm run dev:h5

# 开发模式 - 微信小程序
npm run dev:mp-weixin

# 构建 - H5
npm run build:h5

# 构建 - 微信小程序
npm run build:mp-weixin
```

## 文档目录

| 文档 | 说明 |
|------|------|
| [SETUP.md](./SETUP.md) | 环境搭建指南 |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 项目结构详解 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | 设计系统文档 |
| [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) | 组件库文档 |
| [API_REFERENCE.md](./API_REFERENCE.md) | API 接口文档 |
| [BUSINESS_DOMAIN.md](./BUSINESS_DOMAIN.md) | 业务模型文档 |

## 核心功能模块

### 买家端
- 商品浏览与搜索
- 商品详情与规格选择
- 购物车管理
- 订单流程
- IM 聊天
- 收藏与关注

### 卖家端
- 商品发布
- 商品管理
- 订单管理
- 数据看板

### 通用功能
- 用户认证
- 消息通知
- 地址管理
- 优惠券
- 主题切换

## 开发规范

### 命名规范
- 组件：PascalCase (如 `UiButton.vue`)
- 文件：kebab-case (如 `product-detail.ts`)
- 变量：camelCase
- 常量：UPPER_SNAKE_CASE
- CSS 类：kebab-case (如 `.ui-btn--primary`)

### 目录规范
- `atoms/` - 原子组件，不包含业务逻辑
- `molecules/` - 分子组件，可组合原子组件
- `organisms/` - 组织组件，包含业务逻辑
- `stores/` - 状态管理，按业务领域划分
- `api/` - API 接口，与后端一一对应

### Git 提交规范
```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | >= 80 |
| Safari | >= 13 |
| Firefox | >= 75 |
| 微信内置浏览器 | 最新版 |

## 许可证

MIT License

## 联系方式

- 项目地址：[XinMall](https://github.com/xinmall)
- 问题反馈：[Issues](https://github.com/xinmall/issues)
