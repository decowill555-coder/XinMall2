<template>
  <view class="ui-alphabet-index-list">
    <view 
      v-for="group in categories" 
      :key="group.letter" 
      :id="`letter-${group.letter}`"
      class="letter-section"
    >
      <view class="letter-header">
        <view class="letter-badge">
          <text class="letter-text">{{ group.letter }}</text>
        </view>
        <text class="letter-count">{{ group.categories.length }}个分类</text>
      </view>
      
      <view v-if="group.categories.length > 0" class="category-list">
        <view 
          v-for="(item, index) in group.categories" 
          :key="item.id" 
          class="category-item"
          :class="{ 'is-pressed': pressedId === item.id }"
          @click="handleSelect(item)"
          @touchstart="pressedId = item.id"
          @touchend="pressedId = ''"
        >
          <view class="item-indicator" :style="{ background: getIndicatorColor(index) }" />
          <text class="category-name">{{ item.name }}</text>
          <view class="category-meta">
            <text class="category-count">{{ formatCount(item.productCount) }}</text>
            <ui-icon name="chevron-right" :size="28" color="#C4C0BE" />
          </view>
        </view>
      </view>
      
      <view v-else class="empty-section">
        <text>暂无分类</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { AlphabetCategory, CategoryItem } from '@/api/category';

interface Props {
  categories: AlphabetCategory[];
  currentLetter?: string;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  currentLetter: 'A'
});

const emit = defineEmits<{
  'select': [item: CategoryItem];
  'update:currentLetter': [letter: string];
}>();

const pressedId = ref<string>('');

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const getIndicatorColor = (index: number): string => {
  const colors = [
    'linear-gradient(180deg, #FF6A00 0%, #FF8F00 100%)',
    'linear-gradient(180deg, #5856D6 0%, #7B79E8 100%)',
    'linear-gradient(180deg, #34C759 0%, #5AD97A 100%)',
    'linear-gradient(180deg, #FF3B30 0%, #FF6B6B 100%)',
    'linear-gradient(180deg, #00D2FF 0%, #4DE8FF 100%)',
    'linear-gradient(180deg, #E879F9 0%, #F0A3FA 100%)'
  ];
  return colors[index % colors.length];
};

const handleSelect = (item: CategoryItem) => {
  emit('select', item);
};
</script>

<style lang="scss" scoped>
.ui-alphabet-index-list {
  position: relative;
}

.letter-section {
  margin-bottom: $space-lg;
}

.letter-header {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-md;
  margin-bottom: $space-sm;
}

.letter-badge {
  width: 56rpx;
  height: 56rpx;
  background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 106, 0, 0.25);
  
  .letter-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: #FFFFFF;
  }
}

.letter-count {
  font-size: $font-size-sm;
  color: $color-text-sub;
}

.category-list {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.category-item {
  display: flex;
  align-items: center;
  padding: $space-md $space-md $space-md $space-sm;
  border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  transition: all $duration-fast $ease-spring;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active,
  &.is-pressed {
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    transform: scale(0.99);
  }
}

.item-indicator {
  width: 6rpx;
  height: 48rpx;
  border-radius: $radius-full;
  margin-right: $space-md;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-text-main;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: $space-sm;
}

.category-count {
  font-size: $font-size-sm;
  color: $color-text-sub;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  padding: 4rpx 16rpx;
  border-radius: $radius-full;
}

.empty-section {
  padding: $space-xl;
  text-align: center;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border-radius: $radius-xl;
  
  text {
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }
}

[data-theme="dark"] {
  .letter-badge {
    background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
    box-shadow: 0 4rpx 12rpx rgba(217, 70, 239, 0.3);
  }
  
  .letter-count {
    color: var(--color-text-sub, #A1A1AA);
  }
  
  .category-list {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
    border-bottom: 1px solid transparent;
    border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .category-item {
    border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    
    &:active,
    &.is-pressed {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .category-name {
    color: var(--color-text-main, #F2F2F7);
  }
  
  .category-count {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text-sub, #A1A1AA);
  }
  
  .empty-section {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    
    text {
      color: var(--color-text-disabled, #52525B);
    }
  }
}
</style>
