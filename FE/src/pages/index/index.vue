<template>
  <view class="index-page">
    <view class="page-content">
      <view class="search-bar">
        <ui-search 
          v-model="keyword" 
          placeholder="搜索数码产品型号..." 
          :disabled="true"
          @click="goSearch"
        />
      </view>
      
      <view class="category-tabs">
        <ui-tabs v-model="activeTab" :list="categoryList" type="capsule" />
      </view>
      
      <scroll-view scroll-y class="goods-list" @scrolltolower="loadMore">
        <ui-waterfalls :list="goodsList" :columns="2" :gap="12" @click="goDetail">
          <template #item="{ item }">
            <view class="goods-item">
              <ui-image 
                :src="item.cover" 
                width="100%" 
                height="320rpx" 
                radius="12rpx"
              />
              <view class="goods-info">
                <view class="goods-title">{{ item.title }}</view>
                <view class="goods-tags" v-if="item.tags?.length">
                  <ui-tag v-for="tag in item.tags.slice(0, 2)" :key="tag" type="primary" size="sm">
                    {{ tag }}
                  </ui-tag>
                </view>
                <view class="goods-bottom">
                  <ui-price :value="item.price" type="main" :size="32" />
                  <text class="sales-count">{{ item.sales }}人付款</text>
                </view>
              </view>
            </view>
          </template>
        </ui-waterfalls>
        
        <view class="load-more" v-if="goodsList.length > 0">
          <text>{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar :current="0" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keyword = ref('');
const activeTab = ref(0);
const loading = ref(false);

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

const goodsList = ref([
  {
    id: 1,
    cover: 'https://picsum.photos/400/400?random=1',
    title: 'iPhone 15 Pro Max 256GB 钛金属',
    price: 7999,
    sales: 128,
    tags: ['99新', '在保']
  },
  {
    id: 2,
    cover: 'https://picsum.photos/400/400?random=2',
    title: 'MacBook Pro 14寸 M3芯片',
    price: 12999,
    sales: 56,
    tags: ['全新未拆', '官方质保']
  },
  {
    id: 3,
    cover: 'https://picsum.photos/400/400?random=3',
    title: 'iPad Pro 12.9寸 256G WiFi版',
    price: 6999,
    sales: 89,
    tags: ['95新', '送配件']
  },
  {
    id: 4,
    cover: 'https://picsum.photos/400/400?random=4',
    title: 'AirPods Pro 第二代',
    price: 1399,
    sales: 256,
    tags: ['全新', '正品']
  },
  {
    id: 5,
    cover: 'https://picsum.photos/400/400?random=5',
    title: 'Sony WH-1000XM5 降噪耳机',
    price: 2199,
    sales: 78,
    tags: ['9成新', '箱说全']
  },
  {
    id: 6,
    cover: 'https://picsum.photos/400/400?random=6',
    title: 'Nintendo Switch OLED 续航版',
    price: 1899,
    sales: 167,
    tags: ['99新', '双系统']
  },
  {
    id: 7,
    cover: 'https://picsum.photos/400/400?random=7',
    title: '佳能 EOS R6 Mark II 机身',
    price: 15999,
    sales: 23,
    tags: ['95新', '国行']
  },
  {
    id: 8,
    cover: 'https://picsum.photos/400/400?random=8',
    title: 'ROG 游戏本 魔霸7 Plus',
    price: 11999,
    sales: 45,
    tags: ['全新未拆', '学生优惠']
  },
  {
    id: 9,
    cover: 'https://picsum.photos/400/400?random=9',
    title: 'Apple Watch Series 9 45mm',
    price: 2899,
    sales: 198,
    tags: ['GPS', '全新']
  },
  {
    id: 10,
    cover: 'https://picsum.photos/400/400?random=10',
    title: '三星 Galaxy S23 Ultra 512G',
    price: 5999,
    sales: 67,
    tags: ['99新', '在保']
  },
  {
    id: 11,
    cover: 'https://picsum.photos/400/400?random=11',
    title: '小米 13 Ultra 256G',
    price: 4599,
    sales: 112,
    tags: ['95新', '送碎屏险']
  },
  {
    id: 12,
    cover: 'https://picsum.photos/400/400?random=12',
    title: '华为 Mate 60 Pro 512G',
    price: 6999,
    sales: 234,
    tags: ['全新未拆', '官方正品']
  }
]);

const goSearch = () => {
  uni.navigateTo({ url: '/pages-sub/trade/search/index' });
};

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
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

.page-content {
  padding-bottom: 120rpx;
}

.search-bar {
  padding: $space-md;
  background: $color-white;
}

.category-tabs {
  padding: 0 $space-md $space-md;
  background: $color-white;
}

.goods-list {
  height: calc(100vh - 88rpx - 120rpx - 200rpx);
  padding: $space-sm $space-md;
}

.goods-item {
  background: $color-white;
  border-radius: $radius-md;
  overflow: hidden;
  margin-bottom: $space-sm;
  
  .goods-info {
    padding: $space-sm;
  }
  
  .goods-title {
    font-size: $font-size-sm;
    color: $color-text-main;
    line-height: 1.4;
    @include text-ellipsis(2);
    margin-bottom: $space-xs;
  }
  
  .goods-tags {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-xs;
  }
  
  .goods-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .sales-count {
      font-size: $font-size-xs;
      color: $color-text-disabled;
    }
  }
}

.load-more {
  text-align: center;
  padding: $space-lg;
  font-size: $font-size-sm;
  color: $color-text-disabled;
}
</style>
