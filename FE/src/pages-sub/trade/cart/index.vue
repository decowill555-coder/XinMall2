﻿<template>
  <view class="cart-page">
    <ui-sub-navbar title="购物车" />
    
    <scroll-view scroll-y class="cart-scroll">
      <view v-if="cartList.length === 0" class="empty-state">
        <ui-icon name="shopping-cart" :size="80" color="#A1A1A6" />
        <text class="empty-text">购物车空空如也</text>
        <ui-button type="primary" size="sm" @click="goShopping">去逛逛</ui-button>
      </view>
      
      <view v-else class="cart-list">
        <view v-for="item in cartList" :key="item.id" class="cart-item">
          <view class="item-check" @click="toggleSelect(item)">
            <ui-icon 
              :name="item.selected ? 'check-circle-fill' : 'circle'" 
              ::size="40" 
              :color="item.selected ? '#1ABC9C' : '#A1A1A6'" 
            />
          </view>
          <ui-image :src="item.cover" width="180rpx" height="180rpx" radius="12rpx" />
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-spec">{{ item.spec }}</text>
            <view class="item-bottom">
              <ui-price :value="item.price" type="main" :size="28" />
              <ui-stepper v-model="item.quantity" :min="1" :max="99" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view v-if="cartList.length > 0" class="cart-footer">
      <view class="footer-left">
        <view class="check-all" @click="toggleSelectAll">
          <ui-icon 
            :name="isAllSelected ? 'check-circle-fill' : 'circle'" 
            ::size="40" 
            :color="isAllSelected ? '#1ABC9C' : '#A1A1A6'" 
          />
          <text>全选</text>
        </view>
      </view>
      <view class="footer-right">
        <view class="total-price">
          <text class="label">合计：</text>
          <ui-price :value="totalPrice" type="main" :size="36" />
        </view>
        <ui-button type="primary" :disabled="selectedCount === 0" @click="goConfirm">
          结算({{ selectedCount }})
        </ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const cartList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=301', title: 'iPhone 15 Pro Max 256GB', spec: '钛金属原色', price: 7999, quantity: 1, selected: true },
  { id: 2, cover: 'https://picsum.photos/200/200?random=302', title: 'AirPods Pro 第二代', spec: 'USB-C', price: 1399, quantity: 2, selected: true },
  { id: 3, cover: 'https://picsum.photos/200/200?random=303', title: 'MacBook Pro 14寸', spec: 'M3芯片 16G+512G', price: 12999, quantity: 1, selected: false }
]);

const isAllSelected = computed(() => cartList.value.every(item => item.selected));

const selectedCount = computed(() => cartList.value.filter(item => item.selected).length);

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const toggleSelect = (item: any) => {
  item.selected = !item.selected;
};

const toggleSelectAll = () => {
  const newState = !isAllSelected.value;
  cartList.value.forEach(item => item.selected = newState);
};

const goShopping = () => {
  uni.switchTab({ url: '/pages/index/index' });
};

const goConfirm = () => {
  uni.navigateTo({ url: '/pages-sub/trade/order/confirm' });
};
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.cart-scroll {
  height: calc(100vh - 88rpx - 120rpx);
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin: $space-md 0;
  }
}

.cart-list {
  padding: $space-sm $space-md;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .item-check {
    margin-right: $space-sm;
  }
  
  .item-info {
    flex: 1;
    margin-left: $space-md;
    
    .item-title {
      font-size: $font-size-md;
      color: $color-text-main;
      @include text-ellipsis(2);
    }
    
    .item-spec {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin: $space-xs 0;
    }
    
    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-sm;
    }
  }
}

.cart-footer {
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
    .check-all {
      display: flex;
      align-items: center;
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
  
  .footer-right {
    display: flex;
    align-items: center;
    
    .total-price {
      display: flex;
      align-items: baseline;
      margin-right: $space-md;
      
      .label {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
    }
  }
}
</style>
