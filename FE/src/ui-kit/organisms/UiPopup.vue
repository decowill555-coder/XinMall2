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
        <ui-icon name="close" size="24" :color="$color-text-placeholder" />
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
  transition: visibility $duration-normal;

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
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity $duration-normal;
  }

  .popup-content {
    position: absolute;
    background-color: $color-bg-white;
    transition: transform $duration-normal cubic-bezier(0.36, 0.66, 0.04, 1);
    box-shadow: $shadow-md;
    
    &.safe-bottom {
      @include safe-area-bottom;
    }

    .close-icon {
      position: absolute;
      top: $space-md;
      right: $space-md;
      z-index: 1;
      padding: $space-sm;
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
