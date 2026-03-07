<template>
  <view class="the-tabbar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tabbar-item"
      :class="{ 'is-active': currentIndex === index, 'is-center': item.isCenter }"
      @click="handleClick(index, item)"
    >
      <view v-if="item.isCenter" class="center-button">
        <view class="center-icon-wrapper">
          <UiIcon name="plus" :size="40" color="#FFFFFF" />
        </view>
      </view>
      
      <template v-else>
        <view class="tabbar-icon">
          <UiIcon :name="currentIndex === index ? item.selectedIcon : item.icon" :size="item.iconSize || 22" />
          <view v-if="item.badge && item.badge > 0" class="tabbar-badge">
            {{ item.badge > 99 ? '99+' : item.badge }}
          </view>
        </view>
        <text class="tabbar-text">{{ currentIndex === index ? item.selectedText || item.text : item.text }}</text>
      </template>
    </view>
    
    <view class="tabbar-safe-line" />
  </view>
  
  <ui-popup v-model:show="showPublishPicker" position="bottom" round>
    <view class="publish-picker">
      <view class="picker-header">
        <text class="picker-title">选择发布类型</text>
        <view class="picker-close" @click="showPublishPicker = false">
          <ui-icon name="x" :size="32" color="#A1A1A6" />
        </view>
      </view>
      <view class="picker-content">
        <view class="picker-item" @click="handlePublish('goods')">
          <view class="item-icon goods">
            <ui-icon name="shopping-bag" :size="48" color="#FFFFFF" />
          </view>
          <text class="item-title">发布商品</text>
          <text class="item-desc">出售闲置数码产品</text>
        </view>
        <view class="picker-item" @click="handlePublish('post')">
          <view class="item-icon post">
            <ui-icon name="edit-3" :size="48" color="#FFFFFF" />
          </view>
          <text class="item-title">发布帖子</text>
          <text class="item-desc">分享数码生活体验</text>
        </view>
      </view>
    </view>
  </ui-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores';

interface TabItem {
  pagePath: string;
  text: string;
  selectedText?: string;
  icon: string;
  selectedIcon?: string;
  iconSize?: number;
  isCenter?: boolean;
  badge?: number;
  name?: string;
}

interface Props {
  current?: string;
}

const props = withDefaults(defineProps<Props>(), {
  current: 'index'
});

const emit = defineEmits<{
  change: [index: number, item: TabItem];
  centerClick: [];
}>();

const appStore = useAppStore();

const showPublishPicker = ref(false);

const currentIndex = computed(() => {
  return tabList.value.findIndex(item => item.name === props.current);
});

const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);

const tabList = ref<TabItem[]>([
  {
    pagePath: 'pages/index/index',
    text: '推荐',
    selectedText: '推荐',
    icon: 'home',
    selectedIcon: 'home',
    name: 'index'
  },
  {
    pagePath: 'pages/follow/index',
    text: '关注',
    selectedText: '关注',
    icon: 'star',
    selectedIcon: 'star',
    name: 'follow'
  },
  {
    pagePath: '',
    text: '',
    icon: '',
    isCenter: true,
    name: 'publish'
  },
  {
    pagePath: 'pages/message/index',
    text: '消息',
    selectedText: '消息',
    icon: 'bell',
    selectedIcon: 'bell',
    badge: 0,
    name: 'message'
  },
  {
    pagePath: 'pages/my/index',
    text: '我的',
    selectedText: '我的',
    icon: 'user',
    selectedIcon: 'user',
    name: 'my'
  }
]);

const handleClick = (index: number, item: TabItem) => {
  if (item.isCenter) {
    showPublishPicker.value = !showPublishPicker.value;
    return;
  }
  
  if (currentIndex.value === index) return;
  
  emit('change', index, item);
  
  if (item.pagePath) {
    uni.switchTab({
      url: '/' + item.pagePath
    });
  }
};

const handlePublish = (type: 'goods' | 'post') => {
  showPublishPicker.value = false;
  if (type === 'goods') {
    uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
  } else {
    uni.navigateTo({ url: '/pages-sub/content/post/publish' });
  }
};

const updateBadge = (name: string, badge: number) => {
  const item = tabList.value.find(t => t.name === name);
  if (item) {
    item.badge = badge;
  }
};

defineExpose({
  updateBadge
});
</script>

<style lang="scss" scoped>
.the-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100rpx;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: 
    0 -4rpx 20rpx rgba(0, 0, 0, 0.03),
    inset 0 0 0 1rpx rgba(255, 255, 255, 0.5);
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  position: relative;
  
  &.is-center {
    flex: 0.8;
    
    .center-button {
      position: relative;
      top: -30rpx;
    }
    
    .center-icon-wrapper {
      width: 100rpx;
      height: 100rpx;
      @include flex-center;
      background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, var(--color-primary-dark, #E55D00) 100%);
      border-radius: 50%;
      box-shadow: 
        0 8rpx 20rpx rgba(255, 106, 0, 0.4),
        inset 0 2rpx 0 rgba(255, 255, 255, 0.2);
      transition: transform 0.2s ease;
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.tabbar-icon {
  position: relative;
  width: 44rpx;
  height: 44rpx;
  @include flex-center;
}

.tabbar-badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: var(--color-text-white, #FFFFFF);
  background: var(--color-error, #FF3B30);
  border-radius: 16rpx;
  @include flex-center;
}

.tabbar-text {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: $color-text-sub;
  transition: color 0.2s ease;
}

.is-active {
  .tabbar-text {
    color: var(--color-primary, #FF6A00);
    font-weight: 500;
  }
  
  .tabbar-icon {
    &::after {
      content: '';
      position: absolute;
      top: -12rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 32rpx;
      height: 4rpx;
      background: var(--color-primary, #FF6A00);
      border-radius: 2rpx;
    }
  }
}

.tabbar-safe-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rpx;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 106, 0, 0.1) 20%,
    rgba(255, 106, 0, 0.1) 80%,
    transparent 100%
  );
}

.the-tabbar--modern {
  height: $height-tabbar;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border-top: none;
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.06);
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  font-family: $font-family-system;
  
  .tabbar-item {
    height: $height-tabbar;
    
    &.is-center {
      .center-icon-wrapper {
        width: 104rpx;
        height: 104rpx;
        background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, #FF8533 100%);
        box-shadow: 
          0 8rpx 24rpx rgba(255, 106, 0, 0.4),
          inset 0 2rpx 0 rgba(255, 255, 255, 0.3);
        
        &:active {
          transform: scale(0.95);
          box-shadow: 
            0 4rpx 12rpx rgba(255, 106, 0, 0.3),
            inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
  
  .tabbar-icon {
    width: $height-tabbar-icon;
    height: $height-tabbar-icon;
    transition: all $duration-fast $ease-spring;
  }
  
  .tabbar-text {
    font-size: 22rpx;
    color: var(--color-text-sub, #867A76);
  }
  
  .is-active {
    .tabbar-text {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
    
    .tabbar-icon {
      transform: scale(1.1);
    }
    
    .tabbar-icon::after {
      display: none;
    }
  }
  
  .tabbar-safe-line {
    display: none;
  }
}

.publish-picker {
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-xxl);
  -webkit-backdrop-filter: blur($blur-xxl);
  border-radius: $radius-xl $radius-xl 0 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  
  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-lg $space-md;
    border-bottom: 1rpx solid var(--glass-border-light, rgba(0, 0, 0, 0.06));
    
    .picker-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .picker-close {
      padding: $space-xs;
      border-radius: 50%;
      background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    }
  }
  
  .picker-content {
    display: flex;
    padding: $space-lg $space-md;
    gap: $space-md;
    
    .picker-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $space-lg $space-md;
      background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
      border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
      border-radius: $radius-lg;
      transition: all $duration-fast $ease-spring;
      
      &:active {
        transform: scale(0.98);
        background: var(--color-bg-gray, rgba(0, 0, 0, 0.06));
      }
      
      .item-icon {
        width: 100rpx;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-bottom: $space-md;
        
        &.goods {
          background: linear-gradient(135deg, #FF6A00 0%, #FF8C00 100%);
          box-shadow: 0 8rpx 24rpx rgba(255, 106, 0, 0.3);
        }
        
        &.post {
          background: linear-gradient(135deg, #C026D3 0%, #F43F5E 100%);
          box-shadow: 0 8rpx 24rpx rgba(192, 38, 211, 0.3);
        }
      }
      
      .item-title {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
        margin-bottom: $space-xs;
      }
      
      .item-desc {
        font-size: $font-size-xs;
        color: $color-text-sub;
      }
    }
  }
}
</style>
