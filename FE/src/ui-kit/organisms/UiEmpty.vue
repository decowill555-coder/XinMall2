<template>
  <view class="ui-empty" :style="{ paddingTop: paddingTop + 'rpx' }">
    <ui-icon :name="icon" :size="iconSize" :color="iconColor" />
    <text class="empty-text">{{ text }}</text>
    <slot name="action">
      <ui-button 
        v-if="actionText" 
        type="primary" 
        size="sm" 
        @click="$emit('action')"
      >
        {{ actionText }}
      </ui-button>
    </slot>
    <slot />
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  text?: string;
  actionText?: string;
  paddingTop?: number;
}>(), {
  icon: 'inbox',
  iconSize: 80,
  iconColor: '#A1A1A6',
  text: '暂无数据',
  actionText: '',
  paddingTop: 200
});

defineEmits<{
  action: [];
}>();
</script>

<style lang="scss" scoped>
.ui-empty {
  @include flex-column-center;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin: $space-md 0;
  }
}
</style>
