<template>
  <view class="ui-seller-card" @click="$emit('click')">
    <view class="seller-header">
      <ui-avatar :src="avatar" :size="avatarSize" />
      <view class="seller-info">
        <view class="seller-name">{{ name }}</view>
        <view v-if="desc" class="seller-desc">{{ desc }}</view>
        <view v-if="showFollow" class="follow-btn" @click.stop="$emit('follow')">
          <text>{{ isFollowed ? '已关注' : '关注' }}</text>
        </view>
      </view>
    </view>
    
    <view v-if="showStats" class="seller-stats">
      <view class="stat-item" @click.stop="$emit('stat-click', 'sales')">
        <text class="stat-value">{{ sales }}</text>
        <text class="stat-label">卖出</text>
      </view>
      <view class="stat-item" @click.stop="$emit('stat-click', 'followers')">
        <text class="stat-value">{{ followers }}</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-item" @click.stop="$emit('stat-click', 'rating')">
        <text class="stat-value">{{ rating }}%</text>
        <text class="stat-label">好评</text>
      </view>
    </view>
    
    <slot />
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  avatar?: string;
  name?: string;
  desc?: string;
  sales?: number;
  followers?: number;
  rating?: number;
  avatarSize?: number;
  showStats?: boolean;
  showFollow?: boolean;
  isFollowed?: boolean;
}>(), {
  avatar: '',
  name: '',
  desc: '',
  sales: 0,
  followers: 0,
  rating: 100,
  avatarSize: 80,
  showStats: true,
  showFollow: false,
  isFollowed: false
});

defineEmits<{
  click: [];
  follow: [];
  'stat-click': [type: string];
}>();
</script>

<style lang="scss" scoped>
.ui-seller-card {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin-bottom: $space-sm;
  
  .seller-header {
    display: flex;
    align-items: center;
    
    .seller-info {
      margin-left: $space-md;
      flex: 1;
      
      .seller-name {
        font-size: $font-size-lg;
        font-weight: $font-weight-medium;
        color: $color-text-main;
        margin-bottom: $space-xs;
      }
      
      .seller-desc {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
      
      .follow-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8rpx 24rpx;
        margin-top: $space-xs;
        background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, var(--color-primary-dark, #E55D00) 100%);
        border-radius: $radius-full;
        
        text {
          font-size: $font-size-xs;
          color: var(--color-text-white, #FFFFFF);
        }
      }
    }
  }
  
  .seller-stats {
    display: flex;
    justify-content: space-around;
    padding-top: $space-md;
    margin-top: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        display: block;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: $color-text-main;
      }
      
      .stat-label {
        font-size: $font-size-xs;
        color: $color-text-sub;
      }
    }
  }
}
</style>
