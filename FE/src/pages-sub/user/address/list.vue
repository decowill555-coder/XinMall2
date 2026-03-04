<template>
  <view class="address-list-page">
    <ui-sub-navbar title="收货地址" />
    
    <scroll-view scroll-y class="address-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="address-content">
        
        <view v-if="addressList.length === 0" class="empty-state">
          <ui-icon name="map-pin" :size="80" color="#A1A1A6" />
          <text class="empty-text">暂无收货地址</text>
          <ui-button type="primary" size="sm" @click="goAdd">添加地址</ui-button>
        </view>
        
        <view v-else class="address-list">
          <view v-for="item in addressList" :key="item.id" class="address-item" @click="selectAddress(item)">
            <view class="address-content">
              <view class="address-header">
                <text class="name">{{ item.name }}</text>
                <text class="phone">{{ item.phone }}</text>
                <ui-tag v-if="item.isDefault" type="primary" size="xs">默认</ui-tag>
              </view>
              <text class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
            </view>
            <view class="address-actions">
              <view class="action-item" @click.stop="setDefault(item)">
                <ui-icon :name="item.isDefault ? 'check-circle-fill' : 'circle'" ::size="40" :color="item.isDefault ? '#1ABC9C' : '#A1A1A6'" />
                <text>默认</text>
              </view>
              <view class="action-item" @click.stop="goEdit(item)">
                <ui-icon name="edit" ::size="40" />
                <text>编辑</text>
              </view>
              <view class="action-item" @click.stop="handleDelete(item)">
                <ui-icon name="trash" ::size="40" />
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="list-footer">
      <ui-button type="primary" block @click="goAdd">新增地址</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const addressList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '朝阳区',
    district: '建国路',
    detail: '88号SOHO现代城A座1201室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    province: '上海市',
    city: '浦东新区',
    district: '陆家嘴',
    detail: '金融中心B座2002室',
    isDefault: false
  }
]);

const goAdd = () => {
  uni.navigateTo({ url: '/pages-sub/user/address/edit' });
};

const goEdit = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/user/address/edit?id=${item.id}` });
};

const selectAddress = (item: any) => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage) {
    uni.$emit('addressSelected', item);
    uni.navigateBack();
  }
};

const setDefault = (item: any) => {
  addressList.value.forEach(addr => addr.isDefault = false);
  item.isDefault = true;
  uni.showToast({ title: '设置成功', icon: 'success' });
};

const handleDelete = (item: any) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: (res) => {
      if (res.confirm) {
        const index = addressList.value.findIndex(a => a.id === item.id);
        if (index > -1) {
          addressList.value.splice(index, 1);
          uni.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.address-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.address-scroll {
  height: calc(100vh - 88rpx - 120rpx);
}

.address-content {
  padding: $space-md;
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin: $space-md 0;
  }
}

.address-list {
  .address-item {
    background: $color-white;
    border-radius: $radius-md;
    padding: $space-md;
    margin-bottom: $space-sm;
    
    .address-content {
      .address-header {
        display: flex;
        align-items: center;
        margin-bottom: $space-xs;
        
        .name {
          font-size: $font-size-md;
          font-weight: $font-weight-medium;
          color: $color-text-main;
        }
        
        .phone {
          font-size: $font-size-md;
          color: $color-text-sub;
          margin-left: $space-md;
        }
      }
      
      .address-detail {
        font-size: $font-size-sm;
        color: $color-text-sub;
        line-height: 1.5;
      }
    }
    
    .address-actions {
      display: flex;
      gap: $space-lg;
      margin-top: $space-md;
      padding-top: $space-md;
      border-top: 1rpx solid $color-divider;
      
      .action-item {
        display: flex;
        align-items: center;
        font-size: $font-size-xs;
        color: $color-text-sub;
        
        text { margin-left: $space-xs; }
      }
    }
  }
}

.list-footer {
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
