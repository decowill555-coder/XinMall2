<template>
  <view 
    class="ui-bottom-bar" 
    :class="{ 'has-border': border }"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  border?: boolean;
}

withDefaults(defineProps<Props>(), {
  border: true
});
</script>

<style lang="scss" scoped>
.ui-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  &.has-border {
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  }
}
</style>
