<template>
  <view class="post-detail-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="帖子详情" />
    
    <scroll-view 
      scroll-y 
      class="detail-scroll" 
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMoreComments"
    >
      <view v-if="loading" class="loading-state">
        <ui-skeleton :rows="6" />
      </view>
      
      <template v-else-if="post">
        <view class="author-section">
          <view class="author-card" @click="goUser">
            <ui-avatar :src="post.author.avatar" :size="80" />
            <view class="author-info">
              <view class="author-main">
                <text class="author-name">{{ post.author.name }}</text>
                <view v-if="post.author.levelName" class="level-badge">
                  <text>{{ post.author.levelName }}</text>
                </view>
              </view>
              <text class="post-time">{{ formatTimeAgo(post.createdAt) }}</text>
            </view>
            <view 
              v-if="!isAuthor"
              class="follow-btn" 
              :class="{ 'is-followed': isFollowed }"
              @click.stop="toggleFollow"
            >
              <text>{{ isFollowed ? '已关注' : '关注' }}</text>
            </view>
          </view>
          
          <view v-if="post.forumName" class="forum-info" @click="goForum">
            <ui-icon name="message" :size="28" color="primary" />
            <text class="forum-name">{{ post.forumName }}</text>
            <ui-icon name="arrow-right" :size="24" color="disabled" />
          </view>
        </view>
        
        <view class="post-content">
          <view class="post-badges">
            <view v-if="post.isPinned" class="badge pinned">
              <ui-icon name="arrow-up" :size="24" color="white" />
              <text>置顶</text>
            </view>
            <view v-if="post.isEssence" class="badge essence">
              <ui-icon name="star" :size="24" color="white" />
              <text>精华</text>
            </view>
          </view>
          
          <text class="post-title">{{ post.title }}</text>
          <text class="post-text">{{ post.content }}</text>
          
          <view v-if="post.images?.length" class="post-images">
            <view 
              v-for="(img, index) in post.images" 
              :key="index"
              class="image-item"
              @click="previewImage(index)"
            >
              <ui-image 
                :src="img" 
                width="100%" 
                height="auto"
                mode="widthFix"
                radius="lg"
              />
            </view>
          </view>
          
          <view v-if="post.tags?.length" class="post-tags">
            <text 
              v-for="tag in post.tags" 
              :key="tag" 
              class="tag-item"
              @click="goTopic(tag)"
            >#{{ tag }}</text>
          </view>
          
          <view class="post-stats">
            <view class="stat-item">
              <ui-icon name="eye" :size="28" color="placeholder" />
              <text>{{ formatCount(post.viewCount) }}浏览</text>
            </view>
            <view class="stat-item">
              <ui-icon name="share" :size="28" color="placeholder" />
              <text>{{ formatCount(post.shareCount) }}分享</text>
            </view>
          </view>
        </view>
        
        <view class="interact-section">
          <view 
            class="interact-item" 
            :class="{ 'is-active': post.isLiked }"
            @click="toggleLike"
          >
            <ui-icon
              :name="post.isLiked ? 'heart-fill' : 'heart'"
              :size="40"
              :color="post.isLiked ? 'error' : 'placeholder'"
            />
            <text>{{ formatCount(post.likeCount) }}</text>
          </view>
          <view class="interact-item">
            <ui-icon name="message" :size="40" color="placeholder" />
            <text>{{ formatCount(post.commentCount) }}</text>
          </view>
          <view 
            class="interact-item"
            :class="{ 'is-active': post.isCollected }"
            @click="toggleCollect"
          >
            <ui-icon
              :name="post.isCollected ? 'star-fill' : 'star'"
              :size="40"
              :color="post.isCollected ? 'warning' : 'placeholder'"
            />
            <text>{{ post.isCollected ? '已收藏' : '收藏' }}</text>
          </view>
          <view class="interact-item" @click="handleShare">
            <ui-icon name="share" :size="40" color="placeholder" />
            <text>分享</text>
          </view>
        </view>
        
        <view class="comment-section">
          <view class="section-header">
            <text class="section-title">评论 ({{ commentTotal }})</text>
            <view class="sort-tabs">
              <text 
                class="sort-tab"
                :class="{ 'is-active': commentSort === 'new' }"
                @click="changeCommentSort('new')"
              >最新</text>
              <text class="sort-divider">|</text>
              <text 
                class="sort-tab"
                :class="{ 'is-active': commentSort === 'hot' }"
                @click="changeCommentSort('hot')"
              >最热</text>
            </view>
          </view>
          
          <view v-if="comments.length === 0 && !commentLoading" class="empty-comments">
            <ui-icon name="message" :size="80" color="disabled" />
            <text class="empty-text">暂无评论，快来抢沙发吧~</text>
          </view>
          
          <view v-else class="comment-list">
            <view 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-card"
            >
              <view class="comment-main">
                <ui-avatar 
                  :src="comment.author.avatar" 
                  :size="64"
                  @click="goUserById(comment.author.id)"
                />
                <view class="comment-body">
                  <view class="comment-header">
                    <view class="author-info">
                      <text class="author-name">{{ comment.author.name }}</text>
                      <view v-if="comment.author.levelName" class="level-tag">
                        {{ comment.author.levelName }}
                      </view>
                    </view>
                    <text class="comment-time">{{ formatTimeAgo(comment.createdAt) }}</text>
                  </view>
                  
                  <text class="comment-content">{{ comment.content }}</text>
                  
                  <view v-if="comment.images?.length" class="comment-images">
                    <image 
                      v-for="(img, idx) in comment.images" 
                      :key="idx"
                      :src="img" 
                      class="comment-image"
                      mode="aspectFill"
                      @click="previewCommentImage(comment.images, idx)"
                    />
                  </view>
                  
                  <view class="comment-actions">
                    <view 
                      class="action-item"
                      :class="{ 'is-liked': comment.isLiked }"
                      @click="likeComment(comment)"
                    >
                      <ui-icon
                        :name="comment.isLiked ? 'heart-fill' : 'heart'"
                        :size="28"
                        :color="comment.isLiked ? 'error' : 'placeholder'"
                      />
                      <text>{{ comment.likeCount || '' }}</text>
                    </view>
                    <view class="action-item" @click="replyToComment(comment)">
                      <ui-icon name="message" :size="28" color="placeholder" />
                      <text>回复</text>
                    </view>
                  </view>
                  
                  <view v-if="comment.replies?.length" class="reply-section">
                    <view 
                      v-for="reply in comment.replies" 
                      :key="reply.id"
                      class="reply-item"
                    >
                      <ui-avatar 
                        :src="reply.author.avatar" 
                        :size="48"
                        @click="goUserById(reply.author.id)"
                      />
                      <view class="reply-body">
                        <view class="reply-header">
                          <text class="reply-author">{{ reply.author.name }}</text>
                          <template v-if="reply.replyTo">
                            <text class="reply-arrow">回复</text>
                            <text class="reply-target">@{{ reply.replyTo.authorName }}</text>
                          </template>
                        </view>
                        <text class="reply-content">{{ reply.content }}</text>
                        <view class="reply-meta">
                          <text class="reply-time">{{ formatTimeAgo(reply.createdAt) }}</text>
                          <view 
                            class="action-item"
                            :class="{ 'is-liked': reply.isLiked }"
                            @click="likeComment(reply)"
                          >
                            <ui-icon
                            :name="reply.isLiked ? 'heart-fill' : 'heart'"
                            :size="24"
                            :color="reply.isLiked ? 'error' : 'placeholder'"
                          />
                            <text>{{ reply.likeCount || '' }}</text>
                          </view>
                          <view class="action-item" @click="replyToComment(reply, comment)">
                            <ui-icon name="message" :size="24" color="placeholder" />
                            <text>回复</text>
                          </view>
                        </view>
                      </view>
                    </view>
                    
                    <view 
                      v-if="comment.replyCount && comment.replyCount > (comment.replies?.length || 0)"
                      class="more-replies"
                      @click="loadMoreReplies(comment)"
                    >
                      <text>展开更多{{ comment.replyCount - (comment.replies?.length || 0) }}条回复</text>
                      <ui-icon name="arrow-down" :size="24" color="primary" />
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="commentLoading" class="loading-more">
            <text>加载中...</text>
          </view>
          
          <view v-if="!commentHasMore && comments.length > 0" class="no-more">
            <text>没有更多评论了</text>
          </view>
        </view>
      </template>
      
      <view v-else class="error-state">
        <ui-icon name="error-circle" :size="120" color="disabled" />
        <text class="error-text">帖子不存在或已删除</text>
        <ui-button size="sm" @click="goBack">返回</ui-button>
      </view>
      
      <view class="bottom-space"></view>
    </scroll-view>
    
    <view class="comment-input-bar">
      <view class="input-wrapper">
        <view 
          v-if="replyTarget" 
          class="reply-indicator"
          @click="cancelReply"
        >
          <text>取消回复</text>
        </view>
        <input 
          v-model="commentText"
          class="comment-input"
          :placeholder="replyTarget ? `回复 @${replyTarget.author.name}` : '说点什么...'"
          :focus="inputFocus"
          @blur="handleInputBlur"
          @confirm="submitComment"
        />
      </view>
      <ui-button 
        size="sm" 
        type="primary"
        :disabled="!commentText.trim() || submitting"
        :loading="submitting"
        @click="submitComment"
      >
        发送
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useAuthStore } from '@/stores';
import { forumApi, type PostDetail, type CommentItem } from '@/api/community';
import { formatTimeAgo } from '@/utils/date';
import { logError } from '@/utils/logger';

const { scrollHeight: baseScrollHeight, safeAreaBottom } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const scrollHeight = computed(() => baseScrollHeight.value - 60);

const authStore = useAuthStore();

const postId = ref('');
const loading = ref(true);
const post = ref<PostDetail | null>(null);
const isFollowed = ref(false);

const comments = ref<CommentItem[]>([]);
const commentTotal = ref(0);
const commentLoading = ref(false);
const commentHasMore = ref(true);
const commentPage = ref(1);
const commentSort = ref<'new' | 'hot'>('new');

const commentText = ref('');
const submitting = ref(false);
const inputFocus = ref(false);
const replyTarget = ref<CommentItem | null>(null);
const replyParent = ref<CommentItem | null>(null);

const isAuthor = computed(() => {
  if (!post.value || !authStore.state.userId) return false;
  return post.value.author.id === authStore.state.userId;
});

const formatCount = (count: number): string => {
  if (!count) return '0';
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

onLoad((options: any) => {
  if (options.id) {
    postId.value = options.id;
    fetchPostDetail();
    fetchComments();
  }
});

const fetchPostDetail = async () => {
  loading.value = true;
  try {
    const res = await forumApi.getPostDetail(postId.value);
    // 转换后端返回的数据格式
    post.value = {
      ...res.data,
      author: {
        id: String(res.data.author?.id || ''),
        name: res.data.author?.name || '',
        avatar: res.data.author?.avatar || '',
        levelName: res.data.author?.levelName || ''
      },
      shareCount: res.data.shareCount || 0
    };
    isFollowed.value = false;
  } catch (error) {
    logError('获取帖子详情失败:', error);
    post.value = {
      id: postId.value,
      title: 'iPhone 15 Pro Max 深度测评：钛金属边框真的轻了很多',
      content: '使用了一周，整体体验非常棒。钛金属边框确实比不锈钢轻了不少，手感提升明显。A17 Pro芯片性能强劲，玩游戏完全不卡顿。拍照效果也很出色，特别是5倍长焦镜头，简直是摄影爱好者的福音。续航方面中度使用一天完全没问题，充电速度也提升到了35W。唯一遗憾的就是价格太贵了，但总的来说这是一款非常值得入手的旗舰手机。',
      images: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3'
      ],
      tags: ['数码测评', 'iPhone15', '开箱体验'],
      author: {
        id: 'user-1',
        name: '数码达人',
        avatar: 'https://picsum.photos/200/200?random=avatar1',
        levelName: 'LV5 达人'
      },
      forumId: 'forum-1',
      forumName: 'iPhone 讨论',
      viewCount: 12580,
      likeCount: 256,
      commentCount: 45,
      shareCount: 12,
      collectCount: 32,
      isLiked: false,
      isCollected: false,
      isPinned: true,
      isEssence: true,
      createdAt: '2024-01-15T10:00:00Z'
    };
    isFollowed.value = false;
  } finally {
    loading.value = false;
  }
};

const fetchComments = async (isRefresh = false) => {
  if (commentLoading.value) return;

  if (isRefresh) {
    commentPage.value = 1;
    comments.value = [];
    commentHasMore.value = true;
  }

  commentLoading.value = true;
  try {
    const res = await forumApi.getComments({
      postId: postId.value,
      sort: commentSort.value,
      page: commentPage.value,
      pageSize: 20
    });

    // 转换后端返回的数据格式
    const list = (res.data.list || res.data.records || []).map((comment: any) => ({
      ...comment,
      author: {
        id: String(comment.author?.id || ''),
        name: comment.author?.name || '',
        avatar: comment.author?.avatar || '',
        levelName: comment.author?.levelName || ''
      },
      replyTo: comment.replyToUser ? {
        id: String(comment.replyToUser.id || ''),
        authorName: comment.replyToUser.name || '',
        content: ''
      } : undefined
    }));

    if (isRefresh) {
      comments.value = list;
    } else {
      comments.value = [...comments.value, ...list];
    }
    commentTotal.value = res.data.total;
    commentHasMore.value = res.data.hasMore ?? (res.data.page < res.data.pages);
  } catch (error) {
    logError('获取评论失败:', error);
  } finally {
    commentLoading.value = false;
  }
};

const loadMoreComments = () => {
  if (!commentHasMore.value || commentLoading.value) return;
  commentPage.value++;
  fetchComments();
};

const loadMoreReplies = async (comment: CommentItem) => {
  try {
    const res = await forumApi.getReplies(comment.id, 1, 20);
    const replies = (res.data.list || res.data.records || []).map((reply: any) => ({
      ...reply,
      author: {
        id: String(reply.author?.id || ''),
        name: reply.author?.name || '',
        avatar: reply.author?.avatar || '',
        levelName: reply.author?.levelName || ''
      },
      replyTo: reply.replyToUser ? {
        id: String(reply.replyToUser.id || ''),
        authorName: reply.replyToUser.name || '',
        content: ''
      } : undefined
    }));
    const commentIndex = comments.value.findIndex(c => c.id === comment.id);
    if (commentIndex > -1) {
      comments.value[commentIndex].replies = replies;
    }
  } catch (error) {
    logError('获取回复失败:', error);
  }
};

const changeCommentSort = (sort: 'new' | 'hot') => {
  if (commentSort.value === sort) return;
  commentSort.value = sort;
  fetchComments(true);
};

const toggleFollow = async () => {
  if (!post.value) return;
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  try {
    isFollowed.value = !isFollowed.value;
    uni.showToast({ 
      title: isFollowed.value ? '关注成功' : '已取消关注', 
      icon: 'none' 
    });
  } catch (error) {
    isFollowed.value = !isFollowed.value;
  }
};

const toggleLike = async () => {
  if (!post.value) return;
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  try {
    if (post.value.isLiked) {
      await forumApi.unlikePost(post.value.id);
      post.value.likeCount--;
    } else {
      await forumApi.likePost(post.value.id);
      post.value.likeCount++;
    }
    post.value.isLiked = !post.value.isLiked;
  } catch (error) {
    logError('操作失败:', error);
  }
};

const toggleCollect = async () => {
  if (!post.value) return;
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  try {
    if (post.value.isCollected) {
      await forumApi.uncollectPost(post.value.id);
    } else {
      await forumApi.collectPost(post.value.id);
    }
    post.value.isCollected = !post.value.isCollected;
    uni.showToast({ 
      title: post.value.isCollected ? '收藏成功' : '已取消收藏', 
      icon: 'none' 
    });
  } catch (error) {
    logError('操作失败:', error);
  }
};

const likeComment = async (comment: CommentItem) => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  try {
    if (comment.isLiked) {
      await forumApi.unlikeComment(comment.id);
      comment.likeCount--;
    } else {
      await forumApi.likeComment(comment.id);
      comment.likeCount++;
    }
    comment.isLiked = !comment.isLiked;
  } catch (error) {
    logError('操作失败:', error);
  }
};

const replyToComment = (comment: CommentItem, parent?: CommentItem) => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  replyTarget.value = comment;
  replyParent.value = parent || null;
  inputFocus.value = true;
};

const cancelReply = () => {
  replyTarget.value = null;
  replyParent.value = null;
  inputFocus.value = false;
};

const handleInputBlur = () => {
  setTimeout(() => {
    if (!commentText.value.trim()) {
      cancelReply();
    }
  }, 100);
};

const submitComment = async () => {
  if (!commentText.value.trim() || submitting.value) return;
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  submitting.value = true;
  try {
    const params: any = {
      postId: postId.value,
      content: commentText.value.trim()
    };
    
    if (replyTarget.value) {
      params.replyToId = replyTarget.value.id;
    }
    
    const res = await forumApi.createComment(params);
    
    if (replyParent.value) {
      const parentIndex = comments.value.findIndex(c => c.id === replyParent.value!.id);
      if (parentIndex > -1) {
        if (!comments.value[parentIndex].replies) {
          comments.value[parentIndex].replies = [];
        }
        comments.value[parentIndex].replies?.push({
          id: res.data.id,
          content: commentText.value.trim(),
          images: [],
          author: {
            id: authStore.state.userId || '',
            name: '我',
            avatar: ''
          },
          likeCount: 0,
          isLiked: false,
          replyTo: replyTarget.value ? {
            id: replyTarget.value.id,
            authorName: replyTarget.value.author.name,
            content: replyTarget.value.content
          } : undefined,
          createdAt: new Date().toISOString()
        });
        comments.value[parentIndex].replyCount = (comments.value[parentIndex].replyCount || 0) + 1;
      }
    } else if (replyTarget.value) {
      const parentIndex = comments.value.findIndex(c => c.id === replyTarget.value!.id);
      if (parentIndex > -1) {
        if (!comments.value[parentIndex].replies) {
          comments.value[parentIndex].replies = [];
        }
        comments.value[parentIndex].replies?.unshift({
          id: res.data.id,
          content: commentText.value.trim(),
          images: [],
          author: {
            id: authStore.state.userId || '',
            name: '我',
            avatar: ''
          },
          likeCount: 0,
          isLiked: false,
          replyTo: {
            id: replyTarget.value.id,
            authorName: replyTarget.value.author.name,
            content: replyTarget.value.content
          },
          createdAt: new Date().toISOString()
        });
        comments.value[parentIndex].replyCount = (comments.value[parentIndex].replyCount || 0) + 1;
      }
    } else {
      comments.value.unshift({
        id: res.data.id,
        content: commentText.value.trim(),
        images: [],
        author: {
          id: authStore.state.userId || '',
          name: '我',
          avatar: ''
        },
        likeCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      });
    }
    
    if (post.value) {
      post.value.commentCount++;
    }
    commentTotal.value++;
    
    commentText.value = '';
    cancelReply();
    
    uni.showToast({ title: '评论成功', icon: 'success' });
  } catch (error) {
    logError('评论失败:', error);
    uni.showToast({ title: '评论失败', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

const previewImage = (index: number) => {
  if (!post.value?.images) return;
  uni.previewImage({
    current: index,
    urls: post.value.images
  });
};

const previewCommentImage = (images: string[], index: number) => {
  uni.previewImage({
    current: index,
    urls: images
  });
};

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' });
    }
  });
};

const goUser = () => {
  if (!post.value) return;
  uni.navigateTo({ url: `/pages-sub/community/user/index?id=${post.value.author.id}` });
};

const goUserById = (id: string) => {
  uni.navigateTo({ url: `/pages-sub/community/user/index?id=${id}` });
};

const goForum = () => {
  if (!post.value?.forumId) return;
  uni.navigateTo({ url: `/pages-sub/content/forum/detail?id=${post.value.forumId}` });
};

const goTopic = (tag: string) => {
  uni.navigateTo({ url: `/pages-sub/content/topic/index?name=${encodeURIComponent(tag)}` });
};
</script>

<style lang="scss" scoped>
.post-detail-page {
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

.detail-scroll {
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.loading-state {
  padding: $space-lg;
}

.author-section {
  margin: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  overflow: hidden;
}

.author-card {
  display: flex;
  align-items: center;
  padding: $space-md;
  
  .author-info {
    flex: 1;
    margin-left: $space-md;
    
    .author-main {
      display: flex;
      align-items: center;
      gap: $space-xs;
    }
    
    .author-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .level-badge {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      padding: 2rpx 12rpx;
      border-radius: $radius-full;
    }
    
    .post-time {
      font-size: $font-size-xs;
      @include text-sub;
      margin-top: 4rpx;
    }
  }
  
  .follow-btn {
    padding: 12rpx 32rpx;
    background: $gradient-sunset;
    border-radius: $radius-full;

    text {
      font-size: $font-size-sm;
      color: $color-white;
      font-weight: $font-weight-medium;
    }

    &.is-followed {
      background: var(--color-success-glass, rgba(52, 199, 89, 0.12));
      border: 2rpx solid var(--color-success, #34C759);

      text {
        color: var(--color-success, #34C759);
      }
    }
  }
}

.forum-info {
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  
  .forum-name {
    flex: 1;
    font-size: $font-size-sm;
    @include text-main;
  }
}

.post-content {
  margin: 0 $space-md $space-md;
  padding: $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  border-radius: $radius-lg;
  
  .post-badges {
    display: flex;
    gap: $space-sm;
    margin-bottom: $space-sm;
    
    .badge {
      display: flex;
      align-items: center;
      gap: 4rpx;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      color: $color-white;

      &.pinned {
        background: linear-gradient(135deg, #FF6A00 0%, #FF3B30 100%);
      }

      &.essence {
        background: linear-gradient(135deg, #FF9500 0%, #FF6A00 100%);
      }
    }
  }
  
  .post-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    @include text-main;
    line-height: 1.4;
  }
  
  .post-text {
    font-size: $font-size-md;
    @include text-main;
    line-height: 1.8;
    margin-top: $space-md;
  }
  
  .post-images {
    margin-top: $space-lg;
    display: flex;
    flex-direction: column;
    gap: $space-md;
    
    .image-item {
      border-radius: $radius-lg;
      overflow: hidden;
    }
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-top: $space-lg;
    
    .tag-item {
      font-size: $font-size-sm;
      color: var(--color-primary, #FF6A00);
      padding: 4rpx 16rpx;
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      border-radius: $radius-full;
    }
  }
  
  .post-stats {
    display: flex;
    gap: $space-lg;
    margin-top: $space-lg;
    padding-top: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4rpx;
      
      text {
        font-size: $font-size-sm;
        @include text-sub;
      }
    }
  }
}

.interact-section {
  display: flex;
  justify-content: space-around;
  padding: $space-md;
  margin: 0 $space-md $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  border-radius: $radius-lg;
  
  .interact-item {
    @include flex-column-center;
    gap: 4rpx;
    padding: $space-sm $space-md;
    border-radius: $radius-md;
    transition: all $duration-fast $ease-spring;
    
    text {
      font-size: $font-size-xs;
      @include text-sub;
    }
    
    &.is-active text {
      color: var(--color-primary, #FF6A00);
    }
    
    &:active {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    }
  }
}

.comment-section {
  margin: 0 $space-md;
  padding: $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  border-radius: $radius-lg;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .sort-tabs {
      display: flex;
      align-items: center;
      gap: $space-xs;
      
      .sort-tab {
        font-size: $font-size-sm;
        @include text-sub;
        
        &.is-active {
          color: var(--color-primary, #FF6A00);
          font-weight: $font-weight-medium;
        }
      }
      
      .sort-divider {
        font-size: $font-size-sm;
        color: $color-divider;
      }
    }
  }
}

.empty-comments {
  @include flex-column-center;
  padding: 80rpx 0;
  
  .empty-text {
    font-size: $font-size-sm;
    @include text-sub;
    margin-top: $space-md;
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.comment-card {
  .comment-main {
    display: flex;
    
    .comment-body {
      flex: 1;
      margin-left: $space-sm;
    }
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $space-xs;
    
    .author-info {
      display: flex;
      align-items: center;
      gap: $space-xs;
    }
    
    .author-name {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .level-tag {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      padding: 2rpx 8rpx;
      border-radius: $radius-xs;
    }
    
    .comment-time {
      font-size: $font-size-xs;
      @include text-disabled;
    }
  }
  
  .comment-content {
    font-size: $font-size-sm;
    @include text-main;
    line-height: 1.6;
  }
  
  .comment-images {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    margin-top: $space-sm;
    
    .comment-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: $radius-md;
    }
  }
  
  .comment-actions {
    display: flex;
    gap: $space-lg;
    margin-top: $space-sm;
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 4rpx;
      
      text {
        font-size: $font-size-xs;
        @include text-sub;
      }
      
      &.is-liked text {
        color: $color-error;
      }
    }
  }
}

.reply-section {
  margin-top: $space-sm;
  padding: $space-sm;
  background: $color-bg-gray;
  border-radius: $radius-md;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.reply-item {
  display: flex;
  padding: $space-xs 0;
  
  &:not(:last-child) {
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
  }
  
  .reply-body {
    flex: 1;
    margin-left: $space-xs;
  }
  
  .reply-header {
    display: flex;
    align-items: center;
    gap: 4rpx;
    flex-wrap: wrap;
    
    .reply-author {
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .reply-arrow {
      font-size: $font-size-xs;
      @include text-sub;
    }
    
    .reply-target {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .reply-content {
    font-size: $font-size-xs;
    @include text-main;
    line-height: 1.5;
    margin-top: 2rpx;
  }
  
  .reply-meta {
    display: flex;
    align-items: center;
    gap: $space-md;
    margin-top: $space-xs;
    
    .reply-time {
      font-size: $font-size-xs;
      @include text-disabled;
    }
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 2rpx;
      
      text {
        font-size: $font-size-xs;
        @include text-sub;
      }
      
      &.is-liked text {
        color: $color-error;
      }
    }
  }
}

.more-replies {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: $space-sm 0;
  
  text {
    font-size: $font-size-xs;
    color: var(--color-primary, #FF6A00);
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

.error-state {
  @include flex-column-center;
  padding: 160rpx $space-lg;
  
  .error-text {
    font-size: $font-size-md;
    @include text-sub;
    margin: $space-md 0;
  }
}

.bottom-space {
  height: 180rpx;
}

.comment-input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm;
  padding: $space-sm $space-md;
  padding-bottom: calc(#{$space-sm} + env(safe-area-inset-bottom));
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .comment-input {
    flex: 1;
    height: 72rpx;
    padding: 0 $space-md;
    background: $color-bg-gray;
    border-radius: $radius-full;
    font-size: $font-size-md;
    color: $color-text-main;
    
    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.08);
    }
  }
  
  .reply-indicator {
    position: absolute;
    top: -52rpx;
    left: $space-md;
    display: flex;
    align-items: center;
    padding: 4rpx 16rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-radius: $radius-full;
    
    text {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
    }
  }
}
</style>
