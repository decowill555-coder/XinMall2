<template>
  <view class="ui-model-search-item">
    <view class="item-cover">
      <ui-image 
        v-if="data.cover" 
        :src="data.cover" 
        width="80rpx" 
        height="80rpx" 
        radius="12rpx"
      />
      <view v-else class="cover-placeholder">
        <ui-icon name="box" :size="40" color="#A1A1A6" />
      </view>
    </view>
    
    <view class="item-content">
      <view class="item-name">
        <text class="name-text">{{ data.name }}</text>
        <text v-if="data.brand" class="brand-tag">{{ data.brand }}</text>
      </view>
      <text v-if="data.subtitle" class="item-subtitle">{{ data.subtitle }}</text>
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
</script>

<style lang="scss" scoped>
.ui-model-search-item {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.item-cover {
  flex-shrink: 0;
  
  .cover-placeholder {
    width: 80rpx;
    height: 80rpx;
    background: var(--color-bg-gray, #F5F5F7);
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
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
  
  .brand-tag {
    font-size: $font-size-xs;
    color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    padding: 4rpx 12rpx;
    border-radius: $radius-xs;
    flex-shrink: 0;
  }
}

.item-subtitle {
  font-size: $font-size-sm;
  color: $color-text-sub;
  margin-top: 4rpx;
  @include text-ellipsis(1);
}

.item-arrow {
  flex-shrink: 0;
}
</style>
