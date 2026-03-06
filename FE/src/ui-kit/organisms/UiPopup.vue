<!-- src/ui-kit/organisms/UiPopup.vue -->
<template>
  <view 
    class="ui-popup" 
    :class="[
      `pos-${position}`, 
      { 'is-show': show, 'is-round': round }
    ]"
    :style="{ zIndex: zIndex }"
    @touchmove.stop.prevent
  >
    <!-- 1. 模糊遮罩 -->
    <view class="popup-mask" @click="onMaskClick" />

    <!-- 2. 内容容器 -->
    <view 
      class="popup-content"
      :class="{ 'safe-bottom': safeAreaInsetBottom && position === 'bottom' }"
      :style="customStyle"
      @click.stop
    >
      <slot />
      
      <!-- 可选：右上角关闭按钮 -->
      <view v-if="closeable" class="close-icon" @click="close">
        <ui-icon name="close" :size="40" :color="'#A1A1A6'" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  show: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  zIndex?: number;
  maskClosable?: boolean;
  round?: boolean;
  closeable?: boolean;
  safeAreaInsetBottom?: boolean;
  bgColor?: string;
  glass?: boolean;
}>(), {
  position: 'center',
  zIndex: 500,
  maskClosable: true,
  round: false,
  closeable: false,
  safeAreaInsetBottom: true,
  glass: false
});

const emit = defineEmits(['update:show', 'close', 'open']);

const customStyle = computed(() => {
  const style: any = {};
  if (props.bgColor) style.backgroundColor = props.bgColor;
  
  if (props.glass) {
    style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    style.backdropFilter = 'blur(16px)';
    style.webkitBackdropFilter = 'blur(16px)';
  }
  return style;
});

const onMaskClick = () => {
  if (props.maskClosable) {
    close();
  }
};

const close = () => {
  emit('update:show', false);
  emit('close');
};
</script>

<style lang="scss" scoped>
.ui-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  transition: visibility $duration-normal $ease-spring;

  &.is-show {
    visibility: visible;
    .popup-mask { opacity: 1; }
    
    &.pos-center .popup-content { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    &.pos-bottom .popup-content { transform: translateY(0); }
    &.pos-top .popup-content { transform: translateY(0); }
    &.pos-left .popup-content { transform: translateX(0); }
    &.pos-right .popup-content { transform: translateX(0); }
  }

  .popup-mask {
    @include cover-screen;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    backdrop-filter: blur($blur-md);
    -webkit-backdrop-filter: blur($blur-md);
    opacity: 0;
    transition: opacity $duration-normal $ease-spring;
  }

  .popup-content {
    position: absolute;
    background: var(--glass-solid, rgba(255, 255, 255, 0.95));
    backdrop-filter: blur($blur-xxl);
    -webkit-backdrop-filter: blur($blur-xxl);
    border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
    transition: transform $duration-normal cubic-bezier(0.36, 0.66, 0.04, 1);
    box-shadow: 
      0 16rpx 48rpx rgba(0, 0, 0, 0.08),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.7);
    
    &.safe-bottom {
      @include safe-area-bottom;
    }

    .close-icon {
      position: absolute;
      top: $space-md;
      right: $space-md;
      z-index: 1;
      padding: $space-sm;
      border-radius: 50%;
      background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
      transition: all $duration-fast $ease-spring;
      
      &:active {
        background: var(--color-border, rgba(0, 0, 0, 0.06));
        transform: scale(0.9);
      }
    }
  }

  &.pos-center {
    .popup-content {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 0;
      width: 600rpx;
      border-radius: $radius-lg;
    }
  }

  &.pos-bottom {
    .popup-content {
      bottom: 0;
      left: 0;
      width: 100%;
      transform: translateY(100%);
    }
    &.is-round .popup-content {
      border-top-left-radius: $radius-xl;
      border-top-right-radius: $radius-xl;
    }
  }

  &.pos-top {
    .popup-content {
      top: 0;
      left: 0;
      width: 100%;
      transform: translateY(-100%);
    }
  }

  &.pos-left {
    .popup-content {
      top: 0;
      left: 0;
      height: 100%;
      transform: translateX(-100%);
    }
  }
  
  &.pos-right {
    .popup-content {
      top: 0;
      right: 0;
      height: 100%;
      transform: translateX(100%);
    }
  }
}
</style>
