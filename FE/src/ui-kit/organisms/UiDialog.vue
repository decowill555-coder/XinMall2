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
      
      <!-- 内容 -->
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
  buttonLayout?: 'horizontal' | 'vertical';
  loading?: boolean;
  beforeClose?: (action: 'confirm' | 'cancel') => Promise<boolean> | boolean;
}>(), {
  show: false,
  messageAlign: 'center',
  showCancel: false,
  cancelText: '取消',
  cancelColor: '#6E6E73',
  confirmText: '确认',
  confirmColor: '#1ABC9C',
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
  transition: all $duration-normal $ease-spring;

  &.is-show {
    visibility: visible;
    opacity: 1;
    
    .dialog-content {
      transform: scale(1);
      opacity: 1;
      @include glass-scale-in($duration-normal);
    }
  }

  .dialog-mask {
    @include cover-screen;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    backdrop-filter: blur($blur-md);
    -webkit-backdrop-filter: blur($blur-md);
  }

  .dialog-content {
    position: relative;
    width: 600rpx;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.85) 100%
    );
    backdrop-filter: blur($blur-xxl);
    -webkit-backdrop-filter: blur($blur-xxl);
    border: 1rpx solid $glass-border-light;
    border-radius: $radius-xl;
    overflow: hidden;
    transform: scale(0.9);
    opacity: 0;
    transition: all $duration-normal $ease-fluid;
    box-shadow: 
      0 24rpx 64rpx rgba(0, 0, 0, 0.1),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.8);
  }

  .dialog-header {
    padding: $space-xl $space-xl 0;
    text-align: center;
    
    .title-text {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
      background: linear-gradient(135deg, $color-text-main 0%, $color-text-sub 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .dialog-body {
    padding: $space-xl;
    
    .message-text {
      font-size: $font-size-md;
      color: $color-text-sub;
      line-height: $line-height-normal;
    }
  }

  .dialog-footer {
    display: flex;
    border-top: 1rpx solid $glass-border-subtle;

    &.vertical {
      flex-direction: column;
      
      .btn { width: 100%; border-right: none; border-bottom: 1rpx solid $glass-border-subtle; }
      .btn:last-child { border-bottom: none; }
    }

    .btn {
      flex: 1;
      height: 96rpx;
      @include flex-center;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      transition: all $duration-fast $ease-spring;
      background: transparent;
      
      &:active { 
        background: rgba(0,0,0,0.03);
        backdrop-filter: blur($blur-sm);
        -webkit-backdrop-filter: blur($blur-sm);
      }
    }

    .btn-divider {
      width: 1rpx;
      height: 100%;
      background: linear-gradient(
        180deg,
        $glass-border-subtle 0%,
        transparent 100%
      );
    }
  }
}
</style>
