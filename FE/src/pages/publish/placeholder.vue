<template>
  <view class="page-container" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
    <view class="empty-content">
      <text class="empty-text">发布页面</text>
      <text class="empty-tip">点击中间按钮发布商品</text>
    </view>
    <TheTabbar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaTop, headerExtraTop } = usePageLayout({
  hasTabbar: true
});
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: $color-bg-page;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-text {
  font-size: 32rpx;
  color: $color-text-main;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 26rpx;
  color: $color-text-sub;
}
</style>
