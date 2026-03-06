<template>
  <view class="ui-goods-info">
    <text class="goods-title">{{ title }}</text>
    
    <view class="goods-tags" v-if="tags?.length">
      <ui-tag 
        v-for="(tag, index) in tags" 
        :key="index"
        :type="tag.type"
        size="sm"
      >
        {{ tag.text }}
      </ui-tag>
    </view>
    
    <view class="goods-bottom">
      <ui-price :value="price" :size="40" />
      <text v-if="stock !== undefined" class="goods-stock">库存{{ stock }}</text>
      <text v-if="time" class="goods-time">{{ time }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TagItem {
  text: string;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

interface Props {
  title?: string;
  tags?: TagItem[];
  price?: number;
  stock?: number;
  time?: string;
}

withDefaults(defineProps<Props>(), {
  title: '',
  tags: () => [],
  price: 0
});
</script>

<style lang="scss" scoped>
.ui-goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .goods-title {
    font-size: $font-size-md;
    color: $color-text-main;
    @include text-ellipsis(2);
    line-height: 1.4;
  }
  
  .goods-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    margin: $space-xs 0;
  }
  
  .goods-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    
    .goods-stock,
    .goods-time {
      font-size: $font-size-xs;
      color: $color-text-disabled;
    }
  }
}
</style>
