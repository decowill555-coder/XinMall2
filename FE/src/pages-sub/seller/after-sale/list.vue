<template>
  <view class="after-sale-list-page">
    <ui-sub-navbar title="售后管理" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="list-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="after-content">
        <ui-empty 
          v-if="afterSaleList.length === 0" 
          icon="refresh" 
          text="暂无售后记录"
        />
        
        <view v-else class="after-sale-list">
          <ui-after-sale-card 
            v-for="item in afterSaleList" 
            :key="item.id"
            :order-no="item.orderNo"
            :cover="item.goodsCover"
            :title="item.goodsTitle"
            :spec="item.goodsSpec"
            :type="item.type"
            :reason="item.reason"
            :time="item.createTime"
            :status="item.status"
            :show-actions="item.status === 'pending'"
            @click="goDetail(item)"
            @agree="handleAgree(item)"
            @reject="handleReject(item)"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待处理' },
  { name: '处理中' },
  { name: '已完成' }
]);

const afterSaleList = ref([
  {
    id: 1,
    orderNo: 'XM202401150001',
    goodsCover: 'https://picsum.photos/200/200?random=a1',
    goodsTitle: 'iPhone 15 Pro Max 256GB',
    goodsSpec: '钛金属原色',
    type: '退货退款',
    reason: '商品与描述不符',
    status: 'pending',
    createTime: '2024-01-15 10:30'
  },
  {
    id: 2,
    orderNo: 'XM202401140002',
    goodsCover: 'https://picsum.photos/200/200?random=a2',
    goodsTitle: 'AirPods Pro 第二代',
    goodsSpec: 'USB-C',
    type: '仅退款',
    reason: '质量问题',
    status: 'processing',
    createTime: '2024-01-14 15:20'
  },
  {
    id: 3,
    orderNo: 'XM202401130003',
    goodsCover: 'https://picsum.photos/200/200?random=a3',
    goodsTitle: 'MacBook Pro 14寸',
    goodsSpec: 'M3芯片 16G+512G',
    type: '换货',
    reason: '收到商品有划痕',
    status: 'completed',
    createTime: '2024-01-13 09:15'
  }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/seller/after-sale/detail?id=${item.id}` });
};

const handleAgree = (item: any) => {
  uni.showModal({
    title: '确认',
    content: '确定同意该售后申请吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已同意', icon: 'success' });
      }
    }
  });
};

const handleReject = (item: any) => {
  uni.showModal({
    title: '拒绝原因',
    editable: true,
    placeholderText: '请输入拒绝原因',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已拒绝', icon: 'success' });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.after-sale-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.list-scroll {
  overflow: hidden;
}
.after-content{
  padding: $space-sm $space-md;
}
</style>
