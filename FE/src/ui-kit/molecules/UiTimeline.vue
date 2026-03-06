<template>
  <view class="ui-timeline">
    <view 
      v-for="(item, index) in items" 
      :key="index" 
      class="timeline-item"
    >
      <view class="timeline-dot" :class="{ active: index === 0 }"></view>
      <view class="timeline-content">
        <text class="timeline-title">{{ item.title }}</text>
        <text class="timeline-time">{{ item.time }}</text>
        <text v-if="item.desc" class="timeline-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TimelineItem {
  title: string;
  time?: string;
  desc?: string;
}

interface Props {
  items?: TimelineItem[];
}

withDefaults(defineProps<Props>(), {
  items: () => []
});
</script>

<style lang="scss" scoped>
.ui-timeline {
  .timeline-item {
    display: flex;
    padding-bottom: $space-md;
    
    &:last-child { padding-bottom: 0; }
    
    .timeline-dot {
      width: 16rpx;
      height: 16rpx;
      background: var(--color-border-light, rgba(0, 0, 0, 0.1));
      border-radius: 50%;
      margin-right: $space-md;
      margin-top: 6rpx;
      flex-shrink: 0;
      
      &.active {
        background: var(--color-primary, #FF6A00);
        box-shadow: 0 0 0 4rpx rgba(255, 106, 0, 0.2);
      }
    }
    
    .timeline-content {
      flex: 1;
      
      .timeline-title {
        font-size: $font-size-sm;
        color: $color-text-main;
      }
      
      .timeline-time {
        display: block;
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: $space-xs;
      }
      
      .timeline-desc {
        display: block;
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}
</style>
