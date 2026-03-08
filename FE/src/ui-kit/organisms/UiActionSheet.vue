<!-- src/ui-kit/organisms/UiActionSheet.vue -->
<template>
  <view 
    class="ui-action-sheet" 
    :class="{ 'is-show': show }"
    @touchmove.stop.prevent
  >
    <!-- 1. 遮罩�?-->
    <view class="sheet-mask" @click="onClose" />

    <!-- 2. 内容面板 -->
    <view class="sheet-panel safe-area-bottom">
      <!-- 标题/描述 (可�? -->
      <view v-if="title || description" class="sheet-header">
        <text v-if="title" class="title">{{ title }}</text>
        <text v-if="description" class="desc">{{ description }}</text>
      </view>

      <!-- 动作列表 -->
      <view class="sheet-body">
        <block v-if="actions.length > 0">
          <view 
            v-for="(item, index) in actions" 
            :key="index"
            class="action-item"
            :class="{ 'disabled': item.disabled }"
            @click="onSelect(item, index)"
          >
            <view class="item-content">
              <text class="item-name" :style="{ color: item.color || '' }">{{ item.name }}</text>
              <text v-if="item.subname" class="item-subname">{{ item.subname }}</text>
            </view>
            <!-- 按钮加载中状�?-->
            <ui-icon v-if="item.loading" name="loading" spin class="item-loading" />
          </view>
        </block>
        <!-- 支持插槽自定义内�?(如：规格选择�? -->
        <slot v-else />
      </view>

      <!-- 取消按钮 (独立的毛玻璃�? -->
      <view v-if="showCancel" class="sheet-cancel" @click="onClose">
        <text>{{ cancelText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface ActionItem {
  name: string;
  subname?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  value?: any;
}

const props = withDefaults(defineProps<{
  show: boolean;
  title?: string;
  description?: string;
  actions?: ActionItem[];
  showCancel?: boolean;
  cancelText?: string;
  closeOnClickAction?: boolean;
}>(), {
  show: false,
  actions: () => [],
  showCancel: true,
  cancelText: '取消',
  closeOnClickAction: true
});

const emit = defineEmits(['update:show', 'select', 'close']);

const onClose = () => {
  emit('update:show', false);
  emit('close');
};

const onSelect = (item: ActionItem, index: number) => {
  if (item.disabled || item.loading) return;
  emit('select', item, index);
  if (props.closeOnClickAction) {
    onClose();
  }
};
</script>

<style lang="scss" scoped>



.ui-action-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-modal; // 500
  visibility: hidden;
  transition: visibility $duration-normal;

  &.is-show {
    visibility: visible;
    
    .sheet-mask { opacity: 1; }
    .sheet-panel { transform: translateY(0); }
  }

  .sheet-mask {
    @include cover-screen;
    background-color: $overlay-bg;
    opacity: 0;
    transition: opacity $duration-normal;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .sheet-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: transparent; // 背景由子元素决定
    transform: translateY(100%);
    transition: transform $duration-normal $ease-out;
    padding: $space-md;
    box-sizing: border-box;
    // 底部安全�?    @include safe-area-bottom($space-md);
  }

  // 通用毛玻璃卡片样式 mixin
  @mixin panel-style {
    background-color: var(--glass-solid, rgba(255, 255, 255, 0.85));
    backdrop-filter: blur($blur-lg);
    -webkit-backdrop-filter: blur($blur-lg);
    border-radius: $radius-lg;
    overflow: hidden;
    
    [data-theme="dark"] & {
      background-color: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    }
  }

  .sheet-header, .sheet-body {
    @include panel-style;
    margin-bottom: $space-md;
  }

  .sheet-header {
    padding: $space-md;
    text-align: center;
    border-bottom: 1px solid $color-divider;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0;
    
    .title {
      display: block;
      font-size: $font-size-md;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
    .desc {
      font-size: $font-size-sm;
      color: $color-text-disabled;
      
      [data-theme="dark"] & {
        color: var(--color-text-disabled, #52525B);
      }
    }
  }

  .sheet-body {
    &:has(.sheet-header) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .action-item {
    position: relative;
    height: 100rpx;
    @include flex-center;
    background-color: transparent;
    font-size: $font-size-lg;
    transition: background-color 0.2s;

    &:active { 
      background-color: var(--color-border, rgba(0, 0, 0, 0.05));
      
      [data-theme="dark"] & {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background-color: var(--color-divider, rgba(0, 0, 0, 0.06));
      transform: scaleY(0.5);
      
      [data-theme="dark"] & {
        background-color: var(--color-divider, rgba(255, 255, 255, 0.08));
      }
    }
    
    .item-name {
      color: $color-text-main;
      
      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .item-subname {
      margin-left: $space-sm;
      font-size: $font-size-xs;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }

  .sheet-cancel {
    @include panel-style;
    height: 100rpx;
    @include flex-center;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    
    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
    
    &:active { 
      background-color: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
      
      [data-theme="dark"] & {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>