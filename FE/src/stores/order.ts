import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { tradeApi, type OrderListItem, type OrderListParams } from '@/api/trade';
import { logError } from '@/utils/logger';

export type OrderStatus =
  | 'pending'      // 待付款
  | 'paid'         // 待发货
  | 'shipped'      // 待收货
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消
  | 'refunding'    // 售后中
  | 'refunded';    // 已退款

// 未读订单状态类型
export type UnreadStatusType = 'pending' | 'paid' | 'shipped' | 'completed' | 'refunding';

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

// 后端返回的状态名称到前端状态的映射
const mapBackendStatusToKey = (status: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'PENDING_PAYMENT': 'pending',
    'PENDING_SHIPMENT': 'paid',
    'PENDING_RECEIPT': 'shipped',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'REFUNDED': 'refunded'
  };
  return statusMap[status] || 'pending';
};

const mapOrderStatus = (status: number | string): OrderStatus => {
  // Handle string status from backend (lowercase enum name)
  const stringStatusMap: Record<string, OrderStatus> = {
    'pending_payment': 'pending',
    'pending_shipment': 'paid',
    'pending_receipt': 'shipped',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'refunded': 'refunded'
  };
  // Handle numeric status code
  const numericStatusMap: Record<number, OrderStatus> = {
    1: 'pending',
    2: 'paid',
    3: 'shipped',
    4: 'completed',
    5: 'cancelled',
    6: 'refunded'
  };
  if (typeof status === 'number') {
    return numericStatusMap[status] || 'pending';
  }
  return stringStatusMap[status] || status as OrderStatus;
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
  productType: 'standard' as const
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

  // 存储从后端获取的真实订单数量统计
  const orderCountMap = ref<Record<string, number>>({});

  // 未读订单数量（用于小红点显示）
  // 存储用户已读的状态，当用户查看某个状态的订单列表时，该状态的未读数清零
  const unreadCountMap = ref<Record<UnreadStatusType, number>>({
    pending: 0,
    paid: 0,
    shipped: 0,
    completed: 0,
    refunding: 0
  });

  // 上次从后端获取的订单数量（用于比较是否有新订单）
  const lastFetchedCountMap = ref<Record<string, number>>({});

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

  // 使用后端真实数据计算订单数量
  const orderCountByStatus = computed(() => ({
    pending: orderCountMap.value['PENDING_PAYMENT'] || 0,
    paid: orderCountMap.value['PENDING_SHIPMENT'] || 0,
    shipped: orderCountMap.value['PENDING_RECEIPT'] || 0,
    completed: orderCountMap.value['COMPLETED'] || 0,
    refunding: orderCountMap.value['REFUNDED'] || 0
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

  // 获取订单数量统计（从后端获取真实数据）
  const fetchOrderCount = async () => {
    try {
      const counts = await tradeApi.getOrderCount();
      const newCountMap = counts || {};

      // 比较新旧数量，计算新增的未读订单
      const statusKeyMap: Record<string, UnreadStatusType> = {
        'PENDING_PAYMENT': 'pending',
        'PENDING_SHIPMENT': 'paid',
        'PENDING_RECEIPT': 'shipped',
        'COMPLETED': 'completed',
        'REFUNDED': 'refunding'
      };

      // 检查是否是第一次获取（lastFetchedCountMap 为空）
      const isFirstFetch = Object.keys(lastFetchedCountMap.value).length === 0;

      for (const [backendStatus, count] of Object.entries(newCountMap)) {
        const frontendStatus = statusKeyMap[backendStatus];
        if (frontendStatus) {
          // 第一次获取时不计算未读数，只记录当前数量
          if (!isFirstFetch) {
            const lastCount = lastFetchedCountMap.value[backendStatus] || 0;
            const newOrders = (count || 0) - lastCount;
            // 只有当数量增加时才累加未读数
            if (newOrders > 0) {
              unreadCountMap.value[frontendStatus] += newOrders;
            }
          }
        }
      }

      // 更新存储的数量
      lastFetchedCountMap.value = { ...newCountMap };
      orderCountMap.value = newCountMap;
    } catch (error) {
      logError('获取订单数量统计失败:', error);
    }
  };

  // 标记某个状态的订单为已读（进入该状态订单列表时调用）
  const markStatusAsRead = (status: UnreadStatusType) => {
    unreadCountMap.value[status] = 0;
  };

  // 标记所有订单为已读
  const markAllAsRead = () => {
    for (const key of Object.keys(unreadCountMap.value) as UnreadStatusType[]) {
      unreadCountMap.value[key] = 0;
    }
  };

  // 获取未读订单数量（用于小红点显示）
  const unreadCountByStatus = computed(() => unreadCountMap.value);

  // 获取总未读数量
  const totalUnreadCount = computed(() =>
    Object.values(unreadCountMap.value).reduce((sum, count) => sum + count, 0)
  );

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
      // Backend returns PageResult with 'list' field
      const newOrders = (res.list || res.records || []).map(transformApiOrder);

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
      logError('获取订单列表失败:', error);
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
    orderCountMap,
    unreadCountMap,
    lastFetchedCountMap,

    pendingPaymentOrders,
    pendingShipmentOrders,
    pendingReceiptOrders,
    completedOrders,
    refundingOrders,
    orderCountByStatus,
    unreadCountByStatus,
    totalUnreadCount,

    fetchOrders,
    fetchOrderCount,
    markStatusAsRead,
    markAllAsRead,
    addOrder,
    updateOrderStatus,
    setOrders,
    setCurrentOrder,
    resetOrders,
    updateSummary
  };
});
