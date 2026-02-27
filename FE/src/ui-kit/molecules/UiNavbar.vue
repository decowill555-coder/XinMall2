<template>
  <view 
    class="ui-navbar" 
    :style="{ height: totalNavHeight + 'px', background: background }"
    :class="{ 'ui-navbar--fixed': fixed, 'ui-navbar--glass': glass }"
  >
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航内容区 -->
    <view 
      class="ui-navbar__content" 
      :style="{ height: navBarHeight + 'px' }"
    >
      <!-- 左侧：返回按钮 -->
      <view class="ui-navbar__left" @tap="handleBack">
        <slot name="left">
          <UiIcon v-if="back" name="arrow-left" size="44" :color="color" />
        </slot>
      </view>
      
      <!-- 中间：标题 -->
      <view class="ui-navbar__center">
        <slot name="center">
          <text 
            class="ui-navbar__title" 
            :style="{ color: color }"
          >{{ title }}</text>
        </slot>
      </view>
      
      <!-- 右侧：操作区 (胶囊对齐) -->
      <view class="ui-navbar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  
  <!-- 占位块 (防止内容被遮挡) -->
  <view v-if="fixed && placeholder" :style="{ height: totalNavHeight + 'px' }"></view>
</template>

<script setup lang="ts">
import { useScreen } from '@/composables/useScreen';

const { statusBarHeight, navBarHeight, totalNavHeight } = useScreen();

interface Props {
  title?: string;
  color?: string;       // 标题和图标颜色
  background?: string;  // 背景色 (支持 rgba)
  fixed?: boolean;      // 是否悬浮固定
  placeholder?: boolean;// 是否占位
  glass?: boolean;      // 是否开启毛玻璃
  back?: boolean;       // 是否显示返回箭头
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  color: '#000',
  background: 'transparent',
  fixed: true,
  placeholder: true,
  glass: false,
  back: true
});

const handleBack = () => {
  if (props.back) {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      uni.switchTab({ url: '/pages/index/index' });
    }
  }
};
</script>

<style lang="scss" scoped>
.ui-navbar {
  width: 100%;
  z-index: 999;
  box-sizing: content-box; // 包含状态栏高度
  
  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
  }
  
  &--glass {
    @include glass-effect(20rpx, 0.85); // 强毛玻璃
    border-bottom: 1rpx solid rgba(0,0,0,0.05);
  }
  
  &__content {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 32rpx; // 左右边距
  }
  
  &__left {
    width: 120rpx; // 预留左侧区域
    display: flex;
    align-items: center;
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
  }
  
  &__right {
    width: 120rpx; // 预留右侧区域
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>