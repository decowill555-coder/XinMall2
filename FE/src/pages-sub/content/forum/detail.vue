<template>
  <view class="forum-detail-page" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
    <view class="forum-header page-header">
      <view class="back-btn" @click="goBack">
        <ui-icon name="arrow-left" :size="40" />
      </view>
      <text class="header-title">{{ forum?.name || '论坛' }}</text>
      <view class="header-right">
        <view class="share-btn" @click="handleShare">
          <ui-icon name="share-2" :size="40" />
        </view>
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="forum-scroll"
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="forum-info">
        <view class="forum-cover">
          <ui-image 
            :src="forum?.cover || 'https://picsum.photos/200/200?random=forum'" 
            width="160rpx" 
            height="160rpx" 
            radius="16rpx" 
          />
        </view>
        <view class="forum-detail">
          <text class="forum-name">{{ forum?.name }}</text>
          <text class="forum-desc">{{ forum?.description || '暂无描述' }}</text>
          <view class="forum-stats">
            <view class="stat-item">
              <text class="stat-value">{{ formatCount(forum?.memberCount || 0) }}</text>
              <text class="stat-label">成员</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value">{{ formatCount(forum?.postCount || 0) }}</text>
              <text class="stat-label">帖子</text>
            </view>
          </view>
        </view>
        <view class="join-btn" :class="{ 'is-joined': forum?.isJoined }" @click="handleJoin">
          <text>{{ forum?.isJoined ? '已加入' : '加入' }}</text>
        </view>
      </view>
      
      <view class="forum-type-tag" v-if="forum?.type">
        <text :class="{ 'is-model': forum.type === 'model' }">
          {{ forum.type === 'model' ? '型号论坛' : '用户论坛' }}
        </text>
      </view>
      
      <view class="post-list">
        <view class="list-header">
          <text class="list-title">最新帖子</text>
        </view>
        
        <view v-if="posts.length === 0 && !loading" class="empty-posts">
          <text>暂无帖子，快来发布第一篇吧！</text>
        </view>
        
        <view 
          v-for="post in posts" 
          :key="post.id" 
          class="post-item"
          @click="goPostDetail(post)"
        >
          <view class="post-author">
            <ui-avatar :src="post.authorAvatar" :size="64" />
            <view class="author-info">
              <text class="author-name">{{ post.authorName }}</text>
              <text class="post-time">{{ formatTime(post.createdAt) }}</text>
            </view>
          </view>
          <text class="post-title">{{ post.title }}</text>
          <text class="post-content">{{ post.content }}</text>
          <view v-if="post.images?.length" class="post-images">
            <ui-image 
              v-for="(img, idx) in post.images.slice(0, 3)" 
              :key="idx"
              :src="img" 
              width="200rpx" 
              height="200rpx" 
              radius="8rpx"
            />
          </view>
          <view class="post-actions">
            <view class="action-item">
              <ui-icon name="heart" :size="32" color="#A1A1A6" />
              <text>{{ post.likeCount }}</text>
            </view>
            <view class="action-item">
              <ui-icon name="message-circle" :size="32" color="#A1A1A6" />
              <text>{{ post.commentCount }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="loading" class="loading-more">
          <text>加载中...</text>
        </view>
        
        <view v-if="!hasMore && posts.length > 0" class="no-more">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
    
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="trade-btn" @click="goTrade">
        <ui-icon name="shopping-bag" :size="36" color="#FFFFFF" />
        <text>交易</text>
      </view>
      <view class="post-btn" @click="goPublish">
        <ui-icon name="edit-3" :size="36" />
        <text>发帖</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useForumStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import type { ForumDetail, ForumPost } from '@/api/forum';

const appStore = useAppStore();
const forumStore = useForumStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);
const isH5 = computed(() => appStore.isH5);
const headerExtraTop = computed(() => isH5.value ? 12 : 0);

const forumId = ref('');
const forum = computed(() => forumStore.currentForum);
const posts = computed(() => forumStore.forumPosts);
const loading = computed(() => forumStore.postsLoading);
const hasMore = computed(() => forumStore.hasMorePosts);
const scrollHeight = ref(0);

onMounted(() => {
  nextTick(() => {
    calcLayout();
  });
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  const bottomBarHeight = rpxToPx(100) + safeAreaBottom.value;
  
  scrollHeight.value = systemInfo.windowHeight - rpxToPx(100) - safeAreaTop.value - headerExtraTop.value - bottomBarHeight;
};

onLoad(async (options: any) => {
  if (options.id) {
    forumId.value = options.id;
    await forumStore.fetchForumDetail(options.id);
    await forumStore.fetchForumPosts(options.id, true);
  }
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const formatTime = (time: string): string => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const handleJoin = async () => {
  if (!forumId.value) return;
  
  if (forum.value?.isJoined) {
    await forumStore.leaveForum(forumId.value);
  } else {
    await forumStore.joinForum(forumId.value);
  }
};

const handleShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

const loadMore = async () => {
  if (!forumId.value || loading.value || !hasMore.value) return;
  await forumStore.fetchForumPosts(forumId.value);
};

const goBack = () => {
  smartBack();
};

const goPostDetail = (post: ForumPost) => {
  navigateTo(`/pages-sub/content/post/detail?id=${post.id}`);
};

const goTrade = () => {
  if (forum.value?.modelId) {
    navigateTo(`/pages-sub/search/result?modelId=${forum.value.modelId}&keyword=${encodeURIComponent(forum.value.modelName || '')}`);
  } else {
    navigateTo(`/pages-sub/search/result?keyword=${encodeURIComponent(forum.value?.name || '')}`);
  }
};

const goPublish = () => {
  navigateTo(`/pages-sub/content/post/publish?forumId=${forumId.value}`);
};
</script>

<style lang="scss" scoped>
.forum-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.forum-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  .header-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    @include text-ellipsis(1);
  }
  
  .back-btn, .share-btn {
    padding: $space-xs;
  }
}

.forum-scroll {
  padding-bottom: 120rpx;
}

.forum-info {
  display: flex;
  align-items: flex-start;
  gap: $space-md;
  padding: $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin: $space-md;
  border-radius: $radius-lg;
  
  .forum-detail {
    flex: 1;
    min-width: 0;
    
    .forum-name {
      display: block;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
      margin-bottom: $space-xs;
    }
    
    .forum-desc {
      display: block;
      font-size: $font-size-sm;
      color: $color-text-sub;
      @include text-ellipsis(2);
      margin-bottom: $space-sm;
    }
  }
  
  .join-btn {
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    border-radius: $radius-btn;
    padding: $space-sm $space-lg;
    
    text {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: #FFFFFF;
    }
    
    &.is-joined {
      background: var(--color-bg-gray, #F5F5F7);
      
      text {
        color: $color-text-sub;
      }
    }
  }
}

.forum-stats {
  display: flex;
  align-items: center;
  gap: $space-md;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-value {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
    
    .stat-label {
      font-size: $font-size-xs;
      color: $color-text-sub;
    }
  }
  
  .stat-divider {
    width: 1rpx;
    height: 40rpx;
    background: var(--color-divider, rgba(0, 0, 0, 0.06));
  }
}

.forum-type-tag {
  margin: 0 $space-md $space-md;
  
  text {
    font-size: $font-size-xs;
    color: #5856D6;
    background: rgba(88, 86, 214, 0.1);
    padding: 4rpx 16rpx;
    border-radius: $radius-xs;
    
    &.is-model {
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    }
  }
}

.post-list {
  padding: 0 $space-md;
  
  .list-header {
    margin-bottom: $space-md;
    
    .list-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
  }
}

.empty-posts {
  padding: $space-xl;
  text-align: center;
  
  text {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.post-item {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-md;
  
  .post-author {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-sm;
    
    .author-info {
      .author-name {
        display: block;
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
      }
      
      .post-time {
        font-size: $font-size-xs;
        color: $color-text-sub;
      }
    }
  }
  
  .post-title {
    display: block;
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-xs;
  }
  
  .post-content {
    display: block;
    font-size: $font-size-sm;
    color: $color-text-sub;
    @include text-ellipsis(3);
    margin-bottom: $space-sm;
  }
  
  .post-images {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-sm;
  }
  
  .post-actions {
    display: flex;
    gap: $space-lg;
    
    .action-item {
      display: flex;
      align-items: center;
      gap: $space-xs;
      
      text {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  
  .trade-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    border-radius: $radius-btn;
    padding: $space-md;
    
    text {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: #FFFFFF;
    }
  }
  
  .post-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    background: var(--color-bg-gray, #F5F5F7);
    border-radius: $radius-btn;
    padding: $space-md;
    
    text {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
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
