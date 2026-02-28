<!-- src/ui-kit/atoms/UiBadge.vue -->
<template>
  <view class="ui-badge-wrapper">
    <slot />
    <view 
      v-if="show"
      class="ui-badge"
      :class="[
        type, 
        { 'is-dot': isDot, 'is-fixed': !!$slots.default }
      ]"
      :style="customStyle"
    >
      <text v-if="!isDot" class="badge-text">{{ displayValue }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  value?: number | string;
  max?: number;
  isDot?: boolean;
  type?: 'error' | 'success' | 'warning' | 'info';
  color?: string;
  offset?: [number, number]; // [x, y]
}>(), {
  max: 99,
  isDot: false,
  type: 'error'
});

const show = computed(() => {
  if (props.isDot) return true;
  if (typeof props.value === 'number') return props.value > 0;
  return !!props.value;
});

const displayValue = computed(() => {
  if (typeof props.value === 'number' && props.value > props.max) {
    return `${props.max}+`;
  }
  return props.value;
});

const customStyle = computed(() => {
  const style: any = {};
  if (props.color) style.backgroundColor = props.color;
  if (props.offset) {
    style.right = `${props.offset[0]}rpx`;
    style.top = `${props.offset[1]}rpx`;
  }
  return style;
});
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';

.ui-badge-wrapper {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  flex-shrink: 0;
}

.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32rpx;
  min-width: 32rpx;
  padding: 0 8rpx;
  border-radius: $radius-full;
  box-sizing: border-box;
  z-index: 10;
  font-family: 'DIN Alternate', sans-serif; // 数码产品推荐用 DIN 字体

  // 关键样式：白色描边，使其在任何背景上都清晰
  border: 2rpx solid $color-bg-white; 
  box-shadow: $shadow-xs;

  // 颜色变体
  &.error { background-color: $color-error; }
  &.success { background-color: $color-success; }
  &.warning { background-color: $color-warning; }
  &.info { background-color: $color-info; }

  // 定位模式
  &.is-fixed {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(40%, -40%);
  }

  // 红点模式
  &.is-dot {
    width: 16rpx;
    min-width: 0;
    height: 16rpx;
    padding: 0;
    border: 2rpx solid $color-bg-white;
  }

  .badge-text {
    color: $color-text-white;
    font-size: 20rpx;
    line-height: 1;
    font-weight: $font-weight-medium;
  }
}
</style>