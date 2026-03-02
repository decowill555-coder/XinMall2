<template>
  <view 
    class="sub-navbar" 
    :style="{ height: totalNavHeight + 'px', background: background }"
    :class="{ 'sub-navbar--fixed': fixed, 'sub-navbar--glass': glass }"
  >
    <view :style="{ height: statusBarHeight + 'px' }"></view>
    
    <view 
      class="sub-navbar__content" 
      :style="{ height: navBarHeight + 'px' }"
    >
      <view class="sub-navbar__left" @tap="handleBack">
        <slot name="left">
          <UiIcon name="arrow-left" :size="48" :color="color" />
        </slot>
      </view>
      
      <view class="sub-navbar__center">
        <slot name="center">
          <text 
            class="sub-navbar__title" 
            :style="{ color: color }"
          >{{ title }}</text>
        </slot>
      </view>
      
      <view class="sub-navbar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  
  <view v-if="fixed && placeholder" :style="{ height: totalNavHeight + 'px' }"></view>
</template>

<script setup lang="ts">
import { useScreen } from '@/composables/useScreen';

const { statusBarHeight, navBarHeight, totalNavHeight } = useScreen();

interface Props {
  title?: string;
  color?: string;
  background?: string;
  fixed?: boolean;
  placeholder?: boolean;
  glass?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  color: '#000',
  background: 'transparent',
  fixed: true,
  placeholder: true,
  glass: false
});

const handleBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({ url: '/pages/index/index' });
  }
};
</script>

<style lang="scss" scoped>
.sub-navbar {
  width: 100%;
  z-index: 999;
  box-sizing: content-box;
  transition: all $duration-fast $ease-spring;
  
  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
  }
  
  &--glass {
    @include glass-effect($blur-xl, 0.85);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    border-bottom: 1rpx solid rgba(0,0,0,0.05);
    box-shadow: 
      0 4rpx 24rpx rgba(0, 0, 0, 0.03),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.6);
  }
  
  &__content {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 32rpx;
  }
  
  &__left {
    width: 120rpx;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  &__center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  &__title {
    font-size: 34rpx;
    font-weight: bold;
    @include text-ellipsis;
    max-width: 300rpx;
    background: linear-gradient(135deg, $color-text-main 0%, $color-text-sub 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  &__right {
    width: 120rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
