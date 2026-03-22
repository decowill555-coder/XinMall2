<template>
  <view class="post-manage-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="管理帖子">
      <template #right>
        <view class="create-btn" @click="goCreatePost">
          <ui-icon name="plus" :size="36" color="white" />
        </view>
      </template>
    </ui-sub-navbar>
    
    <scroll-view 
      scroll-y 
      class="content-scroll" 
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
    >
      <view class="scroll-content">
        <view class="filter-section">
          <view class="filter-tabs">
            <view 
              v-for="tab in filterTabs" 
              :key="tab.value"
              class="filter-tab"
              :class="{ 'is-active': activeFilter === tab.value }"
              @click="handleFilterChange(tab.value)"
            >
              <text>{{ tab.label }}</text>
            </view>
          </view>
        </view>
        
        <view class="post-list">
          <view 
            v-for="post in postsList" 
            :key="post.id" 
            class="post-card"
          >
            <view class="post-main" @click="goPostDetail(post)">
              <view class="post-header">
                <text class="post-time">{{ formatTimeAgo(post.createdAt) }}</text>
                <view v-if="post.isPinned" class="post-tag pinned">
                  <text>置顶</text>
                </view>
                <view v-if="post.isEssence" class="post-tag essence">
                  <text>精华</text>
                </view>
              </view>
              
              <text class="post-title">{{ post.title }}</text>
              <text class="post-content">{{ post.content }}</text>
              
              <view v-if="post.images?.length" class="post-images">
                <image 
                  v-for="(img, idx) in post.images.slice(0, 3)" 
                  :key="idx"
                  :src="img" 
                  class="post-image"
                  mode="aspectFill"
                />
              </view>
              
              <view class="post-footer">
                <view class="footer-item">
                  <ui-icon name="eye" :size="24" color="placeholder" />
                  <text>{{ post.viewCount || 0 }}</text>
                </view>
                <view class="footer-item">
                  <ui-icon name="heart" :size="24" color="placeholder" />
                  <text>{{ post.likeCount }}</text>
                </view>
                <view class="footer-item">
                  <ui-icon name="message-circle" :size="24" color="placeholder" />
                  <text>{{ post.commentCount }}</text>
                </view>
                <view class="footer-item">
                  <ui-icon name="star" :size="24" color="placeholder" />
                  <text>{{ post.collectCount }}</text>
                </view>
              </view>
            </view>
            
            <view class="post-actions">
              <view class="action-btn edit" @click="goEditPost(post)">
                <ui-icon name="edit" :size="28" color="primary" />
                <text>编辑</text>
              </view>
              <view class="action-btn delete" @click="handleDelete(post)">
                <ui-icon name="trash-2" :size="28" color="error" />
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
        
        <view v-if="isLoading" class="loading-more">
          <text>加载中...</text>
        </view>
        
        <view v-if="!hasMore && postsList.length > 0" class="no-more">
          <text>没有更多了</text>
        </view>
        
        <view v-if="!isLoading && postsList.length === 0" class="empty-state">
          <ui-icon name="file-text" :size="120" color="disabled" />
          <text class="empty-text">暂无帖子</text>
          <view class="empty-btn" @click="goCreatePost">
            <text>发布第一篇帖子</text>
          </view>
        </view>
        
        <view class="bottom-space"></view>
      </view>
    </scroll-view>
    
    <ui-modal 
      v-model:show="showDeleteModal"
      title="确认删除"
      content="确定要删除这篇帖子吗？删除后无法恢复。"
      @confirm="confirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { forumApi, type PostListItem } from '@/api/community';
import { formatTimeAgo } from '@/utils/date';
import { logError } from '@/utils/logger';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack, navigateTo } = useNavigation();

const filterTabs = ref([
  { label: '全部', value: 'all' },
  { label: '最新', value: 'new' },
  { label: '最热', value: 'hot' }
]);

const activeFilter = ref('all');
const postsList = ref<PostListItem[]>([]);
const isLoading = ref(false);
const isRefreshing = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 10;

const showDeleteModal = ref(false);
const deletePostId = ref<string | null>(null);

onLoad(() => {
  fetchPosts();
});

onShow(() => {
  fetchPosts(true);
});

const fetchPosts = async (refresh = false) => {
  if (isLoading.value) return;
  
  if (refresh) {
    currentPage.value = 1;
    hasMore.value = true;
  }
  
  isLoading.value = true;
  
  try {
    const result = await forumApi.getMyPosts(currentPage.value, pageSize);
    
    if (refresh) {
      postsList.value = result.list;
    } else {
      postsList.value = [...postsList.value, ...result.list];
    }
    
    hasMore.value = result.hasMore;
  } catch (error) {
    logError('获取帖子列表失败:', error);
    uni.showToast({
      title: '获取帖子列表失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const onRefresh = () => {
  isRefreshing.value = true;
  fetchPosts(true);
};

const loadMore = () => {
  if (!hasMore.value || isLoading.value) return;
  currentPage.value++;
  fetchPosts();
};

const handleFilterChange = (value: string) => {
  activeFilter.value = value;
  currentPage.value = 1;
  fetchPosts(true);
};

const handleDelete = (post: PostListItem) => {
  deletePostId.value = post.id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!deletePostId.value) return;
  
  try {
    await forumApi.deletePost(deletePostId.value);
    postsList.value = postsList.value.filter(p => p.id !== deletePostId.value);
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  } catch (error) {
    logError('删除帖子失败:', error);
    uni.showToast({
      title: '删除失败，请重试',
      icon: 'none'
    });
  } finally {
    deletePostId.value = null;
  }
};

const goCreatePost = () => {
  uni.navigateTo({ url: '/pages-sub/community/post/publish' });
};

const goEditPost = (post: PostListItem) => {
  uni.navigateTo({ url: `/pages-sub/user/post-manage/edit?id=${post.id}` });
};

const goPostDetail = (post: PostListItem) => {
  navigateTo(`/pages-sub/community/post/detail?id=${post.id}`);
};
</script>

<style lang="scss" scoped>
.post-manage-page {
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

.create-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-sunset;
  border-radius: 50%;
}

.content-scroll {
  position: relative;
  z-index: 1;
}

.filter-section {
  padding: $space-md;
}

.filter-tabs {
  display: flex;
  gap: $space-sm;
}

.filter-tab {
  padding: $space-sm $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-full;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  text {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    border-color: var(--color-primary, #FF6A00);
    
    text {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
  }
}

.post-list {
  padding: 0 $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.post-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  overflow: hidden;
}

.post-main {
  padding: $space-md;
}

.post-header {
  display: flex;
  align-items: center;
  gap: $space-xs;
  margin-bottom: $space-sm;
  
  .post-time {
    font-size: $font-size-xs;
    @include text-disabled;
  }
  
  .post-tag {
    font-size: $font-size-xs;
    padding: 2rpx 12rpx;
    border-radius: $radius-xs;
    
    &.pinned {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
      color: var(--color-primary, #FF6A00);
    }
    
    &.essence {
      background: var(--color-warning-glass, rgba(255, 149, 0, 0.12));
      color: var(--color-warning, #FF9500);
    }
  }
}

.post-title {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  @include text-main;
  margin-bottom: $space-xs;
  line-height: 1.4;
}

.post-content {
  font-size: $font-size-sm;
  @include text-sub;
  line-height: 1.6;
  @include text-ellipsis(2);
  margin-bottom: $space-sm;
}

.post-images {
  display: flex;
  gap: $space-xs;
  margin-bottom: $space-sm;
  
  .post-image {
    width: 160rpx;
    height: 120rpx;
    border-radius: $radius-md;
  }
}

.post-footer {
  display: flex;
  gap: $space-lg;
  padding-top: $space-sm;
  border-top: 1rpx solid $color-divider;
  
  [data-theme="dark"] & {
    border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }
  
  .footer-item {
    display: flex;
    align-items: center;
    gap: 4rpx;
    
    text {
      font-size: $font-size-xs;
      @include text-sub;
    }
  }
}

.post-actions {
  display: flex;
  border-top: 1rpx solid $color-divider;
  
  [data-theme="dark"] & {
    border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }
  
  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    padding: $space-md;
    
    text {
      font-size: $font-size-sm;
    }
    
    &.edit {
      text {
        color: var(--color-primary, #FF6A00);
      }
    }
    
    &.delete {
      text {
        color: $color-error;
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
    @include text-disabled;
  }
}

.empty-state {
  @include flex-column-center;
  padding: 120rpx 0;
  
  .empty-text {
    font-size: $font-size-md;
    @include text-sub;
    margin-top: $space-md;
  }
  
  .empty-btn {
    margin-top: $space-lg;
    padding: $space-sm $space-xl;
    background: $gradient-sunset;
    border-radius: $radius-full;
    
    text {
      font-size: $font-size-sm;
      color: $color-white;
      font-weight: $font-weight-medium;
    }
  }
}

.bottom-space {
  height: 60rpx;
}
</style>
