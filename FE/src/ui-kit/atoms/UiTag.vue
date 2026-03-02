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
  // 类型: primary(主色), success(�?, warning(�?, danger(�?, info(�?
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  // 尺寸: sm(�?, md(�?
  size?: 'sm' | 'md';
  // 朴素样式 (空心/淡色背景)
  plain?: boolean;
  // 圆角 (全圆�?
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
  border: 1rpx solid transparent;
  box-sizing: border-box;
  white-space: nowrap;
  transition: all $duration-fast $ease-spring;
  font-family: $font-family-system;
  
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

  // --- Variants (Solid with Glass Effect) ---
  &--primary { 
    background: linear-gradient(135deg, rgba($color-primary, 0.9) 0%, rgba($color-primary, 0.7) 100%);
    color: $color-white;
    box-shadow: 0 4rpx 12rpx rgba($color-primary, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  &--success { 
    background: linear-gradient(135deg, rgba($color-success, 0.9) 0%, rgba($color-success, 0.7) 100%);
    color: $color-white;
    box-shadow: 0 4rpx 12rpx rgba($color-success, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  &--warning { 
    background: linear-gradient(135deg, rgba($color-warning, 0.9) 0%, rgba($color-warning, 0.7) 100%);
    color: $color-white;
    box-shadow: 0 4rpx 12rpx rgba($color-warning, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  &--danger  { 
    background: linear-gradient(135deg, rgba($color-error, 0.9) 0%, rgba($color-error, 0.7) 100%);
    color: $color-white;
    box-shadow: 0 4rpx 12rpx rgba($color-error, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  &--info { 
    background: linear-gradient(135deg, rgba($color-info, 0.8) 0%, rgba($color-info, 0.6) 100%);
    color: $color-white;
    box-shadow: 0 4rpx 12rpx rgba($color-info, 0.15);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }

  // --- Plain Mode (Light bg + Dark text) ---
  &--plain {
    background: transparent;
    &.ui-tag--primary { 
      color: $color-primary; 
      background: rgba($color-primary, 0.08); 
      border-color: rgba($color-primary, 0.2);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    &.ui-tag--success { 
      color: $color-success; 
      background: rgba($color-success, 0.08); 
      border-color: rgba($color-success, 0.2);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    &.ui-tag--warning { 
      color: $color-warning; 
      background: rgba($color-warning, 0.08); 
      border-color: rgba($color-warning, 0.2);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    &.ui-tag--danger  { 
      color: $color-error; 
      background: rgba($color-error, 0.08); 
      border-color: rgba($color-error, 0.2);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    &.ui-tag--info  { 
      color: $color-info; 
      background: rgba($color-info, 0.08); 
      border-color: rgba($color-info, 0.2);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
  }
}

// =============================================================================
// MODERN TAG - 2025 淘宝/闲鱼风格标签
// =============================================================================

.ui-tag--modern {
  border-radius: $radius-card-s;
  font-weight: $font-weight-medium;
  border: none;
  
  &.ui-tag--primary {
    background: $color-brand-primary-light;
    color: $color-brand-primary;
    box-shadow: none;
  }
  
  &.ui-tag--danger {
    background: $color-brand-price-light;
    color: $color-brand-price;
    box-shadow: none;
  }
  
  &.ui-tag--success {
    background: $color-success-light;
    color: $color-success;
    box-shadow: none;
  }
  
  &.ui-tag--warning {
    background: $color-warning-light;
    color: $color-warning;
    box-shadow: none;
  }
  
  &.ui-tag--info {
    background: $color-info-light;
    color: $color-info;
    box-shadow: none;
  }
}
</style>