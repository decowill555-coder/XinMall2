<template>
  <view class="ui-device-category-grid">
    <view class="grid-container" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <view 
        v-for="item in categories" 
        :key="item.id" 
        class="grid-item"
        :class="{ 'is-pressed': pressedId === item.id }"
        @click="handleSelect(item)"
        @touchstart="pressedId = item.id"
        @touchend="pressedId = ''"
      >
        <view class="item-icon" :style="{ background: getIconBg(item.icon) }">
          <ui-icon :name="item.icon" :size="52" :color="iconColor" />
        </view>
        <text class="item-name">{{ item.name }}</text>
        <text class="item-count">{{ formatCount(item.productCount) }}件</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DeviceCategory } from '@/api/category';

interface Props {
  categories: DeviceCategory[];
  columns?: number;
  iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  columns: 4,
  iconColor: '#FF6A00'
});

const emit = defineEmits<{
  'select': [item: DeviceCategory];
}>();

const pressedId = ref<string>('');

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

const getIconBg = (icon: string): string => {
  const bgMap: Record<string, string> = {
    'phone': 'linear-gradient(135deg, rgba(255, 106, 0, 0.12) 0%, rgba(255, 143, 0, 0.08) 100%)',
    'laptop': 'linear-gradient(135deg, rgba(88, 86, 214, 0.12) 0%, rgba(88, 86, 214, 0.08) 100%)',
    'tablet': 'linear-gradient(135deg, rgba(52, 199, 89, 0.12) 0%, rgba(52, 199, 89, 0.08) 100%)',
    'desktop': 'linear-gradient(135deg, rgba(255, 59, 48, 0.12) 0%, rgba(255, 59, 48, 0.08) 100%)',
    'camera': 'linear-gradient(135deg, rgba(255, 214, 10, 0.12) 0%, rgba(255, 214, 10, 0.08) 100%)',
    'headphone': 'linear-gradient(135deg, rgba(0, 210, 255, 0.12) 0%, rgba(0, 210, 255, 0.08) 100%)',
    'watch': 'linear-gradient(135deg, rgba(232, 121, 249, 0.12) 0%, rgba(232, 121, 249, 0.08) 100%)',
    'game': 'linear-gradient(135deg, rgba(244, 114, 182, 0.12) 0%, rgba(244, 114, 182, 0.08) 100%)',
    'speaker': 'linear-gradient(135deg, rgba(255, 143, 0, 0.12) 0%, rgba(255, 143, 0, 0.08) 100%)',
    'keyboard': 'linear-gradient(135deg, rgba(52, 199, 89, 0.12) 0%, rgba(52, 199, 89, 0.08) 100%)',
    'mouse': 'linear-gradient(135deg, rgba(88, 86, 214, 0.12) 0%, rgba(88, 86, 214, 0.08) 100%)',
    'monitor': 'linear-gradient(135deg, rgba(255, 106, 0, 0.12) 0%, rgba(255, 106, 0, 0.08) 100%)'
  };
  return bgMap[icon] || 'linear-gradient(135deg, rgba(255, 106, 0, 0.12) 0%, rgba(255, 143, 0, 0.08) 100%)';
};

const handleSelect = (item: DeviceCategory) => {
  emit('select', item);
};
</script>

<style lang="scss" scoped>
.ui-device-category-grid {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-xl;
  padding: $space-lg;
  box-shadow: $glass-shadow-md;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.grid-container {
  display: grid;
  gap: $space-md;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-md 0;
  border-radius: $radius-lg;
  transition: all $duration-fast $ease-spring;
  position: relative;
  
  &:active,
  &.is-pressed {
    transform: scale(0.95);
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  }
}

.item-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $space-sm;
  box-shadow: $glass-shadow-xs;
  transition: all $duration-fast $ease-spring;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: $radius-xl $radius-xl 0 0;
  }
}

.item-name {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-text-main;
  margin-bottom: 4rpx;
}

.item-count {
  font-size: $font-size-xs;
  color: $color-text-sub;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  padding: 2rpx 12rpx;
  border-radius: $radius-full;
}

[data-theme="dark"] {
  .ui-device-category-grid {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
    border-bottom: 1px solid transparent;
    border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .grid-item {
    &:active,
    &.is-pressed {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .item-count {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text-sub, #A1A1AA);
  }
}
</style>
