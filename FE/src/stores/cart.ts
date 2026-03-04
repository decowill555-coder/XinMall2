import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface CartItem {
  id: string;
  spuId: string;
  skuId: string;
  skuSpecs: Array<{ name: string; value: string }>;
  name: string;
  cover: string;
  price: number;
  quantity: number;
  isPackageSale: boolean;
  packageList?: Array<{ name: string; price: number }>;
  isSelected: boolean;
  addedAt: string;
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);
  const lastUpdated = ref<number>(Date.now());

  // Getters
  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  
  const selectedCount = computed(() => 
    items.value.filter(item => item.isSelected).reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() => 
    items.value
      .filter(item => item.isSelected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const selectedItems = computed(() => items.value.filter(item => item.isSelected));

  const hasItems = computed(() => items.value.length > 0);

  // Actions
  const addToCart = (item: Omit<CartItem, 'id' | 'isSelected' | 'addedAt'>) => {
    const existingItem = items.value.find(
      i => i.spuId === item.spuId && i.skuId === item.skuId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.value.push({
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isSelected: true,
        addedAt: new Date().toISOString()
      });
    }

    lastUpdated.value = Date.now();
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = items.value.find(i => i.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
      lastUpdated.value = Date.now();
    }
  };

  const toggleSelection = (id: string) => {
    const item = items.value.find(i => i.id === id);
    if (item) {
      item.isSelected = !item.isSelected;
    }
  };

  const toggleAllSelection = (selected: boolean) => {
    items.value.forEach(item => item.isSelected = selected);
  };

  const removeFromCart = (id: string) => {
    items.value = items.value.filter(i => i.id !== id);
    lastUpdated.value = Date.now();
  };

  const clearCart = () => {
    items.value = [];
    lastUpdated.value = Date.now();
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('cart');
    if (stored) {
      items.value = stored;
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('cart', items.value);
  };

  // 初始化时从本地加载
  loadFromStorage();

  // 监听变化并保存
  const stopWatch = watch(
    () => items.value,
    (newVal) => {
      saveToStorage();
      lastUpdated.value = Date.now();
    },
    { deep: true }
  );

  return {
    // State
    items,
    lastUpdated,

    // Getters
    totalCount,
    selectedCount,
    totalPrice,
    selectedItems,
    hasItems,

    // Actions
    addToCart,
    updateQuantity,
    toggleSelection,
    toggleAllSelection,
    removeFromCart,
    clearCart,
    loadFromStorage,
    saveToStorage,
    stopWatch
  };
});