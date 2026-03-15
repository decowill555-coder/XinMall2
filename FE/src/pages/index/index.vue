<template>
  <view class="index-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <view class="fixed-header" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
      <view class="search-bar">
        <ui-search 
          v-model="keyword" 
          placeholder="搜索数码产品型号..." 
          :disabled="true"
          :hot-keywords="hotKeywords"
          @click="goSearch"
          @hot-click="handleHotClick"
        />
        <view class="search-bar__find" @tap="goProductCategory">
          <UiIcon name="grid" color="#FF6A00" :size="40" />
        </view>
      </view>
      
      <view class="category-tabs">
        <ui-tabs v-model="activeTab" :list="categoryList" type="capsule" />
      </view>
    </view>
    
    <view class="page-content" :style="{ paddingTop: headerHeight + 'px' }">
      <scroll-view 
        scroll-y 
        class="goods-scroll" 
        :style="{ height: scrollHeight + 'px' }" 
        @scrolltolower="loadMore"
      >
        <view class="swiper">
          <ui-swiper
            :list="bannerList"
            height="360rpx"
            @click="onBannerClick"
          />
        </view>
        
        <view class="goods-list">
          <ui-waterfalls :list="goodsList" :columns="2" :gap="12" @click="goDetail">
            <template #item="{ item }">
              <ui-goods-card :data="item" mode="waterfall" @click="goDetail" @user-click="goUser" />
            </template>
          </ui-waterfalls>
        </view>
        
        <view class="load-more" v-if="goodsList.length > 0">
          <ui-divider :text="loading ? '加载中...' : '上拉加载更多'" />
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar current="index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { onReady, onShow } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import { searchApi, categoryApi, tradeApi, bannerApi, type ProductListItem } from '@/api';

const appStore = useAppStore();
const { navigateTo } = useNavigation();

const keyword = ref('');
const activeTab = ref(0);
const loading = ref(false);
const initialLoading = ref(true);

onShow(() => {
  keyword.value = '';
});

const hotKeywords = ref<Array<{ keyword: string; id: string | number }>>([]);

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);
const isH5 = computed(() => appStore.isH5);

const headerExtraTop = computed(() => isH5.value ? 12 : 0);

const headerHeight = ref(0);
const scrollHeight = ref(0);

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  const tabbarHeight = rpxToPx(100);
  
  const query = uni.createSelectorQuery();
  query.select('.fixed-header').boundingClientRect((rect: any) => {
    if (rect && rect.height > 0) {
      headerHeight.value = rect.height;
      scrollHeight.value = systemInfo.windowHeight - rect.height - tabbarHeight - safeAreaBottom.value;
    }
  }).exec();
};

onReady(() => {
  nextTick(() => {
    calcLayout();
  });
});

const categoryList = ref<Array<{ name: string; id?: string }>>([
  { name: '推荐' }
]);

const bannerList = ref<Array<{ image: string; title: string; link: string }>>([]);

interface GoodsItem {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  originalPrice?: number;
  sales?: number;
  tags: string[];
  userAvatar: string;
  userName: string;
  likeCount: number;
  sellerId?: string;
}

const goodsList = ref<GoodsItem[]>([]);
const currentPage = ref(1);
const hasMore = ref(true);
const currentDeviceTypeId = ref<string | undefined>(undefined);

const transformProductToGoods = (product: ProductListItem): GoodsItem => ({
  id: product.id,
  cover: product.cover || '',
  title: product.title,
  price: Number(product.price) || 0,
  originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
  tags: [],
  userAvatar: product.sellerAvatar || '',
  userName: product.sellerName || '未知卖家',
  likeCount: product.likeCount || 0,
  sellerId: String(product.sellerId || '')
});

const fetchHotKeywords = async () => {
  try {
    const res = await searchApi.getHotSearches(8);
    if (res && Array.isArray(res)) {
      hotKeywords.value = res.map((item, index) => ({
        keyword: item.keyword,
        id: item.id || index
      }));
    }
  } catch (error) {
    console.error('获取热门关键词失败:', error);
  }
};

const fetchBanners = async () => {
  try {
    const res = await bannerApi.getBannerList();
    if (res && Array.isArray(res)) {
      bannerList.value = res.map(item => ({
        image: item.image,
        title: item.title,
        link: item.link
      }));
    }
  } catch (error) {
    console.error('获取Banner列表失败:', error);
  }
};

const fetchCategories = async () => {
  try {
    const res = await categoryApi.getDeviceCategories();
    if (res && res.length > 0) {
      const categories = res.map(c => ({ name: c.name, id: String(c.id) }));
      categoryList.value = [
        { name: '推荐' },
        ...categories.slice(0, 7)
      ];
    }
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

const fetchGoodsList = async (isRefresh = false) => {
  if (loading.value) return;
  if (!isRefresh && !hasMore.value) return;
  
  loading.value = true;
  
  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
  }
  
  try {
    const params: any = {
      page: currentPage.value,
      size: 12,
      sortBy: 'created_at',
      sortOrder: 'desc'
    };
    
    if (currentDeviceTypeId.value) {
      params.categoryId = Number(currentDeviceTypeId.value);
    }
    
    const res = await tradeApi.getProductList(params);
    
    if (res && res.records && Array.isArray(res.records)) {
      const newGoods = res.records.map(transformProductToGoods);
      
      if (isRefresh) {
        goodsList.value = newGoods;
      } else {
        goodsList.value = [...goodsList.value, ...newGoods];
      }
      
      hasMore.value = res.current < res.pages;
      if (hasMore.value) {
        currentPage.value++;
      }
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.error('获取商品列表失败:', error);
    if (isRefresh && goodsList.value.length === 0) {
      goodsList.value = [];
    }
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 0) {
    currentDeviceTypeId.value = undefined;
  } else {
    const category = categoryList.value[newTab];
    currentDeviceTypeId.value = category?.id;
  }
  fetchGoodsList(true);
});

onMounted(async () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const estimatedHeader = rpxToPx(200) + safeAreaTop.value + headerExtraTop.value;
  const tabbarHeight = rpxToPx(100);
  
  headerHeight.value = estimatedHeader;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader - tabbarHeight - safeAreaBottom.value;
  
  await Promise.all([
    fetchHotKeywords(),
    fetchCategories(),
    fetchBanners()
  ]);
  
  fetchGoodsList(true);
});

const goSearch = () => {
  navigateTo('/pages-sub/search/entry');
};

const goProductCategory = () => {
  navigateTo('/pages-sub/search/category');
};

const handleHotClick = (item: any) => {
  navigateTo(`/pages-sub/search/result?keyword=${encodeURIComponent(item.keyword)}`);
};

const goDetail = (item: any) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};

const goUser = (item: any) => {
  if (item.sellerId) {
    navigateTo(`/pages-sub/community/user/index?id=${item.sellerId}`);
  }
};

const onBannerClick = ({ item, index }: { item: any; index: number }) => {
  if (item.link) {
    navigateTo(item.link);
  }
};

const loadMore = () => {
  if (!initialLoading.value) {
    fetchGoodsList(false);
  }
};
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(170deg, $color-bg-gradient-start 0%, $color-bg-page 35%, $color-bg-page 100%);
  position: relative;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: linear-gradient(170deg, var(--color-bg-gradient-start, #1A1520) 0%, $color-bg-page 35%, $color-bg-page 100%);
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
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
    background: radial-gradient(circle, rgba($color-primary, 0.15) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%);
    }
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: radial-gradient(circle, rgba($color-accent, 0.1) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(0, 245, 212, 0.12) 0%, transparent 70%);
    }
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-card;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  padding: $space-md $space-md $space-sm;
  border-bottom: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: $space-sm;
  
  &__find {
    flex-shrink: 0;
    padding: $space-sm;
    margin-left: $space-sm;
  }
}

.category-tabs {
  background: transparent;
  margin: $space-sm 0;
}

.page-content {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.goods-scroll {
  min-height: 100vh;
  overflow: hidden;
}

.swiper {
  padding: $space-xl $space-md 0 $space-md;
  box-sizing: border-box;
  
  :deep(.ui-swiper) {
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-md;
    
    [data-theme="dark"] & {
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
    }
  }
}

.goods-list {
  padding: $space-md;
  box-sizing: border-box;
  overflow: hidden;
  
  :deep(.ui-goods-card) {
    background: $color-bg-card;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid $color-border-light;
    border-radius: $radius-lg;
    overflow: hidden;
    
    [data-theme="dark"] & {
      background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }
}

.load-more {
  padding: $space-md 0;
  
  :deep(.ui-divider) {
    color: $color-text-sub;
    
    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
  }
}
</style>
