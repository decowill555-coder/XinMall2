<template>
  <view class="shop-page">
    <ui-sub-navbar title="我的店铺" />
    
    <scroll-view scroll-y class="shop-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-shop-header
        :logo="shopInfo?.avatar"
        :name="shopInfo?.name"
        :desc="shopInfo?.description"
        :stats="shopStats"
      >
        <template #tags>
          <ui-tag v-if="shopInfo?.status === 'normal'" type="success" size="sm">已认证</ui-tag>
          <ui-tag :type="shopInfo?.isOpen ? 'primary' : 'default'" size="sm">{{ shopInfo?.isOpen ? '营业中' : '休息中' }}</ui-tag>
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
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useShopStore } from '@/stores/shop';
import { storeToRefs } from 'pinia';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const shopStore = useShopStore();
const { shopInfo, dashboard, loading, hasShop } = storeToRefs(shopStore);

const shopStats = computed(() => [
  { value: shopInfo.value?.goodsCount || 0, label: '商品' },
  { value: shopInfo.value?.soldCount || 0, label: '销量' },
  { value: shopInfo.value?.followerCount || 0, label: '粉丝' }
]);

const quickActions = computed(() => [
  { icon: 'plus', text: '发布商品' },
  { icon: 'package', text: '商品管理' },
  { icon: 'file-text', text: '订单管理' },
  { icon: 'refresh', text: '售后管理' }
]);

const orderOverviewItems = computed(() => {
  const counts = dashboard.value?.orderCounts || {};
  return [
    { count: counts['pending_shipment'] || 0, label: '待发货' },
    { count: counts['pending_receipt'] || 0, label: '已发货' },
    { count: counts['completed'] || 0, label: '已完成' },
    { count: dashboard.value?.aftersaleCount || 0, label: '售后' }
  ];
});

const goodsList = computed(() => dashboard.value?.recentGoods || []);

// 加载数据
const loadData = async () => {
  try {
    await shopStore.fetchDashboard();
  } catch (error: any) {
    // 如果没有店铺，跳转到创建店铺页面
    if (shopStore.hasShop === false) {
      uni.showModal({
        title: '提示',
        content: '您还没有创建店铺，是否立即创建？',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages-sub/auth/shop-auth/index' });
          }
        }
      });
    }
  }
};

onMounted(() => {
  loadData();
});

const handleAction = (index: number) => {
  const actions = [goPublish, goGoodsList, goOrderList, goAfterSale];
  actions[index]?.();
};

const handleOrderClick = (index: number) => {
  const types = ['pending_shipment', 'pending_receipt', 'completed', 'refund'];
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
  // 跳转到"我的订单"页面（买家订单列表）
  const url = type ? `/pages-sub/order/list?type=${type}` : '/pages-sub/order/list';
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
      flex-shrink: 0;
      overflow: hidden;

      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(1);
        margin-top: $space-xs;
        white-space: normal;
        word-break: break-all;
        line-height: 1.3;
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
