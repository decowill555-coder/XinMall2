<template>
  <view class="the-tabbar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tabbar-item"
      :class="{ 'is-active': currentIndex === index, 'is-center': item.isCenter }"
      @click="handleClick(index, item)"
    >
      <!-- 中间发布按钮 -->
      <view v-if="item.isCenter" class="center-button">
        <view class="center-icon-wrapper">
          <UiIcon name="plus" :size="24" color="#FFFFFF" />
        </view>
      </view>
      
      <!-- 普通 Tab -->
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
    
    <!-- 顶部安全线 -->
    <view class="tabbar-safe-line" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
  current?: number;
}

const props = withDefaults(defineProps<Props>(), {
  current: 0
});

const emit = defineEmits<{
  change: [index: number, item: TabItem];
  centerClick: [];
}>();

const appStore = useAppStore();
const currentIndex = ref(props.current);

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
    emit('centerClick');
    return;
  }
  
  if (currentIndex.value === index) return;
  
  currentIndex.value = index;
  emit('change', index, item);
  
  if (item.pagePath) {
    uni.switchTab({
      url: '/' + item.pagePath
    });
  }
};

const setCurrent = (index: number) => {
  currentIndex.value = index;
};

const updateBadge = (name: string, badge: number) => {
  const item = tabList.value.find(t => t.name === name);
  if (item) {
    item.badge = badge;
  }
};

defineExpose({
  setCurrent,
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
  background: $glass-white-high;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  border-top: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.03);
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
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
      border-radius: 50%;
      box-shadow: 
        0 8rpx 20rpx rgba($color-primary, 0.4),
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
  color: #FFFFFF;
  background: $color-error;
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
    color: $color-primary;
    font-weight: 500;
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
    rgba($color-primary, 0.1) 20%,
    rgba($color-primary, 0.1) 80%,
    transparent 100%
  );
}
</style>
