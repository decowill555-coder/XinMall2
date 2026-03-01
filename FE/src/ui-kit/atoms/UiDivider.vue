<!-- src/ui-kit/atoms/UiDivider.vue -->
<template>
  <view 
    class="ui-divider" 
    :class="{ 'is-vertical': vertical }"
    :style="wrapperStyle"
  >
    <!-- 左线 -->
    <view v-if="!vertical" class="line" :style="lineStyle" />
    
    <!-- 中间文字 -->
    <text v-if="text && !vertical" class="text" :style="{ color: textColor }">
      {{ text }}
    </text>
    
    <!-- 右线 -->
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
  margin?: string;
}>(), {
  dashed: false,
  margin: '32rpx 0'
});

const wrapperStyle = computed(() => ({
  margin: props.vertical ? '0 16rpx' : props.margin
}));

const lineStyle = computed(() => {
  const color = props.lineColor || 'rgba(0, 0, 0, 0.06)'; 
  return {
    borderTop: props.dashed ? `1px dashed ${color}` : `1px solid ${color}`,
  };
});
</script>

<style lang="scss" scoped>
.ui-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  .line {
    flex: 1;
    height: 1px;
  }

  .text {
    padding: 0 $space-md;
    font-size: $font-size-sm;
    color: $color-text-sub;
  }

  &.is-vertical {
    flex-direction: column;
    height: 100%;
    
    .line {
      width: 1px;
      flex: 1;
    }
  }
}
</style>
