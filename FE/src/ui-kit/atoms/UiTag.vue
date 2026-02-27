<template>
  <view 
    class="ui-tag"
    :class="[
      `ui-tag--${type}`, 
      `ui-tag--${size}`,
      { 'ui-tag--plain': plain },
      { 'ui-tag--round': round }
    ]"
    @tap="emit('click')"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
interface Props {
  // 类型: primary(主色), success(绿), warning(橙), danger(红), info(灰)
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  // 尺寸: sm(小), md(中)
  size?: 'sm' | 'md';
  // 朴素样式 (空心/淡色背景)
  plain?: boolean;
  // 圆角 (全圆角)
  round?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'sm',
  plain: false,
  round: false
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: $font-weight-medium;
  border: 1px solid transparent;
  box-sizing: border-box;
  white-space: nowrap;
  
  // --- Sizes ---
  &--sm {
    height: 36rpx;
    padding: 0 12rpx;
    font-size: $font-size-xs; // 20rpx
    border-radius: $radius-sm;
  }
  &--md {
    height: 48rpx;
    padding: 0 16rpx;
    font-size: $font-size-sm; // 24rpx
    border-radius: $radius-md;
  }

  // --- Round ---
  &--round {
    border-radius: 999px;
  }

  // --- Variants (Solid by default) ---
  &--primary { background: $color-primary; color: #fff; }
  &--success { background: $color-success; color: #fff; }
  &--warning { background: $color-warning; color: #fff; }
  &--danger  { background: $color-error; color: #fff; }
  &--info    { background: #F0F2F5; color: $color-text-sub; } // 浅灰底

  // --- Plain Mode (Light bg + Dark text) ---
  &--plain {
    background: transparent;
    &.ui-tag--primary { color: $color-primary; background: rgba($color-primary, 0.1); border-color: rgba($color-primary, 0.2); }
    &.ui-tag--success { color: $color-success; background: rgba($color-success, 0.1); border-color: rgba($color-success, 0.2); }
    &.ui-tag--warning { color: $color-warning; background: rgba($color-warning, 0.1); border-color: rgba($color-warning, 0.2); }
    &.ui-tag--danger  { color: $color-error; background: rgba($color-error, 0.1); border-color: rgba($color-error, 0.2); }
  }
}
</style>