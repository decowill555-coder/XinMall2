<template>
  <view class="order-list-page">
    <ui-sub-navbar title="我的订单" />
    
    <view class="order-tabs">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="order-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="order-content">
        
        <ui-empty v-if="orderList.length === 0" icon="file-text" text="暂无订单" />
        
        <view v-else class="order-list">
          <ui-order-card 
            v-for="order in orderList" 
            :key="order.id"
            :order-no="order.orderNo"
            :cover="order.cover"
            :title="order.name"
            :spec="order.skuSpecs?.map((s: any) => s.value).join(' / ')"
            :price="order.price"
            :quantity="order.quantity"
            :total-amount="order.totalAmount"
            :status="order.status"
            @click="goDetail(order)"
          >
            <template #actions>
              <ui-button v-if="order.status === 'pending'" size="sm" @click.stop="handlePay(order)">立即付款</ui-button>
              <ui-button v-if="order.status === 'shipped'" size="sm" type="primary" @click.stop="handleConfirm(order)">确认收货</ui-button>
              <ui-button v-if="order.status === 'completed'" size="sm" type="primary" @click.stop="goEvaluate(order)">去评价</ui-button>
            </template>
          </ui-order-card>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useOrderStore, type OrderStatus } from '@/stores/order';
import { tradeApi } from '@/api';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const orderStore = useOrderStore();

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待付款' },
  { name: '待发货' },
  { name: '待收货' },
  { name: '待评价' }
]);

const statusMap: Record<number, OrderStatus | undefined> = {
  0: undefined,
  1: 'pending',
  2: 'paid',
  3: 'shipped',
  4: 'completed'
};

const typeToTabMap: Record<string, number> = {
  'pending': 1,
  'paid': 2,
  'shipped': 2,
  'completed': 4,
  'received': 3,
  'reviewed': 4,
  'refund': 0
};

onLoad((options) => {
  if (options?.type) {
    const tabIndex = typeToTabMap[options.type];
    if (tabIndex !== undefined) {
      activeTab.value = tabIndex;
    }
  }
});

const orderList = computed(() => orderStore.orders);

const fetchOrders = async (isRefresh = true) => {
  const status = statusMap[activeTab.value];
  await orderStore.fetchOrders(isRefresh, status);
};

watch(activeTab, () => {
  fetchOrders(true);
});

onMounted(() => {
  fetchOrders(true);
});

const goDetail = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/order/detail?id=${order.id}` });
};

const handlePay = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/pay/index?id=${order.id}` });
};

const handleConfirm = async (order: any) => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await tradeApi.confirmReceipt(order.id);
          orderStore.updateOrderStatus(order.id, 'completed');
          uni.showToast({ title: '确认成功', icon: 'success' });
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    }
  });
};

const goEvaluate = (order: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/evaluate/index?id=${order.id}` });
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.order-tabs {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.order-scroll {
  overflow: hidden;
}

.order-content {
  padding: $space-md;
}

.order-list {
  display: flex;
  flex-direction: column;
}
</style>
