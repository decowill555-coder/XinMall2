<template>
  <view 
    class="ui-search" 
    :class="{ 'is-focus': isFocus }"
    @tap="handleClick"
  >
    <!-- 左侧放大镜图标 -->
    <UiIcon name="search" color="#A1A1A6" size="32" class="ui-search__icon" />
    
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
    
    <!-- 禁用状态 -->
    <view v-else class="ui-search__placeholder">
      <text>{{ placeholder }}</text>
    </view>
    
    <!-- 右侧清除按钮 -->
    <view 
      v-if="modelValue && !disabled" 
      class="ui-search__clear"
      @tap.stop="handleClear"
    >
      <UiIcon name="close-circle-fill" color="#A1A1A6" size="32" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
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
  height: 72rpx;
  background-color: $color-bg-gray;
  border-radius: $radius-full;
  padding: 0 $space-md;
  box-sizing: border-box;
  transition: all 0.3s ease;
  
  &.is-focus {
    background-color: $color-white;
    box-shadow: 0 0 0 2rpx $color-primary;
  }
  
  &__icon {
    margin-right: $space-sm;
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
    padding: $space-xs;
  }
}
</style>
