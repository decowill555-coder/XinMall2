<template>
  <view class="goods-edit-page">
    <ui-sub-navbar title="编辑商品" />
    
    <scroll-view scroll-y class="edit-scroll">
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">商品图片</text>
          <ui-upload v-model="goodsInfo.images" :max-count="9" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品标题</text>
          <input class="form-input" v-model="goodsInfo.title" placeholder="请输入商品标�? :maxlength="50" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品描述</text>
          <textarea class="form-textarea" v-model="goodsInfo.description" placeholder="请输入商品描�? :maxlength="500" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品分类</text>
          <view class="form-select">
            <text>{{ goodsInfo.category || '请选择分类' }}</text>
            <ui-icon name="arrow-right" :size="16" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">商品成色</text>
          <view class="condition-list">
            <view 
              v-for="item in conditions" 
              :key="item"
              class="condition-item"
              :class="{ active: goodsInfo.condition === item }"
              @click="goodsInfo.condition = item"
            >
              {{ item }}
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">商品规格</text>
          <input class="form-input" v-model="goodsInfo.spec" placeholder="�? 256GB / 钛金属原�? />
        </view>
        
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">售价</text>
            <view class="price-input">
              <text class="price-symbol">¥</text>
              <input type="digit" v-model="goodsInfo.price" placeholder="0" />
            </view>
          </view>
          <view class="form-item half">
            <text class="form-label">库存</text>
            <input type="number" class="form-input" v-model="goodsInfo.stock" placeholder="0" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">原价（选填�?/text>
            <view class="price-input">
            <text class="price-symbol">¥</text>
            <input type="digit" v-model="goodsInfo.originalPrice" placeholder="0" />
          </view>
        </view>
        
        <view class="switch-section">
          <view class="switch-item">
            <text class="switch-label">支持议价</text>
            <ui-switch v-model="goodsInfo.canBargin" />
          </view>
          <view class="switch-item">
            <text class="switch-label">推荐商品</text>
            <ui-switch v-model="goodsInfo.isRecommend" />
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="edit-footer">
      <ui-button block @click="handleSaveDraft">存草�?/ui-button>
      <ui-button type="primary" block @click="handleSubmit">保存商品</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const conditions = ['全新', '99�?, '95�?, '9�?, '85�?, '8新及以下'];

const goodsInfo = ref({
  images: [
    'https://picsum.photos/400/400?random=e1',
    'https://picsum.photos/400/400?random=e2'
  ],
  title: 'iPhone 15 Pro Max 256GB 钛金属原�?,
  description: '自用 iPhone 15 Pro Max�?9新，无任何划痕、磕碰。配件齐全，盒子、充电器、数据线都在。电池健康度 95%�?,
  category: '手机',
  condition: '99�?,
  spec: '256GB / 钛金属原�?,
  price: '7999',
  originalPrice: '9999',
  stock: '10',
  canBargin: true,
  isRecommend: true
});

const handleSaveDraft = () => {
  uni.showToast({ title: '已保存草�?, icon: 'success' });
};

const handleSubmit = () => {
  if (!goodsInfo.value.title) {
    uni.showToast({ title: '请输入商品标�?, icon: 'none' });
    return;
  }
  if (!goodsInfo.value.price) {
    uni.showToast({ title: '请输入商品价�?, icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '保存�?..' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.goods-edit-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.edit-scroll {
  height: calc(100vh - 88rpx - 120rpx);
  padding: $space-sm $space-md;
}

.form-section {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  
  .form-item {
    margin-bottom: $space-lg;
    
    &:last-child { margin-bottom: 0; }
    
    .form-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-bottom: $space-sm;
    }
    
    .form-input {
      width: 100%;
      height: 80rpx;
      padding: 0 $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: $color-text-main;
      box-sizing: border-box;
    }
    
    .form-textarea {
      width: 100%;
      height: 160rpx;
      padding: $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: $color-text-main;
      box-sizing: border-box;
    }
    
    .form-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding: 0 $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
    }
    
    .condition-list {
      display: flex;
      flex-wrap: wrap;
      gap: $space-sm;
      
      .condition-item {
        padding: $space-sm $space-md;
        background: $color-bg-gray;
        border-radius: $radius-sm;
        font-size: $font-size-sm;
        color: $color-text-sub;
        
        &.active {
          color: $color-primary;
          background: rgba($color-primary, 0.1);
        }
      }
    }
    
    .price-input {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 $space-md;
      background: $color-bg-gray;
      border-radius: $radius-sm;
      
      .price-symbol {
        font-size: $font-size-lg;
        color: $color-error;
        margin-right: $space-xs;
      }
      
      input {
        flex: 1;
        font-size: $font-size-lg;
        color: $color-text-main;
      }
    }
  }
  
  .form-row {
    display: flex;
    gap: $space-md;
    
    .form-item.half {
      flex: 1;
    }
  }
}

.switch-section {
  margin-top: $space-md;
  padding-top: $space-md;
  border-top: 1rpx solid $color-divider;
  
  .switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    
    .switch-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
}

.edit-footer {
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
