# 项目结构详解

本文档详细说明 XinMall 前端项目的目录结构和文件组织方式。

## 完整目录结构

```
XinMall2/FE/
├── .hbuilderx/                    # HBuilderX 配置目录
│   └── launch.json               # 启动配置
├── .vscode/                       # VS Code 配置目录
│   ├── extensions.json           # 推荐插件
│   └── settings.json             # 编辑器配置
├── document/                      # 项目文档目录
│   ├── README.md                 # 项目总览
│   ├── SETUP.md                  # 环境搭建
│   ├── PROJECT_STRUCTURE.md      # 项目结构（本文档）
│   ├── DESIGN_SYSTEM.md          # 设计系统
│   ├── COMPONENT_LIBRARY.md      # 组件库文档
│   ├── API_REFERENCE.md          # API 文档
│   └── BUSINESS_DOMAIN.md        # 业务模型
├── src/                           # 源代码目录
│   ├── api/                      # API 接口层
│   │   ├── auth.ts              # 认证接口
│   │   ├── spu.ts               # 商品接口
│   │   ├── trade.ts             # 交易接口
│   │   ├── upload.ts            # 上传接口
│   │   └── index.ts             # 统一导出
│   ├── design/                   # 设计系统
│   │   ├── _tokens.scss         # Design Tokens
│   │   ├── _mixins.scss         # SCSS Mixins
│   │   └── index.scss           # 全局样式入口
│   ├── pages/                    # 主包页面
│   │   └── index/
│   │       └── index.vue        # 首页
│   ├── stores/                   # Pinia 状态管理
│   │   ├── user.ts              # 用户状态
│   │   ├── cart.ts              # 购物车状态
│   │   ├── product-detail.ts    # 商品详情状态
│   │   ├── order.ts             # 订单状态
│   │   ├── publish.ts           # 发布流程状态
│   │   ├── chat.ts              # 聊天状态
│   │   ├── search-history.ts    # 搜索历史状态
│   │   ├── app.ts               # 全局 UI 状态
│   │   ├── collection.ts        # 收藏状态
│   │   ├── session.ts           # 会话状态
│   │   ├── auth.ts              # 权限状态
│   │   ├── theme.ts             # 主题状态
│   │   └── index.ts             # 统一导出
│   ├── ui-kit/                   # 自研组件库
│   │   ├── atoms/               # 原子组件 (Atoms)
│   │   │   ├── UiAvatar.vue
│   │   │   ├── UiBadge.vue
│   │   │   ├── UiButton.vue
│   │   │   ├── UiDivider.vue
│   │   │   ├── UiIcon.vue
│   │   │   ├── UiImage.vue
│   │   │   ├── UiPrice.vue
│   │   │   ├── UiSkeleton.vue
│   │   │   ├── UiTag.vue
│   │   │   └── UiText.vue
│   │   ├── molecules/           # 分子组件 (Molecules)
│   │   │   ├── UiCell.vue
│   │   │   ├── UiCheckbox.vue
│   │   │   ├── UiInput.vue
│   │   │   ├── UiNavbar.vue
│   │   │   ├── UiRate.vue
│   │   │   ├── UiSearch.vue
│   │   │   ├── UiStepper.vue
│   │   │   ├── UiSwitch.vue
│   │   │   ├── UiTabs.vue
│   │   │   └── UiUpload.vue
│   │   └── organisms/           # 组织组件 (Organisms)
│   │       ├── UiActionSheet.vue
│   │       ├── UiCard.vue
│   │       ├── UiDialog.vue
│   │       ├── UiGoodsCard.vue
│   │       ├── UiModal.vue
│   │       ├── UiPopup.vue
│   │       ├── UiToast.vue
│   │       └── UiWaterfalls.vue
│   ├── utils/                    # 工具库
│   │   ├── currency.ts          # 货币格式化
│   │   ├── date.ts              # 日期处理
│   │   ├── http.ts              # HTTP 请求封装
│   │   └── validate.ts          # 表单验证
│   ├── App.vue                   # 应用根组件
│   └── main.ts                   # 应用入口
├── static/                        # 运行时静态资源
│   └── logo.png
├── types/                         # TypeScript 类型定义
│   ├── tabbar.d.ts
│   └── ui.d.ts
├── unpackage/                     # 编译输出目录
│   └── dist/
├── index.html                     # H5 入口文件
├── manifest.json                  # uni-app 应用配置
├── pages.json                     # 页面路由配置
├── package.json                   # 项目依赖配置
├── tsconfig.json                  # TypeScript 配置
├── vite.config.ts                 # Vite 构建配置
├── uni.promisify.adaptor.js       # uni-app Promise 适配器
└── uni.scss                       # uni-app 全局样式变量
```

## 核心目录详解

### 1. src/api/ - API 接口层

负责与后端 API 的通信，按业务领域划分。

```
api/
├── auth.ts      # 认证相关：登录、注册、找回密码
├── spu.ts       # 商品相关：搜索、详情、分类、品牌
├── trade.ts     # 交易相关：订单、支付、售后
├── upload.ts    # 上传相关：图片、文件上传
└── index.ts     # 统一导出所有 API
```

**命名规范：**
- 文件名使用小写字母，多个单词用连字符连接
- 导出的 API 对象以 `Api` 结尾，如 `authApi`、`spuApi`

### 2. src/design/ - 设计系统

包含 Design Tokens 和 SCSS 工具函数。

```
design/
├── _tokens.scss   # 设计变量：颜色、字号、间距、圆角、阴影
├── _mixins.scss   # SCSS Mixins：毛玻璃效果、文本截断、动画
└── index.scss     # 全局样式入口
```

**核心内容：**
- **Tokens**: 色彩系统、排版系统、间距系统、圆角系统、阴影系统
- **Mixins**: glass-effect、text-ellipsis、active-scale、flex-center

### 3. src/pages/ - 主包页面

仅放置高频入口页面，控制主包体积。

```
pages/
├── index/           # 首页（推荐流）
├── follow/          # 关注页
├── message/         # 消息页
└── my/              # 个人中心
```

**分包策略：**
- 主包：仅包含 Tab 页面
- 分包：卖家中心、商品详情、订单流程等

### 4. src/stores/ - 状态管理

使用 Pinia 进行状态管理，按业务领域划分。

```
stores/
├── user.ts           # 用户信息、Token
├── cart.ts           # 购物车
├── product-detail.ts # 商品详情页状态
├── order.ts          # 订单管理
├── publish.ts        # 发布流程
├── chat.ts           # 聊天消息
├── search-history.ts # 搜索历史
├── app.ts            # 全局 UI（Loading/Toast/Modal）
├── collection.ts     # 收藏管理
├── session.ts        # 会话管理
├── auth.ts           # 权限管理
├── theme.ts          # 主题切换
└── index.ts          # 统一导出
```

### 5. src/ui-kit/ - 组件库

基于 Atomic Design 理念的三层组件架构。

```
ui-kit/
├── atoms/        # 原子组件：最小 UI 单元，不包含业务逻辑
│   ├── UiAvatar.vue     # 头像
│   ├── UiBadge.vue      # 徽标
│   ├── UiButton.vue     # 按钮
│   ├── UiDivider.vue    # 分割线
│   ├── UiIcon.vue       # 图标
│   ├── UiImage.vue      # 图片
│   ├── UiPrice.vue      # 价格
│   ├── UiSkeleton.vue   # 骨架屏
│   ├── UiTag.vue        # 标签
│   └── UiText.vue       # 文本
├── molecules/    # 分子组件：组合原子组件，简单交互
│   ├── UiCell.vue       # 列表项
│   ├── UiCheckbox.vue   # 复选框
│   ├── UiInput.vue      # 输入框
│   ├── UiNavbar.vue     # 导航栏
│   ├── UiRate.vue       # 评分
│   ├── UiSearch.vue     # 搜索框
│   ├── UiStepper.vue    # 步进器
│   ├── UiSwitch.vue     # 开关
│   ├── UiTabs.vue       # 标签页
│   └── UiUpload.vue     # 上传
└── organisms/   # 组织组件：包含业务逻辑，完整功能
    ├── UiActionSheet.vue  # 操作表
    ├── UiCard.vue         # 卡片
    ├── UiDialog.vue       # 对话框
    ├── UiGoodsCard.vue    # 商品卡片
    ├── UiModal.vue        # 模态框
    ├── UiPopup.vue        # 弹出层
    ├── UiToast.vue        # 轻提示
    └── UiWaterfalls.vue   # 瀑布流
```

### 6. src/utils/ - 工具库

通用工具函数，无业务逻辑。

```
utils/
├── currency.ts   # 货币格式化（使用 decimal.js）
├── date.ts       # 日期处理（使用 dayjs）
├── http.ts       # HTTP 请求封装
└── validate.ts   # 表单验证
```

## 配置文件说明

### pages.json - 页面路由配置

```json
{
  "easycom": {
    "custom": {
      "^UiButton": "@/ui-kit/atoms/UiButton.vue"
    }
  },
  "pages": [
    { "path": "pages/index/index" }
  ],
  "subPackages": [
    {
      "root": "pages-sub/seller",
      "pages": []
    }
  ],
  "tabBar": {
    "list": []
  }
}
```

### manifest.json - 应用配置

```json
{
  "name": "XinMall",
  "appid": "",
  "version": {
    "name": "1.0.0"
  },
  "mp-weixin": {
    "appid": "",
    "setting": {}
  }
}
```

### vite.config.ts - 构建配置

```typescript
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, 'src/ui-kit'),
      '@design': resolve(__dirname, 'src/design')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@design/_tokens.scss";`
      }
    }
  }
})
```

## 分包策略

### 主包 (pages/)
- 首页（推荐流）
- 关注页
- 消息页
- 个人中心

### 分包 (pages-sub/)

```
pages-sub/
├── seller/          # 卖家中心
│   ├── publish/    # 发布商品
│   ├── manage/     # 商品管理
│   └── stats/      # 数据看板
├── product/         # 商品相关
│   ├── detail/     # 商品详情
│   ├── list/       # 商品列表
│   └── search/     # 搜索结果
├── order/           # 订单相关
│   ├── confirm/    # 确认订单
│   ├── detail/     # 订单详情
│   └── refund/     # 售后申请
├── user/            # 用户相关
│   ├── login/      # 登录
│   ├── register/   # 注册
│   └── profile/    # 个人资料
└── im/              # 聊天相关
    ├── chat/       # 聊天页面
    └── contacts/   # 联系人
```

## 命名约定

### 文件命名
- Vue 组件：PascalCase（如 `UiButton.vue`）
- TypeScript 文件：kebab-case（如 `product-detail.ts`）
- 样式文件：_前缀表示导入文件（如 `_tokens.scss`）

### 变量命名
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 类型/接口：PascalCase

### CSS 类命名
- BEM 风格：block__element--modifier
- 示例：`.ui-btn__icon--loading`

## 导入路径别名

| 别名 | 路径 | 用途 |
|------|------|------|
| `@` | `src/` | 源代码根目录 |
| `@ui` | `src/ui-kit/` | 组件库 |
| `@design` | `src/design/` | 设计系统 |
| `@components` | `src/components/` | 业务组件 |
| `@utils` | `src/utils/` | 工具库 |
| `@api` | `src/api/` | API 接口 |

## 开发建议

### 新增页面
1. 在 `pages/` 或 `pages-sub/` 中创建页面目录
2. 在 `pages.json` 中注册路由
3. 如需状态管理，在 `stores/` 中创建对应 Store

### 新增组件
1. 确定组件层级（Atom / Molecule / Organism）
2. 在对应目录创建组件文件
3. 在 `pages.json` 的 `easycom` 中配置自动导入

### 新增 API
1. 在 `api/` 中创建或编辑对应模块
2. 定义 TypeScript 类型
3. 在 `index.ts` 中导出
