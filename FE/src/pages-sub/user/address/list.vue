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
            :is-default="item.isDefault === 1"
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
import { ref, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { tradeApi, type Address } from '@/api/trade';
import { logError } from '@/utils/logger';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack, navigateTo } = useNavigation();

const addressList = ref<Address[]>([]);
const loading = ref(false);

const fetchAddressList = async () => {
  loading.value = true;
  try {
    const res = await tradeApi.getAddressList();
    addressList.value = res;
  } catch (error) {
    logError('获取地址列表失败:', error);
    addressList.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAddressList();
});

const goAdd = () => {
  navigateTo('/pages-sub/user/address/edit');
};

const goEdit = (item: Address) => {
  navigateTo(`/pages-sub/user/address/edit?id=${item.id}`);
};

const selectAddress = (item: Address) => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  if (prevPage) {
    uni.$emit('addressSelected', item);
    smartBack();
  }
};

const setDefault = async (item: Address) => {
  try {
    await tradeApi.setDefaultAddress(item.id);
    addressList.value.forEach(addr => addr.isDefault = addr.id === item.id ? 1 : 0);
    uni.showToast({ title: '设置成功', icon: 'success' });
  } catch (error) {
    uni.showToast({ title: '设置失败', icon: 'none' });
  }
};

const handleDelete = (item: Address) => {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await tradeApi.deleteAddress(item.id);
          const index = addressList.value.findIndex(a => a.id === item.id);
          if (index > -1) {
            addressList.value.splice(index, 1);
            uni.showToast({ title: '删除成功', icon: 'success' });
          }
        } catch (error) {
          uni.showToast({ title: '删除失败', icon: 'none' });
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
  padding-bottom: calc(#{$space-md} + 120rpx + env(safe-area-inset-bottom));
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
