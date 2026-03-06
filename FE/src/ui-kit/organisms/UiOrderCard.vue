<template>
  <view class="ui-order-card" @click="emit('click')">
    <view class="order-header">
      <text class="order-no">{{ orderNo }}</text>
      <text class="order-status" :class="statusClass">{{ statusText }}</text>
    </view>
    
    <view class="order-goods">
      <ui-image :src="cover" width="160rpx" height="160rpx" radius="8rpx" />
      <view class="goods-info">
        <text class="goods-title">{{ title }}</text>
        <text v-if="spec" class="goods-spec">{{ spec }}</text>
        <view class="goods-bottom">
          <ui-price :value="price" :size="40" />
          <text class="goods-quantity">x{{ quantity }}</text>
        </view>
      </view>
    </view>
    
    <view class="order-footer">
      <view class="order-total">
        <text>共{{ quantity }}件商品</text>
        <text class="total-text">实付 <ui-price :value="totalAmount" :size="28" /></text>
      </view>
      <view class="order-actions">
        <slot name="actions" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  orderNo?: string;
  cover?: string;
  title?: string;
  spec?: string;
  price?: number;
  quantity?: number;
  totalAmount?: number;
  status?: string;
}

const props = withDefaults(defineProps<Props>(), {
  orderNo: '',
  cover: '',
  title: '',
  spec: '',
  price: 0,
  quantity: 1,
  totalAmount: 0,
  status: ''
});

const emit = defineEmits(['click']);

const statusMap: Record<string, { text: string; class: string }> = {
  pending: { text: '待付款', class: 'warning' },
  paid: { text: '待发货', class: 'info' },
  shipped: { text: '待收货', class: 'primary' },
  completed: { text: '已完成', class: 'success' },
  cancelled: { text: '已取消', class: 'default' },
  refunding: { text: '售后中', class: 'warning' },
  refunded: { text: '已退款', class: 'default' }
};

const statusText = computed(() => statusMap[props.status]?.text || '未知');
const statusClass = computed(() => statusMap[props.status]?.class || 'default');
</script>

<style lang="scss" scoped>
.ui-order-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  overflow: hidden;
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .order-no {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .order-status {
      font-size: $font-size-sm;
      
      &.warning { color: var(--color-warning, #FF9500); }
      &.info { color: var(--color-info, #007AFF); }
      &.primary { color: var(--color-primary, #FF6A00); }
      &.success { color: var(--color-success, #34C759); }
      &.default { color: var(--color-text-sub, #8E8E93); }
    }
  }
  
  .order-goods {
    display: flex;
    padding: $space-md;
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      
      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(2);
      }
      
      .goods-spec {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin: $space-xs 0;
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .goods-quantity {
          font-size: $font-size-sm;
          color: $color-text-sub;
        }
      }
    }
  }
  
  .order-footer {
    padding: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .order-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-sm;
      font-size: $font-size-sm;
      color: $color-text-sub;
      
      .total-text {
        color: $color-text-main;
      }
    }
    
    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: $space-sm;
    }
  }
}
</style>
