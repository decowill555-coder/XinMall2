<template>
  <view class="history-page">
    <ui-navbar title="浏览足迹" :back="true" />
    
    <scroll-view scroll-y class="history-scroll">
      <view v-if="historyList.length === 0" class="empty-state">
        <ui-icon name="eye" size="80" color="#A1A1A6" />
        <text class="empty-text">暂无浏览记录</text>
      </view>
      
      <view v-else class="history-list">
        <view v-for="group in historyList" :key="group.date" class="history-group">
          <text class="group-date">{{ group.date }}</text>
          <view class="group-list">
            <view v-for="item in group.list" :key="item.id" class="history-item" @click="goDetail(item)">
              <ui-image :src="item.cover" width="160rpx" height="160rpx" radius="8rpx" />
              <view class="item-info">
                <text class="item-title">{{ item.title }}</text>
                <view class="item-tags">
                  <ui-tag v-for="tag in item.tags?.slice(0, 2)" :key="tag" type="primary" size="sm">{{ tag }}</ui-tag>
                </view>
                <view class="item-bottom">
                  <ui-price :value="item.price" :size="24" />
                  <text class="item-time">{{ item.viewTime }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="history-footer">
      <ui-button block @click="clearHistory">清空浏览记录</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const historyList = ref([
  {
    date: '今天',
    list: [
      { id: 1, cover: 'https://picsum.photos/200/200?random=h1', title: 'iPhone 15 Pro Max 256GB 钛金属原色', price: 7999, tags: ['99新', '在保'], viewTime: '10:30' },
      { id: 2, cover: 'https://picsum.photos/200/200?random=h2', title: 'MacBook Pro 14寸 M3芯片', price: 12999, tags: ['全新', '官方'], viewTime: '09:15' }
    ]
  },
  {
    date: '昨天',
    list: [
      { id: 3, cover: 'https://picsum.photos/200/200?random=h3', title: 'AirPods Pro 第二代', price: 1399, tags: ['全新', '正品'], viewTime: '18:20' },
      { id: 4, cover: 'https://picsum.photos/200/200?random=h4', title: 'iPad Pro 12.9寸 M2', price: 6999, tags: ['95新', '送配件'], viewTime: '14:30' }
    ]
  },
  {
    date: '3天前',
    list: [
      { id: 5, cover: 'https://picsum.photos/200/200?random=h5', title: 'Sony WH-1000XM5 降噪耳机', price: 2199, tags: ['9成新', '箱说全'], viewTime: '20:45' }
    ]
  }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
};

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空所有浏览记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = [];
        uni.showToast({ title: '已清空', icon: 'success' });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.history-scroll {
  height: calc(100vh - 88rpx - 120rpx);
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

.history-list {
  .history-group {
    .group-date {
      display: block;
      padding: $space-md;
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
    
    .group-list {
      padding: 0 $space-md;
      
      .history-item {
        display: flex;
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
      }
    }
  }
}

.history-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
