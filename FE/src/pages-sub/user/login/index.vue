<template>
  <view class="login-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
    </view>
    
    <view class="login-header">
      <view class="logo-wrapper">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <view class="logo-glow"></view>
      </view>
      <text class="app-name">XinMall</text>
      <text class="app-desc">数码好物 闲置流转</text>
    </view>
    
    <view class="login-form">
      <view class="form-card">
        <view class="form-item" :class="{ 'is-focused': focusedField === 'phone' }">
          <view class="input-icon">
            <ui-icon name="phone" :size="40" />
          </view>
          <input 
            type="number" 
            v-model="phone" 
            placeholder="请输入手机号" 
            maxlength="11"
            @focus="focusedField = 'phone'"
            @blur="focusedField = ''"
          />
        </view>
        <view class="form-item" :class="{ 'is-focused': focusedField === 'password' }">
          <view class="input-icon">
            <ui-icon name="lock" :size="40" />
          </view>
          <input 
            :password="!showPassword" 
            v-model="password" 
            placeholder="请输入密码"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
          />
          <view class="input-action" @click="showPassword = !showPassword">
            <ui-icon :name="showPassword ? 'eye' : 'eye-off'" :size="40" />
          </view>
        </view>
        
        <view class="login-btn-wrapper">
          <ui-button type="primary" block :disabled="!canLogin" @click="handleLogin">
            登录
          </ui-button>
        </view>
        
        <view class="form-footer">
          <text class="link" @click="goRegister">注册账号</text>
          <text class="link" @click="goForgot">忘记密码？</text>
        </view>
      </view>
    </view>
    
    <view class="other-login">
      <view class="quick-login-header">
        <text class="quick-login-title">快捷登录</text>
        <text class="quick-login-tip">未注册用户将自动创建账号</text>
      </view>
      <view class="login-icons">
        <view class="icon-item" @click="loginByWechat">
          <view class="icon-circle wechat">
            <ui-icon name="message" :size="44" color="white" />
          </view>
          <text>微信</text>
        </view>
        <view class="icon-item" @click="loginByAlipay">
          <view class="icon-circle alipay">
            <ui-icon name="credit-card" :size="44" color="white" />
          </view>
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
import { handleRedirectAfterLogin } from '@/utils/navigation';
import { authApi } from '@/api';

const userStore = useUserStore();
const authStore = useAuthStore();

const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const agreed = ref(false);
const focusedField = ref('');

const canLogin = computed(() => phone.value.length === 11 && password.value.length >= 6 && agreed.value);

const handleLogin = async () => {
  if (!canLogin.value) return;

  uni.showLoading({ title: '登录中...' });

  try {
    const result = await authApi.login({
      phone: phone.value,
      password: password.value
    });

    userStore.setTokens(result.token, result.refreshToken);
    userStore.setUserInfo(result.user);
    authStore.setAuth(result.user.id, 'user');

    uni.hideLoading();
    uni.showToast({ title: '登录成功', icon: 'success' });

    setTimeout(() => {
      handleRedirectAfterLogin();
    }, 1500);
  } catch (error: any) {
    uni.hideLoading();
    uni.showToast({ title: error.message || '登录失败', icon: 'none' });
  }
};

const goRegister = () => {
  uni.navigateTo({ url: '/pages-sub/user/register/index' });
};

const goForgot = () => {
  uni.navigateTo({ url: '/pages-sub/user/forgot/index' });
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
  background: linear-gradient(170deg, $color-bg-gradient-start 0%, $color-bg-page 35%, $color-bg-page 100%);
  padding: 0 $space-lg;
  position: relative;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background: linear-gradient(170deg, var(--color-bg-gradient-start, #1A1520) 0%, $color-bg-page 35%, $color-bg-page 100%);
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.6;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: -100rpx;
    right: -100rpx;
    background: radial-gradient(circle, rgba($color-primary, 0.2) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, transparent 70%);
    }
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    top: 200rpx;
    left: -80rpx;
    background: radial-gradient(circle, rgba($color-accent, 0.15) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, transparent 70%);
    }
  }
  
  .circle-3 {
    width: 500rpx;
    height: 500rpx;
    bottom: 100rpx;
    right: -150rpx;
    background: radial-gradient(circle, rgba($color-primary, 0.1) 0%, transparent 70%);
    
    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(0, 245, 212, 0.12) 0%, transparent 70%);
    }
  }
}

.login-header {
  @include flex-column-center;
  padding-top: 120rpx;
  position: relative;
  z-index: 1;
  
  .logo-wrapper {
    position: relative;
    @include flex-center;
    
    .logo {
      width: 120rpx;
      height: 120rpx;
      position: relative;
      z-index: 2;
    }
    
    .logo-glow {
      position: absolute;
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($color-primary, 0.3) 0%, transparent 70%);
      animation: logo-glow 3s ease-in-out infinite;
      
      [data-theme="dark"] & {
        background: radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%);
      }
    }
  }
  
  .app-name {
    font-size: 52rpx;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-top: $space-md;
    letter-spacing: 2rpx;
    
    [data-theme="dark"] & {
      background: var(--gradient-sunset);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .app-desc {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
    letter-spacing: 1rpx;
  }
}

@keyframes logo-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.login-form {
  margin-top: $space-xl;
  position: relative;
  z-index: 1;
  
  .form-card {
    background: $color-bg-card;
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border-radius: $radius-xl;
    padding: $space-xl $space-lg;
    border: 1px solid $color-border;
    box-shadow: 
      0 8rpx 32rpx rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    
    [data-theme="dark"] & {
      background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
      border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
      border-bottom: 1px solid transparent;
      border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
      border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }
  
  .form-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 $space-md;
    background: $color-bg-gray;
    border-radius: $radius-lg;
    margin-bottom: $space-md;
    border: 2rpx solid transparent;
    transition: all $duration-normal $ease-spring;
    
    [data-theme="dark"] & {
      background: var(--input-bg, rgba(0, 0, 0, 0.3));
      border: 1px solid var(--input-border, rgba(255, 255, 255, 0.05));
    }
    
    &.is-focused {
      background: rgba($color-primary, 0.05);
      border-color: $color-primary;
      box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1);
      
      [data-theme="dark"] & {
        background: rgba(217, 70, 239, 0.1);
        border-color: var(--color-primary, #D946EF);
        box-shadow: var(--input-focus-glow, 0 0 15px rgba(217, 70, 239, 0.3));
      }
      
      .input-icon {
        color: $color-primary;
        
        [data-theme="dark"] & {
          color: var(--color-primary, #D946EF);
        }
      }
    }
    
    .input-icon {
      color: $color-text-sub;
      transition: color $duration-fast $ease-out;
    }
    
    input {
      flex: 1;
      margin-left: $space-sm;
      font-size: $font-size-md;
      color: $color-text-main;
      
      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
    
    input::placeholder {
      color: $color-text-placeholder;
      
      [data-theme="dark"] & {
        color: var(--color-text-placeholder, rgba(255, 255, 255, 0.3));
      }
    }
    
    .input-action {
      padding: $space-xs;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }
  
  .login-btn-wrapper {
    margin-top: $space-lg;
    
    :deep(.ui-button) {
      height: 96rpx;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      border-radius: $radius-lg;
      background: $gradient-sunset;
      box-shadow: $shadow-glow-primary;
      
      [data-theme="dark"] & {
        background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          var(--shadow-glow-primary, 0 0 20px rgba(217, 70, 239, 0.4));
      }
      
      &.is-disabled {
        opacity: 0.5;
        box-shadow: none;
      }
    }
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    margin-top: $space-lg;
    
    .link {
      font-size: $font-size-sm;
      color: $color-primary;
      position: relative;
      
      [data-theme="dark"] & {
        color: var(--color-primary, #E879F9);
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -4rpx;
        left: 0;
        right: 0;
        height: 2rpx;
        background: currentColor;
        transform: scaleX(0);
        transition: transform $duration-fast $ease-out;
      }
      
      &:active::after {
        transform: scaleX(1);
      }
    }
  }
}

.other-login {
  margin-top: $space-xl;
  position: relative;
  z-index: 1;
  
  .quick-login-header {
    @include flex-column-center;
    margin-bottom: $space-lg;
    
    .quick-login-title {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-bottom: $space-xs;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
    
    .quick-login-tip {
      font-size: $font-size-xs;
      color: $color-text-placeholder;
      
      [data-theme="dark"] & {
        color: var(--color-text-placeholder, rgba(255, 255, 255, 0.3));
      }
    }
  }
  
  .login-icons {
    display: flex;
    justify-content: center;
    gap: 80rpx;
    
    .icon-item {
      @include flex-column-center;
      cursor: pointer;
      
      .icon-circle {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        @include flex-center;
        transition: all $duration-normal $ease-spring;
        
        &.wechat {
          background: linear-gradient(135deg, $color-wechat 0%, $color-wechat-dark 100%);
          box-shadow: 0 8rpx 24rpx rgba($color-wechat, 0.3);
          
          [data-theme="dark"] & {
            box-shadow: 0 8rpx 24rpx rgba($color-wechat, 0.4), 0 0 20px rgba($color-wechat, 0.2);
          }
        }
        
        &.alipay {
          background: linear-gradient(135deg, $color-alipay 0%, $color-alipay-dark 100%);
          box-shadow: 0 8rpx 24rpx rgba($color-alipay, 0.3);
          
          [data-theme="dark"] & {
            box-shadow: 0 8rpx 24rpx rgba($color-alipay, 0.4), 0 0 20px rgba($color-alipay, 0.2);
          }
        }
      }
      
      &:active .icon-circle {
        transform: scale(0.92);
      }
      
      text {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-sm;
        
        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
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
  background: linear-gradient(to top, $color-bg-page 0%, transparent 100%);
  
  [data-theme="dark"] & {
    background: linear-gradient(to top, $color-bg-page 0%, transparent 100%);
  }
  
  :deep(.ui-checkbox) {
    flex-shrink: 0;
  }
  
  .agreement-text {
    font-size: $font-size-xs;
    color: $color-text-sub;
    margin-left: $space-xs;
    line-height: 1.6;
    
    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
    
    .link {
      color: $color-primary;
      
      [data-theme="dark"] & {
        color: var(--color-primary, #E879F9);
      }
    }
  }
}
</style>
