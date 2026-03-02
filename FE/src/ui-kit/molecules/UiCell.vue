<template>
  <view 
    class="ui-cell"
    :class="[
      { 'is-glass': glass },
      { 'no-border': !border },
      { 'is-separated': separated }
    ]"
    @click="handleClick"
  >
    <!-- 左侧：图标 + 标题 -->
    <view class="cell-left">
      <ui-icon v-if="icon" :name="icon" ::size="40" :color="iconColor" class="cell-icon" />
      <view class="cell-title-group">
        <text class="cell-title">{{ title }}</text>
        <text v-if="label" class="cell-label">{{ label }}</text>
      </view>
    </view>

    <!-- 右侧：值 + 箭头 -->
    <view class="cell-right">
      <text class="cell-value" :style="{ color: valueColor }">{{ value }}</text>
      <slot name="right-icon">
        <ui-icon v-if="isLink" name="arrow-right" ::size="40" :color="'#A1A1A6'" class="arrow" />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  value?: string;
  label?: string;
  icon?: string;
  iconColor?: string;
  isLink?: boolean;
  url?: string;
  border?: boolean;
  glass?: boolean;
  separated?: boolean;
  customClass?: string;
  valueColor?: string;
}>(), {
  border: true,
  glass: false,
  separated: false,
  isLink: false,
  iconColor: '#1D1D1F'
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
  if (props.url) {
    uni.navigateTo({ url: props.url });
  }
};
</script>

<style lang="scss" scoped>
.ui-cell {
  position: relative;
  @include flex-between;
  padding: $space-lg $space-md;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid $glass-border-subtle;
  box-shadow: $glass-shadow-sm;
  transition: all $duration-fast $ease-spring;

  &:active {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    transform: scale(0.99);
    box-shadow: $glass-shadow-xs;
  }

  &.is-glass {
    @include crystal-glass($blur-md, 0.5);
    border: 1rpx solid $glass-border-light;
    box-shadow: $glass-shadow-sm;
    
    &:active { 
      opacity: 0.8;
      backdrop-filter: blur($blur-sm);
    }
    
    .cell-title { color: $color-text-main; }
    .cell-value { color: $color-text-sub; }
  }

  .cell-left {
    display: flex;
    align-items: center;
    
    .cell-icon { 
      margin-right: $space-sm;
      filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
    }
    
    .cell-title {
      font-size: $font-size-md;
      color: $color-text-main;
      font-weight: $font-weight-medium;
      background: linear-gradient(135deg, $color-text-main 0%, $color-text-sub 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .cell-label {
      margin-left: $space-sm;
      font-size: $font-size-xs;
      color: $color-text-sub;
      opacity: 0.8;
    }
  }

  .cell-right {
    display: flex;
    align-items: center;
    
    .cell-value {
      font-size: $font-size-md;
      color: $color-text-sub;
      font-weight: $font-weight-medium;
    }
    
    .arrow {
      margin-left: $space-xs;
      opacity: 0.6;
      transition: transform $duration-fast $ease-spring;
    }
  }

  &:not(.no-border)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: $space-md;
    right: $space-md;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $color-divider 50%,
      transparent 100%
    );
    transform: scaleY(0.5);
  }

  &.is-separated {
    margin-bottom: $space-sm;
    border-radius: $radius-md;
    box-shadow: 
      0 4rpx 16rpx rgba(0, 0, 0, 0.06),
      0 2rpx 8rpx rgba(0, 0, 0, 0.04),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.8);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &::after {
      display: none;
    }
    
    &:active {
      box-shadow: 
        0 2rpx 8rpx rgba(0, 0, 0, 0.04),
        0 1rpx 4rpx rgba(0, 0, 0, 0.02),
        inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
