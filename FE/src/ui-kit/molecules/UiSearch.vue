<template>
  <view 
    class="ui-search" 
    :class="{ 'is-focus': isFocus }"
    @tap="handleClick"
  >
    <!-- 左侧放大镜图标 -->
    <UiIcon name="search" color="#999" size="32" class="ui-search__icon" />
    
    <!-- 输入框 -->
    <input 
      v-if="!disabled"
      class="ui-search__input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @confirm="handleConfirm"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
    
    <!-- 禁用状态 (作为入口跳转时使用) -->
    <view v-else class="ui-search__placeholder">
      <text>{{ placeholder }}</text>
    </view>
    
    <!-- 右侧清除按钮 -->
    <view 
      v-if="modelValue && !disabled" 
      class="ui-search__clear"
      @tap.stop="handleClear"
    >
      <UiIcon name="close-circle-fill" color="#ccc" size="32" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean; // 如果为true，点击整个组件触发 click 事件（用于跳转搜索页）
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索数码产品型号...',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'search', 'click', 'clear']);
const isFocus = ref(false);

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};

const handleConfirm = () => {
  emit('search', props.modelValue);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};

const handleClick = () => {
  if (props.disabled) {
    emit('click');
  }
};
</script>

<style lang="scss" scoped>
.ui-search {
  display: flex;
  align-items: center;
  width: 100%;
  height: 72rpx; // 标准搜索框高度
  background-color: #F5F7FA; // 浅灰背景
  border-radius: 999px; // 全圆角
  padding: 0 24rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &.is-focus {
    background-color: #fff;
    box-shadow: 0 0 0 2rpx $color-primary; // 聚焦时变色
  }
  
  &__icon {
    margin-right: 12rpx;
  }
  
  &__input {
    flex: 1;
    font-size: $font-size-md;
    color: $color-text-main;
    height: 100%;
  }
  
  &__placeholder {
    flex: 1;
    font-size: $font-size-md;
    color: $color-text-placeholder;
  }
  
  &__clear {
    padding: 8rpx;
  }
}
</style>