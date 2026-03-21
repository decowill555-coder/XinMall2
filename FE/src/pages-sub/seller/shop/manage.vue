<template>
  <view class="shop-manage-page">
    <ui-sub-navbar title="店铺管理" />
    
    <scroll-view scroll-y class="manage-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="shop-card">
        <ui-avatar :src="formData.avatar" :size="100" />
        <view class="shop-info">
          <text class="shop-name">{{ shopInfo?.name }}</text>
          <text class="shop-id">店铺ID: {{ shopInfo?.id }}</text>
        </view>
        <ui-button size="sm" @click="editLogo">修改头像</ui-button>
      </view>

      <view class="form-section">
        <view class="form-item">
          <text class="form-label">店铺名称</text>
          <input class="form-input" v-model="formData.name" placeholder="请输入店铺名称" />
        </view>
        <view class="form-item">
          <text class="form-label">店铺简介</text>
          <textarea class="form-textarea" v-model="formData.description" placeholder="请输入店铺简介" :maxlength="200" />
        </view>
        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input class="form-input" v-model="formData.phone" placeholder="请输入联系电话" type="tel" />
        </view>
        <view class="form-item">
          <text class="form-label">微信号</text>
          <input class="form-input" v-model="formData.wechat" placeholder="请输入微信号" />
        </view>
        <view class="form-item">
          <text class="form-label">经营类目</text>
          <view class="form-select" @click="showCategory = true">
            <text :class="{ placeholder: !formData.category }">{{ formData.category || '请选择类目' }}</text>
            <ui-icon name="arrow-right" ::size="32" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">发货地址</text>
          <input class="form-input" v-model="formData.address" placeholder="请输入发货地址" />
        </view>
      </view>

      <view class="switch-section">
        <view class="switch-item">
          <text class="switch-label">店铺营业</text>
          <ui-switch v-model="formData.isOpen" />
        </view>
        <view class="switch-item">
          <text class="switch-label">自动接单</text>
          <ui-switch v-model="formData.autoAccept" />
        </view>
      </view>
    </scroll-view>
    
    <view class="manage-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="primary" block @click="handleSave">保存修改</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useShopStore } from '@/stores/shop';
import { storeToRefs } from 'pinia';
import { uploadApi } from '@/api/upload';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const shopStore = useShopStore();
const { shopInfo, loading } = storeToRefs(shopStore);

const showCategory = ref(false);

// 本地表单数据
const formData = ref({
  name: '',
  description: '',
  phone: '',
  wechat: '',
  category: '',
  address: '',
  isOpen: true,
  autoAccept: false,
  avatar: ''
});

// 初始化表单数据
const initFormData = () => {
  if (shopInfo.value) {
    formData.value = {
      name: shopInfo.value.name || '',
      description: shopInfo.value.description || '',
      phone: shopInfo.value.phone || '',
      wechat: shopInfo.value.wechat || '',
      category: shopInfo.value.category || '',
      address: shopInfo.value.address || '',
      isOpen: shopInfo.value.isOpen ?? true,
      autoAccept: shopInfo.value.autoAccept ?? false,
      avatar: shopInfo.value.avatar || ''
    };
  }
};

onMounted(async () => {
  if (!shopInfo.value) {
    await shopStore.fetchMyShop();
  }
  initFormData();
});

const editLogo = () => {
  uni.chooseImage({
    count: 1,
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uni.showLoading({ title: '上传中...' });
      try {
        const url = await uploadApi.uploadImage(tempFilePath);
        formData.value.avatar = url;
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  });
};

const handleSave = async () => {
  if (!formData.value.name) {
    uni.showToast({ title: '请输入店铺名称', icon: 'none' });
    return;
  }

  try {
    uni.showLoading({ title: '保存中...' });
    await shopStore.updateShop(shopInfo.value!.id, {
      name: formData.value.name,
      description: formData.value.description,
      phone: formData.value.phone,
      wechat: formData.value.wechat,
      category: formData.value.category,
      address: formData.value.address,
      isOpen: formData.value.isOpen,
      autoAccept: formData.value.autoAccept,
      avatar: formData.value.avatar
    });
    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });
    uni.navigateBack();
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '保存失败', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.shop-manage-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.manage-scroll {
  padding:0px;
  overflow: hidden;
}

.shop-card {
  display: flex;
  align-items: center;
  padding: $space-md;
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .shop-info {
    flex: 1;
    margin-left: $space-md;
    
    .shop-name {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
    
    .shop-id {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
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
      margin-bottom: $space-xs;
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
      height: 160rpx;
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

.switch-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: 0 $space-md;
  
  .switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    border-bottom: 1rpx solid $color-divider;
    
    &:last-child { border-bottom: none; }
    
    .switch-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
}

.manage-footer {
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
