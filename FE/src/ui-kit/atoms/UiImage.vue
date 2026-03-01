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
      <ui-icon name="image-off" :size="48" :color="$color-text-placeholder" />
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
  background-color: $color-bg-gray;
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
    transition: opacity $duration-normal $ease-out;
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
