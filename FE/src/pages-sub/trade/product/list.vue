<template>
  <view class="product-list-page">
    <ui-sub-navbar title="商品列表" />

    <view class="filter-bar">
      <ui-tabs v-model="sortType" :list="sortList" type="line" @change="onSortChange" />
    </view>

    <scroll-view scroll-y class="product-scroll" @scrolltolower="loadMore">
      <!-- 加载状态 -->
      <view v-if="loading && productList.length === 0" class="loading-state">
        <text>加载中...</text>
      </view>

      <!-- 错误状态 -->
      <view v-else-if="error && productList.length === 0" class="error-state">
        <text>{{ error }}</text>
        <view class="retry-btn" @click="fetchData">重试</view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading && productList.length === 0" class="empty-state">
        <text>暂无商品</text>
      </view>

      <!-- 商品列表 -->
      <view v-else class="product-grid">
        <view
          v-for="item in productList"
          :key="item.id"
          class="product-item"
          @click="goDetail(item)"
        >
          <ui-image :src="item.cover" width="100%" height="340rpx" radius="12rpx" />
          <view class="product-info">
            <text class="product-title">{{ item.name }}</text>
            <view class="product-meta">
              <text class="brand-name">{{ item.brandName }}</text>
              <text class="device-type">{{ item.deviceTypeName }}</text>
            </view>
            <view class="product-tags">
              <ui-tag v-for="tag in item.tags?.slice(0, 2)" :key="tag" type="primary" size="sm">{{ tag }}</ui-tag>
            </view>
            <view class="product-bottom">
              <ui-price :value="item.priceRange.min" type="main" :size="40" />
              <text class="sales">{{ item.productCount }}件在售</text>
            </view>
          </view>
        </view>
      </view>

      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="!hasMore">没有更多了</text>
        <text v-else>上拉加载更多</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { spuApi, type SpuListItem } from '@/api/spu';

// 获取页面参数
const props = defineProps<{
  deviceTypeId?: string;
  brandId?: string;
  keyword?: string;
}>();

// 获取URL参数
const getPageParams = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).options || {};
  return {
    deviceTypeId: options.deviceTypeId as string | undefined,
    brandId: options.brandId as string | undefined,
    keyword: options.keyword as string | undefined
  };
};

const sortType = ref(0);
const loading = ref(false);
const error = ref('');
const hasMore = ref(true);
const page = ref(1);
const pageSize = 10;

const sortList = ref([
  { name: '综合', value: 'hot' },
  { name: '最新', value: 'new' },
  { name: '销量', value: 'product_count' }
]);

const productList = ref<SpuListItem[]>([]);

// 筛选参数
const filterParams = ref<{
  deviceTypeId?: string;
  brandId?: string;
  keyword?: string;
}>({});

// 获取排序值
const getSortValue = (): 'hot' | 'new' | 'product_count' | undefined => {
  const sortOptions: ('hot' | 'new' | 'product_count')[] = ['hot', 'new', 'product_count'];
  return sortOptions[sortType.value];
};

// 获取数据
const fetchData = async (isRefresh = false) => {
  if (loading.value) return;

  loading.value = true;
  error.value = '';

  if (isRefresh) {
    page.value = 1;
    productList.value = [];
    hasMore.value = true;
  }

  try {
    const params = getPageParams();
    filterParams.value = {
      deviceTypeId: params.deviceTypeId,
      brandId: params.brandId,
      keyword: params.keyword
    };

    const result = await spuApi.getSpuList({
      deviceTypeId: filterParams.value.deviceTypeId,
      brandId: filterParams.value.brandId,
      keyword: filterParams.value.keyword,
      sort: getSortValue(),
      page: page.value,
      pageSize: pageSize
    });

    if (isRefresh) {
      productList.value = result.list;
    } else {
      productList.value = [...productList.value, ...result.list];
    }

    hasMore.value = result.hasMore;

    if (result.list.length > 0) {
      page.value++;
    }
  } catch (err: any) {
    console.error('获取商品列表失败:', err);
    error.value = err.message || '加载失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 排序切换
const onSortChange = () => {
  fetchData(true);
};

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  fetchData();
};

// 跳转详情页
const goDetail = (item: SpuListItem) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};

// 页面加载时获取数据
onMounted(() => {
  fetchData(true);
});
</script>

<style lang="scss" scoped>
.product-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.product-scroll {
  height: calc(100vh - 88rpx - 88rpx);
  padding: $space-sm $space-md;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-xl;
  color: $color-text-disabled;
  font-size: $font-size-sm;
}

.error-state {
  .retry-btn {
    margin-top: $space-md;
    padding: $space-sm $space-lg;
    background: $color-primary;
    color: $color-white;
    border-radius: $radius-md;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-sm;
}

.product-item {
  background: $color-white;
  border-radius: $radius-md;
  overflow: hidden;

  .product-info {
    padding: $space-sm;
  }

  .product-title {
    font-size: $font-size-sm;
    color: $color-text-main;
    line-height: 1.4;
    @include text-ellipsis(2);
  }

  .product-meta {
    display: flex;
    gap: $space-xs;
    margin: $space-xs 0;
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  .product-tags {
    display: flex;
    gap: $space-xs;
    margin: $space-xs 0;
  }

  .product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sales {
      font-size: $font-size-xs;
      color: $color-text-disabled;
    }
  }
}

.load-more {
  text-align: center;
  padding: $space-lg;
  font-size: $font-size-sm;
  color: $color-text-disabled;
}
</style>
