<template>
  <view class="publish-page" :style="{ paddingTop: safeAreaTop + 'px' }">
    <view class="publish-header">
      <text class="header-title">发布闲置</text>
      <text class="header-subtitle">选择发布类型</text>
    </view>

    <view class="publish-options">
      <!-- 发布商品 -->
      <view class="option-card" @click="goPublishGoods">
        <view class="option-icon goods">
          <ui-icon name="package" :size="64" color="white" />
        </view>
        <view class="option-content">
          <text class="option-title">发布商品</text>
          <text class="option-desc">出售闲置物品，赚取零花钱</text>
        </view>
        <view class="option-arrow">
          <ui-icon name="chevron-right" :size="40" color="sub" />
        </view>
      </view>

      <!-- 发布帖子 -->
      <view class="option-card" @click="goPublishPost">
        <view class="option-icon post">
          <ui-icon name="edit" :size="64" color="white" />
        </view>
        <view class="option-content">
          <text class="option-title">发布帖子</text>
          <text class="option-desc">分享使用心得，交流经验</text>
        </view>
        <view class="option-arrow">
          <ui-icon name="chevron-right" :size="40" color="sub" />
        </view>
      </view>
    </view>

    <!-- 草稿箱入口 -->
    <view class="draft-entry" @click="goDraftBox">
      <view class="draft-icon">
        <ui-icon name="file-text" :size="40" />
      </view>
      <text class="draft-text">草稿箱</text>
      <view v-if="draftCount > 0" class="draft-badge">
        <text>{{ draftCount }}</text>
      </view>
      <ui-icon name="chevron-right" :size="32" color="sub" class="draft-arrow" />
    </view>

    <!-- 发布须知 -->
    <view class="publish-tips">
      <view class="tips-header">
        <ui-icon name="info" :size="32" color="primary" />
        <text class="tips-title">发布须知</text>
      </view>
      <view class="tips-list">
        <text class="tips-item">1. 请确保商品信息真实有效</text>
        <text class="tips-item">2. 禁止发布违禁品和侵权商品</text>
        <text class="tips-item">3. 请使用实拍图片，禁止盗图</text>
        <text class="tips-item">4. 虚假宣传将被下架处理</text>
      </view>
    </view>

    <TheTabbar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaTop } = usePageLayout({
  hasTabbar: true
});

const draftCount = ref(0);

const goPublishGoods = () => {
  uni.navigateTo({ url: '/pages-sub/seller/publish/entry' });
};

const goPublishPost = () => {
  uni.navigateTo({ url: '/pages-sub/community/post/publish' });
};

const goDraftBox = () => {
  uni.navigateTo({ url: '/pages-sub/seller/goods/list?tab=draft' });
};

onMounted(() => {
  // 获取草稿数量
  const drafts = uni.getStorageSync('publish_drafts') || [];
  draftCount.value = drafts.length;
});
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 180rpx;
}

.publish-header {
  padding: $space-xl $space-lg;
  text-align: center;

  .header-title {
    font-size: $font-size-xxl;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    display: block;

    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
  }

  .header-subtitle {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
    display: block;

    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
  }
}

.publish-options {
  padding: 0 $space-lg;
}

.option-card {
  display: flex;
  align-items: center;
  padding: $space-lg;
  margin-bottom: $space-md;
  background: $color-bg-card;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: $radius-xl;
  border: 1px solid $color-border;
  transition: all $duration-fast $ease-spring;

  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
    border-bottom: 1px solid transparent;
    border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }

  &:active {
    transform: scale(0.98);
  }

  .option-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: $radius-lg;
    @include flex-center;
    flex-shrink: 0;

    &.goods {
      background: linear-gradient(135deg, #FF6A00 0%, #FF9500 100%);
    }

    &.post {
      background: linear-gradient(135deg, #5856D6 0%, #AF52DE 100%);
    }
  }

  .option-content {
    flex: 1;
    margin-left: $space-md;

    .option-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
      display: block;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .option-desc {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: $space-xs;
      display: block;

      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }

  .option-arrow {
    flex-shrink: 0;
  }
}

.draft-entry {
  display: flex;
  align-items: center;
  margin: $space-lg;
  padding: $space-md $space-lg;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  border: 1px solid $color-border;

  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.12));
  }

  .draft-icon {
    width: 64rpx;
    height: 64rpx;
    background: rgba($color-primary, 0.1);
    border-radius: $radius-md;
    @include flex-center;
    color: $color-primary;

    [data-theme="dark"] & {
      background: rgba(217, 70, 239, 0.15);
      color: var(--color-primary, #E879F9);
    }
  }

  .draft-text {
    flex: 1;
    margin-left: $space-md;
    font-size: $font-size-md;
    color: $color-text-main;

    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
  }

  .draft-badge {
    min-width: 36rpx;
    height: 36rpx;
    padding: 0 10rpx;
    background: $color-error;
    border-radius: $radius-full;
    @include flex-center;

    text {
      font-size: $font-size-xs;
      color: $color-white;
    }
  }

  .draft-arrow {
    margin-left: $space-sm;
  }
}

.publish-tips {
  margin: $space-lg;
  padding: $space-md;
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  border: 1px solid $color-border;

  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.12));
  }

  .tips-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-sm;

    .tips-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-main;
      margin-left: $space-xs;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
  }

  .tips-list {
    .tips-item {
      font-size: $font-size-xs;
      color: $color-text-sub;
      line-height: $line-height-loose;
      display: block;

      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }
}
</style>
