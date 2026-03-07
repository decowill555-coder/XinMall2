<template>
  <view class="search-entry-page" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
    <view class="search-header page-header">
      <view class="back-btn" @click="goBack">
        <ui-icon name="arrow-left" :size="40" />
      </view>
      <view class="search-input-wrapper">
        <ui-search 
          v-model="keyword" 
          placeholder="搜索数码产品型号..." 
          :auto-focus="true"
          @input="handleInput"
          @search="handleSearch"
        />
      </view>
      <view class="search-btn" @click="handleSearch">
        <text>搜索</text>
      </view>
    </view>
    
    <view class="search-content" :style="{ top: headerHeight + 'px' }">
      <ui-search-dropdown
        :visible="showDropdown"
        :keyword="keyword"
        :suggestions="suggestions"
        :loading="suggestionLoading"
        :position-top="headerHeight"
        @select-model="handleSelectModel"
        @select-forum="handleSelectForum"
      />
      
      <scroll-view 
        v-if="!showDropdown"
        scroll-y 
        class="content-scroll"
        :style="{ height: scrollHeight + 'px' }"
      >
        <ui-search-history 
          :list="historyList"
          @click="searchByKeyword"
          @clear="clearHistory"
        />
        <ui-hot-keywords 
          :list="hotList"
          @click="searchByKeyword"
        />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useSearchHistoryStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import { searchApi, type SearchSuggestionItem } from '@/api/search';

const appStore = useAppStore();
const searchHistoryStore = useSearchHistoryStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const isH5 = computed(() => appStore.isH5);
const headerExtraTop = computed(() => isH5.value ? 12 : 0);

const keyword = ref('');
const showDropdown = ref(false);
const suggestions = ref<SearchSuggestionItem[]>([]);
const suggestionLoading = ref(false);
const headerHeight = ref(0);
const scrollHeight = ref(0);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  nextTick(() => {
    calcLayout();
  });
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const estimatedHeader = rpxToPx(100) + safeAreaTop.value + headerExtraTop.value;
  headerHeight.value = estimatedHeader;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader;
};

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
    { keyword: '华为 Mate 60', isHot: true },
    { keyword: '小米 14', isHot: false },
    { keyword: 'Sony 相机', isHot: false },
    { keyword: 'Nintendo Switch', isHot: false }
  ];
});

const handleInput = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  if (!keyword.value.trim()) {
    showDropdown.value = false;
    suggestions.value = [];
    return;
  }
  
  debounceTimer = setTimeout(() => {
    fetchSuggestions();
  }, 300);
};

const fetchSuggestions = async () => {
  if (!keyword.value.trim()) return;
  
  suggestionLoading.value = true;
  showDropdown.value = true;
  
  try {
    const res = await searchApi.getSearchSuggestions(keyword.value.trim());
    suggestions.value = res;
  } catch {
    suggestions.value = generateMockSuggestions(keyword.value.trim());
  } finally {
    suggestionLoading.value = false;
  }
};

const generateMockSuggestions = (kw: string): SearchSuggestionItem[] => {
  const mockModels: SearchSuggestionItem[] = [
    { id: 'm1', type: 'model', name: `iPhone 15 Pro Max`, brand: 'Apple', modelId: 'iphone-15-pro-max', subtitle: '256GB / 钛金属原色' },
    { id: 'm2', type: 'model', name: `iPhone 15 Pro`, brand: 'Apple', modelId: 'iphone-15-pro', subtitle: '128GB / 蓝色钛金属' },
    { id: 'm3', type: 'model', name: `${kw} 相关型号`, brand: '其他', modelId: 'mock-model' }
  ];
  
  const mockForums: SearchSuggestionItem[] = [
    { id: 'f1', type: 'forum', name: `${kw} 爱好者论坛`, forumType: 'user', forumId: 'forum-1', memberCount: 1234 },
    { id: 'f2', type: 'forum', name: `${kw} 交易专区`, forumType: 'model', forumId: 'forum-2', memberCount: 5678 }
  ];
  
  return [...mockModels, ...mockForums];
};

const handleSearch = () => {
  if (!keyword.value.trim()) return;
  
  searchHistoryStore.addHistory(keyword.value.trim(), 'product');
  navigateTo(`/pages-sub/search/result?keyword=${encodeURIComponent(keyword.value.trim())}`);
};

const handleSelectModel = (item: SearchSuggestionItem) => {
  searchHistoryStore.addHistory(item.name, 'product');
  navigateTo(`/pages-sub/search/result?modelId=${item.modelId || item.id}&keyword=${encodeURIComponent(item.name)}`);
};

const handleSelectForum = (item: SearchSuggestionItem) => {
  searchHistoryStore.addHistory(item.name, 'topic');
  navigateTo(`/pages-sub/content/forum/detail?id=${item.forumId || item.id}`);
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

watch(keyword, (val) => {
  if (!val.trim()) {
    showDropdown.value = false;
  }
});
</script>

<style lang="scss" scoped>
.search-entry-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.search-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
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

.search-content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}

.content-scroll {
  padding: $space-md;
}
</style>
