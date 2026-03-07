<template>
  <view class="address-list-page">
    <ui-sub-navbar title="收货地址" />
    
    <scroll-view scroll-y class="address-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="address-content">
        
        <view v-if="addressList.length === 0" class="empty-state">
          <ui-icon name="map-pin" :size="80" />
          <text class="empty-text">暂无收货地址</text>
          <ui-button type="primary" size="sm" @click="goAdd">添加地址</ui-button>
        </view>
        
        <view v-else class="address-list">
          <ui-address-card 
            v-for="item in addressList" 
            :key="item.id"
            :name="item.name"
            :phone="item.phone"
            :province="item.province"
            :city="item.city"
            :district="item.district"
            :detail="item.detail"
            :is-default="item.isDefault"
            @click="selectAddress(item)"
            @set-default="setDefault(item)"
            @edit="goEdit(item)"
            @delete="handleDelete(item)"
          />
        </view>
      </view>
    </scroll-view>
    
    <ui-bottom-bar>
      <ui-button type="primary" block @click="goAdd">新增地址</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack, navigateTo } = useNavigation();

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
  navigateTo('/pages-sub/user/address/edit');
};

const goEdit = (item: any) => {
  navigateTo(`/pages-sub/user/address/edit?id=${item.id}`);
};

const selectAddress = (item: any) => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage) {
    uni.$emit('addressSelected', item);
    smartBack();
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
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
}
</style>
