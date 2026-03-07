<template>
  <view class="publish-page">
    <ui-sub-navbar title="发布商品" />
    
    <scroll-view scroll-y class="publish-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="publish-form">
        
        <ui-form-item label="商品图片" required>
          <ui-upload 
            v-model="form.images" 
            :max="9" 
            multiple 
          />
        </ui-form-item>
        
        <ui-form-item label="商品名称" required>
          <ui-input 
            v-model="form.title" 
            placeholder="请输入商品名称（最多50字）" 
            :maxlength="50"
          />
        </ui-form-item>
        
        <ui-form-item label="商品描述" required>
          <ui-textarea 
            v-model="form.description" 
            placeholder="请描述商品详情，如品牌、型号、购买渠道、使用时长等"
            :maxlength="500"
            :rows="4"
          />
        </ui-form-item>
        
        <ui-form-item label="分类" required>
          <view class="category-picker" @click="showCategoryPicker = true">
            <text class="category-text" :class="{ placeholder: !form.categoryName }">
              {{ form.categoryName || '请选择分类' }}
            </text>
            <ui-icon name="chevron-right" :size="32" />
          </view>
        </ui-form-item>
        
        <ui-form-item label="成色" required>
          <ui-condition-picker v-model="form.condition" />
        </ui-form-item>
        
        <ui-form-item label="价格" required>
          <ui-price-input v-model="form.price" placeholder="请输入价格" />
        </ui-form-item>
        
        <ui-form-item label="原价">
          <ui-price-input v-model="form.originalPrice" placeholder="请输入原价（选填）" />
        </ui-form-item>
        
        <ui-form-item label="库存" required>
          <ui-input 
            v-model="form.stock" 
            type="number" 
            placeholder="请输入库存数量"
          />
        </ui-form-item>
        
        <ui-form-item label="发货方式">
          <view class="delivery-options">
            <view 
              v-for="item in deliveryOptions" 
              :key="item.value"
              class="delivery-item"
              :class="{ active: form.deliveryMethod === item.value }"
              @click="form.deliveryMethod = item.value"
            >
              <ui-icon :name="item.icon" :size="32" />
              <text>{{ item.label }}</text>
            </view>
          </view>
        </ui-form-item>
        
        <ui-form-item label="所在地区">
          <view class="location-picker" @click="chooseLocation">
            <text class="location-text" :class="{ placeholder: !form.location }">
              {{ form.location || '请选择地区' }}
            </text>
            <ui-icon name="map-pin" :size="32" />
          </view>
        </ui-form-item>
        
      </view>
    </scroll-view>
    
    <view class="publish-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="default" @click="saveDraft">存草稿</ui-button>
      <ui-button type="primary" @click="publish">发布</ui-button>
    </view>
    
    <ui-popup v-model="showCategoryPicker" position="bottom" radius="top">
      <view class="category-picker-popup">
        <view class="popup-header">
          <text class="popup-title">选择分类</text>
          <view class="popup-close" @click="showCategoryPicker = false">
            <ui-icon name="x" :size="32" />
          </view>
        </view>
        <scroll-view scroll-y class="popup-content">
          <view 
            v-for="cat in categories" 
            :key="cat.id" 
            class="category-item"
            :class="{ active: form.categoryId === cat.id }"
            @click="selectCategory(cat)"
          >
            <text>{{ cat.name }}</text>
            <ui-icon v-if="form.categoryId === cat.id" name="check" :size="32" color="#FF6A00" />
          </view>
        </scroll-view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

const form = reactive({
  images: [] as string[],
  title: '',
  description: '',
  categoryId: 0,
  categoryName: '',
  condition: 100,
  price: '',
  originalPrice: '',
  stock: '',
  deliveryMethod: 'express',
  location: ''
});

const showCategoryPicker = ref(false);

const deliveryOptions = [
  { label: '快递', value: 'express', icon: 'package' },
  { label: '自提', value: 'pickup', icon: 'map-pin' },
  { label: '同城配送', value: 'local', icon: 'truck' }
];

const categories = ref([
  { id: 1, name: '手机' },
  { id: 2, name: '电脑' },
  { id: 3, name: '平板' },
  { id: 4, name: '耳机' },
  { id: 5, name: '相机' },
  { id: 6, name: '游戏机' },
  { id: 7, name: '配件' },
  { id: 8, name: '其他' }
]);

const selectCategory = (cat: any) => {
  form.categoryId = cat.id;
  form.categoryName = cat.name;
  showCategoryPicker.value = false;
};

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      form.location = res.name || res.address;
    }
  });
};

const saveDraft = () => {
  uni.showToast({ title: '已保存草稿', icon: 'success' });
};

const publish = () => {
  if (!form.title) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' });
    return;
  }
  if (!form.categoryId) {
    uni.showToast({ title: '请选择分类', icon: 'none' });
    return;
  }
  if (!form.price) {
    uni.showToast({ title: '请输入价格', icon: 'none' });
    return;
  }
  
  uni.showToast({ title: '发布成功', icon: 'success' });
  setTimeout(() => {
    smartBack();
  }, 1500);
};
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.publish-scroll {
  overflow: hidden;
}

.publish-form {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
}

.category-picker,
.location-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  border-radius: $radius-md;
  
  .category-text,
  .location-text {
    font-size: $font-size-md;
    color: $color-text-main;
    
    &.placeholder {
      color: $color-text-placeholder;
    }
  }
}

.delivery-options {
  display: flex;
  gap: $space-sm;
  
  .delivery-item {
    flex: 1;
    @include flex-column-center;
    padding: $space-md 0;
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
    backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
    border-radius: $radius-md;
    border: 1px solid transparent;
    transition: all $duration-fast $ease-spring;
    
    text {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
    
    &.active {
      border-color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
      
      text { color: var(--color-primary, #FF6A00); }
    }
  }
}

.publish-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: $space-md;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.category-picker-popup {
  height: 70vh;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .popup-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .popup-close {
      padding: $space-xs;
    }
  }
  
  .popup-content {
    height: calc(70vh - 100rpx);
  }
  
  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    text {
      font-size: $font-size-md;
      color: $color-text-main;
    }
    
    &.active text {
      color: var(--color-primary, #FF6A00);
    }
  }
}
</style>
