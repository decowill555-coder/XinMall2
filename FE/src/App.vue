<template>
  <view class="app-container">
    <view class="test-content">
      <text class="title">✓ XinMall 正常运行</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

console.log('App setup running');

onLaunch(() => {
  console.log('App Launch');
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #F2F4F8;
}

.test-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}

.title {
  font-size: 32rpx;
  color: #1ABC9C;
  font-weight: 600;
}
</style>
