<template>
  <view class="order-list-page">
    <ui-navbar title="我的订单" :back="true" />
    
    <view class="order-tabs">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="order-scroll">
      <view v-if="orderList.length === 0" class="empty-state">
        <ui-icon name="file-text" size="80" color="#A1A1A6" />
        <text class="empty-text">暂无订单</text>
      </view>
      
      <view v-else class="order-list">
        <view v-for="order in orderList" :key="order.id" class="order-item" @click="goDetail(order)">
          <view class="order-header">
            <text class="shop-name">{{ order.shopName }}</text>
            <text class="order-status" :class="order.statusClass">{{ order.statusText }}</text>
          </view>
          
          <view v-for="item in order.goods" :key="item.id" class="order-goods">
            <ui-image :src="item.cover" width="160rpx" height="160rpx" radius="8rpx" />
            <view class="goods-info">
              <text class="goods-title">{{ item.title }}</text>
              <text class="goods-spec">{{ item.spec }}</text>
              <view class="goods-bottom">
                <ui-price :value="item.price" :size="24" />
                <text class="goods-quantity">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
          
          <view class="order-footer">
            <view class="order-total">
              <text>共{{ order.goods.length }}件商品</text>
              <text class="total-text">实付 <ui-price :value="order.totalPrice" :size="28" /></text>
            </view>
            <view class="order-actions">
              <ui-button v-if="order.status === 'pending'" size="sm" @click.stop="handlePay(order)">立即付款</ui-button>
              <ui-button v-if="order.status === 'received'" size="sm" type="primary" @click.stop="handleConfirm(order)">确认收货</ui-button>
              <ui-button v-if="order.status === 'reviewed'" size="sm" type="primary" @click.stop="goEvaluate(order)">去评价</ui-button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待付款' },
  { name: '待发货' },
  { name: '待收货' },
  { name: '待评价' }
]);

const orderList = ref([
  {
    id: 1,
    shopName: '数码达人小店',
    status: 'pending',
    statusText: '待付款',
    statusClass: 'warning',
    totalPrice: 9398,
    goods: [
      { id: 1, cover: 'https://picsum.photos/200/200?random=401', title: 'iPhone 15 Pro Max 256GB', spec: '钛金属原色', price: 7999, quantity: 1 },
      { id: 2, cover: 'https://picsum.photos/200/200?random=402', title: 'AirPods Pro 第二代', spec: 'USB-C', price: 1399, quantity: 1 }
    ]
  },
  {
    id: 2,
    shopName: '科技好物',
    status: 'shipped',
    statusText: '待发货',
    statusClass: 'info',
    totalPrice: 12999,
    goods: [
      { id: 3, cover: 'https://picsum.photos/200/200?random=403', title: 'MacBook Pro 14寸 M3', spec: '深空黑 16G+512G', price: 12999, quantity: 1 }
    ]
  },
  {
    id: 3,
    shopName: '正品数码',
    status: 'received',
    statusText: '待收货',
    statusClass: 'primary',
    totalPrice: 2199,
    goods: [
      { id: 4, cover: 'https://picsum.photos/200/200?random=404', title: 'Sony WH-1000XM5', spec: '黑色', price: 2199, quantity: 1 }
    ]
  },
  {
    id: 4,
    shopName: '耳机专营',
    status: 'reviewed',
    statusText: '待评价',
    statusClass: 'success',
    totalPrice: 1399,
    goods: [
      { id: 5, cover: 'https://picsum.photos/200/200?random=405', title: 'AirPods Pro 第二代', spec: 'USB-C', price: 1399, quantity: 1 }
    ]
  }
]);

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
  height: calc(100vh - 88rpx - 88rpx);
  padding: $space-sm $space-md;
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
