<template>
  <view 
    class="ui-checkbox" 
    :class="{ 'is-disabled': disabled }"
    @click.stop="toggle"
  >
    <view 
      class="checkbox-icon"
      :class="{ 'is-checked': modelValue, 'is-round': shape === 'round' }"
      :style="checkedStyle"
    >
      <ui-icon v-if="modelValue" name="check" :size="40" color="#FFFFFF" />
    </view>
    
    <text v-if="label" class="checkbox-label">
      {{ label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  shape?: 'circle' | 'square' | 'round';
  disabled?: boolean;
  color?: string;
}>(), {
  modelValue: false,
  shape: 'round',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'change']);

const checkedStyle = computed(() => {
  if (!props.modelValue) return {};
  return {
    backgroundColor: props.color || 'var(--color-primary, #FF6A00)',
    borderColor: props.color || 'var(--color-primary, #FF6A00)'
  };
});

const toggle = () => {
  if (props.disabled) return;
  const newValue = !props.modelValue;
  emit('update:modelValue', newValue);
  emit('change', newValue);
};
</script>

<style lang="scss" scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  margin-right: $space-md;

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .checkbox-icon {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid $color-border;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $duration-fast $ease-spring;
    background-color: $color-bg-gray;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    
    [data-theme="dark"] & {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    &.is-round { 
      border-radius: 50%; 
    }
    
    &.is-checked {
      border-color: transparent;
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        0 2px 8px rgba(255, 106, 0, 0.3);
      
      [data-theme="dark"] & {
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          0 2px 12px rgba(217, 70, 239, 0.4);
      }
    }
  }

  .checkbox-label {
    margin-left: $space-sm;
    font-size: $font-size-md;
    color: $color-text-main;
    
    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
  }
}
</style>
