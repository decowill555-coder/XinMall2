<template>
  <view class="shop-auth-page">
    <ui-navbar title="店铺认证" :back="true" />
    
    <scroll-view scroll-y class="auth-scroll">
      <view class="auth-tips">
        <ui-icon name="store" :size="24" color="#1ABC9C" />
        <text class="tips-text">店铺认证后可开通店铺、发布商品等功能</text>
      </view>
      
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">店铺名称</text>
          <input class="form-input" v-model="form.shopName" placeholder="请输入店铺名称" maxlength="20" />
        </view>
        <view class="form-item">
          <text class="form-label">店铺简介</text>
          <textarea class="form-textarea" v-model="form.shopDesc" placeholder="请输入店铺简介" maxlength="200" />
        </view>
        <view class="form-item">
          <text class="form-label">经营类目</text>
          <view class="form-select" @click="showCategoryPicker = true">
            <text :class="{ placeholder: !form.category }">{{ form.category || '请选择经营类目' }}</text>
            <ui-icon name="arrow-right" :size="16" />
          </view>
        </view>
      </view>
      
      <view class="upload-section">
        <text class="section-title">营业执照</text>
        <view class="upload-item" @click="uploadLicense">
          <view v-if="!form.licenseImage" class="upload-placeholder">
            <ui-icon name="camera" :size="32" />
            <text>上传营业执照</text>
          </view>
          <ui-image v-else :src="form.licenseImage" width="100%" height="100%" radius="8rpx" />
        </view>
        <text class="upload-tips">请确保营业执照清晰、完整、在有效期内</text>
      </view>
      
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">法人姓名</text>
          <input class="form-input" v-model="form.legalPerson" placeholder="请输入法人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input class="form-input" type="tel" v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
        </view>
        <view class="form-item">
          <text class="form-label">经营地址</text>
          <input class="form-input" v-model="form.address" placeholder="请输入经营地址" />
        </view>
      </view>
      
      <view class="agreement-section">
        <ui-checkbox v-model="agreed" />
        <text class="agreement-text">
          我已阅读并同意
          <text class="link" @click="goAgreement">《店铺认证服务协议》</text>
        </text>
      </view>
    </scroll-view>
    
    <view class="auth-footer">
      <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
        提交认证
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const agreed = ref(false);
const showCategoryPicker = ref(false);

const form = ref({
  shopName: '',
  shopDesc: '',
  category: '',
  licenseImage: '',
  legalPerson: '',
  phone: '',
  address: ''
});

const canSubmit = computed(() => {
  return form.value.shopName && 
         form.value.category && 
         form.value.licenseImage && 
         form.value.legalPerson && 
         form.value.phone && 
         form.value.address && 
         agreed.value;
});

const uploadLicense = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      form.value.licenseImage = res.tempFilePaths[0];
    }
  });
};

const goAgreement = () => {
  uni.showToast({ title: '店铺认证服务协议', icon: 'none' });
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
.shop-auth-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.auth-scroll {
  height: calc(100vh - 88rpx - 120rpx);
  padding: $space-sm $space-md;
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
    
    .form-textarea {
      width: 100%;
      height: 120rpx;
      padding: $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: $color-text-main;
      box-sizing: border-box;
    }
    
    .form-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding: 0 $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      
      .placeholder { color: $color-text-placeholder; }
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
  
  .upload-item {
    width: 100%;
    height: 300rpx;
    background: $color-bg-gray;
    border-radius: $radius-md;
    overflow: hidden;
    
    .upload-placeholder {
      @include flex-column-center;
      height: 100%;
      
      text {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-top: $space-sm;
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
