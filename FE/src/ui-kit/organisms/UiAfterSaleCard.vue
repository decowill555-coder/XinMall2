<template>
  <view class="ui-after-sale-card" @click="emit('click')">
    <view class="card-header">
      <text class="order-no">订单号: {{ orderNo }}</text>
      <text class="status" :class="statusClass">{{ statusText }}</text>
    </view>
    
    <view class="card-goods">
      <ui-image :src="cover" width="100rpx" height="100rpx" radius="8rpx" />
      <view class="goods-info">
        <text class="goods-title">{{ title }}</text>
        <text class="goods-spec">{{ spec }}</text>
      </view>
    </view>
    
    <view class="card-info">
      <view class="info-item">
        <text class="info-label">售后类型</text>
        <text class="info-value">{{ type }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">申请原因</text>
        <text class="info-value">{{ reason }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">申请时间</text>
        <text class="info-value">{{ time }}</text>
      </view>
    </view>
    
    <view class="card-actions" v-if="showActions">
      <slot name="actions">
        <ui-button size="sm" @click.stop="emit('reject')">拒绝</ui-button>
        <ui-button size="sm" type="primary" @click.stop="emit('agree')">同意</ui-button>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  orderNo?: string;
  cover?: string;
  title?: string;
  spec?: string;
  type?: string;
  reason?: string;
  time?: string;
  status?: string;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  orderNo: '',
  cover: '',
  title: '',
  spec: '',
  type: '',
  reason: '',
  time: '',
  status: '',
  showActions: false
});

const emit = defineEmits(['click', 'agree', 'reject']);

const statusMap: Record<string, { text: string; class: string }> = {
  pending: { text: '待处理', class: 'warning' },
  processing: { text: '处理中', class: 'primary' },
  completed: { text: '已完成', class: 'success' }
};

const statusText = computed(() => statusMap[props.status]?.text || '未知');
const statusClass = computed(() => statusMap[props.status]?.class || '');
</script>

<style lang="scss" scoped>
.ui-after-sale-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .order-no {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
    
    .status {
      font-size: $font-size-sm;
      
      &.warning { color: var(--color-warning, #FF9500); }
      &.primary { color: var(--color-primary, #FF6A00); }
      &.success { color: var(--color-success, #34C759); }
    }
  }
  
  .card-goods {
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
  
  .card-info {
    .info-item {
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
  }
  
  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: $space-sm;
    margin-top: $space-md;
    padding-top: $space-md;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  }
}
</style>
