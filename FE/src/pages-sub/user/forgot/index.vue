<template>
  <view class="forgot-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
    </view>
    
    <view class="forgot-header">
      <view class="logo-wrapper">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <view class="logo-glow"></view>
      </view>
      <text class="page-title">找回密码</text>
      <text class="page-desc">请输入手机号验证身份后重置密码</text>
    </view>
    
    <view class="forgot-form">
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
        
        <view class="form-item" :class="{ 'is-focused': focusedField === 'code' }">
          <view class="input-icon">
            <ui-icon name="shield" :size="40" />
          </view>
          <input 
            type="number" 
            v-model="code" 
            placeholder="请输入验证码" 
            maxlength="6"
            class="code-input"
            @focus="focusedField = 'code'"
            @blur="focusedField = ''"
          />
          <view 
            class="code-btn" 
            :class="{ 'is-disabled': !canSendCode || countdown > 0 }"
            @click="sendCode"
          >
            <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
          </view>
        </view>
        
        <view class="form-item" :class="{ 'is-focused': focusedField === 'password' }">
          <view class="input-icon">
            <ui-icon name="lock" :size="40" />
          </view>
          <input 
            :password="!showPassword" 
            v-model="password" 
            placeholder="请设置新密码（6-20位）"
            maxlength="20"
            @focus="focusedField = 'password'"
            @blur="focusedField = ''"
          />
          <view class="input-action" @click="showPassword = !showPassword">
            <ui-icon :name="showPassword ? 'eye' : 'eye-off'" :size="40" />
          </view>
        </view>
        
        <view class="form-item" :class="{ 'is-focused': focusedField === 'confirmPassword' }">
          <view class="input-icon">
            <ui-icon name="lock" :size="40" />
          </view>
          <input 
            :password="!showConfirmPassword" 
            v-model="confirmPassword" 
            placeholder="请确认新密码"
            maxlength="20"
            @focus="focusedField = 'confirmPassword'"
            @blur="focusedField = ''"
          />
          <view class="input-action" @click="showConfirmPassword = !showConfirmPassword">
            <ui-icon :name="showConfirmPassword ? 'eye' : 'eye-off'" :size="40" />
          </view>
        </view>
        
        <view class="submit-btn-wrapper">
          <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
            确认重置
          </ui-button>
        </view>
        
        <view class="form-footer">
          <text class="footer-text">想起密码了？</text>
          <text class="link" @click="goLogin">返回登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const phone = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const focusedField = ref('');
const countdown = ref(0);

const canSendCode = computed(() => phone.value.length === 11);

const canSubmit = computed(() => 
  phone.value.length === 11 && 
  code.value.length >= 4 && 
  password.value.length >= 6 && 
  password.value === confirmPassword.value
);

const sendCode = () => {
  if (!canSendCode.value || countdown.value > 0) return;
  
  uni.showToast({ title: '验证码已发送', icon: 'success' });
  countdown.value = 60;
  
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSubmit = async () => {
  if (!canSubmit.value) return;
  
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '提交中...' });
  
  try {
    uni.hideLoading();
    uni.showToast({ title: '密码重置成功', icon: 'success' });
    
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '重置失败', icon: 'none' });
  }
};

const goLogin = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.forgot-page {
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

.forgot-header {
  @include flex-column-center;
  padding-top: 80rpx;
  position: relative;
  z-index: 1;
  
  .logo-wrapper {
    position: relative;
    @include flex-center;
    
    .logo {
      width: 100rpx;
      height: 100rpx;
      position: relative;
      z-index: 2;
    }
    
    .logo-glow {
      position: absolute;
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($color-primary, 0.3) 0%, transparent 70%);
      animation: logo-glow 3s ease-in-out infinite;
      
      [data-theme="dark"] & {
        background: radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%);
      }
    }
  }
  
  .page-title {
    font-size: 44rpx;
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
  
  .page-desc {
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

.forgot-form {
  margin-top: $space-lg;
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
    
    .code-input {
      flex: 1;
    }
    
    .code-btn {
      padding: $space-xs $space-md;
      background: $gradient-primary;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      color: $color-white;
      white-space: nowrap;
      transition: all $duration-fast $ease-spring;
      
      [data-theme="dark"] & {
        background: var(--gradient-primary, linear-gradient(135deg, #C026D3 0%, #F43F5E 100%));
      }
      
      &.is-disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      
      &:active:not(.is-disabled) {
        transform: scale(0.96);
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
  
  .submit-btn-wrapper {
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
    justify-content: center;
    align-items: center;
    margin-top: $space-lg;
    
    .footer-text {
      font-size: $font-size-sm;
      color: $color-text-sub;
      
      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
    
    .link {
      font-size: $font-size-sm;
      color: $color-primary;
      margin-left: $space-xs;
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
</style>
