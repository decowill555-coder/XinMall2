<template>
  <view class="result-page">
    <view class="page-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-bg" />
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <ui-icon name="arrow-left" :size="40" />
        </view>
        <view class="search-bar" @click="goSearchPage">
          <ui-icon name="search" :size="32" color="#A1A1A6" />
          <text class="search-placeholder">{{ displayKeyword }}</text>
        </view>
      </view>
    </view>

    <scroll-view
      v-if="hasSearched"
      scroll-y
      class="content-scroll"
      :style="{ top: headerHeight + 'px', height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="scroll-content">
        <view class="filter-bar">
          <view class="filter-tabs">
            <view
              v-for="tab in sortTabs"
              :key="tab.value"
              class="tab-item"
              :class="{ 'is-active': activeSort === tab.value }"
              @click="handleSortChange(tab.value)"
            >
              <text class="tab-text">{{ tab.label }}</text>
              <view v-if="tab.value === 'price'" class="sort-arrows">
                <ui-icon name="arrow-up" :size="20" :color="priceSortOrder === 'asc' ? '#FF6A00' : '#C7C7CC'" />
                <ui-icon name="arrow-down" :size="20" :color="priceSortOrder === 'desc' ? '#FF6A00' : '#C7C7CC'" />
              </view>
            </view>
          </view>
          <view class="filter-btn" @click="showFilterSidebar = true">
            <ui-icon name="filter" :size="32" color="#FF6A00" />
            <text class="filter-btn-text">筛选</text>
          </view>
        </view>

        <view class="product-section">
          <view class="result-info">
            <text class="result-count">共 {{ totalCount }} 件商品</text>
            <view class="view-toggle">
              <view class="toggle-item" :class="{ 'is-active': viewMode === 'list' }" @click="viewMode = 'list'">
                <ui-icon name="list" :size="32" :color="viewMode === 'list' ? '#FF6A00' : ''" />
              </view>
              <view class="toggle-item" :class="{ 'is-active': viewMode === 'waterfall' }" @click="viewMode = 'waterfall'">
                <ui-icon name="grid" :size="32" :color="viewMode === 'waterfall' ? '#FF6A00' : ''" />
              </view>
            </view>
          </view>

          <view v-if="viewMode === 'list'" class="result-list">
            <ui-search-result-item 
              v-for="item in productList" 
              :key="item.id"
              v-bind="item"
              @click="goDetail(item)"
            />
          </view>

          <ui-waterfalls v-else :list="productList" :columns="2" @click="goDetail">
            <template #item="{ item }">
              <view class="waterfall-card">
                <view class="card-image">
                  <ui-image :src="item.cover" width="100%" height="280rpx" radius="12rpx 12rpx 0 0" />
                  <view v-if="item.condition" class="condition-badge">{{ item.condition }}</view>
                </view>
                <view class="card-content">
                  <text class="card-title">{{ item.title }}</text>
                  <view class="card-tags" v-if="item.tags?.length">
                    <text v-for="(tag, idx) in item.tags.slice(0, 2)" :key="idx" class="card-tag">{{ tag }}</text>
                  </view>
                  <view class="card-footer">
                    <ui-price :value="item.price" :size="28" />
                    <text class="card-sales">{{ item.sales }}人付款</text>
                  </view>
                </view>
              </view>
            </template>
          </ui-waterfalls>

          <view v-if="loading" class="loading-more"><text>加载中...</text></view>
          <view v-if="!hasMore && productList.length > 0" class="no-more"><text>没有更多了</text></view>
          <view v-if="!loading && productList.length === 0" class="empty-state">
            <ui-icon name="inbox" :size="120" color="#C7C7CC" />
            <text class="empty-text">暂无相关商品</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="search-default" :style="{ paddingTop: headerHeight + 'px' }">
      <view class="model-info" v-if="currentModel" @click="goDeviceCommunity">
        <ui-image :src="currentModel.cover" width="160rpx" height="160rpx" radius="16rpx" />
        <view class="model-detail">
          <text class="model-name">{{ currentModel.name }}</text>
          <text class="model-brand">{{ currentModel.brand }}</text>
          <view class="model-community">
            <text class="community-text">进入设备社区</text>
            <ui-icon name="arrow-right" :size="28" color="#FF6A00" />
          </view>
        </view>
      </view>
      <view class="start-search" @click="handleSearch"><text>开始搜索</text></view>
    </view>

    <ui-filter-sidebar v-model="showFilterSidebar" @confirm="fetchProducts" @reset="handleFilterReset" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useSearchHistoryStore, useSearchFilterStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import { searchApi, type SearchResultItem } from '@/api/search';
import UiFilterSidebar from '@/ui-kit/organisms/UiFilterSidebar.vue';

interface Product {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  sales?: number;
  condition?: string;
  tags?: string[];
}

const appStore = useAppStore();
const searchHistoryStore = useSearchHistoryStore();
const searchFilterStore = useSearchFilterStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const headerHeight = ref(0);
const scrollHeight = ref(0);

const keyword = ref('');
const modelId = ref('');
const currentModel = ref<{ name: string; brand: string; cover: string } | null>(null);
const hasSearched = ref(false);
const viewMode = ref<'list' | 'waterfall'>('waterfall');
const loading = ref(false);
const hasMore = ref(true);
const totalCount = ref(0);
const currentPage = ref(1);
const showFilterSidebar = ref(false);
const activeSort = ref<'relevance' | 'new' | 'price' | 'sales'>('relevance');
const priceSortOrder = ref<'asc' | 'desc'>('asc');

const displayKeyword = computed(() => currentModel.value?.name || keyword.value || '搜索商品...');

const sortTabs = [
  { label: '综合', value: 'relevance' },
  { label: '销量', value: 'sales' },
  { label: '新品', value: 'new' },
  { label: '价格', value: 'price' }
];

const productList = ref<Product[]>([]);

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  headerHeight.value = rpxToPx(100) + safeAreaTop.value;
  scrollHeight.value = systemInfo.windowHeight - headerHeight.value;
};

const transformSearchResult = (item: SearchResultItem): Product => ({
  id: item.id,
  cover: item.cover,
  title: item.title,
  price: item.price ? item.price / 100 : 0,
  sales: item.memberCount || 0,
  condition: item.condition,
  tags: item.tags || []
});

const fetchProducts = async (isRefresh = false) => {
  if (loading.value) return;
  if (!isRefresh && !hasMore.value) return;

  loading.value = true;

  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
  }

  try {
    const params: any = {
      keyword: keyword.value || undefined,
      modelId: modelId.value || undefined,
      sort: activeSort.value,
      priceOrder: activeSort.value === 'price' ? priceSortOrder.value : undefined,
      page: currentPage.value,
      pageSize: 10
    };

    const res = await searchApi.searchProducts(params);
    const newProducts = res.list.map(transformSearchResult);

    if (isRefresh) {
      productList.value = newProducts;
    } else {
      productList.value = [...productList.value, ...newProducts];
    }

    totalCount.value = res.total;
    hasMore.value = res.hasMore;

    if (res.hasMore) {
      currentPage.value++;
    }
  } catch (error) {
    console.error('搜索商品失败:', error);
    if (isRefresh) {
      productList.value = [];
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => nextTick(calcLayout));

onLoad((options: any) => {
  if (options.keyword) {
    keyword.value = decodeURIComponent(options.keyword);
  }
  if (options.modelId) {
    modelId.value = options.modelId;
    currentModel.value = { name: options.keyword || '型号商品', brand: 'Apple', cover: 'https://picsum.photos/200/200?random=model' };
  }
  handleSearch();
});

const handleSearch = () => {
  if (!keyword.value.trim() && !modelId.value) return;
  searchHistoryStore.addHistory(keyword.value.trim() || currentModel.value?.name || '', 'product');
  hasSearched.value = true;
  fetchProducts(true);
};

const handleSortChange = (value: string) => {
  if (value === 'price' && activeSort.value === 'price') {
    priceSortOrder.value = priceSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    activeSort.value = value as any;
  }
  fetchProducts(true);
};

const handleFilterReset = () => {
  searchFilterStore.resetAdvancedFilters();
  fetchProducts(true);
};

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    fetchProducts(false);
  }
};

const goBack = () => smartBack();
const goSearchPage = () => navigateTo(`/pages-sub/search/entry?keyword=${encodeURIComponent(keyword.value)}`);
const goDetail = (item: Product) => navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
const goDeviceCommunity = () => {
  if (currentModel.value) {
    navigateTo(`/pages-sub/community/device/index?id=${currentModel.value?.name}&name=${encodeURIComponent(currentModel.value.name)}`);
  }
};
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
}

.header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 106, 0, 0.08) 0%, transparent 100%);
  pointer-events: none;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  border-bottom: 1rpx solid var(--color-border, rgba(44, 38, 36, 0.08));
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  background: var(--color-bg-gray, #F5F5F7);
  transition: all $duration-fast;

  &:active { transform: scale(0.92); }
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: $space-sm;
  background: var(--color-bg-gray, #F5F5F7);
  border-radius: $radius-full;
  padding: $space-sm $space-md;

  .search-placeholder {
    font-size: $font-size-sm;
    color: $color-text-placeholder;
  }
}

.content-scroll {
  position: fixed;
  left: 0;
  right: 0;
}

.scroll-content {
  padding-bottom: $space-xl;
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  border-bottom: 1rpx solid var(--color-border, rgba(0, 0, 0, 0.04));
  position: sticky;
  top: 0;
  z-index: $z-sticky;
}

.filter-tabs {
  display: flex;
  flex: 1;
  gap: $space-xs;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: $space-sm $space-lg;
  border-radius: $radius-full;
  transition: all $duration-fast;

  .tab-text { font-size: $font-size-sm; color: $color-text-sub; }
  .sort-arrows { display: flex; flex-direction: column; margin-left: 4rpx; }

  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
    .tab-text { color: var(--color-primary, #FF6A00); font-weight: $font-weight-medium; }
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border-radius: $radius-md;

  .filter-btn-text { font-size: $font-size-sm; color: var(--color-primary, #FF6A00); margin-left: 4rpx; }
}

.search-default {
  padding: $space-xl;

  .model-info {
    display: flex;
    align-items: center;
    gap: $space-lg;
    background: var(--glass-solid, rgba(255, 255, 255, 0.85));
    border-radius: $radius-lg;
    padding: $space-lg;
    margin-bottom: $space-xl;
    transition: all $duration-fast;

    .model-detail {
      flex: 1;
      .model-name { display: block; font-size: $font-size-lg; font-weight: $font-weight-bold; color: $color-text-main; margin-bottom: $space-xs; }
      .model-brand { display: block; font-size: $font-size-sm; color: $color-text-sub; margin-bottom: $space-sm; }
      .model-community {
        display: flex;
        align-items: center;
        gap: 4rpx;
        .community-text { font-size: $font-size-sm; color: var(--color-primary, #FF6A00); }
      }
    }
    
    &:active {
      transform: scale(0.98);
      background: var(--color-bg-gray, #F5F5F7);
    }
  }

  .start-search {
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    border-radius: $radius-btn;
    padding: $space-md;
    text-align: center;
    text { font-size: $font-size-md; font-weight: $font-weight-medium; color: #FFFFFF; }
  }
}

.product-section { padding: $space-sm $space-md; }

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-sm;
  .result-count { font-size: $font-size-sm; color: $color-text-sub; }
}

.view-toggle {
  display: flex;
  gap: $space-xs;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  border-radius: $radius-md;
  padding: 4rpx;

  .toggle-item {
    padding: $space-xs $space-sm;
    border-radius: $radius-sm;
    &.is-active { background: var(--glass-solid, rgba(255, 255, 255, 0.85)); }
  }
}

.result-list { padding: $space-sm $space-md; }

.waterfall-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-sm;

  .card-image {
    position: relative;
    .condition-badge {
      position: absolute;
      top: 8rpx;
      left: 8rpx;
      background: rgba(0, 0, 0, 0.6);
      color: #FFF;
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
    }
  }

  .card-content {
    padding: $space-sm;
    .card-title { font-size: $font-size-sm; color: $color-text-main; @include text-ellipsis(2); line-height: 1.4; min-height: 64rpx; }
    .card-tags { display: flex; flex-wrap: wrap; gap: 8rpx; margin-top: $space-xs; }
    .card-tag { font-size: $font-size-xs; color: var(--color-primary, #FF6A00); background: var(--color-primary-glass, rgba(255, 106, 0, 0.08)); padding: 4rpx 10rpx; border-radius: $radius-xs; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: $space-sm; }
    .card-sales { font-size: $font-size-xs; color: $color-text-disabled; }
  }
}

.loading-more, .no-more {
  padding: $space-lg;
  text-align: center;
  text { font-size: $font-size-sm; color: $color-text-disabled; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx $space-xl;
  .empty-text { font-size: $font-size-md; color: $color-text-sub; margin-top: $space-md; }
}


</style>
