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
          <UiIcon v-if="back" name="arrow-left" :size="48" :color="color" />
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
      
      <!-- 右侧：操作区 -->
      <view class="ui-navbar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  
  <!-- 占位符 -->
  <view v-if="fixed && placeholder" :style="{ height: totalNavHeight + 'px' }"></view>
</template>

<script setup lang="ts">
import { useScreen } from '@/composables/useScreen';
import { useNavigation } from '@/composables/useNavigation';

const { statusBarHeight, navBarHeight, totalNavHeight } = useScreen();
const { smartBack, canNavigateBack } = useNavigation();

interface Props {
  title?: string;
  color?: string;
  background?: string;
  fixed?: boolean;
  placeholder?: boolean;
  glass?: boolean;
  back?: boolean;
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
    smartBack();
  }
};
</script>

<style lang="scss" scoped>
.ui-navbar {
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
