<template>
  <view class="ui-search-filter-bar">
    <view class="filter-tabs">
      <view 
        v-for="tab in sellerTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ 'is-active': searchFilterStore.sellerType === tab.value }"
        @click="handleSellerClick(tab.value)"
      >
        <text class="tab-text">{{ tab.label }}</text>
      </view>
    </view>
    
    <view class="filter-dropdowns">
      <ui-filter-dropdown
        :options="CONDITION_OPTIONS"
        :model-value="searchFilterStore.condition"
        placeholder="成色"
        @change="handleConditionChange"
      />
      
      <ui-filter-dropdown
        :options="DEVICE_OPTIONS"
        :model-value="searchFilterStore.deviceType"
        placeholder="设备类型"
        @change="handleDeviceChange"
      />
    </view>
    
    <view class="filter-btn" @click="emit('openSidebar')">
      <ui-icon name="filter" :size="32" color="#1ABC9C" />
      <text class="filter-btn-text">筛选</text>
      <view v-if="searchFilterStore.advancedFilterCount > 0" class="filter-dot" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSearchFilterStore, CONDITION_OPTIONS, DEVICE_OPTIONS, type SellerType } from '@/stores/search-filter';
import UiFilterDropdown from '@/ui-kit/molecules/UiFilterDropdown.vue';

const emit = defineEmits<{
  sellerChange: [value: SellerType];
  conditionChange: [value: string | number | null];
  deviceChange: [value: string | number | null];
  openSidebar: [];
}>();

const searchFilterStore = useSearchFilterStore();

const sellerTabs = [
  { label: '商家', value: 'merchant' as const },
  { label: '个人', value: 'personal' as const }
];

const handleSellerClick = (value: 'merchant' | 'personal') => {
  if (searchFilterStore.sellerType === value) {
    searchFilterStore.setSellerType('all');
    emit('sellerChange', 'all');
  } else {
    searchFilterStore.setSellerType(value);
    emit('sellerChange', value);
  }
};

const handleConditionChange = (value: string | number | null) => {
  searchFilterStore.setCondition(value);
  emit('conditionChange', value);
};

const handleDeviceChange = (value: string | number | null) => {
  searchFilterStore.setDeviceType(value);
  emit('deviceChange', value);
};
</script>

<style lang="scss" scoped>
.ui-search-filter-bar {
  display: flex;
  align-items: center;
  padding: $space-sm $space-md;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
  gap: $space-sm;
}

.filter-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  border-radius: $radius-full;
  padding: 4rpx;
  flex-shrink: 0;
  
  .tab-item {
    padding: $space-xs $space-md;
    border-radius: $radius-full;
    transition: all $duration-fast $ease-spring;
    
    .tab-text {
      font-size: $font-size-sm;
      color: $color-text-sub;
      white-space: nowrap;
    }
    
    &.is-active {
      background: $color-white;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
      
      .tab-text {
        color: $color-primary;
        font-weight: $font-weight-medium;
      }
    }
  }
}

.filter-dropdowns {
  display: flex;
  flex: 1;
  gap: $space-sm;
  min-width: 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-sm $space-md;
  background: rgba($color-primary, 0.08);
  border-radius: $radius-md;
  position: relative;
  flex-shrink: 0;
  transition: all $duration-fast $ease-spring;
  
  &:active {
    transform: scale(0.96);
    background: rgba($color-primary, 0.12);
  }
  
  .filter-btn-text {
    font-size: $font-size-sm;
    color: $color-primary;
    margin-left: 4rpx;
    font-weight: $font-weight-medium;
  }
  
  .filter-dot {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 12rpx;
    height: 12rpx;
    background: $color-error;
    border-radius: 50%;
    border: 2rpx solid $color-white;
  }
}
</style>
