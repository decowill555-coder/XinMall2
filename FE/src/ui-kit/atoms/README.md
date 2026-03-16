# UI-kit 原子组件 (Atoms)

> 最小可复用单元，无业务逻辑，纯展示组件

## 设计原则

1. **单一职责**：每个原子组件只负责一个功能
2. **无业务逻辑**：不包含任何业务相关的逻辑或状态
3. **高度可复用**：可在任何页面、任何上下文中使用
4. **设计令牌优先**：使用 `$color-*`、`$font-size-*`、`$space-*` 等设计令牌

## 组件列表

| 组件 | 说明 | Props |
|------|------|-------|
| `UiAvatar` | 用户头像 | `src`, `size`, `bordered` |
| `UiBadge` | 徽标/角标 | `value`, `max`, `type` |
| `UiButton` | 按钮 | `variant`, `size`, `block`, `disabled`, `loading` |
| `UiDivider` | 分割线 | `direction`, `dashed` |
| `UiIcon` | 图标 | `name`, `size`, `color`, `bold` |
| `UiImage` | 图片 | `src`, `width`, `height`, `mode`, `radius` |
| `UiPrice` | 价格显示 | `value`, `size`, `color`, `bold`, `type` |
| `UiSkeleton` | 骨架屏 | `rows`, `avatar`, `animated` |
| `UiTag` | 标签 | `text`, `type`, `plain`, `size`, `closable` |
| `UiText` | 文本 | `type`, `size`, `weight`, `ellipsis` |
| `UiTextarea` | 多行文本框 | `modelValue`, `placeholder`, `maxlength`, `rows` |

## 使用示例

```vue
<!-- 按钮 -->
<ui-button type="primary" size="md" @click="handleClick">
  确认
</ui-button>

<!-- 图标 - 使用语义化颜色 -->
<ui-icon name="heart" :size="32" color="error" />
<ui-icon name="check-circle" :size="32" color="success" />

<!-- 价格 -->
<ui-price :value="9900" :size="36" bold />
```

## 颜色语义化

`UiIcon` 组件支持以下语义化颜色值：

| 颜色值 | 说明 | 对应 SCSS 变量 |
|--------|------|----------------|
| `primary` | 主题色 | `$color-primary` |
| `success` | 成功/在线 | `$color-success` |
| `error` | 错误/危险 | `$color-error` |
| `warning` | 警告 | `$color-warning` |
| `placeholder` | 占位符 | `$color-text-placeholder` |
| `disabled` | 禁用 | `$color-text-disabled` |
| `white` | 白色 | `$color-white` |
| `sub` | 次要文本 | `$color-text-sub` |

## 设计令牌规范

原子组件应遵循以下设计令牌使用规范：

```scss
// ✅ 正确 - 使用 SCSS 变量
color: $color-primary;
font-size: $font-size-md;
padding: $space-md;

// ✅ 正确 - 使用 CSS 变量（支持主题切换）
background: var(--color-bg-card);
color: var(--color-text-main);

// ❌ 错误 - 硬编码颜色
color: #FF6A00;
background: rgba(255, 255, 255, 0.85);
```

## 添加新原子组件

添加新的原子组件时，请确保：

1. 组件名以 `Ui` 开头
2. 只包含展示逻辑，不包含业务逻辑
3. 使用 TypeScript 定义 Props 接口
4. 使用设计令牌而非硬编码值
5. 在 `index.ts` 中导出组件
