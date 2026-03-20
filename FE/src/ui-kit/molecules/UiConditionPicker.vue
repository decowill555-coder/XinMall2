<template>
  <view class="ui-condition-picker">
    <view
      v-for="item in options"
      :key="item.value"
      class="condition-item"
      :class="{ active: modelValue === item.value }"
      @click="handleSelect(item.value)"
    >
      <text class="condition-text">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ConditionOption {
  label: string;
  value: number;
}

interface Props {
  modelValue?: number;
  options?: ConditionOption[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 100,
  options: () => [
    { label: '全新', value: 100 },
    { label: '99新', value: 99 },
    { label: '95新', value: 95 },
    { label: '9新', value: 90 },
    { label: '85新', value: 85 },
    { label: '8新及以下', value: 80 }
  ]
});

const emit = defineEmits(['update:modelValue']);

// Handle click - ensure value update
const handleSelect = (value: number) => {
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
.ui-condition-picker {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  
  .condition-item {
    padding: $space-sm $space-md;
    background: var(--glass-solid, rgba(255, 255, 255, 0.85));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    color: $color-text-sub;
    border: 1px solid transparent;
    transition: all $duration-fast $ease-spring;
    
    &.active {
      color: var(--color-primary, #FF6A00);
      border-color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
