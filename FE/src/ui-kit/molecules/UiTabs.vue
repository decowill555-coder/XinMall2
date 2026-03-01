<template>
  <view class="ui-tabs-container">
    <scroll-view 
      scroll-x 
      class="ui-tabs-scroll"
      :scroll-into-view="`tab-${modelValue}`"
      :scroll-with-animation="true"
    >
      <view class="ui-tabs-nav" :class="[`style-${type}`]">
        <view 
          v-for="(item, index) in list" 
          :key="index"
          :id="`tab-${index}`"
          class="tab-item"
          :class="{ 'is-active': modelValue === index }"
          @click="onClick(index)"
        >
          <text class="tab-text">{{ item.name }}</text>
          
          <!-- Line 风格的下划线 -->
          <view v-if="type === 'line' && modelValue === index" class="tab-line" />
        </view>
        
        <!-- Capsule 风格的选中背景�?(可选高级实现，这里用简单的 active class 代替) -->
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
interface TabItem {
  name: string;
  value?: string | number;
  [key: string]: any;
}

const props = withDefaults(defineProps<{
  list: TabItem[];
  modelValue: number; // 当前选中索引
  type?: 'line' | 'capsule' | 'text';
}>(), {
  list: () => [],
  modelValue: 0,
  type: 'line'
});

const emit = defineEmits(['update:modelValue', 'change']);

const onClick = (index: number) => {
  emit('update:modelValue', index);
  emit('change', props.list[index]);
};
</script>

<style lang="scss" scoped>



.ui-tabs-container {
  width: 100%;
  background-color: transparent;
}

.ui-tabs-scroll {
  white-space: nowrap;
  width: 100%;
  // 隐藏滚动�?  @include hide-scrollbar;
}

.ui-tabs-nav {
  display: flex;
  align-items: center;
  padding: 0 $space-md;
  height: 88rpx;

  .tab-item {
    position: relative;
    padding: 0 $space-md;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-sub;
    font-size: $font-size-md;
    transition: all 0.2s;

    &.is-active {
      color: $color-text-main;
      font-weight: $font-weight-bold;
      font-size: $font-size-lg;
    }
  }

  // --- Line 风格 (底部短横�? ---
  &.style-line {
    .tab-line {
      position: absolute;
      bottom: 12rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background: $color-primary; // 可以换成 gradient-primary
      border-radius: $radius-full;
    }
  }

  // --- Capsule 风格 (胶囊按钮) ---
  &.style-capsule {
    .tab-item {
      height: 60rpx;
      border-radius: $radius-full;
      margin-right: $space-sm;
      background-color: transparent;

      &.is-active {
        background-color: $color-primary;
        color: $color-white;
        box-shadow: $shadow-primary-sm;
      }
    }
  }
}
</style>