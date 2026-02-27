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
  // 风格: primary(实心蓝), glass(毛玻璃), outline(描边), text(纯字)
  variant?: 'primary' | 'glass' | 'outline' | 'text' | 'danger';
  // 尺寸: sm, md, lg
  size?: 'sm' | 'md' | 'lg';
  // 是否撑满父容器
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
@import '@/assets/styles/_tokens.scss';
@import '@/assets/styles/_mixins.scss';

.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-circle; // 胶囊形状在数码App中很流行
  border: 1px solid transparent; // 预留边框位置
  font-weight: $font-weight-medium;
  transition: all 0.2s ease;
  padding: 0;
  margin: 0;
  line-height: 1.5;
  box-sizing: border-box;

  // --- Click Animation ---
  &--hover {
    transform: scale(0.96);
    opacity: 0.9;
  }

  // --- Sizes ---
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
    width: 100%; // Large通常用于底部主按钮
  }

  // --- Block Mode ---
  &--block {
    display: flex;
    width: 100%;
  }

  // --- Variants ---
  
  // 1. Primary: 实心品牌色，带投影
  &--primary {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    color: $color-white;
    box-shadow: 0 8rpx 20rpx rgba($color-primary, 0.3); // 蓝色光晕
  }

  // 2. Glass: 浅色半透明，适合次要操作或覆盖在图片上
  &--glass {
    @include glass-effect(10rpx, 0.6);
    color: $color-primary-dark;
    border-color: rgba($color-primary, 0.2);
  }

  // 3. Outline: 描边
  &--outline {
    background: transparent;
    border: 1px solid $color-primary;
    color: $color-primary;
  }
  
  // 4. Danger: 危险操作
  &--danger {
    background: $color-error;
    color: white;
  }

  // --- State: Disabled ---
  &--disabled {
    opacity: 0.5;
    background: #E0E0E0 !important;
    color: #999 !important;
    box-shadow: none !important;
    border-color: transparent !important;
  }

  // --- Loading Spinner (Simple CSS) ---
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