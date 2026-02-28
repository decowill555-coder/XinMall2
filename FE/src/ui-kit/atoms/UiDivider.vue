<!-- src/ui-kit/atoms/UiDivider.vue -->
<template>
  <view 
    class="ui-divider" 
    :class="{ 'is-vertical': vertical }"
    :style="wrapperStyle"
  >
    <!-- 左线条 -->
    <view v-if="!vertical" class="line" :style="lineStyle" />
    
    <!-- 中间文字 -->
    <text v-if="text && !vertical" class="text" :style="{ color: textColor }">
      {{ text }}
    </text>
    
    <!-- 右线条 -->
    <view v-if="!vertical && text" class="line" :style="lineStyle" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  text?: string;
  vertical?: boolean;
  dashed?: boolean;
  lineColor?: string;
  textColor?: string;
  margin?: string; // e.g. "32rpx 0"
}>(), {
  dashed: false,
  margin: '32rpx 0'
});

const wrapperStyle = computed(() => ({
  margin: props.vertical ? '0 16rpx' : props.margin
}));

const lineStyle = computed(() => {
  // 引用 tokens 中的分割线颜色
  const color = props.lineColor || 'rgba(0, 0, 0, 0.06)'; 
  return {
    borderTop: props.dashed ? `1px dashed ${color}` : `1px solid ${color}`,
  };
});
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';

.ui-divider {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  .line {
    flex: 1;
    height: 0;
    transform: scaleY(0.5); // 实现 0.5px 细线
  }

  .text {
    padding: 0 $space-md;
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }

  // 垂直分割线
  &.is-vertical {
    display: inline-block;
    width: 1px;
    height: 1em;
    background-color: $color-divider;
    vertical-align: middle;
    transform: scaleX(0.5);
  }
}
</style>