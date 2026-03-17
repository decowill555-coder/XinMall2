<template>
  <view class="order-detail-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="订单详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="detail-content">
        
        <view class="status-card">
          <view class="status-icon-wrapper">
            <view class="status-icon">
              <ui-icon :name="statusConfig.icon" :size="48" color="white" />
            </view>
            <view class="status-glow"></view>
          </view>
          <text class="status-text">{{ statusConfig.text }}</text>
          <text class="status-desc">{{ statusConfig.desc }}</text>
          
          <view v-if="order.status === 'pending'" class="countdown-bar">
            <ui-icon name="clock" :size="28" color="rgba(255,255,255,0.8)" />
            <text class="countdown-text">剩余支付时间：{{ countdown }}</text>
          </view>
        </view>
        
        <view class="address-card">
          <view class="card-content">
            <view class="address-header">
              <view class="address-icon">
                <ui-icon name="map-pin" :size="36" />
              </view>
              <view class="address-info">
                <view class="address-top">
                  <text class="address-name">{{ address.name }}</text>
                  <text class="address-phone">{{ address.phone }}</text>
                </view>
                <text class="address-detail">{{ address.detail }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="goods-card">
          <view class="card-content">
            <view class="shop-header">
              <view class="shop-icon">
                <ui-icon name="store" :size="32" />
              </view>
              <text class="shop-name">{{ order.shopName }}</text>
              <ui-icon name="arrow-right" :size="28" class="arrow-icon" />
            </view>
            
            <view v-for="item in order.goods" :key="item.id" class="goods-item">
              <ui-image :src="item.cover" width="160rpx" height="160rpx" radius="16rpx" />
              <view class="goods-info">
                <text class="goods-title">{{ item.title }}</text>
                <text class="goods-spec">{{ item.spec }}</text>
                <view class="goods-bottom">
                  <ui-price :value="item.price" :size="32" />
                  <text class="goods-quantity">x{{ item.quantity }}</text>
                </view>
              </view>
            </view>
            
            <view class="goods-total">
              <text class="total-label">共{{ totalQuantity }}件商品</text>
              <view class="total-price">
                <text class="total-label">合计：</text>
                <ui-price :value="order.goodsTotal" :size="32" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="info-card">
          <view class="card-content">
            <view class="info-title">订单信息</view>
            <view class="info-item">
              <text class="info-label">订单编号</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ order.orderNo }}</text>
                <text class="copy-btn" @click="copyOrderNo">复制</text>
              </view>
            </view>
            <view class="info-item">
              <text class="info-label">下单时间</text>
              <text class="info-value">{{ order.createTime }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">支付方式</text>
              <text class="info-value">{{ order.payMethod }}</text>
            </view>
            <view v-if="order.payTime" class="info-item">
              <text class="info-label">支付时间</text>
              <text class="info-value">{{ order.payTime }}</text>
            </view>
          </view>
        </view>
        
        <view class="price-card">
          <view class="card-content">
            <view class="info-title">费用明细</view>
            <view class="price-item">
              <text class="price-label">商品总额</text>
              <text class="price-value">¥{{ order.goodsTotal.toFixed(2) }}</text>
            </view>
            <view class="price-item">
              <text class="price-label">运费</text>
              <text class="price-value">{{ order.freight > 0 ? '¥' + order.freight.toFixed(2) : '免运费' }}</text>
            </view>
            <view class="price-item total">
              <text class="price-label">实付款</text>
              <view class="final-price">
                <ui-price :value="order.totalPrice" :size="40" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="service-card">
          <view class="card-content">
            <view class="service-item" @click="contactService">
              <view class="service-icon">
                <ui-icon name="headphones" :size="32" />
              </view>
              <text class="service-text">联系客服</text>
              <ui-icon name="arrow-right" :size="28" class="arrow-icon" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="detail-footer">
      <view class="footer-content">
        <view v-if="order.status === 'pending'" class="footer-actions">
          <ui-button plain @click="cancelOrder">取消订单</ui-button>
          <ui-button type="primary" @click="handlePay">立即付款</ui-button>
        </view>
        <view v-else-if="order.status === 'shipped'" class="footer-actions">
          <ui-button plain @click="checkLogistics">查看物流</ui-button>
          <ui-button type="primary" @click="remindShip">提醒发货</ui-button>
        </view>
        <view v-else-if="order.status === 'received'" class="footer-actions">
          <ui-button plain @click="applyAftersale">申请售后</ui-button>
          <ui-button plain @click="checkLogistics">查看物流</ui-button>
          <ui-button type="primary" @click="handleConfirm">确认收货</ui-button>
        </view>
        <view v-else-if="order.status === 'completed'" class="footer-actions">
          <ui-button plain @click="applyAftersale">申请售后</ui-button>
          <ui-button plain @click="buyAgain">再次购买</ui-button>
          <ui-button type="primary" @click="goEvaluate">去评价</ui-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { scrollHeight } = usePageLayout({
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
  payTime: '2024-01-15 10:32:15',
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

const countdown = ref('29:45');

const totalQuantity = computed(() => order.value.goods.reduce((sum, item) => sum + item.quantity, 0));

const statusConfig = computed(() => {
  const configs: Record<string, any> = {
    pending: { icon: 'clock', text: '待付款', desc: '请在30分钟内完成付款' },
    shipped: { icon: 'package', text: '待发货', desc: '商家正在准备发货' },
    received: { icon: 'truck', text: '待收货', desc: '商品正在配送中' },
    completed: { icon: 'check-circle', text: '已完成', desc: '订单已完成' }
  };
  return configs[order.value.status] || configs.pending;
});

const copyOrderNo = () => {
  uni.setClipboardData({
    data: order.value.orderNo,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'success' });
    }
  });
};

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

const cancelOrder = () => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消此订单吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '订单已取消', icon: 'success' });
      }
    }
  });
};

const checkLogistics = () => {
  uni.showToast({ title: '查看物流', icon: 'none' });
};

const remindShip = () => {
  uni.showToast({ title: '已提醒商家发货', icon: 'success' });
};

const buyAgain = () => {
  uni.showToast({ title: '已加入购物车', icon: 'success' });
};

const contactService = () => {
  uni.showToast({ title: '联系客服', icon: 'none' });
};

const applyAftersale = () => {
  uni.navigateTo({ url: `/pages-sub/trade/aftersale/apply?orderId=${order.value.id}` });
};
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  position: relative;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: $color-bg-page;
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  pointer-events: none;
  overflow: hidden;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
  }
  
  .circle-1 {
    width: 300rpx;
    height: 300rpx;
    top: -80rpx;
    right: -60rpx;
    background: radial-gradient(circle, rgba($color-primary, 0.15) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%);
    }
  }
  
  .circle-2 {
    width: 200rpx;
    height: 200rpx;
    top: 100rpx;
    left: -50rpx;
    background: radial-gradient(circle, rgba($color-accent, 0.1) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, transparent 70%);
    }
  }
}

.detail-scroll {
  overflow: hidden;
}

.detail-content {
  padding: $space-md;
  padding-bottom: 160rpx;
}

.status-card {
  @include flex-column-center;
  padding: $space-xl $space-lg;
  background: $gradient-sunset;
  border-radius: $radius-xl;
  margin-bottom: $space-md;
  position: relative;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  .status-icon-wrapper {
    position: relative;
    margin-bottom: $space-sm;
    
    .status-icon {
      width: 96rpx;
      height: 96rpx;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 50%;
      @include flex-center;
      position: relative;
      z-index: 2;
    }
    
    .status-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120rpx;
      height: 120rpx;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      animation: status-glow 2s ease-in-out infinite;
    }
  }
  
  .status-text {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-white;
    position: relative;
    z-index: 1;
  }
  
  .status-desc {
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.85);
    margin-top: $space-xs;
    position: relative;
    z-index: 1;
  }
  
  .countdown-bar {
    display: flex;
    align-items: center;
    margin-top: $space-md;
    padding: $space-xs $space-md;
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-full;
    position: relative;
    z-index: 1;
    
    .countdown-text {
      font-size: $font-size-sm;
      color: rgba(255, 255, 255, 0.9);
      margin-left: $space-xs;
    }
  }
}

@keyframes status-glow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.9;
  }
}

.address-card, .goods-card, .info-card, .price-card, .service-card {
  margin-bottom: $space-md;
  position: relative;
  z-index: 1;
  
  .card-content {
    background: $color-bg-card;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-radius: $radius-lg;
    padding: $space-md;
    border: 1px solid $color-border;
    
    [data-theme="dark"] & {
      background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
      border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
      border-bottom: 1px solid transparent;
      border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
      border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }
}

.address-card {
  .address-header {
    display: flex;
    align-items: flex-start;
    
    .address-icon {
      width: 64rpx;
      height: 64rpx;
      background: rgba($color-primary, 0.1);
      border-radius: $radius-md;
      @include flex-center;
      flex-shrink: 0;
      color: $color-primary;
      
      [data-theme="dark"] & {
        background: rgba(217, 70, 239, 0.15);
        color: var(--color-primary, #E879F9);
      }
    }
    
    .address-info {
      flex: 1;
      margin-left: $space-md;
      
      .address-top {
        display: flex;
        align-items: center;
        margin-bottom: $space-xs;
      }
      
      .address-name {
        font-size: $font-size-md;
        font-weight: $font-weight-bold;
        color: $color-text-main;
        
        [data-theme="dark"] & {
          color: var(--color-text-main, #F2F2F7);
        }
      }
      
      .address-phone {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-left: $space-md;
        
        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }
      
      .address-detail {
        font-size: $font-size-sm;
        color: $color-text-sub;
        line-height: 1.5;
        
        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }
    }
  }
}

.goods-card {
  .shop-header {
    display: flex;
    align-items: center;
    padding-bottom: $space-md;
    margin-bottom: $space-md;
    border-bottom: 1rpx solid $color-divider;
    
    [data-theme="dark"] & {
      border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
    
    .shop-icon {
      width: 48rpx;
      height: 48rpx;
      background: rgba($color-primary, 0.1);
      border-radius: $radius-sm;
      @include flex-center;
      color: $color-primary;
      
      [data-theme="dark"] & {
        background: rgba(217, 70, 239, 0.15);
        color: var(--color-primary, #E879F9);
      }
    }
    
    .shop-name {
      flex: 1;
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
      margin-left: $space-sm;
      
      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
    
    .arrow-icon {
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }
  
  .goods-item {
    display: flex;
    padding: $space-sm 0;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid $color-divider;
      margin-bottom: $space-sm;
      
      [data-theme="dark"] & {
        border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
      }
    }
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(2);
        
        [data-theme="dark"] & {
          color: var(--color-text-main, #F2F2F7);
        }
      }
      
      .goods-spec {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
        
        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $space-sm;
        
        .goods-quantity {
          font-size: $font-size-sm;
          color: $color-text-sub;
          
          [data-theme="dark"] & {
            color: var(--color-text-sub, #A1A1AA);
          }
        }
      }
    }
  }
  
  .goods-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: $space-md;
    margin-top: $space-sm;
    border-top: 1rpx solid $color-divider;
    
    [data-theme="dark"] & {
      border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
    
    .total-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
    
    .total-price {
      display: flex;
      align-items: center;
    }
  }
}

.info-card, .price-card {
  .info-title {
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-bottom: $space-md;
    
    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
  }
  
  .info-item, .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-sm 0;
    
    .info-label, .price-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
    
    .info-value, .price-value {
      font-size: $font-size-sm;
      color: $color-text-main;
      
      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
    
    .info-value-wrapper {
      display: flex;
      align-items: center;
      
      .copy-btn {
        font-size: $font-size-xs;
        color: $color-primary;
        margin-left: $space-sm;
        padding: 4rpx 12rpx;
        background: rgba($color-primary, 0.1);
        border-radius: $radius-sm;
        
        [data-theme="dark"] & {
          color: var(--color-primary, #E879F9);
          background: rgba(217, 70, 239, 0.15);
        }
      }
    }
    
    &.total {
      margin-top: $space-sm;
      padding-top: $space-md;
      border-top: 1rpx solid $color-divider;
      
      [data-theme="dark"] & {
        border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
      }
      
      .price-label {
        color: $color-text-main;
        
        [data-theme="dark"] & {
          color: var(--color-text-main, #F2F2F7);
        }
      }
      
      .final-price {
        :deep(.ui-price) {
          color: $color-error;
          
          [data-theme="dark"] & {
            color: var(--color-error, #FF4081);
            text-shadow: 0 0 10px rgba(255, 64, 129, 0.3);
          }
        }
      }
    }
  }
}

.service-card {
  .service-item {
    display: flex;
    align-items: center;
    padding: $space-sm 0;
    
    .service-icon {
      width: 48rpx;
      height: 48rpx;
      background: rgba($color-primary, 0.1);
      border-radius: $radius-sm;
      @include flex-center;
      color: $color-primary;
      
      [data-theme="dark"] & {
        background: rgba(217, 70, 239, 0.15);
        color: var(--color-primary, #E879F9);
      }
    }
    
    .service-text {
      flex: 1;
      font-size: $font-size-md;
      color: $color-text-main;
      margin-left: $space-sm;
      
      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
    
    .arrow-icon {
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  
  .footer-content {
    padding: $space-md;
    padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
    background: $color-bg-card;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid $color-border;
    
    [data-theme="dark"] & {
      background: rgba(22, 22, 30, 0.9);
      border-top-color: var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }
  
  .footer-actions {
    display: flex;
    gap: $space-sm;

    :deep(.ui-button) {
      flex: 1;
      height: 80rpx;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      border-radius: $radius-lg;
      
      &[type="primary"] {
        background: $gradient-sunset;
        border: none;
        
        [data-theme="dark"] & {
          background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
        }
      }
    }
  }
}
</style>
