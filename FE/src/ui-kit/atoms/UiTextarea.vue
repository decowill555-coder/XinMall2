<template>
  <view class="ui-textarea">
    <textarea 
      class="textarea-field"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :rows="rows"
      :disabled="disabled"
      @input="handleInput"
    />
    <text v-if="showCount && maxlength" class="textarea-count">
      {{ modelValue?.length || 0 }}/{{ maxlength }}
    </text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  maxlength?: number;
  rows?: number;
  disabled?: boolean;
  showCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容',
  maxlength: 500,
  rows: 4,
  disabled: false,
  showCount: false
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<style lang="scss" scoped>
.ui-textarea {
  position: relative;
  
  .textarea-field {
    width: 100%;
    min-height: calc(var(--textarea-rows, 4) * 40rpx + 32rpx);
    padding: $space-md;
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
    border-radius: $radius-md;
    font-size: $font-size-md;
    color: $color-text-main;
    box-sizing: border-box;
    line-height: 1.5;
  }
  
  .textarea-count {
    position: absolute;
    right: $space-sm;
    bottom: $space-xs;
    font-size: $font-size-xs;
    color: $color-text-disabled;
  }
}
</style>
