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
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md';
  plain?: boolean;
  round?: boolean;
}

withDefaults(defineProps<Props>(), {
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
  
  &--xs {
    height: 32rpx;
    padding: 0 8rpx;
    font-size: 18rpx;
    border-radius: $radius-xs;
  }
  
  &--sm {
    height: 36rpx;
    padding: 0 12rpx;
    font-size: $font-size-xs;
    border-radius: $radius-sm;
  }
  
  &--md {
    height: 48rpx;
    padding: 0 16rpx;
    font-size: $font-size-sm;
    border-radius: $radius-md;
  }

  &--round {
    border-radius: 999px;
  }

  &--primary { 
    background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, var(--color-primary-dark, #E55D00) 100%);
    color: var(--color-text-white, #FFFFFF);
    box-shadow: 0 4rpx 12rpx rgba(255, 106, 0, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  
  &--success { 
    background: linear-gradient(135deg, var(--color-success, #34C759) 0%, rgba(52, 199, 89, 0.8) 100%);
    color: var(--color-text-white, #FFFFFF);
    box-shadow: 0 4rpx 12rpx rgba(52, 199, 89, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  
  &--warning { 
    background: linear-gradient(135deg, var(--color-warning, #FF9500) 0%, rgba(255, 149, 0, 0.8) 100%);
    color: var(--color-text-white, #FFFFFF);
    box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  
  &--danger { 
    background: linear-gradient(135deg, var(--color-error, #FF3B30) 0%, rgba(255, 59, 48, 0.8) 100%);
    color: var(--color-text-white, #FFFFFF);
    box-shadow: 0 4rpx 12rpx rgba(255, 59, 48, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }
  
  &--info { 
    background: linear-gradient(135deg, var(--color-info, #007AFF) 0%, rgba(0, 122, 255, 0.8) 100%);
    color: var(--color-text-white, #FFFFFF);
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.15);
    border: 1rpx solid rgba(255, 255, 255, 0.3);
  }

  &--plain {
    background: transparent;
    
    &.ui-tag--primary { 
      color: var(--color-primary, #FF6A00); 
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1)); 
      border-color: var(--color-primary, rgba(255, 106, 0, 0.3));
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    
    &.ui-tag--success { 
      color: var(--color-success, #34C759); 
      background: rgba(52, 199, 89, 0.1); 
      border-color: rgba(52, 199, 89, 0.3);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    
    &.ui-tag--warning { 
      color: var(--color-warning, #FF9500); 
      background: rgba(255, 149, 0, 0.1); 
      border-color: rgba(255, 149, 0, 0.3);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    
    &.ui-tag--danger { 
      color: var(--color-error, #FF3B30); 
      background: rgba(255, 59, 48, 0.1); 
      border-color: rgba(255, 59, 48, 0.3);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    
    &.ui-tag--info { 
      color: var(--color-info, #007AFF); 
      background: rgba(0, 122, 255, 0.1); 
      border-color: rgba(0, 122, 255, 0.3);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
  }
}
</style>
