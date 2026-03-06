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
        <UiIcon name="close-circle-fill" :color="'#A1A1A6'" :size="40" />
      </view>

      <!-- 密码切换 -->
      <view 
        v-if="type === 'password'" 
        class="ui-input__icon-btn" 
        @tap.stop="togglePassword"
      >
        <UiIcon :name="showPassword ? 'eye' : 'eye-off'" :color="'#6E6E73'" size="36" />
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
  background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  border-radius: $radius-md;
  transition: all $duration-fast $ease-spring;
  box-sizing: border-box;
  box-shadow: $glass-shadow-sm;

  &.is-focus {
    background: var(--glass-solid, rgba(255, 255, 255, 0.85));
    backdrop-filter: blur($blur-md);
    -webkit-backdrop-filter: blur($blur-md);
    border-color: var(--color-primary, #FF6A00);
    box-shadow: 
      0 0 0 4rpx rgba(255, 106, 0, 0.08),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
  }

  &.is-error {
    border-color: var(--color-error, #FF3B30);
    background: var(--color-error-glass, rgba(255, 59, 48, 0.08));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    box-shadow: 0 0 0 4rpx rgba(255, 59, 48, 0.08);
  }
  
  &.is-disabled {
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    opacity: 0.6;
  }
}

.ui-input__inner {
  flex: 1;
  font-size: $font-size-md;
  color: $color-text-main;
  height: 100%;
  min-height: auto;
  background: transparent;
  
  &::placeholder {
    color: $color-text-placeholder;
  }
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
  border-radius: 50%;
  transition: all $duration-fast $ease-spring;
  
  &:active {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(0.9);
  }
}

.ui-input__prefix { 
  margin-right: $space-sm; 
  display: flex; 
  align-items: center; 
}

.ui-input__suffix { 
  margin-left: $space-sm; 
  display: flex; 
  align-items: center; 
}
</style>
