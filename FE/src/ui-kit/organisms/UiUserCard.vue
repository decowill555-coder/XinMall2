<template>
  <view class="ui-user-card" :class="{ 'is-glass': glass }" @click="emit('click')">
    <view class="user-header">
      <ui-avatar :src="avatar" :size="avatarSize" />
      <view class="user-info">
        <text class="user-name">{{ name }}</text>
        <text v-if="subtitle" class="user-subtitle">{{ subtitle }}</text>
        <view v-if="showFollow" class="follow-btn" @click.stop="emit('follow')">
          <text>{{ isFollowed ? '已关注' : '关注' }}</text>
        </view>
      </view>
    </view>

    <view v-if="showStats" class="user-stats">
      <view class="stat-item" @click.stop="emit('stat-click', 'sales')">
        <text class="stat-value">{{ sales }}</text>
        <text class="stat-label">卖出</text>
      </view>
      <view class="stat-item" @click.stop="emit('stat-click', 'followers')">
        <text class="stat-value">{{ followers }}</text>
        <text class="stat-label">粉丝</text>
      </view>
      <view class="stat-item" @click.stop="emit('stat-click', 'rating')">
        <text class="stat-value">{{ rating }}%</text>
        <text class="stat-label">好评</text>
      </view>
    </view>

    <slot />
  </view>
</template>

<script setup lang="ts">
interface Props {
  avatar?: string;
  name?: string;
  subtitle?: string;
  avatarSize?: number;
  glass?: boolean;
  showFollow?: boolean;
  isFollowed?: boolean;
  showStats?: boolean;
  sales?: number;
  followers?: number;
  rating?: number;
}

withDefaults(defineProps<Props>(), {
  avatar: '',
  name: '',
  subtitle: '',
  avatarSize: 80,
  glass: false,
  showFollow: false,
  isFollowed: false,
  showStats: false,
  sales: 0,
  followers: 0,
  rating: 100
});

const emit = defineEmits<{
  click: [];
  follow: [];
  'stat-click': [type: string];
}>();
</script>

<style lang="scss" scoped>
.ui-user-card {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  margin-bottom: $space-sm;

  &.is-glass {
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  }

  .user-header {
    display: flex;
    align-items: center;

    .user-info {
      margin-left: $space-md;
      flex: 1;

      .user-name {
        font-size: $font-size-lg;
        font-weight: $font-weight-medium;
        color: $color-text-main;
        display: block;
      }

      .user-subtitle {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-top: $space-xs;
        display: block;
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

  .user-stats {
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
