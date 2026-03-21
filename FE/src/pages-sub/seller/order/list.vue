<template>
  <view class="order-list-page">
    <ui-sub-navbar title="订单管理" />

    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>

    <scroll-view scroll-y class="order-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-empty
        v-if="orderList.length === 0"
        icon="file-text"
        text="暂无订单"
      />

      <view v-else class="order-list">
        <ui-order-card
          v-for="item in orderList"
          :key="item.id"
          :order-no="item.orderNo"
          :status="getStatusText(item.status)"
          :product="item.product"
          :quantity="item.quantity"
          :total-amount="item.totalAmount"
          :seller="item.seller"
          :create-time="item.createdAt"
          :show-actions="item.status === 'pending_shipment'"
          @click="goDetail(item)"
          @ship="handleShip(item)"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { tradeApi, type OrderListItem, type OrderStatus } from '@/api/trade';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const activeTab = ref(0);
const loading = ref(false);

const tabList = ref([
  { name: '全部' },
  { name: '待发货' },
  { name: '已发货' },
  { name: '已完成' }
]);

// 状态映射
const statusMap: Record<number, OrderStatus | undefined> = {
  0: undefined, // 全部
  1: 'pending_shipment', // 待发货
  2: 'pending_receipt', // 已发货
  3: 'completed' // 已完成
};

const orderList = ref<OrderListItem[]>([]);
const page = ref(1);
const hasMore = ref(true);

// 加载数据
const loadData = async (reset = false) => {
  if (loading.value) return;

  if (reset) {
    page.value = 1;
    orderList.value = [];
    hasMore.value = true;
  }

  try {
    loading.value = true;
    const status = statusMap[activeTab.value];
    const res = await tradeApi.getSellerOrders({
      status,
      page: page.value,
      size: 10
    });

    if (reset) {
      orderList.value = res.list;
    } else {
      orderList.value.push(...res.list);
    }
    hasMore.value = res.hasMore;
  } catch (error) {
    console.error('加载订单列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 监听tab切换
watch(activeTab, () => {
  loadData(true);
});

onMounted(() => {
  loadData();
});

const getStatusText = (status: OrderStatus): string => {
  const statusTextMap: Record<OrderStatus, string> = {
    'pending_payment': '待付款',
    'pending_shipment': '待发货',
    'pending_receipt': '已发货',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunded': '已退款'
  };
  return statusTextMap[status] || status;
};

const goDetail = (item: OrderListItem) => {
  uni.navigateTo({ url: `/pages-sub/trade/order-detail?id=${item.id}` });
};

// 发货
const handleShip = (item: OrderListItem) => {
  uni.showModal({
    title: '发货',
    editable: true,
    placeholderText: '请输入快递单号',
    success: async (res) => {
      if (res.confirm && res.content) {
        try {
          // TODO: 选择快递公司
          await tradeApi.shipOrder(item.id, {
            expressCompany: '其他',
            expressNo: res.content
          });
          uni.showToast({ title: '发货成功', icon: 'success' });
          loadData(true);
        } catch (error) {
          uni.showToast({ title: '发货失败', icon: 'none' });
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.order-scroll {
  overflow: hidden;
}

.order-list {
  padding: $space-sm $space-md;
}
</style>
