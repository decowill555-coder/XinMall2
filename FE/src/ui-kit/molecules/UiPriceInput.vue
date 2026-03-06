<template>
  <view class="ui-price-input">
    <text class="price-symbol">¥</text>
    <input 
      class="price-field"
      type="digit"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number | string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入价格'
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (e: any) => {
  let value = e.detail.value;
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
.ui-price-input {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  border-radius: $radius-md;
  
  .price-symbol {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: var(--color-primary, #FF6A00);
    margin-right: $space-xs;
  }
  
  .price-field {
    flex: 1;
    font-size: $font-size-lg;
    color: $color-text-main;
    font-weight: $font-weight-medium;
  }
}
</style>
