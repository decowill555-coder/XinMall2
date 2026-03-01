<template>
  <view 
    class="ui-cell"
    :class="[
      { 'is-glass': glass },
      { 'no-border': !border }
    ]"
    @click="handleClick"
  >
    <!-- 左侧：图标 + 标题 -->
    <view class="cell-left">
      <ui-icon v-if="icon" :name="icon" :size="32" :color="iconColor" class="cell-icon" />
      <view class="cell-title-group">
        <text class="cell-title">{{ title }}</text>
        <text v-if="label" class="cell-label">{{ label }}</text>
      </view>
    </view>

    <!-- 右侧：值 + 箭头 -->
    <view class="cell-right">
      <text class="cell-value" :style="{ color: valueColor }">{{ value }}</text>
      <slot name="right-icon">
        <ui-icon v-if="isLink" name="arrow-right" :size="24" :color="$color-text-placeholder" class="arrow" />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  value?: string;
  label?: string;
  icon?: string;
  iconColor?: string;
  isLink?: boolean;
  url?: string;
  border?: boolean;
  glass?: boolean;
  customClass?: string;
  valueColor?: string;
}>(), {
  border: true,
  glass: false,
  isLink: false,
  iconColor: '#1D1D1F'
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
  if (props.url) {
    uni.navigateTo({ url: props.url });
  }
};
</script>

<style lang="scss" scoped>
.ui-cell {
  position: relative;
  @include flex-between;
  padding: $space-lg $space-md;
  background-color: $color-bg-white;
  transition: background-color $duration-fast;

  &:active {
    background-color: $color-bg-gray;
  }

  &.is-glass {
    background-color: transparent;
    &:active { opacity: 0.7; }
    
    .cell-title { color: $color-text-main; }
    .cell-value { color: $color-text-sub; }
  }

  .cell-left {
    display: flex;
    align-items: center;
    
    .cell-icon { margin-right: $space-sm; }
    
    .cell-title {
      font-size: $font-size-md;
      color: $color-text-main;
      font-weight: $font-weight-medium;
    }
    
    .cell-label {
      margin-left: $space-sm;
      font-size: $font-size-xs;
      color: $color-text-sub;
    }
  }

  .cell-right {
    display: flex;
    align-items: center;
    
    .cell-value {
      font-size: $font-size-md;
      color: $color-text-sub;
    }
    
    .arrow {
      margin-left: $space-xs;
      opacity: 0.6;
    }
  }

  &:not(.no-border)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: $space-md;
    right: $space-md;
    height: 1px;
    background-color: $color-divider;
    transform: scaleY(0.5);
  }
}
</style>
