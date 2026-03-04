import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type SellerType = 'all' | 'merchant' | 'personal';

export interface FilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  children?: FilterOption[];
}

export interface AdvancedFilters {
  priceMin: string;
  priceMax: string;
  brands: string[];
  storages: string[];
  conditions: string[];
  tradeMethods: string[];
  hasInvoice: boolean;
  hasWarranty: boolean;
  canInspect: boolean;
  freeShipping: boolean;
  publishTime: string;
}

export const CONDITION_OPTIONS: FilterOption[] = [
  { label: '全新', value: 'new' },
  { label: '99新', value: '99new' },
  { label: '95新', value: '95new' },
  { label: '9新', value: '9new' },
  { label: '8新', value: '8new' },
  { label: '7新及以下', value: '7new' }
];

export const DEVICE_OPTIONS: FilterOption[] = [
  { label: '全部设备', value: 'all' },
  { 
    label: '手机', 
    value: 'phone',
    children: [
      { label: 'iPhone', value: 'iphone' },
      { label: '华为', value: 'huawei' },
      { label: '小米', value: 'xiaomi' },
      { label: 'OPPO', value: 'oppo' },
      { label: 'vivo', value: 'vivo' },
      { label: '其他手机', value: 'other-phone' }
    ]
  },
  { 
    label: '电脑', 
    value: 'computer',
    children: [
      { label: '笔记本', value: 'laptop' },
      { label: '台式机', value: 'desktop' }
    ]
  },
  { label: '平板', value: 'tablet' },
  { label: '相机', value: 'camera' },
  { label: '耳机', value: 'earphone' },
  { label: '手表', value: 'watch' },
  { label: '游戏机', value: 'game' },
  { label: '其他设备', value: 'other' }
];

export const BRAND_OPTIONS: FilterOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: '华为', value: 'huawei' },
  { label: '小米', value: 'xiaomi' },
  { label: '三星', value: 'samsung' },
  { label: 'OPPO', value: 'oppo' },
  { label: 'vivo', value: 'vivo' },
  { label: '索尼', value: 'sony' },
  { label: '联想', value: 'lenovo' },
  { label: '华硕', value: 'asus' },
  { label: '戴尔', value: 'dell' },
  { label: '其他', value: 'other' }
];

export const STORAGE_OPTIONS: FilterOption[] = [
  { label: '64GB', value: '64' },
  { label: '128GB', value: '128' },
  { label: '256GB', value: '256' },
  { label: '512GB', value: '512' },
  { label: '1TB', value: '1024' },
  { label: '2TB及以上', value: '2048' }
];

export const TRADE_METHOD_OPTIONS: FilterOption[] = [
  { label: '同城面交', value: 'local' },
  { label: '快递邮寄', value: 'express' },
  { label: '自提', value: 'pickup' }
];

export const PUBLISH_TIME_OPTIONS: FilterOption[] = [
  { label: '今天', value: 'today' },
  { label: '3天内', value: '3days' },
  { label: '一周内', value: 'week' },
  { label: '一个月内', value: 'month' },
  { label: '三个月内', value: 'quarter' }
];

export const PRICE_RANGES = [
  { label: '0-500', min: '0', max: '500' },
  { label: '500-1000', min: '500', max: '1000' },
  { label: '1000-3000', min: '1000', max: '3000' },
  { label: '3000-5000', min: '3000', max: '5000' },
  { label: '5000-10000', min: '5000', max: '10000' },
  { label: '10000以上', min: '10000', max: '' }
];

export const useSearchFilterStore = defineStore('search-filter', () => {
  const sellerType = ref<SellerType>('all');
  const condition = ref<string | number | null>(null);
  const deviceType = ref<string | number | null>(null);
  
  const advancedFilters = ref<AdvancedFilters>({
    priceMin: '',
    priceMax: '',
    brands: [],
    storages: [],
    conditions: [],
    tradeMethods: [],
    hasInvoice: false,
    hasWarranty: false,
    canInspect: false,
    freeShipping: false,
    publishTime: ''
  });

  const hasBasicFilters = computed(() => {
    return sellerType.value !== 'all' || 
           condition.value !== null || 
           deviceType.value !== null;
  });

  const advancedFilterCount = computed(() => {
    const f = advancedFilters.value;
    let count = 0;
    if (f.priceMin || f.priceMax) count++;
    count += f.brands.length;
    count += f.storages.length;
    count += f.conditions.length;
    count += f.tradeMethods.length;
    if (f.hasInvoice) count++;
    if (f.hasWarranty) count++;
    if (f.canInspect) count++;
    if (f.freeShipping) count++;
    if (f.publishTime) count++;
    return count;
  });

  const hasAnyFilters = computed(() => {
    return hasBasicFilters.value || advancedFilterCount.value > 0;
  });

  const setSellerType = (type: SellerType) => {
    sellerType.value = type;
  };

  const setCondition = (value: string | number | null) => {
    condition.value = value;
  };

  const setDeviceType = (value: string | number | null) => {
    deviceType.value = value;
  };

  const setAdvancedFilters = (filters: Partial<AdvancedFilters>) => {
    advancedFilters.value = { ...advancedFilters.value, ...filters };
  };

  const resetBasicFilters = () => {
    sellerType.value = 'all';
    condition.value = null;
    deviceType.value = null;
  };

  const resetAdvancedFilters = () => {
    advancedFilters.value = {
      priceMin: '',
      priceMax: '',
      brands: [],
      storages: [],
      conditions: [],
      tradeMethods: [],
      hasInvoice: false,
      hasWarranty: false,
      canInspect: false,
      freeShipping: false,
      publishTime: ''
    };
  };

  const resetAllFilters = () => {
    resetBasicFilters();
    resetAdvancedFilters();
  };

  const getFilterParams = () => {
    return {
      sellerType: sellerType.value,
      condition: condition.value,
      deviceType: deviceType.value,
      ...advancedFilters.value
    };
  };

  return {
    sellerType,
    condition,
    deviceType,
    advancedFilters,
    hasBasicFilters,
    advancedFilterCount,
    hasAnyFilters,
    setSellerType,
    setCondition,
    setDeviceType,
    setAdvancedFilters,
    resetBasicFilters,
    resetAdvancedFilters,
    resetAllFilters,
    getFilterParams
  };
});
