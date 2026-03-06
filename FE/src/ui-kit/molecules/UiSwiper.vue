<template>
  <view class="ui-swiper" :style="{ height, borderRadius: radius }">
    <swiper
      class="swiper-container"
      :indicator-dots="false"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      :current="currentIndex"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(item, index) in list" :key="index">
        <view class="swiper-item" @click="onItemClick(item, index)">
          <ui-image
            :src="item.image"
            width="100%"
            height="100%"
            :radius="radius"
            mode="aspectFill"
          />
          <view v-if="item.title" class="swiper-title">
            <text class="title-text">{{ item.title }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-if="showIndicator" class="swiper-indicators" :class="[`indicator-${indicatorPosition}`]">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="indicator-dot"
        :class="{ 'is-active': currentIndex === index }"
        :style="{ backgroundColor: currentIndex === index ? indicatorActiveColor : indicatorColor }"
        @click="onIndicatorClick(index)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface SwiperItem {
  image: string;
  title?: string;
  link?: string;
  [key: string]: any;
}

const props = withDefaults(defineProps<{
  list: SwiperItem[];
  height?: string;
  radius?: string;
  autoplay?: boolean;
  interval?: number;
  duration?: number;
  circular?: boolean;
  showIndicator?: boolean;
  indicatorPosition?: 'left' | 'center' | 'right';
  indicatorColor?: string;
  indicatorActiveColor?: string;
}>(), {
  list: () => [],
  height: '320rpx',
  radius: '24rpx',
  autoplay: true,
  interval: 3000,
  duration: 500,
  circular: true,
  showIndicator: true,
  indicatorPosition: 'center',
  indicatorColor: 'rgba(255, 255, 255, 0.5)',
  indicatorActiveColor: '#ffffff'
});

const emit = defineEmits(['click', 'change']);

const currentIndex = ref(0);

watch(() => props.list, () => {
  currentIndex.value = 0;
});

const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current;
  emit('change', {
    current: currentIndex.value,
    item: props.list[currentIndex.value]
  });
};

const onIndicatorClick = (index: number) => {
  currentIndex.value = index;
};

const onItemClick = (item: SwiperItem, index: number) => {
  emit('click', { item, index });
};
</script>

<style lang="scss" scoped>
.ui-swiper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  box-shadow: $glass-shadow-md;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.swiper-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md $space-lg;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur($blur-xs);
  -webkit-backdrop-filter: blur($blur-xs);

  .title-text {
    color: $color-white;
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    line-height: 1.4;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
}

.swiper-indicators {
  position: absolute;
  bottom: $space-md;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 16rpx;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur($blur-xs);
  -webkit-backdrop-filter: blur($blur-xs);
  border-radius: $radius-full;
  z-index: 10;

  &.indicator-left {
    left: $space-md;
  }

  &.indicator-center {
    left: 50%;
    transform: translateX(-50%);
  }

  &.indicator-right {
    right: $space-md;
  }
}

.indicator-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: $radius-full;
  transition: all $duration-fast $ease-spring;
  cursor: pointer;

  &.is-active {
    width: 32rpx;
    background: var(--color-text-white, #FFFFFF) !important;
    box-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.4);
  }
}
</style>
