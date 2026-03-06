<template>
  <view class="ui-goods-actions">
    <view 
      v-for="(action, index) in actions" 
      :key="index"
      class="action-btn"
      :class="action.type"
      @click="emit('click', action)"
    >
      <text>{{ action.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ActionItem {
  text: string;
  type?: 'default' | 'primary' | 'warning' | 'danger';
  action: string;
}

interface Props {
  actions?: ActionItem[];
}

withDefaults(defineProps<Props>(), {
  actions: () => [
    { text: '编辑', type: 'default', action: 'edit' },
    { text: '下架', type: 'warning', action: 'offShelf' },
    { text: '删除', type: 'danger', action: 'delete' }
  ]
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-goods-actions {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  
  .action-btn {
    padding: $space-xs $space-sm;
    font-size: $font-size-xs;
    color: $color-text-sub;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: $radius-sm;
    text-align: center;
    transition: all $duration-fast;
    
    &:active {
      transform: scale(0.95);
    }
    
    &.primary {
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
    }
    
    &.warning {
      color: var(--color-warning, #FF9500);
      background: var(--color-warning-glass, rgba(255, 149, 0, 0.1));
    }
    
    &.danger {
      color: var(--color-error, #FF3B30);
      background: var(--color-error-glass, rgba(255, 59, 48, 0.1));
    }
  }
}
</style>
