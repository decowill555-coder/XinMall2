<!-- src/ui-kit/atoms/UiImage.vue -->
<template>
  <view 
    class="ui-image" 
    :style="{ 
      width, 
      height, 
      borderRadius: radius 
    }"
    @click="emit('click')"
  >
    <!-- 1. 加载中状态 (骨架屏) -->
    <view v-if="loading" class="placeholder loading">
      <!-- 引用骨架屏逻辑，这里简化为 CSS 动画 -->
      <view class="skeleton-shimmer" />
    </view>

    <!-- 2. 加载失败状态 -->
    <view v-if="error" class="placeholder error">
      <ui-icon name="image-off" :size="48" color="#A1A1A6" />
    </view>

    <!-- 3. 真实图片 -->
    <image
      class="real-image"
      :class="{ 'fade-in': loaded }"
      :src="src"
      :mode="mode"
      :lazy-load="true"
      @load="onLoad"
      @error="onError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  src: string;
  width?: string;
  height?: string;
  radius?: string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
}>(), {
  width: '100%',
  height: '100%',
  radius: '16rpx', // 默认对应 $radius-md
  mode: 'aspectFill'
});

const emit = defineEmits(['click']);

const loading = ref(true);
const loaded = ref(false);
const error = ref(false);

// 监听 src 变化重置状态（用于复用组件场景）
watch(() => props.src, () => {
  loading.value = true;
  loaded.value = false;
  error.value = false;
});

const onLoad = () => {
  loading.value = false;
  loaded.value = true;
};

const onError = () => {
  loading.value = false;
  error.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-image {
  position: relative;
  overflow: hidden;
  background-color: $color-bg-gray;
  // 消除图片底边距
  display: flex; 

  .placeholder {
    @include absolute-center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &.loading {
      // 使用 mixin 中的骨架屏动画
      @include skeleton-loading;
    }

    &.error {
      background-color: #F7F8FA;
    }
  }

  .real-image {
    width: 100%;
    height: 100%;
    opacity: 0;
    // 关键：平滑过渡
    transition: opacity $duration-normal $ease-out;
    position: relative;
    z-index: 2;

    &.fade-in {
      opacity: 1;
    }
  }
}

// 骨架屏流光动画补充 (如果在 mixin 中定义了可以直接复用，这里防守性写一下)
.skeleton-shimmer {
  width: 100%;
  height: 100%;
}
</style>