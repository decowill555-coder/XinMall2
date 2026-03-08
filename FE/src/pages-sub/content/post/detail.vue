﻿<template>
  <view class="post-detail-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="帖子详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="author-section">
        <ui-author-card 
          :avatar="post.authorAvatar"
          :name="post.authorName"
          :time="post.createTime"
          :is-followed="post.isFollowed"
          show-follow
          @click="goUser"
          @follow="toggleFollow"
        />
      </view>
      
      <view class="post-content">
        <text class="post-title">{{ post.title }}</text>
        <text class="post-text">{{ post.content }}</text>
        
        <view class="post-images" v-if="post.images?.length">
          <ui-image 
            v-for="(img, index) in post.images" 
            :key="index"
            :src="img" 
            width="100%" 
            height="400rpx" 
            radius="lg"
            mode="aspectFill"
            @click="previewImage(index)"
          />
        </view>
        
        <view class="post-tags">
          <text v-for="tag in post.tags" :key="tag" class="tag-item" @click="goTopic(tag)">#{{ tag }}</text>
        </view>
        
        <view class="post-goods" v-if="post.relatedGoods">
          <text class="goods-label">相关商品</text>
          <view class="goods-card" @click="goGoods">
            <ui-image :src="post.relatedGoods.cover" width="120rpx" height="120rpx" radius="md" />
            <view class="goods-info">
              <text class="goods-title">{{ post.relatedGoods.title }}</text>
              <ui-price :value="post.relatedGoods.price" :size="28" />
            </view>
          </view>
        </view>
      </view>
      
      <ui-interact-bar 
        :is-liked="post.isLiked"
        :like-count="post.likeCount"
        :comment-count="post.commentCount"
        @like="toggleLike"
        @comment="showComments = true"
        @share="handleShare"
      />
      
      <view class="comment-section">
        <text class="section-title">评论 ({{ comments.length }})</text>
        
        <view class="comment-list">
          <ui-comment-item 
            v-for="item in comments" 
            :key="item.id"
            :avatar="item.avatar"
            :user-name="item.userName"
            :time="item.time"
            :content="item.content"
            :is-liked="item.isLiked"
            :like-count="item.likeCount"
            @like="likeComment(item)"
            @reply="replyComment(item)"
          />
        </view>
      </view>
    </scroll-view>
    
    <ui-comment-input 
      v-model="commentText" 
      @submit="submitComment"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { formatTimeAgo } from '@/utils/date';

const commentText = ref('');
const showComments = ref(false);

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const post = ref({
  id: 1,
  authorAvatar: 'https://picsum.photos/100/100?random=author',
  authorName: '数码达人',
  createTime: formatTimeAgo(Date.now() - 2 * 60 * 60 * 1000),
  isFollowed: false,
  title: 'iPhone 15 Pro Max 深度测评：性能与影像全面升级',
  content: '作为一名资深数码爱好者，今天给大家带来 iPhone 15 Pro Max 的深度测评。这款手机搭载了全新的 A17 Pro 芯片，性能提升明显，影像系统也有了很大升级。下面从几个方面详细说说使用感受...',
  images: [
    'https://picsum.photos/800/800?random=p1',
    'https://picsum.photos/800/800?random=p2',
    'https://picsum.photos/800/800?random=p3'
  ],
  tags: ['iPhone15', '数码测评', '科技好物'],
  isLiked: true,
  likeCount: 256,
  commentCount: 32,
  relatedGoods: {
    id: 1,
    cover: 'https://picsum.photos/200/200?random=rg',
    title: 'iPhone 15 Pro Max 256GB',
    price: 7999
  }
});

const comments = ref([
  { id: 1, avatar: 'https://picsum.photos/100/100?random=c1', userName: '科技小白', time: formatTimeAgo(Date.now() - 60 * 60 * 1000), content: '写得很详细，学习了！', isLiked: false, likeCount: 12 },
  { id: 2, avatar: 'https://picsum.photos/100/100?random=c2', userName: '数码爱好者', time: formatTimeAgo(Date.now() - 30 * 60 * 1000), content: '请问续航怎么样？日常使用能坚持一天吗？', isLiked: true, likeCount: 5 },
  { id: 3, avatar: 'https://picsum.photos/100/100?random=c3', userName: '摄影师老李', time: formatTimeAgo(Date.now() - 10 * 60 * 1000), content: '影像部分的测评很专业，赞一个', isLiked: false, likeCount: 3 }
]);

const goUser = () => {
  uni.navigateTo({ url: '/pages-sub/content/user/index?id=1' });
};

const toggleFollow = () => {
  post.value.isFollowed = !post.value.isFollowed;
  uni.showToast({ title: post.value.isFollowed ? '关注成功' : '已取消关注', icon: 'none' });
};

const toggleLike = () => {
  post.value.isLiked = !post.value.isLiked;
  post.value.likeCount += post.value.isLiked ? 1 : -1;
};

const handleShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

const previewImage = (index: number) => {
  uni.previewImage({
    current: index,
    urls: post.value.images
  });
};

const goTopic = (tag: string) => {
  uni.navigateTo({ url: `/pages-sub/content/topic/index?name=${tag}` });
};

const goGoods = () => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${post.value.relatedGoods?.id}` });
};

const likeComment = (item: any) => {
  item.isLiked = !item.isLiked;
  item.likeCount += item.isLiked ? 1 : -1;
};

const replyComment = (item: any) => {
  commentText.value = `@${item.userName} `;
};

const submitComment = () => {
  if (!commentText.value.trim()) return;
  
  comments.value.unshift({
    id: Date.now(),
    avatar: 'https://picsum.photos/100/100?random=me',
    userName: '我',
    time: formatTimeAgo(Date.now()),
    content: commentText.value,
    isLiked: false,
    likeCount: 0
  });
  
  post.value.commentCount++;
  commentText.value = '';
  uni.showToast({ title: '评论成功', icon: 'success' });
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

.author-section {
  margin: $space-md;
  border-radius: $radius-lg;
  overflow: hidden;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid $color-border-light;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.post-content {
  margin: 0 $space-md $space-md;
  padding: $space-lg;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
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
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-top: $space-lg;
    
    .tag-item {
      font-size: $font-size-sm;
      color: $color-primary;
      padding: 4rpx 16rpx;
      background: $color-primary-glass;
      border-radius: $radius-full;
      
      [data-theme="dark"] & {
        color: $color-primary;
        background: rgba(217, 70, 239, 0.15);
      }
    }
  }
  
  .post-goods {
    margin-top: $space-lg;
    padding-top: $space-lg;
    border-top: 1px solid $color-divider;
    
    [data-theme="dark"] & {
      border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
    
    .goods-label {
      font-size: $font-size-sm;
      @include text-sub;
    }
    
    .goods-card {
      display: flex;
      align-items: center;
      margin-top: $space-sm;
      padding: $space-md;
      background: $color-bg-gray;
      border-radius: $radius-md;
      transition: all $duration-fast $ease-spring;
      
      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.06);
      }
      
      &:active {
        transform: scale(0.98);
        background: $color-primary-glass;
        
        [data-theme="dark"] & {
          background: rgba(217, 70, 239, 0.15);
        }
      }
      
      .goods-info {
        flex: 1;
        margin-left: $space-md;
        
        .goods-title {
          font-size: $font-size-sm;
          @include text-main;
          @include text-ellipsis(1);
          margin-bottom: $space-xs;
        }
      }
    }
  }
}

.comment-section {
  margin: 0 $space-md $space-md;
  padding: $space-lg;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    @include text-main;
  }
  
  .comment-list {
    margin-top: $space-md;
  }
}
</style>
