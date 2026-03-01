<!-- src/ui-kit/organisms/UiToast.vue -->
<template>
  <view 
    class="ui-toast" 
    :class="{ 'is-show': visible }"
    :style="{ zIndex: zIndex }"
  >
    <view class="toast-content" :class="[`type-${type}`]">
      <!-- 图标区域 -->
      <view v-if="type !== 'text'" class="toast-icon">
        <ui-icon 
          v-if="type === 'loading'" 
          name="loading" 
          spin 
          size="64" 
          color="#FFFFFF" 
        />
        <ui-icon 
          v-else 
          :name="iconName" 
          size="64" 
          color="#FFFFFF" 
        />
      </view>

      <!-- 文字区域 -->
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type ToastType = 'text' | 'success' | 'error' | 'warning' | 'loading';

interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
  mask?: boolean;
}

const visible = ref(false);
const message = ref('');
const type = ref<ToastType>('text');
const zIndex = ref(9999);
let timer: any = null;

const iconName = computed(() => {
  switch (type.value) {
    case 'success': return 'check-circle';
    case 'error': return 'close-circle';
    case 'warning': return 'info-circle';
    default: return '';
  }
});

// 暴露给父组件的方法
const show = (options: ToastOptions | string) => {
  const opts = typeof options === 'string' ? { message: options } : options;
  
  message.value = opts.message || '';
  type.value = opts.type || 'text';
  
  if (timer) clearTimeout(timer);
  
  visible.value = true;

  if (type.value !== 'loading') {
    const duration = opts.duration || 2000;
    timer = setTimeout(() => {
      visible.value = false;
    }, duration);
  }
};

const hide = () => {
  visible.value = false;
  if (timer) clearTimeout(timer);
};

defineExpose({ show, hide });
</script>

<style lang="scss" scoped>
.ui-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  
  &.is-show { opacity: 1; }

  .toast-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200rpx;
    max-width: 400rpx;
    padding: $space-lg;
    border-radius: $radius-lg;
    background-color: rgba(30, 30, 30, 0.75); 
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: $shadow-md;

    .toast-icon {
      margin-bottom: $space-sm;
    }

    .toast-text {
      font-size: $font-size-md;
      color: $color-white;
      text-align: center;
      line-height: 1.4;
      font-weight: $font-weight-medium;
    }

    &.type-text {
      padding: $space-md $space-lg;
      min-width: 0;
      .toast-text { margin: 0; }
    }
  }
}
</style>
