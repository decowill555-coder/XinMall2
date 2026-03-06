<template>
  <view 
    class="ui-search" 
    :class="{ 'is-focus': isFocus }"
    @tap="handleClick"
  >
    <UiIcon name="search" color="#A1A1A6" :size="40" class="ui-search__icon" />
    
    <view v-if="!disabled" class="ui-search__content">
      <input 
        class="ui-search__input"
        :placeholder="isShowHotRoller ? '' : placeholder"
        :value="modelValue"
        :focus="autoFocus"
        @input="handleInput"
        @confirm="handleConfirm"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <view 
        v-if="isShowHotRoller" 
        class="ui-search__hot-roller"
        :class="{ 'is-disabled': disabled }"
      >
        <view 
          class="hot-roller__inner"
          :class="{ 'is-animating': isAnimating }"
          :style="{ transform: `translateY(-${rollerOffset}px)` }"
        >
          <view 
            v-for="(item, index) in displayHotList" 
            :key="index"
            class="hot-roller__item"
            :class="{ 'is-clickable': !disabled }"
          >
            <text 
              class="hot-roller__text" 
              :class="{ 'is-clickable': !disabled }"
              @tap.stop="!disabled && handleHotClick(index)"
            >{{ item.keyword }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view v-else class="ui-search__content">
      <view class="ui-search__input-placeholder">
        <text v-if="!isShowHotRoller">{{ placeholder }}</text>
      </view>
      
      <view 
        v-if="isShowHotRoller" 
        class="ui-search__hot-roller"
        :class="{ 'is-disabled': disabled }"
      >
        <view 
          class="hot-roller__inner"
          :class="{ 'is-animating': isAnimating }"
          :style="{ transform: `translateY(-${rollerOffset}px)` }"
        >
          <view 
            v-for="(item, index) in displayHotList" 
            :key="index"
            class="hot-roller__item"
            :class="{ 'is-clickable': !disabled }"
          >
            <text 
              class="hot-roller__text" 
              :class="{ 'is-clickable': true }"
              @tap.stop="handleHotClick(index)"
            >{{ item.keyword }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view 
      v-if="modelValue && !disabled" 
      class="ui-search__clear"
      @tap.stop="handleClear"
    >
      <UiIcon name="close-circle-fill" color="#A1A1A6" :size="40" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export interface HotKeywordItem {
  keyword: string;
  id?: string | number;
}

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  hotKeywords?: HotKeywordItem[];
  hotRollerInterval?: number;
  autoFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索数码产品型号...',
  disabled: false,
  hotKeywords: () => [],
  hotRollerInterval: 3000,
  autoFocus: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'search': [value: string];
  'click': [];
  'clear': [];
  'hot-click': [item: HotKeywordItem];
}>();

const isFocus = ref(false);
const currentIndex = ref(0);
const rollerOffset = ref(0);
const isAnimating = ref(false);
let rollerTimer: ReturnType<typeof setInterval> | null = null;
let animationTimer: ReturnType<typeof setTimeout> | null = null;

// 热门轮播显示条件：未聚焦（或禁用状态）且无输入值且有热门关键词
const isShowHotRoller = computed(() => {
  const hotList = props.hotKeywords ?? [];
  return (!isFocus.value || props.disabled) && !props.modelValue && hotList.length > 0 && !props.autoFocus;
});

const displayHotList = computed(() => {
  const hotList = props.hotKeywords ?? [];
  if (hotList.length === 0) return [];
  return [...hotList, hotList[0]];
});

const ITEM_HEIGHT_RPX = 80;

const getSystemInfo = () => {
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.screenWidth || 375;
  return { screenWidth };
};

const rpxToPx = (rpx: number) => {
  const { screenWidth } = getSystemInfo();
  return (rpx * screenWidth) / 750;
};

const startRoller = () => {
  const hotList = props.hotKeywords ?? [];
  if (hotList.length <= 1) return;
  
  stopRoller();
  rollerTimer = setInterval(() => {
    if (!isAnimating.value) {
      animateToNext();
    }
  }, props.hotRollerInterval);
};

const stopRoller = () => {
  if (rollerTimer) {
    clearInterval(rollerTimer);
    rollerTimer = null;
  }
};

const animateToNext = () => {
  const hotList = props.hotKeywords ?? [];
  isAnimating.value = true;
  const nextIndex = currentIndex.value + 1;
  rollerOffset.value = nextIndex * rpxToPx(ITEM_HEIGHT_RPX);
  
  animationTimer = setTimeout(() => {
    isAnimating.value = false;
    if (nextIndex >= hotList.length) {
      currentIndex.value = 0;
      rollerOffset.value = 0;
    } else {
      currentIndex.value = nextIndex;
    }
  }, 500);
};

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};

const handleConfirm = () => {
  emit('search', props.modelValue);
};

const handleFocus = () => {
  isFocus.value = true;
  stopRoller();
};

const handleBlur = () => {
  isFocus.value = false;
  const hotList = props.hotKeywords ?? [];
  if (hotList.length > 1) {
    startRoller();
  }
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};

const handleClick = () => {
  if (props.disabled) {
    emit('click');
  }
};

const handleHotClick = (clickedIndex: number) => {
  const hotList = props.hotKeywords ?? [];
  if (hotList.length > 0) {
    const actualIndex = clickedIndex % hotList.length;
    const clickedItem = hotList[actualIndex];
    emit('hot-click', { ...clickedItem, keyword: clickedItem.keyword });
  }
};

watch(isShowHotRoller, (show) => {
  if (show) {
    startRoller();
  } else {
    stopRoller();
  }
});

onMounted(() => {
  if (isShowHotRoller.value) {
    startRoller();
  }
});

onUnmounted(() => {
  stopRoller();
  if (animationTimer) {
    clearTimeout(animationTimer);
  }
});
</script>

<style lang="scss" scoped>
.ui-search {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80rpx;
  background-color: var(--color-bg-gray, #F5F5F7);
  border-radius: 40rpx;
  padding: 0 $space-lg;
  box-sizing: border-box;
  transition: all 0.3s ease;
  font-family: $font-family-system;
  
  &.is-focus {
    background-color: var(--color-bg-card, rgba(255, 255, 255, 0.65));
    box-shadow: 0 0 0 2rpx $color-brand-primary;
  }
  
  &__icon {
    margin-right: $space-sm;
    flex-shrink: 0;
  }
  
  &__content {
    flex: 1;
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  
  &__input {
    width: 100%;
    height: 100%;
    font-size: $font-size-md;
    color: $color-text-primary;
    position: relative;
    z-index: 1;
  }
  
  &__input-placeholder {
    width: 100%;
    height: 100%;
    font-size: $font-size-md;
    color: $color-text-secondary;
    display: flex;
    align-items: center;
  }
  
  &__hot-roller {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    overflow: hidden;
    z-index: 2;
    pointer-events: none;
    
    &.is-disabled {
      pointer-events: none;
    }
  }
  
  &__clear {
    padding: $space-xs;
    flex-shrink: 0;
  }
}

.hot-roller {
  &__inner {
    transition: none;
    
    &.is-animating {
      transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
  }
  
  &__item {
    height: 80rpx;
    display: flex;
    align-items: center;
    pointer-events: auto;
  }
  
  &__text {
    font-size: $font-size-md;
    color: $color-text-secondary;
    @include text-ellipsis(1);
    
    &.is-clickable {
      cursor: pointer;
    }
  }
}
</style>
