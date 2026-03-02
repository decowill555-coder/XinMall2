<!-- src/ui-kit/atoms/UiSkeleton.vue -->
<template>
  <view 
    class="ui-skeleton"
    :class="{ 'is-animate': animate }"
    :style="{
      width: width,
      height: height,
      borderRadius: circle ? '50%' : radius,
      marginTop: marginTop,
      marginBottom: marginBottom
    }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  width?: string;
  height?: string;
  circle?: boolean; // 是否圆形
  radius?: string;  // 圆角大小
  animate?: boolean; // 是否开启动�?  marginTop?: string;
  marginBottom?: string;
  marginTop?: string;
}>(), {
  width: '100%',
  height: '32rpx', // 默认一行文字高�?  circle: false,
  radius: '8rpx', // $radius-sm
  animate: true,
  marginTop: '0',
  marginBottom: '0'
});
</script>

<style lang="scss" scoped>



.ui-skeleton {
  background-color: $color-bg-gray;
  
  &.is-animate {
    // 调用 mixins.scss 中定义的骨架屏动�?    @include skeleton-loading;
  }
}
</style>