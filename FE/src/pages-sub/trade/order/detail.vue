<template>
  <view class="order-detail-page">
    <ui-sub-navbar title="订单详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="detail-content">
        
        <view class="status-card">
          <view class="status-icon">
            <ui-icon :name="statusConfig.icon" :size="48" :color="statusConfig.color" />
          </view>
          <text class="status-text">{{ statusConfig.text }}</text>
          <text class="status-desc">{{ statusConfig.desc }}</text>
        </view>
        
        <view class="address-card">
          <view class="address-header">
            <ui-icon name="map-pin" ::size="40" />
            <text class="address-name">{{ address.name }}</text>
            <text class="address-phone">{{ address.phone }}</text>
          </view>
          <text class="address-detail">{{ address.detail }}</text>
        </view>
        
        <view class="goods-card">
          <view class="shop-header">
            <ui-icon name="store" ::size="40" />
            <text class="shop-name">{{ order.shopName }}</text>
          </view>
          
          <view v-for="item in order.goods" :key="item.id" class="goods-item">
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
        </view>
        
        <view class="info-card">
          <view class="info-item">
            <text class="info-label">订单编号</text>
            <text class="info-value">{{ order.orderNo }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">下单时间</text>
            <text class="info-value">{{ order.createTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">支付方式</text>
            <text class="info-value">{{ order.payMethod }}</text>
          </view>
        </view>
        
        <view class="price-card">
          <view class="price-item">
            <text class="price-label">商品总额</text>
            <text class="price-value">¥{{ order.goodsTotal }}</text>
          </view>
          <view class="price-item">
            <text class="price-label">运费</text>
            <text class="price-value">¥{{ order.freight }}</text>
          </view>
          <view class="price-item total">
            <text class="price-label">实付款</text>
            <ui-price :value="order.totalPrice" ::size="40" />
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="detail-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button v-if="order.status === 'pending'" type="primary" block @click="handlePay">立即付款</ui-button>
      <ui-button v-if="order.status === 'received'" type="primary" block @click="handleConfirm">确认收货</ui-button>
      <ui-button v-if="order.status === 'completed'" block @click="goEvaluate">去评价</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const order = ref({
  id: 1,
  orderNo: 'XM202401150001',
  shopName: '数码达人小店',
  status: 'received',
  createTime: '2024-01-15 10:30:00',
  payMethod: '微信支付',
  goodsTotal: 9398,
  freight: 0,
  totalPrice: 9398,
  goods: [
    { id: 1, cover: 'https://picsum.photos/200/200?random=501', title: 'iPhone 15 Pro Max 256GB', spec: '钛金属原色', price: 7999, quantity: 1 },
    { id: 2, cover: 'https://picsum.photos/200/200?random=502', title: 'AirPods Pro 第二代', spec: 'USB-C', price: 1399, quantity: 1 }
  ]
});

const address = ref({
  name: '张三',
  phone: '138****8888',
  detail: '北京市朝阳区建国路88号SOHO现代城A座1201室'
});

const statusConfig = computed(() => {
  const configs: Record<string, any> = {
    pending: { icon: 'clock', color: '#FF9500', text: '待付款', desc: '请在30分钟内完成付款' },
    shipped: { icon: 'package', color: '#007AFF', text: '待发货', desc: '商家正在准备发货' },
    received: { icon: 'truck', color: '#1ABC9C', text: '待收货', desc: '商品正在配送中' },
    completed: { icon: 'check-circle', color: '#34C759', text: '已完成', desc: '订单已完成' }
  };
  return configs[order.value.status] || configs.pending;
});

const handlePay = () => {
  uni.navigateTo({ url: `/pages-sub/trade/pay/index?id=${order.value.id}` });
};

const handleConfirm = () => {
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

const goEvaluate = () => {
  uni.navigateTo({ url: `/pages-sub/trade/evaluate/index?id=${order.value.id}` });
};
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.detail-scroll {
  overflow: hidden;
}

.detail-content {
  padding: $space-md;
}

.status-card {
  @include flex-column-center;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  border-radius: $radius-lg;
  margin-bottom: $space-sm;
  
  .status-icon {
    width: 96rpx;
    height: 96rpx;
    background: rgba($color-white, 0.2);
    border-radius: 50%;
    @include flex-center;
    margin-bottom: $space-sm;
  }
  
  .status-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-white;
  }
  
  .status-desc {
    font-size: $font-size-sm;
    color: rgba($color-white, 0.8);
    margin-top: $space-xs;
  }
}

.address-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-xs;
    
    .address-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
      margin-left: $space-sm;
    }
    
    .address-phone {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-left: $space-md;
    }
  }
  
  .address-detail {
    font-size: $font-size-sm;
    color: $color-text-sub;
    line-height: 1.5;
  }
}

.goods-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .shop-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 1rpx solid $color-divider;
    
    .shop-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
      margin-left: $space-sm;
    }
  }
  
  .goods-item {
    display: flex;
    margin-bottom: $space-sm;
    
    &:last-child { margin-bottom: 0; }
    
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
}

.info-card, .price-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
}

.info-item, .price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-xs 0;
  
  .info-label, .price-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
  
  .info-value, .price-value {
    font-size: $font-size-sm;
    color: $color-text-main;
  }
  
  &.total {
    margin-top: $space-sm;
    padding-top: $space-sm;
    border-top: 1rpx solid $color-divider;
    
    .price-label {
      color: $color-text-main;
    }
  }
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}
</style>
