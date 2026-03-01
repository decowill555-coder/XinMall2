# 环境搭建指南

本文档详细说明 XinMall 前端项目的开发环境配置步骤。

## 系统要求

### 必需软件

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | 16.0.0 | 18.x LTS | JavaScript 运行时 |
| npm | 8.0.0 | 9.x | 包管理器 |
| Git | 2.30.0 | 最新版 | 版本控制 |

### 可选软件

| 软件 | 用途 |
|------|------|
| HBuilderX | uni-app 开发工具 |
| 微信开发者工具 | 微信小程序调试 |
| VS Code | 代码编辑器 |

## 环境配置

### 1. Node.js 安装

#### Windows
```bash
# 方式一：官网下载安装包
# 访问 https://nodejs.org/ 下载 LTS 版本

# 方式二：使用 nvm-windows 管理
nvm install 18
nvm use 18
```

#### macOS
```bash
# 使用 Homebrew
brew install node@18

# 或使用 nvm
nvm install 18
nvm use 18
```

#### Linux
```bash
# 使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. 验证安装

```bash
# 检查 Node.js 版本
node -v
# 输出: v18.x.x

# 检查 npm 版本
npm -v
# 输出: 9.x.x
```

### 3. 配置 npm 镜像（国内用户推荐）

```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
```

## 项目初始化

### 1. 克隆项目

```bash
# HTTPS
git clone https://github.com/xinmall/xinmall-fe.git

# SSH
git clone git@github.com:xinmall/xinmall-fe.git

# 进入项目目录
cd xinmall-fe
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 cnpm（国内）
cnpm install

# 或使用 pnpm（推荐，更快）
npm install -g pnpm
pnpm install
```

### 3. 配置环境变量

创建 `.env.development` 文件：

```env
# 开发环境配置
VITE_APP_TITLE=XinMall
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_UPLOAD_URL=http://localhost:8080/api/v1/upload
VITE_WS_URL=ws://localhost:8080/ws
```

创建 `.env.production` 文件：

```env
# 生产环境配置
VITE_APP_TITLE=XinMall
VITE_API_BASE_URL=https://api.xinmall.com/v1
VITE_UPLOAD_URL=https://api.xinmall.com/v1/upload
VITE_WS_URL=wss://api.xinmall.com/ws
```

## 开发工具配置

### VS Code 推荐插件

创建 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "sysoev.language-stylus",
    "mrmlnc.vscode-scss",
    "uni-helper.uni-helper-vscode",
    "uni-helper.uni-app-schemas-vscode",
    "uni-helper.uni-highlight-vscode"
  ]
}
```

### VS Code 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "css.customData": [".vscode/css_custom_data.json"],
  "scss.validate": true
}
```

### ESLint 配置

创建 `.eslintrc.cjs`：

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

### Prettier 配置

创建 `.prettierrc`：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "auto",
  "vueIndentScriptAndStyle": false
}
```

## 运行项目

### H5 开发模式

```bash
npm run dev:h5
```

访问 http://localhost:5173

### 微信小程序开发模式

```bash
npm run dev:mp-weixin
```

1. 打开微信开发者工具
2. 导入项目：选择 `dist/dev/mp-weixin` 目录
3. 填写 AppID（测试可使用测试号）

### App 开发模式

```bash
npm run dev:app
```

需要配合 HBuilderX 进行真机调试。

## 构建项目

### 构建 H5

```bash
npm run build:h5
```

输出目录：`dist/build/h5`

### 构建微信小程序

```bash
npm run build:mp-weixin
```

输出目录：`dist/build/mp-weixin`

### 构建 App

```bash
npm run build:app
```

输出目录：`dist/build/app`

## 类型检查

```bash
# 运行 TypeScript 类型检查
npm run type-check
```

## 代码规范检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复
npm run lint -- --fix

# 格式化代码
npm run format
```

## 常见问题

### 1. 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 2. 微信小程序编译报错

- 确保微信开发者工具版本 >= 1.06.0
- 检查 `manifest.json` 中的 `mp-weixin.appid` 配置

### 3. H5 跨域问题

在 `vite.config.ts` 中配置代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 4. TypeScript 类型错误

```bash
# 重新生成类型声明
npm run type-check
```

### 5. 样式编译错误

确保 SCSS 依赖正确安装：

```bash
npm install sass --save-dev
```

## 开发环境检查清单

- [ ] Node.js >= 16.0.0
- [ ] npm >= 8.0.0
- [ ] Git 已配置
- [ ] VS Code 插件已安装
- [ ] 项目依赖已安装
- [ ] 环境变量已配置
- [ ] 开发服务器可正常启动
- [ ] 微信开发者工具已配置（如需小程序开发）

## 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [uni-app 文档](https://uniapp.dcloud.net.cn/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
