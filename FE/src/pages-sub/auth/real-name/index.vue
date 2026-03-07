<template>
  <view class="real-name-page">
    <ui-sub-navbar title="实名认证" />
    
    <scroll-view scroll-y class="auth-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="auth-content">
        <view class="auth-tips">
          <ui-icon name="shield" :size="40" color="#1ABC9C" />
          <text class="tips-text">实名认证后可发布商品、提现等功能</text>
        </view>
        
        <view class="form-section">
          <ui-form-item label="真实姓名">
            <ui-input v-model="form.realName" placeholder="请输入身份证上的姓名" />
          </ui-form-item>
          <ui-form-item label="身份证号">
            <ui-input v-model="form.idCard" placeholder="请输入身份证号码" :maxlength="18" />
          </ui-form-item>
        </view>
        
        <view class="upload-section">
          <text class="section-title">身份证照片</text>
          <view class="upload-list">
            <ui-id-card-uploader 
              v-model="form.frontImage"
              type="front"
              placeholder="上传身份证人像面"
              @upload="uploadImage('front')"
            />
            <ui-id-card-uploader 
              v-model="form.backImage"
              type="back"
              placeholder="上传身份证国徽面"
              @upload="uploadImage('back')"
            />
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
    
    <ui-bottom-bar>
      <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
        提交认证
      </ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

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
      smartBack();
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
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .tips-text {
    font-size: $font-size-sm;
    color: var(--color-primary, #FF6A00);
    margin-left: $space-sm;
  }
}

.form-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
}

.upload-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
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
      color: var(--color-primary, #FF6A00);
    }
  }
}
</style>
