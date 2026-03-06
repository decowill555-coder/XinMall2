<template>
  <view class="ui-comment-input">
    <input 
      class="input-field" 
      :value="modelValue" 
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event as any).detail.value)"
    />
    <ui-button 
      size="sm" 
      type="primary" 
      :disabled="!modelValue || disabled" 
      @click="emit('submit')"
    >
      {{ submitText }}
    </ui-button>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  submitText?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '说点什么...',
  submitText: '发送',
  disabled: false
});

const emit = defineEmits(['update:modelValue', 'submit']);
</script>

<style lang="scss" scoped>
.ui-comment-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-md;
  padding-bottom: calc(#{$space-sm} + env(safe-area-inset-bottom));
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .input-field {
    flex: 1;
    height: 72rpx;
    padding: 0 $space-md;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: $radius-full;
    font-size: $font-size-md;
    color: $color-text-main;
  }
}
</style>
