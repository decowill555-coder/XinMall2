<template>
  <view class="my-page">
    <view class="page-content">
      <view class="user-header">
        <view class="user-info" @click="goProfile">
          <ui-avatar :src="userInfo.avatar" :size="120" :bordered="true" />
          <view class="user-detail">
            <text class="user-name">{{ userInfo.name }}</text>
            <text class="user-desc">{{ userInfo.signature }}</text>
            <view class="user-tags">
              <ui-tag v-if="userInfo.isVerified" type="success" size="sm">已认证</ui-tag>
              <ui-tag v-if="userInfo.isSeller" type="primary" size="sm">卖家</ui-tag>
            </view>
          </view>
          <ui-icon name="arrow-right" :size="20" />
        </view>
        
        <view class="user-stats">
          <view class="stat-item" @click="goFollowers">
            <text class="stat-value">{{ userInfo.followers }}</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-item" @click="goFollowing">
            <text class="stat-value">{{ userInfo.following }}</text>
            <text class="stat-label">关注</text>
          </view>
          <view class="stat-item" @click="goLikes">
            <text class="stat-value">{{ userInfo.likes }}</text>
            <text class="stat-label">获赞</text>
          </view>
        </view>
      </view>
      
      <view class="order-section">
        <view class="section-header">
          <text class="section-title">我的订单</text>
          <view class="section-more" @click="goOrders">
            <text>全部订单</text>
            <ui-icon name="arrow-right" :size="16" />
          </view>
        </view>
        <view class="order-tabs">
          <view class="order-item" @click="goOrders('pending')">
            <view class="order-icon">
              <ui-icon name="wallet" :size="24" />
              <ui-badge v-if="orderCounts.pending > 0" :value="orderCounts.pending" />
            </view>
            <text class="order-text">待付款</text>
          </view>
          <view class="order-item" @click="goOrders('shipped')">
            <view class="order-icon">
              <ui-icon name="truck" :size="24" />
              <ui-badge v-if="orderCounts.shipped > 0" :value="orderCounts.shipped" />
            </view>
            <text class="order-text">待发货</text>
          </view>
          <view class="order-item" @click="goOrders('received')">
            <view class="order-icon">
              <ui-icon name="package" :size="24" />
              <ui-badge v-if="orderCounts.received > 0" :value="orderCounts.received" />
            </view>
            <text class="order-text">待收货</text>
          </view>
          <view class="order-item" @click="goOrders('reviewed')">
            <view class="order-icon">
              <ui-icon name="star" :size="24" />
              <ui-badge v-if="orderCounts.reviewed > 0" :value="orderCounts.reviewed" />
            </view>
            <text class="order-text">待评价</text>
          </view>
          <view class="order-item" @click="goOrders('refund')">
            <view class="order-icon">
              <ui-icon name="refresh" :size="24" />
              <ui-badge v-if="orderCounts.refund > 0" :value="orderCounts.refund" />
            </view>
            <text class="order-text">退款/售后</text>
          </view>
        </view>
      </view>
      
      <view class="menu-section">
        <view class="menu-group">
          <ui-cell title="我的店铺" icon="store" is-link @click="goShop" />
          <ui-cell title="我的发布" icon="edit" is-link @click="goMyPublish" />
          <ui-cell title="我的收藏" icon="heart" is-link @click="goCollection" />
          <ui-cell title="浏览足迹" icon="eye" is-link @click="goHistory" />
        </view>
        
        <view class="menu-group">
          <ui-cell title="地址管理" icon="map-pin" is-link @click="goAddress" />
          <ui-cell title="我的钱包" icon="credit-card" is-link @click="goWallet" />
          <ui-cell title="实名认证" icon="shield" is-link @click="goAuth">
            <template #right-icon>
              <text class="auth-status">{{ userInfo.isVerified ? '已认证' : '未认证' }}</text>
            </template>
          </ui-cell>
        </view>
        
        <view class="menu-group">
          <ui-cell title="帮助中心" icon="help-circle" is-link @click="goHelp" />
          <ui-cell title="意见反馈" icon="message" is-link @click="goFeedback" />
          <ui-cell title="设置" icon="settings" is-link @click="goSettings" />
        </view>
      </view>
    </view>
    
    <TheTabbar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userInfo = ref({
  avatar: 'https://picsum.photos/200/200?random=100',
  name: '数码达人',
  signature: '专注数码产品测评与分享',
  isVerified: true,
  isSeller: true,
  followers: 2568,
  following: 128,
  likes: 8999
});

const orderCounts = ref({
  pending: 2,
  shipped: 1,
  received: 3,
  reviewed: 1,
  refund: 0
});

const goProfile = () => {
  uni.navigateTo({ url: '/pages-sub/user/profile/index' });
};

const goFollowers = () => {
  uni.showToast({ title: '粉丝列表', icon: 'none' });
};

const goFollowing = () => {
  uni.showToast({ title: '关注列表', icon: 'none' });
};

const goLikes = () => {
  uni.showToast({ title: '获赞记录', icon: 'none' });
};

const goOrders = (type?: string) => {
  const url = type 
    ? `/pages-sub/trade/order/list?type=${type}` 
    : '/pages-sub/trade/order/list';
  uni.navigateTo({ url });
};

const goShop = () => {
  uni.navigateTo({ url: '/pages-sub/seller/shop/index' });
};

const goMyPublish = () => {
  uni.navigateTo({ url: '/pages-sub/seller/goods/list' });
};

const goCollection = () => {
  uni.navigateTo({ url: '/pages-sub/user/collection/index' });
};

const goHistory = () => {
  uni.navigateTo({ url: '/pages-sub/user/history/index' });
};

const goAddress = () => {
  uni.navigateTo({ url: '/pages-sub/user/address/list' });
};

const goWallet = () => {
  uni.navigateTo({ url: '/pages-sub/user/wallet/index' });
};

const goAuth = () => {
  uni.navigateTo({ url: '/pages-sub/auth/real-name/index' });
};

const goHelp = () => {
  uni.showToast({ title: '帮助中心', icon: 'none' });
};

const goFeedback = () => {
  uni.showToast({ title: '意见反馈', icon: 'none' });
};

const goSettings = () => {
  uni.navigateTo({ url: '/pages-sub/user/settings/index' });
};
</script>

<style lang="scss" scoped>
.my-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-content {
  padding-bottom: 120rpx;
}

.user-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: $space-xl $space-md $space-lg;
  
  .user-info {
    display: flex;
    align-items: center;
    
    .user-detail {
      flex: 1;
      margin-left: $space-md;
      
      .user-name {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-white;
        display: block;
      }
      
      .user-desc {
        font-size: $font-size-sm;
        color: rgba($color-white, 0.8);
        margin-top: $space-xs;
        display: block;
      }
      
      .user-tags {
        display: flex;
        gap: $space-xs;
        margin-top: $space-sm;
      }
    }
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    margin-top: $space-lg;
    padding: $space-md;
    background: rgba($color-white, 0.15);
    border-radius: $radius-lg;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $color-white;
        display: block;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: rgba($color-white, 0.8);
        margin-top: $space-xs;
        display: block;
      }
    }
  }
}

.order-section {
  background: $color-white;
  margin: $space-md;
  border-radius: $radius-lg;
  padding: $space-md;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
    
    .section-more {
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .order-icon {
        position: relative;
        width: 80rpx;
        height: 80rpx;
        @include flex-center;
        background: $color-bg-gray;
        border-radius: 50%;
      }
      
      .order-text {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}

.menu-section {
  .menu-group {
    background: $color-white;
    margin: $space-md;
    border-radius: $radius-lg;
    overflow: hidden;
  }
}

.auth-status {
  font-size: $font-size-sm;
  color: $color-text-sub;
}
</style>
