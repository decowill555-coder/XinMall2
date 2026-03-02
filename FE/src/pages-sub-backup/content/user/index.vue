<template>
  <view class="user-page">
    <ui-sub-navbar title="Ta的主�? />
    
    <scroll-view scroll-y class="user-scroll">
      <view class="user-header">
        <ui-avatar :src="userInfo.avatar" :size="120" />
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-desc">{{ userInfo.signature }}</text>
        <view class="user-stats">
          <view class="stat-item" @click="showFollowers">
            <text class="stat-value">{{ userInfo.followers }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-item" @click="showFollowing">
            <text class="stat-value">{{ userInfo.following }}</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ userInfo.likes }}</text>
            <text class="stat-label">获赞</text>
          </view>
        </view>
        <view class="user-actions">
          <ui-button :type="userInfo.isFollowed ? 'default' : 'primary'" size="sm" @click="toggleFollow">
            {{ userInfo.isFollowed ? '已关�? : '关注' }}
          </ui-button>
          <ui-button size="sm" @click="goChat">私信</ui-button>
        </view>
      </view>
      
      <view class="tabs-bar">
        <ui-tabs v-model="activeTab" :list="tabList" type="line" />
      </view>
      
      <view class="content-area">
        <view v-if="activeTab === 0" class="post-list">
          <view v-for="item in postList" :key="item.id" class="post-item" @click="goPost(item)">
            <ui-image :src="item.cover" width="100%" height="300rpx" radius="8rpx" />
            <text class="post-title">{{ item.title }}</text>
            <view class="post-stats">
              <text class="stat">{{ item.likeCount }}�?/text>
              <text class="stat">{{ item.commentCount }}评论</text>
            </view>
          </view>
        </view>
        
        <view v-if="activeTab === 1" class="goods-list">
          <view v-for="item in goodsList" :key="item.id" class="goods-item" @click="goGoods(item)">
            <ui-image :src="item.cover" width="100%" height="300rpx" radius="8rpx" />
            <view class="goods-info">
              <text class="goods-title">{{ item.title }}</text>
              <ui-price :value="item.price" :size="28" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);

const tabList = ref([
  { name: '帖子' },
  { name: '商品' }
]);

const userInfo = ref({
  avatar: 'https://picsum.photos/200/200?random=other',
  name: '数码达人',
  signature: '专注数码产品测评与分�?,
  followers: 2568,
  following: 128,
  likes: 8999,
  isFollowed: false
});

const postList = ref([
  { id: 1, cover: 'https://picsum.photos/400/400?random=up1', title: 'iPhone 15 Pro Max 深度测评', likeCount: 256, commentCount: 32 },
  { id: 2, cover: 'https://picsum.photos/400/400?random=up2', title: 'MacBook Pro M3 开箱体�?, likeCount: 189, commentCount: 28 },
  { id: 3, cover: 'https://picsum.photos/400/400?random=up3', title: 'AirPods Pro 2 使用感受', likeCount: 167, commentCount: 45 }
]);

const goodsList = ref([
  { id: 1, cover: 'https://picsum.photos/400/400?random=ug1', title: 'iPhone 15 Pro Max 256GB', price: 7999 },
  { id: 2, cover: 'https://picsum.photos/400/400?random=ug2', title: 'MacBook Pro 14�?M3', price: 12999 },
  { id: 3, cover: 'https://picsum.photos/400/400?random=ug3', title: 'AirPods Pro 第二�?, price: 1399 }
]);

const toggleFollow = () => {
  userInfo.value.isFollowed = !userInfo.value.isFollowed;
  uni.showToast({ title: userInfo.value.isFollowed ? '关注成功' : '已取消关�?, icon: 'none' });
};

const goChat = () => {
  uni.showToast({ title: '私信功能开发中', icon: 'none' });
};

const showFollowers = () => {
  uni.showToast({ title: '粉丝列表', icon: 'none' });
};

const showFollowing = () => {
  uni.showToast({ title: '关注列表', icon: 'none' });
};

const goPost = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
};

const goGoods = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};
</script>

<style lang="scss" scoped>
.user-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.user-scroll {
  height: calc(100vh - 88rpx);
}

.user-header {
  @include flex-column-center;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  
  .user-name {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-white;
    margin-top: $space-sm;
  }
  
  .user-desc {
    font-size: $font-size-sm;
    color: rgba($color-white, 0.8);
    margin-top: $space-xs;
  }
  
  .user-stats {
    display: flex;
    gap: $space-xl;
    margin-top: $space-lg;
    
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
  
  .user-actions {
    display: flex;
    gap: $space-sm;
    margin-top: $space-lg;
  }
}

.tabs-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.content-area {
  padding: $space-sm $space-md;
}

.post-list, .goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-sm;
  
  .post-item, .goods-item {
    background: $color-white;
    border-radius: $radius-md;
    overflow: hidden;
    
    .post-title, .goods-title {
      font-size: $font-size-sm;
      color: $color-text-main;
      padding: $space-sm;
      @include text-ellipsis(2);
    }
    
    .post-stats {
      display: flex;
      gap: $space-sm;
      padding: 0 $space-sm $space-sm;
      
      .stat {
        font-size: $font-size-xs;
        color: $color-text-disabled;
      }
    }
    
    .goods-info {
      padding: 0 $space-sm $space-sm;
    }
  }
}
</style>
