<template>
  <view class="tabbar-container">
    <!-- 1. 占位块：防止页面内容被 Tabbar 遮挡 -->
    <view class="tabbar-placeholder"></view>

    <!-- 2. 实体 Tabbar -->
    <view class="tabbar-body glass-panel">
      <view 
        v-for="(item, index) in tabs" 
        :key="item.name"
        class="tabbar-item"
        :class="{ 'is-special': item.isSpecial, 'is-active': current === index }"
        @tap="handleSwitch(index, item)"
      >
        <!-- A. 中间特殊按钮 (发布) -->
        <view v-if="item.isSpecial" class="special-btn">
          <text class="iconfont" :class="`icon-${item.icon}`"></text>
        </view>

        <!-- B. 普通按钮 -->
        <template v-else>
          <view class="icon-wrapper">
            <text 
              class="iconfont tab-icon" 
              :class="[`icon-${current === index ? item.activeIcon : item.icon}`]"
            ></text>
            <!-- 红点徽标 -->
            <view v-if="item.badge" class="badge">{{ item.badge }}</view>
          </view>
          <text class="tab-label">{{ item.label }}</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TabItem } from '@/types/tabbar';

interface Props {
  current: number; // 当前选中的索引 (0-4)
}
const props = defineProps<Props>();

// Tab 配置 (建议放到常量文件或 Store 中管理)
const tabs: TabItem[] = [
  { 
    name: 'recommend', 
    label: '推荐', 
    icon: 'compass', 
    activeIcon: 'compass-fill', 
    path: '/pages/index/index' 
  },
  { 
    name: 'follow', 
    label: '关注', 
    icon: 'heart', 
    activeIcon: 'heart-fill', 
    path: '/pages/follow/index' 
  },
  { 
    name: 'publish', 
    label: '发布', 
    icon: 'plus', 
    activeIcon: 'plus', 
    path: '/pages/publish/entry', // 注意：发布通常是跳转新页面或弹窗，而不是切换Tab
    isSpecial: true 
  },
  { 
    name: 'message', 
    label: '消息', 
    icon: 'chat', 
    activeIcon: 'chat-fill', 
    path: '/pages/message/index',
    badge: 2 // 示例：2条未读
  },
  { 
    name: 'my', 
    label: '我的', 
    icon: 'user', 
    activeIcon: 'user-fill', 
    path: '/pages/my/index' 
  }
];

const handleSwitch = (index: number, item: TabItem) => {
  // 如果是发布按钮，通常不需要改变 active 状态，而是执行动作
  if (item.isSpecial) {
    uni.navigateTo({ url: item.path });
    return;
  }

  // 避免重复点击
  if (props.current !== index) {
    uni.switchTab({
      url: item.path
    });
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_tokens.scss';
@import '@/assets/styles/_mixins.scss';

// 变量定义
$tabbar-height: 100rpx;
$special-btn-size: 110rpx;

.tabbar-container {
  position: relative;
  width: 100%;
  z-index: 999;
}

.tabbar-placeholder {
  width: 100%;
  height: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
}

.tabbar-body {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(#{$tabbar-height} + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom); // 适配 iPhone X 底部黑条
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  
  // 应用毛玻璃 Mixin
  @include glass-effect(20rpx, 0.85); 
  border-top-left-radius: $radius-lg; // 顶部稍微圆角，更现代
  border-top-right-radius: $radius-lg;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.03); // 顶部微弱投影
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  
  // 交互反馈
  &:active {
    .tab-icon { transform: scale(0.9); }
  }

  // 选中态颜色
  &.is-active {
    .tab-label { color: $color-primary; font-weight: 500; }
    .tab-icon { color: $color-primary; }
  }
}

.icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48rpx;
  height: 48rpx;
}

.tab-icon {
  font-size: 44rpx;
  color: #999; // 未选中颜色 (建议提取到 Token: $color-text-placeholder)
  transition: all 0.2s ease;
}

.tab-label {
  font-size: 20rpx;
  margin-top: 6rpx;
  color: #999;
}

// --- 中间凸起按钮 (发布) ---
.is-special {
  // 让它不参与普通的 flex 压缩
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: center;

  .special-btn {
    width: $special-btn-size;
    height: $special-btn-size;
    border-radius: 50%;
    // 渐变背景 (科技蓝)
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    // 强烈的彩色投影
    box-shadow: 0 8rpx 20rpx rgba($color-primary, 0.4);
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    // 悬浮凸起核心代码
    margin-top: -50rpx; 
    border: 6rpx solid rgba(255, 255, 255, 0.8); // 加上白色边框，区分背景

    .iconfont {
      color: #fff;
      font-size: 56rpx;
      font-weight: bold;
    }
  }

  // 按下反馈
  &:active .special-btn {
    transform: scale(0.95) translateY(2rpx);
    box-shadow: 0 4rpx 10rpx rgba($color-primary, 0.4);
  }
}

// --- 红点徽标 ---
.badge {
  position: absolute;
  top: -4rpx;
  right: -10rpx;
  background-color: $color-error;
  color: #fff;
  font-size: 18rpx;
  height: 28rpx;
  min-width: 28rpx;
  padding: 0 6rpx;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff; // 白色描边，增强分割感
}
</style>