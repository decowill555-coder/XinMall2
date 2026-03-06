<template>
  <view class="goods-list-page">
    <ui-sub-navbar title="商品管理" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="goods-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-empty 
        v-if="goodsList.length === 0" 
        icon="package" 
        text="暂无商品"
        action-text="发布商品"
        @action="goPublish"
      />
      
      <view v-else class="goods-list">
        <ui-goods-list-item 
          v-for="item in goodsList" 
          :key="item.id"
          :cover="item.cover"
          :title="item.title"
          :tags="getTags(item)"
          :price="item.price"
          :stock="item.stock"
          show-actions
          :actions="getActions(item)"
          @click="handleEdit(item)"
          @action="handleAction($event, item)"
        />
      </view>
    </scroll-view>
    
    <ui-bottom-bar>
      <ui-button type="primary" block @click="goPublish">发布新商品</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 208
});

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '在售' },
  { name: '下架' }
]);

const allGoods = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=l1', title: 'iPhone 15 Pro Max 256GB 钛金属原色', price: 7999, stock: 10, status: 'on', isRecommend: true },
  { id: 2, cover: 'https://picsum.photos/200/200?random=l2', title: 'MacBook Pro 14寸 M3芯片', price: 12999, stock: 5, status: 'on', isRecommend: false },
  { id: 3, cover: 'https://picsum.photos/200/200?random=l3', title: 'AirPods Pro 第二代', price: 1399, stock: 30, status: 'on', isRecommend: true },
  { id: 4, cover: 'https://picsum.photos/200/200?random=l4', title: 'iPad Pro 12.9寸 M2', price: 6999, stock: 0, status: 'off', isRecommend: false }
]);

const goodsList = computed(() => {
  if (activeTab.value === 0) {
    return allGoods.value;
  } else if (activeTab.value === 1) {
    return allGoods.value.filter(item => item.status === 'on');
  } else {
    return allGoods.value.filter(item => item.status === 'off');
  }
});

const getTags = (item: any) => {
  const tags = [];
  tags.push({ text: item.status === 'on' ? '在售' : '下架', type: item.status === 'on' ? 'success' : 'warning' });
  if (item.isRecommend) {
    tags.push({ text: '推荐', type: 'primary' });
  }
  return tags;
};

const getActions = (item: any) => {
  return [
    { text: '编辑', type: 'default', action: 'edit' },
    { text: item.status === 'on' ? '下架' : '上架', type: 'warning', action: 'toggle' },
    { text: '删除', type: 'danger', action: 'delete' }
  ];
};

const goPublish = () => {
  uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
};

const handleEdit = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
};

const handleAction = (action: string, item: any) => {
  if (action === 'edit') {
    handleEdit(item);
  } else if (action === 'toggle') {
    const text = item.status === 'on' ? '下架' : '上架';
    uni.showModal({
      title: '提示',
      content: `确定${text}该商品吗？`,
      success: (res) => {
        if (res.confirm) {
          item.status = item.status === 'on' ? 'off' : 'on';
          uni.showToast({ title: `${text}成功`, icon: 'success' });
        }
      }
    });
  } else if (action === 'delete') {
    uni.showModal({
      title: '提示',
      content: '确定删除该商品吗？删除后无法恢复',
      success: (res) => {
        if (res.confirm) {
          const index = allGoods.value.findIndex(g => g.id === item.id);
          if (index > -1) {
            allGoods.value.splice(index, 1);
            uni.showToast({ title: '删除成功', icon: 'success' });
          }
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.goods-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.goods-scroll {
  overflow: hidden;
}

.goods-list {
  padding: $space-md;
}
</style>
