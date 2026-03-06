<template>
  <view class="ui-author-card" :class="{ 'is-glass': glass }">
    <view class="author-info" @click="emit('click')">
      <ui-avatar :src="avatar" :size="size" />
      <view class="author-detail">
        <text class="author-name">{{ name }}</text>
        <text v-if="time" class="author-time">{{ time }}</text>
      </view>
    </view>
    <ui-button 
      v-if="showFollow" 
      size="sm" 
      :type="isFollowed ? 'default' : 'primary'" 
      @click="emit('follow')"
    >
      {{ isFollowed ? '已关注' : '关注' }}
    </ui-button>
  </view>
</template>

<script setup lang="ts">
interface Props {
  avatar?: string;
  name?: string;
  time?: string;
  isFollowed?: boolean;
  showFollow?: boolean;
  size?: number;
  glass?: boolean;
}

withDefaults(defineProps<Props>(), {
  avatar: '',
  name: '',
  time: '',
  isFollowed: false,
  showFollow: false,
  size: 80,
  glass: false
});

const emit = defineEmits(['click', 'follow']);
</script>

<style lang="scss" scoped>
.ui-author-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  &.is-glass {
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  }
  
  .author-info {
    display: flex;
    align-items: center;
    
    .author-detail {
      margin-left: $space-sm;
      
      .author-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
      }
      
      .author-time {
        display: block;
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: $space-xs;
      }
    }
  }
}
</style>
