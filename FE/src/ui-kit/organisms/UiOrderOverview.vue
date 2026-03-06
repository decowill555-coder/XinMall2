<template>
  <view class="ui-order-overview">
    <view class="section-header">
      <text class="section-title">{{ title }}</text>
      <text class="section-more" @click="emit('more')">查看全部</text>
    </view>
    <view class="order-tabs">
      <view 
        v-for="(item, index) in items" 
        :key="index" 
        class="order-item"
        @click="emit('click', index)"
      >
        <text class="order-count">{{ item.count }}</text>
        <text class="order-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface OverviewItem {
  count: number;
  label: string;
}

interface Props {
  title?: string;
  items?: OverviewItem[];
}

withDefaults(defineProps<Props>(), {
  title: '订单概览',
  items: () => []
});

const emit = defineEmits(['click', 'more']);
</script>

<style lang="scss" scoped>
.ui-order-overview {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .section-more {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-item {
      @include flex-column-center;
      
      .order-count {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-text-main;
      }
      
      .order-label {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}
</style>
