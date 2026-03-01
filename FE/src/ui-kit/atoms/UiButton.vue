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
.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  border: 1px solid transparent;
  font-weight: $font-weight-medium;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  line-height: 1.5;
  box-sizing: border-box;

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
    box-shadow: 0 8rpx 20rpx rgba($color-primary, 0.3);
  }

  &--glass {
    @include glass-effect(10rpx, 0.6);
    color: $color-primary-dark;
    border-color: rgba($color-primary, 0.2);
  }

  &--outline {
    background: transparent;
    border: 1px solid $color-primary;
    color: $color-primary;
  }
  
  &--danger {
    background: $color-error;
    color: $color-white;
  }

  &--disabled {
    opacity: 0.5;
    background: $color-bg-gray !important;
    color: $color-text-disabled !important;
    box-shadow: none !important;
    border-color: transparent !important;
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
</style>
