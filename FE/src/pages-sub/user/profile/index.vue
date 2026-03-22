<template>
  <view class="profile-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <view class="profile-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-content">
        <view class="header-left" @click="goBack">
          <ui-icon name="arrow-left" :size="44" />
        </view>
        <text class="header-title">个人资料</text>
        <view class="header-right"></view>
      </view>
    </view>
    
    <scroll-view scroll-y class="content-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="scroll-content">
        <view class="avatar-section">
          <view class="avatar-wrapper" @click="changeAvatar">
            <ui-avatar :src="userInfo.avatar" :size="160" :bordered="true" />
            <view class="avatar-edit">
              <ui-icon name="camera" :size="32" color="white" />
            </view>
          </view>
          <text class="avatar-tip">点击更换头像</text>
        </view>
        
        <view class="form-section">
          <ui-card :glass="true" :shadow="true" radius="lg" padding="none" class="form-card">
            <view class="form-item" @click="editField('nickname')">
              <view class="form-label">
                <ui-icon name="user" :size="40" />
                <text class="label-text">昵称</text>
              </view>
              <view class="form-value">
                <text class="value-text">{{ userInfo.nickname || '未设置' }}</text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="editField('signature')">
              <view class="form-label">
                <ui-icon name="edit" :size="40" />
                <text class="label-text">个性签名</text>
              </view>
              <view class="form-value">
                <text class="value-text signature">{{ userInfo.signature || '未设置' }}</text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="editField('gender')">
              <view class="form-label">
                <ui-icon name="users" :size="40" />
                <text class="label-text">性别</text>
              </view>
              <view class="form-value">
                <text class="value-text">{{ genderText }}</text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="editField('birthday')">
              <view class="form-label">
                <ui-icon name="calendar" :size="40" />
                <text class="label-text">生日</text>
              </view>
              <view class="form-value">
                <text class="value-text">{{ userInfo.birthday || '未设置' }}</text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="editField('location')">
              <view class="form-label">
                <ui-icon name="map-pin" :size="40" />
                <text class="label-text">所在地</text>
              </view>
              <view class="form-value">
                <text class="value-text">{{ userInfo.location || '未设置' }}</text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
          </ui-card>
        </view>
        
        <view class="account-section">
          <text class="section-title">账号信息</text>
          <ui-card :glass="true" :shadow="true" radius="lg" padding="none" class="form-card">
            <view class="form-item">
              <view class="form-label">
                <ui-icon name="phone" :size="40" />
                <text class="label-text">手机号</text>
              </view>
              <view class="form-value">
                <text class="value-text">{{ formatPhone(userInfo.phone) }}</text>
              </view>
            </view>
            
            <view class="form-item" @click="goAuth">
              <view class="form-label">
                <ui-icon name="shield" :size="40" />
                <text class="label-text">实名认证</text>
              </view>
              <view class="form-value">
                <text class="value-text" :class="{ 'verified': userInfo.isVerified }">
                  {{ userInfo.isVerified ? '已认证' : '未认证' }}
                </text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="goShopAuth">
              <view class="form-label">
                <ui-icon name="store" :size="40" />
                <text class="label-text">店铺认证</text>
              </view>
              <view class="form-value">
                <text class="value-text" :class="{ 'verified': userInfo.isShopVerified }">
                  {{ userInfo.isShopVerified ? '已认证' : '未认证' }}
                </text>
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
          </ui-card>
        </view>
        
        <view class="other-section">
          <text class="section-title">其他</text>
          <ui-card :glass="true" :shadow="true" radius="lg" padding="none" class="form-card">
            <view class="form-item" @click="goQRCode">
              <view class="form-label">
                <ui-icon name="qr-code" :size="40" />
                <text class="label-text">我的二维码</text>
              </view>
              <view class="form-value">
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
            
            <view class="form-item" @click="goShare">
              <view class="form-label">
                <ui-icon name="share" :size="40" />
                <text class="label-text">分享主页</text>
              </view>
              <view class="form-value">
                <ui-icon name="arrow-right" :size="36" color="sub" />
              </view>
            </view>
          </ui-card>
        </view>
        
        <view class="bottom-space"></view>
      </view>
    </scroll-view>
    
    <ui-popup v-model:show="showEditPopup" position="bottom" :round="true">
      <view class="edit-popup">
        <view class="popup-header">
          <text class="popup-title">{{ editTitle }}</text>
          <view class="popup-close" @click="showEditPopup = false">
            <ui-icon name="close" :size="40" />
          </view>
        </view>
        
        <view class="popup-content">
          <view v-if="editFieldKey === 'gender'" class="gender-options">
            <view 
              class="gender-option" 
              :class="{ 'is-selected': tempGender === 1 }"
              @click="tempGender = 1"
            >
              <ui-icon name="user" :size="48" :color="tempGender === 1 ? 'primary' : 'sub'" />
              <text>男</text>
            </view>
            <view 
              class="gender-option" 
              :class="{ 'is-selected': tempGender === 2 }"
              @click="tempGender = 2"
            >
              <ui-icon name="user" :size="48" :color="tempGender === 2 ? 'primary' : 'sub'" />
              <text>女</text>
            </view>
            <view 
              class="gender-option" 
              :class="{ 'is-selected': tempGender === 0 }"
              @click="tempGender = 0"
            >
              <ui-icon name="help-circle" :size="48" :color="tempGender === 0 ? 'primary' : 'sub'" />
              <text>保密</text>
            </view>
          </view>
          
          <view v-else-if="editFieldKey === 'birthday'" class="birthday-picker">
            <picker-view 
              :value="pickerValue" 
              @change="onPickerChange"
              class="date-picker"
            >
              <picker-view-column>
                <view v-for="year in years" :key="year" class="picker-item">{{ year }}年</view>
              </picker-view-column>
              <picker-view-column>
                <view v-for="month in months" :key="month" class="picker-item">{{ month }}月</view>
              </picker-view-column>
              <picker-view-column>
                <view v-for="day in days" :key="day" class="picker-item">{{ day }}日</view>
              </picker-view-column>
            </picker-view>
          </view>
          
          <view v-else class="input-wrapper">
            <textarea 
              v-if="editFieldKey === 'signature'"
              v-model="tempValue"
              class="edit-textarea"
              :placeholder="editPlaceholder"
              :maxlength="100"
            />
            <input 
              v-else
              v-model="tempValue"
              class="edit-input"
              :placeholder="editPlaceholder"
              :maxlength="editFieldKey === 'nickname' ? 20 : 50"
            />
            <text v-if="editFieldKey === 'signature'" class="char-count">{{ tempValue.length }}/100</text>
          </view>
        </view>
        
        <view class="popup-footer">
          <ui-button type="primary" block @click="saveEdit">保存</ui-button>
        </view>
      </view>
    </ui-popup>
    
    <ui-action-sheet 
      :show="showAvatarActions" 
      :actions="avatarActions"
      @update:show="showAvatarActions = $event"
      @select="onAvatarActionSelect" 
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore, useAuthStore } from '@/stores';
import { authApi } from '@/api/auth';
import { uploadApi } from '@/api/upload';
import { logError } from '@/utils/logger';

const userStore = useUserStore();
const authStore = useAuthStore();

const safeAreaTop = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.safeAreaInsets?.top || 44;
});

const scrollHeight = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.windowHeight - safeAreaTop.value - 56;
});

const userInfo = computed(() => ({
  avatar: userStore.userInfo?.avatar || 'https://picsum.photos/200/200?random=100',
  nickname: userStore.userInfo?.nickname || '',
  signature: userStore.userInfo?.signature || '',
  gender: userStore.userInfo?.gender || 0,
  birthday: userStore.userInfo?.birthday || '',
  location: userStore.userInfo?.location || '',
  phone: userStore.userInfo?.phone || '138****8888',
  isVerified: userStore.userInfo?.isVerified || false,
  isShopVerified: userStore.userInfo?.isShopVerified || false
}));

const genderText = computed(() => {
  const gender = userInfo.value.gender;
  if (gender === 1) return '男';
  if (gender === 2) return '女';
  return '保密';
});

const showEditPopup = ref(false);
const editFieldKey = ref('');
const editTitle = ref('');
const editPlaceholder = ref('');
const tempValue = ref('');
const tempGender = ref(0);

const showAvatarActions = ref(false);
const avatarActions = ref([
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'album' }
]);

const pickerValue = ref([0, 0, 0]);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = computed(() => {
  const year = years[pickerValue.value[0]];
  const month = pickerValue.value[1] + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
});

const formatPhone = (phone: string) => {
  if (!phone) return '未绑定';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

const goBack = () => {
  uni.navigateBack();
};

const changeAvatar = () => {
  showAvatarActions.value = true;
};

const onAvatarActionSelect = async (item: any) => {
  showAvatarActions.value = false;

  const sourceType: ('album' | 'camera')[] = item.value === 'camera' ? ['camera'] : ['album'];

  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType,
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];

      try {
        const fileInfo = await new Promise<UniApp.GetFileInfoSuccessData | null>((resolve) => {
          uni.getFileInfo({
            filePath: tempFilePath,
            success: (info) => resolve(info),
            fail: () => resolve(null)
          });
        });

        if (fileInfo && fileInfo.size > 10 * 1024 * 1024) {
          uni.showToast({ title: '图片大小不能超过10MB', icon: 'none' });
          return;
        }
      } catch (e) {
        // 忽略文件信息获取错误，继续上传
      }

      uni.showLoading({ title: '上传中...' });

      try {
        const uploadResult = await uploadApi.uploadAvatar(tempFilePath);
        // 保存相对路径到数据库，前端显示时再动态拼接完整URL
        const avatarUrl = uploadResult.fileUrl;
        const updatedUser = await authApi.updateUserInfo({ avatar: avatarUrl });
        userStore.setUserInfo(updatedUser);
        uni.hideLoading();
        uni.showToast({ title: '头像更新成功', icon: 'success' });
      } catch (error) {
        logError('上传头像失败:', error);
        uni.hideLoading();
        uni.showToast({ title: '上传失败，请重试', icon: 'none' });
      }
    }
  });
};

const editField = (field: string) => {
  editFieldKey.value = field;
  tempValue.value = '';
  tempGender.value = userInfo.value.gender;
  
  switch (field) {
    case 'nickname':
      editTitle.value = '修改昵称';
      editPlaceholder.value = '请输入昵称';
      tempValue.value = userInfo.value.nickname;
      break;
    case 'signature':
      editTitle.value = '修改个性签名';
      editPlaceholder.value = '请输入个性签名';
      tempValue.value = userInfo.value.signature;
      break;
    case 'gender':
      editTitle.value = '选择性别';
      break;
    case 'birthday':
      editTitle.value = '选择生日';
      if (userInfo.value.birthday) {
        const [year, month, day] = userInfo.value.birthday.split('-').map(Number);
        pickerValue.value = [
          years.indexOf(year),
          month - 1,
          day - 1
        ];
      } else {
        pickerValue.value = [30, 0, 0];
      }
      break;
    case 'location':
      editTitle.value = '修改所在地';
      editPlaceholder.value = '请输入所在地';
      tempValue.value = userInfo.value.location;
      break;
  }
  
  showEditPopup.value = true;
};

const onPickerChange = (e: any) => {
  pickerValue.value = e.detail.value;
};

const saveEdit = async () => {
  const updateData: Record<string, any> = {};
  
  switch (editFieldKey.value) {
    case 'nickname':
      if (!tempValue.value.trim()) {
        uni.showToast({ title: '请输入昵称', icon: 'none' });
        return;
      }
      updateData.nickname = tempValue.value.trim();
      break;
    case 'signature':
      updateData.signature = tempValue.value.trim();
      break;
    case 'gender':
      updateData.gender = tempGender.value;
      break;
    case 'birthday':
      const year = years[pickerValue.value[0]];
      const month = pickerValue.value[1] + 1;
      const day = pickerValue.value[2] + 1;
      updateData.birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      break;
    case 'location':
      updateData.location = tempValue.value.trim();
      break;
  }
  
  try {
    uni.showLoading({ title: '保存中...' });
    const result = await authApi.updateUserInfo(updateData);
    userStore.setUserInfo(result);
    showEditPopup.value = false;
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch (error) {
    logError('保存失败:', error);
    uni.showToast({ title: '保存失败', icon: 'none' });
  } finally {
    uni.hideLoading();
  }
};

const goAuth = () => {
  uni.navigateTo({ url: '/pages-sub/auth/real-name/index' });
};

const goShopAuth = () => {
  uni.navigateTo({ url: '/pages-sub/auth/shop-auth/index' });
};

const goQRCode = () => {
  uni.showToast({ title: '我的二维码功能开发中', icon: 'none' });
};

const goShare = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.profile-page {
  @include page-gradient-bg;
  display: flex;
  flex-direction: column;
}

.bg-decoration {
  @include decoration-container;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 100rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 200rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.profile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-card;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-bottom: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 $space-md;
}

.header-left,
.header-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  @include text-main;
  
  &:active {
    background: var(--color-active-bg, $color-bg-gray);
  }
}

.header-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  @include text-main;
}

.content-scroll {
  margin-top: 112rpx;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.scroll-content {
  padding: 0 $space-md;
}

.avatar-section {
  @include flex-column-center;
  margin-top:$space-xl;
  padding: $space-xl 0 $space-xl;
  
  .avatar-wrapper {
    position: relative;
    
    .avatar-edit {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 56rpx;
      height: 56rpx;
      background: $gradient-sunset;
      border-radius: 50%;
      @include flex-center;
      box-shadow: $shadow-glow-primary;
      
      [data-theme="dark"] & {
        background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
        box-shadow: var(--shadow-glow-primary, 0 0 20px rgba(217, 70, 239, 0.4));
      }
    }
  }
  
  .avatar-tip {
    font-size: $font-size-sm;
    @include text-sub;
    margin-top: $space-md;
  }
}

.form-section {
  margin-bottom: $space-lg;
}

.account-section,
.other-section {
  margin-bottom: $space-lg;
}

.section-title {
  font-size: $font-size-sm;
  @include text-sub;
  margin-bottom: $space-sm;
  padding-left: $space-xs;
}

.form-card {
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-lg $space-md;
  transition: all $duration-fast $ease-spring;
  
  &:not(:last-child) {
    border-bottom: 1px solid $color-divider;
    
    [data-theme="dark"] & {
      border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }
  }
  
  &:active {
    background: var(--color-active-bg, $color-bg-gray);
  }
}

.form-label {
  display: flex;
  align-items: center;
  
  .label-text {
    font-size: $font-size-md;
    @include text-main;
    margin-left: $space-sm;
    font-weight: $font-weight-medium;
  }
}

.form-value {
  display: flex;
  align-items: center;
  
  .value-text {
    font-size: $font-size-md;
    @include text-sub;
    max-width: 400rpx;
    text-align: right;
    
    &.signature {
      @include text-ellipsis(1);
    }
    
    &.verified {
      color: var(--color-success, #34C759);
    }
  }
}

.bottom-space {
  height: 120rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  [data-theme="dark"] & {
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.2);
  }
}

.edit-popup {
  background: $color-bg-card;
  border-radius: $radius-xl $radius-xl 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-lg $space-md;
  border-bottom: 1px solid $color-divider;
  
  [data-theme="dark"] & {
    border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }
}

.popup-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  @include text-main;
}

.popup-close {
  width: 64rpx;
  height: 64rpx;
  @include flex-center;
  border-radius: 50%;
  @include text-sub;
  
  &:active {
    background: var(--color-active-bg, $color-bg-gray);
  }
}

.popup-content {
  padding: $space-lg $space-md;
}

.input-wrapper {
  position: relative;
}

.edit-input {
  width: 100%;
  height: 100rpx;
  padding: 0 $space-md;
  font-size: $font-size-md;
  @include text-main;
  background: $color-bg-gray;
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  transition: all $duration-normal $ease-spring;
  
  [data-theme="dark"] & {
    background: var(--input-bg, rgba(0, 0, 0, 0.3));
    border: 1px solid var(--input-border, rgba(255, 255, 255, 0.05));
  }
  
  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1);
  }
}

.edit-textarea {
  width: 100%;
  height: 200rpx;
  padding: $space-md;
  font-size: $font-size-md;
  @include text-main;
  background: $color-bg-gray;
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  transition: all $duration-normal $ease-spring;
  
  [data-theme="dark"] & {
    background: var(--input-bg, rgba(0, 0, 0, 0.3));
    border: 1px solid var(--input-border, rgba(255, 255, 255, 0.05));
  }
  
  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 4rpx rgba($color-primary, 0.1);
  }
}

.char-count {
  position: absolute;
  right: $space-md;
  bottom: $space-sm;
  font-size: $font-size-xs;
  @include text-sub;
}

.gender-options {
  display: flex;
  justify-content: space-around;
  padding: $space-md 0;
}

.gender-option {
  @include flex-column-center;
  padding: $space-lg $space-xl;
  border-radius: $radius-lg;
  background: $color-bg-gray;
  transition: all $duration-normal $ease-spring;
  
  [data-theme="dark"] & {
    background: var(--input-bg, rgba(0, 0, 0, 0.3));
  }
  
  &.is-selected {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    border: 2rpx solid var(--color-primary, #FF6A00);
    
    [data-theme="dark"] & {
      background: rgba(217, 70, 239, 0.15);
      border-color: var(--color-primary, #D946EF);
    }
  }
  
  text {
    font-size: $font-size-sm;
    @include text-main;
    margin-top: $space-sm;
  }
}

.birthday-picker {
  height: 400rpx;
}

.date-picker {
  height: 100%;
}

.picker-item {
  @include flex-center;
  font-size: $font-size-lg;
  @include text-main;
}

.popup-footer {
  padding: $space-md $space-lg $space-lg;
}
</style>
