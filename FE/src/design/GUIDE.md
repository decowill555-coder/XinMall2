# XinMall 设计系统使用指南

本文档说明如何正确使用项目的设计令牌（Design Tokens）和混入（Mixins），确保样式一致性和主题切换功能正常工作。

---

## 核心概念

### SCSS 变量 vs CSS 变量

项目中有两类变量，理解它们的区别至关重要：

| 类型 | 语法 | 用途 | 主题切换 |
|------|------|------|----------|
| **CSS 变量** | `var(--color-primary)` | 运行时动态值 | ✅ 支持 |
| **SCSS 变量** | `$font-size-md` | 编译时常量 | ❌ 不支持 |

**关键规则**：
- 需要响应主题切换的值（颜色、背景、文字、边框等）→ 使用 **CSS 变量**
- 不随主题变化的值（尺寸、字体大小、间距、圆角等）→ 使用 **SCSS 变量**

---

## 变量快速参考

### 颜色变量（必须使用 CSS 变量）

```scss
// ❌ 错误：硬编码颜色
color: #FFFFFF;
background: #0B0A12;
border: 1px solid rgba(0, 0, 0, 0.1);

// ✅ 正确：使用 CSS 变量
color: var(--color-text-main);
background: var(--color-bg-page);
border: 1px solid var(--color-border);

// ✅ 也可以使用 SCSS 变量（内部引用 CSS 变量）
color: $color-text-main;  // 编译后为 var(--color-text-main, #2C2624)
```

### 完整颜色变量列表

| CSS 变量 | 用途 | 浅色模式 | 深色模式 |
|----------|------|----------|----------|
| `--color-primary` | 主题色 | #FF4081 | #D946EF |
| `--color-bg-page` | 页面背景 | #FFF5F2 | #0B0A12 |
| `--color-bg-card` | 卡片背景 | rgba(255,255,255,0.65) | rgba(255,255,255,0.06) |
| `--color-bg-white` | 纯白背景 | #FFFFFF | #16161E |
| `--color-text-main` | 主文字 | #2C2624 | #F2F2F7 |
| `--color-text-sub` | 次要文字 | #867A76 | #A1A1AA |
| `--color-text-disabled` | 禁用文字 | #C4C0BE | #52525B |
| `--color-text-placeholder` | 占位符 | #A9A5A2 | #6B7280 |
| `--color-border` | 边框 | rgba(44,38,36,0.08) | rgba(255,255,255,0.1) |
| `--color-price` | 价格色 | #FF3B30 | #FF78E1 |
| `--color-success` | 成功色 | #00C853 | #00F5D4 |
| `--color-error` | 错误色 | #FF3D00 | #FF2A6D |
| `--color-warning` | 警告色 | #FFAB00 | #FFD600 |

### 尺寸变量（使用 SCSS 变量）

```scss
// 字号
$font-size-xs: 20rpx;
$font-size-sm: 24rpx;
$font-size-md: 28rpx;
$font-size-lg: 32rpx;
$font-size-xl: 40rpx;

// 间距
$space-4: 8rpx;
$space-8: 16rpx;
$space-12: 24rpx;
$space-16: 32rpx;
$space-24: 48rpx;

// 圆角
$radius-sm: 8rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-full: 999px;

// 字重
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-bold: 600;
```

---

## 常用混入（Mixins）

### 玻璃效果

```scss
@use '@/design' as *;

// 毛玻璃卡片
.my-card {
  @include glass-card;  // 包含背景、模糊、边框、阴影
}

// 自定义玻璃效果
.custom-glass {
  @include glass-effect($blur: 32px, $opacity: 0.75);
}

// 透明水晶效果
.crystal-panel {
  @include crystal-glass;
}

// 主题感知卡片（自动适配深浅色）
.theme-card {
  @include theme-aware-card;
}
```

### 文本处理

```scss
// 单行省略
.title {
  @include text-ellipsis;
}

// 多行省略（3行）
.description {
  @include text-ellipsis(3);
}

// 渐变文字
.gradient-title {
  @include text-gradient($gradient-primary);
}

// 主题感知文字颜色
.main-text {
  @include text-main;  // 自动适配深浅色
}

.sub-text {
  @include text-sub;
}
```

### 布局工具

```scss
// Flex 居中
.container {
  @include flex-center;
}

// Flex 两端对齐
.row {
  @include flex-between;
}

// 绝对居中
.modal {
  @include absolute-center;
}

// 安全区域
.footer {
  @include safe-area-bottom(20rpx);
}
```

### 交互效果

```scss
// 按下缩放
.button {
  @include active-scale;
}

// 卡片悬浮
.card {
  @include card-shadow-hover;
}

// 禁用状态
.disabled {
  @include disabled-state;
}
```

### 主题适配

```scss
// 自动适配深浅色的按钮
.my-button {
  @include theme-aware-button;
}

// 自动适配深浅色的价格
.price {
  @include theme-aware-price;
}

// 自动适配深浅色的输入框
.input {
  @include theme-aware-input;
}

// 页面渐变背景（含深色模式）
.page {
  @include page-gradient-bg;
}

// 毛玻璃头部
.header {
  @include glass-header;
}
```

---

## 禁止事项

### 禁止硬编码颜色

```scss
// ❌ 绝对禁止
color: #FFFFFF;
background: #000000;
border-color: rgba(0, 0, 0, 0.1);

// ✅ 正确做法
color: var(--color-text-white);
background: var(--color-bg-page);
border-color: var(--color-border);
```

### 禁止使用 rgba() 直接写颜色

```scss
// ❌ 错误
background: rgba(255, 255, 255, 0.65);

// ✅ 正确
background: var(--color-bg-card);
// 或使用混入
@include glass-effect;
```

### 禁止使用颜色名称

```scss
// ❌ 错误
color: white;
color: black;
color: red;

// ✅ 正确
color: var(--color-text-white);
color: var(--color-error);
```

---

## 主题切换原理

### HTML 结构

```html
<!-- 根元素设置 data-theme 和 data-color -->
<html data-theme="light" data-color="pink">
```

### CSS 变量定义位置

```scss
// _tokens.scss 中定义

:root {
  --color-primary: #FF4081;  // 浅色模式默认值
}

[data-theme="dark"] {
  --color-primary: #D946EF;  // 深色模式覆盖
}

[data-color="emerald"] {
  --color-primary: #1ABC9C;  // 翡翠绿主题
}
```

### 深色模式适配模式

```scss
// 方式1：使用 CSS 变量（推荐）
.element {
  color: var(--color-text-main);
}

// 方式2：使用主题感知混入
.element {
  @include text-main;
}

// 方式3：手动写深色模式样式
.element {
  color: $color-text-main;  // 浅色

  [data-theme="dark"] & {
    color: #F2F2F7;  // 深色
  }
}
```

---

## 文件结构

```
src/design/
├── _tokens.scss     # 设计令牌定义
├── _mixins.scss     # 混入工具
├── _functions.scss  # SCSS 函数
├── index.scss       # 入口文件
└── GUIDE.md         # 本文档
```

### 使用方式

```scss
// 在 Vue 组件中引入
<style lang="scss">
@use '@/design' as *;

.my-component {
  color: var(--color-text-main);
  @include glass-card;
}
</style>

// 或者全局引入（uni.scss）
@import '@/design/index.scss';
```

---

## 检查清单

在提交代码前，请确保：

- [ ] 没有硬编码的 hex 颜色值（如 `#FFFFFF`）
- [ ] 没有直接使用的 `rgba()` 函数
- [ ] 需要主题切换的颜色使用 CSS 变量
- [ ] 尺寸类值使用 SCSS 变量
- [ ] 复杂效果优先使用混入
- [ ] 深色模式下视觉效果正确
