<template>
  <view class="index-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <view class="fixed-header" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
      <view class="search-bar">
        <ui-search 
          v-model="keyword" 
          placeholder="搜索数码产品型号..." 
          :disabled="true"
          :hot-keywords="hotKeywords"
          @click="goSearch"
          @hot-click="handleHotClick"
        />
        <view class="search-bar__find" @tap="goProductCategory">
          <UiIcon name="grid" color="#FF6A00" :size="40" />
        </view>
      </view>
      
      <view class="category-tabs">
        <ui-tabs v-model="activeTab" :list="categoryList" type="capsule" />
      </view>
    </view>
    
    <view class="page-content" :style="{ paddingTop: headerHeight + 'px' }">
      <scroll-view 
        scroll-y 
        class="goods-scroll" 
        :style="{ height: scrollHeight + 'px' }" 
        @scrolltolower="loadMore"
      >
        <view class="swiper">
          <ui-swiper
            :list="bannerList"
            height="360rpx"
            @click="onBannerClick"
          />
        </view>
        
        <view class="goods-list">
          <ui-waterfalls :list="goodsList" :columns="2" :gap="12" @click="goDetail">
            <template #item="{ item }">
              <ui-goods-card :data="item" mode="waterfall" @click="goDetail" @user-click="goUser" />
            </template>
          </ui-waterfalls>
        </view>
        
        <view class="load-more" v-if="goodsList.length > 0">
          <ui-divider :text="loading ? '加载中...' : '上拉加载更多'" />
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar current="index" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { onReady, onShow } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';

const appStore = useAppStore();
const { navigateTo } = useNavigation();

const keyword = ref('');
const activeTab = ref(0);
const loading = ref(false);

onShow(() => {
  keyword.value = '';
});

const hotKeywords = ref([
  { keyword: 'iPhone 15 Pro Max', id: 1 },
  { keyword: 'MacBook Pro M3', id: 2 },
  { keyword: 'AirPods Pro 2', id: 3 },
  { keyword: 'iPad Pro 2024', id: 4 },
  { keyword: '华为 Mate 60 Pro', id: 5 },
  { keyword: '小米 14 Ultra', id: 6 },
  { keyword: 'Sony WH-1000XM5', id: 7 },
  { keyword: 'Nintendo Switch OLED', id: 8 }
]);

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);
const isH5 = computed(() => appStore.isH5);

const headerExtraTop = computed(() => isH5.value ? 12 : 0);

const headerHeight = ref(0);
const scrollHeight = ref(0);

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  const tabbarHeight = rpxToPx(100);
  
  const query = uni.createSelectorQuery();
  query.select('.fixed-header').boundingClientRect((rect: any) => {
    if (rect && rect.height > 0) {
      headerHeight.value = rect.height;
      scrollHeight.value = systemInfo.windowHeight - rect.height - tabbarHeight - safeAreaBottom.value;
    }
  }).exec();
};

onReady(() => {
  nextTick(() => {
    calcLayout();
  });
});

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const estimatedHeader = rpxToPx(200) + safeAreaTop.value + headerExtraTop.value;
  const tabbarHeight = rpxToPx(100);
  
  headerHeight.value = estimatedHeader;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader - tabbarHeight - safeAreaBottom.value;
});

const categoryList = ref([
  { name: '推荐' },
  { name: '手机' },
  { name: '电脑' },
  { name: '平板' },
  { name: '耳机' },
  { name: '相机' },
  { name: '游戏' },
  { name: '配件' }
]);

const bannerList = [
  { image: 'https://picsum.photos/100/100?random=u1', title: '新品上市', link: '/pages/product/1' },
  { image: 'https://picsum.photos/100/100?random=u2', title: '限时特惠', link: '/pages/product/2' },
];

const goodsList = ref([
  {
    id: 1,
    cover: 'https://picsum.photos/400/400?random=1',
    title: 'iPhone 15 Pro Max 256GB 钛金属',
    price: 7999,
    sales: 128,
    tags: ['99新', '在保'],
    userAvatar: 'https://picsum.photos/100/100?random=u1',
    userName: '数码达人',
    likeCount: 128
  },
  {
    id: 2,
    cover: 'https://picsum.photos/400/400?random=2',
    title: 'MacBook Pro 14寸 M3芯片',
    price: 12999,
    sales: 56,
    tags: ['全新未拆', '官方质保'],
    userAvatar: 'https://picsum.photos/100/100?random=u2',
    userName: '科技博主',
    likeCount: 256
  },
  {
    id: 3,
    cover: 'https://picsum.photos/400/400?random=3',
    title: 'iPad Pro 12.9寸 256G WiFi版',
    price: 6999,
    sales: 89,
    tags: ['95新', '送配件'],
    userAvatar: 'https://picsum.photos/100/100?random=u3',
    userName: '苹果控',
    likeCount: 89
  },
  {
    id: 4,
    cover: 'https://picsum.photos/400/400?random=4',
    title: 'AirPods Pro 第二代',
    price: 1399,
    sales: 256,
    tags: ['全新', '正品'],
    userAvatar: 'https://picsum.photos/100/100?random=u4',
    userName: '耳机控',
    likeCount: 256
  },
  {
    id: 5,
    cover: 'https://picsum.photos/400/400?random=5',
    title: 'Sony WH-1000XM5 降噪耳机',
    price: 2199,
    sales: 78,
    tags: ['9成新', '箱说全'],
    userAvatar: 'https://picsum.photos/100/100?random=u5',
    userName: '音乐发烧友',
    likeCount: 78
  },
  {
    id: 6,
    cover: 'https://picsum.photos/400/400?random=6',
    title: 'Nintendo Switch OLED 续航版',
    price: 1899,
    sales: 167,
    tags: ['99新', '双系统'],
    userAvatar: 'https://picsum.photos/100/100?random=u6',
    userName: '游戏玩家',
    likeCount: 167
  },
  {
    id: 7,
    cover: 'https://picsum.photos/400/400?random=7',
    title: '佳能 EOS R6 Mark II 机身',
    price: 15999,
    sales: 23,
    tags: ['95新', '国行'],
    userAvatar: 'https://picsum.photos/100/100?random=u7',
    userName: '摄影师老李',
    likeCount: 23
  },
  {
    id: 8,
    cover: 'https://picsum.photos/400/400?random=8',
    title: 'ROG 游戏本 魔霸7 Plus',
    price: 11999,
    sales: 45,
    tags: ['全新未拆', '学生优惠'],
    userAvatar: 'https://picsum.photos/100/100?random=u8',
    userName: '电竞达人',
    likeCount: 45
  },
  {
    id: 9,
    cover: 'https://picsum.photos/400/400?random=9',
    title: 'Apple Watch Series 9 45mm',
    price: 2899,
    sales: 198,
    tags: ['GPS', '全新'],
    userAvatar: 'https://picsum.photos/100/100?random=u9',
    userName: '智能穿戴',
    likeCount: 198
  },
  {
    id: 10,
    cover: 'https://picsum.photos/400/400?random=10',
    title: '三星 Galaxy S23 Ultra 512G',
    price: 5999,
    sales: 67,
    tags: ['99新', '在保'],
    userAvatar: 'https://picsum.photos/100/100?random=u10',
    userName: '安卓粉',
    likeCount: 67
  },
  {
    id: 11,
    cover: 'https://picsum.photos/400/400?random=11',
    title: '小米 13 Ultra 256G',
    price: 4599,
    sales: 112,
    tags: ['95新', '送碎屏险'],
    userAvatar: 'https://picsum.photos/100/100?random=u11',
    userName: '米粉一枚',
    likeCount: 112
  },
  {
    id: 12,
    cover: 'https://picsum.photos/400/400?random=12',
    title: '华为 Mate 60 Pro 512G',
    price: 6999,
    sales: 234,
    tags: ['全新未拆', '官方正品'],
    userAvatar: 'https://picsum.photos/100/100?random=u12',
    userName: '华为铁粉',
    likeCount: 234
  }
]);

const goSearch = () => {
  navigateTo('/pages-sub/search/entry');
};

const goProductCategory = () => {
  navigateTo('/pages-sub/search/category');
};

const handleHotClick = (item: any) => {
  navigateTo(`/pages-sub/search/result?keyword=${encodeURIComponent(item.keyword)}`);
};

const goDetail = (item: any) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};

const goUser = (item: any) => {
  navigateTo(`/pages-sub/community/user/index?id=${item.userId}`);
};

const onBannerClick = ({ item, index }: { item: any; index: number }) => {
  if (item.link) {
    navigateTo(item.link);
  }
};

const loadMore = () => {
  if (loading.value) return;
  loading.value = true;
  
  setTimeout(() => {
    const newList = goodsList.value.map(item => ({
      ...item,
      id: item.id + goodsList.value.length,
      price: Math.floor(Math.random() * 10000) + 1000
    }));
    goodsList.value = [...goodsList.value, ...newList];
    loading.value = false;
  }, 1000);
};
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(170deg, $color-bg-gradient-start 0%, $color-bg-page 35%, $color-bg-page 100%);
  position: relative;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: linear-gradient(170deg, var(--color-bg-gradient-start, #1A1520) 0%, $color-bg-page 35%, $color-bg-page 100%);
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
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
    background: radial-gradient(circle, rgba($color-primary, 0.15) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%);
    }
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: radial-gradient(circle, rgba($color-accent, 0.1) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(0, 245, 212, 0.12) 0%, transparent 70%);
    }
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-card;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  padding: $space-md $space-md $space-sm;
  border-bottom: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: $space-sm;
  
  &__find {
    flex-shrink: 0;
    padding: $space-sm;
    margin-left: $space-sm;
  }
}

.category-tabs {
  background: transparent;
  margin: $space-sm 0;
}

.page-content {
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.goods-scroll {
  min-height: 100vh;
  overflow: hidden;
}

.swiper {
  padding: $space-xl $space-md 0 $space-md;
  box-sizing: border-box;
  
  :deep(.ui-swiper) {
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-md;
    
    [data-theme="dark"] & {
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
    }
  }
}

.goods-list {
  padding: $space-md;
  box-sizing: border-box;
  overflow: hidden;
  
  :deep(.ui-goods-card) {
    background: $color-bg-card;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid $color-border-light;
    border-radius: $radius-lg;
    overflow: hidden;
    
    [data-theme="dark"] & {
      background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }
}

.load-more {
  padding: $space-md 0;
  
  :deep(.ui-divider) {
    color: $color-text-sub;
    
    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
  }
}
</style>
