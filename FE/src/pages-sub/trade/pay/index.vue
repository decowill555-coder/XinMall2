﻿<template>
  <view class="pay-page">
    <ui-sub-navbar title="支付" />
    
    <view class="pay-content">
      <view class="amount-card">
        <text class="amount-label">支付金额</text>
        <view class="amount-value">
          <text class="currency">¥</text>
          <text class="number">{{ amount }}</text>
        </view>
      </view>
      
      <view class="order-info">
        <text class="info-label">订单信息</text>
        <text class="info-value">{{ orderInfo }}</text>
      </view>
      
      <view class="pay-methods">
        <text class="section-title">选择支付方式</text>
        
        <view 
          v-for="method in payMethods" 
          :key="method.id" 
          class="method-item"
          :class="{ active: selectedMethod === method.id }"
          @click="selectedMethod = method.id"
        >
          <view class="method-left">
            <ui-icon :name="method.icon" ::size="40" :color="method.color" />
            <text class="method-name">{{ method.name }}</text>
          </view>
          <ui-icon 
            :name="selectedMethod === method.id ? 'check-circle-fill' : 'circle'" 
            ::size="40" 
            :color="selectedMethod === method.id ? '#1ABC9C' : '#A1A1A6'" 
          />
        </view>
      </view>
      
      <view class="countdown" v-if="countdown > 0">
        <text>支付剩余时间 {{ formatTime(countdown) }}</text>
      </view>
    </view>
    
    <view class="pay-footer">
      <ui-button type="primary" block :loading="paying" @click="handlePay">
        立即支付 ¥{{ amount }}
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const amount = ref('9398.00');
const orderInfo = ref('iPhone 15 Pro Max 256GB 等2件商品');
const selectedMethod = ref('wechat');
const paying = ref(false);
const countdown = ref(1800);

let timer: number | null = null;

const payMethods = ref([
  { id: 'wechat', name: '微信支付', icon: 'message', color: '#07C160' },
  { id: 'alipay', name: '支付宝', icon: 'credit-card', color: '#1677FF' }
]);

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const handlePay = () => {
  paying.value = true;
  
  setTimeout(() => {
    paying.value = false;
    uni.showToast({ title: '支付成功', icon: 'success' });
    setTimeout(() => {
      uni.redirectTo({ url: '/pages-sub/trade/order/detail?id=1' });
    }, 1500);
  }, 2000);
};

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
  min-height: 100vh;
  background: $color-bg-page;
}

.pay-content {
  padding: $space-md;
}

.amount-card {
  @include flex-column-center;
  padding: $space-xl;
  background: $color-white;
  border-radius: $radius-lg;
  margin-bottom: $space-sm;
  
  .amount-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
  
  .amount-value {
    margin-top: $space-sm;
    
    .currency {
      font-size: $font-size-lg;
      color: $color-text-main;
    }
    
    .number {
      font-size: 64rpx;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
  }
}

.order-info {
  display: flex;
  justify-content: space-between;
  padding: $space-md;
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .info-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
  
  .info-value {
    font-size: $font-size-sm;
    color: $color-text-main;
    max-width: 400rpx;
    @include text-ellipsis(1);
  }
}

.pay-methods {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .method-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    border-bottom: 1rpx solid $color-divider;
    
    &:last-child { border-bottom: none; }
    
    .method-left {
      display: flex;
      align-items: center;
      
      .method-name {
        font-size: $font-size-md;
        color: $color-text-main;
        margin-left: $space-sm;
      }
    }
  }
}

.countdown {
  text-align: center;
  padding: $space-md;
  font-size: $font-size-sm;
  color: $color-text-sub;
}

.pay-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
