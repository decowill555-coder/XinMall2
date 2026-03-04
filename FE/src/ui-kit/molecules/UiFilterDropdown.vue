<template>
  <view class="ui-filter-dropdown" :class="{ 'is-active': showOptions }">
    <view class="dropdown-trigger" @click="toggleDropdown">
      <text class="trigger-text" :class="{ 'is-selected': hasSelected }">
        {{ displayText }}
      </text>
      <ui-icon 
        :name="showOptions ? 'arrow-up' : 'arrow-down'" 
        :size="24" 
        :color="hasSelected ? '#1ABC9C' : '#6E6E73'" 
      />
    </view>
    
    <view v-if="showOptions" class="dropdown-overlay" @click="closeDropdown" />
    
    <view v-if="showOptions" class="dropdown-panel">
      <view class="options-list">
        <view 
          v-for="option in options" 
          :key="option.value"
          class="option-item"
          :class="{ 
            'is-selected': isSelected(option.value),
            'is-disabled': option.disabled 
          }"
          @click="selectOption(option)"
        >
          <text class="option-text">{{ option.label }}</text>
          <ui-icon 
            v-if="isSelected(option.value)" 
            name="check" 
            :size="28" 
            color="#1ABC9C" 
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FilterOption } from '@/stores/search-filter';

const props = withDefaults(defineProps<{
  modelValue?: string | number | null;
  options: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
}>(), {
  placeholder: '请选择',
  multiple: false
});

const emit = defineEmits(['update:modelValue', 'change']);

const showOptions = ref(false);
const selectedValues = ref<(string | number)[]>([]);

const hasSelected = computed(() => {
  if (props.multiple) {
    return selectedValues.value.length > 0;
  }
  return props.modelValue !== null && props.modelValue !== undefined;
});

const displayText = computed(() => {
  if (props.multiple) {
    if (selectedValues.value.length === 0) {
      return props.placeholder;
    }
    if (selectedValues.value.length === 1) {
      const opt = props.options.find(o => o.value === selectedValues.value[0]);
      return opt?.label || props.placeholder;
    }
    return `已选${selectedValues.value.length}项`;
  }
  
  if (props.modelValue === null || props.modelValue === undefined) {
    return props.placeholder;
  }
  const opt = props.options.find(o => o.value === props.modelValue);
  return opt?.label || props.placeholder;
});

watch(() => props.modelValue, (val) => {
  if (!props.multiple && val !== null && val !== undefined) {
    if (!selectedValues.value.includes(val)) {
      selectedValues.value = [val];
    }
  }
}, { immediate: true });

const isSelected = (value: string | number) => {
  if (props.multiple) {
    return selectedValues.value.includes(value);
  }
  return props.modelValue === value;
};

const toggleDropdown = () => {
  showOptions.value = !showOptions.value;
};

const closeDropdown = () => {
  showOptions.value = false;
};

const selectOption = (option: FilterOption) => {
  if (option.disabled) return;
  
  if (props.multiple) {
    const index = selectedValues.value.indexOf(option.value);
    if (index > -1) {
      selectedValues.value.splice(index, 1);
    } else {
      selectedValues.value.push(option.value);
    }
    emit('change', [...selectedValues.value]);
  } else {
    emit('update:modelValue', option.value);
    emit('change', option.value);
    closeDropdown();
  }
};

defineExpose({
  closeDropdown,
  getSelectedValues: () => selectedValues.value
});
</script>

<style lang="scss" scoped>
.ui-filter-dropdown {
  position: relative;
  flex: 1;
  min-width: 0;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-sm $space-md;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border-radius: $radius-md;
  border: 1rpx solid rgba(0, 0, 0, 0.04);
  transition: all $duration-fast $ease-spring;
  
  &:active {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(0.98);
  }
  
  .trigger-text {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-text-sub;
    @include text-ellipsis(1);
    text-align: center;
    
    &.is-selected {
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-dropdown;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8rpx);
  left: 0;
  right: 0;
  z-index: $z-dropdown + 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 8rpx 32rpx rgba(0, 0, 0, 0.08),
    inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
  overflow: hidden;
  animation: slideDown 0.2s $ease-spring;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.options-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-md $space-lg;
  transition: all $duration-fast;
  
  &:active {
    background: rgba($color-primary, 0.08);
  }
  
  &.is-selected {
    background: rgba($color-primary, 0.06);
    
    .option-text {
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }
  
  &.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  
  &:not(:last-child) {
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  }
  
  .option-text {
    font-size: $font-size-md;
    color: $color-text-main;
  }
}
</style>
