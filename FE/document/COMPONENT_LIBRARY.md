# 组件库文档

本文档详细说明 XinMall 自研组件库的所有组件及其使用方法。

## 组件架构

基于 **Atomic Design（原子化设计）** 理念，组件库分为三层：

```
ui-kit/
├── atoms/        # 原子组件 - 最小 UI 单元
├── molecules/    # 分子组件 - 组合原子组件
└── organisms/    # 组织组件 - 包含业务逻辑
```

### 层级说明

| 层级 | 说明 | 特点 |
|------|------|------|
| Atoms | 最小 UI 单元 | 不包含业务逻辑，高度可复用 |
| Molecules | 简单组合 | 组合原子组件，简单交互 |
| Organisms | 复杂组件 | 包含业务逻辑，完整功能 |

---

## 原子组件 (Atoms)

### UiButton - 按钮

基础按钮组件，支持多种风格和尺寸。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | `string` | - | 按钮文字 |
| variant | `'primary' \| 'glass' \| 'outline' \| 'text' \| 'danger'` | `'primary'` | 按钮风格 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| block | `boolean` | `false` | 是否撑满父容器 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 是否加载中 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| click | `Event` | 点击事件 |

#### 使用示例

```vue
<template>
  <!-- 主要按钮 -->
  <UiButton variant="primary">主要按钮</UiButton>
  
  <!-- 毛玻璃按钮 -->
  <UiButton variant="glass">毛玻璃按钮</UiButton>
  
  <!-- 描边按钮 -->
  <UiButton variant="outline">描边按钮</UiButton>
  
  <!-- 文字按钮 -->
  <UiButton variant="text">文字按钮</UiButton>
  
  <!-- 危险按钮 -->
  <UiButton variant="danger">删除</UiButton>
  
  <!-- 加载中 -->
  <UiButton loading>加载中</UiButton>
  
  <!-- 禁用状态 -->
  <UiButton disabled>禁用按钮</UiButton>
  
  <!-- 块级按钮 -->
  <UiButton block size="lg">块级按钮</UiButton>
</template>
```

---

### UiIcon - 图标

图标组件，支持多种尺寸和颜色。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | `string` | - | 图标名称 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | 图标尺寸 |
| color | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'inherit' \| string` | `'inherit'` | 图标颜色 |
| rotate | `number` | `0` | 旋转角度 |
| spin | `boolean` | `false` | 是否旋转动画 |
| disabled | `boolean` | `false` | 是否禁用 |

#### 使用示例

```vue
<template>
  <UiIcon name="arrow-left" />
  <UiIcon name="close" color="error" />
  <UiIcon name="loading" spin />
  <UiIcon name="search" size="lg" />
</template>
```

---

### UiText - 文本

文本显示组件，支持截断和样式设置。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | `string` | - | 文本内容 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 字号 |
| color | `string` | - | 文字颜色 |
| weight | `'regular' \| 'medium' \| 'bold'` | `'regular'` | 字重 |
| lines | `number` | `0` | 行数限制 (0 为不限制) |
| ellipsis | `boolean` | `false` | 是否截断 |

---

### UiTag - 标签

标签组件，用于分类或标记。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | `string` | - | 标签文字 |
| type | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | 标签类型 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 标签尺寸 |
| plain | `boolean` | `false` | 是否镂空 |
| closable | `boolean` | `false` | 是否可关闭 |

---

### UiBadge - 徽标

徽标组件，用于显示数字或红点。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `string \| number` | - | 徽标内容 |
| max | `number` | `99` | 最大值 |
| dot | `boolean` | `false` | 是否为红点 |
| hidden | `boolean` | `false` | 是否隐藏 |

---

### UiAvatar - 头像

头像组件，支持图片和文字头像。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | `string` | - | 头像图片地址 |
| text | `string` | - | 文字头像 |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 头像尺寸 |
| shape | `'circle' \| 'square'` | `'circle'` | 头像形状 |

---

### UiImage - 图片

图片组件，支持懒加载和占位图。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | `string` | - | 图片地址 |
| mode | `string` | `'aspectFill'` | 裁剪模式 |
| lazy | `boolean` | `true` | 是否懒加载 |
| radius | `string` | - | 圆角 |

---

### UiPrice - 价格

价格显示组件，自动格式化。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `number` | `0` | 价格值 |
| symbol | `string` | `'¥'` | 货币符号 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 字号 |
| color | `string` | - | 颜色 |
| strike | `boolean` | `false` | 是否划线价 |

---

### UiDivider - 分割线

分割线组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| dashed | `boolean` | `false` | 是否虚线 |
| text | `string` | - | 文字 |

---

### UiSkeleton - 骨架屏

骨架屏组件，用于加载占位。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loading | `boolean` | `true` | 是否加载中 |
| rows | `number` | `3` | 行数 |
| avatar | `boolean` | `false` | 是否显示头像 |
| title | `boolean` | `true` | 是否显示标题 |

---

## 分子组件 (Molecules)

### UiInput - 输入框

输入框组件，支持前缀后缀、清空、密码显隐。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number` | - | 绑定值 |
| type | `'text' \| 'number' \| 'password' \| 'digit'` | `'text'` | 输入类型 |
| placeholder | `string` | `'请输入'` | 占位符 |
| disabled | `boolean` | `false` | 是否禁用 |
| clearable | `boolean` | `true` | 是否可清空 |
| maxlength | `number` | `140` | 最大长度 |
| error | `boolean` | `false` | 是否错误状态 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | `string` | 值变化 |
| focus | `Event` | 获得焦点 |
| blur | `Event` | 失去焦点 |
| confirm | `Event` | 确认 |
| clear | - | 清空 |

#### Slots

| 插槽 | 说明 |
|------|------|
| prefix | 前缀内容 |
| suffix | 后缀内容 |

#### 使用示例

```vue
<template>
  <UiInput v-model="value" placeholder="请输入用户名" />
  
  <UiInput v-model="password" type="password" placeholder="请输入密码">
    <template #prefix>
      <UiIcon name="lock" />
    </template>
  </UiInput>
  
  <UiInput v-model="search" placeholder="搜索">
    <template #suffix>
      <UiButton size="sm">搜索</UiButton>
    </template>
  </UiInput>
</template>
```

---

### UiSearch - 搜索框

搜索框组件，包含搜索图标和清空按钮。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string` | - | 绑定值 |
| placeholder | `string` | `'搜索'` | 占位符 |
| showAction | `boolean` | `false` | 是否显示取消按钮 |
| actionText | `string` | `'取消'` | 取消按钮文字 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| search | `string` | 搜索 |
| cancel | - | 取消 |

---

### UiNavbar - 导航栏

导航栏组件，支持自定义标题和操作按钮。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 标题 |
| leftText | `string` | - | 左侧文字 |
| rightText | `string` | - | 右侧文字 |
| leftArrow | `boolean` | `true` | 是否显示返回箭头 |
| fixed | `boolean` | `true` | 是否固定顶部 |
| border | `boolean` | `true` | 是否显示下边框 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| clickLeft | - | 点击左侧 |
| clickRight | - | 点击右侧 |

#### Slots

| 插槽 | 说明 |
|------|------|
| title | 标题 |
| left | 左侧内容 |
| right | 右侧内容 |

---

### UiTabs - 标签页

标签页组件，支持滑动切换。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `number` | `0` | 当前激活索引 |
| tabs | `Array<{ label: string; disabled?: boolean }>` | `[]` | 标签列表 |
| sticky | `boolean` | `false` | 是否粘性定位 |
| animated | `boolean` | `true` | 是否开启动画 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| change | `index` | 切换事件 |

---

### UiCell - 列表项

列表项组件，常用于设置页。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 标题 |
| value | `string` | - | 右侧值 |
| label | `string` | - | 描述信息 |
| icon | `string` | - | 左侧图标 |
| arrow | `boolean` | `false` | 是否显示箭头 |
| clickable | `boolean` | `false` | 是否可点击 |

---

### UiCheckbox - 复选框

复选框组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 绑定值 |
| disabled | `boolean` | `false` | 是否禁用 |
| shape | `'square' \| 'round'` | `'square'` | 形状 |

---

### UiSwitch - 开关

开关组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 绑定值 |
| disabled | `boolean` | `false` | 是否禁用 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |

---

### UiRate - 评分

评分组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `number` | `0` | 绑定值 |
| count | `number` | `5` | 星星总数 |
| size | `number` | `40` | 星星大小 |
| disabled | `boolean` | `false` | 是否禁用 |
| allowHalf | `boolean` | `false` | 是否允许半星 |

---

### UiStepper - 步进器

步进器组件，用于数量选择。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `number` | `1` | 绑定值 |
| min | `number` | `1` | 最小值 |
| max | `number` | `Infinity` | 最大值 |
| step | `number` | `1` | 步长 |
| disabled | `boolean` | `false` | 是否禁用 |

---

### UiUpload - 上传

上传组件，支持图片和文件上传。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string[]` | `[]` | 文件列表 |
| maxCount | `number` | `9` | 最大上传数量 |
| maxSize | `number` | `10 * 1024 * 1024` | 最大文件大小 |
| accept | `'image' \| 'video' \| 'all'` | `'image'` | 接受类型 |
| multiple | `boolean` | `true` | 是否多选 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| oversize | `file` | 文件超出大小限制 |
| delete | `index` | 删除文件 |

---

## 组织组件 (Organisms)

### UiCard - 卡片

卡片组件，支持毛玻璃效果。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | - | 标题 |
| glass | `boolean` | `true` | 是否毛玻璃效果 |
| shadow | `boolean` | `true` | 是否显示阴影 |
| interactive | `boolean` | `false` | 是否可点击 |
| radius | `'sm' \| 'md' \| 'lg'` | `'md'` | 圆角 |
| padding | `'sm' \| 'md' \| 'lg' \| 'none'` | `'md'` | 内边距 |

#### Slots

| 插槽 | 说明 |
|------|------|
| default | 内容 |
| header | 头部 |
| extra | 右侧操作 |
| footer | 底部 |

#### 使用示例

```vue
<template>
  <UiCard title="商品信息" :glass="true">
    <template #extra>
      <UiButton variant="text" size="sm">查看更多</UiButton>
    </template>
    
    <!-- 内容 -->
    <view>商品详情...</view>
    
    <template #footer>
      <UiButton block>立即购买</UiButton>
    </template>
  </UiCard>
</template>
```

---

### UiModal - 模态框

模态框组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示 |
| title | `string` | - | 标题 |
| content | `string` | - | 内容 |
| confirmText | `string` | `'确定'` | 确认按钮文字 |
| cancelText | `string` | `'取消'` | 取消按钮文字 |
| showCancel | `boolean` | `true` | 是否显示取消按钮 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| confirm | - | 确认 |
| cancel | - | 取消 |

---

### UiDialog - 对话框

对话框组件，支持多种类型。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示 |
| type | `'alert' \| 'confirm' \| 'prompt'` | `'alert'` | 类型 |
| title | `string` | - | 标题 |
| message | `string` | - | 消息内容 |

---

### UiToast - 轻提示

轻提示组件，通过 Store 调用。

#### 使用示例

```typescript
import { useAppStore } from '@/stores';

const appStore = useAppStore();

// 成功提示
appStore.success('操作成功');

// 错误提示
appStore.error('操作失败');

// 警告提示
appStore.warning('请注意');

// 普通提示
appStore.info('提示信息');
```

---

### UiActionSheet - 操作表

操作表组件，从底部弹出。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示 |
| title | `string` | - | 标题 |
| options | `Array<{ label: string; value: string; color?: string }>` | `[]` | 选项列表 |
| cancelText | `string` | `'取消'` | 取消按钮文字 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| select | `value` | 选择选项 |
| cancel | - | 取消 |

---

### UiPopup - 弹出层

弹出层组件，支持多个方向。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示 |
| position | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'bottom'` | 弹出位置 |
| round | `boolean` | `true` | 是否显示圆角 |
| closeable | `boolean` | `false` | 是否显示关闭按钮 |

---

### UiGoodsCard - 商品卡片

商品卡片组件，用于商品列表展示。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | `string` | - | 商品 ID |
| cover | `string` | - | 封面图 |
| title | `string` | - | 标题 |
| price | `number` | - | 价格 |
| originalPrice | `number` | - | 原价 |
| tags | `string[]` | `[]` | 标签 |
| sales | `number` | `0` | 销量 |

---

### UiWaterfalls - 瀑布流

瀑布流组件，用于商品列表。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `number` | `2` | 列数 |
| gap | `number` | `16` | 间距 |
| list | `any[]` | `[]` | 数据列表 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| loadMore | - | 加载更多 |

---

## 布局组件 (Layout)

### TheTabbar - 底部导航栏

底部导航栏组件，支持 Tab 切换和中间发布按钮。

#### 文件位置

```
src/components/layout/TheTabbar.vue
```

#### 特点

- 毛玻璃风格背景
- 中间悬浮发布按钮（渐变效果）
- 消息徽标支持
- 底部安全区域自动适配
- 点击缩放动画反馈

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| current | `number` | `0` | 当前选中的 Tab 索引 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| change | `(index: number, item: TabItem)` | Tab 切换时触发 |
| centerClick | - | 中间发布按钮点击时触发 |

#### TabItem 结构

```typescript
interface TabItem {
  pagePath: string;      // 页面路径
  text: string;          // 文字
  selectedText?: string; // 选中时文字
  icon: string;          // 图标名称
  selectedIcon?: string; // 选中时图标
  iconSize?: number;     // 图标大小
  isCenter?: boolean;    // 是否为中间按钮
  badge?: number;        // 徽标数
  name?: string;         // 标识名称
}
```

#### 使用示例

```vue
<template>
  <view class="page-container">
    <!-- 页面内容 -->
    
    <TheTabbar 
      :current="currentIndex" 
      @change="handleTabChange"
      @centerClick="handlePublish"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentIndex = ref(0);

const handleTabChange = (index: number, item: any) => {
  currentIndex.value = index;
  console.log('切换到:', item.text);
};

const handlePublish = () => {
  uni.navigateTo({
    url: '/pages-sub/seller/publish/entry'
  });
};
</script>

<style scoped>
.page-container {
  padding-bottom: 120rpx;
}
</style>
```

#### 事件处理示例

```typescript
// 更新消息徽标
const tabbarRef = ref();
tabbarRef.value?.updateBadge('message', 5);

// 监听来自 App.vue 或全局的状态变化
import { useChatStore } from '@/stores';

const chatStore = useChatStore();

// 监听未读消息数变化
watch(
  () => chatStore.totalUnreadCount,
  (count) => {
    tabbarRef.value?.updateBadge('message', count);
  }
);
```

---

## 自动导入配置

组件已在 `pages.json` 中配置自动导入：

```json
{
  "easycom": {
    "custom": {
      "^UiButton": "@/ui-kit/atoms/UiButton.vue",
      "^UiIcon": "@/ui-kit/atoms/UiIcon.vue",
      "^UiInput": "@/ui-kit/molecules/UiInput.vue",
      "^UiCard": "@/ui-kit/organisms/UiCard.vue"
    }
  }
}
```

使用时无需手动导入：

```vue
<template>
  <UiButton>按钮</UiButton>
  <UiCard title="卡片">内容</UiCard>
</template>
```
