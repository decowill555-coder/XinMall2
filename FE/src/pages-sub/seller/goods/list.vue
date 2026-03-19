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

      <!-- 底部留白，防止被按钮遮挡 -->
      <view class="bottom-space"></view>
    </scroll-view>
    
    <ui-bottom-bar>
      <ui-button type="primary" block @click="goPublish">发布新商品</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { tradeApi, type MyGoodsListItem } from '@/api';
import { logError } from '@/utils/logger';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 208
});

const activeTab = ref(0);
const loading = ref(false);

const tabList = ref([
  { name: '全部' },
  { name: '在售' },
  { name: '下架' },
  { name: '已售' }
]);

const allGoods = ref<MyGoodsListItem[]>([]);

const goodsList = computed(() => {
  if (activeTab.value === 0) {
    return allGoods.value;
  } else if (activeTab.value === 1) {
    return allGoods.value.filter(item => item.status === 'on_sale');
  } else if (activeTab.value === 2) {
    return allGoods.value.filter(item => item.status === 'off_sale');
  } else {
    return allGoods.value.filter(item => item.status === 'sold');
  }
});

const fetchMyGoods = async () => {
  loading.value = true;
  try {
    const res = await tradeApi.getMyGoods({ page: 1, size: 100 });
    allGoods.value = res.list || [];
  } catch (error) {
    logError('获取商品列表失败:', error);
    uni.showToast({ title: '获取商品列表失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMyGoods();
});

onShow(() => {
  fetchMyGoods();
});

const getTags = (item: MyGoodsListItem) => {
  const tags = [];
  if (item.status === 'on_sale') {
    tags.push({ text: '在售', type: 'success' });
  } else if (item.status === 'off_sale') {
    tags.push({ text: '下架', type: 'warning' });
  } else if (item.status === 'sold') {
    tags.push({ text: '已售', type: 'info' });
  }
  return tags;
};

const getActions = (item: MyGoodsListItem) => {
  return [
    { text: '编辑', type: 'default', action: 'edit' },
    { text: item.status === 'on_sale' ? '下架' : '上架', type: 'warning', action: 'toggle' },
    { text: '删除', type: 'danger', action: 'delete' }
  ];
};

const goPublish = () => {
  uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
};

const handleEdit = (item: MyGoodsListItem) => {
  uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
};

const handleAction = async (action: string, item: MyGoodsListItem) => {
  if (action === 'edit') {
    handleEdit(item);
  } else if (action === 'toggle') {
    const isOnSale = item.status === 'on_sale';
    const text = isOnSale ? '下架' : '上架';
    uni.showModal({
      title: '提示',
      content: `确定${text}该商品吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            if (isOnSale) {
              await tradeApi.offShelfProduct(item.id);
            } else {
              await tradeApi.onShelfProduct(item.id);
            }
            uni.showToast({ title: `${text}成功`, icon: 'success' });
            fetchMyGoods();
          } catch (error) {
            logError(`${text}失败:`, error);
            uni.showToast({ title: `${text}失败，请重试`, icon: 'none' });
          }
        }
      }
    });
  } else if (action === 'delete') {
    uni.showModal({
      title: '提示',
      content: '确定删除该商品吗？删除后无法恢复',
      success: async (res) => {
        if (res.confirm) {
          // TODO: 后端暂无删除接口，暂时只做本地删除
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

.bottom-space {
  height: 140rpx;
}
</style>
