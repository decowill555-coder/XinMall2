<template>
  <view class="aftersale-detail-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>

    <ui-sub-navbar title="售后详情" />

    <scroll-view scroll-y class="detail-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="detail-content">
        <!-- 状态卡片 -->
        <view class="status-card" :class="`status-${detail.status}`">
          <view class="status-icon-wrapper">
            <view class="status-icon">
              <ui-icon :name="statusConfig.icon" :size="48" color="white" />
            </view>
            <view class="status-glow"></view>
          </view>
          <text class="status-text">{{ statusConfig.text }}</text>
          <text class="status-desc">{{ statusConfig.desc }}</text>
        </view>

        <!-- 进度时间线 -->
        <view class="timeline-card">
          <view class="card-content">
            <view class="section-title">处理进度</view>
            <view class="timeline-list">
              <view
                v-for="(item, index) in detail.timeline"
                :key="index"
                class="timeline-item"
                :class="{ 'is-last': index === detail.timeline.length - 1 }"
              >
                <view class="timeline-dot" :class="{ 'is-active': index === 0 }"></view>
                <view class="timeline-content">
                  <text class="timeline-status">{{ item.status }}</text>
                  <text class="timeline-desc">{{ item.description }}</text>
                  <text class="timeline-time">{{ item.time }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="goods-card">
          <view class="card-content">
            <view class="section-title">商品信息</view>
            <view class="goods-item">
              <ui-image :src="detail.goodsCover" width="160rpx" height="160rpx" radius="16rpx" />
              <view class="goods-info">
                <text class="goods-title">{{ detail.goodsTitle }}</text>
                <text class="goods-spec">{{ detail.goodsSpec || '默认规格' }}</text>
                <view class="goods-bottom">
                  <ui-price :value="detail.goodsPrice" :size="28" />
                  <text class="goods-quantity">x{{ detail.quantity }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 售后信息 -->
        <view class="info-card">
          <view class="card-content">
            <view class="section-title">售后信息</view>
            <view class="info-item">
              <text class="info-label">售后类型</text>
              <text class="info-value">{{ typeText }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">退款金额</text>
              <ui-price :value="detail.refundAmount" :size="28" color="error" />
            </view>
            <view class="info-item">
              <text class="info-label">申请原因</text>
              <text class="info-value">{{ detail.reason }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">问题描述</text>
              <text class="info-value">{{ detail.description }}</text>
            </view>
            <view v-if="detail.images?.length" class="info-item images">
              <text class="info-label">凭证图片</text>
              <view class="image-list">
                <ui-image
                  v-for="(img, index) in detail.images"
                  :key="index"
                  :src="img"
                  width="120rpx"
                  height="120rpx"
                  radius="8rpx"
                  @click="previewImage(index)"
                />
              </view>
            </view>
            <view v-if="detail.rejectReason" class="info-item">
              <text class="info-label">拒绝原因</text>
              <text class="info-value error">{{ detail.rejectReason }}</text>
            </view>
          </view>
        </view>

        <!-- 物流信息 (退货退款时显示) -->
        <view v-if="detail.logistics && (detail.status === 'processing' || detail.status === 'completed')" class="logistics-card">
          <view class="card-content">
            <view class="section-title">退货物流</view>
            <view class="info-item">
              <text class="info-label">物流公司</text>
              <text class="info-value">{{ detail.logistics.company }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">物流单号</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ detail.logistics.trackingNo }}</text>
                <text class="copy-btn" @click="copyTrackingNo">复制</text>
              </view>
            </view>
            <view v-if="detail.logistics.traces?.length" class="traces-list">
              <view
                v-for="(trace, index) in detail.logistics.traces"
                :key="index"
                class="trace-item"
                :class="{ 'is-first': index === 0 }"
              >
                <view class="trace-dot"></view>
                <view class="trace-content">
                  <text class="trace-text">{{ trace.content }}</text>
                  <text class="trace-time">{{ trace.time }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 卖家信息 -->
        <view class="seller-card">
          <view class="card-content">
            <view class="section-title">卖家信息</view>
            <view class="seller-info" @click="goSellerShop">
              <ui-avatar :src="detail.seller?.avatar" :size="80" />
              <view class="seller-detail">
                <text class="seller-name">{{ detail.seller?.name }}</text>
                <text class="seller-phone" v-if="detail.seller?.phone">{{ detail.seller.phone }}</text>
              </view>
              <ui-icon name="arrow-right" :size="32" color="sub" />
            </view>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="order-card">
          <view class="card-content">
            <view class="section-title">订单信息</view>
            <view class="info-item">
              <text class="info-label">订单编号</text>
              <view class="info-value-wrapper">
                <text class="info-value">{{ detail.orderNo }}</text>
                <text class="copy-btn" @click="copyOrderNo">复制</text>
              </view>
            </view>
            <view class="info-item">
              <text class="info-label">申请时间</text>
              <text class="info-value">{{ detail.createTime }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="detail-footer">
      <view class="footer-content">
        <!-- 待处理状态 -->
        <view v-if="detail.status === 'pending'" class="footer-actions">
          <ui-button plain @click="cancelAftersale">撤销申请</ui-button>
        </view>

        <!-- 处理中状态(需退货) -->
        <view v-else-if="detail.status === 'processing' && detail.type !== 'refund_only'" class="footer-actions">
          <ui-button plain @click="fillLogistics">填写物流</ui-button>
          <ui-button type="primary" @click="contactSeller">联系卖家</ui-button>
        </view>

        <!-- 已完成 -->
        <view v-else-if="detail.status === 'completed'" class="footer-actions">
          <ui-button plain @click="contactSeller">联系卖家</ui-button>
        </view>

        <!-- 已拒绝 -->
        <view v-else-if="detail.status === 'rejected'" class="footer-actions">
          <ui-button plain @click="reapply">重新申请</ui-button>
          <ui-button type="primary" @click="contactService">平台介入</ui-button>
        </view>
      </view>
    </view>

    <!-- 填写物流弹窗 -->
    <ui-popup v-model:show="showLogisticsPopup" position="bottom" round>
      <view class="logistics-popup">
        <view class="popup-header">
          <text class="popup-title">填写退货物流</text>
          <view class="popup-close" @click="showLogisticsPopup = false">
            <ui-icon name="close" :size="40" />
          </view>
        </view>
        <view class="popup-form">
          <view class="form-item">
            <text class="form-label">物流公司</text>
            <ui-input
              v-model="logisticsForm.company"
              placeholder="请输入物流公司"
            />
          </view>
          <view class="form-item">
            <text class="form-label">物流单号</text>
            <ui-input
              v-model="logisticsForm.trackingNo"
              placeholder="请输入物流单号"
            />
          </view>
          <ui-button type="primary" block @click="submitLogistics">提交</ui-button>
        </view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { aftersaleApi, type AftersaleDetail, type AftersaleStatus } from '@/api/aftersale';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const detail = ref<AftersaleDetail>({
  id: '',
  orderNo: '',
  orderId: '',
  type: 'refund_only',
  reason: '',
  status: 'pending',
  goodsCover: '',
  goodsTitle: '',
  goodsSpec: '',
  goodsPrice: 0,
  quantity: 1,
  refundAmount: 0,
  createTime: '',
  updateTime: '',
  description: '',
  images: [],
  timeline: [],
  order: {
    id: '',
    orderNo: '',
    product: {
      id: '',
      cover: '',
      title: '',
      price: 0
    },
    quantity: 1,
    totalAmount: 0
  },
  seller: {
    id: '',
    name: '',
    avatar: ''
  }
});

const loading = ref(false);
const showLogisticsPopup = ref(false);
const logisticsForm = ref({
  company: '',
  trackingNo: ''
});

const typeText = computed(() => {
  const types: Record<string, string> = {
    'refund_only': '仅退款',
    'refund_return': '退货退款',
    'exchange': '换货'
  };
  return types[detail.value.type] || '未知类型';
});

const statusConfig = computed(() => {
  const configs: Record<AftersaleStatus, { icon: string; text: string; desc: string }> = {
    pending: { icon: 'clock', text: '待处理', desc: '等待商家处理您的申请' },
    processing: { icon: 'loader', text: '处理中', desc: '商家已同意，请按要求操作' },
    completed: { icon: 'check-circle', text: '已完成', desc: '售后已完成' },
    rejected: { icon: 'x-circle', text: '已拒绝', desc: '商家拒绝了您的申请' },
    cancelled: { icon: 'slash', text: '已取消', desc: '您已取消此次售后' }
  };
  return configs[detail.value.status] || configs.pending;
});

const fetchDetail = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const id = (currentPage as any).options?.id;

  if (!id) {
    uni.showToast({ title: '参数错误', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const result = await aftersaleApi.getAftersaleDetail(id);
    detail.value = result;
  } catch (error) {
    console.error('获取售后详情失败:', error);
    uni.showToast({ title: '获取详情失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const copyOrderNo = () => {
  uni.setClipboardData({
    data: detail.value.orderNo,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'success' });
    }
  });
};

const copyTrackingNo = () => {
  if (detail.value.logistics?.trackingNo) {
    uni.setClipboardData({
      data: detail.value.logistics.trackingNo,
      success: () => {
        uni.showToast({ title: '复制成功', icon: 'success' });
      }
    });
  }
};

const previewImage = (index: number) => {
  uni.previewImage({
    urls: detail.value.images,
    current: index
  });
};

const goSellerShop = () => {
  uni.navigateTo({ url: `/pages-sub/community/user/index?id=${detail.value.seller?.id}` });
};

const cancelAftersale = () => {
  uni.showModal({
    title: '撤销申请',
    content: '确定要撤销此次售后申请吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await aftersaleApi.cancelAftersale(detail.value.id);
          uni.showToast({ title: '撤销成功', icon: 'success' });
          fetchDetail();
        } catch (error) {
          uni.showToast({ title: '撤销失败', icon: 'none' });
        }
      }
    }
  });
};

const fillLogistics = () => {
  showLogisticsPopup.value = true;
};

const submitLogistics = async () => {
  if (!logisticsForm.value.company || !logisticsForm.value.trackingNo) {
    uni.showToast({ title: '请填写完整物流信息', icon: 'none' });
    return;
  }

  try {
    await aftersaleApi.submitLogistics({
      aftersaleId: detail.value.id,
      company: logisticsForm.value.company,
      trackingNo: logisticsForm.value.trackingNo
    });
    showLogisticsPopup.value = false;
    uni.showToast({ title: '提交成功', icon: 'success' });
    fetchDetail();
  } catch (error) {
    uni.showToast({ title: '提交失败', icon: 'none' });
  }
};

const contactSeller = () => {
  uni.navigateTo({ url: `/pages-sub/chat/index?userId=${detail.value.seller?.id}` });
};

const contactService = () => {
  uni.showToast({ title: '联系客服', icon: 'none' });
};

const reapply = () => {
  uni.navigateTo({ url: `/pages-sub/trade/aftersale/apply?orderId=${detail.value.orderId}` });
};

onMounted(() => {
  fetchDetail();
});
</script>

<style lang="scss" scoped>
.aftersale-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  position: relative;
  overflow: hidden;

  [data-theme="dark"] & {
    background: $color-bg-page;
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  pointer-events: none;
  overflow: hidden;

  .decoration-circle {
    position: absolute;
    border-radius: 50%;
  }

  .circle-1 {
    width: 300rpx;
    height: 300rpx;
    top: -80rpx;
    right: -60rpx;
    background: radial-gradient(circle, rgba($color-primary, 0.15) 0%, transparent 70%);

    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(217, 70, 239, 0.2) 0%, transparent 70%);
    }
  }

  .circle-2 {
    width: 200rpx;
    height: 200rpx;
    top: 100rpx;
    left: -50rpx;
    background: radial-gradient(circle, rgba($color-accent, 0.1) 0%, transparent 70%);

    [data-theme="dark"] & {
      background: radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, transparent 70%);
    }
  }
}

.detail-scroll {
  overflow: hidden;
}

.detail-content {
  padding: $space-md;
  padding-bottom: 160rpx;
}

.status-card {
  @include flex-column-center;
  padding: $space-xl $space-lg;
  border-radius: $radius-xl;
  margin-bottom: $space-md;
  position: relative;
  overflow: hidden;

  &.status-pending {
    background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
  }

  &.status-processing {
    background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  }

  &.status-completed {
    background: linear-gradient(135deg, #34C759 0%, #30D158 100%);
  }

  &.status-rejected {
    background: linear-gradient(135deg, #FF3B30 0%, #FF453A 100%);
  }

  &.status-cancelled {
    background: linear-gradient(135deg, #8E8E93 0%, #636366 100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .status-icon-wrapper {
    position: relative;
    margin-bottom: $space-sm;

    .status-icon {
      width: 96rpx;
      height: 96rpx;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 50%;
      @include flex-center;
      position: relative;
      z-index: 2;
    }

    .status-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120rpx;
      height: 120rpx;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      animation: status-glow 2s ease-in-out infinite;
    }
  }

  .status-text {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-white;
    position: relative;
    z-index: 1;
  }

  .status-desc {
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.85);
    margin-top: $space-xs;
    position: relative;
    z-index: 1;
  }
}

@keyframes status-glow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.9;
  }
}

.timeline-card, .goods-card, .info-card, .logistics-card, .seller-card, .order-card {
  margin-bottom: $space-md;
  position: relative;
  z-index: 1;

  .card-content {
    background: $color-bg-card;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-radius: $radius-lg;
    padding: $space-md;
    border: 1px solid $color-border;

    [data-theme="dark"] & {
      background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
      border-top: 1px solid var(--glass-border-highlight, rgba(255, 255, 255, 0.25));
      border-bottom: 1px solid transparent;
      border-left: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
      border-right: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }
}

.section-title {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $color-text-main;
  margin-bottom: $space-md;

  [data-theme="dark"] & {
    color: var(--color-text-main, #F2F2F7);
  }
}

.timeline-list {
  .timeline-item {
    display: flex;
    padding-bottom: $space-md;
    position: relative;

    &.is-last {
      padding-bottom: 0;
    }

    .timeline-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background: $color-border;
      flex-shrink: 0;
      margin-top: 6rpx;

      &.is-active {
        background: $color-primary;
        box-shadow: 0 0 0 4rpx rgba($color-primary, 0.2);

        [data-theme="dark"] & {
          background: var(--color-primary, #E879F9);
          box-shadow: 0 0 0 4rpx rgba(217, 70, 239, 0.3);
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: 9rpx;
      top: 30rpx;
      width: 2rpx;
      height: calc(100% - 20rpx);
      background: $color-border;

      [data-theme="dark"] & {
        background: var(--color-border, rgba(255, 255, 255, 0.12));
      }
    }

    &.is-last::before {
      display: none;
    }

    .timeline-content {
      margin-left: $space-md;
      flex: 1;

      .timeline-status {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
        display: block;

        [data-theme="dark"] & {
          color: var(--color-text-main, #F2F2F7);
        }
      }

      .timeline-desc {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-top: 4rpx;
        display: block;

        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }

      .timeline-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: 4rpx;
        display: block;
      }
    }
  }
}

.goods-item {
  display: flex;

  .goods-info {
    flex: 1;
    margin-left: $space-md;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .goods-title {
      font-size: $font-size-sm;
      color: $color-text-main;
      @include text-ellipsis(2);

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .goods-spec {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin-top: $space-xs;

      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }

    .goods-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: $space-sm;

      .goods-quantity {
        font-size: $font-size-sm;
        color: $color-text-sub;

        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }
    }
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: $space-sm 0;

  &.images {
    flex-direction: column;
  }

  .info-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
    flex-shrink: 0;

    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
  }

  .info-value {
    font-size: $font-size-sm;
    color: $color-text-main;
    text-align: right;

    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }

    &.error {
      color: $color-error;
    }
  }

  .info-value-wrapper {
    display: flex;
    align-items: center;

    .copy-btn {
      font-size: $font-size-xs;
      color: $color-primary;
      margin-left: $space-sm;
      padding: 4rpx 12rpx;
      background: rgba($color-primary, 0.1);
      border-radius: $radius-sm;

      [data-theme="dark"] & {
        color: var(--color-primary, #E879F9);
        background: rgba(217, 70, 239, 0.15);
      }
    }
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-top: $space-sm;
  }
}

.traces-list {
  margin-top: $space-md;
  padding-top: $space-md;
  border-top: 1rpx solid $color-divider;

  [data-theme="dark"] & {
    border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }

  .trace-item {
    display: flex;
    padding-bottom: $space-md;
    position: relative;

    &.is-first {
      .trace-dot {
        background: $color-primary;

        [data-theme="dark"] & {
          background: var(--color-primary, #E879F9);
        }
      }

      .trace-text {
        color: $color-primary;

        [data-theme="dark"] & {
          color: var(--color-primary, #E879F9);
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: 7rpx;
      top: 24rpx;
      width: 2rpx;
      height: calc(100% - 8rpx);
      background: $color-border;

      [data-theme="dark"] & {
        background: var(--color-border, rgba(255, 255, 255, 0.12));
      }
    }

    &:last-child::before {
      display: none;
    }

    .trace-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: $color-border;
      flex-shrink: 0;
      margin-top: 4rpx;
    }

    .trace-content {
      margin-left: $space-sm;
      flex: 1;

      .trace-text {
        font-size: $font-size-xs;
        color: $color-text-sub;
        display: block;

        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }

      .trace-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
        margin-top: 4rpx;
        display: block;
      }
    }
  }
}

.seller-info {
  display: flex;
  align-items: center;

  .seller-detail {
    flex: 1;
    margin-left: $space-md;

    .seller-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
      display: block;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .seller-phone {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: 4rpx;
      display: block;

      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }
  }
}

.detail-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  .footer-content {
    padding: $space-md;
    padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
    background: $color-bg-card;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid $color-border;

    [data-theme="dark"] & {
      background: rgba(22, 22, 30, 0.9);
      border-top-color: var(--glass-border, rgba(255, 255, 255, 0.12));
    }
  }

  .footer-actions {
    display: flex;
    gap: $space-md;

    :deep(.ui-button) {
      flex: 1;
      height: 80rpx;
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      border-radius: $radius-lg;

      &[type="primary"] {
        background: $gradient-sunset;
        border: none;

        [data-theme="dark"] & {
          background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
        }
      }
    }
  }
}

.logistics-popup {
  background: $color-bg-card;
  border-radius: $radius-xl $radius-xl 0 0;
  padding-bottom: env(safe-area-inset-bottom);

  [data-theme="dark"] & {
    background: var(--color-bg-card, #1C1C1E);
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-lg;
    border-bottom: 1rpx solid $color-divider;

    [data-theme="dark"] & {
      border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }

    .popup-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .popup-close {
      padding: $space-xs;
    }
  }

  .popup-form {
    padding: $space-lg;

    .form-item {
      margin-bottom: $space-md;

      .form-label {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-bottom: $space-xs;
        display: block;

        [data-theme="dark"] & {
          color: var(--color-text-sub, #A1A1AA);
        }
      }
    }
  }
}
</style>
