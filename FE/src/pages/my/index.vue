<template>
  <view class="my-page">
    <view class="page-header" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
      <view class="user-header">
        <view class="user-info" @click="goProfile">
          <ui-avatar :src="userInfo.avatar" :size="120" :bordered="true" />
          <view class="user-detail">
            <ui-text size="xl" weight="bold" color="white">{{ userInfo.name }}</ui-text>
            <ui-text size="sm" color="white" class="user-desc">{{ userInfo.signature }}</ui-text>
            <view class="user-tags">
              <ui-tag v-if="userInfo.isVerified" type="success" size="sm">已认证</ui-tag>
              <ui-tag v-if="userInfo.isSeller" type="primary" size="sm">卖家</ui-tag>
            </view>
          </view>
          <ui-icon name="arrow-right" :size="40" color="var(--glass-shine, rgba(255,255,255,0.8))" />
        </view>
        
        <ui-card :glass="true" :shadow="false" radius="lg" padding="md" class="stats-card">
          <view class="user-stats">
            <view class="stat-item" @click="goFollowers">
              <ui-text size="xl" weight="bold" color="white">{{ userInfo.followers }}</ui-text>
              <ui-text size="xs" color="white">粉丝</ui-text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item" @click="goFollowing">
              <ui-text size="xl" weight="bold" color="white">{{ userInfo.following }}</ui-text>
              <ui-text size="xs" color="white">关注</ui-text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item" @click="goLikes">
              <ui-text size="xl" weight="bold" color="white">{{ userInfo.likes }}</ui-text>
              <ui-text size="xs" color="white">获赞</ui-text>
            </view>
          </view>
        </ui-card>
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="content-scroll" 
      :style="{ paddingTop: headerHeight + 'px', height: scrollHeight + 'px' }"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <view class="scroll-content">
        <ui-card :glass="true" :shadow="true" radius="lg" padding="md" class="order-section">
          <template #title>我的订单</template>
          <template #extra>
            <view class="section-more" @click="goOrders">
              <ui-text size="sm" color="sub">全部订单</ui-text>
              <ui-icon name="arrow-right" :size="32" color="sub" />
            </view>
          </template>
          
          <view class="order-tabs">
            <view class="order-item" @click="goOrders('pending')">
              <view class="order-icon">
                <ui-badge v-if="unreadCounts.pending > 0" :value="unreadCounts.pending">
                  <ui-icon name="wallet" :size="40" />
                </ui-badge>
                <ui-icon v-else name="wallet" :size="40" />
              </view>
              <ui-text size="xs" color="sub">待付款</ui-text>
            </view>
            <view class="order-item" @click="goOrders('shipped')">
              <view class="order-icon">
                <ui-badge v-if="unreadCounts.shipped > 0" :value="unreadCounts.shipped">
                  <ui-icon name="truck" :size="40" />
                </ui-badge>
                <ui-icon v-else name="truck" :size="40" />
              </view>
              <ui-text size="xs" color="sub">待发货</ui-text>
            </view>
            <view class="order-item" @click="goOrders('received')">
              <view class="order-icon">
                <ui-badge v-if="unreadCounts.received > 0" :value="unreadCounts.received">
                  <ui-icon name="package" :size="40" />
                </ui-badge>
                <ui-icon v-else name="package" :size="40" />
              </view>
              <ui-text size="xs" color="sub">待收货</ui-text>
            </view>
            <view class="order-item" @click="goOrders('reviewed')">
              <view class="order-icon">
                <ui-badge v-if="unreadCounts.reviewed > 0" :value="unreadCounts.reviewed">
                  <ui-icon name="star" :size="40" />
                </ui-badge>
                <ui-icon v-else name="star" :size="40" />
              </view>
              <ui-text size="xs" color="sub">待评价</ui-text>
            </view>
            <view class="order-item" @click="goAftersale">
              <view class="order-icon">
                <ui-badge v-if="unreadCounts.refund > 0" :value="unreadCounts.refund">
                  <ui-icon name="refresh" :size="40" />
                </ui-badge>
                <ui-icon v-else name="refresh" :size="40" />
              </view>
              <ui-text size="xs" color="sub">退款/售后</ui-text>
            </view>
          </view>
        </ui-card>
        
        <view class="menu-section">
          <ui-card :glass="true" :shadow="false" radius="lg" padding="sm" class="menu-group">
            <ui-cell title="我的店铺" icon="store" is-link separated @click="goShop" />
            <ui-cell title="我的发布" icon="edit" is-link separated @click="goMyPublish" />
            <ui-cell title="我的收藏" icon="heart" is-link separated @click="goCollection" />
            <ui-cell title="浏览足迹" icon="eye" is-link separated @click="goHistory" />
          </ui-card>
          
          <ui-card :glass="true" :shadow="false" radius="lg" padding="sm" class="menu-group">
            <ui-cell title="地址管理" icon="map-pin" is-link separated @click="goAddress" />
            <ui-cell title="我的钱包" icon="credit-card" is-link separated @click="goWallet" />
            <ui-cell title="实名认证" icon="shield" is-link separated @click="goAuth">
              <template #right-icon>
                <ui-text size="sm" :color="userInfo.isVerified ? 'success' : 'sub'">
                  {{ userInfo.isVerified ? '已认证' : '未认证' }}
                </ui-text>
              </template>
            </ui-cell>
          </ui-card>
          
          <ui-card :glass="true" :shadow="false" radius="lg" padding="sm" class="menu-group">
            <ui-cell title="帮助中心" icon="help-circle" is-link separated @click="goHelp" />
            <ui-cell title="意见反馈" icon="message" is-link separated @click="goFeedback" />
            <ui-cell title="设置" icon="settings" is-link separated @click="goSettings" />
          </ui-card>
          
          <view class="bottom-space"></view>
        </view>
      </view>
    </scroll-view>
    
    <TheTabbar current="my" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useUserStore, useAuthStore, useOrderStore } from '@/stores';
import { authApi } from '@/api';
import { logError } from '@/utils/logger';

const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
  hasTabbar: true,
  headerSelector: '.page-header',
  headerEstimatedHeight: 280
});

const userStore = useUserStore();
const authStore = useAuthStore();
const orderStore = useOrderStore();

const fetchUserInfo = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    const userInfo = await authApi.getUserInfo();
    userStore.setUserInfo(userInfo);
  } catch (error) {
    logError('获取用户信息失败:', error);
  }
};

const fetchOrderSummary = async () => {
  if (!authStore.isAuthenticated) return;

  try {
    // 获取订单数量统计（用于显示正确的角标数字）
    await orderStore.fetchOrderCount();
  } catch (error) {
    logError('获取订单统计失败:', error);
  }
};

onShow(() => {
  if (authStore.isAuthenticated) {
    fetchUserInfo();
    fetchOrderSummary();
  }
});

const userInfo = computed(() => ({
  avatar: userStore.userInfo?.avatar || '/static/default-avatar.png',
  name: userStore.userInfo?.nickname || '未登录',
  signature: userStore.userInfo?.signature || '点击登录',
  isVerified: authStore.isAuthenticated,
  isSeller: authStore.isSeller,
  followers: userStore.userInfo?.followers || 0,
  following: userStore.userInfo?.following || 0,
  likes: userStore.userInfo?.likes || 0
}));

// 后端状态名: PENDING_PAYMENT, PENDING_SHIPMENT, PENDING_RECEIPT, COMPLETED, REFUNDED
// 前端显示: 待付款, 待发货, 待收货, 待评价, 退款/售后
// orderCountByStatus 中: pending, paid, shipped, completed, refunding

// 未读订单数量（用于小红点显示）
const unreadCounts = computed(() => ({
  pending: orderStore.unreadCountByStatus.pending,       // 待付款
  shipped: orderStore.unreadCountByStatus.paid,          // 待发货
  received: orderStore.unreadCountByStatus.shipped,      // 待收货
  reviewed: orderStore.unreadCountByStatus.completed,    // 待评价
  refund: orderStore.unreadCountByStatus.refunding       // 退款/售后
}));

// my页面参数到 store status 的映射
const typeToStatusMap: Record<string, 'pending' | 'paid' | 'shipped' | 'completed' | 'refunding'> = {
  'pending': 'pending',      // 待付款
  'shipped': 'paid',         // 待发货
  'received': 'shipped',     // 待收货
  'reviewed': 'completed',   // 待评价
  'refund': 'refunding'      // 退款/售后
};

const goProfile = () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  uni.navigateTo({ url: '/pages-sub/user/profile/index' });
};

const checkAuthAndRedirect = () => {
  if (!authStore.isAuthenticated) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1500
    });
    setTimeout(() => {
      uni.navigateTo({ url: '/pages-sub/user/login/index' });
    }, 500);
    return false;
  }
  return true;
};

const goFollowers = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({
    url: `/pages-sub/user/follow/index?id=${authStore.userId}&tab=followers`
  });
};

const goFollowing = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({
    url: `/pages-sub/user/follow/index?id=${authStore.userId}&tab=following`
  });
};

const goLikes = () => {
  if (!checkAuthAndRedirect()) return;
  uni.showToast({ title: '获赞记录', icon: 'none' });
};

const goOrders = (type?: string) => {
  if (!checkAuthAndRedirect()) return;
  // 点击进入订单列表时，标记该状态为已读
  if (type && typeToStatusMap[type]) {
    orderStore.markStatusAsRead(typeToStatusMap[type]);
  }
  const url = type
    ? `/pages-sub/trade/order/list?type=${type}`
    : '/pages-sub/trade/order/list';
  uni.navigateTo({ url });
};

const goAftersale = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/trade/aftersale/list' });
};

const goShop = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/seller/shop/index' });
};

const goMyPublish = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/seller/goods/list' });
};

const goCollection = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/user/collection/index' });
};

const goHistory = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/user/history/index' });
};

const goAddress = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/user/address/list' });
};

const goWallet = () => {
  if (!checkAuthAndRedirect()) return;
  uni.navigateTo({ url: '/pages-sub/user/wallet/index' });
};

const goAuth = () => {
  if (!checkAuthAndRedirect()) return;
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

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
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
      
      .user-desc {
        display: block;
        opacity: 0.8;
        margin-top: $space-xs;
      }
      
      .user-tags {
        display: flex;
        gap: $space-xs;
        margin-top: $space-sm;
      }
    }
  }
  
  .stats-card {
    margin-top: $space-lg;
    background: rgba($color-white, 0.15) !important;
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    
    .stat-item {
      text-align: center;
      flex: 1;
    }
    
    .stat-divider {
      width: 1px;
      height: 48rpx;
      background: rgba($color-white, 0.3);
    }
  }
}

.content-scroll {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.scroll-content {
  padding-bottom: 120rpx;
}

.bottom-space {
  height: 32rpx;
}

.order-section {
  margin: $space-md;
  
  .section-more {
    display: flex;
    align-items: center;
  }
  
  .order-tabs {
    display: flex;
    justify-content: space-around;
    
    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .order-icon {
        width: 80rpx;
        height: 80rpx;
        @include flex-center;
        background: $color-bg-gray;
        border-radius: 50%;
        margin-bottom: $space-xs;
      }
    }
  }
}

.menu-section {
  .menu-group {
    margin: $space-md;
    background: transparent !important;
  }
}
</style>
