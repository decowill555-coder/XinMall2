<template>
  <view class="device-community-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="page-scroll"
      :style="{ height: scrollHeight + 'px' }"
      @scroll="handleScroll"
      :scroll-top="scrollTopValue"
    >
      <view class="scroll-content">
        <view class="swiper-section" :style="{ paddingTop: safeAreaTop + 'px' }">
          <swiper 
            class="device-swiper" 
            :indicator-dots="deviceImages.length > 1"
            indicator-color="rgba(255, 255, 255, 0.3)"
            indicator-active-color="rgba(255, 255, 255, 0.9)"
            :autoplay="false"
            :circular="true"
            @change="onSwiperChange"
          >
            <swiper-item v-for="(img, index) in deviceImages" :key="index">
              <view class="swiper-item" @click="previewImage(index)">
                <image 
                  :src="img" 
                  class="device-image" 
                  mode="aspectFill"
                />
              </view>
            </swiper-item>
          </swiper>
          
          <view class="swiper-overlay">
            <view class="back-btn" @click="goBack">
              <ui-icon name="arrow-left" :size="40" color="white" />
            </view>
            <view class="header-actions">
              <view class="action-btn" @click="handleShare">
                <ui-icon name="share" :size="40" color="white" />
              </view>
              <view class="action-btn" @click="handleMore">
                <ui-icon name="more" :size="40" color="white" />
              </view>
            </view>
          </view>
          
          <view class="image-counter">
            <text>{{ currentImageIndex + 1 }}/{{ deviceImages.length }}</text>
          </view>
        </view>
        
        <view class="device-info-section">
          <view class="device-header">
            <view class="device-title-row">
              <text class="device-name">{{ deviceInfo.name }}</text>
              <view v-if="deviceInfo.isHot" class="hot-badge">
                <ui-icon name="flame" :size="24" color="white" />
                <text>热门</text>
              </view>
            </view>
            
            <text class="device-subtitle">{{ deviceInfo.subtitle }}</text>
            
            <view class="device-stats">
              <view class="stat-item">
                <view class="stat-score">
                  <text class="score-value">{{ deviceInfo.score }}</text>
                  <text class="score-label">分</text>
                </view>
                <text class="stat-name">综合评分</text>
              </view>
              <view class="stat-divider"></view>
              <view class="stat-item">
                <text class="stat-value">{{ formatCount(deviceInfo.memberCount) }}</text>
                <text class="stat-name">关注</text>
              </view>
              <view class="stat-divider"></view>
              <view class="stat-item">
                <text class="stat-value">{{ formatCount(deviceInfo.postCount) }}</text>
                <text class="stat-name">讨论</text>
              </view>
              <view class="stat-divider"></view>
              <view class="stat-item">
                <text class="stat-value">{{ formatCount(deviceInfo.productCount) }}</text>
                <text class="stat-name">在售</text>
              </view>
            </view>
          </view>
          
          <view class="device-tags" v-if="deviceInfo.tags?.length">
            <text 
              v-for="(tag, index) in deviceInfo.tags" 
              :key="index" 
              class="tag-item"
            >{{ tag }}</text>
          </view>
          
          <view class="device-actions">
            <view 
              class="follow-btn" 
              :class="{ 'is-followed': deviceInfo.isFollowed }"
              @click="handleFollow"
            >
              <ui-icon 
                :name="deviceInfo.isFollowed ? 'check' : 'plus'" 
                :size="32" 
                :color="deviceInfo.isFollowed ? 'success' : 'white'" 
              />
              <text>{{ deviceInfo.isFollowed ? '已关注' : '关注' }}</text>
            </view>
            <view class="action-item" @click="goCompare">
              <ui-icon name="columns" :size="36" />
              <text>对比</text>
            </view>
            <view class="action-item" @click="goSpecs">
              <ui-icon name="file-text" :size="36" />
              <text>参数</text>
            </view>
            <view class="action-item" @click="goReviews">
              <ui-icon name="star" :size="36" />
              <text>评测</text>
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
          <view v-if="activeTab === 'discuss'" class="discuss-section">
            <view class="section-header">
              <text class="section-title">热门讨论</text>
              <view class="sort-btn" @click="showSortPicker = true">
                <text>{{ currentSortLabel }}</text>
                <ui-icon name="chevron-down" :size="28" />
              </view>
            </view>
            
            <view class="post-list">
              <view 
                v-for="post in discussList" 
                :key="post.id" 
                class="post-card"
                @click="goPostDetail(post)"
              >
                <view class="post-header">
                  <ui-avatar :src="post.authorAvatar" :size="72" />
                  <view class="author-info">
                    <view class="author-row">
                      <text class="author-name">{{ post.authorName }}</text>
                      <view v-if="post.isVerified" class="verified-badge">
                        <ui-icon name="check-circle" :size="24" color="success" />
                      </view>
                    </view>
                    <text class="post-time">{{ post.time }}</text>
                  </view>
                  <view class="post-tag" v-if="post.tag">{{ post.tag }}</view>
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
                  <view class="footer-item" @click.stop="likePost(post)">
                    <ui-icon 
                      :name="post.isLiked ? 'heart-fill' : 'heart'" 
                      :size="32" 
                      :color="post.isLiked ? 'error' : 'placeholder'" 
                    />
                    <text :class="{ 'is-liked': post.isLiked }">{{ post.likeCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="message-circle" :size="32" color="placeholder" />
                    <text>{{ post.commentCount }}</text>
                  </view>
                  <view class="footer-item" @click.stop="sharePost(post)">
                    <ui-icon name="share" :size="32" color="placeholder" />
                    <text>{{ post.shareCount }}</text>
                  </view>
                </view>
              </view>
            </view>
            
            <view v-if="discussLoading" class="loading-more">
              <text>加载中...</text>
            </view>
            
            <view v-if="!discussHasMore && discussList.length > 0" class="no-more">
              <text>没有更多了</text>
            </view>
          </view>
          
          <view v-if="activeTab === 'review'" class="review-section">
            <view class="section-header">
              <text class="section-title">用户评价</text>
              <view class="write-review-btn" @click="goWriteReview">
                <ui-icon name="edit" :size="28" />
                <text>写评价</text>
              </view>
            </view>
            
            <view class="score-overview">
              <view class="score-main">
                <text class="score-number">{{ deviceInfo.score }}</text>
                <view class="score-stars">
                  <ui-rate :value="deviceInfo.score / 2" :size="28" readonly />
                </view>
                <text class="score-count">{{ formatCount(deviceInfo.reviewCount) }}条评价</text>
              </view>
              <view class="score-bars">
                <view 
                  v-for="(bar, index) in scoreBars" 
                  :key="index" 
                  class="score-bar-item"
                >
                  <text class="bar-label">{{ bar.label }}</text>
                  <view class="bar-track">
                    <view class="bar-fill" :style="{ width: bar.percent + '%' }" />
                  </view>
                  <text class="bar-percent">{{ bar.percent }}%</text>
                </view>
              </view>
            </view>
            
            <view class="review-list">
              <view 
                v-for="review in reviewList" 
                :key="review.id" 
                class="review-card"
              >
                <view class="review-header">
                  <ui-avatar :src="review.authorAvatar" :size="64" />
                  <view class="review-author">
                    <text class="author-name">{{ review.authorName }}</text>
                    <view class="review-meta">
                      <ui-rate :value="review.score" :size="20" readonly />
                      <text class="review-time">{{ review.time }}</text>
                    </view>
                  </view>
                </view>
                
                <text class="review-content">{{ review.content }}</text>
                
                <view v-if="review.images?.length" class="review-images">
                  <image 
                    v-for="(img, idx) in review.images.slice(0, 4)" 
                    :key="idx"
                    :src="img" 
                    class="review-image"
                    mode="aspectFill"
                  />
                </view>
                
                <view class="review-footer">
                  <view class="footer-item">
                    <ui-icon name="thumbs-up" :size="28" color="placeholder" />
                    <text>{{ review.likeCount }}</text>
                  </view>
                  <view class="footer-item">
                    <ui-icon name="message" :size="28" color="placeholder" />
                    <text>{{ review.replyCount }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="activeTab === 'trade'" class="trade-section">
            <view class="section-header">
              <text class="section-title">在售商品</text>
              <text class="product-count">共{{ formatCount(deviceInfo.productCount) }}件</text>
            </view>
            
            <view class="filter-bar">
              <view 
                v-for="filter in tradeFilters" 
                :key="filter.value"
                class="filter-item"
                :class="{ 'is-active': activeFilter === filter.value }"
                @click="handleFilterChange(filter.value)"
              >
                <text>{{ filter.label }}</text>
              </view>
            </view>
            
            <ui-waterfalls :list="productList" :columns="2" @click="goProductDetail">
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
                    <view v-if="item.isNew" class="new-badge">新品</view>
                  </view>
                  <view class="card-content">
                    <text class="card-title">{{ item.title }}</text>
                    <view class="card-specs" v-if="item.specs">
                      <text class="spec-text">{{ item.specs }}</text>
                    </view>
                    <view class="card-footer">
                      <ui-price :value="item.price" :size="28" />
                      <text class="card-sales">{{ item.sales }}人付款</text>
                    </view>
                  </view>
                </view>
              </template>
            </ui-waterfalls>
            
            <view v-if="productLoading" class="loading-more">
              <text>加载中...</text>
            </view>
            
            <view v-if="!productHasMore && productList.length > 0" class="no-more">
              <text>没有更多了</text>
            </view>
            
            <view v-if="!productLoading && productList.length === 0" class="empty-state">
              <ui-icon name="inbox" :size="120" color="disabled" />
              <text class="empty-text">暂无在售商品</text>
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';

interface DeviceInfo {
  id: string;
  name: string;
  subtitle: string;
  score: number;
  memberCount: number;
  postCount: number;
  productCount: number;
  reviewCount: number;
  isFollowed: boolean;
  isHot: boolean;
  tags: string[];
}

interface Post {
  id: string | number;
  authorAvatar: string;
  authorName: string;
  isVerified: boolean;
  time: string;
  title: string;
  content: string;
  images: string[];
  tag?: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

interface Review {
  id: string | number;
  authorAvatar: string;
  authorName: string;
  score: number;
  time: string;
  content: string;
  images: string[];
  likeCount: number;
  replyCount: number;
}

interface Product {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  sales: number;
  condition?: string;
  specs?: string;
  isNew?: boolean;
}

const appStore = useAppStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const scrollHeight = ref(0);

const deviceId = ref('');
const currentImageIndex = ref(0);
const activeTab = ref('discuss');
const activeFilter = ref('recommend');
const showSortPicker = ref(false);
const currentSort = ref('hot');
const scrollTopValue = ref(0);

const deviceImages = ref([
  'https://picsum.photos/800/600?random=d1',
  'https://picsum.photos/800/600?random=d2',
  'https://picsum.photos/800/600?random=d3'
]);

const deviceInfo = ref<DeviceInfo>({
  id: '',
  name: 'iPhone 15 Pro Max',
  subtitle: 'Apple 2023年旗舰 · 钛金属边框 · A17 Pro芯片',
  score: 9.2,
  memberCount: 125680,
  postCount: 8923,
  productCount: 1567,
  reviewCount: 3456,
  isFollowed: false,
  isHot: true,
  tags: ['旗舰手机', '苹果', '钛金属', 'A17 Pro']
});

const navTabs = computed(() => [
  { label: '讨论', value: 'discuss', count: deviceInfo.value.postCount },
  { label: '评价', value: 'review', count: deviceInfo.value.reviewCount },
  { label: '交易', value: 'trade', count: deviceInfo.value.productCount }
]);

const scoreBars = ref([
  { label: '性能', percent: 95 },
  { label: '续航', percent: 78 },
  { label: '拍照', percent: 92 },
  { label: '屏幕', percent: 88 },
  { label: '手感', percent: 85 }
]);

const sortOptions = ref([
  { name: '最热', value: 'hot' },
  { name: '最新', value: 'new' },
  { name: '精华', value: 'essence' }
]);

const currentSortLabel = computed(() => {
  const option = sortOptions.value.find(o => o.value === currentSort.value);
  return option?.name || '最热';
});

const tradeFilters = ref([
  { label: '推荐', value: 'recommend' },
  { label: '最新', value: 'new' },
  { label: '价格', value: 'price' },
  { label: '销量', value: 'sales' }
]);

const discussList = ref<Post[]>([]);
const discussLoading = ref(false);
const discussHasMore = ref(true);

const reviewList = ref<Review[]>([]);

const productList = ref<Product[]>([]);
const productLoading = ref(false);
const productHasMore = ref(true);

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
    deviceId.value = options.id;
  }
  if (options.name) {
    deviceInfo.value.name = decodeURIComponent(options.name);
  }
  fetchDeviceData();
  fetchDiscussList();
  fetchReviewList();
  fetchProductList();
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const fetchDeviceData = async () => {
  
};

const fetchDiscussList = async () => {
  discussLoading.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockPosts: Post[] = [
    {
      id: 1,
      authorAvatar: 'https://picsum.photos/100/100?random=u1',
      authorName: '数码达人',
      isVerified: true,
      time: '2小时前',
      title: 'iPhone 15 Pro Max 深度测评：钛金属边框真的轻了很多',
      content: '使用了一周，整体体验非常棒。钛金属边框确实比不锈钢轻了不少，手感提升明显。A17 Pro芯片性能强劲，玩游戏完全不卡顿...',
      images: [
        'https://picsum.photos/400/300?random=p1',
        'https://picsum.photos/400/300?random=p2'
      ],
      tag: '评测',
      isLiked: false,
      likeCount: 256,
      commentCount: 45,
      shareCount: 12
    },
    {
      id: 2,
      authorAvatar: 'https://picsum.photos/100/100?random=u2',
      authorName: '科技小白',
      isVerified: false,
      time: '5小时前',
      title: '续航实测：日常使用一天完全没问题',
      content: '今天测试了一下续航，早上8点出门，晚上8点回家还有35%的电。中间刷微博、看视频、聊微信，中度使用...',
      images: [],
      isLiked: true,
      likeCount: 189,
      commentCount: 32,
      shareCount: 8
    },
    {
      id: 3,
      authorAvatar: 'https://picsum.photos/100/100?random=u3',
      authorName: '摄影爱好者',
      isVerified: true,
      time: '昨天',
      title: '5倍长焦镜头太香了！样张分享',
      content: '作为摄影爱好者，5倍长焦镜头是我最期待的功能。实际使用下来，画质非常出色，特别是在拍远景的时候...',
      images: [
        'https://picsum.photos/400/300?random=p3',
        'https://picsum.photos/400/300?random=p4',
        'https://picsum.photos/400/300?random=p5'
      ],
      tag: '摄影',
      isLiked: false,
      likeCount: 345,
      commentCount: 67,
      shareCount: 23
    }
  ];
  
  discussList.value = mockPosts;
  discussLoading.value = false;
};

const fetchReviewList = async () => {
  const mockReviews: Review[] = [
    {
      id: 1,
      authorAvatar: 'https://picsum.photos/100/100?random=r1',
      authorName: '果粉老王',
      score: 5,
      time: '3天前',
      content: '从iPhone 13 Pro Max换过来的，提升真的很明显。钛金属边框手感太好了，重量减轻后单手操作更轻松。续航也比之前强了不少。',
      images: ['https://picsum.photos/200/200?random=ri1'],
      likeCount: 56,
      replyCount: 8
    },
    {
      id: 2,
      authorAvatar: 'https://picsum.photos/100/100?random=r2',
      authorName: '科技控',
      score: 4,
      time: '1周前',
      content: '整体很满意，就是价格有点贵。性能、拍照、屏幕都是顶级水平，就是希望苹果能在快充上再给力一点。',
      images: [],
      likeCount: 34,
      replyCount: 5
    }
  ];
  
  reviewList.value = mockReviews;
};

const fetchProductList = async () => {
  productLoading.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockProducts: Product[] = [
    {
      id: 1,
      cover: 'https://picsum.photos/400/400?random=pr1',
      title: 'iPhone 15 Pro Max 256GB 原色钛金属 全新未拆封',
      price: 8999,
      sales: 256,
      condition: '全新',
      specs: '256GB / 原色钛金属',
      isNew: true
    },
    {
      id: 2,
      cover: 'https://picsum.photos/400/400?random=pr2',
      title: 'iPhone 15 Pro Max 512GB 蓝色钛金属 99新',
      price: 8299,
      sales: 189,
      condition: '99新',
      specs: '512GB / 蓝色钛金属'
    },
    {
      id: 3,
      cover: 'https://picsum.photos/400/400?random=pr3',
      title: 'iPhone 15 Pro Max 1TB 黑色钛金属 官换机',
      price: 9599,
      sales: 98,
      condition: '官换',
      specs: '1TB / 黑色钛金属'
    },
    {
      id: 4,
      cover: 'https://picsum.photos/400/400?random=pr4',
      title: 'iPhone 15 Pro Max 256GB 白色钛金属 95新',
      price: 7699,
      sales: 145,
      condition: '95新',
      specs: '256GB / 白色钛金属'
    }
  ];
  
  productList.value = mockProducts;
  productLoading.value = false;
};

const handleScroll = (e: any) => {
  
};

const onSwiperChange = (e: any) => {
  currentImageIndex.value = e.detail.current;
};

const previewImage = (index: number) => {
  uni.previewImage({
    current: index,
    urls: deviceImages.value
  });
};

const handleTabChange = (value: string) => {
  activeTab.value = value;
};

const handleFilterChange = (value: string) => {
  activeFilter.value = value;
  fetchProductList();
};

const handleSortSelect = (item: any) => {
  currentSort.value = item.value;
  fetchDiscussList();
};

const handleFollow = () => {
  deviceInfo.value.isFollowed = !deviceInfo.value.isFollowed;
  uni.showToast({ 
    title: deviceInfo.value.isFollowed ? '关注成功' : '已取消关注', 
    icon: 'none' 
  });
};

const handleShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

const handleMore = () => {
  uni.showToast({ title: '更多功能开发中', icon: 'none' });
};

const likePost = (post: Post) => {
  post.isLiked = !post.isLiked;
  post.likeCount += post.isLiked ? 1 : -1;
};

const sharePost = (post: Post) => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' });
    }
  });
};

const goCompare = () => {
  uni.showToast({ title: '对比功能开发中', icon: 'none' });
};

const goSpecs = () => {
  uni.showToast({ title: '参数功能开发中', icon: 'none' });
};

const goReviews = () => {
  activeTab.value = 'review';
};

const goWriteReview = () => {
  uni.showToast({ title: '写评价功能开发中', icon: 'none' });
};

const goPostDetail = (post: Post) => {
  navigateTo(`/pages-sub/community/post/detail?id=${post.id}`);
};

const goProductDetail = (item: Product) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};
</script>

<style lang="scss" scoped>
.device-community-page {
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
    top: 100rpx;
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

.page-scroll {
  position: relative;
  z-index: 1;
}

.swiper-section {
  position: relative;
  height: 560rpx;
}

.device-swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.device-image {
  width: 100%;
  height: 100%;
}

.swiper-overlay {
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

.header-actions {
  display: flex;
  gap: $space-sm;
}

.image-counter {
  position: absolute;
  bottom: $space-md;
  right: $space-md;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 8rpx 20rpx;
  border-radius: $radius-full;
  
  text {
    font-size: $font-size-xs;
    color: #FFFFFF;
  }
}

.device-info-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin: $space-md;
  border-radius: $radius-xl;
  padding: $space-lg;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-md;
}

.device-header {
  .device-title-row {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-xs;
  }
  
  .device-name {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    @include text-main;
  }
  
  .hot-badge {
    display: flex;
    align-items: center;
    gap: 4rpx;
    background: linear-gradient(135deg, #FF6A00 0%, #FF3B30 100%);
    padding: 4rpx 12rpx;
    border-radius: $radius-full;
    
    text {
      font-size: $font-size-xs;
      color: #FFFFFF;
      font-weight: $font-weight-medium;
    }
  }
  
  .device-subtitle {
    font-size: $font-size-sm;
    @include text-sub;
    margin-bottom: $space-md;
  }
}

.device-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $space-md 0;
  background: $color-bg-gray;
  border-radius: $radius-lg;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .stat-item {
    @include flex-column-center;
    
    .stat-score {
      display: flex;
      align-items: baseline;
      
      .score-value {
        font-size: 48rpx;
        font-weight: $font-weight-bold;
        color: var(--color-primary, #FF6A00);
      }
      
      .score-label {
        font-size: $font-size-sm;
        color: var(--color-primary, #FF6A00);
        margin-left: 4rpx;
      }
    }
    
    .stat-value {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      @include text-main;
    }
    
    .stat-name {
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

.device-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-top: $space-md;
  
  .tag-item {
    font-size: $font-size-xs;
    color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    padding: 8rpx 16rpx;
    border-radius: $radius-full;
  }
}

.device-actions {
  display: flex;
  align-items: center;
  gap: $space-md;
  margin-top: $space-lg;
  
  .follow-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    background: $gradient-sunset;
    border-radius: $radius-full;
    padding: $space-md;
    transition: all $duration-fast $ease-spring;
    
    text {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: #FFFFFF;
    }
    
    &.is-followed {
      background: var(--color-success-glass, rgba(52, 199, 89, 0.12));
      border: 2rpx solid var(--color-success, #34C759);
      
      text {
        color: var(--color-success, #34C759);
      }
    }
    
    &:active {
      transform: scale(0.96);
    }
  }
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;
    padding: $space-sm $space-md;
    
    text {
      font-size: $font-size-xs;
      @include text-sub;
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
  position: sticky;
  top: 0;
  z-index: $z-sticky;
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
      color: #FFFFFF;
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
  
  .product-count {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  .write-review-btn {
    display: flex;
    align-items: center;
    gap: 4rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    padding: $space-xs $space-md;
    border-radius: $radius-full;
    
    text {
      font-size: $font-size-sm;
      color: var(--color-primary, #FF6A00);
    }
  }
}

.post-list {
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
    align-items: center;
    margin-bottom: $space-sm;
    
    .author-info {
      flex: 1;
      margin-left: $space-sm;
      
      .author-row {
        display: flex;
        align-items: center;
        gap: 4rpx;
      }
      
      .author-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        @include text-main;
      }
      
      .post-time {
        font-size: $font-size-xs;
        @include text-sub;
      }
    }
    
    .post-tag {
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
        
        &.is-liked {
          color: $color-error;
        }
      }
    }
  }
}

.score-overview {
  display: flex;
  gap: $space-lg;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-lg;
  margin-bottom: $space-md;
  
  .score-main {
    @include flex-column-center;
    
    .score-number {
      font-size: 80rpx;
      font-weight: $font-weight-bold;
      color: var(--color-primary, #FF6A00);
      line-height: 1;
    }
    
    .score-stars {
      margin: $space-sm 0;
    }
    
    .score-count {
      font-size: $font-size-xs;
      @include text-sub;
    }
  }
  
  .score-bars {
    flex: 1;
    
    .score-bar-item {
      display: flex;
      align-items: center;
      margin-bottom: $space-sm;
      
      .bar-label {
        width: 80rpx;
        font-size: $font-size-xs;
        @include text-sub;
      }
      
      .bar-track {
        flex: 1;
        height: 12rpx;
        background: $color-bg-gray;
        border-radius: $radius-full;
        margin: 0 $space-sm;
        
        [data-theme="dark"] & {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .bar-fill {
          height: 100%;
          background: $gradient-sunset;
          border-radius: $radius-full;
        }
      }
      
      .bar-percent {
        width: 80rpx;
        font-size: $font-size-xs;
        @include text-sub;
        text-align: right;
      }
    }
  }
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.review-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  
  .review-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-sm;
    
    .review-author {
      flex: 1;
      margin-left: $space-sm;
      
      .author-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        @include text-main;
      }
      
      .review-meta {
        display: flex;
        align-items: center;
        gap: $space-sm;
        margin-top: 4rpx;
        
        .review-time {
          font-size: $font-size-xs;
          @include text-sub;
        }
      }
    }
  }
  
  .review-content {
    font-size: $font-size-sm;
    @include text-main;
    line-height: 1.6;
    margin-bottom: $space-sm;
  }
  
  .review-images {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-sm;
    
    .review-image {
      width: 140rpx;
      height: 140rpx;
      border-radius: $radius-md;
    }
  }
  
  .review-footer {
    display: flex;
    gap: $space-lg;
    
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
      color: #FFFFFF;
      font-size: $font-size-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
    
    .new-badge {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      background: $gradient-sunset;
      color: #FFFFFF;
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
    
    .card-specs {
      margin-top: $space-xs;
      
      .spec-text {
        font-size: $font-size-xs;
        @include text-sub;
        background: $color-bg-gray;
        padding: 4rpx 8rpx;
        border-radius: $radius-xs;
        
        [data-theme="dark"] & {
          background: rgba(255, 255, 255, 0.05);
        }
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-sm;
      
      .card-sales {
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
</style>
