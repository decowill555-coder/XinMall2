<template>
  <view class="pay-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="支付" />
    
    <scroll-view scroll-y class="pay-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="pay-content">
        <view class="amount-card">
          <view class="amount-header">
            <ui-icon name="shield-check" :size="36" color="var(--color-primary, #FF6A00)" />
            <text class="secure-text">安全支付</text>
          </view>
          <view class="amount-body">
            <text class="amount-label">支付金额</text>
            <view class="amount-value">
              <text class="currency">¥</text>
              <text class="number">{{ amount }}</text>
            </view>
          </view>
          <view class="countdown-wrapper" v-if="countdown > 0">
            <ui-icon name="clock" :size="24" color="warning" />
            <text class="countdown-text">剩余支付时间 {{ formatTime(countdown) }}</text>
          </view>
        </view>
        
        <view class="order-card">
          <view class="card-header">
            <text class="card-title">订单信息</text>
          </view>
          
          <view class="goods-preview">
            <ui-image :src="order.cover" width="120rpx" height="120rpx" radius="md" />
            <view class="goods-info">
              <text class="goods-title">{{ order.title }}</text>
              <text class="goods-price">¥{{ order.price }}</text>
            </view>
          </view>
          
          <view class="order-detail-list">
            <view class="order-detail-item">
              <text class="detail-label">订单编号</text>
              <text class="detail-value">{{ order.orderNo }}</text>
            </view>
            <view class="order-detail-item">
              <text class="detail-label">创建时间</text>
              <text class="detail-value">{{ order.createdAt }}</text>
            </view>
            <view class="order-detail-item">
              <text class="detail-label">商品金额</text>
              <text class="detail-value">¥{{ order.price }}</text>
            </view>
            <view class="order-detail-item">
              <text class="detail-label">运费</text>
              <text class="detail-value">{{ order.freight > 0 ? '¥' + order.freight : '免运费' }}</text>
            </view>
            <view class="order-detail-item total">
              <text class="detail-label">订单总额</text>
              <text class="detail-value price">¥{{ order.totalAmount }}</text>
            </view>
          </view>
        </view>
        
        <view class="pay-methods-card">
          <view class="card-header">
            <text class="card-title">选择支付方式</text>
          </view>
          
          <view 
            v-for="method in payMethods" 
            :key="method.id" 
            class="method-item"
            :class="{ active: selectedMethod === method.id }"
            @click="selectedMethod = method.id"
          >
            <view class="method-left">
              <view class="method-icon" :style="{ background: method.bgColor }">
                <ui-icon :name="method.icon" :size="32" color="white" />
              </view>
              <view class="method-info">
                <text class="method-name">{{ method.name }}</text>
                <text class="method-desc">{{ method.desc }}</text>
              </view>
            </view>
            <view class="method-check">
              <view 
                class="check-circle"
                :class="{ checked: selectedMethod === method.id }"
              >
                <ui-icon
                  v-if="selectedMethod === method.id"
                  name="check"
                  :size="20"
                  color="white"
                />
              </view>
            </view>
          </view>
        </view>
        
        <view class="tips-card">
          <view class="tip-item">
            <ui-icon name="shield-check" :size="24" color="var(--color-primary, #FF6A00)" />
            <text>平台担保交易，资金安全有保障</text>
          </view>
          <view class="tip-item">
            <ui-icon name="refresh" :size="24" color="var(--color-primary, #FF6A00)" />
            <text>支持七天无理由退款</text>
          </view>
        </view>
        
        <view class="bottom-space"></view>
      </view>
    </scroll-view>
    
    <view class="pay-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <view class="footer-content">
        <view class="footer-left">
          <text class="pay-label">实付款</text>
          <view class="pay-amount">
            <text class="currency">¥</text>
            <text class="amount">{{ amount }}</text>
          </view>
        </view>
        <ui-button 
          type="primary" 
          :loading="paying" 
          :disabled="countdown <= 0"
          @click="handlePay"
        >
          {{ countdown > 0 ? '立即支付' : '订单已超时' }}
        </ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack } = useNavigation();

const orderNo = ref('');
const amount = ref('6999.00');
const selectedMethod = ref('wechat');
const paying = ref(false);
const countdown = ref(1800);

const order = ref({
  orderNo: 'XM202401150001',
  title: 'iPhone 14 Pro Max 256GB 远峰蓝',
  cover: 'https://picsum.photos/400/400?random=1',
  price: '6999.00',
  freight: 0,
  totalAmount: '6999.00',
  createdAt: '2024-01-15 14:30:00'
});

let timer: number | null = null;

const payMethods = ref([
  { 
    id: 'wechat', 
    name: '微信支付', 
    desc: '推荐使用',
    icon: 'message', 
    bgColor: 'linear-gradient(135deg, #07C160 0%, #05A84F 100%)'
  },
  { 
    id: 'alipay', 
    name: '支付宝', 
    desc: '快捷支付',
    icon: 'credit-card', 
    bgColor: 'linear-gradient(135deg, #1677FF 0%, #0958D9 100%)'
  },
  { 
    id: 'balance', 
    name: '余额支付', 
    desc: '余额: ¥0.00',
    icon: 'wallet', 
    bgColor: 'linear-gradient(135deg, #FF9500 0%, #FF6A00 100%)'
  }
]);

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const handlePay = () => {
  if (countdown.value <= 0) {
    uni.showToast({ title: '订单已超时', icon: 'none' });
    return;
  }
  
  paying.value = true;
  
  setTimeout(() => {
    paying.value = false;
    uni.showToast({ title: '支付成功', icon: 'success' });
    setTimeout(() => {
      uni.redirectTo({ url: `/pages-sub/trade/order/detail?id=${orderNo.value}` });
    }, 1500);
  }, 2000);
};

onLoad((options: any) => {
  if (options.orderNo) {
    orderNo.value = options.orderNo;
    order.value.orderNo = options.orderNo;
  }
});

onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (timer) clearInterval(timer);
    }
  }, 1000) as unknown as number;
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.pay-page {
  @include page-gradient-bg;
  min-height: 100vh;
}

.bg-decoration {
  @include decoration-container;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 200rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.pay-scroll {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.pay-content {
  padding: $space-sm $space-md;
}

.amount-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-sm;
  
  .amount-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    margin-bottom: $space-md;
    
    .secure-text {
      font-size: $font-size-sm;
      @include text-sub;
    }
  }
  
  .amount-body {
    @include flex-column-center;
    
    .amount-label {
      font-size: $font-size-sm;
      @include text-sub;
    }
    
    .amount-value {
      display: flex;
      align-items: baseline;
      margin-top: $space-sm;
      
      .currency {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-error;
      }

      .number {
        font-size: 64rpx;
        font-weight: $font-weight-bold;
        color: $color-error;
        line-height: 1;
      }
    }
  }
  
  .countdown-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    margin-top: $space-lg;
    padding-top: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .countdown-text {
      font-size: $font-size-sm;
      color: $color-warning;
    }
  }
}

.order-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .card-header {
    margin-bottom: $space-md;
    
    .card-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
  }
  
  .goods-preview {
    display: flex;
    padding: $space-sm;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: $radius-md;
    margin-bottom: $space-md;
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-title {
        font-size: $font-size-sm;
        @include text-main;
        @include text-ellipsis(2);
        line-height: 1.4;
      }
      
      .goods-price {
        font-size: $font-size-md;
        font-weight: $font-weight-bold;
        color: $color-error;
      }
    }
  }
  
  .order-detail-list {
    .order-detail-item {
      display: flex;
      justify-content: space-between;
      padding: $space-xs 0;
      
      .detail-label {
        font-size: $font-size-sm;
        @include text-sub;
      }
      
      .detail-value {
        font-size: $font-size-sm;
        @include text-main;
        
        &.price {
          color: $color-error;
          font-weight: $font-weight-bold;
        }
      }
      
      &.total {
        margin-top: $space-sm;
        padding-top: $space-sm;
        border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
        
        .detail-label {
          @include text-main;
          font-weight: $font-weight-medium;
        }
      }
    }
  }
}

.pay-methods-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .card-header {
    margin-bottom: $space-md;
    
    .card-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
  }
}

.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md 0;
  border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
  transition: all $duration-fast $ease-out;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    margin: 0 (-$space-md);
    padding: $space-md;
    border-radius: $radius-md;
    border-bottom: none;
  }
  
  .method-left {
    display: flex;
    align-items: center;
    
    .method-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: $radius-md;
      @include flex-center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    }
    
    .method-info {
      margin-left: $space-md;
      
      .method-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        @include text-main;
        display: block;
      }
      
      .method-desc {
        font-size: $font-size-xs;
        @include text-sub;
        margin-top: 4rpx;
        display: block;
      }
    }
  }
  
  .method-check {
    .check-circle {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid var(--color-text-disabled, #C7C7CC);
      @include flex-center;
      transition: all $duration-fast $ease-out;
      
      &.checked {
        background: $gradient-sunset;
        border-color: transparent;
        box-shadow: 0 4rpx 12rpx rgba($color-primary, 0.3);
      }
    }
  }
}

.tips-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: $space-xs;
    padding: $space-xs 0;
    font-size: $font-size-sm;
    @include text-sub;
  }
}

.bottom-space {
  height: 180rpx;
}

.pay-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    
    .footer-left {
      display: flex;
      flex-direction: column;
      
      .pay-label {
        font-size: $font-size-xs;
        @include text-sub;
      }
      
      .pay-amount {
        display: flex;
        align-items: baseline;
        
        .currency {
          font-size: $font-size-md;
          font-weight: $font-weight-bold;
          color: $color-error;
        }

        .amount {
          font-size: 40rpx;
          font-weight: $font-weight-bold;
          color: $color-error;
        }
      }
    }
    
    :deep(.ui-button) {
      min-width: 240rpx;
      height: 88rpx;
      font-size: $font-size-md;
      font-weight: $font-weight-bold;
      border-radius: $radius-lg;
      background: $gradient-sunset;
      box-shadow: $shadow-glow-primary;
      
      &.is-disabled {
        opacity: 0.5;
        box-shadow: none;
      }
    }
  }
}
</style>
