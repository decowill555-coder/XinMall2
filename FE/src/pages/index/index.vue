<template>
  <view class="index-page">
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
  navigateTo('/pages-sub/trade/search/index');
};

const handleHotClick = (item: any) => {
  navigateTo(`/pages-sub/trade/search/index?keyword=${encodeURIComponent(item.keyword)}`);
};

const goDetail = (item: any) => {
  navigateTo(`/pages-sub/trade/product/detail?id=${item.id}`);
};

const goUser = (item: any) => {
  navigateTo(`/pages-sub/content/user/index?id=${item.userId}`);
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
  background: $color-bg-page;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: $space-md $space-md $space-sm;
  box-shadow: var(--shadow-card, 0 2rpx 16rpx rgba(0, 0, 0, 0.04));
}

.search-bar {
  margin-bottom: $space-sm;
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
}

.goods-scroll {
  min-height: 100vh;
  overflow: hidden;
}

.swiper {
  padding: $space-xl $space-md 0 $space-md;
  box-sizing: border-box;
}

.goods-list {
  padding: $space-md;
  box-sizing: border-box;
  overflow: hidden;
}

.load-more {
  padding: $space-md 0;
}
</style>
