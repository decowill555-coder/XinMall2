<template>
  <view class="ui-alphabet-nav">
    <view 
      class="nav-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <view 
        v-for="letter in letters" 
        :key="letter" 
        class="nav-item"
        :class="{ 'is-active': currentLetter === letter }"
      >
        <text>{{ letter }}</text>
      </view>
    </view>
    
    <view v-if="showIndicator" class="letter-indicator">
      <text>{{ indicatorLetter }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Props {
  letters: string[];
  currentLetter: string;
}

const props = withDefaults(defineProps<Props>(), {
  letters: () => [],
  currentLetter: 'A'
});

const emit = defineEmits<{
  'update:currentLetter': [letter: string];
  'scrollTo': [letter: string];
}>();

const showIndicator = ref(false);
const indicatorLetter = ref('');
const containerRect = ref<{ top: number; height: number } | null>(null);
let indicatorTimer: ReturnType<typeof setTimeout> | null = null;

const updateContainerRect = () => {
  const query = uni.createSelectorQuery();
  query.select('.nav-container').boundingClientRect((rect: any) => {
    if (rect) {
      containerRect.value = {
        top: rect.top,
        height: rect.height
      };
    }
  }).exec();
};

onMounted(() => {
  nextTick(() => {
    updateContainerRect();
  });
});

const showIndicatorWithLetter = (letter: string) => {
  indicatorLetter.value = letter;
  showIndicator.value = true;
  
  if (indicatorTimer) {
    clearTimeout(indicatorTimer);
  }
  indicatorTimer = setTimeout(() => {
    showIndicator.value = false;
  }, 600);
};

const getLetterFromY = (clientY: number): string | null => {
  if (!containerRect.value || props.letters.length === 0) return null;
  
  const relativeY = clientY - containerRect.value.top;
  const itemHeight = containerRect.value.height / props.letters.length;
  const index = Math.floor(relativeY / itemHeight);
  
  if (index >= 0 && index < props.letters.length) {
    return props.letters[index];
  }
  return null;
};

const selectLetter = (letter: string) => {
  if (props.currentLetter !== letter) {
    emit('update:currentLetter', letter);
    emit('scrollTo', letter);
    showIndicatorWithLetter(letter);
  }
};

const handleTouchStart = (e: TouchEvent) => {
  updateContainerRect();
  
  const touch = e.touches[0];
  const letter = getLetterFromY(touch.clientY);
  if (letter) {
    selectLetter(letter);
  }
};

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  
  const touch = e.touches[0];
  const letter = getLetterFromY(touch.clientY);
  if (letter) {
    selectLetter(letter);
  }
};

const handleTouchEnd = () => {
  // 触摸结束，保持指示器显示一段时间后隐藏
};
</script>

<style lang="scss" scoped>
.ui-alphabet-nav {
  position: fixed;
  right: 4rpx;
  z-index: $z-sticky;
  padding: $space-xs;
}

.nav-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rpx 0;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-full;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
}

.nav-item {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-full;
  transition: all $duration-fast $ease-out;
  
  text {
    font-size: $font-size-xs;
    color: $color-text-sub;
    font-weight: $font-weight-medium;
  }
  
  &.is-active {
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    box-shadow: 0 2rpx 8rpx rgba(255, 106, 0, 0.3);
    
    text {
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
      color: #FFFFFF;
    }
  }
}

.letter-indicator {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 160rpx;
  background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
  border-radius: $radius-xl;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  box-shadow: 0 8rpx 32rpx rgba(255, 106, 0, 0.4);
  animation: indicator-pop 0.15s $ease-out;
  
  text {
    font-size: 72rpx;
    font-weight: $font-weight-bold;
    color: #FFFFFF;
  }
}

@keyframes indicator-pop {
  0% {
    transform: translate(-50%, -50%) scale(0.7);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

[data-theme="dark"] {
  .nav-container {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
    border-bottom: 1px solid transparent;
    border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
  
  .nav-item {
    text {
      color: var(--color-text-sub, #A1A1AA);
    }
    
    &.is-active {
      background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
      box-shadow: 0 2rpx 8rpx rgba(217, 70, 239, 0.4);
      
      text {
        color: #FFFFFF;
      }
    }
  }
  
  .letter-indicator {
    background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
    box-shadow: 0 8rpx 32rpx rgba(217, 70, 239, 0.4);
  }
}
</style>
