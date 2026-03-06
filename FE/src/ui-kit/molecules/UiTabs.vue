<template>
  <view class="ui-tabs-container">
    <scroll-view 
      scroll-x 
      class="ui-tabs-scroll"
      :scroll-into-view="`tab-${modelValue}`"
      :scroll-with-animation="true"
      :show-scrollbar="false"
      enhanced
      :enable-flex="true"
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
  @include hide-scrollbar;
  
  :deep(::-webkit-scrollbar) {
    display: none;
    width: 0;
    height: 0;
  }
}

.ui-tabs-nav {
  display: flex;
  align-items: center;
  padding: 0 $space-md;
  height: 88rpx;
  background: transparent;
  
  .tab-item {
    position: relative;
    padding: 0 $space-md;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-sub;
    font-size: $font-size-md;
    transition: all $duration-fast $ease-spring;
    flex-shrink: 0;
    border-radius: $radius-full;
    margin: 0 4rpx;

    &.is-active {
      color: $color-text-main;
      font-weight: $font-weight-bold;
      font-size: $font-size-lg;
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
    }
  }

  // --- Line 风格 (底部短横线) ---
  &.style-line {
    .tab-line {
      position: absolute;
      bottom: 12rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 6rpx;
      background: linear-gradient(90deg, $color-primary 0%, $color-primary-dark 100%);
      border-radius: $radius-full;
      box-shadow: 0 2rpx 8rpx rgba($color-primary, 0.3);
    }
  }

  // --- Capsule 风格 (胶囊按钮) ---
  &.style-capsule {
    .tab-item {
      height: 60rpx;
      border-radius: $radius-full;
      margin-right: $space-sm;
      background-color: transparent;
      border: 1rpx solid transparent;

      &.is-active {
        background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, var(--color-primary-dark, #E55D00) 100%);
        color: var(--color-text-white, #FFFFFF);
        box-shadow: var(--shadow-glow-primary, 0 4rpx 16rpx rgba(255, 106, 0, 0.25));
        border-color: var(--glass-border-subtle, rgba(255, 255, 255, 0.3));
      }
    }
  }
}
</style>