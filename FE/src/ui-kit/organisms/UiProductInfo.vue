<template>
  <view class="ui-product-info">
    <view class="price-row">
      <ui-price :value="price" type="main" :size="48" />
      <view v-if="originalPrice" class="original-price">
        ¥{{ originalPrice }}
      </view>
    </view>
    
    <view class="product-title">{{ title }}</view>
    
    <view class="tags-row" v-if="tags?.length">
      <ui-tag 
        v-for="(tag, index) in tags" 
        :key="index"
        :type="tag.type"
        size="sm"
      >
        {{ tag.text }}
      </ui-tag>
    </view>
    
    <view class="specs-info" v-if="specs && Object.keys(specs).length">
      <view class="specs-item" v-for="(value, key) in specs" :key="key">
        <text class="specs-label">{{ key }}:</text>
        <text class="specs-value">{{ value }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TagItem {
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

interface Props {
  price?: number;
  originalPrice?: number;
  title?: string;
  tags?: TagItem[];
  specs?: Record<string, string>;
}

withDefaults(defineProps<Props>(), {
  price: 0,
  title: '',
  tags: () => [],
  specs: () => ({})
});
</script>

<style lang="scss" scoped>
.ui-product-info {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  margin-bottom: $space-sm;
  
  .price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: $space-sm;
    
    .original-price {
      margin-left: $space-sm;
      font-size: $font-size-md;
      color: $color-text-disabled;
      text-decoration: line-through;
    }
  }
  
  .product-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    line-height: 1.5;
    margin-bottom: $space-sm;
  }
  
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    margin-bottom: $space-md;
  }
  
  .specs-info {
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: $radius-md;
    padding: $space-md;
    
    .specs-item {
      display: flex;
      padding: $space-xs 0;
      font-size: $font-size-sm;
      
      .specs-label {
        color: $color-text-sub;
        width: 120rpx;
      }
      
      .specs-value {
        color: $color-text-main;
        flex: 1;
      }
    }
  }
}
</style>
