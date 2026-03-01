<template>
  <view 
    class="ui-input-wrapper"
    :class="{ 
      'is-focus': isFocused, 
      'is-disabled': disabled,
      'is-error': error 
    }"
  >
    <!-- 前缀插槽 -->
    <view v-if="$slots.prefix" class="ui-input__prefix">
      <slot name="prefix" />
    </view>

    <!-- 核心输入框 -->
    <input
      class="ui-input__inner"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :placeholder-class="'ui-input-placeholder'"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @confirm="emit('confirm')"
    />

    <!-- 功能区：清空 + 密码显隐 -->
    <view class="ui-input__actions">
      <!-- 清空按钮 -->
      <view 
        v-if="clearable && modelValue && isFocused" 
        class="ui-input__icon-btn" 
        @tap.stop="handleClear"
      >
        <UiIcon name="close-circle-fill" :color="$color-text-placeholder" size="32" />
      </view>

      <!-- 密码切换 -->
      <view 
        v-if="type === 'password'" 
        class="ui-input__icon-btn" 
        @tap.stop="togglePassword"
      >
        <UiIcon :name="showPassword ? 'eye' : 'eye-off'" :color="$color-text-sub" size="36" />
      </view>
    </view>

    <!-- 后缀插槽 -->
    <view v-if="$slots.suffix" class="ui-input__suffix">
      <slot name="suffix" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string | number;
  type?: 'text' | 'number' | 'password' | 'digit';
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  maxlength?: number;
  error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '请输入',
  clearable: true,
  maxlength: 140,
  error: false
});

const emit = defineEmits(['update:modelValue', 'confirm', 'clear']);

const isFocused = ref(false);
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style lang="scss" scoped>
.ui-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88rpx;
  padding: 0 $space-md;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid transparent;
  border-radius: $radius-md;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &.is-focus {
    background-color: $color-white;
    border-color: $color-primary;
    box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1);
  }

  &.is-error {
    border-color: $color-error;
    background-color: rgba($color-error, 0.05);
  }
  
  &.is-disabled {
    background-color: rgba(0,0,0,0.03);
    opacity: 0.6;
  }
}

.ui-input__inner {
  flex: 1;
  font-size: $font-size-md;
  color: $color-text-main;
  height: 100%;
  min-height: auto; 
}

.ui-input-placeholder {
  color: $color-text-placeholder;
}

.ui-input__actions {
  display: flex;
  align-items: center;
  gap: $space-xs;
  margin-left: $space-xs;
}

.ui-input__icon-btn {
  padding: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ui-input__prefix { margin-right: $space-sm; display: flex; align-items: center; }
.ui-input__suffix { margin-left: $space-sm; display: flex; align-items: center; }
</style>
