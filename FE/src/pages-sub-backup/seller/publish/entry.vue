<template>
  <view class="publish-page">
    <ui-sub-navbar title="发布闲置" />
    
    <view class="publish-container">
      <view class="form-section">
        <view class="form-label">商品标题</view>
        <ui-input 
          v-model="form.title" 
          placeholder="标题越详细越容易卖出" 
          :maxlength="50"
        />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品描述</view>
        <textarea 
          class="desc-textarea" 
          v-model="form.description"
          placeholder="描述商品的来源、使用情况、优缺点�?.."
          :maxlength="500"
        />
        <text class="word-count">{{ form.description.length }}/500</text>
      </view>
      
      <view class="form-section">
        <view class="form-label">上传图片</view>
        <ui-upload v-model="form.images" :max-count="9" />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品分类</view>
        <view class="category-select" @click="showCategoryPicker = true">
          <text :class="{ placeholder: !form.category }">
            {{ form.category || '请选择分类' }}
          </text>
          <ui-icon name="arrow-right" :size="16" />
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
            @click="form.condition = item"
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
            v-model="form.price" 
            placeholder="0"
            class="price-field"
          />
        </view>
      </view>
      
      <view class="form-section">
        <view class="form-label">是否支持议价</view>
        <ui-switch v-model="form.canBargin" />
      </view>
      
      <view class="form-section">
        <view class="form-label">商品规格 (选填)</view>
        <ui-input 
          v-model="form.specs" 
          placeholder="�? iPhone 13 Pro Max / 256G / 远峰�? 
        />
      </view>
      
      <view class="publish-btn-wrapper">
        <ui-button block @click="handlePublish">发布闲置</ui-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  title: '',
  description: '',
  images: [] as string[],
  category: '',
  condition: '',
  price: '',
  canBargin: false,
  specs: ''
});

const conditions = ['全新', '99�?, '95�?, '9�?, '85�?, '8新及以下'];
const showCategoryPicker = ref(false);

const handlePublish = () => {
  if (!form.value.title) {
    uni.showToast({ title: '请输入商品标�?, icon: 'none' });
    return;
  }
  if (!form.value.description) {
    uni.showToast({ title: '请输入商品描�?, icon: 'none' });
    return;
  }
  if (!form.value.price) {
    uni.showToast({ title: '请输入商品价�?, icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '发布�?..' });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '发布成功', icon: 'success' });
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
