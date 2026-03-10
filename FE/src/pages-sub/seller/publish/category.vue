<template>
  <view class="category-select-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="选择分类">
      <template #right>
        <view class="confirm-btn" @click="confirmSelect">
          <text>确定</text>
        </view>
      </template>
    </ui-sub-navbar>
    
    <view class="search-section">
      <view class="search-box">
        <ui-icon name="search" :size="32" color="#A1A1A6" />
        <input 
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索分类"
          @input="handleSearch"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
          <ui-icon name="x" :size="28" color="#C7C7CC" />
        </view>
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="category-scroll"
      :style="{ height: scrollHeight + 'px' }"
    >
      <view v-if="searchKeyword && searchResults.length === 0" class="empty-state">
        <ui-icon name="search" :size="120" color="#C7C7CC" />
        <text class="empty-text">未找到相关分类</text>
      </view>
      
      <template v-else>
        <view v-if="searchKeyword" class="section-header">
          <text class="section-title">搜索结果</text>
        </view>
        
        <view v-if="!searchKeyword && recentCategories.length" class="recent-section">
          <view class="section-header">
            <text class="section-title">最近使用</text>
            <view class="clear-history" @click="clearHistory">
              <text>清空</text>
            </view>
          </view>
          <view class="recent-list">
            <view 
              v-for="cat in recentCategories" 
              :key="cat.id"
              class="recent-item"
              :class="{ 'is-selected': selectedCategory?.id === cat.id }"
              @click="selectCategory(cat)"
            >
              <view class="recent-icon">
                <ui-icon :name="cat.icon || 'folder'" :size="32" color="var(--color-primary, #FF6A00)" />
              </view>
              <text class="recent-name">{{ cat.name }}</text>
            </view>
          </view>
        </view>
        
        <view class="category-section">
          <view v-if="!searchKeyword" class="section-header">
            <text class="section-title">全部分类</text>
          </view>
          
          <view class="category-list">
            <view 
              v-for="cat in displayCategories" 
              :key="cat.id"
              class="category-item"
              :class="{ 'is-selected': selectedCategory?.id === cat.id }"
              @click="selectCategory(cat)"
            >
              <view class="category-left">
                <view class="category-icon">
                  <ui-icon :name="cat.icon || 'folder'" :size="36" color="var(--color-primary, #FF6A00)" />
                </view>
                <view class="category-info">
                  <text class="category-name">{{ cat.name }}</text>
                  <text v-if="cat.description" class="category-desc">{{ cat.description }}</text>
                </view>
              </view>
              <view class="category-right">
                <text v-if="cat.productCount" class="product-count">{{ cat.productCount }}件商品</text>
                <view v-if="selectedCategory?.id === cat.id" class="check-icon">
                  <ui-icon name="check" :size="32" color="#FFFFFF" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      
      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';

interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  productCount?: number;
}

const { scrollHeight: baseScrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const scrollHeight = ref(0);
const searchKeyword = ref('');
const selectedCategory = ref<Category | null>(null);
const searchResults = ref<Category[]>([]);
const recentCategories = ref<Category[]>([]);

const allCategories = ref<Category[]>([
  { id: 1, name: '手机', icon: 'smartphone', description: '智能手机、功能机', productCount: 12580 },
  { id: 2, name: '电脑', icon: 'laptop', description: '笔记本、台式机、一体机', productCount: 8920 },
  { id: 3, name: '平板', icon: 'tablet', description: 'iPad、安卓平板', productCount: 4560 },
  { id: 4, name: '耳机', icon: 'headphones', description: '有线耳机、蓝牙耳机', productCount: 6780 },
  { id: 5, name: '相机', icon: 'camera', description: '单反、微单、卡片机', productCount: 3450 },
  { id: 6, name: '游戏机', icon: 'gamepad', description: '主机、掌机、游戏配件', productCount: 2890 },
  { id: 7, name: '智能穿戴', icon: 'watch', description: '智能手表、手环', productCount: 5120 },
  { id: 8, name: '配件', icon: 'cable', description: '充电器、数据线、保护壳', productCount: 15680 },
  { id: 9, name: '存储设备', icon: 'hard-drive', description: 'U盘、移动硬盘、存储卡', productCount: 2340 },
  { id: 10, name: '网络设备', icon: 'wifi', description: '路由器、交换机', productCount: 1890 },
  { id: 11, name: '显示器', icon: 'monitor', description: '电脑显示器、专业显示器', productCount: 2670 },
  { id: 12, name: '键盘鼠标', icon: 'mouse', description: '机械键盘、鼠标、套装', productCount: 4320 },
  { id: 13, name: '音箱音响', icon: 'speaker', description: '蓝牙音箱、家庭影院', productCount: 1980 },
  { id: 14, name: '其他', icon: 'box', description: '其他数码产品', productCount: 3210 }
]);

const displayCategories = computed(() => {
  return searchKeyword.value ? searchResults.value : allCategories.value;
});

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  scrollHeight.value = systemInfo.windowHeight - 200;
  
  loadRecentCategories();
});

onLoad((options: any) => {
  if (options?.selectedId) {
    const id = parseInt(options.selectedId);
    const cat = allCategories.value.find(c => c.id === id);
    if (cat) {
      selectedCategory.value = cat;
    }
  }
});

const loadRecentCategories = () => {
  try {
    const recent = uni.getStorageSync('recent_categories');
    if (recent) {
      recentCategories.value = JSON.parse(recent);
    }
  } catch (error) {
    console.error('加载最近分类失败:', error);
  }
};

const saveRecentCategory = (category: Category) => {
  const recent = recentCategories.value.filter(c => c.id !== category.id);
  recent.unshift(category);
  recentCategories.value = recent.slice(0, 5);
  
  try {
    uni.setStorageSync('recent_categories', JSON.stringify(recentCategories.value));
  } catch (error) {
    console.error('保存最近分类失败:', error);
  }
};

const handleSearch = () => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) {
    searchResults.value = [];
    return;
  }
  
  searchResults.value = allCategories.value.filter(cat => 
    cat.name.toLowerCase().includes(keyword) ||
    cat.description?.toLowerCase().includes(keyword)
  );
};

const clearSearch = () => {
  searchKeyword.value = '';
  searchResults.value = [];
};

const clearHistory = () => {
  recentCategories.value = [];
  uni.removeStorageSync('recent_categories');
};

const selectCategory = (category: Category) => {
  if (selectedCategory.value?.id === category.id) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = category;
  }
};

const confirmSelect = () => {
  if (!selectedCategory.value) {
    uni.showToast({ title: '请选择分类', icon: 'none' });
    return;
  }
  
  saveRecentCategory(selectedCategory.value);
  
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  
  if (prevPage) {
    uni.navigateBack({
      success: () => {
        const url = `/pages-sub/seller/publish/entry?categoryId=${selectedCategory.value!.id}&categoryName=${encodeURIComponent(selectedCategory.value!.name)}`;
        uni.redirectTo({ url });
      }
    });
  } else {
    uni.navigateBack();
  }
};
</script>

<style lang="scss" scoped>
.category-select-page {
  min-height: 100vh;
  background: $color-bg-page;
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
    top: 100rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 400rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.confirm-btn {
  padding: 12rpx 32rpx;
  background: $gradient-sunset;
  border-radius: $radius-full;
  
  text {
    font-size: $font-size-sm;
    color: #FFFFFF;
    font-weight: $font-weight-medium;
  }
}

.search-section {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
}

.search-box {
  display: flex;
  align-items: center;
  gap: $space-sm;
  height: 80rpx;
  padding: 0 $space-md;
  background: $color-bg-gray;
  border-radius: $radius-full;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .search-input {
    flex: 1;
    font-size: $font-size-md;
    color: $color-text-main;
  }
  
  .clear-btn {
    padding: $space-xs;
  }
}

.category-scroll {
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md $space-md $space-sm;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    @include text-main;
  }
  
  .clear-history {
    text {
      font-size: $font-size-sm;
      @include text-sub;
    }
  }
}

.recent-section {
  padding: 0 $space-md;
  margin-bottom: $space-sm;
}

.recent-list {
  display: flex;
  gap: $space-sm;
  overflow-x: auto;
  padding-bottom: $space-sm;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.recent-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-full;
  border: 2rpx solid transparent;
  
  &.is-selected {
    border-color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    
    .recent-name {
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .recent-icon {
    width: 48rpx;
    height: 48rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-radius: 50%;
    @include flex-center;
  }
  
  .recent-name {
    font-size: $font-size-sm;
    @include text-main;
  }
}

.category-section {
  padding: 0 $space-md;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  transition: all $duration-fast $ease-spring;
  
  &.is-selected {
    border-color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  }
  
  .category-left {
    display: flex;
    align-items: center;
    gap: $space-md;
  }
  
  .category-icon {
    width: 72rpx;
    height: 72rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-radius: $radius-md;
    @include flex-center;
  }
  
  .category-info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
    
    .category-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .category-desc {
      font-size: $font-size-xs;
      @include text-sub;
    }
  }
  
  .category-right {
    display: flex;
    align-items: center;
    gap: $space-sm;
    
    .product-count {
      font-size: $font-size-xs;
      @include text-sub;
    }
    
    .check-icon {
      width: 40rpx;
      height: 40rpx;
      background: var(--color-primary, #FF6A00);
      border-radius: 50%;
      @include flex-center;
    }
  }
}

.empty-state {
  @include flex-column-center;
  padding: 160rpx 0;
  
  .empty-text {
    font-size: $font-size-md;
    @include text-sub;
    margin-top: $space-md;
  }
}

.bottom-space {
  height: 60rpx;
}
</style>
