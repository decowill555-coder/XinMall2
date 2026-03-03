<template>
  <view class="post-detail-page">
    <ui-sub-navbar title="帖子详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="author-card">
        <view class="author-info" @click="goUser">
          <ui-avatar :src="post.authorAvatar" ::size="80" />
          <view class="author-detail">
            <text class="author-name">{{ post.authorName }}</text>
            <text class="author-time">{{ post.createTime }}</text>
          </view>
        </view>
        <ui-button size="sm" :type="post.isFollowed ? 'default' : 'primary'" @click="toggleFollow">
          {{ post.isFollowed ? '已关注' : '关注' }}
        </ui-button>
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
            radius="8rpx"
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
            <ui-image :src="post.relatedGoods.cover" width="120rpx" height="120rpx" radius="8rpx" />
            <view class="goods-info">
              <text class="goods-title">{{ post.relatedGoods.title }}</text>
              <ui-price :value="post.relatedGoods.price" :size="28" />
            </view>
          </view>
        </view>
      </view>
      
      <view class="interact-bar">
        <view class="interact-item" @click="toggleLike">
          <ui-icon :name="post.isLiked ? 'heart-fill' : 'heart'" ::size="40" :color="post.isLiked ? '#FF3D00' : '#6E6E73'" />
          <text>{{ post.likeCount }}</text>
        </view>
        <view class="interact-item" @click="showComments = true">
          <ui-icon name="message" ::size="40" />
          <text>{{ post.commentCount }}</text>
        </view>
        <view class="interact-item" @click="handleShare">
          <ui-icon name="share" ::size="40" />
          <text>分享</text>
        </view>
      </view>
      
      <view class="comment-section">
        <text class="section-title">评论 ({{ comments.length }})</text>
        
        <view class="comment-list">
          <view v-for="item in comments" :key="item.id" class="comment-item">
            <ui-avatar :src="item.avatar" :size="64" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-name">{{ item.userName }}</text>
                <text class="comment-time">{{ item.time }}</text>
              </view>
              <text class="comment-text">{{ item.content }}</text>
              <view class="comment-actions">
                <view class="action-item" @click="likeComment(item)">
                  <ui-icon :name="item.isLiked ? 'heart-fill' : 'heart'" :size="32" :color="item.isLiked ? '#FF3D00' : '#A1A1A6'" />
                  <text>{{ item.likeCount }}</text>
                </view>
                <text class="action-item" @click="replyComment(item)">回复</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="comment-input">
      <input class="input-field" v-model="commentText" placeholder="说点什么..." />
      <ui-button size="sm" type="primary" :disabled="!commentText" @click="submitComment">发送</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

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
  createTime: '2小时前',
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
  { id: 1, avatar: 'https://picsum.photos/100/100?random=c1', userName: '科技小白', time: '1小时前', content: '写得很详细，学习了！', isLiked: false, likeCount: 12 },
  { id: 2, avatar: 'https://picsum.photos/100/100?random=c2', userName: '数码爱好者', time: '30分钟前', content: '请问续航怎么样？日常使用能坚持一天吗？', isLiked: true, likeCount: 5 },
  { id: 3, avatar: 'https://picsum.photos/100/100?random=c3', userName: '摄影师老李', time: '10分钟前', content: '影像部分的测评很专业，赞一个', isLiked: false, likeCount: 3 }
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
    time: '刚刚',
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
  min-height: 100vh;
  background: $color-bg-page;
}

.detail-scroll {
  overflow: hidden;
}

.author-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md;
  background: $color-white;
  
  .author-info {
    display: flex;
    align-items: center;
    
    .author-detail {
      margin-left: $space-sm;
      
      .author-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
      }
      
      .author-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: $space-xs;
      }
    }
  }
}

.post-content {
  padding: $space-md;
  background: $color-white;
  
  .post-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    line-height: 1.4;
  }
  
  .post-text {
    font-size: $font-size-md;
    color: $color-text-main;
    line-height: 1.8;
    margin-top: $space-md;
  }
  
  .post-images {
    margin-top: $space-md;
    display: flex;
    flex-direction: column;
    gap: $space-sm;
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-top: $space-md;
    
    .tag-item {
      font-size: $font-size-sm;
      color: $color-primary;
    }
  }
  
  .post-goods {
    margin-top: $space-lg;
    padding-top: $space-md;
    border-top: 1rpx solid $color-divider;
    
    .goods-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
    
    .goods-card {
      display: flex;
      align-items: center;
      margin-top: $space-sm;
      padding: $space-sm;
      background: $color-bg-gray;
      border-radius: $radius-md;
      
      .goods-info {
        flex: 1;
        margin-left: $space-sm;
        
        .goods-title {
          font-size: $font-size-sm;
          color: $color-text-main;
          @include text-ellipsis(1);
        }
      }
    }
  }
}

.interact-bar {
  display: flex;
  justify-content: space-around;
  padding: $space-md;
  background: $color-white;
  border-top: 1rpx solid $color-divider;
  
  .interact-item {
    @include flex-column-center;
    
    text {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
  }
}

.comment-section {
  margin-top: $space-sm;
  padding: $space-md;
  background: $color-white;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
  }
  
  .comment-list {
    margin-top: $space-md;
    
    .comment-item {
      display: flex;
      padding: $space-sm 0;
      
      .comment-content {
        flex: 1;
        margin-left: $space-sm;
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .comment-name {
            font-size: $font-size-sm;
            font-weight: $font-weight-medium;
            color: $color-text-main;
          }
          
          .comment-time {
            font-size: $font-size-xs;
            color: $color-text-disabled;
          }
        }
        
        .comment-text {
          font-size: $font-size-sm;
          color: $color-text-main;
          line-height: 1.5;
          margin: $space-xs 0;
        }
        
        .comment-actions {
          display: flex;
          gap: $space-md;
          
          .action-item {
            display: flex;
            align-items: center;
            font-size: $font-size-xs;
            color: $color-text-sub;
            
            text { margin-left: 4rpx; }
          }
        }
      }
    }
  }
}

.comment-input {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-md;
  padding-bottom: calc(#{$space-sm} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  .input-field {
    flex: 1;
    height: 72rpx;
    padding: 0 $space-md;
    background: $color-bg-gray;
    border-radius: $radius-full;
    font-size: $font-size-md;
  }
}
</style>
