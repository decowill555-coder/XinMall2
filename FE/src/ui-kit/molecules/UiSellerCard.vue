<template>
  <view class="ui-seller-card" @click="handleClick">
    <ui-avatar :src="avatar" :size="80" />
    <view class="seller-info">
      <view class="seller-main">
        <text class="seller-name">{{ name }}</text>
        <view v-if="levelName" class="level-badge">{{ levelName }}</view>
      </view>
      <view v-if="desc" class="seller-desc">{{ desc }}</view>
      <view class="seller-stats">
        <view v-if="sales !== undefined" class="stat-item">
          <text class="stat-value">{{ sales }}</text>
          <text class="stat-label">在售</text>
        </view>
        <view v-if="followers !== undefined" class="stat-item">
          <text class="stat-value">{{ formatCount(followers) }}</text>
          <text class="stat-label">粉丝</text>
        </view>
        <view v-if="rating !== undefined" class="stat-item">
          <text class="stat-value">{{ rating }}%</text>
          <text class="stat-label">好评</text>
        </view>
      </view>
    </view>
    <ui-icon name="arrow-right" :size="32" color="#C7C7CC" />
  </view>
</template>

<script setup lang="ts">
interface Props {
  sellerId?: string;
  avatar?: string;
  name?: string;
  levelName?: string;
  desc?: string;
  sales?: number;
  followers?: number;
  rating?: number;
}

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  name: '',
  desc: ''
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

const handleClick = () => {
  emit('click');
  if (props.sellerId) {
    uni.navigateTo({ url: `/pages-sub/community/user/index?id=${props.sellerId}` });
  }
};
</script>

<style lang="scss" scoped>
.ui-seller-card {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  margin: $space-sm $space-md;
  
  .seller-info {
    flex: 1;
    margin-left: $space-md;
    
    .seller-main {
      display: flex;
      align-items: center;
      gap: $space-xs;
    }
    
    .seller-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .level-badge {
      font-size: $font-size-xs;
      color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
      padding: 2rpx 12rpx;
      border-radius: $radius-full;
    }
    
    .seller-desc {
      font-size: $font-size-xs;
      @include text-sub;
      margin-top: 4rpx;
      @include text-ellipsis;
    }
    
    .seller-stats {
      display: flex;
      gap: $space-lg;
      margin-top: $space-xs;
      
      .stat-item {
        display: flex;
        align-items: baseline;
        gap: 4rpx;
        
        .stat-value {
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          @include text-main;
        }
        
        .stat-label {
          font-size: $font-size-xs;
          @include text-sub;
        }
      }
    }
  }
}
</style>
