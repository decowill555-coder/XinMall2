<template>
  <view class="confirm-page">
    <ui-sub-navbar title="确认订单" />
    
    <scroll-view scroll-y class="confirm-scroll">
      <view class="address-card" @click="selectAddress">
        <view v-if="address" class="address-content">
          <view class="address-header">
            <ui-icon name="map-pin" :size="20" />
            <text class="address-name">{{ address.name }}</text>
            <text class="address-phone">{{ address.phone }}</text>
          </view>
          <text class="address-detail">{{ address.detail }}</text>
        </view>
        <view v-else class="address-empty">
          <ui-icon name="plus" :size="20" />
          <text>添加收货地址</text>
        </view>
        <ui-icon name="arrow-right" :size="20" />
      </view>
      
      <view class="goods-card">
        <view class="shop-header">
          <ui-icon name="store" :size="20" />
          <text class="shop-name">{{ order.shopName }}</text>
        </view>
        
        <view v-for="item in order.goods" :key="item.id" class="goods-item">
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
      </view>
      
      <view class="info-card">
        <view class="info-item">
          <text class="info-label">配送方�?/text>
          <text class="info-value">快递包�?/text>
        </view>
        <view class="info-item" @click="showRemark = true">
          <text class="info-label">订单备注</text>
          <view class="info-right">
            <text class="info-value">{{ remark || '选填' }}</text>
            <ui-icon name="arrow-right" :size="16" />
          </view>
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
          <text class="price-label">合计</text>
          <ui-price :value="order.totalPrice" :size="32" />
        </view>
      </view>
    </scroll-view>
    
    <view class="confirm-footer">
      <view class="footer-left">
        <text class="total-label">实付款：</text>
        <ui-price :value="order.totalPrice" type="main" :size="36" />
      </view>
      <ui-button type="primary" @click="handleSubmit">提交订单</ui-button>
    </view>
    
    <ui-popup v-model="showRemark" position="bottom" round>
      <view class="remark-popup">
        <view class="popup-header">
          <text class="popup-title">订单备注</text>
          <text class="popup-confirm" @click="showRemark = false">确定</text>
        </view>
        <textarea 
          v-model="remark" 
          class="remark-input" 
          placeholder="请输入备注信息（选填�?
          :maxlength="100"
        />
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showRemark = ref(false);
const remark = ref('');

const address = ref({
  id: 1,
  name: '张三',
  phone: '138****8888',
  detail: '北京市朝阳区建国�?8号SOHO现代城A�?201�?
});

const order = ref({
  shopName: '数码达人小店',
  goodsTotal: 9398,
  freight: 0,
  totalPrice: 9398,
  goods: [
    { id: 1, cover: 'https://picsum.photos/200/200?random=601', title: 'iPhone 15 Pro Max 256GB', spec: '钛金属原�?, price: 7999, quantity: 1 },
    { id: 2, cover: 'https://picsum.photos/200/200?random=602', title: 'AirPods Pro 第二�?, spec: 'USB-C', price: 1399, quantity: 1 }
  ]
});

const selectAddress = () => {
  uni.navigateTo({ url: '/pages-sub/user/address/list?select=1' });
};

const handleSubmit = () => {
  if (!address.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '提交�?..' });
  setTimeout(() => {
    uni.hideLoading();
    uni.redirectTo({ url: '/pages-sub/trade/pay/index?id=1' });
  }, 1000);
};
</script>

<style lang="scss" scoped>
.confirm-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.confirm-scroll {
  height: calc(100vh - 88rpx - 120rpx);
  padding: $space-sm $space-md;
}

.address-card {
  display: flex;
  align-items: center;
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .address-content {
    flex: 1;
    
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
  
  .address-empty {
    flex: 1;
    display: flex;
    align-items: center;
    color: $color-primary;
    font-size: $font-size-md;
    
    text { margin-left: $space-sm; }
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
  
  .info-right {
    display: flex;
    align-items: center;
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

.confirm-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 120rpx;
  padding: 0 $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .footer-left {
    display: flex;
    align-items: baseline;
    
    .total-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
}

.remark-popup {
  padding: $space-md;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .popup-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
    
    .popup-confirm {
      font-size: $font-size-md;
      color: $color-primary;
    }
  }
  
  .remark-input {
    width: 100%;
    height: 200rpx;
    padding: $space-md;
    background: $color-bg-gray;
    border-radius: $radius-md;
    font-size: $font-size-md;
    box-sizing: border-box;
  }
}
</style>
