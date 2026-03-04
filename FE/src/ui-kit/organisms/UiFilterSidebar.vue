<template>
  <view class="ui-filter-sidebar" :class="{ 'is-show': show }">
    <view class="sidebar-mask" @click="handleClose" />
    
    <view class="sidebar-content">
      <view class="sidebar-header">
        <text class="header-title">筛选</text>
        <view class="close-btn" @click="handleClose">
          <ui-icon name="close" :size="36" color="#6E6E73" />
        </view>
      </view>
      
      <scroll-view scroll-y class="sidebar-body">
        <view class="filter-section">
          <text class="section-title">价格区间</text>
          <view class="price-inputs">
            <input 
              v-model="localFilters.priceMin" 
              type="number" 
              placeholder="最低价" 
              class="price-input"
            />
            <text class="price-divider">-</text>
            <input 
              v-model="localFilters.priceMax" 
              type="number" 
              placeholder="最高价" 
              class="price-input"
            />
          </view>
          <view class="price-quick">
            <view 
              v-for="range in PRICE_RANGES" 
              :key="range.label"
              class="quick-item"
              :class="{ 'is-active': selectedPriceRange === range.label }"
              @click="handlePriceRange(range)"
            >
              {{ range.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">品牌</text>
          <view class="tag-grid">
            <view 
              v-for="brand in BRAND_OPTIONS" 
              :key="brand.value"
              class="tag-item"
              :class="{ 'is-active': localFilters.brands.includes(brand.value as string) }"
              @click="handleToggle('brands', brand.value as string)"
            >
              {{ brand.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">存储容量</text>
          <view class="tag-grid">
            <view 
              v-for="storage in STORAGE_OPTIONS" 
              :key="storage.value"
              class="tag-item"
              :class="{ 'is-active': localFilters.storages.includes(storage.value as string) }"
              @click="handleToggle('storages', storage.value as string)"
            >
              {{ storage.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">成色</text>
          <view class="tag-grid">
            <view 
              v-for="cond in CONDITION_OPTIONS" 
              :key="cond.value"
              class="tag-item"
              :class="{ 'is-active': localFilters.conditions.includes(cond.value as string) }"
              @click="handleToggle('conditions', cond.value as string)"
            >
              {{ cond.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">交易方式</text>
          <view class="tag-grid">
            <view 
              v-for="method in TRADE_METHOD_OPTIONS" 
              :key="method.value"
              class="tag-item"
              :class="{ 'is-active': localFilters.tradeMethods.includes(method.value as string) }"
              @click="handleToggle('tradeMethods', method.value as string)"
            >
              {{ method.label }}
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">其他筛选</text>
          <view class="switch-list">
            <view class="switch-item">
              <text class="switch-label">有发票</text>
              <switch 
                :checked="localFilters.hasInvoice" 
                color="#1ABC9C"
                @change="localFilters.hasInvoice = $event.detail.value"
              />
            </view>
            <view class="switch-item">
              <text class="switch-label">在保修期内</text>
              <switch 
                :checked="localFilters.hasWarranty" 
                color="#1ABC9C"
                @change="localFilters.hasWarranty = $event.detail.value"
              />
            </view>
            <view class="switch-item">
              <text class="switch-label">支持验货</text>
              <switch 
                :checked="localFilters.canInspect" 
                color="#1ABC9C"
                @change="localFilters.canInspect = $event.detail.value"
              />
            </view>
            <view class="switch-item">
              <text class="switch-label">仅看包邮</text>
              <switch 
                :checked="localFilters.freeShipping" 
                color="#1ABC9C"
                @change="localFilters.freeShipping = $event.detail.value"
              />
            </view>
          </view>
        </view>
        
        <view class="filter-section">
          <text class="section-title">发布时间</text>
          <view class="tag-grid">
            <view 
              v-for="time in PUBLISH_TIME_OPTIONS" 
              :key="time.value"
              class="tag-item"
              :class="{ 'is-active': localFilters.publishTime === time.value }"
              @click="localFilters.publishTime = time.value as string"
            >
              {{ time.label }}
            </view>
          </view>
        </view>
      </scroll-view>
      
      <view class="sidebar-footer">
        <view class="reset-btn" @click="handleReset">
          <text>重置</text>
        </view>
        <view class="confirm-btn" @click="handleConfirm">
          <text>确定</text>
          <text v-if="activeFilterCount > 0" class="filter-count">({{ activeFilterCount }})</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { 
  useSearchFilterStore,
  CONDITION_OPTIONS,
  BRAND_OPTIONS,
  STORAGE_OPTIONS,
  TRADE_METHOD_OPTIONS,
  PUBLISH_TIME_OPTIONS,
  PRICE_RANGES,
  type AdvancedFilters
} from '@/stores/search-filter';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  confirm: [filters: AdvancedFilters];
  reset: [];
}>();

const searchFilterStore = useSearchFilterStore();

const selectedPriceRange = ref('');

const localFilters = reactive<AdvancedFilters>({
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

const activeFilterCount = computed(() => {
  let count = 0;
  if (localFilters.priceMin || localFilters.priceMax) count++;
  count += localFilters.brands.length;
  count += localFilters.storages.length;
  count += localFilters.conditions.length;
  count += localFilters.tradeMethods.length;
  if (localFilters.hasInvoice) count++;
  if (localFilters.hasWarranty) count++;
  if (localFilters.canInspect) count++;
  if (localFilters.freeShipping) count++;
  if (localFilters.publishTime) count++;
  return count;
});

watch(() => props.show, (isShow) => {
  if (isShow) {
    Object.assign(localFilters, searchFilterStore.advancedFilters);
  }
});

const handlePriceRange = (range: typeof PRICE_RANGES[0]) => {
  selectedPriceRange.value = range.label;
  localFilters.priceMin = range.min;
  localFilters.priceMax = range.max;
};

const handleToggle = (field: 'brands' | 'storages' | 'conditions' | 'tradeMethods', value: string) => {
  const arr = localFilters[field];
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  } else {
    arr.push(value);
  }
};

const handleClose = () => {
  emit('update:show', false);
};

const handleReset = () => {
  localFilters.priceMin = '';
  localFilters.priceMax = '';
  selectedPriceRange.value = '';
  localFilters.brands = [];
  localFilters.storages = [];
  localFilters.conditions = [];
  localFilters.tradeMethods = [];
  localFilters.hasInvoice = false;
  localFilters.hasWarranty = false;
  localFilters.canInspect = false;
  localFilters.freeShipping = false;
  localFilters.publishTime = '';
  searchFilterStore.resetAdvancedFilters();
  emit('reset');
};

const handleConfirm = () => {
  searchFilterStore.setAdvancedFilters({ ...localFilters });
  emit('confirm', { ...localFilters });
  handleClose();
};
</script>

<style lang="scss" scoped>
.ui-filter-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-modal;
  visibility: hidden;
  transition: visibility $duration-normal;
  
  &.is-show {
    visibility: visible;
    
    .sidebar-mask { opacity: 1; }
    .sidebar-content { transform: translateX(0); }
  }
}

.sidebar-mask {
  @include cover-screen;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity $duration-normal;
}

.sidebar-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 600rpx;
  height: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur($blur-xxl);
  -webkit-backdrop-filter: blur($blur-xxl);
  transform: translateX(100%);
  transition: transform $duration-normal $ease-out;
  display: flex;
  flex-direction: column;
  box-shadow: -8rpx 0 32rpx rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-lg $space-md;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  
  .header-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  .close-btn {
    padding: $space-xs;
    border-radius: 50%;
    transition: all $duration-fast;
    
    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

.sidebar-body {
  flex: 1;
  overflow: hidden;
}

.filter-section {
  padding: $space-md;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
    display: block;
  }
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin-bottom: $space-md;
  
  .price-input {
    flex: 1;
    height: 72rpx;
    padding: 0 $space-md;
    background: rgba(0, 0, 0, 0.03);
    border-radius: $radius-md;
    font-size: $font-size-md;
    color: $color-text-main;
    border: 1rpx solid transparent;
    
    &:focus {
      border-color: $color-primary;
      background: rgba($color-primary, 0.04);
    }
  }
  
  .price-divider {
    color: $color-text-sub;
    font-size: $font-size-md;
  }
}

.price-quick {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  
  .quick-item {
    padding: $space-xs $space-md;
    background: rgba(0, 0, 0, 0.03);
    border-radius: $radius-full;
    font-size: $font-size-sm;
    color: $color-text-sub;
    transition: all $duration-fast;
    
    &.is-active {
      background: rgba($color-primary, 0.1);
      color: $color-primary;
    }
  }
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  
  .tag-item {
    padding: $space-sm $space-md;
    background: rgba(0, 0, 0, 0.03);
    border-radius: $radius-md;
    font-size: $font-size-sm;
    color: $color-text-sub;
    transition: all $duration-fast;
    border: 1rpx solid transparent;
    
    &.is-active {
      background: rgba($color-primary, 0.1);
      color: $color-primary;
      border-color: rgba($color-primary, 0.3);
    }
  }
}

.switch-list {
  .switch-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-sm 0;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
    }
    
    .switch-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
}

.sidebar-footer {
  display: flex;
  gap: $space-md;
  padding: $space-md;
  border-top: 1rpx solid rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.95);
  flex-shrink: 0;
  
  .reset-btn {
    flex: 1;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.03);
    border-radius: $radius-full;
    font-size: $font-size-md;
    color: $color-text-main;
    transition: all $duration-fast;
    
    &:active {
      background: rgba(0, 0, 0, 0.06);
    }
  }
  
  .confirm-btn {
    flex: 2;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    border-radius: $radius-full;
    font-size: $font-size-md;
    color: $color-white;
    font-weight: $font-weight-medium;
    transition: all $duration-fast;
    
    &:active {
      transform: scale(0.98);
    }
    
    .filter-count {
      margin-left: 4rpx;
    }
  }
}
</style>
