# 智能导航系统

## 概述

智能导航系统是 XinMall 前端应用的核心导航解决方案，提供层级化页面管理和智能返回功能。系统根据页面栈深度自动选择最优导航策略，确保用户体验流畅。

## 核心特性

- **层级化页面管理**：通过 PageLevel 区分页面层级（0-3级）
- **智能返回策略**：页面栈 ≤ 15 页时简单返回，> 15 页时智能跳转
- **分组跳过机制**：同组页面可跳过，避免循环导航
- **认证拦截**：无缝处理需登录页面的访问控制
- **统一 API**：通过 Composable 提供一致的调用方式

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    智能导航系统架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  UiNavbar.vue   │    │ UiSubNavbar.vue │                │
│  │  (主导航栏)      │    │  (子导航栏)      │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                          │
│           └──────────┬───────────┘                          │
│                      ▼                                      │
│           ┌─────────────────────┐                           │
│           │   useNavigation()   │  (Composable)             │
│           │   - smartBack       │                           │
│           │   - backToLevel     │                           │
│           │   - navigateTo      │                           │
│           │   - ...             │                           │
│           └──────────┬──────────┘                           │
│                      ▼                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              navigation.ts (核心工具)                   │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  页面配置表 (PAGE_CONFIGS)                              │  │
│  │  - Level 0: Tab页 (首页/关注/消息/我的)                  │  │
│  │  - Level 1: 一级页 (搜索/购物车/订单列表等)              │  │
│  │  - Level 2: 二级页 (商品详情/订单详情等)                 │  │
│  │  - Level 3: 三级页 (支付/发布/编辑等)                    │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  智能返回逻辑:                             │  │
│  │  1. 检查页面栈深度                                      │  │
│  │  2. ≤ 15 页: 直接返回上一页                             │  │
│  │  3. > 15 页: 按层级查找返回目标                         │  │
│  │  4. 跳过同组/同层级页面                                 │  │
│  │  5. 返回到更低层级或首页                                │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 页面层级定义

| 层级 | 说明 | 示例页面 |
|------|------|----------|
| Level 0 | Tab 页面 | 首页、关注、消息、我的 |
| Level 1 | 一级页面 | 搜索、购物车、订单列表、商品管理、设置 |
| Level 2 | 二级页面 | 商品详情、订单详情、帖子详情、论坛详情 |
| Level 3 | 三级页面 | 支付、发布闲置、编辑商品、发布帖子 |

## 核心文件

### 1. 导航工具模块

**路径**: `src/utils/navigation.ts`

核心实现文件，包含页面配置、导航函数和认证拦截逻辑。

### 2. 导航 Composable

**路径**: `src/composables/useNavigation.ts`

封装导航工具函数，提供 Vue 组件可用的组合式 API。

## API 参考

### NavigationOptions 配置项

```typescript
interface NavigationOptions {
  skipSameGroup?: boolean;    // 是否跳过同组页面，默认 true
  skipSameLevel?: boolean;    // 是否跳过同层级页面，默认 false
  targetLevel?: PageLevel;    // 目标返回层级
  fallbackUrl?: string;       // 回退 URL，默认首页
  forceSmart?: boolean;       // 强制使用智能导航，默认 false
}
```

### 核心函数

#### smartBack(options?)

智能返回函数，根据页面栈深度自动选择导航策略。

**导航策略**：
- 页面栈 ≤ 15 页：直接返回上一页
- 页面栈 > 15 页：按层级智能跳转
- 设置 `forceSmart: true`：强制使用智能导航

```typescript
import { smartBack } from '@/utils/navigation';
// 或
const { smartBack } = useNavigation();

// 默认行为
smartBack();

// 强制智能导航
smartBack({ forceSmart: true });

// 返回到指定层级
smartBack({ targetLevel: 1 });

// 自定义回退页面
smartBack({ fallbackUrl: '/pages/index/index' });
```

#### backToLevel(targetLevel)

返回到指定层级。

```typescript
backToLevel(1);  // 返回到一级页面
backToLevel(0);  // 返回到 Tab 页
```

#### backToPreviousLevel()

返回到上一层级。

```typescript
backToPreviousLevel();
```

#### backToHome()

返回首页。

```typescript
backToHome();
```

#### navigateTo(url)

导航到指定页面（保留当前页面）。

```typescript
navigateTo('/pages-sub/trade/product/detail?id=123');
```

#### redirectTo(url)

重定向到指定页面（关闭当前页面）。

```typescript
redirectTo('/pages-sub/trade/order/confirm');
```

#### switchToTab(url)

切换到 Tab 页面。

```typescript
switchToTab('/pages/index/index');
```

#### navigateBack(delta?)

返回指定步数。

```typescript
navigateBack();     // 返回上一页
navigateBack(2);    // 返回上两页
```

#### navigateWithReplace(url, replaceIfSameLevel?)

同层级替换导航，用于避免页面栈过深。

```typescript
// 从商品详情跳转到另一个商品详情时，替换当前页面
navigateWithReplace('/pages-sub/trade/product/detail?id=456');
```

### 辅助函数

#### getStackDepth()

获取当前页面栈深度。

```typescript
const depth = getStackDepth();
console.log(`当前页面栈深度: ${depth}`);
```

#### isStackOverThreshold()

判断页面栈是否超过阈值（15页）。

```typescript
if (isStackOverThreshold()) {
  console.log('页面栈过深，建议使用智能导航');
}
```

#### getStackInfo()

获取页面栈详细信息。

```typescript
const info = getStackInfo();
// {
//   depth: 12,
//   isOverThreshold: false,
//   currentLevel: 2,
//   currentRoute: 'pages-sub/trade/product/detail'
// }
```

#### canNavigateBack()

判断是否可以返回。

```typescript
if (canNavigateBack()) {
  smartBack();
} else {
  switchToTab('/pages/index/index');
}
```

#### getPageLevel(route)

获取页面层级。

```typescript
const level = getPageLevel('pages-sub/trade/product/detail');
// 返回 2
```

#### getPageGroup(route)

获取页面分组。

```typescript
const group = getPageGroup('pages-sub/trade/product/detail');
// 返回 'product-detail'
```

#### isTabPage(route)

判断是否为 Tab 页面。

```typescript
const isTab = isTabPage('pages/index/index');
// 返回 true
```

## 使用示例

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';

const { 
  smartBack, 
  navigateTo, 
  getStackInfo,
  canNavigateBack 
} = useNavigation();

const goBack = () => {
  smartBack();
};

const goDetail = (id: string) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${id}`);
};

const logStackInfo = () => {
  console.log(getStackInfo());
};
</script>

<template>
  <view class="page">
    <ui-navbar title="商品列表" @back="goBack" />
    <!-- ... -->
  </view>
</template>
```

### 登录后重定向

```typescript
import { handleRedirectAfterLogin } from '@/utils/navigation';

// 登录成功后
const onLoginSuccess = () => {
  handleRedirectAfterLogin();  // 自动跳转到原页面
};
```

### 发布成功后智能返回

```typescript
const { smartBack } = useNavigation();

const onPublishSuccess = () => {
  uni.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => {
    smartBack();  // 智能返回到合适的页面
  }, 1500);
};
```

## 认证拦截

系统会自动拦截需要登录的页面，跳转到登录页并保存原页面路径，登录成功后自动返回。

### 需要登录的页面

以下页面在未登录状态下会自动跳转到登录页：

- 消息中心
- 我的页面
- 购物车
- 订单相关页面
- 发布相关页面
- 用户设置页面
- 钱包页面
- 认证页面

### 实现原理

```typescript
// 导航时检查认证
function navigateTo(url: string): void {
  if (isAuthRequired(url) && !isLoggedIn()) {
    // 保存目标 URL
    uni.setStorageSync('redirectUrl', url);
    // 跳转到登录页
    uni.navigateTo({ url: LOGIN_PAGE });
    return;
  }
  uni.navigateTo({ url });
}

// 登录成功后重定向
function handleRedirectAfterLogin(): void {
  const redirectUrl = uni.getStorageSync('redirectUrl');
  uni.removeStorageSync('redirectUrl');
  
  if (redirectUrl) {
    // 跳转到原页面
    uni.redirectTo({ url: redirectUrl });
  } else {
    // 默认跳转首页
    uni.switchTab({ url: '/pages/index/index' });
  }
}
```

## 页面配置表

完整的页面配置定义在 `PAGE_CONFIGS` 中：

```typescript
const PAGE_CONFIGS: Record<string, PageConfig> = {
  // Level 0 - Tab 页面
  'pages/index/index': { level: 0, name: '首页' },
  'pages/follow/index': { level: 0, name: '关注' },
  'pages/message/index': { level: 0, name: '消息' },
  'pages/my/index': { level: 0, name: '我的' },

  // Level 1 - 一级页面
  'pages-sub/search/index': { level: 1, group: 'search', name: '搜索' },
  'pages-sub/trade/cart/index': { level: 1, group: 'cart', name: '购物车' },
  'pages-sub/trade/order/list': { level: 1, group: 'order-list', name: '订单列表' },

  // Level 2 - 二级页面
  'pages-sub/trade/product/detail': { level: 2, group: 'product-detail', name: '商品详情' },
  'pages-sub/trade/order/detail': { level: 2, group: 'order-detail', name: '订单详情' },
  'pages-sub/community/post/detail': { level: 2, group: 'post-detail', name: '帖子详情' },

  // Level 3 - 三级页面
  'pages-sub/trade/pay/index': { level: 3, group: 'pay', name: '支付' },
  'pages-sub/seller/publish/entry': { level: 3, group: 'publish', name: '发布闲置' },
  'pages-sub/community/post/publish': { level: 3, group: 'post-publish', name: '发布帖子' },
};
```

## 最佳实践

### 1. 使用智能返回

在大多数情况下，使用 `smartBack()` 即可满足需求：

```typescript
const { smartBack } = useNavigation();

// 返回按钮点击
const handleBack = () => smartBack();
```

### 2. 特定场景使用特定方法

```typescript
// 发布成功后返回上一层级
const onPublishSuccess = () => {
  backToPreviousLevel();
};

// 支付成功后返回首页
const onPaySuccess = () => {
  backToHome();
};

// 查看订单详情后返回订单列表
const onBackToList = () => {
  backToLevel(1);
};
```

### 3. 避免页面栈过深

使用 `navigateWithReplace` 替代 `navigateTo`：

```typescript
// 从商品详情 A 跳转到商品详情 B 时
// 使用 replace 避免页面栈堆积
navigateWithReplace(`/pages-sub/trade/product/detail?id=${newId}`);
```

### 4. 监控页面栈状态

```typescript
const { getStackInfo, isStackOverThreshold } = useNavigation();

onMounted(() => {
  const info = getStackInfo();
  if (info.isOverThreshold) {
    console.warn('页面栈过深，建议优化导航逻辑');
  }
});
```

## 配置说明

### 修改阈值

如需修改智能导航阈值，编辑 `navigation.ts`：

```typescript
const SMART_BACK_THRESHOLD = 15;  // 修改为你需要的值
```

### 添加新页面配置

在 `PAGE_CONFIGS` 中添加新页面：

```typescript
'pages-sub/new-feature/index': { 
  level: 2, 
  group: 'new-feature', 
  name: '新功能页面' 
},
```

### 添加需要认证的页面

在 `AUTH_REQUIRED_PAGES` 数组中添加：

```typescript
const AUTH_REQUIRED_PAGES = [
  // ... 现有页面
  'pages-sub/new-feature/index',
];
```

## 相关文件

- [navigation.ts](../src/utils/navigation.ts) - 核心实现
- [useNavigation.ts](../src/composables/useNavigation.ts) - Composable 封装
- [UiNavbar.vue](../src/ui-kit/molecules/UiNavbar.vue) - 主导航栏组件
- [UiSubNavbar.vue](../src/ui-kit/molecules/UiSubNavbar.vue) - 子页面导航栏组件
