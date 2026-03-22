<template>
  <view class="user-profile-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="profile-scroll"
      :style="{ height: scrollHeight + 'px' }"
      @scroll="handleScroll"
    >
      <view class="scroll-content">
        <view class="header-section" :style="{ paddingTop: safeAreaTop + 'px' }">
          <view class="header-bg">
            <image 
              v-if="userInfo.cover" 
              :src="userInfo.cover" 
              class="cover-image"
              mode="aspectFill"
            />
            <view class="cover-overlay"></view>
          </view>
          
          <view class="header-actions">
            <view class="back-btn" @click="goBack">
              <ui-icon name="arrow-left" :size="40" color="white" />
            </view>
            <view class="right-actions">
              <view class="action-btn" @click="handleShare">
                <ui-icon name="share" :size="40" color="white" />
              </view>
              <view class="action-btn" @click="showMoreOptions = true">
                <ui-icon name="more" :size="40" color="white" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="user-info-section">
          <view class="avatar-row">
            <ui-avatar :src="userInfo.avatar" :size="160" :border="true" />
            <view v-if="isOwnProfile" class="edit-btn" @click="goEditProfile">
              <ui-icon name="edit" :size="28" color="primary" />
              <text>编辑</text>
            </view>
            <view v-else class="action-btns">
              <view 
                class="follow-btn" 
                :class="{ 'is-followed': userInfo.isFollowed }"
                @click="toggleFollow"
              >
                <ui-icon
                  :name="userInfo.isFollowed ? 'check' : 'plus'"
                  :size="32"
                  :color="userInfo.isFollowed ? 'success' : 'white'"
                />
                <text>{{ userInfo.isFollowed ? '已关注' : '关注' }}</text>
              </view>
              <view class="message-btn" @click="goChat">
                <ui-icon name="message-circle" :size="32" color="primary" />
                <text>私信</text>
              </view>
            </view>
          </view>
          
          <view class="user-main">
            <view class="name-row">
              <text class="user-name">{{ userInfo.name }}</text>
              <view v-if="userInfo.isVerified" class="verified-badge">
                <ui-icon name="check-circle" :size="28" color="success" />
              </view>
              <view v-if="userInfo.levelName" class="level-badge">
                <text>{{ userInfo.levelName }}</text>
              </view>
            </view>
            
            <text v-if="userInfo.signature" class="user-signature">{{ userInfo.signature }}</text>
            
            <view class="user-tags" v-if="userInfo.tags?.length">
              <text 
                v-for="tag in userInfo.tags" 
                :key="tag" 
                class="tag-item"
              >{{ tag }}</text>
            </view>
            
            <view class="user-location" v-if="userInfo.location">
              <ui-icon name="map-pin" :size="24" color="placeholder" />
              <text>{{ userInfo.location }}</text>
            </view>
          </view>
          
          <view class="user-stats">
            <view class="stat-item" @click="showFollowers">
              <text class="stat-value">{{ formatCount(userInfo.followersCount) }}</text>
              <text class="stat-label">粉丝</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item" @click="showFollowing">
              <text class="stat-value">{{ formatCount(userInfo.followingCount) }}</text>
              <text class="stat-label">关注</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value">{{ formatCount(userInfo.likesCount) }}</text>
              <text class="stat-label">获赞</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value">{{ formatCount(userInfo.postsCount) }}</text>
              <text class="stat-label">帖子</text>
            </view>
          </view>
        </view>
        
        <view class="nav-tabs" id="nav-tabs">
          <view 
            v-for="tab in navTabs" 
            :key="tab.value"
            class="nav-tab-item"
            :class="{ 'is-active': activeTab === tab.value }"
            @click="handleTabChange(tab.value)"
          >
            <text class="tab-text">{{ tab.label }}</text>
            <text v-if="tab.count" class="tab-count">{{ formatCount(tab.count) }}</text>
            <view v-if="activeTab === tab.value" class="tab-indicator" />
          </view>
        </view>
        
        <view class="tab-content">
          <view v-if="activeTab === 'posts'" class="posts-section">
            <view class="section-header">
              <text class="section-title">Ta的帖子</text>
              <view class="sort-btn" @click="showSortPicker = true">
                <text>{{ currentSortLabel }}</text>
                <ui-icon name="chevron-down" :size="28" />
              </view>
            </view>
            
            <view class="post-list">
              <view 
                v-for="post in postsList" 
                :key="post.id" 
                class="post-card"
                @click="goPostDetail(post)"
              >
                <view class="post-header">
                  <view class="post-time">
                    <text>{{ formatTimeAgo(post.createdAt) }}</text>
                  </view>
                  <view v-if="post.forumName" class="post-forum">
                    <text>{{ post.forumName }}</text>
                  </view>
                </view>
                
                <text class="post-title">{{ post.title }}</text>
                <text class="post-content">{{ post.content }}</text>
                
                <view v-if="post.images?.length" class="post-images">
                  <image 
                    v-for="(img, idx) in post.images.slice(0, 3)" 
                    :key="idx"
                    :src="img" 
                    class="post-image"
                    mode="aspectFill"
                  />
                </view>
                
                <view class="post-footer">
                  <view class="footer-item">
                    <ui-icon name="heart" :size="28" color="placeholder" />
                    <text>{{ post.likeCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="message-circle" :size="28" color="placeholder" />
                    <text>{{ post.commentCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="star" :size="28" color="placeholder" />
                    <text>{{ post.collectCount }}</text>
                  </view>
                </view>
              </view>
            </view>
            
            <view v-if="postsLoading" class="loading-more">
              <text>加载中...</text>
            </view>
            
            <view v-if="!postsHasMore && postsList.length > 0" class="no-more">
              <text>没有更多了</text>
            </view>
            
            <view v-if="!postsLoading && postsList.length === 0" class="empty-state">
              <ui-icon name="file-text" :size="120" color="disabled" />
              <text class="empty-text">暂无帖子</text>
            </view>
          </view>
          
          <view v-if="activeTab === 'collections'" class="collections-section">
            <view class="section-header">
              <text class="section-title">Ta的收藏</text>
            </view>
            
            <view class="collection-list">
              <view 
                v-for="post in collectionsList" 
                :key="post.id" 
                class="post-card"
                @click="goPostDetail(post)"
              >
                <text class="post-title">{{ post.title }}</text>
                <text class="post-content">{{ post.content }}</text>
                
                <view class="post-footer">
                  <view class="footer-item">
                    <ui-icon name="heart" :size="28" color="placeholder" />
                    <text>{{ post.likeCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="message-circle" :size="28" color="placeholder" />
                    <text>{{ post.commentCount }}</text>
                  </view>
                </view>
              </view>
            </view>
            
            <view v-if="!collectionsLoading && collectionsList.length === 0" class="empty-state">
              <ui-icon name="star" :size="120" color="disabled" />
              <text class="empty-text">暂无收藏</text>
            </view>
          </view>
          
          <view v-if="activeTab === 'likes'" class="likes-section">
            <view class="section-header">
              <text class="section-title">Ta的点赞</text>
            </view>
            
            <view class="likes-list">
              <view 
                v-for="post in likesList" 
                :key="post.id" 
                class="post-card"
                @click="goPostDetail(post)"
              >
                <text class="post-title">{{ post.title }}</text>
                <text class="post-content">{{ post.content }}</text>
                
                <view class="post-footer">
                  <view class="footer-item">
                    <ui-icon name="heart-fill" :size="28" color="error" />
                    <text>{{ post.likeCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="message-circle" :size="28" color="placeholder" />
                    <text>{{ post.commentCount }}</text>
                  </view>
                </view>
              </view>
            </view>
            
            <view v-if="!likesLoading && likesList.length === 0" class="empty-state">
              <ui-icon name="heart" :size="120" color="disabled" />
              <text class="empty-text">暂无点赞</text>
            </view>
          </view>
          
          <view v-if="activeTab === 'goods'" class="goods-section">
            <view class="section-header">
              <text class="section-title">Ta的商品</text>
              <text class="goods-count">共{{ formatCount(userInfo.goodsCount) }}件</text>
            </view>
            
            <view class="filter-bar">
              <view 
                v-for="filter in goodsFilters" 
                :key="filter.value"
                class="filter-item"
                :class="{ 'is-active': activeFilter === filter.value }"
                @click="handleFilterChange(filter.value)"
              >
                <text>{{ filter.label }}</text>
              </view>
            </view>
            
            <ui-waterfalls :list="goodsList" :columns="2" @click="goProductDetail">
              <template #item="{ item }">
                <view class="waterfall-card">
                  <view class="card-image">
                    <ui-image
                      :src="item.cover"
                      width="100%"
                      height="280rpx"
                      radius="12rpx 12rpx 0 0"
                    />
                    <view v-if="item.condition" class="condition-badge">
                      {{ item.condition }}
                    </view>
                    <view v-if="item.status === 'sold'" class="sold-badge">已售</view>
                  </view>
                  <view class="card-content">
                    <text class="card-title">{{ item.title }}</text>
                    <view class="card-footer">
                      <ui-price :value="item.price" :size="28" />
                      <text v-if="item.views" class="card-views">{{ item.views }}人浏览</text>
                    </view>
                  </view>
                </view>
              </template>
            </ui-waterfalls>
            
            <view v-if="goodsLoading" class="loading-more">
              <text>加载中...</text>
            </view>
            
            <view v-if="!goodsHasMore && goodsList.length > 0" class="no-more">
              <text>没有更多了</text>
            </view>
            
            <view v-if="!goodsLoading && goodsList.length === 0" class="empty-state">
              <ui-icon name="shopping-bag" :size="120" color="disabled" />
              <text class="empty-text">暂无商品</text>
            </view>
          </view>
        </view>
        
        <view class="bottom-space"></view>
      </view>
    </scroll-view>
    
    <ui-action-sheet 
      :show="showSortPicker" 
      :actions="sortOptions"
      @update:show="showSortPicker = $event"
      @select="handleSortSelect" 
    />
    
    <ui-action-sheet 
      :show="showMoreOptions" 
      :actions="moreOptions"
      @update:show="showMoreOptions = $event"
      @select="handleMoreSelect" 
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore, useUserStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import { forumApi, type PostListItem } from '@/api/community';
import { authApi, type UserDetailInfo } from '@/api/auth';
import { searchApi } from '@/api/search';
import { formatTimeAgo } from '@/utils/date';
import { logError } from '@/utils/logger';

interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  signature: string;
  level?: number;
  levelName?: string;
  isVerified: boolean;
  isFollowed: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  postsCount: number;
  goodsCount: number;
  tags: string[];
  location?: string;
}

interface Product {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  condition?: string;
  status?: string;
  views?: number;
}

const appStore = useAppStore();
const userStore = useUserStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const scrollHeight = ref(0);

const userId = ref('');
const activeTab = ref('posts');
const activeFilter = ref('all');
const showSortPicker = ref(false);
const showMoreOptions = ref(false);
const currentSort = ref('new');

const userInfo = ref<UserInfo>({
  id: '',
  name: '数码达人',
  avatar: 'https://picsum.photos/200/200?random=user1',
  cover: 'https://picsum.photos/800/400?random=cover1',
  signature: '专注数码产品测评与分享，欢迎交流讨论~',
  level: 5,
  levelName: 'LV5 达人',
  isVerified: true,
  isFollowed: false,
  followersCount: 25680,
  followingCount: 128,
  likesCount: 89990,
  postsCount: 156,
  goodsCount: 23,
  tags: ['数码测评', '摄影爱好者', '果粉'],
  location: '北京'
});

const navTabs = computed(() => [
  { label: '帖子', value: 'posts', count: userInfo.value.postsCount },
  { label: '收藏', value: 'collections', count: 0 },
  { label: '点赞', value: 'likes', count: 0 },
  { label: '商品', value: 'goods', count: userInfo.value.goodsCount }
]);

const sortOptions = ref([
  { name: '最新', value: 'new' },
  { name: '最热', value: 'hot' },
  { name: '精华', value: 'essence' }
]);

const moreOptions = computed(() => {
  if (isOwnProfile.value) {
    return [
      { name: '编辑资料', value: 'edit' },
      { name: '分享主页', value: 'share' }
    ];
  }
  return [
    { name: '分享主页', value: 'share' },
    { name: '举报', value: 'report' }
  ];
});

const currentSortLabel = computed(() => {
  const option = sortOptions.value.find(o => o.value === currentSort.value);
  return option?.name || '最新';
});

const goodsFilters = ref([
  { label: '全部', value: 'all' },
  { label: '在售', value: 'selling' },
  { label: '已售', value: 'sold' }
]);

const postsList = ref<PostListItem[]>([]);
const postsLoading = ref(false);
const postsHasMore = ref(true);

const collectionsList = ref<PostListItem[]>([]);
const collectionsLoading = ref(false);

const likesList = ref<PostListItem[]>([]);
const likesLoading = ref(false);

const goodsList = ref<Product[]>([]);
const goodsLoading = ref(false);
const goodsHasMore = ref(true);

const isOwnProfile = computed(() => {
  return userId.value === appStore.userId;
});

onMounted(() => {
  nextTick(() => {
    calcLayout();
  });
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  scrollHeight.value = systemInfo.windowHeight;
};

onLoad((options: any) => {
  if (options.id) {
    userId.value = options.id;
  }
  fetchUserInfo();
  fetchPosts();
  fetchGoods();
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const fetchUserInfo = async () => {
  if (!userId.value) return;

  try {
    const data = await authApi.getUserProfile(userId.value);
    userInfo.value = {
      id: data.id,
      name: data.nickname || '用户',
      avatar: data.avatar || 'https://picsum.photos/200/200?random=user1',
      cover: data.cover || '',
      signature: data.signature || '',
      level: data.level,
      levelName: data.levelName,
      isVerified: data.isVerified || false,
      isFollowed: data.isFollowed || false,
      followersCount: data.followersCount || data.followers || 0,
      followingCount: data.followingCount || data.following || 0,
      likesCount: data.likesCount || data.likes || 0,
      postsCount: data.postsCount || 0,
      goodsCount: data.goodsCount || 0,
      tags: data.tags || [],
      location: data.location
    };
  } catch (error) {
    logError('获取用户信息失败:', error);
    uni.showToast({
      title: '获取用户信息失败',
      icon: 'none'
    });
  }
};

const fetchPosts = async () => {
  if (!userId.value) return;

  postsLoading.value = true;

  try {
    const result = await forumApi.getUserPosts(userId.value, 1, 20);
    postsList.value = result.list;
    postsHasMore.value = result.hasMore;
  } catch (error) {
    logError('获取帖子列表失败:', error);
    postsList.value = [];
    postsHasMore.value = false;
  } finally {
    postsLoading.value = false;
  }
};

const fetchCollections = async () => {
  if (!userId.value) return;

  collectionsLoading.value = true;

  try {
    const result = await authApi.getUserCollections(userId.value, { page: 1, pageSize: 20 });
    collectionsList.value = result.list.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content || '',
      author: item.author || { id: userId.value, name: userInfo.value.name, avatar: userInfo.value.avatar },
      images: item.images || [],
      tags: item.tags || [],
      likeCount: item.likeCount || 0,
      commentCount: item.commentCount || 0,
      collectCount: item.collectCount || 0,
      isLiked: item.isLiked || false,
      isCollected: true,
      isPinned: false,
      isEssence: item.isEssence || false,
      createdAt: item.createdAt
    }));
  } catch (error) {
    logError('获取收藏列表失败:', error);
    collectionsList.value = [];
  } finally {
    collectionsLoading.value = false;
  }
};

const fetchLikes = async () => {
  if (!userId.value) return;

  likesLoading.value = true;

  try {
    const result = await authApi.getUserLikes(userId.value, { page: 1, pageSize: 20 });
    likesList.value = result.list.map((item: any) => ({
      id: item.id,
      title: item.title,
      content: item.content || '',
      author: item.author || { id: userId.value, name: userInfo.value.name, avatar: userInfo.value.avatar },
      images: item.images || [],
      tags: item.tags || [],
      likeCount: item.likeCount || 0,
      commentCount: item.commentCount || 0,
      collectCount: item.collectCount || 0,
      isLiked: true,
      isCollected: item.isCollected || false,
      isPinned: false,
      isEssence: item.isEssence || false,
      createdAt: item.createdAt
    }));
  } catch (error) {
    logError('获取点赞列表失败:', error);
    likesList.value = [];
  } finally {
    likesLoading.value = false;
  }
};

const fetchGoods = async () => {
  if (!userId.value) return;

  goodsLoading.value = true;

  try {
    const result = await authApi.getUserGoods(userId.value, {
      status: activeFilter.value as 'all' | 'selling' | 'sold',
      page: 1,
      pageSize: 20
    });
    goodsList.value = result.list.map((item: any) => ({
      id: item.id,
      cover: item.cover || item.images?.[0] || '',
      title: item.title || item.name,
      price: item.price,
      condition: item.condition,
      status: item.status,
      views: item.views || item.viewCount || 0
    }));
    goodsHasMore.value = result.hasMore;
  } catch (error) {
    logError('获取商品列表失败:', error);
    goodsList.value = [];
    goodsHasMore.value = false;
  } finally {
    goodsLoading.value = false;
  }
};

const handleScroll = (e: any) => {
};

const handleTabChange = (value: string) => {
  activeTab.value = value;
  
  if (value === 'collections' && collectionsList.value.length === 0) {
    fetchCollections();
  } else if (value === 'likes' && likesList.value.length === 0) {
    fetchLikes();
  }
};

const handleFilterChange = (value: string) => {
  activeFilter.value = value;
  fetchGoods();
};

const handleSortSelect = (item: any) => {
  currentSort.value = item.value;
  fetchPosts();
};

const handleMoreSelect = (item: any) => {
  if (item.value === 'edit') {
    uni.navigateTo({ url: '/pages-sub/user/profile/index' });
  } else if (item.value === 'share') {
    handleShare();
  } else if (item.value === 'report') {
    uni.showToast({ title: '举报功能开发中', icon: 'none' });
  }
};

const toggleFollow = async () => {
  if (!userId.value) return;

  try {
    if (userInfo.value.isFollowed) {
      await authApi.unfollowUser(userId.value);
      userInfo.value.isFollowed = false;
      userInfo.value.followersCount--;
      uni.showToast({ title: '已取消关注', icon: 'none' });
    } else {
      await authApi.followUser(userId.value);
      userInfo.value.isFollowed = true;
      userInfo.value.followersCount++;
      uni.showToast({ title: '关注成功', icon: 'none' });
    }
    await userStore.refreshUserInfo();
  } catch (error) {
    logError('关注操作失败:', error);
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    });
  }
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
};

const goBack = () => {
  smartBack();
};

const goEditProfile = () => {
  uni.navigateTo({ url: '/pages-sub/user/profile/index' });
};

const goChat = () => {
  uni.navigateTo({ url: `/pages-sub/chat/index?userId=${userId.value}` });
};

const showFollowers = () => {
  uni.navigateTo({
    url: `/pages-sub/user/follow/index?id=${userId.value}&tab=followers&followers=${userInfo.value.followersCount}&following=${userInfo.value.followingCount}`
  });
};

const showFollowing = () => {
  uni.navigateTo({
    url: `/pages-sub/user/follow/index?id=${userId.value}&tab=following&followers=${userInfo.value.followersCount}&following=${userInfo.value.followingCount}`
  });
};

const goPostDetail = (post: PostListItem) => {
  navigateTo(`/pages-sub/community/post/detail?id=${post.id}`);
};

const goProductDetail = (item: Product) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};
</script>

<style lang="scss" scoped>
.user-profile-page {
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
    width: 500rpx;
    height: 500rpx;
    top: 200rpx;
    right: -150rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 400rpx;
    height: 400rpx;
    bottom: 300rpx;
    left: -100rpx;
    background: $decoration-circle-2;
  }
}

.profile-scroll {
  position: relative;
  z-index: 1;
}

.header-section {
  position: relative;
  height: 400rpx;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  
  .cover-image {
    width: 100%;
    height: 100%;
  }
  
  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%);
  }
}

.header-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: $space-md;
  z-index: 10;
}

.back-btn,
.action-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 50%;
  
  &:active {
    transform: scale(0.92);
    background: rgba(0, 0, 0, 0.5);
  }
}

.right-actions {
  display: flex;
  gap: $space-sm;
}

.user-info-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin: -80rpx $space-md $space-md;
  border-radius: $radius-xl;
  padding: $space-lg;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-md;
  position: relative;
  z-index: 5;
}

.avatar-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $space-md;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: $space-xs $space-md;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border-radius: $radius-full;
  
  text {
    font-size: $font-size-sm;
    color: var(--color-primary, #FF6A00);
  }
}

.action-btns {
  display: flex;
  gap: $space-sm;
}

.follow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  background: $gradient-sunset;
  border-radius: $radius-full;
  padding: $space-sm $space-lg;
  
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

.message-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border: 2rpx solid var(--color-primary, #FF6A00);
  border-radius: $radius-full;
  padding: $space-sm $space-lg;
  
  text {
    font-size: $font-size-sm;
    color: var(--color-primary, #FF6A00);
  }
}

.user-main {
  .name-row {
    display: flex;
    align-items: center;
    gap: $space-xs;
    flex-wrap: wrap;
  }
  
  .user-name {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    @include text-main;
  }
  
  .verified-badge {
    display: flex;
  }
  
  .level-badge {
    font-size: $font-size-xs;
    color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    padding: 4rpx 12rpx;
    border-radius: $radius-full;
  }
  
  .user-signature {
    font-size: $font-size-sm;
    @include text-sub;
    margin-top: $space-sm;
    line-height: 1.5;
  }
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-top: $space-sm;
  
  .tag-item {
    font-size: $font-size-xs;
    @include text-sub;
    background: $color-bg-gray;
    padding: 6rpx 16rpx;
    border-radius: $radius-full;
    
    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.user-location {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: $space-sm;
  
  text {
    font-size: $font-size-xs;
    @include text-sub;
  }
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $space-md 0;
  margin-top: $space-md;
  background: $color-bg-gray;
  border-radius: $radius-lg;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .stat-item {
    @include flex-column-center;
    
    .stat-value {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      @include text-main;
    }
    
    .stat-label {
      font-size: $font-size-xs;
      @include text-sub;
      margin-top: 4rpx;
    }
  }
  
  .stat-divider {
    width: 1rpx;
    height: 60rpx;
    background: $color-divider;
    
    [data-theme="dark"] & {
      background: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
  }
}

.nav-tabs {
  display: flex;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin: 0 $space-md;
  border-radius: $radius-lg;
  padding: $space-xs;
}

.nav-tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: $space-md;
  border-radius: $radius-md;
  position: relative;
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

.tab-content {
  padding: $space-md;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-md;
  
  .section-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    @include text-main;
  }
  
  .sort-btn {
    display: flex;
    align-items: center;
    gap: 4rpx;
    
    text {
      font-size: $font-size-sm;
      @include text-sub;
    }
  }
  
  .goods-count {
    font-size: $font-size-sm;
    @include text-sub;
  }
}

.post-list,
.collection-list,
.likes-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.post-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-sm;
    
    .post-time {
      font-size: $font-size-xs;
      @include text-disabled;
    }
    
    .post-forum {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      padding: 4rpx 12rpx;
      border-radius: $radius-xs;
    }
  }
  
  .post-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    @include text-main;
    margin-bottom: $space-xs;
    line-height: 1.4;
  }
  
  .post-content {
    font-size: $font-size-sm;
    @include text-sub;
    line-height: 1.6;
    @include text-ellipsis(3);
    margin-bottom: $space-sm;
  }
  
  .post-images {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-sm;
    
    .post-image {
      width: 200rpx;
      height: 150rpx;
      border-radius: $radius-md;
    }
  }
  
  .post-footer {
    display: flex;
    gap: $space-lg;
    padding-top: $space-sm;
    border-top: 1rpx solid $color-divider;
    
    [data-theme="dark"] & {
      border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
    
    .footer-item {
      display: flex;
      align-items: center;
      gap: 4rpx;
      
      text {
        font-size: $font-size-sm;
        @include text-sub;
      }
    }
  }
}

.filter-bar {
  display: flex;
  gap: $space-sm;
  margin-bottom: $space-md;
}

.filter-item {
  padding: $space-sm $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-full;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  text {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    border-color: var(--color-primary, #FF6A00);
    
    text {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
  }
}

.waterfall-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-sm;
  
  .card-image {
    position: relative;
    
    .condition-badge {
      position: absolute;
      top: 8rpx;
      left: 8rpx;
      background: rgba(0, 0, 0, 0.6);
      color: $color-white;
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }

    .sold-badge {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      background: $color-error;
      color: $color-white;
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
      font-weight: $font-weight-medium;
    }
  }
  
  .card-content {
    padding: $space-sm;
    
    .card-title {
      font-size: $font-size-sm;
      @include text-main;
      @include text-ellipsis(2);
      line-height: 1.4;
      min-height: 64rpx;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-sm;
      
      .card-views {
        font-size: $font-size-xs;
        @include text-disabled;
      }
    }
  }
}

.loading-more,
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
  padding: 120rpx 0;
  
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
