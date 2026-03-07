<template>
  <view class="product-category-page" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
    <view class="page-header">
      <view class="header-bg" />
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <ui-icon name="arrow-left" :size="40" />
        </view>
        <view class="header-center">
          <text class="page-title">找产品</text>
          <view class="search-bar" @click="goSearch">
            <ui-icon name="search" :size="32" color="#A1A1A6" />
            <text class="search-placeholder">搜索产品类型...</text>
          </view>
        </view>
      </view>
    </view>
    
    <scroll-view 
      scroll-y 
      class="category-scroll"
      :style="{ height: scrollHeight + 'px' }"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      @scroll="handleScroll"
    >
      <view class="category-content">
        <view class="section">
          <view class="section-header">
            <view class="section-title-wrapper">
              <view class="section-icon">
                <ui-icon name="grid" :size="32" color="#FF6A00" />
              </view>
              <text class="section-title">设备类型</text>
            </view>
            <text class="section-badge">热门</text>
          </view>
          <ui-device-category-grid 
            :categories="deviceCategories" 
            :columns="4"
            @select="handleCategorySelect"
          />
        </view>
        
        <view class="section">
          <view class="section-header">
            <view class="section-title-wrapper">
              <view class="section-icon">
                <ui-icon name="list" :size="32" color="#FF6A00" />
              </view>
              <text class="section-title">所有产品类型</text>
            </view>
            <text class="section-desc">按字母索引</text>
          </view>
          
          <ui-alphabet-index-list 
            ref="alphabetListRef"
            :categories="allCategories"
            :current-letter="currentLetter"
            @select="handleCategorySelect"
            @update:current-letter="handleLetterChange"
          />
        </view>
        
        <view class="page-bottom-spacer" />
      </view>
    </scroll-view>
    
    <view 
      class="alphabet-nav-fixed"
      :style="{ top: alphabetNavTop + 'px' }"
      @touchstart.prevent="handleNavTouchStart"
      @touchmove.prevent="handleNavTouchMove"
      @touchend="handleNavTouchEnd"
    >
      <view 
        v-for="letter in availableLetters" 
        :key="letter" 
        class="nav-item"
        :class="{ 'is-active': currentLetter === letter }"
        @click="handleLetterClick(letter)"
      >
        <text>{{ letter }}</text>
      </view>
    </view>
    
    <view v-if="showLetterIndicator" class="letter-indicator">
      <text>{{ currentLetter }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAppStore, useProductCategoryStore } from '@/stores';
import { useNavigation } from '@/composables/useNavigation';
import type { DeviceCategory, CategoryItem, AlphabetCategory } from '@/api/category';

const appStore = useAppStore();
const productCategoryStore = useProductCategoryStore();
const { smartBack, navigateTo } = useNavigation();

const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
const isH5 = computed(() => appStore.isH5);
const headerExtraTop = computed(() => isH5.value ? 12 : 0);
const scrollHeight = ref(0);
const alphabetNavTop = ref(0);

const deviceCategories = computed(() => productCategoryStore.deviceCategories);
const allCategories = computed(() => productCategoryStore.allCategories);
const currentLetter = computed(() => productCategoryStore.currentLetter);

const scrollIntoView = ref('');
const showLetterIndicator = ref(false);
const isTouching = ref(false);
let indicatorTimer: ReturnType<typeof setTimeout> | null = null;
let throttleTimer: ReturnType<typeof setTimeout> | null = null;

const availableLetters = computed(() => {
  return allCategories.value
    .filter(g => g.categories.length > 0)
    .map(g => g.letter);
});

onMounted(async () => {
  nextTick(() => {
    calcLayout();
  });
  
  await productCategoryStore.fetchDeviceCategories();
  await productCategoryStore.fetchAllCategories();
});

const calcLayout = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const estimatedHeader = rpxToPx(140) + safeAreaTop.value + headerExtraTop.value;
  scrollHeight.value = systemInfo.windowHeight - estimatedHeader;
  
  alphabetNavTop.value = estimatedHeader + rpxToPx(200);
};

const handleCategorySelect = (item: DeviceCategory | CategoryItem) => {
  navigateTo(`/pages-sub/search/result?categoryId=${item.id}&keyword=${encodeURIComponent(item.name)}`);
};

const goSearch = () => {
  navigateTo('/pages-sub/search/entry');
};

const goBack = () => {
  smartBack();
};

const handleScroll = (e: any) => {
  if (isTouching.value) return;
  
  if (throttleTimer) {
    clearTimeout(throttleTimer);
  }
  
  throttleTimer = setTimeout(() => {
    updateCurrentLetterByScroll(e.detail.scrollTop);
  }, 50);
};

const updateCurrentLetterByScroll = (scrollTop: number) => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  const rpxToPx = (rpx: number) => (rpx * screenWidth) / 750;
  
  const headerOffset = rpxToPx(300);
  const sectionOffset = scrollTop + headerOffset;
  
  let currentSectionLetter = 'A';
  
  for (const group of allCategories.value) {
    if (group.categories.length === 0) continue;
    
    const sectionTop = getSectionTop(group.letter);
    if (sectionTop <= sectionOffset) {
      currentSectionLetter = group.letter;
    }
  }
  
  if (productCategoryStore.currentLetter !== currentSectionLetter) {
    productCategoryStore.setCurrentLetter(currentSectionLetter);
  }
};

const getSectionTop = (letter: string): number => {
  let top = 0;
  for (const group of allCategories.value) {
    if (group.letter === letter) break;
    if (group.categories.length > 0) {
      top += 100 + group.categories.length * 50;
    }
  }
  return top;
};

const handleLetterClick = (letter: string) => {
  scrollIntoView.value = `letter-${letter}`;
  productCategoryStore.setCurrentLetter(letter);
  showLetterIndicator.value = true;
  
  if (indicatorTimer) {
    clearTimeout(indicatorTimer);
  }
  indicatorTimer = setTimeout(() => {
    showLetterIndicator.value = false;
  }, 1000);
};

const handleLetterChange = (letter: string) => {
  productCategoryStore.setCurrentLetter(letter);
};

const handleNavTouchStart = () => {
  isTouching.value = true;
};

const handleNavTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0];
  const query = uni.createSelectorQuery();
  
  query.select('.alphabet-nav-fixed').boundingClientRect((rect: any) => {
    if (!rect) return;
    
    const relativeY = touch.clientY - rect.top;
    const itemHeight = rect.height / availableLetters.value.length;
    const index = Math.floor(relativeY / itemHeight);
    
    if (index >= 0 && index < availableLetters.value.length) {
      const letter = availableLetters.value[index];
      handleLetterClick(letter);
    }
  }).exec();
};

const handleNavTouchEnd = () => {
  setTimeout(() => {
    isTouching.value = false;
  }, 100);
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
  overflow: hidden;
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

.section-desc {
  font-size: $font-size-sm;
  color: $color-text-sub;
}

.page-bottom-spacer {
  height: 40rpx;
}

.alphabet-nav-fixed {
  position: fixed;
  right: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-xs $space-2;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-full;
  z-index: $z-sticky;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.nav-item {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  transition: all $duration-fast $ease-spring;
  
  text {
    font-size: $font-size-xs;
    color: $color-text-sub;
  }
  
  &.is-active {
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    box-shadow: 0 2rpx 8rpx rgba(255, 106, 0, 0.3);
    
    text {
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
      color: #FFFFFF;
    }
  }
}

.letter-indicator {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  box-shadow: 0 8rpx 32rpx rgba(255, 106, 0, 0.4);
  animation: indicator-pop 0.2s $ease-spring;
  
  text {
    font-size: 64rpx;
    font-weight: $font-weight-bold;
    color: #FFFFFF;
  }
}

@keyframes indicator-pop {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

[data-theme="dark"] {
  .header-bg {
    background: linear-gradient(180deg, rgba(217, 70, 239, 0.08) 0%, rgba(217, 70, 239, 0) 100%);
  }
  
  .header-content {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }
  
  .back-btn {
    background: rgba(255, 255, 255, 0.08);
    
    &:active {
      background: rgba(255, 255, 255, 0.12);
    }
  }
  
  .page-title {
    color: var(--color-text-main, #F2F2F7);
  }
  
  .search-bar {
    background: rgba(255, 255, 255, 0.08);
    
    &:active {
      background: rgba(255, 255, 255, 0.12);
    }
    
    .search-placeholder {
      color: var(--color-text-placeholder, #6B7280);
    }
  }
  
  .section-icon {
    background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
  }
  
  .section-title {
    color: var(--color-text-main, #F2F2F7);
  }
  
  .section-badge {
    color: var(--color-primary, #E879F9);
    background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
  }
  
  .section-desc {
    color: var(--color-text-sub, #A1A1AA);
  }
  
  .alphabet-nav-fixed {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
    border-bottom: 1px solid transparent;
    border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .nav-item {
    text {
      color: var(--color-text-sub, #A1A1AA);
    }
    
    &.is-active {
      background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
      box-shadow: 0 2rpx 8rpx rgba(217, 70, 239, 0.4);
      
      text {
        color: #FFFFFF;
      }
    }
  }
  
  .letter-indicator {
    background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
    box-shadow: 0 8rpx 32rpx rgba(217, 70, 239, 0.4);
  }
}
</style>
