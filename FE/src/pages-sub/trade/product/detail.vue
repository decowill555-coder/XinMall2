<template>
  <view class="product-detail-page">
    <ui-sub-navbar title="商品详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <swiper class="product-swiper" :indicator-dots="true" :autoplay="false">
        <swiper-item v-for="(img, index) in product.images" :key="index">
          <image class="swiper-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>
      
      <view class="product-info">
        <view class="price-row">
          <ui-price :value="product.price" type="main" :size="48" />
          <view v-if="product.originalPrice" class="original-price">
            ¥{{ product.originalPrice }}
          </view>
        </view>
        
        <view class="product-title">{{ product.title }}</view>
        
        <view class="tags-row">
          <ui-tag type="primary" size="sm">{{ product.condition }}</ui-tag>
          <ui-tag v-if="product.warranty" type="success" size="sm">在保</ui-tag>
          <ui-tag v-if="product.invoice" type="info" size="sm">有发票</ui-tag>
        </view>
        
        <view class="specs-info" v-if="product.specs">
          <view class="specs-item" v-for="(value, key) in product.specs" :key="key">
            <text class="specs-label">{{ key }}:</text>
            <text class="specs-value">{{ value }}</text>
          </view>
        </view>
      </view>
      
      <view class="seller-card">
        <view class="seller-header">
          <ui-avatar :src="seller.avatar" ::size="80" />
          <view class="seller-info">
            <view class="seller-name">{{ seller.name }}</view>
            <view class="seller-desc">{{ seller.desc }}</view>
          </view>
        </view>
        
        <view class="seller-stats">
          <view class="stat-item">
            <text class="stat-value">{{ seller.sales }}</text>
            <text class="stat-label">卖出</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ seller.followers }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ seller.rating }}</text>
            <text class="stat-label">好评</text>
          </view>
        </view>
      </view>
      
      <view class="description-card">
        <view class="card-title">商品描述</view>
        <view class="description-content">{{ product.description }}</view>
      </view>
    </scroll-view>
    
    <view class="bottom-action">
      <view class="action-icons">
        <view class="icon-item" @click="handleCollect">
          <ui-icon :name="isCollected ? 'heart' : 'heart-outline'" ::size="40" />
          <text>收藏</text>
        </view>
        <view class="icon-item" @click="handleMessage">
          <ui-icon name="message" ::size="40" />
          <text>私信</text>
        </view>
      </view>
      <view class="action-btns">
        <ui-button class="btn-chat" @click="handleChat">联系卖家</ui-button>
        <ui-button class="btn-buy" type="primary" @click="handleBuy">立即购买</ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores';

const appStore = useAppStore();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);

const scrollHeight = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  const navBarHeight = 44;
  const bottomActionHeight = 60;
  return systemInfo.windowHeight - safeAreaTop.value - navBarHeight - bottomActionHeight - safeAreaBottom.value;
});

const product = ref({
  id: 1,
  title: 'iPhone 14 Pro Max 256GB 远峰蓝 99新',
  price: 6999,
  originalPrice: 8999,
  condition: '99新',
  warranty: true,
  invoice: true,
  specs: {
    '型号': 'iPhone 14 Pro Max',
    '内存': '256GB',
    '颜色': '远峰蓝',
    '版本': '国行'
  },
  description: '自用 iPhone 14 Pro Max，99新，无任何划痕、磕碰。配件齐全，盒子、充电器、数据线都在。电池健康度 95%。可小刀。',
  images: [
    'https://picsum.photos/750/750?random=1',
    'https://picsum.photos/750/750?random=2',
    'https://picsum.photos/750/750?random=3'
  ]
});

const seller = ref({
  avatar: 'https://picsum.photos/200/200?random=10',
  name: '数码达人',
  desc: '诚信经营，品质保证',
  sales: 128,
  followers: 2568,
  rating: 98
});

const isCollected = ref(false);

const handleCollect = () => {
  isCollected.value = !isCollected.value;
  uni.showToast({
    title: isCollected.value ? '收藏成功' : '取消收藏',
    icon: 'none'
  });
};

const handleMessage = () => {
  uni.showToast({ title: '跳转私信页面', icon: 'none' });
};

const handleChat = () => {
  uni.showToast({ title: '联系卖家', icon: 'none' });
};

const handleBuy = () => {
  uni.showToast({ title: '立即购买', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 120rpx;
}

.detail-scroll {
  overflow: hidden;
}

.product-swiper {
  width: 100%;
  height: 750rpx;
  
  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.product-info {
  padding: $space-md;
  background: $color-white;
  margin-bottom: $space-sm;
  
  .price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: $space-sm;
    
    .original-price {
      margin-left: $space-sm;
      font-size: $font-size-md;
      color: $color-text-disabled;
      text-decoration: line-through;
    }
  }
  
  .product-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    line-height: 1.5;
    margin-bottom: $space-sm;
  }
  
  .tags-row {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-md;
  }
  
  .specs-info {
    background: $color-bg-gray;
    border-radius: $radius-md;
    padding: $space-md;
    
    .specs-item {
      display: flex;
      padding: $space-xs 0;
      font-size: $font-size-sm;
      
      .specs-label {
        color: $color-text-sub;
        width: 120rpx;
      }
      
      .specs-value {
        color: $color-text-main;
        flex: 1;
      }
    }
  }
}

.seller-card {
  padding: $space-md;
  background: $color-white;
  margin-bottom: $space-sm;
  
  .seller-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-md;
    
    .seller-info {
      margin-left: $space-md;
      flex: 1;
      
      .seller-name {
        font-size: $font-size-lg;
        font-weight: $font-weight-medium;
        color: $color-text-main;
        margin-bottom: $space-xs;
      }
      
      .seller-desc {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
    }
  }
  
  .seller-stats {
    display: flex;
    justify-content: space-around;
    padding-top: $space-md;
    border-top: 1rpx solid $color-divider;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $color-text-main;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: $color-text-sub;
      }
    }
  }
}

.description-card {
  padding: $space-md;
  background: $color-white;
  
  .card-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .description-content {
    font-size: $font-size-md;
    color: $color-text-sub;
    line-height: 1.8;
  }
}

.bottom-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  height: 120rpx;
  padding: 0 $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .action-icons {
    display: flex;
    gap: $space-lg;
    
    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $font-size-xs;
      color: $color-text-sub;
    }
  }
  
  .action-btns {
    flex: 1;
    display: flex;
    margin-left: $space-md;
    gap: $space-sm;
    
    .btn-chat {
      flex: 1;
    }
    
    .btn-buy {
      flex: 1.5;
    }
  }
}
</style>
