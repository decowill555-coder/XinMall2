<template>
  <view class="ui-search-history" v-if="list.length > 0">
    <view class="section-header">
      <text class="section-title">搜索历史</text>
      <text class="clear-btn" @click="emit('clear')">清空</text>
    </view>
    <view class="history-list">
      <text 
        v-for="(item, index) in list" 
        :key="index" 
        class="history-item"
        @click="emit('click', item)"
      >
        {{ item }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  list?: string[];
}

withDefaults(defineProps<Props>(), {
  list: () => []
});

const emit = defineEmits(['click', 'clear']);
</script>

<style lang="scss" scoped>
.ui-search-history {
  margin-bottom: $space-lg;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .clear-btn {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
  
  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    
    .history-item {
      padding: $space-xs $space-md;
      background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
      backdrop-filter: blur($blur-sm);
      -webkit-backdrop-filter: blur($blur-sm);
      border-radius: $radius-full;
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
}
</style>
