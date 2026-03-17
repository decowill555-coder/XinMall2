<template>
  <view class="search-page" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
    <view class="search-header page-header">
      <view class="back-btn" @click="goBack">
        <ui-icon name="arrow-left" :size="40" />
      </view>
      <view class="search-input-wrapper">
        <ui-search 
          v-model="keyword" 
          placeholder="搜索数码产品型号..." 
          :hot-keywords="hotKeywords"
          :auto-focus="autoFocus"
          @search="handleSearch"
          @hot-click="handleHotClick"
        />
      </view>
      <view class="search-btn" @click="handleSearch">
        <text>搜索</text>
      </view>
    </view>
    
    <UiSearchFilterBar
      v-if="hasSearched"
      class="filter-bar"
      @seller-change="handleSellerChange"
      @condition-change="handleConditionChange"
      @device-change="handleDeviceChange"
      @open-sidebar="openFilterSidebar"
    />
    
    <scroll-view 
      scroll-y 
      class="search-scroll" 
      :style="{ height: computedScrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view v-if="!hasSearched" class="search-default">
        <ui-search-history 
          :list="historyList"
          @click="searchByKeyword"
          @clear="clearHistory"
        />
        <ui-hot-keywords 
          :list="hotList"
          @click="searchByKeyword"
        />
      </view>
      
      <view v-else class="search-result">
        <view class="result-toolbar">
          <text class="result-count">找到 {{ totalCount }} 个商品</text>
          <view class="view-toggle">
            <view 
              class="toggle-item" 
              :class="{ 'is-active': viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <ui-icon name="list" :size="32" :color="viewMode === 'list' ? 'success' : ''" />
            </view>
            <view 
              class="toggle-item" 
              :class="{ 'is-active': viewMode === 'waterfall' }"
              @click="viewMode = 'waterfall'"
            >
              <ui-icon name="grid" :size="32" :color="viewMode === 'waterfall' ? 'success' : ''" />
            </view>
          </view>
        </view>
        
        <view v-if="viewMode === 'list'" class="result-list">
          <ui-search-result-item 
            v-for="item in resultList" 
            :key="item.id"
            :cover="item.cover"
            :title="item.title"
            :specs="item.specs"
            :tags="item.tags"
            :price="item.price"
            :condition="item.condition"
            :time="item.timeStr"
            @click="goDetail(item)"
          />
        </view>
        
        <view v-else class="result-waterfall">
          <ui-waterfalls :list="resultList" :columns="2" @click="goDetail">
            <template #item="{ item }">
              <view class="waterfall-card">
                <view class="card-image">
                  <ui-image 
                    :src="item.cover" 
                    width="100%" 
                    height="280rpx" 
                    radius="12rpx 12rpx 0 0" 
                  />
                  <view v-if="item.condition" class="condition-badge">
                    {{ item.condition }}
                  </view>
                </view>
                <view class="card-content">
                  <text class="card-title">{{ item.title }}</text>
                  <view class="card-tags" v-if="item.tags?.length">
                    <text 
                      v-for="(tag, idx) in item.tags.slice(0, 2)" 
                      :key="idx" 
                      class="card-tag"
                    >{{ tag }}</text>
                  </view>
                  <view class="card-footer">
                    <ui-price :value="item.price" :size="28" />
                    <text class="card-sales">{{ item.sales }}人付款</text>
                  </view>
                </view>
              </view>
            </template>
          </ui-waterfalls>
        </view>
        
        <view v-if="loading" class="loading-more">
          <text>加载中...</text>
        </view>
        
        <view v-if="!hasMore && resultList.length > 0" class="no-more">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
    
    <UiFilterSidebar 
      v-model:show="showFilterSidebar"
      @confirm="handleFilterConfirm"
      @reset="handleFilterReset"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useSearchHistoryStore, useSearchFilterStore } from '@/stores';
import { searchApi, type SearchResultItem } from '@/api/search';
import UiSearchFilterBar from '@/ui-kit/organisms/UiSearchFilterBar.vue';
import UiFilterSidebar from '@/ui-kit/organisms/UiFilterSidebar.vue';
import { logError } from '@/utils/logger';

const { safeAreaTop, headerExtraTop, scrollHeight, rpxToPx } = usePageLayout({
  hasSubNavbar: false,
  headerEstimatedHeight: 100
});

const { smartBack, navigateTo } = useNavigation();

const FILTER_BAR_HEIGHT = 88;

const hasSearched = ref(false);
const computedScrollHeight = computed(() => {
  if (hasSearched.value) {
    return scrollHeight.value - rpxToPx(FILTER_BAR_HEIGHT);
  }
  return scrollHeight.value;
});

const searchHistoryStore = useSearchHistoryStore();
const searchFilterStore = useSearchFilterStore();

const keyword = ref('');
const autoFocus = ref(false);
const viewMode = ref<'list' | 'waterfall'>('waterfall');
const loading = ref(false);
const hasMore = ref(true);
const totalCount = ref(0);
const currentPage = ref(1);
const showFilterSidebar = ref(false);

const hotKeywords = computed(() => {
  const hot = searchHistoryStore.hotKeywords;
  if (hot.length > 0) {
    return hot.map(h => ({ keyword: h.keyword, id: h.id }));
  }
  return [
    { keyword: 'iPhone 15 Pro Max', id: 1 },
    { keyword: 'MacBook Pro M3', id: 2 },
    { keyword: 'AirPods Pro 2', id: 3 },
    { keyword: 'iPad Pro 2024', id: 4 },
    { keyword: 'Nintendo Switch OLED', id: 5 },
    { keyword: 'Sony 相机', id: 6 },
    { keyword: '华为 Mate 60 Pro', id: 7 },
    { keyword: '小米 14 Ultra', id: 8 }
  ];
});

onLoad((options: any) => {
  if (options.keyword) {
    keyword.value = decodeURIComponent(options.keyword);
    handleSearch();
  } else {
    autoFocus.value = true;
  }
});

const historyList = computed(() => 
  searchHistoryStore.recentHistory.map(h => h.keyword)
);

const hotList = computed(() => {
  const hot = searchHistoryStore.hotKeywords;
  if (hot.length > 0) return hot.map(h => ({ keyword: h.keyword, isHot: h.trend === 'up' }));
  return [
    { keyword: 'iPhone 15 Pro Max', isHot: true },
    { keyword: 'MacBook Pro M3', isHot: true },
    { keyword: 'AirPods Pro 2', isHot: false },
    { keyword: 'iPad Pro', isHot: false },
    { keyword: 'Nintendo Switch', isHot: false },
    { keyword: 'Sony 相机', isHot: false },
    { keyword: '华为 Mate 60', isHot: true },
    { keyword: '小米 14', isHot: false }
  ];
});

const resultList = ref<any[]>([]);

const handleSearch = () => {
  if (!keyword.value.trim()) return;

  searchHistoryStore.addHistory(keyword.value.trim(), 'product');
  hasSearched.value = true;
  currentPage.value = 1;
  hasMore.value = true;
  resultList.value = [];

  fetchProducts();
};

const handleHotClick = (item: any) => {
  keyword.value = item.keyword;
  handleSearch();
};

const searchByKeyword = (word: string) => {
  keyword.value = word;
  handleSearch();
};

const clearHistory = () => {
  searchHistoryStore.clearHistory();
};

const goBack = () => {
  smartBack();
};

const goDetail = (item: any) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};

const handleSellerChange = (value: 'all' | 'merchant' | 'personal') => {
  searchFilterStore.setSellerType(value);
  fetchProducts();
};

const handleConditionChange = (value: string | number | null) => {
  searchFilterStore.setCondition(value);
  fetchProducts();
};

const handleDeviceChange = (value: string | number | null) => {
  searchFilterStore.setDeviceType(value);
  fetchProducts();
};

const openFilterSidebar = () => {
  showFilterSidebar.value = true;
};

const handleFilterConfirm = () => {
  fetchProducts();
};

const handleFilterReset = () => {
  searchFilterStore.resetAdvancedFilters();
  fetchProducts();
};

const fetchProducts = async () => {
  loading.value = true;

  try {
    const filters = searchFilterStore;
    const result = await searchApi.searchProducts({
      keyword: keyword.value.trim(),
      sellerType: filters.sellerType === 'all' ? undefined : filters.sellerType as 'personal' | 'merchant',
      condition: filters.condition || undefined,
      deviceTypeId: filters.deviceType || undefined,
      sort: 'relevance',
      page: currentPage.value,
      size: 20
    });

    totalCount.value = result.total;
    hasMore.value = result.hasMore;

    const items = result.list.map((item: SearchResultItem) => ({
      id: item.id,
      cover: item.cover,
      title: item.title,
      price: item.price || 0,
      sales: item.productCount || 0,
      condition: item.condition || '',
      specs: item.subtitle || '',
      tags: item.tags || [],
      timeStr: item.highlight || ''
    }));

    if (currentPage.value === 1) {
      resultList.value = items;
    } else {
      resultList.value = [...resultList.value, ...items];
    }
  } catch (error) {
    logError('搜索失败:', error);
    if (currentPage.value === 1) {
      resultList.value = [];
    }
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loading.value || !hasMore.value) return;

  currentPage.value++;
  await fetchProducts();
};
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.search-header {
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  .back-btn {
    padding: $space-xs;
    margin-right: $space-sm;
  }
  
  .search-input-wrapper {
    flex: 1;
  }
  
  .search-btn {
    padding: $space-sm $space-md;
    margin-left: $space-sm;
    
    text {
      font-size: $font-size-md;
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
  }
}

.search-scroll {
  overflow: hidden;
}

.search-default {
  padding: $space-md;
}

.search-result {
  .result-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    
    .result-count {
      font-size: $font-size-sm;
      color: $color-text-sub;
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
        transition: all $duration-fast;
        
        &.is-active {
          background: var(--glass-solid, rgba(255, 255, 255, 0.85));
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
        }
      }
    }
  }
}

.result-list {
  padding: $space-sm $space-md;
}

.result-waterfall {
  padding: 0 $space-sm;
}

.waterfall-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
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
      color: var(--color-text-white, #FFFFFF);
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
  }
  
  .card-content {
    padding: $space-sm;
    
    .card-title {
      font-size: $font-size-sm;
      color: $color-text-main;
      @include text-ellipsis(2);
      line-height: 1.4;
      min-height: 64rpx;
    }
    
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8rpx;
      margin-top: $space-xs;
      
      .card-tag {
        font-size: $font-size-xs;
        color: var(--color-primary, #FF6A00);
        background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
        padding: 4rpx 10rpx;
        border-radius: $radius-xs;
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-sm;
      
      .card-sales {
        font-size: $font-size-xs;
        color: $color-text-disabled;
      }
    }
  }
}

.loading-more,
.no-more {
  padding: $space-lg;
  text-align: center;
  
  text {
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }
}
</style>
