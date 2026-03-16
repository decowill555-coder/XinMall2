# UI-kit 分子组件 (Molecules)

> 组合多个原子组件，提供简单交互，仍保持较高的可复用性

## 设计原则

1. **组合性**：由多个原子组件组合而成
2. **简单交互**：可包含简单的状态管理和交互逻辑
3. **低业务耦合**：尽量不包含特定业务的逻辑
4. **配置驱动**：通过 props 控制行为和展示

## 组件列表

### 表单类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiInput` | 输入框 | 双向绑定、清空、密码显隐 |
| `UiTextarea` | 多行输入 | 字数统计、自动高度 |
| `UiCheckbox` | 复选框 | 单选/多选、半选状态 |
| `UiSwitch` | 开关 | 双向绑定、禁用状态 |
| `UiRate` | 评分 | 星级评分、半星 |
| `UiFormItem` | 表单项 | 标签、验证提示、必填标记 |
| `UiPriceInput` | 价格输入 | 货币符号、千分位 |

### 导航类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiNavbar` | 导航栏 | 标题、返回、自定义左右插槽 |
| `UiSubNavbar` | 子导航栏 | 固定头部、半透明背景 |
| `UiTabs` | 标签页 | 滑动切换、徽标 |
| `UiSubCategoryTabs` | 子分类标签 | 横向滚动、选中状态 |

### 搜索类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiSearch` | 搜索框 | 输入、清除、搜索触发 |
| `UiSearchDropdown` | 搜索下拉 | 历史记录、热门推荐 |
| `UiSearchHistory` | 搜索历史 | 展示、清除、点击回调 |
| `UiHotKeywords` | 热门关键词 | 标签展示、点击回调 |

### 展示类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiCard` | 卡片容器 | 头部、内容、底部插槽 |
| `UiCell` | 列表单元格 | 图标、标题、描述、箭头 |
| `UiSellerCard` | 卖家卡片 | 头像、名称、等级、销量、评分 |
| `UiGoodsInfo` | 商品信息 | 标题、规格、标签 |
| `UiGoodsActions` | 商品操作 | 收藏、分享、购买 |

### 交互类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiStepper` | 步进器 | 数量增减、范围限制 |
| `UiInteractBar` | 互动栏 | 点赞、评论、分享 |
| `UiQuickActions` | 快捷操作 | 长按菜单、快捷按钮 |

### 媒体类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiSwiper` | 轮播图 | 自动播放、指示器 |
| `UiUpload` | 上传 | 图片/视频上传、预览、删除 |
| `UiIdUploader` | 证件上传 | 正反面、示例图 |

### 列表类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiLoadMore` | 加载更多 | 上拉加载、加载状态 |
| `UiTimeline` | 时间线 | 时间节点、状态标记 |

### 其他

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiAlphabetNav` | 字母导航 | 快速定位、侧边栏 |
| `UiBottomBar` | 底部栏 | 固定底部、安全区域适配 |
| `UiCommentInput` | 评论输入 | 输入框、表情、发送 |
| `UiCommentItem` | 评论项 | 用户信息、内容、时间、回复 |
| `UiConditionPicker` | 成色选择器 | 滑动选择、自定义选项 |
| `UiFilterDropdown` | 筛选下拉 | 多选、单选、重置 |
| `UiForumEntryItem` | 论坛入口项 | 图标、标题、描述、跳转 |
| `UiModelSearchItem` | 型号搜索项 | 型号名、品牌、热门标记 |

## 使用示例

```vue
<!-- 输入框 -->
<ui-input
  v-model="username"
  placeholder="请输入用户名"
  clearable
  @confirm="handleSubmit"
/>

<!-- 搜索框 -->
<ui-search
  v-model="keyword"
  placeholder="搜索商品..."
  @search="handleSearch"
/>

<!-- 卖家卡片 -->
<ui-seller-card
  :seller-id="seller.id"
  :avatar="seller.avatar"
  :name="seller.name"
  :level-name="seller.levelName"
  :sales="seller.sellingCount"
  :followers="seller.followerCount"
  :rating="seller.rating"
/>

<!-- 步进器 -->
<ui-stepper
  :model-value="quantity"
  :min="1"
  :max="99"
  @change="handleQuantityChange"
/>
```

## 与原子组件的区别

| 特性 | 原子组件 | 分子组件 |
|------|----------|----------|
| 组件数量 | 单个 | 多个组合 |
| 状态管理 | 无/极少 | 简单状态 |
| 业务逻辑 | 无 | 低耦合 |
| 可复用性 | 最高 | 高 |
| 示例 | `UiButton`, `UiIcon` | `UiInput`, `UiSearch` |

## 添加新分子组件

添加新的分子组件时，请确保：

1. 由原子组件组合而成，避免重复实现原子组件的功能
2. 保持低业务耦合，通过 props 和 events 与外部通信
3. 使用 TypeScript 定义清晰的接口
4. 遵循设计令牌规范
