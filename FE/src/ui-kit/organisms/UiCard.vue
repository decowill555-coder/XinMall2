<template>
  <view 
    class="ui-card" 
    :class="[
      `radius-${radius}`,
      `padding-${padding}`,
      { 'is-glass': glass },
      { 'has-shadow': shadow },
      { 'is-interactive': interactive }
    ]"
    @tap="handleClick"
  >
    <!-- 头部 -->
    <view v-if="title || $slots.header" class="ui-card__head">
      <view class="ui-card__title">
        <slot name="title">{{ title }}</slot>
      </view>
      <view class="ui-card__extra">
        <slot name="extra"></slot>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="ui-card__content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  glass?: boolean;
  shadow?: boolean;
  interactive?: boolean;
  radius?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  glass: true,
  shadow: true,
  interactive: false,
  radius: 'md',
  padding: 'md'
});

const emit = defineEmits(['click']);

const handleClick = () => {
  if (props.interactive) emit('click');
};
</script>

<style lang="scss" scoped>
.ui-card {
  position: relative;
  background-color: $color-white;
  transition: all 0.2s ease;
  overflow: hidden;
  box-sizing: border-box;

  &.is-glass {
    @include glass-effect(20rpx, 0.8);
  }

  &.has-shadow {
    box-shadow: $shadow-sm;
  }

  &.is-interactive:active {
    transform: scale(0.98);
    opacity: 0.95;
  }

  &.radius-sm { border-radius: $radius-sm; }
  &.radius-md { border-radius: $radius-md; }
  &.radius-lg { border-radius: $radius-lg; }

  &.padding-none { padding: 0; }
  &.padding-sm { padding: $space-sm; }
  &.padding-md { padding: $space-md; }
  &.padding-lg { padding: $space-lg; }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-sm;
  }
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  &__extra {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}
</style>
