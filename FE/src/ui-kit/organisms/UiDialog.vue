<!-- src/ui-kit/organisms/UiDialog.vue -->
<template>
  <view 
    class="ui-dialog-wrapper" 
    :class="{ 'is-show': show }"
    @touchmove.stop.prevent
  >
    <view class="dialog-mask" />
    
    <view class="dialog-content">
      <!-- 标题 -->
      <view v-if="title" class="dialog-header">
        <text class="title-text">{{ title }}</text>
      </view>
      
      <!-- 内容 (支持 Slot) -->
      <view class="dialog-body" :style="{ textAlign: messageAlign }">
        <slot>
          <text class="message-text">{{ message }}</text>
        </slot>
      </view>
      
      <!-- 底部按钮 -->
      <view class="dialog-footer" :class="{ 'vertical': showCancel && buttonLayout === 'vertical' }">
        <view 
          v-if="showCancel" 
          class="btn btn-cancel" 
          :style="{ color: cancelColor }"
          @click="onCancel"
        >
          {{ cancelText }}
        </view>
        <!-- 垂直分割线 -->
        <view v-if="showCancel && buttonLayout === 'horizontal'" class="btn-divider" />
        
        <view 
          class="btn btn-confirm" 
          :style="{ color: confirmColor }"
          @click="onConfirm"
        >
          <!-- 确认按钮可能需要 loading 状态 -->
          <ui-icon v-if="loading" name="loading" spin />
          <text v-else>{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  messageAlign?: 'left' | 'center' | 'right';
  showCancel?: boolean;
  cancelText?: string;
  cancelColor?: string;
  confirmText?: string;
  confirmColor?: string;
  buttonLayout?: 'horizontal' | 'vertical'; // 按钮布局
  loading?: boolean; // 异步关闭时使用
  beforeClose?: (action: 'confirm' | 'cancel') => Promise<boolean> | boolean;
}>(), {
  show: false,
  messageAlign: 'center',
  showCancel: false,
  cancelText: '取消',
  cancelColor: '#6E6E73',
  confirmText: '确认',
  confirmColor: '#2979FF', // $color-primary
  buttonLayout: 'horizontal',
  loading: false
});

const emit = defineEmits(['update:show', 'confirm', 'cancel']);

const handleClose = () => {
  emit('update:show', false);
};

const onCancel = () => {
  if (props.loading) return;
  emit('cancel');
  handleClose();
};

const onConfirm = async () => {
  if (props.loading) return;
  
  // 如果有拦截钩子
  if (props.beforeClose) {
    const result = await props.beforeClose('confirm');
    if (result !== false) {
      emit('confirm');
      handleClose();
    }
  } else {
    emit('confirm');
    handleClose();
  }
};
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $z-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: all $duration-normal;

  &.is-show {
    visibility: visible;
    opacity: 1;
    
    .dialog-content {
      transform: scale(1);
      opacity: 1;
    }
  }

  .dialog-mask {
    @include cover-screen;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .dialog-content {
    position: relative;
    width: 600rpx; // 300px
    background-color: rgba(255, 255, 255, 0.9); // 不完全透明，保证可读性
    backdrop-filter: blur($blur-lg);
    border-radius: $radius-xl;
    overflow: hidden;
    transform: scale(0.9); // 初始缩放
    opacity: 0;
    transition: all $duration-spring; // 弹性动画
    box-shadow: $shadow-md;
  }

  .dialog-header {
    padding: $space-lg $space-lg 0;
    text-align: center;
    
    .title-text {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
  }

  .dialog-body {
    padding: $space-lg;
    
    .message-text {
      font-size: $font-size-md;
      color: $color-text-sub;
      line-height: $line-height-normal;
    }
  }

  .dialog-footer {
    display: flex;
    border-top: 1px solid $color-divider;

    &.vertical {
      flex-direction: column;
      
      .btn { width: 100%; border-right: none; border-bottom: 1px solid $color-divider; }
      .btn:last-child { border-bottom: none; }
    }

    .btn {
      flex: 1;
      height: 96rpx;
      @include flex-center;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold; // iOS 风格按钮加粗
      transition: background-color 0.2s;
      
      &:active { background-color: rgba(0,0,0,0.05); }
    }

    .btn-divider {
      width: 1px;
      height: 100%;
      background-color: $color-divider;
      transform: scaleX(0.5);
    }
  }
}
</style>