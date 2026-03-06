<template>
  <view class="product-detail-page">
    <ui-sub-navbar title="商品详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <swiper class="product-swiper" :indicator-dots="true" :autoplay="false">
        <swiper-item v-for="(img, index) in product.images" :key="index">
          <image class="swiper-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>
      
      <ui-product-info 
        :price="product.price"
        :original-price="product.originalPrice"
        :title="product.title"
        :tags="productTags"
        :specs="product.specs"
      />
      
      <ui-seller-card
        :avatar="seller.avatar"
        :name="seller.name"
        :desc="seller.desc"
        :sales="seller.sales"
        :followers="seller.followers"
        :rating="seller.rating"
      />
      
      <ui-description-card 
        title="商品描述"
        :content="product.description"
      />
    </scroll-view>
    
    <ui-bottom-bar>
      <view class="action-icons">
        <view class="icon-item" @click="handleCollect">
          <ui-icon :name="isCollected ? 'heart' : 'heart-outline'" :size="40" />
          <text>收藏</text>
        </view>
        <view class="icon-item" @click="handleMessage">
          <ui-icon name="message" :size="40" />
          <text>私信</text>
        </view>
      </view>
      <view class="action-btns">
        <ui-button class="btn-chat" @click="handleChat">联系卖家</ui-button>
        <ui-button class="btn-buy" type="primary" @click="handleBuy">立即购买</ui-button>
      </view>
    </ui-bottom-bar>
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

const productTags = computed(() => {
  const tags = [];
  if (product.value.condition) {
    tags.push({ text: product.value.condition, type: 'primary' as const });
  }
  if (product.value.warranty) {
    tags.push({ text: '在保', type: 'success' as const });
  }
  if (product.value.invoice) {
    tags.push({ text: '有发票', type: 'info' as const });
  }
  return tags;
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
</style>
