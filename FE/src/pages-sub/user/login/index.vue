<template>
  <view class="login-page">
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="app-name">XinMall</text>
      <text class="app-desc">数码好物 闲置流转</text>
    </view>
    
    <view class="login-form">
      <view class="form-item">
        <ui-icon name="phone" ::size="40" />
        <input type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-item">
        <ui-icon name="lock" ::size="40" />
        <input :password="!showPassword" v-model="password" placeholder="请输入密码" />
        <ui-icon :name="showPassword ? 'eye' : 'eye-off'" ::size="40" @click="showPassword = !showPassword" />
      </view>
      
      <ui-button type="primary" block :disabled="!canLogin" @click="handleLogin">登录</ui-button>
      
      <view class="form-footer">
        <text class="link" @click="goRegister">注册账号</text>
        <text class="link" @click="goForgot">忘记密码？</text>
      </view>
    </view>
    
    <view class="other-login">
      <ui-divider>其他登录方式</ui-divider>
      <view class="login-icons">
        <view class="icon-item" @click="loginByWechat">
          <ui-icon name="message" ::size="40" color="#07C160" />
          <text>微信</text>
        </view>
        <view class="icon-item" @click="loginByAlipay">
          <ui-icon name="credit-card" ::size="40" color="#1677FF" />
          <text>支付宝</text>
        </view>
      </view>
    </view>
    
    <view class="agreement">
      <ui-checkbox v-model="agreed" />
      <text class="agreement-text">
        登录即表示同意
        <text class="link" @click="goAgreement('user')">《用户协议》</text>
        和
        <text class="link" @click="goAgreement('privacy')">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore, useAuthStore } from '@/stores';

const userStore = useUserStore();
const authStore = useAuthStore();

const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const agreed = ref(false);

const canLogin = computed(() => phone.value.length === 11 && password.value.length >= 6 && agreed.value);

const handleLogin = async () => {
  if (!canLogin.value) return;
  
  uni.showLoading({ title: '登录中...' });
  
  try {
    const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    userStore.setToken(mockToken);
    
    authStore.setAuth('user_001', 'user');
    
    uni.hideLoading();
    uni.showToast({ title: '登录成功', icon: 'success' });
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/my/index' });
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '登录失败', icon: 'none' });
  }
};

const goRegister = () => {
  uni.showToast({ title: '注册功能开发中', icon: 'none' });
};

const goForgot = () => {
  uni.showToast({ title: '找回密码功能开发中', icon: 'none' });
};

const loginByWechat = () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' });
    return;
  }
  uni.showToast({ title: '微信登录', icon: 'none' });
};

const loginByAlipay = () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意用户协议', icon: 'none' });
    return;
  }
  uni.showToast({ title: '支付宝登录', icon: 'none' });
};

const goAgreement = (type: string) => {
  uni.showToast({ title: `${type === 'user' ? '用户协议' : '隐私政策'}`, icon: 'none' });
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: $color-white;
  padding: 0 $space-xl;
}

.login-header {
  @include flex-column-center;
  padding-top: 120rpx;
  
  .logo {
    width: 120rpx;
    height: 120rpx;
  }
  
  .app-name {
    font-size: 48rpx;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-top: $space-md;
  }
  
  .app-desc {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
  }
}

.login-form {
  margin-top: $space-xl;
  
  .form-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 $space-md;
    background: $color-bg-gray;
    border-radius: $radius-md;
    margin-bottom: $space-md;
    
    input {
      flex: 1;
      margin-left: $space-sm;
      font-size: $font-size-md;
    }
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    margin-top: $space-md;
    
    .link {
      font-size: $font-size-sm;
      color: $color-primary;
    }
  }
}

.other-login {
  margin-top: $space-xl;
  
  .login-icons {
    display: flex;
    justify-content: center;
    gap: 80rpx;
    margin-top: $space-lg;
    
    .icon-item {
      @include flex-column-center;
      
      text {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}

.agreement {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  
  .agreement-text {
    font-size: $font-size-xs;
    color: $color-text-sub;
    margin-left: $space-xs;
    line-height: 1.5;
    
    .link {
      color: $color-primary;
    }
  }
}
</style>
