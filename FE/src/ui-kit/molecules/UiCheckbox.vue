<template>
  <view 
    class="ui-checkbox" 
    :class="{ 'is-disabled': disabled }"
    @click.stop="toggle"
  >
    <!-- 图标部分 -->
    <view 
      class="checkbox-icon"
      :class="{ 'is-checked': modelValue, 'is-round': shape === 'round' }"
      :style="checkedStyle"
    >
      <ui-icon v-if="modelValue" name="check" size="20" color="#fff" />
    </view>
    
    <!-- 文字标签 -->
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
  shape?: 'circle' | 'square' | 'round'; // round = 圆形
  disabled?: boolean;
  color?: string; // 选中颜色
}>(), {
  modelValue: false,
  shape: 'round',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'change']);

const checkedStyle = computed(() => {
  if (!props.modelValue) return {};
  return {
    backgroundColor: props.color || '#2979FF', // $color-primary
    borderColor: props.color || '#2979FF'
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
@import '@/design/_tokens.scss';

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
    border: 2rpx solid $color-text-disabled; // 未选中时是灰色边框
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background-color: transparent;

    &.is-round { border-radius: 50%; }
    
    // 选中状态
    &.is-checked {
      border-color: transparent;
      // 背景色由 style 动态控制
    }
  }

  .checkbox-label {
    margin-left: $space-sm;
    font-size: $font-size-md;
    color: $color-text-main;
  }
}
</style>