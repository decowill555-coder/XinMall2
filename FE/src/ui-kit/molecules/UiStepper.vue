<template>
  <view class="ui-stepper">
    <!-- 减号按钮 -->
    <view 
      class="stepper-btn minus" 
      :class="{ 'disabled': modelValue <= min }"
      @click.stop="onMinus"
    >
      <ui-icon name="minus" size="24" color="#1D1D1F" />
    </view>

    <!-- 数值展示 (不做输入框，数码产品一般买1-2个，输入需求低) -->
    <view class="stepper-value">
      {{ modelValue }}
    </view>

    <!-- 加号按钮 -->
    <view 
      class="stepper-btn plus" 
      :class="{ 'disabled': modelValue >= max }"
      @click.stop="onPlus"
    >
      <ui-icon name="plus" size="24" color="#1D1D1F" />
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}>(), {
  modelValue: 1,
  min: 1,
  max: 99,
  step: 1
});

const emit = defineEmits(['update:modelValue', 'change']);

const onMinus = () => {
  if (props.modelValue <= props.min) return;
  const val = props.modelValue - props.step;
  emit('update:modelValue', val);
  emit('change', val);
};

const onPlus = () => {
  if (props.modelValue >= props.max) return;
  const val = props.modelValue + props.step;
  emit('update:modelValue', val);
  emit('change', val);
};
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-stepper {
  display: inline-flex;
  align-items: center;
  background-color: $color-bg-gray; // 浅灰背景容器
  border-radius: $radius-full;
  padding: 4rpx;

  .stepper-btn {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-white; // 按钮是白色的
    box-shadow: $shadow-sm; // 微阴影
    
    &:active { transform: scale(0.9); }

    &.disabled {
      opacity: 0.5;
      background-color: transparent;
      box-shadow: none;
    }
  }

  .stepper-value {
    width: 60rpx;
    text-align: center;
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    font-family: 'DIN Alternate', sans-serif;
  }
}
</style>