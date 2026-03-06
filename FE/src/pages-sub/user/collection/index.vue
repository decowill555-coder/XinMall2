﻿﻿﻿<template>
  <view class="collection-page">
    <ui-sub-navbar title="我的收藏" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="collection-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="collection-content">
        <ui-empty v-if="collectionList.length === 0" icon="heart" text="暂无收藏" />
      
        <view v-else class="collection-list">
          <ui-goods-list-item 
            v-for="item in collectionList" 
            :key="item.id"
            :cover="item.cover"
            :title="item.title"
            :tags="getTags(item.tags)"
            :price="item.price"
            :time="item.collectTime"
            image-size="180rpx"
            @click="goDetail(item)"
          >
            <template #right>
              <view class="item-action" @click.stop="cancelCollect(item)">
                <ui-icon name="heart-fill" :size="40" color="#FF3D00" />
              </view>
            </template>
          </ui-goods-list-item>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useCollectionStore } from '@/stores';
import { formatTimeAgo } from '@/utils/date';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const collectionStore = useCollectionStore();

const activeTab = ref(0);

const tabList = ref([
  { name: '商品' },
  { name: '帖子' }
]);

const collectionList = computed(() => {
  if (activeTab.value === 0) {
    return collectionStore.productCollections.map(item => ({
      id: item.id,
      targetId: item.targetId,
      cover: item.cover,
      title: item.title,
      price: item.price,
      tags: item.tags,
      collectTime: formatTimeAgo(item.createdAt)
    }));
  }
  return collectionStore.topicCollections.map(item => ({
    id: item.id,
    targetId: item.targetId,
    cover: item.cover,
    title: item.title,
    price: item.price,
    tags: item.tags,
    collectTime: formatTimeAgo(item.createdAt)
  }));
});

const getTags = (tags?: string[]) => {
  if (!tags) return [];
  return tags.slice(0, 2).map(tag => ({ text: tag, type: 'primary' as const }));
};

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.targetId}` });
};

const cancelCollect = (item: any) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        collectionStore.removeCollection(item.targetId, activeTab.value === 0 ? 'product' : 'topic');
        uni.showToast({ title: '已取消收藏', icon: 'success' });
      }
    }
  });
};
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
</style>
