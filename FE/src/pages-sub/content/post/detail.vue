<template>
  <view class="post-detail-page">
    <ui-sub-navbar title="帖子详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-author-card 
        :avatar="post.authorAvatar"
        :name="post.authorName"
        :time="post.createTime"
        :is-followed="post.isFollowed"
        show-follow
        @click="goUser"
        @follow="toggleFollow"
      />
      
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
  min-height: 100vh;
  background: $color-bg-page;
}

.detail-scroll {
  overflow: hidden;
}

.post-content {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
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
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .post-goods {
    margin-top: $space-lg;
    padding-top: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .goods-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
    
    .goods-card {
      display: flex;
      align-items: center;
      margin-top: $space-sm;
      padding: $space-sm;
      background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
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

.comment-section {
  margin-top: $space-sm;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
  }
  
  .comment-list {
    margin-top: $space-md;
  }
}
</style>
