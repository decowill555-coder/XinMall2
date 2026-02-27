<template>
  <view 
    class="ui-input-wrapper"
    :class="{ 
      'is-focus': isFocused, 
      'is-disabled': disabled,
      'is-error': error 
    }"
  >
    <!-- 前缀插槽 (如：搜索图标) -->
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
      <!-- 清空按钮 (仅在有内容且聚焦时显示) -->
      <view 
        v-if="clearable && modelValue && isFocused" 
        class="ui-input__icon-btn" 
        @tap.stop="handleClear"
      >
        <UiIcon name="close-circle-fill" color="#A1A1A6" size="32" />
      </view>

      <!-- 密码切换 -->
      <view 
        v-if="type === 'password'" 
        class="ui-input__icon-btn" 
        @tap.stop="togglePassword"
      >
        <UiIcon :name="showPassword ? 'eye' : 'eye-off'" color="#6E6E73" size="36" />
      </view>
    </view>

    <!-- 后缀插槽 (如：单位 'GB') -->
    <view v-if="$slots.suffix" class="ui-input__suffix">
      <slot name="suffix" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import UiIcon from '@/ui-kit/base/UiIcon.vue'; // 假设Icon组件在下一节创建

interface Props {
  modelValue: string | number;
  type?: 'text' | 'number' | 'password' | 'digit';
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  maxlength?: number;
  error?: boolean; // 错误状态（红框）
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

// 处理密码显隐逻辑
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
@import '@/assets/styles/_tokens.scss';

.ui-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88rpx; // 标准高度
  padding: 0 $space-md;
  background-color: rgba(255, 255, 255, 0.6); // 半透明背景
  border: 1px solid transparent; // 预留边框
  border-radius: $radius-md;
  transition: all 0.2s ease;
  box-sizing: border-box;

  // 状态：聚焦
  &.is-focus {
    background-color: #fff;
    border-color: $color-primary;
    box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1); // 聚焦光晕
  }

  // 状态：错误
  &.is-error {
    border-color: $color-error;
    background-color: rgba($color-error, 0.05);
  }
  
  // 状态：禁用
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
  // 去除uniapp默认样式干扰
  min-height: auto; 
}

// 占位符样式 (Hack for uniapp)
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