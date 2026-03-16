<template>
  <view class="product-detail-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="商品详情" />
    
    <scroll-view 
      scroll-y 
      class="detail-scroll" 
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view v-if="loading" class="loading-state">
        <ui-skeleton :rows="8" />
      </view>
      
      <template v-else-if="product">
        <swiper 
          class="product-swiper" 
          :indicator-dots="product.images.length > 1" 
          :autoplay="false"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#FFFFFF"
        >
          <swiper-item v-for="(img, index) in product.images" :key="index" @click="previewImage(index)">
            <ui-image :src="img" width="100%" height="750rpx" mode="aspectFill" radius="0" />
          </swiper-item>
        </swiper>
        
        <view class="price-section">
          <view class="price-row">
            <view class="current-price">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ formatPrice(product.price) }}</text>
            </view>
            <view v-if="product.originalPrice" class="original-price">
              <text>¥{{ formatPrice(product.originalPrice) }}</text>
            </view>
          </view>
          <view class="price-discount" v-if="product.originalPrice && product.originalPrice > product.price">
            <text>已降 ¥{{ formatPrice(product.originalPrice - product.price) }}</text>
          </view>
        </view>
        
        <view class="title-section">
          <text class="product-title">{{ product.title }}</text>
          <view class="title-tags" v-if="productTags.length">
            <view 
              v-for="(tag, index) in productTags" 
              :key="index"
              class="title-tag"
              :class="tag.type"
            >
              {{ tag.text }}
            </view>
          </view>
        </view>
        
        <ui-seller-card
          :seller-id="product.seller.id"
          :avatar="product.seller.avatar"
          :name="product.seller.name"
          :level-name="product.seller.levelName"
          :desc="product.seller.signature"
          :sales="product.seller.sellingCount"
          :followers="product.seller.followerCount"
          :rating="product.seller.rating"
        />
        
        <view class="description-section">
          <view class="section-header">
            <text class="section-title">宝贝描述</text>
          </view>
          <view class="description-content">
            <text>{{ product.description }}</text>
          </view>
          <view class="publish-info">
            <text>发布于 {{ formatTimeAgo(product.createdAt) }}</text>
            <text class="dot">·</text>
            <text>{{ product.viewCount || 0 }} 次浏览</text>
          </view>
        </view>
        
        <view class="publish-location" v-if="product.location">
          <ui-icon name="map-pin" :size="28" color="placeholder" />
          <text>{{ product.location }}</text>
        </view>
        
        <view class="tips-section">
          <view class="tip-item">
            <ui-icon name="shield-check" :size="32" color="var(--color-primary, #FF6A00)" />
            <text>平台担保交易</text>
          </view>
          <view class="tip-item">
            <ui-icon name="refresh" :size="32" color="var(--color-primary, #FF6A00)" />
            <text>支持七天无理由</text>
          </view>
        </view>
        
        <view class="bottom-space"></view>
      </template>
      
      <view v-else class="error-state">
        <ui-icon name="error-circle" :size="120" color="disabled" />
        <text class="error-text">商品不存在或已下架</text>
        <ui-button size="sm" @click="goBack">返回</ui-button>
      </view>
    </scroll-view>
    
    <view class="bottom-bar">
      <view class="action-icons">
        <view class="icon-item" :class="{ 'is-active': isCollected }" @click="handleCollect">
          <ui-icon 
            :name="isCollected ? 'heart-fill' : 'heart'" 
            :size="40" 
            :color="isCollected ? 'error' : 'placeholder'" 
          />
          <text>{{ isCollected ? '已收藏' : '收藏' }}</text>
        </view>
      </view>
      <view class="action-btns">
        <ui-button class="btn-chat" @click="handleChat">
          <ui-icon name="message" :size="32" color="primary" />
          <text>聊一聊</text>
        </ui-button>
        <ui-button class="btn-buy" type="primary" @click="handleBuy">立即购买</ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores';
import { formatTimeAgo } from '@/utils/date';
import { tradeApi, type ProductDetail } from '@/api';
import UiSellerCard from '@/ui-kit/molecules/UiSellerCard.vue';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack, navigateTo } = useNavigation();
const authStore = useAuthStore();

const productId = ref('');
const loading = ref(true);
const product = ref<ProductDetail | null>(null);
const isCollected = ref(false);

interface TagItem {
  text: string;
  type: 'primary' | 'success' | 'warning' | 'info';
}

const productTags = computed<TagItem[]>(() => {
  const tags: TagItem[] = [];
  if (product.value?.condition) {
    tags.push({ text: product.value.condition, type: 'primary' });
  }
  if (product.value?.warranty) {
    tags.push({ text: '在保', type: 'success' });
  }
  if (product.value?.invoice) {
    tags.push({ text: '有发票', type: 'info' });
  }
  if (product.value?.canBargain) {
    tags.push({ text: '可小刀', type: 'warning' });
  }
  return tags;
});

const formatPrice = (price: number): string => {
  if (!price) return '0';
  const yuanPrice = price / 100;
  if (yuanPrice >= 10000) {
    return (yuanPrice / 10000).toFixed(2) + '万';
  }
  return yuanPrice.toFixed(2);
};

onLoad((options: any) => {
  if (options.id) {
    productId.value = options.id;
    fetchProductDetail();
  }
});

const fetchProductDetail = async () => {
  loading.value = true;
  try {
    const res = await tradeApi.getProductDetail(productId.value);
    product.value = res;
    isCollected.value = res.isCollected;
  } catch (error) {
    console.error('获取商品详情失败:', error);
    product.value = null;
  } finally {
    loading.value = false;
  }
};

const previewImage = (index: number) => {
  if (!product.value?.images) return;
  uni.previewImage({
    current: index,
    urls: product.value.images
  });
};

const handleCollect = async () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  if (!product.value) return;
  
  try {
    if (isCollected.value) {
      await tradeApi.uncollectProduct(product.value.id);
      isCollected.value = false;
      uni.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      const res = await tradeApi.collectProduct(product.value.id);
      isCollected.value = true;
      uni.showToast({ title: '收藏成功', icon: 'none' });
      if (product.value && res.likeCount) {
        product.value.likeCount = res.likeCount;
      }
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    uni.showToast({ title: '操作失败，请重试', icon: 'none' });
  }
};

const handleChat = () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  if (!product.value) return;
  
  uni.navigateTo({ 
    url: `/pages-sub/chat/index?sellerId=${product.value.seller.id}&productId=${product.value.id}` 
  });
};

const handleBuy = () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  if (!product.value) return;
  
  uni.navigateTo({ 
    url: `/pages-sub/trade/order/confirm?productId=${product.value.id}` 
  });
};

const goBack = () => {
  smartBack();
};

const loadMore = () => {};
</script>

<style lang="scss" scoped>
.product-detail-page {
  @include page-gradient-bg;
}

.bg-decoration {
  @include decoration-container;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 200rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.detail-scroll {
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.loading-state {
  padding: $space-lg;
}

.product-swiper {
  width: 100%;
  height: 750rpx;
}

.price-section {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  .price-row {
    display: flex;
    align-items: baseline;
    gap: $space-sm;
  }
  
  .current-price {
    display: flex;
    align-items: baseline;
    
    .price-symbol {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: #FF3B30;
    }
    
    .price-value {
      font-size: 48rpx;
      font-weight: $font-weight-bold;
      color: #FF3B30;
      line-height: 1;
    }
  }
  
  .original-price {
    text {
      font-size: $font-size-md;
      color: $color-text-disabled;
      text-decoration: line-through;
    }
  }
  
  .price-discount {
    margin-top: $space-xs;
    
    text {
      font-size: $font-size-xs;
      color: #FF3B30;
      background: rgba(255, 59, 48, 0.1);
      padding: 4rpx 12rpx;
      border-radius: $radius-xs;
    }
  }
}

.title-section {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
  
  .product-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    @include text-main;
    line-height: 1.5;
  }
  
  .title-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    margin-top: $space-sm;
    
    .title-tag {
      font-size: $font-size-xs;
      padding: 4rpx 16rpx;
      border-radius: $radius-full;
      
      &.primary {
        color: var(--color-primary, #FF6A00);
        background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      }
      
      &.success {
        color: var(--color-success, #34C759);
        background: var(--color-success-glass, rgba(52, 199, 89, 0.12));
      }
      
      &.warning {
        color: var(--color-warning, #FF9500);
        background: rgba(255, 149, 0, 0.12);
      }
      
      &.info {
        color: var(--color-info, #007AFF);
        background: rgba(0, 122, 255, 0.12);
      }
    }
  }
}

.description-section {
  margin: $space-sm $space-md;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  
  .section-header {
    margin-bottom: $space-sm;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
  }
  
  .description-content {
    font-size: $font-size-md;
    @include text-main;
    line-height: 1.8;
    white-space: pre-wrap;
  }
  
  .publish-info {
    display: flex;
    align-items: center;
    margin-top: $space-md;
    padding-top: $space-sm;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
    font-size: $font-size-xs;
    @include text-sub;
    
    .dot {
      margin: 0 $space-xs;
    }
  }
}

.publish-location {
  display: flex;
  align-items: center;
  gap: $space-xs;
  margin: 0 $space-md $space-sm;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  @include text-sub;
}

.tips-section {
  display: flex;
  justify-content: space-around;
  margin: 0 $space-md $space-sm;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: $space-xs;
    font-size: $font-size-sm;
    @include text-sub;
  }
}

.error-state {
  @include flex-column-center;
  padding: 160rpx $space-lg;
  
  .error-text {
    font-size: $font-size-md;
    @include text-sub;
    margin: $space-md 0;
  }
}

.bottom-space {
  height: 180rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  padding-bottom: calc(#{$space-sm} + env(safe-area-inset-bottom));
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .action-icons {
    display: flex;
    gap: $space-lg;
    
    .icon-item {
      @include flex-column-center;
      gap: 4rpx;
      padding: $space-xs;
      
      text {
        font-size: $font-size-xs;
        @include text-sub;
      }
      
      &.is-active text {
        color: #FF3B30;
      }
    }
  }
  
  .action-btns {
    flex: 1;
    display: flex;
    margin-left: $space-md;
    gap: $space-sm;
    
    .btn-chat {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;
      background: rgba(255, 106, 0, 0.1);
      border: 1rpx solid var(--color-primary, #FF6A00);
      color: var(--color-primary, #FF6A00);
      
      text {
        font-size: $font-size-sm;
        color: var(--color-primary, #FF6A00);
      }
    }
    
    .btn-buy {
      flex: 1.5;
    }
  }
}
</style>
