<template>
  <view class="ui-brand-selector">
    <view class="section-header">
      <view class="section-title-wrapper">
        <view class="section-icon">
          <ui-icon name="award" :size="32" color="#FF6A00" />
        </view>
        <text class="section-title">品牌</text>
      </view>
      <view v-if="showExpandBtn" class="expand-btn" @click="toggleExpand">
        <text class="expand-text">{{ isExpanded ? '收起' : '全部' }}</text>
        <ui-icon :name="isExpanded ? 'arrow-up' : 'arrow-down'" :size="24" color="#6E6E73" />
      </view>
    </view>

    <view class="brand-grid">
      <view
        v-for="brand in displayBrands"
        :key="brand.id"
        class="brand-item"
        :class="{ 'is-active': modelValue === brand.id }"
        @click="handleSelect(brand)"
      >
        <view class="brand-logo">
          <ui-image
            v-if="brand.logo"
            :src="brand.logo"
            width="80rpx"
            height="80rpx"
            radius="12rpx"
          />
          <view v-else class="brand-placeholder">
            <text class="placeholder-text">{{ brand.name.charAt(0) }}</text>
          </view>
        </view>
        <text class="brand-name">{{ brand.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface BrandItem {
  id: string;
  name: string;
  logo?: string;
}

const props = withDefaults(defineProps<{
  brands: BrandItem[];
  modelValue: string;
  columns?: number;
  rows?: number;
}>(), {
  brands: () => [],
  modelValue: '',
  columns: 4,
  rows: 1
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [brand: BrandItem];
}>();

const isExpanded = ref(false);

const showExpandBtn = computed(() => {
  return props.brands.length > props.columns * props.rows;
});

const displayBrands = computed(() => {
  if (isExpanded.value) {
    return props.brands;
  }
  return props.brands.slice(0, props.columns * props.rows);
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const handleSelect = (brand: BrandItem) => {
  emit('update:modelValue', brand.id);
  emit('change', brand);
};
</script>

<style lang="scss" scoped>
.ui-brand-selector {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-md);
  -webkit-backdrop-filter: blur($blur-md);
  border-radius: $radius-xl;
  padding: $space-md;
  box-shadow: $glass-shadow-sm;
  border: 1rpx solid var(--glass-border, rgba(255, 255, 255, 0.6));
  margin: $space-md;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-md;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: $space-sm;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-main;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: $space-xs $space-sm;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  border-radius: $radius-full;
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.96);
    background: var(--color-border, rgba(0, 0, 0, 0.06));
  }

  .expand-text {
    font-size: $font-size-xs;
    color: $color-text-sub;
  }
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-sm;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.02));
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  transition: all $duration-fast $ease-spring;

  &:active {
    transform: scale(0.96);
  }

  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-color: var(--color-primary, #FF6A00);

    .brand-name {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }
  }

  .brand-logo {
    width: 80rpx;
    height: 80rpx;
    border-radius: $radius-md;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-placeholder {
    width: 80rpx;
    height: 80rpx;
    background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder-text {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: #FFFFFF;
    }
  }

  .brand-name {
    font-size: $font-size-xs;
    color: $color-text-main;
    text-align: center;
    @include text-ellipsis(1);
    max-width: 100%;
  }
}

[data-theme="dark"] {
  .ui-brand-selector {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-color: var(--glass-border, rgba(255, 255, 255, 0.12));
  }

  .section-icon {
    background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
  }

  .section-title {
    color: var(--color-text-main, #F2F2F7);
  }

  .expand-btn {
    background: rgba(255, 255, 255, 0.06);

    &:active {
      background: rgba(255, 255, 255, 0.1);
    }

    .expand-text {
      color: var(--color-text-sub, #A1A1AA);
    }
  }

  .brand-item {
    background: rgba(255, 255, 255, 0.04);

    &.is-active {
      background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
      border-color: var(--color-primary, #E879F9);

      .brand-name {
        color: var(--color-primary, #E879F9);
      }
    }

    .brand-name {
      color: var(--color-text-main, #F2F2F7);
    }

    .brand-placeholder {
      background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
    }
  }
}
</style>
