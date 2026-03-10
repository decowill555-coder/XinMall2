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
        <view class="item-icon">
          <image 
            v-if="item.icon" 
            :src="item.icon" 
            class="icon-image"
            mode="aspectFit"
          />
          <view v-else class="icon-placeholder">
            <text class="placeholder-text">{{ item.name?.charAt(0) }}</text>
          </view>
        </view>
        <text class="item-name">{{ item.name }}</text>
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
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  columns: 4
});

const emit = defineEmits<{
  'select': [item: DeviceCategory];
}>();

const pressedId = ref<string>('');

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
  padding: $space-md;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.grid-container {
  display: grid;
  gap: $space-xs;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-md $space-sm;
  border-radius: $radius-lg;
  transition: all $duration-fast $ease-spring;
  
  &:active,
  &.is-pressed {
    transform: scale(0.96);
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  }
}

.item-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $space-sm;
  background: $color-bg-gray;
  overflow: hidden;
  transition: all $duration-fast $ease-spring;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.08);
  }
}

.icon-image {
  width: 56rpx;
  height: 56rpx;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 106, 0, 0.1) 0%, rgba(255, 143, 0, 0.05) 100%);
  
  .placeholder-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: var(--color-primary, #FF6A00);
  }
}

.item-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-main;
  text-align: center;
  line-height: 1.3;
}

[data-theme="dark"] {
  .ui-device-category-grid {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .grid-item {
    &:active,
    &.is-pressed {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .item-icon {
    background: rgba(255, 255, 255, 0.08);
  }
  
  .icon-placeholder {
    background: linear-gradient(135deg, rgba(217, 70, 239, 0.15) 0%, rgba(217, 70, 239, 0.05) 100%);
    
    .placeholder-text {
      color: var(--color-primary, #D946EF);
    }
  }
}
</style>
