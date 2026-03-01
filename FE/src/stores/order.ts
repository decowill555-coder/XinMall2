import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

export const useOrderStore = defineStore('order', () => {
  // State
  const orders = ref<OrderItem[]>([]);
  const currentOrder = ref<OrderItem | null>(null);
  const summary = ref<OrderSummary>({
    totalOrders: 0,
    pendingPayment: 0,
    pendingShipment: 0,
    pendingReceipt: 0,
    totalSpent: 0
  });

  // Getters
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

  // Actions
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

  const setOrders = (newOrders: OrderItem[]) => {
    orders.value = newOrders;
    updateSummary();
  };

  const setCurrentOrder = (order: OrderItem | null) => {
    currentOrder.value = order;
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('orders');
    if (stored) {
      orders.value = stored;
      updateSummary();
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('orders', orders.value);
  };

  // 初始化
  loadFromStorage();

  // 监听变化
  const stopWatch = watch(
    () => orders.value,
    (newVal) => {
      saveToStorage();
    },
    { deep: true }
  );

  return {
    // State
    orders,
    currentOrder,
    summary,

    // Getters
    pendingPaymentOrders,
    pendingShipmentOrders,
    pendingReceiptOrders,
    completedOrders,
    refundingOrders,
    orderCountByStatus,

    // Actions
    addOrder,
    updateOrderStatus,
    setOrders,
    setCurrentOrder,
    loadFromStorage,
    saveToStorage,
    stopWatch
  };
});