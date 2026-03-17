import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserInfo } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(uni.getStorageSync('token') || '');
  const refreshToken = ref(uni.getStorageSync('refreshToken') || '');
  const userInfo = ref<UserInfo | null>(
    uni.getStorageSync('userInfo') || null
  );

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken;
    uni.setStorageSync('token', newToken);
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    uni.setStorageSync('refreshToken', newRefreshToken);
  };

  const setTokens = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
  };

  const setUserInfo = (info: UserInfo | null) => {
    userInfo.value = info;
    if (info) {
      uni.setStorageSync('userInfo', info);
    } else {
      uni.removeStorageSync('userInfo');
    }
  };

  const updateUserInfo = (partial: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...partial };
      uni.setStorageSync('userInfo', userInfo.value);
    }
  };

  const logout = () => {
    token.value = '';
    refreshToken.value = '';
    userInfo.value = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('refreshToken');
    uni.removeStorageSync('userInfo');
    uni.reLaunch({ url: '/pages/index/index' });
  };

  const isLoggedIn = () => {
    return !!token.value && !!userInfo.value;
  };

  return {
    token,
    refreshToken,
    userInfo,
    setToken,
    setRefreshToken,
    setTokens,
    setUserInfo,
    updateUserInfo,
    logout,
    isLoggedIn
  };
});