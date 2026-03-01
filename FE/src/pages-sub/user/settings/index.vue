<template>
  <view class="settings-page">
    <ui-navbar title="设置" :back="true" />
    
    <scroll-view scroll-y class="settings-scroll">
      <view class="settings-group">
        <ui-cell title="账号与安全" icon="shield" is-link @click="goAccount" />
        <ui-cell title="隐私设置" icon="lock" is-link @click="goPrivacy" />
        <ui-cell title="通知设置" icon="bell" is-link @click="goNotification" />
      </view>
      
      <view class="settings-group">
        <ui-cell title="通用设置" icon="settings" is-link @click="goGeneral" />
        <ui-cell title="语言" icon="globe" value="简体中文" is-link @click="goLanguage" />
        <ui-cell title="字体大小" icon="type" value="标准" is-link @click="goFontSize" />
      </view>
      
      <view class="settings-group">
        <ui-cell title="清除缓存" icon="trash" value="12.5MB" @click="clearCache" />
        <ui-cell title="关于我们" icon="info-circle" is-link @click="goAbout" />
        <ui-cell title="用户协议" icon="file-text" is-link @click="goAgreement" />
        <ui-cell title="隐私政策" icon="file-text" is-link @click="goPrivacyPolicy" />
      </view>
      
      <view class="settings-group">
        <ui-cell title="检查更新" icon="refresh" value="v1.0.0" @click="checkUpdate" />
        <ui-cell title="帮助与反馈" icon="help-circle" is-link @click="goHelp" />
      </view>
      
      <view class="logout-section">
        <ui-button type="danger" plain block @click="handleLogout">退出登录</ui-button>
      </view>
      
      <view class="version-info">
        <text>当前版本 v1.0.0</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
const goAccount = () => uni.showToast({ title: '账号与安全', icon: 'none' });
const goPrivacy = () => uni.showToast({ title: '隐私设置', icon: 'none' });
const goNotification = () => uni.showToast({ title: '通知设置', icon: 'none' });
const goGeneral = () => uni.showToast({ title: '通用设置', icon: 'none' });
const goLanguage = () => uni.showToast({ title: '语言设置', icon: 'none' });
const goFontSize = () => uni.showToast({ title: '字体大小', icon: 'none' });
const goAbout = () => uni.showToast({ title: '关于我们', icon: 'none' });
const goAgreement = () => uni.showToast({ title: '用户协议', icon: 'none' });
const goPrivacyPolicy = () => uni.showToast({ title: '隐私政策', icon: 'none' });
const goHelp = () => uni.showToast({ title: '帮助与反馈', icon: 'none' });

const clearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({ title: '清除中...' });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: '清除成功', icon: 'success' });
        }, 1000);
      }
    }
  });
};

const checkUpdate = () => {
  uni.showLoading({ title: '检查中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '已是最新版本', icon: 'success' });
  }, 1000);
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录', icon: 'success' });
        setTimeout(() => {
          uni.redirectTo({ url: '/pages-sub/user/login/index' });
        }, 1500);
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.settings-scroll {
  height: calc(100vh - 88rpx);
  padding: $space-sm $space-md;
}

.settings-group {
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  overflow: hidden;
}

.logout-section {
  margin-top: $space-xl;
  padding: 0 $space-md;
}

.version-info {
  text-align: center;
  padding: $space-xl;
  font-size: $font-size-xs;
  color: $color-text-disabled;
}
</style>
