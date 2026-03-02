<template>
  <view class="after-sale-list-page">
    <ui-sub-navbar title="售后管理" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="list-scroll">
      <view v-if="afterSaleList.length === 0" class="empty-state">
        <ui-icon name="refresh" size="80" color="#A1A1A6" />
        <text class="empty-text">暂无售后记录</text>
      </view>
      
      <view v-else class="after-sale-list">
        <view v-for="item in afterSaleList" :key="item.id" class="after-sale-item" @click="goDetail(item)">
          <view class="item-header">
            <text class="order-no">订单�? {{ item.orderNo }}</text>
            <text class="status" :class="item.statusClass">{{ item.statusText }}</text>
          </view>
          
          <view class="item-goods">
            <ui-image :src="item.goodsCover" width="100rpx" height="100rpx" radius="8rpx" />
            <view class="goods-info">
              <text class="goods-title">{{ item.goodsTitle }}</text>
              <text class="goods-spec">{{ item.goodsSpec }}</text>
            </view>
          </view>
          
          <view class="item-info">
            <text class="info-label">售后类型</text>
            <text class="info-value">{{ item.type }}</text>
          </view>
          <view class="item-info">
            <text class="info-label">申请原因</text>
            <text class="info-value">{{ item.reason }}</text>
          </view>
          <view class="item-info">
            <text class="info-label">申请时间</text>
            <text class="info-value">{{ item.createTime }}</text>
          </view>
          
          <view class="item-actions" v-if="item.status === 'pending'">
            <ui-button size="sm" @click.stop="handleReject(item)">拒绝</ui-button>
            <ui-button size="sm" type="primary" @click.stop="handleAgree(item)">同意</ui-button>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待处�? },
  { name: '处理�? },
  { name: '已完�? }
]);

const afterSaleList = ref([
  {
    id: 1,
    orderNo: 'XM202401150001',
    goodsCover: 'https://picsum.photos/200/200?random=a1',
    goodsTitle: 'iPhone 15 Pro Max 256GB',
    goodsSpec: '钛金属原�?,
    type: '退货退�?,
    reason: '商品与描述不�?,
    status: 'pending',
    statusText: '待处�?,
    statusClass: 'warning',
    createTime: '2024-01-15 10:30'
  },
  {
    id: 2,
    orderNo: 'XM202401140002',
    goodsCover: 'https://picsum.photos/200/200?random=a2',
    goodsTitle: 'AirPods Pro 第二�?,
    goodsSpec: 'USB-C',
    type: '仅退�?,
    reason: '质量问题',
    status: 'processing',
    statusText: '处理�?,
    statusClass: 'primary',
    createTime: '2024-01-14 15:20'
  },
  {
    id: 3,
    orderNo: 'XM202401130003',
    goodsCover: 'https://picsum.photos/200/200?random=a3',
    goodsTitle: 'MacBook Pro 14�?,
    goodsSpec: 'M3芯片 16G+512G',
    type: '换货',
    reason: '收到商品有划�?,
    status: 'completed',
    statusText: '已完�?,
    statusClass: 'success',
    createTime: '2024-01-13 09:15'
  }
]);

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/seller/after-sale/detail?id=${item.id}` });
};

const handleAgree = (item: any) => {
  uni.showModal({
    title: '确认',
    content: '确定同意该售后申请吗�?,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已同�?, icon: 'success' });
      }
    }
  });
};

const handleReject = (item: any) => {
  uni.showModal({
    title: '拒绝原因',
    editable: true,
    placeholderText: '请输入拒绝原�?,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已拒�?, icon: 'success' });
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
  background: $color-white;
  padding: 0 $space-md;
}

.list-scroll {
  height: calc(100vh - 88rpx - 88rpx);
  padding: $space-sm $space-md;
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin-top: $space-md;
  }
}

.after-sale-list {
  .after-sale-item {
    background: $color-white;
    border-radius: $radius-md;
    padding: $space-md;
    margin-bottom: $space-sm;
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-md;
      padding-bottom: $space-sm;
      border-bottom: 1rpx solid $color-divider;
      
      .order-no {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
      
      .status {
        font-size: $font-size-sm;
        
        &.warning { color: $color-warning; }
        &.primary { color: $color-primary; }
        &.success { color: $color-success; }
      }
    }
    
    .item-goods {
      display: flex;
      margin-bottom: $space-md;
      
      .goods-info {
        flex: 1;
        margin-left: $space-sm;
        
        .goods-title {
          font-size: $font-size-sm;
          color: $color-text-main;
          @include text-ellipsis(1);
        }
        
        .goods-spec {
          font-size: $font-size-xs;
          color: $color-text-sub;
          margin-top: $space-xs;
        }
      }
    }
    
    .item-info {
      display: flex;
      justify-content: space-between;
      padding: $space-xs 0;
      
      .info-label {
        font-size: $font-size-sm;
        color: $color-text-sub;
      }
      
      .info-value {
        font-size: $font-size-sm;
        color: $color-text-main;
      }
    }
    
    .item-actions {
      display: flex;
      justify-content: flex-end;
      gap: $space-sm;
      margin-top: $space-md;
      padding-top: $space-md;
      border-top: 1rpx solid $color-divider;
    }
  }
}
</style>
