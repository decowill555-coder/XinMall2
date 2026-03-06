<template>
  <view class="ui-status-card" :class="type">
    <view class="status-icon">
      <ui-icon :name="icon" :size="40" :color="iconColor" />
    </view>
    <text class="status-text">{{ title }}</text>
    <text class="status-desc" v-if="desc">{{ desc }}</text>
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon?: string;
  title?: string;
  desc?: string;
  type?: 'pending' | 'processing' | 'success' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'info',
  title: '',
  desc: '',
  type: 'pending'
});

const colorMap: Record<string, string> = {
  pending: '#FF9500',
  processing: '#007AFF',
  success: '#34C759',
  error: '#FF3B30'
};

const iconColor = computed(() => colorMap[props.type] || colorMap.pending);
</script>

<style lang="scss" scoped>
.ui-status-card {
  @include flex-column-center;
  padding: $space-xl;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  
  .status-icon {
    width: 80rpx;
    height: 80rpx;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: 50%;
    @include flex-center;
    margin-bottom: $space-sm;
  }
  
  .status-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  .status-desc {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
  }
}
</style>
