<template>
  <view class="shop-page">
    <ui-navbar title="我的店铺" :back="true" />
    
    <scroll-view scroll-y class="shop-scroll">
      <view class="shop-header">
        <view class="shop-info">
          <ui-avatar :src="shopInfo.logo" :size="120" />
          <view class="shop-detail">
            <text class="shop-name">{{ shopInfo.name }}</text>
            <text class="shop-desc">{{ shopInfo.desc }}</text>
            <view class="shop-tags">
              <ui-tag v-if="shopInfo.isVerified" type="success" size="sm">已认证</ui-tag>
              <ui-tag type="primary" size="sm">营业中</ui-tag>
            </view>
          </view>
        </view>
        
        <view class="shop-stats">
          <view class="stat-item">
            <text class="stat-value">{{ shopInfo.goodsCount }}</text>
            <text class="stat-label">商品</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ shopInfo.salesCount }}</text>
            <text class="stat-label">销量</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ shopInfo.followers }}</text>
            <text class="stat-label">粉丝</text>
          </view>
        </view>
      </view>
      
      <view class="quick-actions">
        <view class="action-item" @click="goPublish">
          <view class="action-icon">
            <ui-icon name="plus" :size="24" />
          </view>
          <text class="action-text">发布商品</text>
        </view>
        <view class="action-item" @click="goGoodsList">
          <view class="action-icon">
            <ui-icon name="package" :size="24" />
          </view>
          <text class="action-text">商品管理</text>
        </view>
        <view class="action-item" @click="goOrderList">
          <view class="action-icon">
            <ui-icon name="file-text" :size="24" />
          </view>
          <text class="action-text">订单管理</text>
        </view>
        <view class="action-item" @click="goAfterSale">
          <view class="action-icon">
            <ui-icon name="refresh" :size="24" />
          </view>
          <text class="action-text">售后管理</text>
        </view>
      </view>
      
      <view class="order-overview">
        <view class="section-header">
          <text class="section-title">订单概览</text>
          <text class="section-more" @click="goOrderList">查看全部</text>
        </view>
        <view class="order-tabs">
          <view class="order-item" @click="goOrderList('pending')">
            <text class="order-count">{{ orderCounts.pending }}</text>
            <text class="order-label">待发货</text>
          </view>
          <view class="order-item" @click="goOrderList('shipped')">
            <text class="order-count">{{ orderCounts.shipped }}</text>
            <text class="order-label">已发货</text>
          </view>
          <view class="order-item" @click="goOrderList('completed')">
            <text class="order-count">{{ orderCounts.completed }}</text>
            <text class="order-label">已完成</text>
          </view>
          <view class="order-item" @click="goAfterSale">
            <text class="order-count">{{ orderCounts.refund }}</text>
            <text class="order-label">售后</text>
          </view>
        </view>
      </view>
      
      <view class="goods-section">
        <view class="section-header">
          <text class="section-title">在售商品</text>
          <text class="section-more" @click="goGoodsList">管理商品</text>
        </view>
        <scroll-view scroll-x class="goods-scroll">
          <view class="goods-list">
            <view v-for="item in goodsList" :key="item.id" class="goods-item" @click="goEdit(item)">
              <ui-image :src="item.cover" width="200rpx" height="200rpx" radius="8rpx" />
              <text class="goods-title">{{ item.title }}</text>
              <view class="goods-bottom">
                <ui-price :value="item.price" :size="24" />
                <text class="goods-stock">库存{{ item.stock }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
    
    <view class="shop-footer">
      <ui-button type="primary" block @click="goPublish">发布新商品</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const shopInfo = ref({
  logo: 'https://picsum.photos/200/200?random=shop',
  name: '数码达人小店',
  desc: '专注正品数码，诚信经营',
  isVerified: true,
  goodsCount: 56,
  salesCount: 1289,
  followers: 3680
});

const orderCounts = ref({
  pending: 5,
  shipped: 12,
  completed: 89,
  refund: 2
});

const goodsList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=g1', title: 'iPhone 15 Pro Max', price: 7999, stock: 10 },
  { id: 2, cover: 'https://picsum.photos/200/200?random=g2', title: 'MacBook Pro 14', price: 12999, stock: 5 },
  { id: 3, cover: 'https://picsum.photos/200/200?random=g3', title: 'AirPods Pro 2', price: 1399, stock: 30 },
  { id: 4, cover: 'https://picsum.photos/200/200?random=g4', title: 'iPad Pro 12.9', price: 6999, stock: 8 }
]);

const goPublish = () => {
  uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
};

const goGoodsList = () => {
  uni.navigateTo({ url: '/pages-sub/seller/goods/list' });
};

const goOrderList = (type?: string) => {
  const url = type ? `/pages-sub/seller/order/list?type=${type}` : '/pages-sub/seller/order/list';
  uni.navigateTo({ url });
};

const goAfterSale = () => {
  uni.navigateTo({ url: '/pages-sub/seller/after-sale/list' });
};

const goEdit = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
};
</script>

<style lang="scss" scoped>
.shop-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.shop-scroll {
  height: calc(100vh - 88rpx - 120rpx);
}

.shop-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: $space-lg $space-md;
  
  .shop-info {
    display: flex;
    align-items: center;
    
    .shop-detail {
      flex: 1;
      margin-left: $space-md;
      
      .shop-name {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $color-white;
      }
      
      .shop-desc {
        font-size: $font-size-sm;
        color: rgba($color-white, 0.8);
        margin: $space-xs 0;
      }
      
      .shop-tags {
        display: flex;
        gap: $space-xs;
      }
    }
  }
  
  .shop-stats {
    display: flex;
    justify-content: space-around;
    margin-top: $space-lg;
    padding: $space-md;
    background: rgba($color-white, 0.15);
    border-radius: $radius-lg;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-white;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: rgba($color-white, 0.8);
        margin-top: $space-xs;
      }
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: $space-lg $space-md;
  background: $color-white;
  margin-bottom: $space-sm;
  
  .action-item {
    @include flex-column-center;
    
    .action-icon {
      width: 80rpx;
      height: 80rpx;
      @include flex-center;
      background: $color-bg-gray;
      border-radius: 50%;
      margin-bottom: $space-xs;
    }
    
    .action-text {
      font-size: $font-size-xs;
      color: $color-text-main;
    }
  }
}

.order-overview {
  background: $color-white;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .section-more {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-item {
      @include flex-column-center;
      
      .order-count {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-text-main;
      }
      
      .order-label {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}

.goods-section {
  background: $color-white;
  padding: $space-md;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .section-more {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .goods-scroll {
    white-space: nowrap;
  }
  
  .goods-list {
    display: inline-flex;
    gap: $space-sm;
    
    .goods-item {
      width: 200rpx;
      
      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(1);
        margin-top: $space-xs;
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $space-xs;
        
        .goods-stock {
          font-size: $font-size-xs;
          color: $color-text-disabled;
        }
      }
    }
  }
}

.shop-footer {
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
