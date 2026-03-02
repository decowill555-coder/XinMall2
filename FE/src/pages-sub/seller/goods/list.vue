﻿<template>
  <view class="goods-list-page">
    <ui-sub-navbar title="商品管理" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="goods-scroll">
      <view v-if="goodsList.length === 0" class="empty-state">
        <ui-icon name="package" :size="80" color="#A1A1A6" />
        <text class="empty-text">暂无商品</text>
        <ui-button type="primary" size="sm" @click="goPublish">发布商品</ui-button>
      </view>
      
      <view v-else class="goods-list">
        <view v-for="item in goodsList" :key="item.id" class="goods-item">
          <ui-image :src="item.cover" width="160rpx" height="160rpx" radius="8rpx" />
          <view class="goods-info">
            <text class="goods-title">{{ item.title }}</text>
            <view class="goods-tags">
              <ui-tag :type="item.status === 'on' ? 'success' : 'warning'" size="sm">
                {{ item.status === 'on' ? '在售' : '下架' }}
              </ui-tag>
              <ui-tag v-if="item.isRecommend" type="primary" size="sm">推荐</ui-tag>
            </view>
            <view class="goods-bottom">
              <ui-price :value="item.price" ::size="40" />
              <text class="goods-stock">库存{{ item.stock }}</text>
            </view>
          </view>
          <view class="goods-actions">
            <text class="action-btn" @click="handleEdit(item)">编辑</text>
            <text class="action-btn" @click="handleToggle(item)">
              {{ item.status === 'on' ? '下架' : '上架' }}
            </text>
            <text class="action-btn danger" @click="handleDelete(item)">删除</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="list-footer">
      <ui-button type="primary" block @click="goPublish">发布新商品</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '在售' },
  { name: '下架' }
]);

const goodsList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=l1', title: 'iPhone 15 Pro Max 256GB 钛金属原色', price: 7999, stock: 10, status: 'on', isRecommend: true },
  { id: 2, cover: 'https://picsum.photos/200/200?random=l2', title: 'MacBook Pro 14寸 M3芯片', price: 12999, stock: 5, status: 'on', isRecommend: false },
  { id: 3, cover: 'https://picsum.photos/200/200?random=l3', title: 'AirPods Pro 第二代', price: 1399, stock: 30, status: 'on', isRecommend: true },
  { id: 4, cover: 'https://picsum.photos/200/200?random=l4', title: 'iPad Pro 12.9寸 M2', price: 6999, stock: 0, status: 'off', isRecommend: false }
]);

const goPublish = () => {
  uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
};

const handleEdit = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
};

const handleToggle = (item: any) => {
  const action = item.status === 'on' ? '下架' : '上架';
  uni.showModal({
    title: '提示',
    content: `确定${action}该商品吗？`,
    success: (res) => {
      if (res.confirm) {
        item.status = item.status === 'on' ? 'off' : 'on';
        uni.showToast({ title: `${action}成功`, icon: 'success' });
      }
    }
  });
};

const handleDelete = (item: any) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该商品吗？删除后无法恢复',
    success: (res) => {
      if (res.confirm) {
        const index = goodsList.value.findIndex(g => g.id === item.id);
        if (index > -1) {
          goodsList.value.splice(index, 1);
          uni.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.goods-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.goods-scroll {
  height: calc(100vh - 88rpx - 88rpx - 120rpx);
  padding: $space-sm $space-md;
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

.goods-list {
  .goods-item {
    display: flex;
    padding: $space-md;
    background: $color-white;
    border-radius: $radius-md;
    margin-bottom: $space-sm;
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      
      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(2);
      }
      
      .goods-tags {
        display: flex;
        gap: $space-xs;
        margin: $space-xs 0;
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .goods-stock {
          font-size: $font-size-xs;
          color: $color-text-disabled;
        }
      }
    }
    
    .goods-actions {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: $space-sm;
      
      .action-btn {
        font-size: $font-size-xs;
        color: $color-primary;
        padding: $space-xs;
        
        &.danger { color: $color-error; }
      }
    }
  }
}

.list-footer {
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
