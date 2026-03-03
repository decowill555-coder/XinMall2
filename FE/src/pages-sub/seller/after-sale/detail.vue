<template>
  <view class="after-sale-detail-page">
    <ui-sub-navbar title="售后详情" />
    
    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="status-card">
        <view class="status-icon">
          <ui-icon :name="statusConfig.icon" :size="40" :color="statusConfig.color" />
        </view>
        <text class="status-text">{{ statusConfig.text }}</text>
        <text class="status-desc">{{ statusConfig.desc }}</text>
      </view>
      
      <view class="info-card">
        <view class="card-title">售后信息</view>
        <view class="info-item">
          <text class="info-label">售后类型</text>
          <text class="info-value">{{ afterSale.type }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">申请原因</text>
          <text class="info-value">{{ afterSale.reason }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">退款金额</text>
          <ui-price :value="afterSale.refundAmount" :size="28" />
        </view>
        <view class="info-item">
          <text class="info-label">申请时间</text>
          <text class="info-value">{{ afterSale.createTime }}</text>
        </view>
      </view>
      
      <view class="goods-card">
        <view class="card-title">商品信息</view>
        <view class="goods-item">
          <ui-image :src="afterSale.goodsCover" width="120rpx" height="120rpx" radius="8rpx" />
          <view class="goods-info">
            <text class="goods-title">{{ afterSale.goodsTitle }}</text>
            <text class="goods-spec">{{ afterSale.goodsSpec }}</text>
            <ui-price :value="afterSale.goodsPrice" ::size="40" />
          </view>
        </view>
      </view>
      
      <view class="timeline-card">
        <view class="card-title">处理进度</view>
        <view class="timeline">
          <view v-for="(item, index) in timeline" :key="index" class="timeline-item">
            <view class="timeline-dot" :class="{ active: index === 0 }"></view>
            <view class="timeline-content">
              <text class="timeline-title">{{ item.title }}</text>
              <text class="timeline-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="detail-footer" v-if="afterSale.status === 'pending'" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button block @click="handleReject">拒绝</ui-button>
      <ui-button type="primary" block @click="handleAgree">同意</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const afterSale = ref({
  id: 1,
  type: '退货退款',
  reason: '商品与描述不符，实际成色与描述有差异',
  refundAmount: 7999,
  status: 'pending',
  createTime: '2024-01-15 10:30:00',
  goodsCover: 'https://picsum.photos/200/200?random=ad1',
  goodsTitle: 'iPhone 15 Pro Max 256GB',
  goodsSpec: '钛金属原色',
  goodsPrice: 7999
});

const timeline = ref([
  { title: '买家发起售后申请', time: '2024-01-15 10:30' },
  { title: '等待商家处理', time: '2024-01-15 10:30' }
]);

const statusConfig = computed(() => {
  const configs: Record<string, any> = {
    pending: { icon: 'clock', color: '#FF9500', text: '待处理', desc: '请在48小时内处理' },
    processing: { icon: 'refresh', color: '#007AFF', text: '处理中', desc: '请等待买家退货' },
    completed: { icon: 'check-circle', color: '#34C759', text: '已完成', desc: '售后已完成' }
  };
  return configs[afterSale.value.status] || configs.pending;
});

const handleAgree = () => {
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

const handleReject = () => {
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
.after-sale-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.detail-scroll {
  overflow: hidden;
}

.status-card {
  @include flex-column-center;
  padding: $space-xl;
  background: $color-white;
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  
  .status-icon {
    width: 80rpx;
    height: 80rpx;
    background: $color-bg-gray;
    border-radius: 50%;
    @include flex-center;
    margin-bottom: $space-sm;
  }
  
  .status-text {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
  
  .status-desc {
    font-size: $font-size-sm;
    color: $color-text-sub;
    margin-top: $space-xs;
  }
}

.info-card, .goods-card, .timeline-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .card-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-xs 0;
  
  .info-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
  
  .info-value {
    font-size: $font-size-sm;
    color: $color-text-main;
    max-width: 400rpx;
    text-align: right;
  }
}

.goods-item {
  display: flex;
  
  .goods-info {
    flex: 1;
    margin-left: $space-md;
    
    .goods-title {
      font-size: $font-size-sm;
      color: $color-text-main;
      @include text-ellipsis(1);
    }
    
    .goods-spec {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin: $space-xs 0;
    }
  }
}

.timeline {
  .timeline-item {
    display: flex;
    padding-bottom: $space-md;
    
    &:last-child { padding-bottom: 0; }
    
    .timeline-dot {
      width: 16rpx;
      height: 16rpx;
      background: $color-border-light;
      border-radius: 50%;
      margin-right: $space-md;
      margin-top: 6rpx;
      
      &.active {
        background: $color-primary;
      }
    }
    
    .timeline-content {
      flex: 1;
      
      .timeline-title {
        font-size: $font-size-sm;
        color: $color-text-main;
      }
      
      .timeline-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: $space-xs;
      }
    }
  }
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: $space-sm;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
