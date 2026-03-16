# UI-kit 有机体组件 (Organisms)

> 复杂组件，可包含业务逻辑，通常由多个分子组件和原子组件组合而成

## 设计原则

1. **功能完整**：提供完整的业务功能模块
2. **业务关联**：可包含特定业务逻辑和数据
3. **高内聚**：相关功能聚合在一起
4. **可配置**：通过 props 控制行为和展示

## 组件列表

### 卡片类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiGoodsCard` | 商品卡片 | 瀑布流/列表模式、用户信息、价格、标签 |
| `UiGoodsListItem` | 商品列表项 | 横向布局、成色、规格、价格 |
| `UiOrderCard` | 订单卡片 | 订单状态、商品信息、操作按钮 |
| `UiAddressCard` | 地址卡片 | 收货人、电话、地址、默认标记 |
| `UiUserCard` | 用户卡片 | 头像、昵称、简介、关注按钮 |
| `UiAfterSaleCard` | 售后卡片 | 售后类型、进度、商品信息 |
| `UiShopHeader` | 店铺头部 | 店铺信息、关注、评分 |

### 弹窗类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiDialog` | 对话框 | 标题、内容、确认/取消按钮 |
| `UiModal` | 模态框 | 自定义内容、动画 |
| `UiPopup` | 弹出层 | 底部弹出、自定义内容 |
| `UiActionSheet` | 动作面板 | 操作列表、取消按钮 |

### 反馈类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiToast` | 轻提示 | 文本、图标、自动关闭 |
| `UiEmpty` | 空状态 | 图标、文本、操作按钮 |

### 导航类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `TheTabbar` | 底部导航 | 首页、社区、消息、我的 |

### 筛选类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiFilterSidebar` | 筛选侧栏 | 品牌、价格区间、成色、重置/确认 |
| `UiSearchFilterBar` | 搜索筛选栏 | 卖家类型、成色、设备类型 |
| `UiBrandSelector` | 品牌选择器 | 品牌列表、Logo、选中状态 |

### 列表类

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiWaterfalls` | 瀑布流 | 双列布局、动态高度 |
| `UiAlphabetIndexList` | 字母索引列表 | 分组、快速定位 |
| `UiOrderOverview` | 订单概览 | 状态统计、入口 |

### 其他

| 组件 | 说明 | 核心功能 |
|------|------|----------|
| `UiDeviceCategoryGrid` | 设备分类网格 | 分类图标、名称、跳转 |
| `UiProductInfo` | 商品详情信息 | 图片轮播、价格、标题、描述 |
| `UiSearchResultItem` | 搜索结果项 | 商品图、标题、规格、价格、标签 |

## 使用示例

```vue
<!-- 商品卡片 - 瀑布流模式 -->
<ui-goods-card
  :data="product"
  mode="waterfall"
  @click="goDetail"
  @user-click="goUser"
/>

<!-- 商品卡片 - 列表模式 -->
<ui-goods-card
  :data="product"
  mode="list"
  @click="goDetail"
/>

<!-- 订单卡片 -->
<ui-order-card
  :order="orderData"
  @cancel="handleCancel"
  @pay="handlePay"
  @confirm="handleConfirm"
/>

<!-- 筛选侧栏 -->
<ui-filter-sidebar
  v-model:show="showFilter"
  @confirm="handleFilterConfirm"
  @reset="handleFilterReset"
/>

<!-- 瀑布流列表 -->
<ui-waterfalls
  :list="productList"
  :columns="2"
  @click="goDetail"
>
  <template #item="{ item }">
    <view class="card">
      <ui-image :src="item.cover" />
      <text>{{ item.title }}</text>
    </view>
  </template>
</ui-waterfalls>

<!-- 空状态 -->
<ui-empty
  icon="inbox"
  text="暂无数据"
  action-text="刷新"
  @action="handleRefresh"
/>
```

## 组件复杂度对比

| 特性 | 原子组件 | 分子组件 | 有机体组件 |
|------|----------|----------|------------|
| 组件数量 | 1 | 2-5 | 多个 |
| 状态管理 | 无 | 简单 | 复杂 |
| 业务逻辑 | 无 | 低 | 中/高 |
| 可复用性 | 最高 | 高 | 中 |
| 示例 | `UiButton` | `UiInput` | `UiGoodsCard` |

## 业务组件开发指南

### 何时创建有机体组件

1. 需要多个分子组件组合完成一个完整功能
2. 需要封装特定的业务逻辑
3. 在多个页面重复使用的复杂 UI 模块

### 开发规范

```vue
<script setup lang="ts">
// 1. 定义清晰的 Props 接口
interface ProductData {
  id: string | number;
  cover: string;
  title: string;
  price?: number;
  // ...
}

const props = withDefaults(defineProps<{
  data: ProductData;
  mode?: 'waterfall' | 'list';
}>(), {
  mode: 'list'
});

// 2. 使用 emits 而非直接调用路由
const emit = defineEmits(['click', 'user-click']);

// 3. 内部状态管理
const isExpanded = ref(false);

// 4. 业务逻辑封装
const handleClick = () => {
  emit('click', props.data.id);
};
</script>

<style lang="scss" scoped>
// 5. 使用设计令牌
.component {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border-radius: $radius-lg;
  padding: $space-md;

  // 6. 支持主题切换
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
  }
}
</style>
```

## 添加新有机体组件

添加新的有机体组件时，请确保：

1. 功能完整，可独立使用
2. 通过 props 和 events 与外部通信，保持灵活性
3. 使用 TypeScript 定义清晰的接口
4. 遵循设计令牌规范
5. 支持主题切换（使用 CSS 变量）
6. 在 `index.ts` 中导出组件
