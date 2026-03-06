<template>
  <view class="ui-hot-keywords">
    <text class="section-title">热门搜索</text>
    <view class="hot-list">
      <view 
        v-for="(item, index) in list" 
        :key="index" 
        class="hot-item"
        @click="emit('click', item.keyword)"
      >
        <text class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</text>
        <text class="hot-keyword">{{ item.keyword }}</text>
        <ui-tag v-if="item.isHot" type="danger" size="sm">热</ui-tag>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface HotItem {
  keyword: string;
  isHot?: boolean;
}

interface Props {
  list?: HotItem[];
}

withDefaults(defineProps<Props>(), {
  list: () => []
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-hot-keywords {
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .hot-list {
    background: var(--glass-solid, rgba(255, 255, 255, 0.85));
    backdrop-filter: blur($blur-lg);
    -webkit-backdrop-filter: blur($blur-lg);
    border-radius: $radius-md;
    padding: 0 $space-md;
    
    .hot-item {
      display: flex;
      align-items: center;
      padding: $space-md 0;
      border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
      
      &:last-child {
        border-bottom: none;
      }
      
      .hot-rank {
        width: 40rpx;
        font-size: $font-size-md;
        font-weight: $font-weight-bold;
        color: $color-text-disabled;
        
        &.top {
          color: var(--color-error, #FF3B30);
        }
      }
      
      .hot-keyword {
        flex: 1;
        font-size: $font-size-md;
        color: $color-text-main;
      }
    }
  }
}
</style>
