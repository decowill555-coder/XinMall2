<template>
  <view class="ui-interact-bar">
    <view class="interact-item" @click="emit('like')">
      <ui-icon 
        :name="isLiked ? 'heart-fill' : 'heart'" 
        :size="40" 
        :color="isLiked ? '#FF3D00' : ''" 
      />
      <text>{{ likeCount }}</text>
    </view>
    <view class="interact-item" @click="emit('comment')">
      <ui-icon name="message" :size="40" />
      <text>{{ commentCount }}</text>
    </view>
    <view class="interact-item" @click="emit('share')">
      <ui-icon name="share" :size="40" />
      <text>{{ shareText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  isLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
  shareText?: string;
}

withDefaults(defineProps<Props>(), {
  isLiked: false,
  likeCount: 0,
  commentCount: 0,
  shareText: '分享'
});

const emit = defineEmits(['like', 'comment', 'share']);
</script>

<style lang="scss" scoped>
.ui-interact-bar {
  display: flex;
  justify-content: space-around;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  
  .interact-item {
    @include flex-column-center;
    
    text {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
  }
}
</style>
