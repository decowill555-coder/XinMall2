<template>
  <view class="app-container" :style="themeStore.themeVarsObject" :data-theme="themeStore.currentMode" :data-color="themeStore.config.color">
    <router-view />
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useAppStore, useThemeStore, useUserStore, useAuthStore } from '@/stores';

const AUTH_REQUIRED_PAGES = [
  'pages/follow/index',
  'pages/message/index',
  'pages/my/index',
  'pages-sub/trade/cart/index',
  'pages-sub/trade/order/list',
  'pages-sub/trade/order/detail',
  'pages-sub/trade/order/confirm',
  'pages-sub/trade/pay/index',
  'pages-sub/trade/evaluate/index',
  'pages-sub/seller/publish/entry',
  'pages-sub/seller/shop/index',
  'pages-sub/seller/shop/manage',
  'pages-sub/seller/goods/list',
  'pages-sub/seller/goods/edit',
  'pages-sub/seller/after-sale/list',
  'pages-sub/seller/after-sale/detail',
  'pages-sub/community/post/publish',
  'pages-sub/user/address/list',
  'pages-sub/user/address/edit',
  'pages-sub/user/collection/index',
  'pages-sub/user/history/index',
  'pages-sub/user/settings/index',
  'pages-sub/user/wallet/index',
  'pages-sub/auth/real-name/index',
  'pages-sub/auth/shop-auth/index',
];

const LOGIN_PAGE = '/pages-sub/user/login/index';
const REDIRECT_URL_KEY = 'redirectUrl';

function isAuthRequired(url: string): boolean {
  const path = url.split('?')[0].replace(/^\//, '');
  return AUTH_REQUIRED_PAGES.some(page => path.includes(page));
}

function isLoggedIn(): boolean {
  return !!uni.getStorageSync('token');
}

function saveRedirectAndGoLogin(targetUrl: string): void {
  uni.setStorageSync(REDIRECT_URL_KEY, targetUrl);
  uni.navigateTo({ url: LOGIN_PAGE });
}

function setupAuthInterceptor(): void {
  const originalNavigateTo = uni.navigateTo;
  const originalRedirectTo = uni.redirectTo;
  const originalReLaunch = uni.reLaunch;
  const originalSwitchTab = uni.switchTab;

  uni.navigateTo = function(options: UniApp.NavigateToOptions) {
    const url = options.url || '';
    if (isAuthRequired(url) && !isLoggedIn()) {
      saveRedirectAndGoLogin(url);
      return Promise.resolve(undefined as any);
    }
    return originalNavigateTo.call(uni, options);
  };

  uni.redirectTo = function(options: UniApp.RedirectToOptions) {
    const url = options.url || '';
    if (isAuthRequired(url) && !isLoggedIn()) {
      saveRedirectAndGoLogin(url);
      return Promise.resolve(undefined as any);
    }
    return originalRedirectTo.call(uni, options);
  };

  uni.reLaunch = function(options: UniApp.ReLaunchOptions) {
    const url = options.url || '';
    if (isAuthRequired(url) && !isLoggedIn()) {
      uni.setStorageSync(REDIRECT_URL_KEY, url);
      return originalReLaunch.call(uni, { url: LOGIN_PAGE });
    }
    return originalReLaunch.call(uni, options);
  };

  uni.switchTab = function(options: UniApp.SwitchTabOptions) {
    const url = options.url || '';
    if (isAuthRequired(url) && !isLoggedIn()) {
      saveRedirectAndGoLogin(url);
      return Promise.resolve(undefined as any);
    }
    return originalSwitchTab.call(uni, options);
  };
}

const appStore = useAppStore();
const themeStore = useThemeStore();
const userStore = useUserStore();
const authStore = useAuthStore();



onLaunch(() => {
  console.log('App Launch');
  setupAuthInterceptor();
  appStore.init();
  themeStore.initTheme();
  authStore.initialize();
  uni.hideTabBar({animation: false});
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
  background-color: var(--color-bg-page, #FFF5F2);
  transition: background-color 0.3s ease;
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
  color: var(--color-primary, #1ABC9C);
  font-weight: 600;
}
</style>
