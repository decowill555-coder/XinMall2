<template>
  <view class="shop-auth-page">
    <ui-sub-navbar title="店铺认证" />
    
    <scroll-view scroll-y class="auth-scroll" :style="{ height: scrollHeight + 'px' }">
      <!-- 审核中状态 -->
      <view v-if="authStatus === 'pending'" class="status-section">
        <ui-icon name="clock" :size="80" color="warning" />
        <text class="status-title">认证审核中</text>
        <text class="status-desc">您的店铺认证申请正在审核中，请耐心等待</text>
        <ui-button type="primary" size="md" @click="smartBack">返回</ui-button>
      </view>

      <!-- 审核通过状态 -->
      <view v-else-if="authStatus === 'approved'" class="status-section">
        <ui-icon name="check-circle" :size="80" color="success" />
        <text class="status-title">认证已通过</text>
        <text class="status-desc">恭喜您，店铺认证已通过审核！</text>
        <ui-button type="primary" size="md" @click="goToShop">进入我的店铺</ui-button>
      </view>

      <!-- 审核拒绝状态 -->
      <view v-else-if="authStatus === 'rejected'" class="status-section rejected">
        <ui-icon name="x-circle" :size="80" color="danger" />
        <text class="status-title">认证未通过</text>
        <text class="status-desc">拒绝原因：{{ rejectReason || '资料不符合要求' }}</text>
        <ui-button type="primary" size="md" @click="authStatus = null">重新提交</ui-button>
      </view>

      <!-- 表单区域 -->
      <template v-else>
        <view class="auth-tips">
          <ui-icon name="store" :size="40" color="success" />
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
            <ui-icon name="arrow-right" ::size="32" />
          </view>
        </view>
      </view>
      
      <view class="upload-section">
        <text class="section-title">营业执照</text>
        <view class="upload-item" @click="uploadLicense">
          <view v-if="!form.licenseImage" class="upload-placeholder">
            <ui-icon name="camera" ::size="40" />
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
      </template>
    </scroll-view>
    
    <view v-if="authStatus === null" class="auth-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
        提交认证
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { shopAuthApi, type ShopAuthStatus } from '@/api/shop-auth';
import { uploadApi } from '@/api/upload';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

const agreed = ref(false);
const showCategoryPicker = ref(false);
const loading = ref(false);
const authStatus = ref<ShopAuthStatus | null>(null);
const rejectReason = ref('');

const form = ref({
  shopName: '',
  shopDesc: '',
  category: '',
  licenseImage: '',
  legalPerson: '',
  phone: '',
  address: ''
});

// 检查认证状态
const checkAuthStatus = async () => {
  try {
    const res = await shopAuthApi.getAuthStatus();
    if (res) {
      authStatus.value = res.status;
      rejectReason.value = res.rejectReason || '';
      // 如果已提交过，填充表单
      if (res.status === 'pending' || res.status === 'rejected') {
        form.value = {
          shopName: res.shopName,
          shopDesc: res.shopDesc || '',
          category: res.category,
          licenseImage: res.licenseImage,
          legalPerson: res.legalPerson,
          phone: res.phone,
          address: res.address
        };
      }
    }
  } catch (error) {
    console.error('获取认证状态失败', error);
  }
};

onMounted(() => {
  checkAuthStatus();
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
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uni.showLoading({ title: '上传中...' });
      try {
        const uploadRes = await uploadApi.uploadImage(tempFilePath, 'other');
        form.value.licenseImage = uploadRes.fileUrl;
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  });
};

const goAgreement = () => {
  uni.showToast({ title: '店铺认证服务协议', icon: 'none' });
};

const goToShop = () => {
  uni.navigateTo({ url: '/pages-sub/seller/shop/index' });
};

const handleSubmit = async () => {
  if (!canSubmit.value || loading.value) return;

  try {
    loading.value = true;
    uni.showLoading({ title: '提交中...' });

    await shopAuthApi.submitAuth({
      shopName: form.value.shopName,
      shopDesc: form.value.shopDesc,
      category: form.value.category,
      licenseImage: form.value.licenseImage,
      legalPerson: form.value.legalPerson,
      phone: form.value.phone,
      address: form.value.address
    });

    uni.hideLoading();
    uni.showToast({ title: '提交成功，请等待审核', icon: 'success' });

    // 更新状态
    authStatus.value = 'pending';

    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error: any) {
    uni.hideLoading();
    uni.showToast({ title: error.message || '提交失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.shop-auth-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.auth-scroll {
  overflow: hidden;
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

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-xl $space-md;
  text-align: center;

  .status-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-top: $space-lg;
  }

  .status-desc {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-sm;
    margin-bottom: $space-lg;
  }

  &.rejected {
    .status-desc {
      color: $color-danger;
    }
  }
}
</style>
