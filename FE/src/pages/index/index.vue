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
      <view class="refresh-container">
        <view 
          class="refresh-indicator" 
          :style="{ transform: `translateY(${refreshDistance}px) translateX(-50%)` }"
        >
          <view class="refresh-circle" :class="{ 'refreshing': isRefreshing }">
            <UiIcon name="refresh" :size="20" />
          </view>
        </view>
        <scroll-view
          scroll-y
          class="goods-scroll"
          :style="{ height: scrollHeight + 'px' }"
          refresher-enabled
          refresher-default-style="none"
          :refresher-triggered="isRefreshing"
          :refresher-threshold="60"
          :refresher-background="'transparent'"
          @refresherpulling="onPulling"
          @refresherrefresh="onRefresh"
          @refresherrestore="onRestore"
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
          <ui-waterfalls :list="feedList" :columns="2" :gap="12">
            <template #item="{ item }">
              <ui-goods-card :data="item" mode="waterfall" @click="handleItemClick" @user-click="goUser" />
            </template>
          </ui-waterfalls>
        </view>
        
        <view class="load-more" v-if="feedList.length > 0">
          <ui-divider :text="loading ? '加载中...' : (hasMore ? '上拉加载更多' : '没有更多了')" />
        </view>
        </scroll-view>
      </view>
    </view>
    
    <TheTabbar current="index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { onReady, onShow } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import { searchApi, categoryApi, bannerApi } from '@/api';
import { forumApi, type PostListItem } from '@/api/community';
import { spuApi } from '@/api';
import { logError } from '@/utils/logger';

interface FeedItem {
  id: string | number;
  cover: string;
  title: string;
  price?: number;
  userName: string;
  userAvatar: string;
  userId: string;
  likeCount?: number;
  memberCount?: number;
  isLiked?: boolean;
  isVideo?: boolean;
  itemType: 'post' | 'product';
}

const appStore = useAppStore();
const { navigateTo } = useNavigation();

const keyword = ref('');
const activeTab = ref(0);
const loading = ref(false);
const isRefreshing = ref(false);
const initialLoading = ref(true);
const refreshDistance = ref(0);
const pullingDistance = ref(0);

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

const feedList = ref<FeedItem[]>([]);
const currentPage = ref(1);
const hasMore = ref(true);
const pageSize = 12;

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
    logError('获取热门关键词失败:', error);
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
    logError('获取Banner列表失败:', error);
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
    logError('获取分类失败:', error);
  }
};

const fetchFeed = async (page: number = 1) => {
  if (loading.value) return;
  if (page === 1) {
    hasMore.value = true;
  } else if (!hasMore.value) return;

  loading.value = true;

  try {
    // 获取当前选中的分类ID（"推荐"tab不传分类ID）
    const currentCategory = categoryList.value[activeTab.value];
    const deviceTypeId = currentCategory?.id || undefined;

    const [postsResult, spusResult] = await Promise.all([
      // 使用 getPosts 获取推荐帖子，支持分类筛选
      forumApi.getPosts({
        page,
        pageSize,
        sort: 'new'
      }),
      // 使用 getSpuList 获取推荐商品，支持分类筛选
      spuApi.getSpuList({
        deviceTypeId,
        page,
        size: pageSize,
        sort: 'hot'
      })
    ]);
    
    const postItems: FeedItem[] = (postsResult?.list || []).map((item: PostListItem) => ({
      id: item.id,
      cover: item.images && item.images.length > 0 ? item.images[0] : '',
      title: item.title || '',
      userName: item.author?.name || '未知用户',
      userAvatar: item.author?.avatar || '',
      userId: String(item.author?.id || ''),
      likeCount: item.likeCount || 0,
      isLiked: item.isLiked || false,
      isVideo: false,
      itemType: 'post'
    }));
    
    const spuItems: FeedItem[] = (spusResult?.list || []).map((item: any) => ({
      id: item.id,
      cover: item.cover || '',
      title: item.name || '',
      price: item.priceRange?.min || item.priceRange?.max,
      userName: '商品',
      userAvatar: '',
      userId: '',
      memberCount: item.memberCount || 0,
      itemType: 'product'
    }));
    
    const allItems = [...postItems, ...spuItems];
    
    if (page === 1) {
      feedList.value = allItems;
    } else {
      feedList.value = [...feedList.value, ...allItems];
    }
    
    currentPage.value = page;
    const postHasMore = postsResult?.hasMore ?? false;
    const spuHasMore = spusResult?.hasMore ?? false;
    hasMore.value = postHasMore || spuHasMore;
  } catch (error) {
    logError('获取首页数据失败:', error);
    if (page === 1) {
      feedList.value = [];
    }
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

watch(activeTab, () => {
  fetchFeed(1);
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
  
  fetchFeed(1);
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

const handleItemClick = (item: FeedItem) => {
  if (item.itemType === 'post') {
    uni.navigateTo({ url: `/pages-sub/community/post/detail?id=${item.id}` });
  } else {
    uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
  }
};

const goUser = (item: FeedItem) => {
  if (item.userId) {
    uni.navigateTo({ url: `/pages-sub/community/user/index?id=${item.userId}` });
  }
};

const onBannerClick = ({ item, index }: { item: any; index: number }) => {
  if (item.link) {
    navigateTo(item.link);
  }
};

const loadMore = () => {
  if (!initialLoading.value && hasMore.value) {
    fetchFeed(currentPage.value + 1);
  }
};

const onPulling = (e: any) => {
  pullingDistance.value = e.detail.dy || 0;
  const maxDistance = 80;
  const distance = Math.min(pullingDistance.value, maxDistance);
  refreshDistance.value = distance * 0.6;
};

const onRestore = () => {
  refreshDistance.value = 0;
  pullingDistance.value = 0;
};

const onRefresh = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;

  await Promise.all([
    fetchHotKeywords(),
    fetchCategories(),
    fetchBanners()
  ]);

  await fetchFeed(1);

  isRefreshing.value = false;
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

.refresh-container {
  position: relative;
  overflow: hidden;
}

.refresh-indicator {
  position: absolute;
  top: -70rpx;
  left: 50%;
  z-index: 10;
  transition: transform 0.1s ease-out;
  pointer-events: none;
}

.refresh-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2rpx solid $color-border-light;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-primary;
  box-shadow: $shadow-md;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    color: var(--color-primary, #D946EF);
  }
  
  &.refreshing {
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  padding: $space-sm $space-md;
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
