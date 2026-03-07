<template>
  <view class="ui-forum-entry-item">
    <view class="item-icon">
      <view class="forum-icon" :class="{ 'is-model': data.forumType === 'model' }">
        <ui-icon 
          :name="data.forumType === 'model' ? 'cpu' : 'users'" 
          :size="36" 
          color="#FFFFFF" 
        />
      </view>
    </view>
    
    <view class="item-content">
      <view class="item-name">
        <text class="name-text">{{ data.name }}</text>
        <text 
          class="type-tag" 
          :class="{ 'is-model': data.forumType === 'model' }"
        >
          {{ data.forumType === 'model' ? '型号论坛' : '用户论坛' }}
        </text>
      </view>
      <view class="item-meta">
        <text v-if="data.memberCount" class="meta-item">
          {{ formatCount(data.memberCount) }} 成员
        </text>
        <text v-if="data.subtitle" class="meta-item">{{ data.subtitle }}</text>
      </view>
    </view>
    
    <view class="item-arrow">
      <ui-icon name="chevron-right" :size="32" color="#C4C0BE" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { SearchSuggestionItem } from '@/api/search';

interface Props {
  data: SearchSuggestionItem;
}

defineProps<Props>();

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};
</script>

<style lang="scss" scoped>
.ui-forum-entry-item {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.item-icon {
  flex-shrink: 0;
  
  .forum-icon {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #5856D6 0%, #AF52DE 100%);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.is-model {
      background: linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%);
    }
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  display: flex;
  align-items: center;
  gap: $space-xs;
  
  .name-text {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    @include text-ellipsis(1);
  }
  
  .type-tag {
    font-size: $font-size-xs;
    color: #5856D6;
    background: rgba(88, 86, 214, 0.1);
    padding: 4rpx 12rpx;
    border-radius: $radius-xs;
    flex-shrink: 0;
    
    &.is-model {
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    }
  }
}

.item-meta {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin-top: 4rpx;
  
  .meta-item {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.item-arrow {
  flex-shrink: 0;
}
</style>
