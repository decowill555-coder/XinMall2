﻿<template>
  <view class="collection-page">
    <ui-sub-navbar title="我的收藏" />

    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>

    <scroll-view scroll-y class="collection-scroll" :style="{ height: scrollHeight + 'px' }" @scrolltolower="loadMore">
      <view class="collection-content">
        <ui-empty v-if="collectionList.length === 0 && !loading" icon="heart" text="暂无收藏" />

        <view v-else class="collection-list">
          <!-- 商品收藏 -->
          <template v-if="activeTab === 0">
            <ui-goods-list-item
              v-for="item in collectionList"
              :key="item.id"
              :cover="item.cover || (item.images && item.images[0])"
              :title="item.title"
              :price="item.price"
              :time="item.collectTime"
              image-size="180rpx"
              @click="goDetail(item)"
            >
              <template #right>
                <view class="item-action" @click.stop="cancelCollect(item)">
                  <ui-icon name="heart-fill" :size="40" color="error" />
                </view>
              </template>
            </ui-goods-list-item>
          </template>

          <!-- 帖子收藏 -->
          <template v-else>
            <view
              v-for="item in collectionList"
              :key="item.id"
              class="post-item"
              @click="goDetail(item)"
            >
              <view class="post-content">
                <text class="post-title">{{ item.title }}</text>
                <text class="post-time">{{ item.collectTime }}</text>
              </view>
              <view class="post-image" v-if="item.images && item.images.length > 0">
                <image :src="item.images[0]" mode="aspectFill" />
              </view>
              <view class="item-action" @click.stop="cancelCollect(item)">
                <ui-icon name="heart-fill" :size="40" color="error" />
              </view>
            </view>
          </template>
        </view>

        <view v-if="loading" class="loading-tip">
          <text>加载中...</text>
        </view>

        <view v-else-if="!hasMore && collectionList.length > 0" class="no-more-tip">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { collectionApi, CollectionType, type CollectionItem } from '@/api/collection';
import { formatTimeAgo } from '@/utils/date';
import { logError } from '@/utils/logger';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const activeTab = ref(0);

const tabList = ref([
  { name: '商品' },
  { name: '帖子' }
]);

interface DisplayItem extends CollectionItem {
  collectTime: string;
}

const collectionList = ref<DisplayItem[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;

const targetType = computed(() => {
  return activeTab.value === 0 ? CollectionType.GOODS : CollectionType.POST;
});

const fetchCollections = async (isRefresh = false) => {
  if (loading.value) return;

  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
    collectionList.value = [];
  }

  loading.value = true;
  try {
    const res = await collectionApi.getMyCollections(targetType.value, currentPage.value, pageSize);

    const newItems: DisplayItem[] = (res.records || []).map(item => ({
      ...item,
      collectTime: formatTimeAgo(item.createdAt)
    }));

    if (isRefresh) {
      collectionList.value = newItems;
    } else {
      collectionList.value = [...collectionList.value, ...newItems];
    }

    hasMore.value = currentPage.value < res.pages;
  } catch (error) {
    logError('获取收藏列表失败:', error);
    uni.showToast({ title: '获取收藏列表失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  currentPage.value++;
  fetchCollections();
};

const goDetail = (item: DisplayItem) => {
  if (activeTab.value === 0) {
    uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.productId}` });
  } else {
    uni.navigateTo({ url: `/pages-sub/community/post/detail?id=${item.productId}` });
  }
};

const cancelCollect = (item: DisplayItem) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await collectionApi.remove({
            targetId: item.productId,
            targetType: targetType.value
          });

          // 从列表中移除
          const index = collectionList.value.findIndex(c => c.id === item.id);
          if (index > -1) {
            collectionList.value.splice(index, 1);
          }

          uni.showToast({ title: '已取消收藏', icon: 'success' });
        } catch (error) {
          logError('取消收藏失败:', error);
          uni.showToast({ title: '取消收藏失败', icon: 'none' });
        }
      }
    }
  });
};

// 监听 tab 切换
watch(activeTab, () => {
  fetchCollections(true);
});

// 页面显示时刷新数据
onShow(() => {
  fetchCollections(true);
});
</script>

<style lang="scss" scoped>
.collection-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.collection-scroll {
  overflow: hidden;
}

.collection-content {
  padding: $space-sm $space-md;
}

.collection-list {
  .item-action {
    padding: $space-sm;
    display: flex;
    align-items: center;
  }
}

.post-item {
  display: flex;
  align-items: center;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;

  .post-content {
    flex: 1;
    overflow: hidden;

    .post-title {
      display: block;
      font-size: $font-size-md;
      color: $color-text-main;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .post-time {
      display: block;
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
  }

  .post-image {
    width: 120rpx;
    height: 120rpx;
    margin-left: $space-sm;
    border-radius: $radius-sm;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.loading-tip,
.no-more-tip {
  text-align: center;
  padding: $space-md;
  color: $color-text-sub;
  font-size: $font-size-sm;
}
</style>
