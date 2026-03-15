<template>
  <view class="follow-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <view class="page-header" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
      <view class="header-content">
        <text class="header-title">关注</text>
        <text class="header-subtitle">你关注的人发布的动态</text>
      </view>
    </view>
    
    <view class="page-content" :style="{ paddingTop: headerHeight + 'px' }">
      <scroll-view scroll-y class="content-scroll" :style="{ height: scrollHeight + 'px' }" @scrolltolower="loadMore">
        <view class="content">
          <view class="feed-list" v-if="feedList.length > 0">
            <ui-waterfalls :list="feedList" :columns="2" :gap="12">
              <template #item="{ item }">
                <ui-goods-card 
                  :data="item" 
                  mode="waterfall" 
                  @click="handleItemClick" 
                  @user-click="goUser" 
                />
              </template>
            </ui-waterfalls>
          </view>
          <view class="empty-state" v-else-if="!loading">
            <text class="empty-text">暂无关注的动态</text>
            <text class="empty-hint">去关注一些用户和商品吧</text>
          </view>

          <view class="load-more" v-if="feedList.length > 0">
            <ui-divider :text="loading ? '加载中...' : (hasMore ? '上拉加载更多' : '没有更多了')" />
          </view>
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar current="follow" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { forumApi, type PostListItem } from '@/api/community';
import { spuApi } from '@/api';

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

const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
  hasTabbar: true,
  headerSelector: '.page-header',
  headerEstimatedHeight: 120
});

const loading = ref(false);
const feedList = ref<FeedItem[]>([]);
const currentPage = ref(1);
const hasMore = ref(true);
const pageSize = 10;

const fetchFeed = async (page: number = 1) => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const [postsResult, spusResult] = await Promise.all([
      forumApi.getFollowedPosts(page, pageSize),
      spuApi.getFollowedSpus(page, pageSize)
    ]);
    
    const postItems: FeedItem[] = (postsResult?.records || []).map((item: PostListItem) => ({
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
    
    const spuItems: FeedItem[] = (spusResult?.records || []).map((item: any) => ({
      id: item.id,
      cover: item.cover || '',
      title: item.name || '',
      price: item.priceMin || item.priceMax,
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
    const postHasMore = postsResult ? postsResult.current < postsResult.pages : false;
    const spuHasMore = spusResult ? spusResult.current < spusResult.pages : false;
    hasMore.value = postHasMore || spuHasMore;
  } catch (error) {
    console.error('获取关注数据失败:', error);
    if (page === 1) {
      feedList.value = [];
    }
  } finally {
    loading.value = false;
  }
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

const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  fetchFeed(currentPage.value + 1);
};

onMounted(() => {
  fetchFeed(1);
});
</script>

<style lang="scss" scoped>
.follow-page {
  @include page-gradient-bg;
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
    top: 200rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-card;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-bottom: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.header-content {
  padding: $space-lg $space-md;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.header-title {
  font-size: $font-size-xxl;
  font-weight: $font-weight-bold;
  @include text-main;
  letter-spacing: 2rpx;
}

.header-subtitle {
  font-size: $font-size-sm;
  @include text-sub;
  margin-top: $space-xs;
}

.page-content {
  padding-bottom: 0;
  position: relative;
  z-index: 1;
}

.content-scroll {
  overflow: hidden;
}

.content {
  padding: $space-md;
}

.feed-list {
  box-sizing: border-box;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx $space-md;
}

.empty-text {
  font-size: $font-size-lg;
  @include text-main;
  margin-bottom: $space-sm;
}

.empty-hint {
  font-size: $font-size-sm;
  @include text-sub;
}

.load-more {
  padding: $space-md 0;
  
  :deep(.ui-divider) {
    @include text-sub;
  }
}
</style>
