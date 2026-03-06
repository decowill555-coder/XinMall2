<template>
  <view class="ui-description-card">
    <view class="card-title">{{ title }}</view>
    <view class="description-content">
      <slot>{{ content }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  content?: string;
}

withDefaults(defineProps<Props>(), {
  title: '商品描述',
  content: ''
});
</script>

<style lang="scss" scoped>
.ui-description-card {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .description-content {
    font-size: $font-size-md;
    color: $color-text-sub;
    line-height: 1.8;
  }
}
</style>
