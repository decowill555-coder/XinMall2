<!-- src/ui-kit/atoms/UiAvatar.vue -->
<template>
  <view 
    class="ui-avatar" 
    :class="[
      `shape-${shape}`, 
      { 'is-bordered': bordered }
    ]"
    :style="{ 
      width: size + 'rpx', 
      height: size + 'rpx',
      backgroundColor: bg 
    }"
    @click="emit('click')"
  >
    <!-- 1. 图片头像 -->
    <image 
      v-if="src && !loadError" 
      class="avatar-img" 
      :src="src" 
      mode="aspectFill" 
      @error="handleError"
    />
    
    <!-- 2. 文字兜底 -->
    <text 
      v-else-if="text" 
      class="avatar-text" 
      :style="{ fontSize: textSize + 'rpx' }"
    >
      {{ text.charAt(0).toUpperCase() }}
    </text>

    <!-- 3. 图标兜底 -->
    <ui-icon 
      v-else 
      name="user" 
      :color="'#FFFFFF'" 
      :size="textSize" 
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  src?: string;
  text?: string;
  size?: number;
  shape?: 'circle' | 'square';
  bordered?: boolean;
  bg?: string;
}>(), {
  size: 80,
  shape: 'circle',
  bordered: true,
  bg: '#B0B5C1'
});

const emit = defineEmits(['click']);
const loadError = ref(false);

// 监听 src 变化重置错误状态
watch(() => props.src, () => {
  loadError.value = false;
});

const textSize = computed(() => props.size * 0.45);

const handleError = () => {
  loadError.value = true;
};
</script>

<style lang="scss" scoped>

.ui-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  color: $color-text-white;
  font-weight: $font-weight-medium;
  transition: all $duration-fast $ease-spring;
  
  // 形状
  &.shape-circle { border-radius: 50%; }
  &.shape-square { border-radius: $radius-md; }

  // Glassmorphism 描边特征：外圈高亮半透明白，内圈微阴影，增强立体感
  &.is-bordered {
    border: 2rpx solid $glass-border-light; 
    box-shadow: 
      0 4rpx 16rpx rgba(0, 0, 0, 0.08),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.4);
  }
  
  // 悬停效果
  &:active {
    transform: scale(0.95);
    box-shadow: 
      0 2rpx 8rpx rgba(0, 0, 0, 0.05),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.2);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity $duration-fast $ease-out;
  }
  
  .avatar-text {
    font-weight: $font-weight-bold;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
  }
}
</style>
