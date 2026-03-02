﻿<template>
  <view class="product-list-page">
    <ui-sub-navbar title="商品列表" />
    
    <view class="filter-bar">
      <ui-tabs v-model="sortType" :list="sortList" type="line" />
    </view>
    
    <scroll-view scroll-y class="product-scroll" @scrolltolower="loadMore">
      <view class="product-grid">
        <view 
          v-for="item in productList" 
          :key="item.id" 
          class="product-item"
          @click="goDetail(item)"
        >
          <ui-image :src="item.cover" width="100%" height="340rpx" radius="12rpx" />
          <view class="product-info">
            <text class="product-title">{{ item.title }}</text>
            <view class="product-tags">
              <ui-tag v-for="tag in item.tags?.slice(0, 2)" :key="tag" type="primary" size="sm">{{ tag }}</ui-tag>
            </view>
            <view class="product-bottom">
              <ui-price :value="item.price" type="main" ::size="40" />
              <text class="sales">{{ item.sales }}人付款</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="load-more">
        <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const sortType = ref(0);
const loading = ref(false);

const sortList = ref([
  { name: '综合' },
  { name: '最新' },
  { name: '价格' },
  { name: '销量' }
]);

const productList = ref([
  { id: 1, cover: 'https://picsum.photos/400/400?random=201', title: 'iPhone 15 Pro Max 256GB 钛金属原色', price: 7999, sales: 128, tags: ['99新', '在保'] },
  { id: 2, cover: 'https://picsum.photos/400/400?random=202', title: 'MacBook Pro 14寸 M3芯片 16G+512G', price: 12999, sales: 56, tags: ['全新', '官方质保'] },
  { id: 3, cover: 'https://picsum.photos/400/400?random=203', title: 'iPad Pro 12.9寸 M2芯片 256G WiFi', price: 6999, sales: 89, tags: ['95新', '送配件'] },
  { id: 4, cover: 'https://picsum.photos/400/400?random=204', title: 'AirPods Pro 第二代 USB-C', price: 1399, sales: 256, tags: ['全新', '正品'] },
  { id: 5, cover: 'https://picsum.photos/400/400?random=205', title: 'Sony WH-1000XM5 头戴式降噪耳机', price: 2199, sales: 78, tags: ['9成新', '箱说全'] },
  { id: 6, cover: 'https://picsum.photos/400/400?random=206', title: 'Nintendo Switch OLED 白色续航版', price: 1899, sales: 167, tags: ['99新', '双系统'] }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};

const loadMore = () => {
  if (loading.value) return;
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.product-scroll {
  height: calc(100vh - 88rpx - 88rpx);
  padding: $space-sm $space-md;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-sm;
}

.product-item {
  background: $color-white;
  border-radius: $radius-md;
  overflow: hidden;
  
  .product-info {
    padding: $space-sm;
  }
  
  .product-title {
    font-size: $font-size-sm;
    color: $color-text-main;
    line-height: 1.4;
    @include text-ellipsis(2);
  }
  
  .product-tags {
    display: flex;
    gap: $space-xs;
    margin: $space-xs 0;
  }
  
  .product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .sales {
      font-size: $font-size-xs;
      color: $color-text-disabled;
    }
  }
}

.load-more {
  text-align: center;
  padding: $space-lg;
  font-size: $font-size-sm;
  color: $color-text-disabled;
}
</style>
