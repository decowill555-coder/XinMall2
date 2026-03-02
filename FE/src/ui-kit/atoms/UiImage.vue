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
      <view class="skeleton-shimmer" />
    </view>

    <!-- 2. 加载失败状态 -->
    <view v-if="error" class="placeholder error">
      <ui-icon name="image-off" :size="48" :color="'#A1A1A6'" />
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
  radius: '16rpx',
  mode: 'aspectFill'
});

const emit = defineEmits(['click']);

const loading = ref(true);
const loaded = ref(false);
const error = ref(false);

// 监听 src 变化重置状态
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
.ui-image {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  display: flex;
  border: 1rpx solid $glass-border-subtle;
  box-shadow: $glass-shadow-sm;

  .placeholder {
    @include absolute-center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    &.loading {
      @include skeleton-loading;
      background: linear-gradient(
        90deg,
        rgba(245, 245, 247, 0.8) 25%,
        rgba(250, 250, 250, 0.6) 50%,
        rgba(245, 245, 247, 0.8) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-animation 1.5s ease-in-out infinite;
    }

    &.error {
      background: rgba(247, 248, 250, 0.8);
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
    }
  }

  .real-image {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity $duration-normal $ease-spring;
    position: relative;
    z-index: 2;

    &.fade-in {
      opacity: 1;
    }
  }
}

.skeleton-shimmer {
  width: 100%;
  height: 100%;
}
</style>
