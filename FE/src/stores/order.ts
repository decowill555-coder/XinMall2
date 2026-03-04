import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

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

  const mockOrders: OrderItem[] = [
    {
      id: 'order-001',
      orderNo: 'XM2024030400001',
      spuId: 'spu-001',
      skuId: 'sku-001',
      skuSpecs: [{ name: '颜色', value: '星空黑' }, { name: '尺寸', value: 'M' }],
      name: '时尚休闲运动卫衣',
      cover: 'https://picsum.photos/200/200?random=1',
      price: 199,
      quantity: 1,
      totalAmount: 199,
      status: 'pending',
      createdAt: '2024-03-04 10:30:00',
      productType: 'standard'
    },
    {
      id: 'order-002',
      orderNo: 'XM2024030300002',
      spuId: 'spu-002',
      skuId: 'sku-002',
      skuSpecs: [{ name: '颜色', value: '象牙白' }, { name: '尺寸', value: 'L' }],
      name: '简约纯棉T恤',
      cover: 'https://picsum.photos/200/200?random=2',
      price: 89,
      quantity: 2,
      totalAmount: 178,
      status: 'paid',
      createdAt: '2024-03-03 14:20:00',
      paidAt: '2024-03-03 14:25:00',
      productType: 'standard'
    },
    {
      id: 'order-003',
      orderNo: 'XM2024030200003',
      spuId: 'spu-003',
      skuId: 'sku-003',
      skuSpecs: [{ name: '颜色', value: '深蓝色' }],
      name: '经典牛仔裤',
      cover: 'https://picsum.photos/200/200?random=3',
      price: 299,
      quantity: 1,
      totalAmount: 299,
      status: 'shipped',
      createdAt: '2024-03-02 09:15:00',
      paidAt: '2024-03-02 09:20:00',
      shippedAt: '2024-03-03 11:00:00',
      productType: 'standard'
    },
    {
      id: 'order-004',
      orderNo: 'XM2024030100004',
      spuId: 'spu-004',
      skuId: 'sku-004',
      skuSpecs: [{ name: '颜色', value: '灰色' }, { name: '尺寸', value: 'XL' }],
      name: '舒适运动套装',
      cover: 'https://picsum.photos/200/200?random=4',
      price: 399,
      quantity: 1,
      totalAmount: 399,
      status: 'completed',
      createdAt: '2024-03-01 16:45:00',
      paidAt: '2024-03-01 16:50:00',
      shippedAt: '2024-03-02 10:00:00',
      completedAt: '2024-03-04 09:00:00',
      productType: 'standard'
    },
    {
      id: 'order-005',
      orderNo: 'XM2024022800005',
      spuId: 'spu-005',
      skuId: 'sku-005',
      skuSpecs: [{ name: '套餐', value: '春季新品组合' }],
      name: '春季新品组合套装',
      cover: 'https://picsum.photos/200/200?random=5',
      price: 599,
      quantity: 1,
      totalAmount: 599,
      status: 'completed',
      createdAt: '2024-02-28 11:30:00',
      paidAt: '2024-02-28 11:35:00',
      shippedAt: '2024-02-29 14:00:00',
      completedAt: '2024-03-02 16:00:00',
      productType: 'package',
      packageList: [
        { name: '休闲外套', price: 299 },
        { name: '纯棉T恤', price: 199 },
        { name: '运动裤', price: 199 }
      ]
    },
    {
      id: 'order-006',
      orderNo: 'XM2024022500006',
      spuId: 'spu-006',
      skuId: 'sku-006',
      skuSpecs: [{ name: '颜色', value: '卡其色' }],
      name: '商务休闲夹克',
      cover: 'https://picsum.photos/200/200?random=6',
      price: 459,
      quantity: 1,
      totalAmount: 459,
      status: 'cancelled',
      createdAt: '2024-02-25 08:00:00',
      productType: 'standard'
    },
    {
      id: 'order-007',
      orderNo: 'XM2024022000007',
      spuId: 'spu-007',
      skuId: 'sku-007',
      skuSpecs: [{ name: '颜色', value: '黑色' }, { name: '尺寸', value: 'S' }],
      name: '轻薄羽绒服',
      cover: 'https://picsum.photos/200/200?random=7',
      price: 699,
      quantity: 1,
      totalAmount: 699,
      status: 'refunding',
      createdAt: '2024-02-20 13:20:00',
      paidAt: '2024-02-20 13:25:00',
      shippedAt: '2024-02-21 09:00:00',
      productType: 'standard'
    },
    {
      id: 'order-008',
      orderNo: 'XM2024021500008',
      spuId: 'spu-008',
      skuId: 'sku-008',
      skuSpecs: [{ name: '颜色', value: '米白色' }],
      name: '针织开衫毛衣',
      cover: 'https://picsum.photos/200/200?random=8',
      price: 259,
      quantity: 1,
      totalAmount: 259,
      status: 'refunded',
      createdAt: '2024-02-15 10:00:00',
      paidAt: '2024-02-15 10:05:00',
      productType: 'standard'
    }
  ];

  const initMockData = () => {
    if (orders.value.length === 0) {
      orders.value = mockOrders;
      updateSummary();
      saveToStorage();
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('orders', orders.value);
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('orders');
    if (stored && stored.length > 0) {
      orders.value = stored;
      updateSummary();
    } else {
      initMockData();
    }
  };

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