<template>
  <view class="ui-quick-actions">
    <view 
      v-for="(action, index) in actions" 
      :key="index" 
      class="action-item" 
      @click="emit('click', index)"
    >
      <view class="action-icon">
        <ui-icon :name="action.icon" :size="40" />
      </view>
      <text class="action-text">{{ action.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ActionItem {
  icon: string;
  text: string;
}

interface Props {
  actions?: ActionItem[];
}

withDefaults(defineProps<Props>(), {
  actions: () => []
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-quick-actions {
  display: flex;
  justify-content: space-around;
  padding: $space-lg $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin-bottom: $space-sm;
  
  .action-item {
    @include flex-column-center;
    
    .action-icon {
      width: 80rpx;
      height: 80rpx;
      @include flex-center;
      background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
      border-radius: 50%;
      margin-bottom: $space-xs;
    }
    
    .action-text {
      font-size: $font-size-xs;
      color: $color-text-main;
    }
  }
}
</style>
