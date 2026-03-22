<template>
  <view class="follow-list-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>

    <view class="page-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-left" @click="goBack">
        <ui-icon name="arrow-left" :size="40" />
      </view>
      <view class="header-tabs">
        <view
          class="tab-item"
          :class="{ 'is-active': activeTab === 'following' }"
          @click="switchTab('following')"
        >
          <text class="tab-text">关注</text>
          <text class="tab-count">{{ followingCount }}</text>
        </view>
        <view
          class="tab-item"
          :class="{ 'is-active': activeTab === 'followers' }"
          @click="switchTab('followers')"
        >
          <text class="tab-text">粉丝</text>
          <text class="tab-count">{{ followersCount }}</text>
        </view>
      </view>
      <view class="header-right"></view>
    </view>

    <scroll-view
      scroll-y
      class="content-scroll"
      :style="{ height: scrollHeight + 'px' }"
      @scrolltolower="loadMore"
    >
      <view class="user-list">
        <view
          v-for="user in userList"
          :key="user.userId"
          class="user-card"
          @click="goUserProfile(user)"
        >
          <ui-avatar :src="user.avatar" :size="96" />
          <view class="user-info">
            <view class="name-row">
              <text class="user-name">{{ user.nickname || '用户' }}</text>
              <view v-if="user.gender === 1" class="gender-icon male">
                <ui-icon name="user" :size="24" color="primary" />
              </view>
              <view v-else-if="user.gender === 2" class="gender-icon female">
                <ui-icon name="user" :size="24" color="error" />
              </view>
            </view>
            <text v-if="user.signature" class="user-signature">{{ user.signature }}</text>
            <text v-if="user.createdAt" class="follow-time">关注于 {{ formatTime(user.createdAt) }}</text>
          </view>
          <view
            v-if="!isOwnProfile || activeTab === 'followers'"
            class="follow-btn"
            :class="{ 'is-followed': user.isFollowed }"
            @click.stop="toggleFollow(user)"
          >
            <text>{{ user.isFollowed ? '已关注' : '关注' }}</text>
          </view>
        </view>
      </view>

      <view v-if="loading" class="loading-state">
        <text>加载中...</text>
      </view>

      <view v-if="!loading && userList.length === 0" class="empty-state">
        <ui-icon name="users" :size="120" color="disabled" />
        <text class="empty-text">{{ activeTab === 'following' ? '暂无关注的用户' : '暂无粉丝' }}</text>
      </view>

      <view v-if="!loading && !hasMore && userList.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useUserStore } from '@/stores';
import { authApi, type FollowUserItem } from '@/api/auth';
import { formatTimeAgo } from '@/utils/date';
import { logError } from '@/utils/logger';

const appStore = useAppStore();
const userStore = useUserStore();
const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const scrollHeight = ref(0);

const userId = ref('');
const activeTab = ref<'following' | 'followers'>('following');
const userList = ref<FollowUserItem[]>([]);
const loading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);

const followingCount = ref(0);
const followersCount = ref(0);

const isOwnProfile = computed(() => userId.value === appStore.userId);

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  scrollHeight.value = systemInfo.windowHeight - 44 - safeAreaTop.value;
});

onLoad((options: any) => {
  // 检查登录状态
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    uni.setStorageSync('redirectUrl', `/pages-sub/user/follow/index?id=${options.id || ''}&tab=${options.tab || ''}`);
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }

  if (options.id) {
    userId.value = options.id;
  }
  if (options.tab) {
    activeTab.value = options.tab as 'following' | 'followers';
  }
  if (options.following) {
    followingCount.value = parseInt(options.following) || 0;
  }
  if (options.followers) {
    followersCount.value = parseInt(options.followers) || 0;
  }
  fetchList();
});

const fetchList = async (page: number = 1) => {
  if (loading.value || !userId.value) return;
  loading.value = true;

  try {
    const params = { page, size: 20 };
    const result = activeTab.value === 'following'
      ? await authApi.getFollowingList(userId.value, params)
      : await authApi.getFollowersList(userId.value, params);

    const list = result.list || [];

    if (page === 1) {
      userList.value = list;
    } else {
      userList.value = [...userList.value, ...list];
    }

    currentPage.value = page;
    hasMore.value = result.hasMore || false;

    // Update counts from result if available
    if (activeTab.value === 'following' && result.total !== undefined) {
      followingCount.value = result.total;
    } else if (activeTab.value === 'followers' && result.total !== undefined) {
      followersCount.value = result.total;
    }
  } catch (error) {
    logError('获取列表失败:', error);
    uni.showToast({
      title: '获取列表失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (loading.value || !hasMore.value) return;
  fetchList(currentPage.value + 1);
};

const switchTab = (tab: 'following' | 'followers') => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  currentPage.value = 1;
  userList.value = [];
  hasMore.value = true;
  fetchList(1);
};

const toggleFollow = async (user: FollowUserItem) => {
  try {
    if (user.isFollowed) {
      await authApi.unfollowUser(user.userId);
      user.isFollowed = false;
      followingCount.value = Math.max(0, followingCount.value - 1);
      uni.showToast({ title: '已取消关注', icon: 'none' });
    } else {
      await authApi.followUser(user.userId);
      user.isFollowed = true;
      followingCount.value += 1;
      uni.showToast({ title: '关注成功', icon: 'none' });
    }
    if (isOwnProfile.value) {
      await userStore.refreshUserInfo();
    }
  } catch (error) {
    logError('关注操作失败:', error);
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    });
  }
};

const goBack = () => {
  uni.navigateBack();
};

const goUserProfile = (user: FollowUserItem) => {
  uni.navigateTo({
    url: `/pages-sub/community/user/index?id=${user.userId}`
  });
};

const formatTime = (time: string) => {
  if (!time) return '';
  try {
    return formatTimeAgo(time);
  } catch {
    return time;
  }
};
</script>

<style lang="scss" scoped>
.follow-list-page {
  min-height: 100vh;
  background: $color-bg-page;
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
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-bottom: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));

  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.header-left {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  width: 72rpx;
}

.header-tabs {
  display: flex;
  gap: $space-lg;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
  border-radius: $radius-full;
  transition: all $duration-fast $ease-spring;

  .tab-text {
    font-size: $font-size-md;
    @include text-sub;
    font-weight: $font-weight-medium;
  }

  .tab-count {
    font-size: $font-size-xs;
    @include text-sub;
    background: $color-bg-gray;
    padding: 2rpx 12rpx;
    border-radius: $radius-full;

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));

    .tab-text {
      color: var(--color-primary, #FF6A00);
    }

    .tab-count {
      background: var(--color-primary, #FF6A00);
      color: $color-white;
    }
  }
}

.content-scroll {
  margin-top: 88rpx;
  padding-top: $space-md;
}

.user-list {
  padding: 0 $space-md;
}

.user-card {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  margin-bottom: $space-md;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));

  &:active {
    background: var(--glass-pressed, rgba(255, 255, 255, 0.95));
  }
}

.user-info {
  flex: 1;
  margin-left: $space-md;
  min-width: 0;

  .name-row {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }

  .user-name {
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    @include text-main;
  }

  .gender-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;

    &.male {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    }

    &.female {
      background: rgba(255, 59, 48, 0.12);
    }
  }

  .user-signature {
    font-size: $font-size-sm;
    @include text-sub;
    margin-top: 4rpx;
    @include text-ellipsis(1);
  }

  .follow-time {
    font-size: $font-size-xs;
    @include text-disabled;
    margin-top: 4rpx;
  }
}

.follow-btn {
  padding: $space-sm $space-lg;
  border-radius: $radius-full;
  background: $gradient-sunset;
  flex-shrink: 0;

  text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-white;
  }

  &.is-followed {
    background: var(--color-success-glass, rgba(52, 199, 89, 0.12));
    border: 2rpx solid var(--color-success, #34C759);

    text {
      color: var(--color-success, #34C759);
    }
  }
}

.loading-state,
.no-more {
  padding: $space-lg;
  text-align: center;

  text {
    font-size: $font-size-sm;
    @include text-disabled;
  }
}

.empty-state {
  @include flex-column-center;
  padding: 160rpx 0;

  .empty-text {
    font-size: $font-size-md;
    @include text-sub;
    margin-top: $space-md;
  }
}

.bottom-space {
  height: 60rpx;
}
</style>
