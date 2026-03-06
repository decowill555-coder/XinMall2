<template>
  <view class="address-edit-page">
    <ui-sub-navbar :title="isEdit ? '编辑地址' : '新增地址'" />
    
    <scroll-view scroll-y class="edit-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="address-content">
        
        <view class="form-section">
          <ui-form-item label="收货人">
            <ui-input v-model="form.name" placeholder="请输入收货人姓名" />
          </ui-form-item>
          <ui-form-item label="手机号">
            <ui-input v-model="form.phone" type="tel" placeholder="请输入手机号" :maxlength="11" />
          </ui-form-item>
          <ui-form-item label="所在地区">
            <view class="form-select" @click="chooseLocation">
              <text :class="{ placeholder: !form.region }">{{ form.region || '请选择省市区' }}</text>
              <ui-icon name="chevron-right" :size="32" />
            </view>
          </ui-form-item>
          <ui-form-item label="详细地址">
            <ui-textarea v-model="form.detail" placeholder="请输入详细地址（街道、楼栋、门牌号）" :rows="3" />
          </ui-form-item>
          <ui-form-item label="地址标签">
            <ui-condition-picker 
              v-model="form.tagIndex" 
              :options="tagOptions"
            />
          </ui-form-item>
        </view>
        
        <view class="switch-section">
          <view class="switch-item">
            <text class="switch-label">设为默认地址</text>
            <ui-switch v-model="form.isDefault" />
          </view>
        </view>
      </view>
    </scroll-view>
    
    <ui-bottom-bar>
      <ui-button type="primary" block @click="handleSave">保存</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const isEdit = ref(false);

const tagOptions = computed(() => [
  { label: '家', value: 0 },
  { label: '公司', value: 1 },
  { label: '学校', value: 2 }
]);

const form = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  tagIndex: 0,
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
  overflow: hidden;
}

.address-content {
  padding: $space-md;
}

.form-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  padding: $space-md;
  
  .form-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 $space-md;
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
    border-radius: $radius-md;
    
    text {
      font-size: $font-size-md;
      color: $color-text-main;
      
      &.placeholder { color: $color-text-placeholder; }
    }
  }
}

.switch-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
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
</style>
