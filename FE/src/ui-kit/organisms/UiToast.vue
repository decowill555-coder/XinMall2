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
          color="#fff" 
        />
        <ui-icon 
          v-else 
          :name="iconName" 
          size="64" 
          color="#fff" 
        />
      </view>

      <!-- 文字区域 -->
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义类型
type ToastType = 'text' | 'success' | 'error' | 'warning' | 'loading';

interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
  mask?: boolean; // 是否禁止背景点击
}

const visible = ref(false);
const message = ref('');
const type = ref<ToastType>('text');
const zIndex = ref(9999);
let timer: any = null;

// 图标映射
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
  
  // 清除上一个计时器
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
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none; // 默认不阻挡点击，除非开启mask逻辑(简化版暂略)
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
    
    // 深色毛玻璃风格 (类似 iOS 系统级 Toast)
    background-color: rgba(30, 30, 30, 0.75); 
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: $shadow-lg;

    .toast-icon {
      margin-bottom: $space-sm;
    }

    .toast-text {
      font-size: $font-size-md;
      color: #fff;
      text-align: center;
      line-height: 1.4;
      font-weight: $font-weight-medium;
    }

    // 纯文本模式更紧凑
    &.type-text {
      padding: $space-md $space-lg;
      min-width: 0;
      .toast-text { margin: 0; }
    }
  }
}
</style>