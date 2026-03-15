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
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { tradeApi, type Address } from '@/api/trade';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

const isEdit = ref(false);
const addressId = ref('');
const loading = ref(false);

const tagOptions = computed(() => [
  { label: '家', value: 0 },
  { label: '公司', value: 1 },
  { label: '学校', value: 2 }
]);

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  region: '',
  detail: '',
  tag: '家',
  tagIndex: 0,
  isDefault: false
});

onLoad((options: any) => {
  if (options.id) {
    isEdit.value = true;
    addressId.value = options.id;
    fetchAddressDetail(options.id);
  }
});

const fetchAddressDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await tradeApi.getAddressDetail(id);
    form.value = {
      name: res.name,
      phone: res.phone,
      province: res.province,
      city: res.city,
      district: res.district,
      region: `${res.province} ${res.city} ${res.district}`,
      detail: res.detail,
      tag: res.tag || '家',
      tagIndex: tagOptions.value.findIndex(t => t.label === res.tag) || 0,
      isDefault: res.isDefault
    };
  } catch (error) {
    console.error('获取地址详情失败:', error);
    uni.showToast({ title: '获取地址失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      const address = res.address || '';
      const parts = address.split(/省|市|区|县/);
      if (parts.length >= 3) {
        form.value.province = parts[0] + '省';
        form.value.city = parts[1] + '市';
        form.value.district = parts[2] + '区';
      }
      form.value.region = res.name || address;
      if (res.name && !form.value.detail) {
        form.value.detail = res.name;
      }
    }
  });
};

const handleSave = async () => {
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
  
  try {
    const addressData = {
      name: form.value.name,
      phone: form.value.phone,
      province: form.value.province || form.value.region.split(' ')[0] || '',
      city: form.value.city || form.value.region.split(' ')[1] || '',
      district: form.value.district || form.value.region.split(' ')[2] || '',
      detail: form.value.detail,
      tag: tagOptions.value[form.value.tagIndex]?.label || '家',
      isDefault: form.value.isDefault
    };
    
    if (isEdit.value && addressId.value) {
      await tradeApi.updateAddress(addressId.value, addressData);
    } else {
      await tradeApi.createAddress(addressData);
    }
    
    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '保存失败，请重试', icon: 'none' });
  }
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
