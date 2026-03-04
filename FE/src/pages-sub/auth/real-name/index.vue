<template>
  <view class="real-name-page">
    <ui-sub-navbar title="实名认证" />
    
    <scroll-view scroll-y class="auth-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="auth-content">
        <view class="auth-tips">
          <ui-icon name="shield" ::size="40" color="#1ABC9C" />
          <text class="tips-text">实名认证后可发布商品、提现等功能</text>
        </view>
        
        <view class="form-section">
          <view class="form-item">
            <text class="form-label">真实姓名</text>
            <input class="form-input" v-model="form.realName" placeholder="请输入身份证上的姓名" />
          </view>
          <view class="form-item">
            <text class="form-label">身份证号</text>
            <input class="form-input" v-model="form.idCard" placeholder="请输入身份证号码" maxlength="18" />
          </view>
        </view>
        
        <view class="upload-section">
          <text class="section-title">身份证照片</text>
          <view class="upload-list">
            <view class="upload-item" @click="uploadImage('front')">
              <view v-if="!form.frontImage" class="upload-placeholder">
                <ui-icon name="camera" ::size="40" />
                <text>上传身份证人像面</text>
              </view>
              <ui-image v-else :src="form.frontImage" width="100%" height="100%" radius="8rpx" />
            </view>
            <view class="upload-item" @click="uploadImage('back')">
              <view v-if="!form.backImage" class="upload-placeholder">
                <ui-icon name="camera" ::size="40" />
                <text>上传身份证国徽面</text>
              </view>
              <ui-image v-else :src="form.backImage" width="100%" height="100%" radius="8rpx" />
            </view>
          </view>
          <text class="upload-tips">请确保证照片清晰、完整、无遮挡</text>
        </view>
        
        <view class="agreement-section">
          <ui-checkbox v-model="agreed" />
          <text class="agreement-text">
            我已阅读并同意
            <text class="link" @click="goAgreement">《实名认证服务协议》</text>
          </text>
        </view>
      </view>
    </scroll-view>
    
    <view class="auth-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
        提交认证
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const agreed = ref(false);

const form = ref({
  realName: '',
  idCard: '',
  frontImage: '',
  backImage: ''
});

const canSubmit = computed(() => {
  return form.value.realName && 
         form.value.idCard && 
         form.value.frontImage && 
         form.value.backImage && 
         agreed.value;
});

const uploadImage = (type: 'front' | 'back') => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      if (type === 'front') {
        form.value.frontImage = res.tempFilePaths[0];
      } else {
        form.value.backImage = res.tempFilePaths[0];
      }
    }
  });
};

const goAgreement = () => {
  uni.showToast({ title: '实名认证服务协议', icon: 'none' });
};

const handleSubmit = () => {
  if (!canSubmit.value) return;
  
  uni.showLoading({ title: '提交中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '提交成功，请等待审核', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1500);
};
</script>

<style lang="scss" scoped>
.real-name-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.auth-scroll {
  overflow: hidden;
}

.auth-content {
  padding: $space-md;
}

.auth-tips {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: rgba($color-primary, 0.1);
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .tips-text {
    font-size: $font-size-sm;
    color: $color-primary;
    margin-left: $space-sm;
  }
}

.form-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .form-item {
    margin-bottom: $space-md;
    
    &:last-child { margin-bottom: 0; }
    
    .form-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-bottom: $space-sm;
    }
    
    .form-input {
      width: 100%;
      height: 80rpx;
      padding: 0 $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: $color-text-main;
      box-sizing: border-box;
    }
  }
}

.upload-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .upload-list {
    display: flex;
    gap: $space-md;
    
    .upload-item {
      flex: 1;
      aspect-ratio: 1.6;
      background: $color-bg-gray;
      border-radius: $radius-md;
      overflow: hidden;
      
      .upload-placeholder {
        @include flex-column-center;
        height: 100%;
        
        text {
          font-size: $font-size-xs;
          color: $color-text-sub;
          margin-top: $space-sm;
        }
      }
    }
  }
  
  .upload-tips {
    font-size: $font-size-xs;
    color: $color-text-disabled;
    margin-top: $space-sm;
  }
}

.agreement-section {
  display: flex;
  align-items: flex-start;
  padding: $space-md 0;
  
  .agreement-text {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-left: $space-xs;
    line-height: 1.5;
    
    .link {
      color: $color-primary;
    }
  }
}

.auth-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
