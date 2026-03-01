import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface ProductSpec {
  name: string;
  values: string[];
}

export interface ProductSku {
  id: string;
  price: number;
  originalPrice: number;
  stock: number;
  specs: Array<{ name: string; value: string }>;
}

export interface ProductDetail {
  id: string;
  name: string;
  subName: string;
  cover: string;
  gallery: string[];
  price: number;
  originalPrice: number;
  stock: number;
  salesCount: number;
  score: number;
  commentCount: number;
  isPackageSale: boolean;
  specs: ProductSpec[];
  skus: ProductSku[];
  sellerInfo: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    isOfficial: boolean;
    verified: boolean;
  };
}

export const useProductDetailStore = defineStore('product-detail', () => {
  // State
  const currentSpuId = ref<string>('');
  const currentSkuId = ref<string>('');
  const detail = ref<ProductDetail | null>(null);
  const selectedSpecs = ref<Record<string, string>>({});
  const isFavorite = ref(false);
  const isCartAdded = ref(false);
  const viewHistory = ref<string[]>([]);

  // Getters
  const currentSku = computed(() => 
    detail.value?.skus.find(sku => sku.id === currentSkuId.value) || null
  );

  const currentPrice = computed(() => 
    currentSku.value?.price || detail.value?.price || 0
  );

  const currentStock = computed(() => 
    currentSku.value?.stock || detail.value?.stock || 0
  );

  const canAddToCart = computed(() => 
    currentSkuId.value && currentStock.value > 0
  );

  // Actions
  const setSpuId = (spuId: string) => {
    currentSpuId.value = spuId;
  };

  const setDetail = (data: ProductDetail) => {
    detail.value = data;
    
    // 初始化规格选择
    const initialSpecs: Record<string, string> = {};
    data.specs.forEach(spec => {
      initialSpecs[spec.name] = spec.values[0];
    });
    selectedSpecs.value = initialSpecs;
    
    // 设置默认 SKU
    const defaultSku = findMatchingSku(data.skus, initialSpecs);
    if (defaultSku) {
      currentSkuId.value = defaultSku.id;
    }
  };

  const selectSpec = (specName: string, value: string) => {
    selectedSpecs.value[specName] = value;
    
    // 查找匹配的 SKU
    const matchingSku = findMatchingSku(detail.value?.skus || [], selectedSpecs.value);
    if (matchingSku) {
      currentSkuId.value = matchingSku.id;
    }
  };

  const toggleFavorite = () => {
    if (detail.value) {
      isFavorite.value = !isFavorite.value;
      // 调用 API
      // favoriteApi.toggle('spu', detail.value.id);
    }
  };

  const addToViewHistory = (spuId: string) => {
    // 移除已存在的
    const index = viewHistory.value.indexOf(spuId);
    if (index > -1) {
      viewHistory.value.splice(index, 1);
    }
    
    // 添加到最前面
    viewHistory.value.unshift(spuId);
    
    // 限制数量
    if (viewHistory.value.length > 50) {
      viewHistory.value = viewHistory.value.slice(0, 50);
    }
    
    // 保存到本地
    uni.setStorageSync('viewHistory', viewHistory.value);
  };

  const loadViewHistory = () => {
    const stored = uni.getStorageSync('viewHistory');
    if (stored) {
      viewHistory.value = stored;
    }
  };

  const clearViewHistory = () => {
    viewHistory.value = [];
    uni.removeStorageSync('viewHistory');
  };

  // 辅助函数
  const findMatchingSku = (
    skus: ProductSku[], 
    selectedSpecs: Record<string, string>
  ): ProductSku | null => {
    return skus.find(sku => {
      const skuSpecs = new Map(
        sku.specs.map(s => [s.name, s.value])
      );
      
      return Object.entries(selectedSpecs).every(
        ([name, value]) => skuSpecs.get(name) === value
      );
    }) || null;
  };

  // 初始化
  loadViewHistory();

  return {
    // State
    currentSpuId,
    currentSkuId,
    detail,
    selectedSpecs,
    isFavorite,
    isCartAdded,
    viewHistory,

    // Getters
    currentSku,
    currentPrice,
    currentStock,
    canAddToCart,

    // Actions
    setSpuId,
    setDetail,
    selectSpec,
    toggleFavorite,
    addToViewHistory,
    loadViewHistory,
    clearViewHistory
  };
});