<template>
  <button 
    class="ui-btn"
    :class="[
      `ui-btn--${variant}`, 
      `ui-btn--${size}`,
      { 'ui-btn--block': block },
      { 'ui-btn--disabled': disabled || loading }
    ]"
    :hover-class="!disabled && !loading ? 'ui-btn--hover' : ''"
    :disabled="disabled || loading"
    @tap="handleClick"
  >
    <view v-if="loading" class="ui-btn__loading"></view>
    <text class="ui-btn__text">
      <slot>{{ label }}</slot>
    </text>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  variant?: 'primary' | 'glass' | 'outline' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false
});

const emit = defineEmits(['click']);

const handleClick = (e: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', e);
  }
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  border: 1rpx solid transparent;
  font-weight: $font-weight-medium;
  transition: all $duration-fast $ease-spring;
  padding: 0;
  margin: 0;
  line-height: 1.5;
  box-sizing: border-box;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left $duration-slow;
  }

  &:hover::before {
    left: 100%;
  }

  &--hover {
    transform: scale(0.96);
    opacity: 0.9;
  }

  &--sm {
    height: 56rpx;
    padding: 0 24rpx;
    font-size: $font-size-sm;
  }
  &--md {
    height: 80rpx;
    padding: 0 40rpx;
    font-size: $font-size-md;
  }
  &--lg {
    height: 96rpx;
    padding: 0 64rpx;
    font-size: $font-size-lg;
    width: 100%;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--primary {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
    box-shadow: 
      0 8rpx 24rpx rgba($color-primary, 0.25),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.2);
    
    &:active {
      box-shadow: 
        0 4rpx 12rpx rgba($color-primary, 0.2),
        inset 0 0 0 1rpx rgba(255, 255, 255, 0.1);
    }
  }

  &--glass {
    @include glass-button($color-primary);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.4) 100%
    );
    backdrop-filter: blur($blur-lg);
    -webkit-backdrop-filter: blur($blur-lg);
    color: $color-primary-dark;
    border-color: rgba($color-primary, 0.3);
    box-shadow: 
      0 8rpx 32rpx rgba($color-primary, 0.1),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
    
    &:active {
      backdrop-filter: blur($blur-sm);
      box-shadow: 
        0 4rpx 16rpx rgba($color-primary, 0.08),
        inset 0 0 0 1rpx rgba(255, 255, 255, 0.4);
    }
  }

  &--outline {
    background: transparent;
    border: 1rpx solid $color-primary;
    color: $color-primary;
    box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.1);
  }
  
  &--danger {
    background: linear-gradient(135deg, $color-error 0%, $color-error-dark 100%);
    color: $color-white;
    box-shadow: 
      0 8rpx 24rpx rgba($color-error, 0.25),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.2);
  }

  &--disabled {
    opacity: 0.5;
    background: $color-bg-gray !important;
    color: $color-text-disabled !important;
    box-shadow: none !important;
    border-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  &__loading {
    width: 32rpx;
    height: 32rpx;
    border: 4rpx solid rgba(255,255,255,0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 12rpx;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ui-btn--modern {
  @include modern-button;
  font-family: $font-family-system;
  
  &.ui-btn--sm {
    height: 64rpx;
    padding: 0 32rpx;
    font-size: $font-size-sm;
    border-radius: 32rpx;
  }
  
  &.ui-btn--md {
    height: $height-button-modern;
    padding: 0 48rpx;
    font-size: $font-size-md;
  }
  
  &.ui-btn--lg {
    height: 100rpx;
    padding: 0 64rpx;
    font-size: $font-size-lg;
    border-radius: 50rpx;
  }
  
  &.ui-btn--block {
    width: 100%;
    display: flex;
  }
}
</style>
