<template>
  <view class="search-page">
    <view class="search-header">
      <ui-search 
        v-model="keyword" 
        placeholder="搜索数码产品型号..." 
        :focus="true"
        @search="handleSearch"
      />
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>
    
    <scroll-view scroll-y class="search-scroll">
      <view v-if="!hasSearched" class="search-default">
        <view class="history-section" v-if="historyList.length > 0">
          <view class="section-header">
            <text class="section-title">搜索历史</text>
            <text class="clear-btn" @click="clearHistory">清空</text>
          </view>
          <view class="history-list">
            <text 
              v-for="(item, index) in historyList" 
              :key="index" 
              class="history-item"
              @click="searchByKeyword(item)"
            >
              {{ item }}
            </text>
          </view>
        </view>
        
        <view class="hot-section">
          <text class="section-title">热门搜索</text>
          <view class="hot-list">
            <view 
              v-for="(item, index) in hotList" 
              :key="index" 
              class="hot-item"
              @click="searchByKeyword(item.keyword)"
            >
              <text class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
              <text class="hot-keyword">{{ item.keyword }}</text>
              <ui-tag v-if="item.isHot" type="danger" size="xs">热</ui-tag>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="search-result">
        <view class="result-header">
          <text class="result-count">找到 {{ resultList.length }} 个商品</text>
        </view>
        
        <view class="result-list">
          <view 
            v-for="item in resultList" 
            :key="item.id" 
            class="result-item"
            @click="goDetail(item)"
          >
            <ui-image :src="item.cover" width="180rpx" height="180rpx" radius="8rpx" />
            <view class="item-info">
              <text class="item-title">{{ item.title }}</text>
              <view class="item-tags">
                <ui-tag v-for="tag in item.tags?.slice(0, 2)" :key="tag" type="primary" size="sm">{{ tag }}</ui-tag>
              </view>
              <view class="item-bottom">
                <ui-price :value="item.price" type="main" :size="28" />
                <text class="item-sales">{{ item.sales }}人付款</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keyword = ref('');
const hasSearched = ref(false);

const historyList = ref([
  'iPhone 15', 'MacBook Pro', 'AirPods', 'Sony 耳机'
]);

const hotList = ref([
  { keyword: 'iPhone 15 Pro Max', isHot: true },
  { keyword: 'MacBook Pro M3', isHot: true },
  { keyword: 'AirPods Pro 2', isHot: false },
  { keyword: 'iPad Pro', isHot: false },
  { keyword: 'Nintendo Switch', isHot: false },
  { keyword: 'Sony 相机', isHot: false },
  { keyword: '华为 Mate 60', isHot: true },
  { keyword: '小米 14', isHot: false }
]);

const resultList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=801', title: 'iPhone 15 Pro Max 256GB 钛金属原色', price: 7999, sales: 128, tags: ['99新', '在保'] },
  { id: 2, cover: 'https://picsum.photos/200/200?random=802', title: 'iPhone 15 Pro 128GB 蓝色钛金属', price: 6999, sales: 89, tags: ['全新', '官方'] },
  { id: 3, cover: 'https://picsum.photos/200/200?random=803', title: 'iPhone 15 Plus 256GB 粉色', price: 5999, sales: 56, tags: ['95新', '送壳'] }
]);

const handleSearch = () => {
  if (!keyword.value.trim()) return;
  
  if (!historyList.value.includes(keyword.value)) {
    historyList.value.unshift(keyword.value);
    if (historyList.value.length > 10) {
      historyList.value.pop();
    }
  }
  
  hasSearched.value = true;
};

const searchByKeyword = (word: string) => {
  keyword.value = word;
  handleSearch();
};

const clearHistory = () => {
  historyList.value = [];
};

const goBack = () => {
  uni.navigateBack();
};

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.search-header {
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: $color-white;
  
  .cancel-btn {
    font-size: $font-size-md;
    color: $color-text-sub;
    margin-left: $space-sm;
  }
}

.search-scroll {
  height: calc(100vh - 100rpx);
}

.search-default {
  padding: $space-md;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-md;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
  }
  
  .clear-btn {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.history-section {
  margin-bottom: $space-lg;
  
  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    
    .history-item {
      padding: $space-xs $space-md;
      background: $color-bg-gray;
      border-radius: $radius-full;
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
}

.hot-section {
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .hot-list {
    .hot-item {
      display: flex;
      align-items: center;
      padding: $space-md 0;
      border-bottom: 1rpx solid $color-divider;
      
      .hot-rank {
        width: 40rpx;
        font-size: $font-size-md;
        font-weight: $font-weight-bold;
        color: $color-text-disabled;
        
        &.top {
          color: $color-error;
        }
      }
      
      .hot-keyword {
        flex: 1;
        font-size: $font-size-md;
        color: $color-text-main;
      }
    }
  }
}

.search-result {
  .result-header {
    padding: $space-md;
    
    .result-count {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .result-list {
    padding: 0 $space-md;
    
    .result-item {
      display: flex;
      padding: $space-md;
      background: $color-white;
      border-radius: $radius-md;
      margin-bottom: $space-sm;
      
      .item-info {
        flex: 1;
        margin-left: $space-md;
        
        .item-title {
          font-size: $font-size-md;
          color: $color-text-main;
          @include text-ellipsis(2);
        }
        
        .item-tags {
          display: flex;
          gap: $space-xs;
          margin: $space-xs 0;
        }
        
        .item-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: $space-sm;
          
          .item-sales {
            font-size: $font-size-xs;
            color: $color-text-disabled;
          }
        }
      }
    }
  }
}
</style>
