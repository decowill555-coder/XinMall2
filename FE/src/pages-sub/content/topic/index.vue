﻿<template>
  <view class="topic-page">
    <ui-sub-navbar :title="'#'+topicName" />
    
    <view class="topic-header">
      <text class="topic-name">#{{ topicName }}</text>
      <text class="topic-desc">{{ topicInfo.desc }}</text>
      <view class="topic-stats">
        <view class="stat-item">
          <text class="stat-value">{{ topicInfo.postCount }}</text>
          <text class="stat-label">帖子</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ topicInfo.viewCount }}</text>
          <text class="stat-label">浏览</text>
        </view>
      </view>
    </view>
    
    <view class="filter-bar">
      <ui-tabs v-model="sortType" :list="sortList" type="line" />
    </view>
    
    <scroll-view scroll-y class="post-scroll" @scrolltolower="loadMore">
      <view class="post-list">
        <view v-for="item in postList" :key="item.id" class="post-item" @click="goDetail(item)">
          <view class="post-header">
            <ui-avatar :src="item.userAvatar" :size="64" />
            <view class="user-info">
              <text class="user-name">{{ item.userName }}</text>
              <text class="post-time">{{ item.time }}</text>
            </view>
          </view>
          <text class="post-title">{{ item.title }}</text>
          <view class="post-images" v-if="item.images?.length">
            <ui-image 
              v-for="(img, idx) in item.images.slice(0, 3)" 
              :key="idx"
              :src="img" 
              width="200rpx" 
              height="200rpx" 
              radius="8rpx"
            />
          </view>
          <view class="post-footer">
            <view class="stat-item">
              <ui-icon name="heart" :size="32" />
              <text>{{ item.likeCount }}</text>
            </view>
            <view class="stat-item">
              <ui-icon name="message" :size="32" />
              <text>{{ item.commentCount }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const topicName = ref('iPhone15');
const sortType = ref(0);

const topicInfo = ref({
  desc: '分享 iPhone 15 系列使用体验、技巧和问题',
  postCount: 12580,
  viewCount: 890000
});

const sortList = ref([
  { name: '最新' },
  { name: '最热' }
]);

const postList = ref([
  {
    id: 1,
    userAvatar: 'https://picsum.photos/100/100?random=t1',
    userName: '数码达人',
    time: '2小时前',
    title: 'iPhone 15 Pro Max 深度测评：性能与影像全面升级',
    images: ['https://picsum.photos/200/200?random=ti1', 'https://picsum.photos/200/200?random=ti2'],
    likeCount: 256,
    commentCount: 32
  },
  {
    id: 2,
    userAvatar: 'https://picsum.photos/100/100?random=t2',
    userName: '科技博主',
    time: '5小时前',
    title: 'iPhone 15 和 iPhone 14 该怎么选？看完这篇就懂了',
    images: ['https://picsum.photos/200/200?random=ti3'],
    likeCount: 189,
    commentCount: 45
  },
  {
    id: 3,
    userAvatar: 'https://picsum.photos/100/100?random=t3',
    userName: '小白用户',
    time: '昨天',
    title: 'iPhone 15 Pro 的钛金属边框真的不沾指纹吗？',
    images: [],
    likeCount: 67,
    commentCount: 23
  }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
};

const loadMore = () => {
  uni.showToast({ title: '加载更多...', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.topic-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.topic-header {
  @include flex-column-center;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  
  .topic-name {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-white;
  }
  
  .topic-desc {
    font-size: $font-size-sm;
    color: rgba($color-white, 0.8);
    text-align: center;
    margin: $space-sm 0;
  }
  
  .topic-stats {
    display: flex;
    gap: $space-xl;
    margin-top: $space-md;
    
    .stat-item {
      @include flex-column-center;
      
      .stat-value {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $color-white;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: rgba($color-white, 0.8);
      }
    }
  }
}

.filter-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.post-scroll {
  height: calc(100vh - 88rpx - 280rpx - 88rpx);
}

.post-list {
  padding: $space-sm $space-md;
  
  .post-item {
    background: $color-white;
    border-radius: $radius-md;
    padding: $space-md;
    margin-bottom: $space-sm;
    
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: $space-sm;
      
      .user-info {
        margin-left: $space-sm;
        
        .user-name {
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          color: $color-text-main;
        }
        
        .post-time {
          font-size: $font-size-xs;
          color: $color-text-disabled;
          display: block;
        }
      }
    }
    
    .post-title {
      font-size: $font-size-md;
      color: $color-text-main;
      line-height: 1.5;
      @include text-ellipsis(2);
    }
    
    .post-images {
      display: flex;
      gap: $space-xs;
      margin-top: $space-sm;
    }
    
    .post-footer {
      display: flex;
      gap: $space-lg;
      margin-top: $space-sm;
      padding-top: $space-sm;
      border-top: 1rpx solid $color-divider;
      
      .stat-item {
        display: flex;
        align-items: center;
        font-size: $font-size-xs;
        color: $color-text-sub;
        
        text { margin-left: 4rpx; }
      }
    }
  }
}
</style>
