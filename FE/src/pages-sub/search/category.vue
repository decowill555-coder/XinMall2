<template>
  <view class="product-category-page">
    <view class="page-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-bg" />
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <ui-icon name="arrow-left" :size="40" />
        </view>
        <view class="header-center">
          <text class="page-title">找产品</text>
          <view class="search-bar" @click="goSearch">
            <ui-icon name="search" :size="32" color="placeholder" />
            <text class="search-placeholder">搜索产品类型...</text>
          </view>
        </view>
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="category-scroll"
      :style="{ top: headerHeight + 'px', height: scrollHeight + 'px' }"
      :scroll-top="scrollTopValue"
      :scroll-with-animation="true"
      @scroll="handleScroll"
    >
      <view class="category-content">
        <view class="section device-section">
          <view class="section-header">
            <view class="section-title-wrapper">
              <view class="section-icon">
                <ui-icon name="grid" :size="32" color="primary" />
              </view>
              <text class="section-title">设备类型</text>
            </view>
            <text class="section-badge">热门</text>
          </view>
          <ui-device-category-grid 
            id="device-grid"
            :categories="deviceCategories" 
            :columns="4"
            @select="handleCategorySelect"
          />
        </view>
        
        <view 
          v-for="group in allCategories.filter(g => g.categories.length > 0)" 
          :key="group.letter"
          class="section letter-section"
        >
          <view class="section-header">
            <view class="section-title-wrapper">
              <view class="letter-badge">
                <text class="letter-text">{{ group.letter }}</text>
              </view>
              <text class="letter-count">{{ group.categories.length }}个分类</text>
            </view>
          </view>
          
          <view class="category-list">
            <view 
              v-for="(item, index) in group.categories" 
              :key="item.id" 
              :id="`item-${group.letter}-${index}`"
              class="category-item"
              :class="{ 'is-pressed': pressedId === item.id }"
              @click="handleCategorySelect(item)"
              @touchstart="pressedId = item.id"
              @touchend="pressedId = ''"
            >
              <view class="item-indicator" :style="{ background: getIndicatorColor(index) }" />
              <text class="category-name">{{ item.name }}</text>
              <view class="category-arrow">
                <text class="arrow-text">›</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="page-bottom-spacer" />
      </view>
    </scroll-view>
    
    <ui-alphabet-nav
      :letters="availableLetters"
      :current-letter="currentLetter"
      :style="{ top: alphabetNavTop + 'px' }"
      @update:current-letter="handleLetterChange"
      @scroll-to="scrollToLetter"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue';
import { useAppStore, useProductCategoryStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import type { DeviceCategory, CategoryItem } from '@/api/category';

const appStore = useAppStore();
const productCategoryStore = useProductCategoryStore();
const { smartBack, navigateTo } = useNavigation();
const instance = getCurrentInstance();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const scrollHeight = ref(0);
const headerHeight = ref(0);
const alphabetNavTop = ref(0);

const deviceCategories = computed(() => productCategoryStore.deviceCategories);
const allCategories = computed(() => productCategoryStore.allCategories);
const currentLetter = computed(() => productCategoryStore.currentLetter);

const scrollTopValue = ref(0);
const pressedId = ref<string>('');
const letterPositions = ref<Map<string, number>>(new Map());
let lastScrollTop = 0;
let isScrollingByClick = false;
let isInitialized = false;

const availableLetters = computed(() => {
  return allCategories.value
    .filter(g => g.categories.length > 0)
    .map(g => g.letter);
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const getIndicatorColor = (index: number): string => {
  const colors = [
    'linear-gradient(180deg, #FF6A00 0%, #FF8F00 100%)',
    'linear-gradient(180deg, #5856D6 0%, #7B79E8 100%)',
    'linear-gradient(180deg, #34C759 0%, #5AD97A 100%)',
    'linear-gradient(180deg, #FF3B30 0%, #FF6B6B 100%)',
    'linear-gradient(180deg, #00D2FF 0%, #4DE8FF 100%)',
    'linear-gradient(180deg, #E879F9 0%, #F0A3FA 100%)'
  ];
  return colors[index % colors.length];
};

onMounted(async () => {
  nextTick(() => {
    calcLayout();
  });
  
  await productCategoryStore.fetchDeviceCategories();
  await productCategoryStore.fetchAllCategories();
  
  nextTick(() => {
    setTimeout(() => {
      measureLetterPositions();
    }, 300);
  });
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const estimatedHeader = rpxToPx(140) + safeAreaTop.value;
  headerHeight.value = estimatedHeader;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader;
  
  alphabetNavTop.value = estimatedHeader + rpxToPx(200);
};

const measureLetterPositions = () => {
  const query = uni.createSelectorQuery().in(instance);
  
  query.select('.category-scroll').boundingClientRect();
  query.select('#device-grid').boundingClientRect();
  query.selectAll('.category-item').boundingClientRect();
  
  query.exec((res) => {
    if (!res || !res[0]) return;
    
    const containerRect = res[0] as any;
    const deviceGrid = res[1] as any;
    const allItems = (res[2] || []) as any[];
    
    const positions = new Map<string, number>();
    const letters = availableLetters.value;
    
    if (letters.length === 0) return;
    
    const firstLetter = letters[0];
    if (deviceGrid) {
      positions.set(firstLetter, deviceGrid.bottom - containerRect.top);
    }
    
    for (let i = 1; i < letters.length; i++) {
      const prevLetter = letters[i - 1];
      const currentLetter = letters[i];
      
      const prevLetterItems: any[] = [];
      for (const item of allItems) {
        if (item.id && item.id.startsWith(`item-${prevLetter}-`)) {
          prevLetterItems.push(item);
        }
      }
      
      if (prevLetterItems.length > 0) {
        let lastItem = prevLetterItems[0];
        for (const item of prevLetterItems) {
          if (item.bottom > lastItem.bottom) {
            lastItem = item;
          }
        }
        positions.set(currentLetter, lastItem.bottom - containerRect.top);
      } else if (positions.has(prevLetter)) {
        positions.set(currentLetter, positions.get(prevLetter) || 0);
      }
    }
    
    letterPositions.value = positions;
    isInitialized = true;
  });
};

const handleCategorySelect = (item: DeviceCategory | CategoryItem) => {
  navigateTo(`/pages-sub/search/device-type?id=${item.id}&name=${encodeURIComponent(item.name)}`);
};

const goSearch = () => {
  navigateTo('/pages-sub/search/entry');
};

const goBack = () => {
  smartBack();
};

const handleScroll = (e: any) => {
  lastScrollTop = e.detail.scrollTop;
  
  if (isScrollingByClick) return;
  
  if (!isInitialized) return;
  
  updateCurrentLetterByScroll(e.detail.scrollTop);
};

const updateCurrentLetterByScroll = (scrollTop: number) => {
  if (letterPositions.value.size === 0) return;
  
  const letters = availableLetters.value;
  if (letters.length === 0) return;
  
  let foundLetter = letters[0];
  
  for (const letter of letters) {
    const pos = letterPositions.value.get(letter);
    if (pos !== undefined && pos <= scrollTop + 50) {
      foundLetter = letter;
    }
  }
  
  if (productCategoryStore.currentLetter !== foundLetter) {
    productCategoryStore.setCurrentLetter(foundLetter);
  }
};

const handleLetterChange = (letter: string) => {
  productCategoryStore.setCurrentLetter(letter);
};

const scrollToLetter = (letter: string) => {
  if (!isInitialized || letterPositions.value.size === 0) {
    measureLetterPositions();
    setTimeout(() => scrollToLetter(letter), 100);
    return;
  }
  
  const targetTop = letterPositions.value.get(letter);
  if (targetTop === undefined) return;
  
  isScrollingByClick = true;
  scrollTopValue.value = Math.max(0, targetTop);
  
  setTimeout(() => {
    isScrollingByClick = false;
  }, 600);
};
</script>

<style lang="scss" scoped>
.product-category-page {
  min-height: 100vh;
  background: $color-bg-page;
  position: relative;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 106, 0, 0.08) 0%, rgba(255, 106, 0, 0) 100%);
  pointer-events: none;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-sm $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-bottom: 1rpx solid var(--color-border, rgba(44, 38, 36, 0.08));
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  background: var(--color-bg-gray, #F5F5F7);
  transition: all $duration-fast $ease-spring;
  
  &:active {
    transform: scale(0.92);
    background: var(--color-border, rgba(44, 38, 36, 0.08));
  }
}

.header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.page-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-main;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: $space-sm;
  background: var(--color-bg-gray, #F5F5F7);
  border-radius: $radius-full;
  padding: $space-sm $space-md;
  transition: all $duration-fast $ease-spring;
  
  &:active {
    transform: scale(0.99);
    background: var(--color-border, rgba(44, 38, 36, 0.08));
  }
  
  .search-placeholder {
    font-size: $font-size-sm;
    color: $color-text-placeholder;
  }
}

.category-scroll {
  position: fixed;
  left: 0;
  right: 0;
}

.category-content {
  padding: $space-md;
  padding-right: 80rpx;
}

.section {
  margin-bottom: $space-xl;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-md;
  padding: 0 $space-xs;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: $space-sm;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-main;
}

.section-badge {
  font-size: $font-size-xs;
  color: var(--color-primary, #FF6A00);
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
  padding: 4rpx 16rpx;
  border-radius: $radius-full;
  font-weight: $font-weight-medium;
}

.letter-section {
  margin-bottom: $space-lg;
}

.letter-badge {
  width: 56rpx;
  height: 56rpx;
  background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 106, 0, 0.25);
  
  .letter-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-white;
  }
}

.letter-count {
  font-size: $font-size-sm;
  color: $color-text-sub;
}

.category-list {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.category-item {
  display: flex;
  align-items: center;
  padding: $space-md $space-md $space-md $space-sm;
  border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  transition: all $duration-fast $ease-spring;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active,
  &.is-pressed {
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    transform: scale(0.99);
  }
}

.item-indicator {
  width: 6rpx;
  height: 48rpx;
  border-radius: $radius-full;
  margin-right: $space-md;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $color-text-main;
}

.category-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  
  .arrow-text {
    font-size: 40rpx;
    color: $color-text-sub;
    font-weight: 300;
  }
}

.page-bottom-spacer {
  height: 40rpx;
}
</style>
