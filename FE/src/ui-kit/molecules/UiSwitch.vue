<template>
  <view 
    class="ui-switch" 
    :class="{ 'is-active': modelValue, 'is-disabled': disabled }"
    :style="{ backgroundColor: modelValue ? activeColor : inactiveColor }"
    @click="toggle"
  >
    <view class="switch-node" />
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
}>(), {
  modelValue: false,
  activeColor: '#2979FF', // $color-primary
  inactiveColor: '#E5E5E5',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'change']);

const toggle = () => {
  if (props.disabled) return;
  const val = !props.modelValue;
  emit('update:modelValue', val);
  emit('change', val);
};
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';

.ui-switch {
  position: relative;
  width: 90rpx;
  height: 50rpx;
  border-radius: 50rpx;
  transition: background-color 0.3s;
  
  &.is-disabled { opacity: 0.6; }

  .switch-node {
    position: absolute;
    top: 4rpx;
    left: 4rpx;
    width: 42rpx;
    height: 42rpx;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: $shadow-sm;
    transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05); // 弹性过渡
  }

  &.is-active .switch-node {
    transform: translateX(40rpx);
  }
}
</style>