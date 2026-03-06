<template>
  <view class="ui-comment-item">
    <ui-avatar :src="avatar" :size="64" />
    <view class="comment-content">
      <view class="comment-header">
        <text class="comment-name">{{ userName }}</text>
        <text class="comment-time">{{ time }}</text>
      </view>
      <text class="comment-text">{{ content }}</text>
      <view class="comment-actions">
        <view class="action-item" @click="emit('like')">
          <ui-icon 
            :name="isLiked ? 'heart-fill' : 'heart'" 
            :size="32" 
            :color="isLiked ? '#FF3D00' : ''" 
          />
          <text>{{ likeCount }}</text>
        </view>
        <text class="action-item" @click="emit('reply')">回复</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  avatar?: string;
  userName?: string;
  time?: string;
  content?: string;
  isLiked?: boolean;
  likeCount?: number;
}

withDefaults(defineProps<Props>(), {
  avatar: '',
  userName: '',
  time: '',
  content: '',
  isLiked: false,
  likeCount: 0
});

const emit = defineEmits(['like', 'reply']);
</script>

<style lang="scss" scoped>
.ui-comment-item {
  display: flex;
  padding: $space-sm 0;
  
  .comment-content {
    flex: 1;
    margin-left: $space-sm;
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .comment-name {
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $color-text-main;
      }
      
      .comment-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
      }
    }
    
    .comment-text {
      font-size: $font-size-sm;
      color: $color-text-main;
      line-height: 1.5;
      margin: $space-xs 0;
    }
    
    .comment-actions {
      display: flex;
      gap: $space-md;
      
      .action-item {
        display: flex;
        align-items: center;
        font-size: $font-size-xs;
        color: $color-text-sub;
        
        text { margin-left: 4rpx; }
      }
    }
  }
}
</style>
