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
    <view v-if="title || $slots.title || $slots.extra || $slots.header" class="ui-card__head">
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
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-md;
  transition: all $duration-fast $ease-spring;
  overflow: hidden;
  box-sizing: border-box;

  &.is-glass {
    @include glass-card($radius-lg);
    background: var(--glass-solid, rgba(255, 255, 255, 0.75));
  }

  &.has-shadow {
    box-shadow: 
      0 16rpx 48rpx rgba(0, 0, 0, 0.04),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.7);
  }

  &.is-interactive:active {
    transform: scale(0.98);
    box-shadow: 
      0 8rpx 24rpx rgba(0, 0, 0, 0.03),
      inset 0 0 0 1rpx rgba(255, 255, 255, 0.5);
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
    padding-bottom: $space-sm;
    border-bottom: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  }
  
  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  &__extra {
    font-size: $font-size-sm;
    color: $color-text-sub;
    opacity: 0.8;
  }
  
  &__content {
    position: relative;
    z-index: 1;
  }
}

.ui-card--modern {
  @include card-shadow;
  @include card-shadow-hover;
  border: none;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  
  &.is-glass {
    background: var(--glass-solid, rgba(255, 255, 255, 0.95));
    backdrop-filter: blur($blur-md);
    -webkit-backdrop-filter: blur($blur-md);
  }
}
</style>
