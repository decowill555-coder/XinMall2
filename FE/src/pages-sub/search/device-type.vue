<template>
  <view class="device-type-page">
    <view class="page-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-bg" />
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <ui-icon name="arrow-left" :size="40" />
        </view>
        <view class="header-center">
          <text class="page-title">{{ deviceTypeName }}</text>
          <view class="search-bar" @click="goSearch">
            <ui-icon name="search" :size="32" color="placeholder" />
            <text class="search-placeholder">搜索{{ deviceTypeName }}型号...</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="content-scroll"
      :style="{ top: headerHeight + 'px', height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="scroll-content">
        <ui-sub-category-tabs
          v-model="activeSubCategory"
          :list="subCategories"
          @change="handleSubCategoryChange"
        />

        <ui-brand-selector
          v-model="activeBrand"
          :brands="brands"
          @change="handleBrandChange"
        />

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
                <ui-icon
                  name="arrow-up"
                  :size="20"
                  :color="priceSortOrder === 'asc' ? 'primary' : 'disabled'"
                />
                <ui-icon
                  name="arrow-down"
                  :size="20"
                  :color="priceSortOrder === 'desc' ? 'primary' : 'disabled'"
                />
              </view>
            </view>
          </view>
          <view class="filter-btn" @click="openFilterSidebar">
            <ui-icon name="filter" :size="32" color="primary" />
            <text class="filter-btn-text">筛选</text>
            <view v-if="filterCount > 0" class="filter-dot" />
          </view>
        </view>

        <view class="product-section">
          <view class="result-info">
            <text class="result-count">共 {{ totalCount }} 件商品</text>
          </view>

          <ui-waterfalls :list="productList" :columns="2" @click="goDeviceCommunity">
            <template #item="{ item }">
              <view class="waterfall-card">
                <view class="card-image">
                  <ui-image
                    :src="item.cover"
                    width="100%"
                    height="280rpx"
                    radius="12rpx 12rpx 0 0"
                  />
                  <view class="community-badge">
                    <ui-icon name="users" :size="20" color="white" />
                    <text>{{ item.memberCount || '1.2万' }}</text>
                  </view>
                </view>
                <view class="card-content">
                  <text class="card-title">{{ item.title }}</text>
                  <view class="card-specs" v-if="item.specs">
                    <text class="spec-text">{{ item.specs }}</text>
                  </view>
                  <view class="card-tags" v-if="item.tags?.length">
                    <text
                      v-for="(tag, idx) in item.tags.slice(0, 2)"
                      :key="idx"
                      class="card-tag"
                    >{{ tag }}</text>
                  </view>
                  <view class="card-footer">
                    <view class="price-info">
                      <text class="price-label">参考价</text>
                      <ui-price :value="item.price" :size="28" />
                    </view>
                    <view class="community-arrow">
                      <text class="community-text">进入社区</text>
                      <ui-icon name="arrow-right" :size="24" color="primary" />
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </ui-waterfalls>

          <view v-if="loading" class="loading-more">
            <text>加载中...</text>
          </view>

          <view v-if="!hasMore && productList.length > 0" class="no-more">
            <text>没有更多了</text>
          </view>

          <view v-if="!loading && productList.length === 0" class="empty-state">
            <ui-icon name="inbox" :size="120" color="disabled" />
            <text class="empty-text">暂无相关商品</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <ui-filter-sidebar
      v-model:show="showFilterSidebar"
      @confirm="handleFilterConfirm"
      @reset="handleFilterReset"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useSearchFilterStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import UiFilterSidebar from '@/ui-kit/organisms/UiFilterSidebar.vue';
import UiSubCategoryTabs, { type SubCategoryItem } from '@/ui-kit/molecules/UiSubCategoryTabs.vue';
import UiBrandSelector, { type BrandItem } from '@/ui-kit/organisms/UiBrandSelector.vue';

interface Product {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  sales: number;
  specs?: string;
  tags?: string[];
  memberCount?: string;
}

const appStore = useAppStore();
const searchFilterStore = useSearchFilterStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const headerHeight = ref(0);
const scrollHeight = ref(0);

const deviceTypeId = ref('');
const deviceTypeName = ref('设备类型');
const activeSubCategory = ref('all');
const activeBrand = ref('all');
const activeSort = ref('recommend');
const priceSortOrder = ref<'asc' | 'desc'>('asc');
const showFilterSidebar = ref(false);

const loading = ref(false);
const hasMore = ref(true);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 20;

const filterCount = computed(() => searchFilterStore.advancedFilterCount);

const sortTabs = [
  { label: '推荐', value: 'recommend' },
  { label: '销量', value: 'sales' },
  { label: '新品', value: 'new' },
  { label: '价格', value: 'price' }
];

const subCategories = ref<SubCategoryItem[]>([
  { id: 'all', name: '全部' }
]);

const brands = ref<BrandItem[]>([
  { id: 'all', name: '全部' }
]);

const productList = ref<Product[]>([]);

onMounted(() => {
  nextTick(() => {
    calcLayout();
  });
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;

  const estimatedHeader = rpxToPx(140) + safeAreaTop.value;
  headerHeight.value = estimatedHeader;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader;
};

onLoad((options: any) => {
  if (options.id) {
    deviceTypeId.value = options.id;
  }
  if (options.name) {
    deviceTypeName.value = decodeURIComponent(options.name);
  }
  fetchDeviceTypeData();
  fetchProducts();
});

const fetchDeviceTypeData = async () => {
  const mockSubCategories: SubCategoryItem[] = [
    { id: 'all', name: '全部' },
    { id: 'sub1', name: '双开门' },
    { id: 'sub2', name: '单开门' },
    { id: 'sub3', name: '对开门' },
    { id: 'sub4', name: '三开门' },
    { id: 'sub5', name: '迷你冰箱' },
    { id: 'sub6', name: '车载冰箱' }
  ];

  const mockBrands: BrandItem[] = [
    { id: 'all', name: '全部' },
    { id: 'b1', name: '海尔', logo: 'https://picsum.photos/100/100?random=brand1' },
    { id: 'b2', name: '美的', logo: 'https://picsum.photos/100/100?random=brand2' },
    { id: 'b3', name: '西门子', logo: 'https://picsum.photos/100/100?random=brand3' },
    { id: 'b4', name: '松下', logo: 'https://picsum.photos/100/100?random=brand4' },
    { id: 'b5', name: '容声', logo: 'https://picsum.photos/100/100?random=brand5' },
    { id: 'b6', name: '格力', logo: 'https://picsum.photos/100/100?random=brand6' },
    { id: 'b7', name: '三星', logo: 'https://picsum.photos/100/100?random=brand7' },
    { id: 'b8', name: 'LG', logo: 'https://picsum.photos/100/100?random=brand8' }
  ];

  subCategories.value = mockSubCategories;
  brands.value = mockBrands;
};

const fetchProducts = async () => {
  loading.value = true;

  await new Promise(resolve => setTimeout(resolve, 500));

  const mockProducts: Product[] = [
    {
      id: 1,
      cover: 'https://picsum.photos/400/400?random=101',
      title: '海尔 BCD-470WDPG 对开门冰箱 470L 变频节能',
      price: 3999,
      sales: 256,
      specs: '470L / 对开门 / 变频',
      tags: ['节能', '静音', '智能'],
      memberCount: '1.2万'
    },
    {
      id: 2,
      cover: 'https://picsum.photos/400/400?random=102',
      title: '美的 BCD-536WKZM(E) 风冷无霜冰箱',
      price: 3299,
      sales: 189,
      specs: '536L / 对开门 / 风冷',
      tags: ['无霜', '大容量'],
      memberCount: '8562'
    },
    {
      id: 3,
      cover: 'https://picsum.photos/400/400?random=103',
      title: '西门子 BCD-610W(KA92NV02TI) 德国品质',
      price: 5999,
      sales: 145,
      specs: '610L / 对开门 / 风冷',
      tags: ['进口', '静音'],
      memberCount: '6234'
    },
    {
      id: 4,
      cover: 'https://picsum.photos/400/400?random=104',
      title: '松下 NR-EW45TGA-W 四门冰箱 455L',
      price: 4599,
      sales: 98,
      specs: '455L / 四门 / 变频',
      tags: ['节能', '智能'],
      memberCount: '4521'
    },
    {
      id: 5,
      cover: 'https://picsum.photos/400/400?random=105',
      title: '容声 BCD-529WD11HP 风冷无霜冰箱',
      price: 2899,
      sales: 312,
      specs: '529L / 对开门 / 风冷',
      tags: ['性价比', '大容量'],
      memberCount: '1.5万'
    },
    {
      id: 6,
      cover: 'https://picsum.photos/400/400?random=106',
      title: '格力 BCD-325WPQG 三门冰箱 变频节能',
      price: 2499,
      sales: 178,
      specs: '325L / 三门 / 变频',
      tags: ['节能', '小巧'],
      memberCount: '3892'
    }
  ];

  if (currentPage.value === 1) {
    productList.value = mockProducts;
  } else {
    productList.value = [...productList.value, ...mockProducts];
  }

  totalCount.value = productList.value.length;
  loading.value = false;
};

const handleSubCategoryChange = (item: SubCategoryItem) => {
  activeSubCategory.value = item.id;
  currentPage.value = 1;
  fetchProducts();
};

const handleBrandChange = (brand: BrandItem) => {
  activeBrand.value = brand.id;
  currentPage.value = 1;
  fetchProducts();
};

const handleSortChange = (value: string) => {
  if (value === 'price' && activeSort.value === 'price') {
    priceSortOrder.value = priceSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    activeSort.value = value;
  }
  currentPage.value = 1;
  fetchProducts();
};

const openFilterSidebar = () => {
  showFilterSidebar.value = true;
};

const handleFilterConfirm = () => {
  currentPage.value = 1;
  fetchProducts();
};

const handleFilterReset = () => {
  searchFilterStore.resetAdvancedFilters();
  currentPage.value = 1;
  fetchProducts();
};

const loadMore = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  currentPage.value++;

  await new Promise(resolve => setTimeout(resolve, 500));

  hasMore.value = false;
  loading.value = false;
};

const goBack = () => {
  smartBack();
};

const goSearch = () => {
  navigateTo(`/pages-sub/search/entry?keyword=${encodeURIComponent(deviceTypeName.value)}`);
};

const goDeviceCommunity = (item: Product) => {
  navigateTo(`/pages-sub/community/device/index?id=${item.id}&name=${encodeURIComponent(item.title)}`);
};
</script>

<style lang="scss" scoped>
.device-type-page {
  min-height: 100vh;
  background: $color-bg-page;
  position: relative;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 106, 0, 0.08) 0%, rgba(255, 106, 0, 0) 100%);
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
  -webkit-backdrop-filter: blur($blur-lg);
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
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.92);
    background: var(--color-border, rgba(44, 38, 36, 0.08));
  }
}

.header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.page-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-main;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: $space-sm;
  background: var(--color-bg-gray, #F5F5F7);
  border-radius: $radius-full;
  padding: $space-sm $space-md;
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.99);
    background: var(--color-border, rgba(44, 38, 36, 0.08));
  }

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
  -webkit-backdrop-filter: blur($blur-md);
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
  justify-content: center;
  padding: $space-sm $space-lg;
  border-radius: $radius-full;
  transition: all $duration-fast $ease-spring;
  position: relative;

  .tab-text {
    font-size: $font-size-sm;
    color: $color-text-sub;
    white-space: nowrap;
  }

  .sort-arrows {
    display: flex;
    flex-direction: column;
    margin-left: 4rpx;
    line-height: 1;
  }

  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));

    .tab-text {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
  }
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-sm $space-md;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border-radius: $radius-md;
  position: relative;
  flex-shrink: 0;
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.96);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.15));
  }

  .filter-btn-text {
    font-size: $font-size-sm;
    color: var(--color-primary, #FF6A00);
    margin-left: 4rpx;
    font-weight: $font-weight-medium;
  }

  .filter-dot {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 12rpx;
    height: 12rpx;
    background: $color-error;
    border-radius: 50%;
    border: 2rpx solid $color-white;
  }
}

.product-section {
  padding: $space-sm $space-md;
}

.result-info {
  margin-bottom: $space-sm;

  .result-count {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.waterfall-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-sm;
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.98);
  }

  .card-image {
    position: relative;

    .community-badge {
      position: absolute;
      bottom: 8rpx;
      left: 8rpx;
      display: flex;
      align-items: center;
      gap: 4rpx;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
      padding: 4rpx 12rpx;
      border-radius: $radius-full;
      
      text {
        font-size: $font-size-xs;
        color: #FFFFFF;
      }
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

    .card-specs {
      margin-top: $space-xs;

      .spec-text {
        font-size: $font-size-xs;
        color: $color-text-sub;
        background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
        padding: 4rpx 8rpx;
        border-radius: $radius-xs;
      }
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
      
      .price-info {
        display: flex;
        flex-direction: column;
        
        .price-label {
          font-size: $font-size-xs;
          color: $color-text-disabled;
          margin-bottom: 2rpx;
        }
      }
      
      .community-arrow {
        display: flex;
        align-items: center;
        gap: 4rpx;
        
        .community-text {
          font-size: $font-size-xs;
          color: var(--color-primary, #FF6A00);
        }
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx $space-xl;

  .empty-text {
    font-size: $font-size-md;
    color: $color-text-sub;
    margin-top: $space-md;
  }
}
</style>
