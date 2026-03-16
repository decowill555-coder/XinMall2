import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { tradeApi, type OrderListItem, type OrderListParams } from '@/api/trade';

export type OrderStatus = 
  | 'pending'      // 待付款
  | 'paid'         // 待发货
  | 'shipped'      // 待收货
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消
  | 'refunding'    // 售后中
  | 'refunded';    // 已退款

export interface OrderItem {
  id: string;
  orderNo: string;
  spuId: string;
  skuId: string;
  skuSpecs: Array<{ name: string; value: string }>;
  name: string;
  cover: string;
  price: number;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
  productType: 'standard' | 'package';
  packageList?: Array<{ name: string; price: number }>;
}

export interface OrderSummary {
  totalOrders: number;
  pendingPayment: number;
  pendingShipment: number;
  pendingReceipt: number;
  totalSpent: number;
}

const mapOrderStatus = (status: number | string): OrderStatus => {
  const statusMap: Record<number, OrderStatus> = {
    1: 'pending',
    2: 'paid',
    3: 'shipped',
    4: 'completed',
    5: 'cancelled',
    6: 'refunded'
  };
  if (typeof status === 'number') {
    return statusMap[status] || 'pending';
  }
  return status as OrderStatus;
};

const mapStatusToBackend = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    'pending': 'PENDING_PAYMENT',
    'paid': 'PENDING_SHIPMENT',
    'shipped': 'PENDING_RECEIPT',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
    'refunded': 'REFUNDED',
    'refunding': 'REFUNDED'
  };
  return statusMap[status] || 'PENDING_PAYMENT';
};

const transformApiOrder = (apiOrder: any): OrderItem => ({
  id: String(apiOrder.id),
  orderNo: apiOrder.orderNo,
  spuId: '',
  skuId: '',
  skuSpecs: [],
  name: apiOrder.goodsTitle || '未知商品',
  cover: apiOrder.goodsCover || '',
  price: Number(apiOrder.totalAmount) / 100,
  quantity: apiOrder.quantity || 1,
  totalAmount: Number(apiOrder.totalAmount) / 100,
  status: mapOrderStatus(apiOrder.status),
  createdAt: apiOrder.createdAt,
  productType: 'standard'
});

export const useOrderStore = defineStore('order', () => {
  const orders = ref<OrderItem[]>([]);
  const currentOrder = ref<OrderItem | null>(null);
  const summary = ref<OrderSummary>({
    totalOrders: 0,
    pendingPayment: 0,
    pendingShipment: 0,
    pendingReceipt: 0,
    totalSpent: 0
  });
  const loading = ref(false);
  const hasMore = ref(true);
  const currentPage = ref(1);
  const currentStatus = ref<OrderStatus | undefined>(undefined);

  const pendingPaymentOrders = computed(() => 
    orders.value.filter(o => o.status === 'pending')
  );

  const pendingShipmentOrders = computed(() => 
    orders.value.filter(o => o.status === 'paid')
  );

  const pendingReceiptOrders = computed(() => 
    orders.value.filter(o => o.status === 'shipped')
  );

  const completedOrders = computed(() => 
    orders.value.filter(o => o.status === 'completed')
  );

  const refundingOrders = computed(() => 
    orders.value.filter(o => o.status === 'refunding')
  );

  const orderCountByStatus = computed(() => ({
    pending: pendingPaymentOrders.value.length,
    paid: pendingShipmentOrders.value.length,
    shipped: pendingReceiptOrders.value.length,
    completed: completedOrders.value.length,
    refunding: refundingOrders.value.length
  }));

  const updateSummary = () => {
    summary.value = {
      totalOrders: orders.value.length,
      pendingPayment: pendingPaymentOrders.value.length,
      pendingShipment: pendingShipmentOrders.value.length,
      pendingReceipt: pendingReceiptOrders.value.length,
      totalSpent: orders.value.reduce((sum, o) => 
        sum + o.totalAmount, 0
      )
    };
  };

  const fetchOrders = async (isRefresh = false, status?: OrderStatus) => {
    if (loading.value) return;
    if (!isRefresh && !hasMore.value) return;

    loading.value = true;

    if (isRefresh) {
      currentPage.value = 1;
      hasMore.value = true;
      if (status !== undefined) {
        currentStatus.value = status;
      }
    }

    try {
      const params: OrderListParams = {
        page: currentPage.value,
        size: 10
      };
      
      if (currentStatus.value) {
        params.status = mapStatusToBackend(currentStatus.value);
      }

      const res = await tradeApi.getOrderList(params);
      const newOrders = (res.list || []).map(transformApiOrder);

      if (isRefresh) {
        orders.value = newOrders;
      } else {
        orders.value = [...orders.value, ...newOrders];
      }

      hasMore.value = res.hasMore;
      if (hasMore.value) {
        currentPage.value++;
      }

      updateSummary();
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const addOrder = (order: OrderItem) => {
    orders.value.unshift(order);
    updateSummary();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const index = orders.value.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders.value[index].status = status;
      updateSummary();
    }
  };

  const setOrders = (newOrders: OrderItem[]) => {
    orders.value = newOrders;
    updateSummary();
  };

  const setCurrentOrder = (order: OrderItem | null) => {
    currentOrder.value = order;
  };

  const resetOrders = () => {
    orders.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    currentStatus.value = undefined;
    updateSummary();
  };

  return {
    orders,
    currentOrder,
    summary,
    loading,
    hasMore,
    currentPage,
    currentStatus,

    pendingPaymentOrders,
    pendingShipmentOrders,
    pendingReceiptOrders,
    completedOrders,
    refundingOrders,
    orderCountByStatus,

    fetchOrders,
    addOrder,
    updateOrderStatus,
    setOrders,
    setCurrentOrder,
    resetOrders,
    updateSummary
  };
});
