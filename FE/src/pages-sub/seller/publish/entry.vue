<template>
  <view class="publish-page">
    <ui-sub-navbar title="发布闲置" />
    
    <view class="publish-container">
      <view class="form-section">
        <view class="form-label">商品标题</view>
        <ui-input 
          :model-value="form.title" 
          placeholder="标题越详细越容易卖出" 
          :maxlength="50"
          @update:model-value="publishStore.state.title = $event"
        />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品描述</view>
        <textarea 
          class="desc-textarea" 
          :value="form.description"
          placeholder="描述商品的来源、使用情况、优缺点等..."
          :maxlength="500"
          @input="publishStore.state.description = $event.detail.value"
        />
        <text class="word-count">{{ form.description.length }}/500</text>
      </view>
      
      <view class="form-section">
        <view class="form-label">上传图片</view>
        <ui-upload :model-value="form.images" :max-count="9" @update:model-value="publishStore.state.images = $event" />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品分类</view>
        <view class="category-select" @click="showCategoryPicker = true">
          <text :class="{ placeholder: !form.spuId }">
            {{ form.spuId || '请选择分类' }}
          </text>
          <ui-icon name="arrow-right" ::size="32" />
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-label">商品成色</view>
        <view class="condition-list">
          <view 
            v-for="item in conditions" 
            :key="item"
            class="condition-item"
            :class="{ active: form.condition === item }"
            @click="publishStore.updateCondition(item === '全新' ? 100 : parseInt(item))"
          >
            {{ item }}
          </view>
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-label">出售价格</view>
        <view class="price-input">
          <text class="price-symbol">¥</text>
          <input 
            type="digit" 
            :value="form.price" 
            placeholder="0"
            class="price-field"
            @input="publishStore.updatePrice(parseFloat($event.detail.value) || 0)"
          />
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-label">是否支持议价</view>
        <ui-switch :model-value="form.isAgreementSigned" @update:model-value="publishStore.toggleAgreement($event)" />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品规格 (选填)</view>
        <ui-input 
          :model-value="form.selectedSkuId || ''" 
          placeholder="如: iPhone 13 Pro Max / 256G / 远峰蓝" 
        />
      </view>
      
      <view class="publish-btn-wrapper">
        <ui-button block :disabled="form.isSubmitting" @click="handlePublish">
          {{ form.isSubmitting ? '发布中...' : '发布闲置' }}
        </ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePublishStore, useAuthStore } from '@/stores';

const publishStore = usePublishStore();
const authStore = useAuthStore();

const form = computed(() => publishStore.state);

const conditions = ['全新', '99新', '95新', '9新', '85新', '8新及以下'];
const showCategoryPicker = false;

const handlePublish = () => {
  if (!form.value.title && !form.value.description) {
    uni.showToast({ title: '请输入商品信息', icon: 'none' });
    return;
  }
  if (!publishStore.isFormValid) {
    uni.showToast({ title: '请完善商品信息', icon: 'none' });
    return;
  }
  
  if (!authStore.isAuthenticated) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    setTimeout(() => {
      uni.navigateTo({ url: '/pages-sub/user/login/index' });
    }, 1500);
    return;
  }
  
  publishStore.setSubmitting(true);
  
  setTimeout(() => {
    publishStore.setSubmitting(false);
    uni.showToast({ title: '发布成功', icon: 'success' });
    publishStore.reset();
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 200rpx;
}

.publish-container {
  padding: $space-md;
}

.form-section {
  margin-bottom: $space-lg;
  
  .form-label {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-sm;
  }
}

.desc-textarea {
  width: 100%;
  height: 240rpx;
  padding: $space-md;
  background: $color-white;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $color-text-main;
  box-sizing: border-box;
}

.word-count {
  display: block;
  text-align: right;
  font-size: $font-size-xs;
  color: $color-text-placeholder;
  margin-top: $space-xs;
}

.category-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  background: $color-white;
  border-radius: $radius-md;
  
  .placeholder {
    color: $color-text-placeholder;
  }
}

.condition-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  
  .condition-item {
    padding: $space-sm $space-md;
    background: $color-white;
    border-radius: $radius-sm;
    font-size: $font-size-sm;
    color: $color-text-sub;
    border: 1px solid transparent;
    
    &.active {
      color: $color-primary;
      border-color: $color-primary;
      background: $color-primary-light;
    }
  }
}

.price-input {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  background: $color-white;
  border-radius: $radius-md;
  
  .price-symbol {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-error;
    margin-right: $space-xs;
  }
  
  .price-field {
    flex: 1;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
}

.publish-btn-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
