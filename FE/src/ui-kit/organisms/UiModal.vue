<template>
  <view class="ui-modal-wrapper" v-if="show" @touchmove.stop.prevent>
    <!-- 遮罩层 -->
    <view 
      class="ui-modal-mask" 
      :class="{ 'is-show': animateShow }" 
      @tap="handleMaskClick"
    ></view>
    
    <!-- 弹窗主体 -->
    <view 
      class="ui-modal" 
      :class="{ 'is-show': animateShow }"
    >
      <!-- 标题 -->
      <view class="ui-modal__header" v-if="title">
        <text class="ui-modal__title">{{ title }}</text>
      </view>
      
      <!-- 内容插槽 -->
      <view class="ui-modal__content">
        <slot>{{ content }}</slot>
      </view>
      
      <!-- 底部按钮 -->
      <view class="ui-modal__footer">
        <!-- 取消按钮 -->
        <view 
          v-if="showCancel" 
          class="ui-modal__btn ui-modal__btn--cancel" 
          @tap="handleCancel"
        >
          {{ cancelText }}
        </view>
        
        <!-- 确认按钮 -->
        <view 
          class="ui-modal__btn ui-modal__btn--confirm" 
          :style="{ color: confirmColor }"
          @tap="handleConfirm"
        >
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  content?: string;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
  maskClosable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '提示',
  content: '',
  showCancel: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmColor: '#1ABC9C',
  maskClosable: true
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const show = ref(false);
const animateShow = ref(false);

// 监听 v-model 变化，控制动画
watch(() => props.modelValue, (val) => {
  if (val) {
    show.value = true;
    setTimeout(() => { animateShow.value = true; }, 50);
  } else {
    animateShow.value = false;
    setTimeout(() => { show.value = false; }, 300);
  }
});

const close = () => {
  emit('update:modelValue', false);
};

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleCancel();
  }
};

const handleCancel = () => {
  emit('cancel');
  close();
};

const handleConfirm = () => {
  emit('confirm');
  close();
};
</script>

<style lang="scss" scoped>
.ui-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ui-modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &.is-show { opacity: 1; }
}

.ui-modal {
  width: 600rpx;
  background: $color-white;
  border-radius: $radius-lg;
  position: relative;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  
  @include glass-effect(20rpx, 0.95);
  
  &.is-show {
    opacity: 1;
    transform: scale(1);
  }
  
  &__header {
    padding: 40rpx 40rpx 20rpx;
    text-align: center;
  }
  
  &__title {
    font-size: 34rpx;
    font-weight: bold;
    color: $color-text-main;
  }
  
  &__content {
    padding: 0 40rpx 40rpx;
    font-size: 30rpx;
    color: $color-text-sub;
    text-align: center;
    line-height: 1.6;
  }
  
  &__footer {
    display: flex;
    border-top: 1rpx solid $color-divider;
    height: 100rpx;
  }
  
  &__btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    
    &:active {
      background-color: rgba(0,0,0,0.05);
    }
    
    &--cancel {
      color: $color-text-main;
      border-right: 1rpx solid $color-divider;
    }
    
    &--confirm {
      font-weight: bold;
    }
  }
}
</style>
