# 设计系统文档

本文档详细说明 XinMall 的设计系统，包括 Design Tokens、视觉风格、组件规范等。

## 设计理念

### 核心原则

1. **Glassmorphism（毛玻璃拟态）** - 半透明背景 + 背景模糊 + 柔和边框
2. **Light Theme First** - 以浅色系为主，营造干净、梦幻感
3. **Micro-interactions** - 高品质微交互，提升触感反馈
4. **Consistency** - 通过 Design Tokens 保证全站风格统一

### 视觉风格

- **色调**：浅色系为主，科技蓝作为品牌色
- **材质**：大量使用毛玻璃效果
- **圆角**：较大圆角（16rpx ~ 32rpx），更现代
- **阴影**：带品牌色倾向的弥散投影
- **动画**：流畅、自然的过渡效果

---

## Design Tokens

### 1. 色彩系统 (Color Palette)

#### 品牌色

| Token | 值 | 用途 |
|-------|-----|------|
| `$color-primary` | `#1ABC9C` | 核心主色 (Emerald Green) |
| `$color-primary-light` | `#D0F0E8` | 主色浅调 (背景/标签) |
| `$color-primary-dark` | `#16A085` | 主色深调 (点击态) |

#### 渐变色

| Token | 值 | 用途 |
|-------|-----|------|
| `$gradient-primary` | `linear-gradient(135deg, #1ABC9C 0%, #10AC84 100%)` | 品牌渐变 |
| `$gradient-gold` | `linear-gradient(135deg, #FFD700 0%, #FFA000 100%)` | 金色渐变 |

#### 功能色

| Token | 值 | 用途 |
|-------|-----|------|
| `$color-success` | `#00C853` | 交易成功/正品认证 |
| `$color-warning` | `#FFAB00` | 提醒/打包出售警告 |
| `$color-error` | `#FF3D00` | 错误/降价 |
| `$color-info` | `#00B8D4` | 信息提示 |

#### 背景色

| Token | 值 | 用途 |
|-------|-----|------|
| `$color-bg-page` | `#F2F4F8` | 页面背景色 |
| `$color-bg-white` | `#FFFFFF` | 纯白背景 |
| `$color-bg-gray` | `#F5F5F7` | 浅灰背景 |

#### 文本色

| Token | 值 | 用途 |
|-------|-----|------|
| `$color-text-main` | `#1D1D1F` | 主要信息 |
| `$color-text-sub` | `#6E6E73` | 次要信息 |
| `$color-text-disabled` | `#A1A1A6` | 禁用状态 |
| `$color-text-placeholder` | `#A1A1A6` | 占位符 |

#### 毛玻璃色

| Token | 值 | 用途 |
|-------|-----|------|
| `$glass-white-high` | `rgba(255, 255, 255, 0.85)` | 强背景 (内容区) |
| `$glass-white-mid` | `rgba(255, 255, 255, 0.65)` | 中背景 (浮层) |
| `$glass-white-low` | `rgba(255, 255, 255, 0.45)` | 弱背景 (装饰) |

---

### 2. 排版系统 (Typography)

#### 字号

| Token | 值 | 用途 |
|-------|-----|------|
| `$font-size-xs` | `20rpx` | 标签/角标 |
| `$font-size-sm` | `24rpx` | 辅助文案 |
| `$font-size-md` | `28rpx` | 正文 (默认) |
| `$font-size-lg` | `32rpx` | 小标题 |
| `$font-size-xl` | `40rpx` | 价格/大标题 |
| `$font-size-xxl` | `48rpx` | 巨型数字 |
| `$font-size-xxxl` | `64rpx` | 特大数字 |

#### 字重

| Token | 值 | 用途 |
|-------|-----|------|
| `$font-weight-regular` | `400` | 常规 |
| `$font-weight-medium` | `500` | 中等 |
| `$font-weight-bold` | `600` | 粗体 (iOS 风格) |

#### 行高

| Token | 值 | 用途 |
|-------|-----|------|
| `$line-height-tight` | `1.2` | 紧凑 |
| `$line-height-normal` | `1.5` | 正常 |
| `$line-height-loose` | `1.8` | 宽松 |

---

### 3. 间距系统 (Spacing)

基于 4px 栅格系统：

| Token | 值 | 用途 |
|-------|-----|------|
| `$space-2` | `4rpx` | 极小间距 |
| `$space-4` | `8rpx` | 微小间距 |
| `$space-8` | `16rpx` | 标准间距 |
| `$space-12` | `24rpx` | 中等间距 |
| `$space-16` | `32rpx` | 大间距 |
| `$space-24` | `48rpx` | 大区块间距 |
| `$space-32` | `64rpx` | 页面级间距 |

**简写别名：**
- `$space-xs` = `$space-4`
- `$space-sm` = `$space-8`
- `$space-md` = `$space-12`
- `$space-lg` = `$space-16`
- `$space-xl` = `$space-24`

---

### 4. 圆角系统 (Radius)

| Token | 值 | 用途 |
|-------|-----|------|
| `$radius-xs` | `4rpx` | 微圆角 |
| `$radius-sm` | `8rpx` | 小圆角 |
| `$radius-md` | `16rpx` | 标准卡片圆角 |
| `$radius-lg` | `24rpx` | 较大的卡片 |
| `$radius-xl` | `32rpx` | 大卡片/弹窗 |
| `$radius-full` | `999px` | 完全圆形 |

---

### 5. 阴影系统 (Shadows)

#### 基础阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `$shadow-xs` | `0 2rpx 8rpx rgba(0, 0, 0, 0.02)` | 极轻阴影 |
| `$shadow-sm` | `0 4rpx 12rpx rgba(0, 0, 0, 0.03)` | 轻阴影 |
| `$shadow-md` | `0 8rpx 24rpx rgba(0, 0, 0, 0.04)` | 中等阴影 |

#### 品牌色阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `$shadow-primary-sm` | `0 4rpx 16rpx rgba(41, 121, 255, 0.12)` | 主色轻阴影 |
| `$shadow-primary-md` | `0 8rpx 32rpx rgba(41, 121, 255, 0.16)` | 主色中阴影 |
| `$shadow-primary-lg` | `0 16rpx 48rpx rgba(41, 121, 255, 0.20)` | 主色重阴影 |

#### 功能色阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `$shadow-success` | `0 8rpx 24rpx rgba(0, 200, 83, 0.15)` | 成功色阴影 |
| `$shadow-warning` | `0 8rpx 24rpx rgba(255, 171, 0, 0.15)` | 警告色阴影 |
| `$shadow-error` | `0 8rpx 24rpx rgba(255, 61, 0, 0.15)` | 错误色阴影 |

---

### 6. 动画系统 (Animation)

#### 时长

| Token | 值 | 用途 |
|-------|-----|------|
| `$duration-fast` | `0.15s` | 快速动画 |
| `$duration-normal` | `0.25s` | 标准动画 |
| `$duration-slow` | `0.4s` | 慢速动画 |

#### 缓动函数

| Token | 值 | 用途 |
|-------|-----|------|
| `$ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 缓入 |
| `$ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 缓出 |
| `$ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 缓入缓出 |
| `$ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性 |

---

### 7. 层级系统 (Z-Index)

| Token | 值 | 用途 |
|-------|-----|------|
| `$z-dropdown` | `100` | 下拉菜单 |
| `$z-sticky` | `200` | 粘性元素 |
| `$z-fixed` | `300` | 固定元素 |
| `$z-modal-backdrop` | `400` | 模态框背景 |
| `$z-modal` | `500` | 模态框 |
| `$z-popover` | `600` | 弹出框 |
| `$z-toast` | `700` | 轻提示 |

---

## SCSS Mixins

### 毛玻璃效果

```scss
@mixin glass-effect($blur: 20rpx, $opacity: 0.8) {
  background-color: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur($blur);
  -webkit-backdrop-filter: blur($blur);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 4rpx 30rpx rgba(0, 0, 0, 0.03),
    inset 0 0 20rpx rgba(255, 255, 255, 0.5);
}
```

**使用示例：**
```scss
.card {
  @include glass-effect(20rpx, 0.85);
}
```

### 文本截断

```scss
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: $lines;
    overflow: hidden;
  }
}
```

**使用示例：**
```scss
.title {
  @include text-ellipsis(2); // 两行截断
}
```

### 点击缩放反馈

```scss
@mixin active-scale($scale: 0.96) {
  transition: transform 0.2s ease, opacity 0.2s ease;
  &:active {
    transform: scale($scale);
    opacity: 0.9;
  }
}
```

**使用示例：**
```scss
.button {
  @include active-scale;
}
```

### Flex 居中

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### 安全区域适配

```scss
@mixin safe-area-bottom($extra: 0) {
  padding-bottom: calc(#{$extra} + constant(safe-area-inset-bottom));
  padding-bottom: calc(#{$extra} + env(safe-area-inset-bottom));
}
```

---

## 组件规范

### 按钮规范

| 尺寸 | 高度 | 内边距 | 字号 |
|------|------|--------|------|
| sm | 56rpx | 0 24rpx | 24rpx |
| md | 80rpx | 0 40rpx | 28rpx |
| lg | 96rpx | 0 64rpx | 32rpx |

**变体：**
- `primary` - 实心品牌色
- `glass` - 毛玻璃效果
- `outline` - 描边
- `text` - 纯文字
- `danger` - 危险操作

### 输入框规范

| 属性 | 值 |
|------|-----|
| 高度 | 88rpx |
| 内边距 | 0 24rpx |
| 字号 | 28rpx |
| 圆角 | 16rpx |
| 边框 | 1px solid rgba(0, 0, 0, 0.08) |

### 卡片规范

| 属性 | 值 |
|------|-----|
| 内边距 | 24rpx |
| 圆角 | 24rpx |
| 背景 | 毛玻璃效果 |

---

## 主题切换

### 明暗模式

```scss
// 浅色模式
--color-bg-page: #F2F4F8;
--color-bg-white: #FFFFFF;
--color-text-main: #1D1D1F;

// 深色模式
--color-bg-page: #121212;
--color-bg-white: #1E1E1E;
--color-text-main: #FFFFFF;
```

### 主题色

| 主题 | 主色 | 渐变 |
|------|------|------|
| emerald | #1ABC9C | #1ABC9C → #10AC84 |
| blue | #2979FF | #2979FF → #7C4DFF |
| purple | #7C4DFF | #7C4DFF → #E040FB |
| green | #00C853 | #00C853 → #00BFA5 |
| orange | #FF6D00 | #FF6D00 → #FFAB00 |
| pink | #FF4081 | #FF4081 → #F50057 |

---

## 设计资源

### 设计工具
- Figma - UI 设计
- Sketch - UI 设计
- Adobe XD - UI 设计

### 图标资源
- 自研图标库（Unicode 符号）
- 可扩展为 SVG 图标

### 字体
- 系统默认字体栈
- iOS: San Francisco
- Android: Roboto
- 微信小程序: -apple-system, Helvetica Neue
