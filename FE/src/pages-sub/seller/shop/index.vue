<template>
  <view class="shop-page">
    <ui-sub-navbar title="我的店铺" />
    
    <scroll-view scroll-y class="shop-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-shop-header 
        :logo="shopInfo.logo"
        :name="shopInfo.name"
        :desc="shopInfo.desc"
        :stats="shopStats"
      >
        <template #tags>
          <ui-tag v-if="shopInfo.isVerified" type="success" size="sm">已认证</ui-tag>
          <ui-tag type="primary" size="sm">营业中</ui-tag>
        </template>
      </ui-shop-header>
      
      <ui-quick-actions :actions="quickActions" @click="handleAction" />
      
      <ui-order-overview 
        title="订单概览"
        :items="orderOverviewItems"
        @click="handleOrderClick"
        @more="goOrderList"
      />
      
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
                <ui-price :value="item.price" :size="40" />
                <text class="goods-stock">库存{{ item.stock }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
    
    <view class="shop-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="primary" block @click="goPublish">发布新商品</ui-button>
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

const shopInfo = ref({
  logo: 'https://picsum.photos/200/200?random=shop',
  name: '数码达人小店',
  desc: '专注正品数码，诚信经营',
  isVerified: true,
  goodsCount: 56,
  salesCount: 1289,
  followers: 3680
});

const shopStats = computed(() => [
  { value: shopInfo.value.goodsCount, label: '商品' },
  { value: shopInfo.value.salesCount, label: '销量' },
  { value: shopInfo.value.followers, label: '粉丝' }
]);

const quickActions = computed(() => [
  { icon: 'plus', text: '发布商品' },
  { icon: 'package', text: '商品管理' },
  { icon: 'file-text', text: '订单管理' },
  { icon: 'refresh', text: '售后管理' }
]);

const orderCounts = ref({
  pending: 5,
  shipped: 12,
  completed: 89,
  refund: 2
});

const orderOverviewItems = computed(() => [
  { count: orderCounts.value.pending, label: '待发货' },
  { count: orderCounts.value.shipped, label: '已发货' },
  { count: orderCounts.value.completed, label: '已完成' },
  { count: orderCounts.value.refund, label: '售后' }
]);

const goodsList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=g1', title: 'iPhone 15 Pro Max', price: 7999, stock: 10 },
  { id: 2, cover: 'https://picsum.photos/200/200?random=g2', title: 'MacBook Pro 14', price: 12999, stock: 5 },
  { id: 3, cover: 'https://picsum.photos/200/200?random=g3', title: 'AirPods Pro 2', price: 1399, stock: 30 },
  { id: 4, cover: 'https://picsum.photos/200/200?random=g4', title: 'iPad Pro 12.9', price: 6999, stock: 8 }
]);

const handleAction = (index: number) => {
  const actions = [goPublish, goGoodsList, goOrderList, goAfterSale];
  actions[index]?.();
};

const handleOrderClick = (index: number) => {
  const types = ['pending', 'shipped', 'completed', 'refund'];
  const type = types[index];
  if (type === 'refund') {
    goAfterSale();
  } else {
    goOrderList(type);
  }
};

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
  overflow: hidden;
}

.goods-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
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
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
