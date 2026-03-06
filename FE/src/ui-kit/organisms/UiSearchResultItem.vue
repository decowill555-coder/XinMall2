<template>
  <view class="ui-search-result-item" @click="emit('click')">
    <ui-image :src="cover" width="200rpx" height="200rpx" radius="12rpx" />
    <view class="item-info">
      <text class="item-title">{{ title }}</text>
      <view class="item-specs" v-if="specs">
        <text class="spec-text">{{ specs }}</text>
      </view>
      <view class="item-tags" v-if="tags?.length">
        <ui-tag 
          v-for="(tag, idx) in tags.slice(0, 3)" 
          :key="idx" 
          type="primary" 
          size="sm"
          plain
        >{{ tag }}</ui-tag>
      </view>
      <view class="item-bottom">
        <ui-price :value="price" type="main" :size="32" />
        <view class="item-meta">
          <text class="meta-text" v-if="condition">{{ condition }}</text>
          <text class="meta-text">{{ time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  cover?: string;
  title?: string;
  specs?: string;
  tags?: string[];
  price?: number;
  condition?: string;
  time?: string;
}

withDefaults(defineProps<Props>(), {
  cover: '',
  title: '',
  tags: () => [],
  price: 0
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-search-result-item {
  display: flex;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-lg;
  margin-bottom: $space-sm;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  box-shadow: $glass-shadow-sm;
  transition: all $duration-fast;
  
  &:active {
    transform: scale(0.99);
  }
  
  .item-info {
    flex: 1;
    margin-left: $space-md;
    display: flex;
    flex-direction: column;
    
    .item-title {
      font-size: $font-size-md;
      color: $color-text-main;
      @include text-ellipsis(2);
      font-weight: $font-weight-medium;
      line-height: 1.4;
    }
    
    .item-specs {
      margin-top: $space-xs;
      
      .spec-text {
        font-size: $font-size-sm;
        color: $color-text-sub;
        background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
        padding: 4rpx 12rpx;
        border-radius: $radius-sm;
      }
    }
    
    .item-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $space-xs;
      margin-top: $space-sm;
    }
    
    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: $space-sm;
      
      .item-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4rpx;
        
        .meta-text {
          font-size: $font-size-xs;
          color: $color-text-disabled;
        }
      }
    }
  }
}
</style>
