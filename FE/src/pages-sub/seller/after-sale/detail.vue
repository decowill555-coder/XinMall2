<template>
  <view class="after-sale-detail-page">
    <ui-sub-navbar title="售后详情" />

    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <template v-if="afterSale">
        <ui-status-card
          class="status-card"
          :icon="statusConfig.icon"
          :title="statusConfig.title"
          :desc="statusConfig.desc"
          :type="afterSale.status"
        />

        <view class="info-card">
          <view class="card-title">售后信息</view>
          <view class="info-item">
            <text class="info-label">售后类型</text>
            <text class="info-value">{{ typeText }}</text>
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
              <ui-price :value="afterSale.goodsPrice" :size="40" />
            </view>
          </view>
        </view>

        <view class="timeline-card">
          <view class="card-title">处理进度</view>
          <ui-timeline :items="timeline" />
        </view>
      </template>

      <ui-empty v-else-if="!loading" icon="file-text" text="售后信息不存在" />
    </scroll-view>

    <ui-bottom-bar v-if="afterSale?.status === 'pending'">
      <ui-button block @click="handleReject">拒绝</ui-button>
      <ui-button type="primary" block @click="handleAgree">同意</ui-button>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { aftersaleApi, type AftersaleDetail } from '@/api/aftersale';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const aftersaleId = ref('');
const loading = ref(false);
const afterSale = ref<AftersaleDetail | null>(null);

// 获取售后详情
const loadDetail = async () => {
  if (!aftersaleId.value) return;

  try {
    loading.value = true;
    const res = await aftersaleApi.getAftersaleDetail(aftersaleId.value);
    afterSale.value = res;
  } catch (error) {
    console.error('获取售后详情失败', error);
    uni.showToast({ title: '获取详情失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  aftersaleId.value = (currentPage as any).$page?.options?.id || '';
  if (aftersaleId.value) {
    loadDetail();
  }
});

const timeline = computed(() => {
  return afterSale.value?.timeline || [];
});

// 售后类型文本
const typeText = computed(() => {
  const typeMap: Record<string, string> = {
    'refund_only': '仅退款',
    'refund_return': '退货退款',
    'exchange': '换货'
  };
  return typeMap[afterSale.value?.type || ''] || afterSale.value?.type || '';
});

const statusConfig = computed(() => {
  const configs: Record<string, any> = {
    pending: { icon: 'clock', color: '$color-warning', title: '待处理', desc: '请在48小时内处理' },
    processing: { icon: 'refresh', color: '#007AFF', title: '处理中', desc: '请等待买家退货' },
    waiting_return: { icon: 'package', color: '#FF9500', title: '待退货', desc: '已同意，等待买家寄回商品' },
    completed: { icon: 'check-circle', color: '#34C759', title: '已完成', desc: '售后已完成' },
    rejected: { icon: 'x-circle', color: '#FF3B30', title: '已拒绝', desc: afterSale.value?.rejectReason || '已拒绝该申请' },
    cancelled: { icon: 'x', color: '#8E8E93', title: '已取消', desc: '买家已取消申请' }
  };
  return configs[afterSale.value?.status || 'pending'] || configs.pending;
});

const handleAgree = () => {
  uni.showModal({
    title: '确认',
    content: '确定同意该售后申请吗？',
    success: async (res) => {
      if (res.confirm && afterSale.value) {
        try {
          await aftersaleApi.agreeAftersale(aftersaleId.value);
          uni.showToast({ title: '已同意', icon: 'success' });
          loadDetail();
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    }
  });
};

const handleReject = () => {
  uni.showModal({
    title: '拒绝原因',
    editable: true,
    placeholderText: '请输入拒绝原因',
    success: async (res) => {
      if (res.confirm && res.content && afterSale.value) {
        try {
          await aftersaleApi.rejectAftersale(aftersaleId.value, res.content);
          uni.showToast({ title: '已拒绝', icon: 'success' });
          loadDetail();
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' });
        }
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
  margin: $space-sm $space-md;
}

.info-card, .goods-card, .timeline-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  padding: $space-md;
  margin: 0 $space-md $space-sm;
  
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
</style>
