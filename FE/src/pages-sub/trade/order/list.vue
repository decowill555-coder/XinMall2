<template>
  <view class="order-list-page">
    <ui-sub-navbar title="我的订单" />
    
    <view class="order-tabs">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="order-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="order-content">
        
        <view v-if="orderList.length === 0" class="empty-state">
          <ui-icon name="file-text" :size="80" color="#A1A1A6" />
          <text class="empty-text">暂无订单</text>
        </view>
        
        <view v-else class="order-list">
          <view v-for="order in orderList" :key="order.id" class="order-item" @click="goDetail(order)">
            <view class="order-header">
              <text class="shop-name">{{ order.orderNo }}</text>
              <text class="order-status" :class="getStatusInfo(order.status).class">{{ getStatusInfo(order.status).text }}</text>
            </view>
            
            <view v-for="item in [{ id: order.id, cover: order.cover, title: order.name, spec: order.skuSpecs?.map((s: any) => s.value).join(' / '), price: order.price, quantity: order.quantity }]" :key="item.id" class="order-goods">
              <ui-image :src="item.cover" width="160rpx" height="160rpx" radius="8rpx" />
              <view class="goods-info">
                <text class="goods-title">{{ item.title }}</text>
                <text class="goods-spec">{{ item.spec }}</text>
                <view class="goods-bottom">
                  <ui-price :value="item.price" ::size="40" />
                  <text class="goods-quantity">x{{ item.quantity }}</text>
                </view>
              </view>
            </view>
            
            <view class="order-footer">
              <view class="order-total">
                <text>共1件商品</text>
                <text class="total-text">实付 <ui-price :value="order.totalAmount" :size="28" /></text>
              </view>
              <view class="order-actions">
                <ui-button v-if="order.status === 'pending'" size="sm" @click.stop="handlePay(order)">立即付款</ui-button>
                <ui-button v-if="order.status === 'shipped'" size="sm" type="primary" @click.stop="handleConfirm(order)">确认收货</ui-button>
                <ui-button v-if="order.status === 'completed'" size="sm" type="primary" @click.stop="goEvaluate(order)">去评价</ui-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useOrderStore } from '@/stores';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const orderStore = useOrderStore();

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待付款' },
  { name: '待发货' },
  { name: '待收货' },
  { name: '待评价' }
]);

const orderList = computed(() => {
  const statusMap: Record<number, string | null> = {
    0: null,
    1: 'pending',
    2: 'paid',
    3: 'shipped',
    4: 'completed'
  };
  const targetStatus = statusMap[activeTab.value];
  if (!targetStatus) return orderStore.orders;
  return orderStore.orders.filter(o => o.status === targetStatus);
});

const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { text: string; class: string }> = {
    pending: { text: '待付款', class: 'warning' },
    paid: { text: '待发货', class: 'info' },
    shipped: { text: '待收货', class: 'primary' },
    completed: { text: '已完成', class: 'success' },
    cancelled: { text: '已取消', class: 'default' },
    refunding: { text: '售后中', class: 'warning' },
    refunded: { text: '已退款', class: 'default' }
  };
  return statusMap[status] || { text: '未知', class: 'default' };
};

const goDetail = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/order/detail?id=${order.id}` });
};

const handlePay = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/pay/index?id=${order.id}` });
};

const handleConfirm = (order: any) => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品吗？',
    success: (res) => {
      if (res.confirm) {
        orderStore.updateOrderStatus(order.id, 'completed');
        uni.showToast({ title: '确认成功', icon: 'success' });
      }
    }
  });
};

const goEvaluate = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/evaluate/index?id=${order.id}` });
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.order-tabs {
  background: $color-white;
  padding: 0 $space-md;
}

.order-scroll {
  overflow: hidden;
}

.order-content {
  padding: $space-md;
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin-top: $space-md;
  }
}

.order-item {
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  overflow: hidden;
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid $color-divider;
    
    .shop-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .order-status {
      font-size: $font-size-sm;
      
      &.warning { color: $color-warning; }
      &.info { color: $color-info; }
      &.primary { color: $color-primary; }
      &.success { color: $color-success; }
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
    border-top: 1rpx solid $color-divider;
    
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
