<template>
  <view class="history-page">
    <ui-sub-navbar title="浏览足迹" />
    
    <scroll-view scroll-y class="history-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-empty v-if="historyList.length === 0" icon="eye" text="暂无浏览记录" />
      
      <view v-else class="history-list">
        <view v-for="group in historyList" :key="group.date" class="history-group">
          <text class="group-date">{{ group.date }}</text>
          <view class="group-list">
            <ui-goods-list-item 
              v-for="item in group.list" 
              :key="item.id"
              :cover="item.cover"
              :title="item.title"
              :tags="getTags(item.tags)"
              :price="item.price"
              :time="item.viewTime"
              @click="goDetail(item)"
            />
          </view>
        </view>
      </view>
    </scroll-view>
    
    <ui-bottom-bar>
      <ui-button block @click="clearHistory">清空浏览记录</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

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

const getTags = (tags?: string[]) => {
  if (!tags) return [];
  return tags.slice(0, 2).map(tag => ({ text: tag, type: 'primary' as const }));
};

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
  overflow: hidden;
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
    }
  }
}
</style>
