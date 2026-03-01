<template>
  <view class="address-edit-page">
    <ui-navbar :title="isEdit ? '编辑地址' : '新增地址'" :back="true" />
    
    <scroll-view scroll-y class="edit-scroll">
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">收货人</text>
          <input class="form-input" v-model="form.name" placeholder="请输入收货人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input class="form-input" type="tel" v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </view>
        <view class="form-item" @click="chooseLocation">
          <text class="form-label">所在地区</text>
          <view class="form-select">
            <text :class="{ placeholder: !form.region }">{{ form.region || '请选择省市区' }}</text>
            <ui-icon name="arrow-right" :size="16" />
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">详细地址</text>
          <textarea class="form-textarea" v-model="form.detail" placeholder="请输入详细地址（街道、楼栋、门牌号）" />
        </view>
        <view class="form-item">
          <text class="form-label">地址标签</text>
          <view class="tag-list">
            <view 
              v-for="tag in tagList" 
              :key="tag"
              class="tag-item"
              :class="{ active: form.tag === tag }"
              @click="form.tag = tag"
            >
              {{ tag }}
            </view>
          </view>
        </view>
      </view>
      
      <view class="switch-section">
        <view class="switch-item">
          <text class="switch-label">设为默认地址</text>
          <ui-switch v-model="form.isDefault" />
        </view>
      </view>
    </scroll-view>
    
    <view class="edit-footer">
      <ui-button type="primary" block @click="handleSave">保存</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const isEdit = ref(false);
const tagList = ref(['家', '公司', '学校']);

const form = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  tag: '',
  isDefault: false
});

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      form.value.region = res.name || '';
    }
  });
};

const handleSave = () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
    return;
  }
  if (!form.value.phone || form.value.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!form.value.region) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' });
    return;
  }
  if (!form.value.detail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '保存中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.address-edit-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.edit-scroll {
  height: calc(100vh - 88rpx - 120rpx);
  padding: $space-sm $space-md;
}

.form-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  
  .form-item {
    margin-bottom: $space-lg;
    
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
    
    .tag-list {
      display: flex;
      gap: $space-sm;
      
      .tag-item {
        padding: $space-sm $space-md;
        background: $color-bg-gray;
        border-radius: $radius-sm;
        font-size: $font-size-sm;
        color: $color-text-sub;
        
        &.active {
          color: $color-primary;
          background: rgba($color-primary, 0.1);
        }
      }
    }
  }
}

.switch-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: 0 $space-md;
  margin-top: $space-sm;
  
  .switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    
    .switch-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
}

.edit-footer {
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
