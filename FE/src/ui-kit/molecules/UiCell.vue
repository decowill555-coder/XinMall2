<template>
  <view 
    class="ui-cell"
    :class="[
      { 'is-glass': glass, 'is-link': isLink, 'no-border': !border },
      customClass
    ]"
    @click="handleClick"
  >
    <!-- 左侧：图标 + 标题 -->
    <view class="cell-left">
      <ui-icon v-if="icon" :name="icon" :size="32" :color="iconColor" class="cell-icon" />
      <text class="cell-title">{{ title }}</text>
      <text v-if="label" class="cell-label">{{ label }}</text>
    </view>

    <!-- 右侧：内容 + 箭头 -->
    <view class="cell-right">
      <text class="cell-value" :style="{ color: valueColor }">{{ value }}</text>
      <slot name="right-icon">
        <ui-icon v-if="isLink" name="arrow-right" :size="24" color="#A1A1A6" class="arrow" />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string;
  value?: string;
  label?: string; // 标题下方的描述
  icon?: string;  // 左侧图标名称
  iconColor?: string;
  isLink?: boolean; // 是否展示右侧箭头
  url?: string;     // 跳转链接
  border?: boolean; // 是否显示底部分割线
  glass?: boolean;  // 是否开启毛玻璃背景
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
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-cell {
  position: relative;
  @include flex-between;
  padding: $space-lg $space-md; // 上下大间距，左右中间距
  background-color: $color-bg-white;
  transition: background-color $duration-fast;

  // 点击态
  &:active {
    background-color: $color-bg-gray;
  }

  // 毛玻璃模式 (用于个人中心卡片)
  &.is-glass {
    background-color: transparent; // 背景由父级决定
    &:active { opacity: 0.7; }
    
    .cell-title { color: $color-text-main; }
    .cell-value { color: $color-text-sub; }
  }

  // 内部布局
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

  // 底部分割线 (使用伪元素实现0.5px)
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