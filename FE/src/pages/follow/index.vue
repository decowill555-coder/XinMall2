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
        <view class="post-list">
          <ui-waterfalls :list="postList" :columns="2" :gap="12" @click="goPostDetail">
            <template #item="{ item }">
              <ui-goods-card 
                :data="{
                  ...item,
                  price: null,
                  likeCount: item.likeCount
                }" 
                mode="waterfall" 
                @click="goPostDetail" 
                @user-click="goUser" 
              />
            </template>
          </ui-waterfalls>
        </view>
        
        <view class="load-more" v-if="postList.length > 0">
          <ui-divider :text="loading ? '加载中...' : '上拉加载更多'" />
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar current="follow" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
  hasTabbar: true,
  headerSelector: '.page-header',
  headerEstimatedHeight: 120
});

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

.post-list {
  padding: $space-md $space-md 0;
  box-sizing: border-box;
  overflow: hidden;
}

.load-more {
  padding: $space-md 0;
  
  :deep(.ui-divider) {
    @include text-sub;
  }
}
</style>
