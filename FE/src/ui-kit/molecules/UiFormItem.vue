<template>
  <view class="ui-form-item">
    <view class="form-label" v-if="label">
      <text class="label-text">{{ label }}</text>
      <text v-if="required" class="label-required">*</text>
    </view>
    <view class="form-content">
      <slot />
    </view>
    <view class="form-error" v-if="error">
      <text class="error-text">{{ error }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  required?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  label: '',
  required: false,
  error: ''
});
</script>

<style lang="scss" scoped>
.ui-form-item {
  margin-bottom: $space-lg;
  
  .form-label {
    display: flex;
    align-items: center;
    margin-bottom: $space-sm;
    
    .label-text {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .label-required {
      color: var(--color-error, #FF3B30);
      margin-left: 4rpx;
    }
  }
  
  .form-content {
    position: relative;
  }
  
  .form-error {
    margin-top: $space-xs;
    
    .error-text {
      font-size: $font-size-xs;
      color: var(--color-error, #FF3B30);
    }
  }
}
</style>
