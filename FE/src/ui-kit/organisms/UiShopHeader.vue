<template>
  <view class="ui-shop-header">
    <view class="shop-info">
      <ui-avatar :src="logo" :size="120" />
      <view class="shop-detail">
        <text class="shop-name">{{ name }}</text>
        <text class="shop-desc">{{ desc }}</text>
        <view class="shop-tags">
          <slot name="tags" />
        </view>
      </view>
    </view>
    
    <view class="shop-stats">
      <view class="stat-item" v-for="(stat, index) in stats" :key="index" @click="emit('stat-click', index)">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface StatItem {
  value: number | string;
  label: string;
}

interface Props {
  logo?: string;
  name?: string;
  desc?: string;
  stats?: StatItem[];
}

withDefaults(defineProps<Props>(), {
  logo: '',
  name: '',
  desc: '',
  stats: () => []
});

const emit = defineEmits(['stat-click']);
</script>

<style lang="scss" scoped>
.ui-shop-header {
  background: linear-gradient(135deg, var(--color-primary, #FF6A00) 0%, var(--color-primary-dark, #E55D00) 100%);
  padding: $space-lg $space-md;
  
  .shop-info {
    display: flex;
    align-items: center;
    
    .shop-detail {
      flex: 1;
      margin-left: $space-md;
      
      .shop-name {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        color: var(--color-text-white, #FFFFFF);
      }
      
      .shop-desc {
        font-size: $font-size-sm;
        color: var(--glass-shine, rgba(255, 255, 255, 0.8));
        margin: $space-xs 0;
      }
      
      .shop-tags {
        display: flex;
        gap: $space-xs;
      }
    }
  }
  
  .shop-stats {
    display: flex;
    justify-content: space-around;
    margin-top: $space-lg;
    padding: $space-md;
    background: var(--glass-crystal, rgba(255, 255, 255, 0.15));
    border-radius: $radius-lg;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: var(--color-text-white, #FFFFFF);
      }
      
      .stat-label {
        display: block;
        font-size: $font-size-xs;
        color: var(--glass-shine, rgba(255, 255, 255, 0.8));
        margin-top: $space-xs;
      }
    }
  }
}
</style>
