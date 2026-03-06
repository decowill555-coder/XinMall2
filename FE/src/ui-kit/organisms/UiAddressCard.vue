<template>
  <view class="ui-address-card" @click="emit('click')">
    <view class="address-info">
      <view class="address-header">
        <text class="name">{{ name }}</text>
        <text class="phone">{{ phone }}</text>
        <ui-tag v-if="isDefault" type="primary" size="md">默认</ui-tag>
      </view>
      <text class="address-detail">{{ fullAddress }}</text>
    </view>
    
    <view class="address-actions" v-if="showActions">
      <view class="action-item" @click.stop="emit('setDefault')">
        <ui-icon 
          :name="isDefault ? 'check-circle-fill' : 'circle'" 
          :size="40" 
          :color="isDefault ? '#1ABC9C' : ''" 
        />
        <text>默认</text>
      </view>
      <view class="action-item" @click.stop="emit('edit')">
        <ui-icon name="edit" :size="40" />
        <text>编辑</text>
      </view>
      <view class="action-item" @click.stop="emit('delete')">
        <ui-icon name="trash" :size="40" />
        <text>删除</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
  isDefault?: boolean;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
  showActions: true
});

const emit = defineEmits(['click', 'setDefault', 'edit', 'delete']);

const fullAddress = computed(() => {
  return `${props.province}${props.city}${props.district}${props.detail}`;
});
</script>

<style lang="scss" scoped>
.ui-address-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .address-info {
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
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .action-item {
      display: flex;
      align-items: center;
      font-size: $font-size-xs;
      color: $color-text-sub;
      
      text { margin-left: $space-xs; }
    }
  }
}
</style>
