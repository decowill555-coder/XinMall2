<template>
  <view class="ui-load-more" @click="handleClick">
    <block v-if="status === 'loading'">
      <view class="loading-icon" />
      <text class="load-text">{{ loadingText }}</text>
    </block>
    <block v-else-if="status === 'hasMore'">
      <text class="load-text">{{ hasMoreText }}</text>
    </block>
    <block v-else-if="status === 'noMore'">
      <text class="load-text no-more">{{ noMoreText }}</text>
    </block>
    <block v-else-if="status === 'error'">
      <ui-icon name="refresh" :size="32" color="#A1A1A6" />
      <text class="load-text error">{{ errorText }}</text>
    </block>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  status?: 'loading' | 'hasMore' | 'noMore' | 'error';
  loadingText?: string;
  hasMoreText?: string;
  noMoreText?: string;
  errorText?: string;
}>(), {
  status: 'hasMore',
  loadingText: '加载中...',
  hasMoreText: '上拉加载更多',
  noMoreText: '没有更多了',
  errorText: '加载失败，点击重试'
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit('click');
};
</script>

<style lang="scss" scoped>
.ui-load-more {
  @include flex-center;
  padding: $space-lg;
  
  .loading-icon {
    width: 32rpx;
    height: 32rpx;
    border: 4rpx solid $color-divider;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: $space-sm;
  }
  
  .load-text {
    font-size: $font-size-sm;
    color: $color-text-sub;
    
    &.no-more {
      color: $color-text-disabled;
    }
    
    &.error {
      color: $color-error;
    }
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
