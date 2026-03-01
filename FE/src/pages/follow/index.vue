<template>
  <view class="follow-page">
    <view class="page-content">
      <view class="header">
        <text class="title">关注</text>
        <text class="subtitle">发现好物好价好价</text>
      </view>
      
      <scroll-view scroll-y class="content-scroll" @scrolltolower="loadMore">
        <ui-waterfalls :list="postList" columns="2" gap="12" @click="goPostDetail">
          <template #item="{ item }">
            <view class="post-item">
              <ui-image 
                :src="item.cover" 
                width="100%" 
                height="280rpx" 
                radius="12rpx"
              />
              <view class="post-overlay" v-if="item.isVideo">
                <ui-icon name="play" size="20" color="#FFFFFF" />
              </view>
              <view class="post-info">
                <view class="post-header">
                  <view class="user-info" @click.stop="goUser(item)">
                    <ui-avatar :src="item.userAvatar" :size="32" :bordered="false" />
                    <text class="user-name">{{ item.userName }}</text>
                  </view>
                  <text class="post-title">{{ item.title }}</text>
                </view>
                <view class="post-footer">
                  <view class="like-box" @click.stop="toggleLike(item)">
                    <ui-icon :name="item.isLiked ? 'heart-fill' : 'heart'" size="24" :color="item.isLiked ? '#FF3D00' : '#6E6E73'" />
                    <text class="like-count">{{ item.likeCount }}</text>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </ui-waterfalls>
        
        <view class="load-more" v-if="postList.length > 0">
          <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);

const postList = ref([
  {
    id: 1,
    cover: 'https://picsum.photos/400/400?random=101',
    title: 'iPhone 15 Pro 深度测评：性能与影像全面升级',
    userName: '数码达人',
    userAvatar: 'https://picsum.photos/100/100?random=1',
    likeCount: 128,
    isLiked: false,
    isVideo: false
  },
  {
    id: 2,
    cover: 'https://picsum.photos/400/500?random=102',
    title: 'MacBook Pro M3 开箱体验：性能怪兽来了',
    userName: '科技博主',
    userAvatar: 'https://picsum.photos/100/100?random=2',
    likeCount: 256,
    isLiked: true,
    isVideo: false
  },
  {
    id: 3,
    cover: 'https://picsum.photos/400/400?random=103',
    title: 'AirPods Pro 2 开箱测评：降噪天花板级别',
    userName: '耳机控',
    userAvatar: 'https://picsum.photos/100/100?random=3',
    likeCount: 89,
    isLiked: false,
    isVideo: false
  },
  {
    id: 4,
    cover: 'https://picsum.photos/400/600?random=104',
    title: '2024年最值得入手的数码好物推荐',
    userName: '好物推荐官',
    userAvatar: 'https://picsum.photos/100/100?random=4',
    likeCount: 167,
    isLiked: false,
    isVideo: true
  },
  {
    id: 5,
    cover: 'https://picsum.photos/400/400?random=105',
    title: 'iPad Pro 创作利器：设计师必备神器',
    userName: '设计师小王',
    userAvatar: 'https://picsum.photos/100/100?random=5',
    likeCount: 234,
    isLiked: true,
    isVideo: false
  },
  {
    id: 6,
    cover: 'https://picsum.photos/400/500?random=106',
    title: 'Sony 相机入门指南：如何拍出好照片',
    userName: '摄影师老李',
    userAvatar: 'https://picsum.photos/100/100?random=6',
    likeCount: 78,
    isLiked: false,
    isVideo: false
  }
]);

const goPostDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
};

const goUser = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.userId}` });
};

const toggleLike = (item: any) => {
  item.isLiked = !item.isLiked;
  item.likeCount += item.isLiked ? 1 : -1;
};

const loadMore = () => {
  if (loading.value) return;
  loading.value = true;
  
  setTimeout(() => {
    const newList = postList.value.map(item => ({
      ...item,
      id: item.id + postList.value.length,
      likeCount: Math.floor(Math.random() * 200)
    }));
    postList.value = [...postList.value, ...newList];
    loading.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped>
.follow-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-content {
  padding-bottom: 120rpx;
}

.header {
  padding: $space-lg $space-md;
  background: $color-white;
  
  .title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  .subtitle {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
  }
}

.content-scroll {
  height: calc(100vh - 200rpx - 120rpx);
  padding: $space-sm $space-md;
}

.post-item {
  background: $color-white;
  border-radius: $radius-md;
  overflow: hidden;
  margin-bottom: $space-sm;
  
  .post-overlay {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 8rpx;
  }
  
  .post-info {
    padding: $space-sm;
  }
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $space-xs;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    
    .user-name {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin-left: $space-xs;
    }
  }
  
  .post-title {
    font-size: $font-size-sm;
    color: $color-text-main;
    line-height: 1.4;
    @include text-ellipsis(2);
  }
  
  .post-footer {
    display: flex;
    justify-content: flex-end;
    
    .like-box {
      display: flex;
      align-items: center;
      
      .like-count {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-left: 4rpx;
      }
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
