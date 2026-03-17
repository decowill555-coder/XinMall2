<template>
  <view class="aftersale-apply-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>

    <ui-sub-navbar title="申请售后" />

    <scroll-view scroll-y class="apply-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="apply-content">
        <!-- 商品信息 -->
        <view class="goods-card">
          <view class="card-content">
            <view class="section-title">商品信息</view>
            <view class="goods-item">
              <ui-image :src="orderInfo.product?.cover" width="160rpx" height="160rpx" radius="16rpx" />
              <view class="goods-info">
                <text class="goods-title">{{ orderInfo.product?.title }}</text>
                <text class="goods-spec">{{ orderInfo.product?.spec || '默认规格' }}</text>
                <view class="goods-bottom">
                  <ui-price :value="orderInfo.product?.price || 0" :size="28" />
                  <text class="goods-quantity">x{{ orderInfo.quantity }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 售后类型 -->
        <view class="type-card">
          <view class="card-content">
            <view class="section-title">售后类型</view>
            <view class="type-list">
              <view
                v-for="item in typeOptions"
                :key="item.value"
                class="type-item"
                :class="{ active: form.type === item.value }"
                @click="selectType(item.value)"
              >
                <view class="type-icon">
                  <ui-icon :name="item.icon" :size="40" />
                </view>
                <text class="type-name">{{ item.label }}</text>
                <view v-if="form.type === item.value" class="type-check">
                  <ui-icon name="check" :size="28" color="white" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 申请原因 -->
        <view class="reason-card">
          <view class="card-content">
            <view class="section-title">申请原因</view>
            <view class="reason-list">
              <view
                v-for="reason in reasonList"
                :key="reason"
                class="reason-item"
                :class="{ active: form.reason === reason }"
                @click="form.reason = reason"
              >
                <text class="reason-text">{{ reason }}</text>
                <view class="reason-check">
                  <ui-icon v-if="form.reason === reason" name="check" :size="28" color="#D946EF" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 问题描述 -->
        <view class="desc-card">
          <view class="card-content">
            <view class="section-title">问题描述</view>
            <textarea
              v-model="form.description"
              class="desc-input"
              placeholder="请详细描述您遇到的问题，以便商家更好地为您处理"
              :maxlength="500"
            />
            <text class="word-count">{{ form.description.length }}/500</text>
          </view>
        </view>

        <!-- 凭证图片 -->
        <view class="image-card">
          <view class="card-content">
            <view class="section-title">上传凭证</view>
            <text class="section-desc">最多上传3张图片</text>
            <ui-upload
              v-model="imageList"
              :max-count="3"
              @after-read="handleUploadImage"
            />
          </view>
        </view>

        <!-- 退款金额 -->
        <view v-if="form.type !== 'exchange'" class="amount-card">
          <view class="card-content">
            <view class="section-title">退款金额</view>
            <view class="amount-info">
              <text class="amount-label">退款金额</text>
              <view class="amount-input-wrapper">
                <text class="currency">¥</text>
                <input
                  v-model="form.refundAmount"
                  type="digit"
                  class="amount-input"
                  placeholder="请输入退款金额"
                />
              </view>
            </view>
            <view class="amount-tip">
              <text class="tip-text">最多可退 ¥{{ maxRefundAmount.toFixed(2) }}</text>
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
                <text class="info-value">{{ orderInfo.orderNo }}</text>
                <text class="copy-btn" @click="copyOrderNo">复制</text>
              </view>
            </view>
            <view class="info-item">
              <text class="info-label">下单时间</text>
              <text class="info-value">{{ orderInfo.createdAt }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交栏 -->
    <view class="apply-footer">
      <view class="footer-content">
        <ui-button type="primary" block :disabled="!canSubmit" :loading="submitting" @click="handleSubmit">
          提交申请
        </ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { aftersaleApi, type AftersaleType } from '@/api/aftersale';
import { tradeApi, type OrderDetail } from '@/api/trade';
import { uploadApi } from '@/api/upload';
import { logError } from '@/utils/logger';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

// 订单ID
const orderId = ref('');

// 订单信息
const orderInfo = ref<Partial<OrderDetail>>({
  id: '',
  orderNo: '',
  status: 'paid',
  product: {
    id: '',
    cover: '',
    title: '',
    price: 0,
    condition: ''
  },
  quantity: 1,
  totalAmount: 0,
  createdAt: ''
});

// 表单数据
const form = ref({
  type: 'refund_only' as AftersaleType,
  reason: '',
  description: '',
  refundAmount: 0
});

// 图片列表
const imageList = ref<{ url: string; status?: string }[]>([]);

// 提交状态
const submitting = ref(false);

// 售后类型选项
const typeOptions = [
  { value: 'refund_only' as AftersaleType, label: '仅退款', icon: 'wallet' },
  { value: 'refund_return' as AftersaleType, label: '退货退款', icon: 'package' },
  { value: 'exchange' as AftersaleType, label: '换货', icon: 'repeat' }
];

// 原因列表（根据类型动态切换）
const reasonList = ref<string[]>([]);

// 原因映射
const reasonMap: Record<AftersaleType, string[]> = {
  refund_only: [
    '不想要了',
    '拍错/多拍/不想要',
    '商品信息描述不符',
    '商品有质量问题',
    '未按约定时间发货',
    '其他原因'
  ],
  refund_return: [
    '商品有质量问题',
    '商品损坏/少件',
    '商品信息描述不符',
    '收到商品与描述不符',
    '商品是假冒产品',
    '其他原因'
  ],
  exchange: [
    '商品有质量问题',
    '商品损坏/少件',
    '商品信息描述不符',
    '收到商品与描述不符',
    '商品型号/规格错误',
    '其他原因'
  ]
};

// 最大退款金额
const maxRefundAmount = computed(() => {
  return orderInfo.value.totalAmount || 0;
});

// 是否可提交
const canSubmit = computed(() => {
  return (
    form.value.type &&
    form.value.reason &&
    form.value.description.trim().length >= 10 &&
    (form.value.type === 'exchange' || form.value.refundAmount > 0)
  );
});

// 监听类型变化，切换原因列表
watch(
  () => form.value.type,
  (newType) => {
    reasonList.value = reasonMap[newType] || [];
    form.value.reason = '';
    // 重新获取原因列表（如果有接口）
    fetchReasons(newType);
  }
);

// 获取原因列表
const fetchReasons = async (type: AftersaleType) => {
  try {
    const reasons = await aftersaleApi.getAftersaleReasons(type);
    if (reasons && reasons.length > 0) {
      reasonList.value = reasons;
    }
  } catch (error) {
    // 使用默认原因列表
    logError('获取原因列表失败:', error);
  }
};

// 获取订单详情
const fetchOrderDetail = async () => {
  if (!orderId.value) {
    uni.showToast({ title: '订单参数错误', icon: 'none' });
    return;
  }

  try {
    const result = await tradeApi.getOrderDetail(orderId.value);
    orderInfo.value = result;
    // 默认填充订单金额
    form.value.refundAmount = result.totalAmount;
  } catch (error) {
    logError('获取订单详情失败:', error);
    uni.showToast({ title: '获取订单信息失败', icon: 'none' });
  }
};

// 选择售后类型
const selectType = (type: AftersaleType) => {
  form.value.type = type;
};

// 上传图片
const handleUploadImage = async (files: string[]) => {
  for (const file of files) {
    const item = { url: file, status: 'uploading' as const };
    imageList.value.push(item);

    try {
      const result = await uploadApi.uploadImage(file, 'other');
      item.url = result.fileUrl;
      item.status = 'done';
    } catch (error) {
      item.status = 'error';
      logError('上传图片失败:', error);
      uni.showToast({ title: '图片上传失败', icon: 'none' });
    }
  }
};

// 复制订单号
const copyOrderNo = () => {
  if (orderInfo.value.orderNo) {
    uni.setClipboardData({
      data: orderInfo.value.orderNo,
      success: () => {
        uni.showToast({ title: '复制成功', icon: 'success' });
      }
    });
  }
};

// 提交申请
const handleSubmit = async () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完善申请信息', icon: 'none' });
    return;
  }

  // 验证退款金额
  if (form.value.type !== 'exchange' && form.value.refundAmount > maxRefundAmount.value) {
    uni.showToast({ title: '退款金额不能超过订单金额', icon: 'none' });
    return;
  }

  submitting.value = true;

  try {
    // 收集已上传成功的图片URL
    const images = imageList.value
      .filter((item) => item.status === 'done')
      .map((item) => item.url);

    const result = await aftersaleApi.createAftersale({
      orderId: orderId.value,
      type: form.value.type,
      reason: form.value.reason,
      description: form.value.description,
      images: images.length > 0 ? images : undefined,
      refundAmount: form.value.type !== 'exchange' ? form.value.refundAmount : undefined
    });

    uni.showToast({ title: '申请提交成功', icon: 'success' });

    // 跳转到详情页 - 后端返回的是直接的ID数字
    const aftersaleId = typeof result === 'object' ? result.id : result;
    setTimeout(() => {
      uni.redirectTo({
        url: `/pages-sub/trade/aftersale/detail?id=${aftersaleId}`
      });
    }, 1500);
  } catch (error) {
    logError('提交售后申请失败:', error);
    uni.showToast({ title: '提交失败，请重试', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  // 获取URL参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  orderId.value = (currentPage as any).options?.orderId || '';

  // 初始化原因列表
  reasonList.value = reasonMap[form.value.type];

  // 获取订单详情
  fetchOrderDetail();

  // 获取原因列表
  fetchReasons(form.value.type);
});
</script>

<style lang="scss" scoped>
.aftersale-apply-page {
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

.apply-scroll {
  overflow: hidden;
}

.apply-content {
  padding: $space-md;
  padding-bottom: 160rpx;
}

.goods-card, .type-card, .reason-card, .desc-card, .image-card, .amount-card, .order-card {
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

.section-desc {
  font-size: $font-size-xs;
  color: $color-text-sub;
  margin-top: -$space-sm;
  margin-bottom: $space-md;
  display: block;

  [data-theme="dark"] & {
    color: var(--color-text-sub, #A1A1AA);
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

.type-list {
  display: flex;
  gap: $space-md;

  .type-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-md 0;
    border-radius: $radius-lg;
    border: 2rpx solid $color-border;
    position: relative;
    transition: all 0.3s ease;

    [data-theme="dark"] & {
      border-color: var(--color-border, rgba(255, 255, 255, 0.12));
    }

    &.active {
      border-color: $color-primary;
      background: rgba($color-primary, 0.05);

      [data-theme="dark"] & {
        border-color: var(--color-primary, #E879F9);
        background: rgba(217, 70, 239, 0.1);
      }

      .type-icon {
        color: $color-primary;

        [data-theme="dark"] & {
          color: var(--color-primary, #E879F9);
        }
      }

      .type-name {
        color: $color-primary;

        [data-theme="dark"] & {
          color: var(--color-primary, #E879F9);
        }
      }
    }

    .type-icon {
      color: $color-text-sub;
      margin-bottom: $space-xs;

      [data-theme="dark"] & {
        color: var(--color-text-sub, #A1A1AA);
      }
    }

    .type-name {
      font-size: $font-size-sm;
      color: $color-text-main;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }

    .type-check {
      position: absolute;
      top: 0;
      right: 0;
      width: 40rpx;
      height: 40rpx;
      background: $color-primary;
      border-radius: 0 $radius-lg 0 $radius-lg;
      @include flex-center;

      [data-theme="dark"] & {
        background: var(--color-primary, #E879F9);
      }
    }
  }
}

.reason-list {
  .reason-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    border-bottom: 1rpx solid $color-divider;

    [data-theme="dark"] & {
      border-bottom-color: var(--color-divider, rgba(255, 255, 255, 0.08));
    }

    &:last-child {
      border-bottom: none;
    }

    &.active {
      .reason-text {
        color: $color-primary;

        [data-theme="dark"] & {
          color: var(--color-primary, #E879F9);
        }
      }
    }

    .reason-text {
      font-size: $font-size-md;
      color: $color-text-main;

      [data-theme="dark"] & {
        color: var(--color-text-main, #F2F2F7);
      }
    }
  }
}

.desc-input {
  width: 100%;
  height: 200rpx;
  padding: $space-md;
  background: $color-bg-gray;
  border-radius: $radius-md;
  font-size: $font-size-md;
  box-sizing: border-box;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-main, #F2F2F7);
  }
}

.word-count {
  display: block;
  text-align: right;
  font-size: $font-size-xs;
  color: $color-text-disabled;
  margin-top: $space-xs;
}

.amount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md 0;

  .amount-label {
    font-size: $font-size-md;
    color: $color-text-main;

    [data-theme="dark"] & {
      color: var(--color-text-main, #F2F2F7);
    }
  }

  .amount-input-wrapper {
    display: flex;
    align-items: center;

    .currency {
      font-size: $font-size-md;
      color: $color-error;
      margin-right: $space-xs;

      [data-theme="dark"] & {
        color: var(--color-error, #FF4081);
      }
    }

    .amount-input {
      width: 200rpx;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-error;
      text-align: right;

      [data-theme="dark"] & {
        color: var(--color-error, #FF4081);
      }
    }
  }
}

.amount-tip {
  padding-top: $space-sm;
  border-top: 1rpx solid $color-divider;

  [data-theme="dark"] & {
    border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }

  .tip-text {
    font-size: $font-size-xs;
    color: $color-text-sub;

    [data-theme="dark"] & {
      color: var(--color-text-sub, #A1A1AA);
    }
  }
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-sm 0;

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
}

.apply-footer {
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

    :deep(.ui-button) {
      height: 88rpx;
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

      &[disabled] {
        opacity: 0.5;
      }
    }
  }
}
</style>
