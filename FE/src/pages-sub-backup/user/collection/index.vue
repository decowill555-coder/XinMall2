<template>
  <view class="collection-page">
    <ui-sub-navbar title="我的收藏" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="collection-scroll">
      <view v-if="collectionList.length === 0" class="empty-state">
        <ui-icon name="heart" size="80" color="#A1A1A6" />
        <text class="empty-text">暂无收藏</text>
      </view>
      
      <view v-else class="collection-list">
        <view v-for="item in collectionList" :key="item.id" class="collection-item" @click="goDetail(item)">
          <ui-image :src="item.cover" width="180rpx" height="180rpx" radius="8rpx" />
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <view class="item-tags">
              <ui-tag v-for="tag in item.tags?.slice(0, 2)" :key="tag" type="primary" size="sm">{{ tag }}</ui-tag>
            </view>
            <view class="item-bottom">
              <ui-price :value="item.price" :size="28" />
              <text class="item-time">{{ item.collectTime }}</text>
            </view>
          </view>
          <view class="item-action" @click.stop="cancelCollect(item)">
            <ui-icon name="heart-fill" :size="24" color="#FF3D00" />
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
  { name: '商品' },
  { name: '帖子' }
]);

const collectionList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=col1', title: 'iPhone 15 Pro Max 256GB 钛金属原�?, price: 7999, tags: ['99�?, '在保'], collectTime: '3天前' },
  { id: 2, cover: 'https://picsum.photos/200/200?random=col2', title: 'MacBook Pro 14�?M3芯片', price: 12999, tags: ['全新', '官方'], collectTime: '5天前' },
  { id: 3, cover: 'https://picsum.photos/200/200?random=col3', title: 'AirPods Pro 第二�?, price: 1399, tags: ['全新', '正品'], collectTime: '1周前' }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};

const cancelCollect = (item: any) => {
  uni.showModal({
    title: '提示',
    content: '确定取消收藏吗？',
    success: (res) => {
      if (res.confirm) {
        const index = collectionList.value.findIndex(c => c.id === item.id);
        if (index > -1) {
          collectionList.value.splice(index, 1);
          uni.showToast({ title: '已取消收�?, icon: 'success' });
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.collection-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: $color-white;
  padding: 0 $space-md;
}

.collection-scroll {
  height: calc(100vh - 88rpx - 88rpx);
  padding: $space-sm $space-md;
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin-top: $space-md;
  }
}

.collection-list {
  .collection-item {
    display: flex;
    align-items: center;
    padding: $space-md;
    background: $color-white;
    border-radius: $radius-md;
    margin-bottom: $space-sm;
    
    .item-info {
      flex: 1;
      margin-left: $space-md;
      
      .item-title {
        font-size: $font-size-sm;
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
        
        .item-time {
          font-size: $font-size-xs;
          color: $color-text-disabled;
        }
      }
    }
    
    .item-action {
      padding: $space-sm;
    }
  }
}
</style>
