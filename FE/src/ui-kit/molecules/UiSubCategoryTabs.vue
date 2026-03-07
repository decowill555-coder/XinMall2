<template>
  <view class="ui-sub-category-tabs">
    <view class="section-header">
      <view class="section-title-wrapper">
        <view class="section-icon">
          <ui-icon name="grid" :size="32" color="#FF6A00" />
        </view>
        <text class="section-title">分类</text>
      </view>
      <view v-if="showExpandBtn" class="expand-btn" @click="toggleExpand">
        <text class="expand-text">{{ isExpanded ? '收起' : '全部' }}</text>
        <ui-icon :name="isExpanded ? 'arrow-up' : 'arrow-down'" :size="24" color="#6E6E73" />
      </view>
    </view>

    <view class="tabs-grid">
      <view
        v-for="item in displayList"
        :key="item.id"
        class="tab-item"
        :class="{ 'is-active': modelValue === item.id }"
        @click="handleClick(item)"
      >
        <view v-if="item.icon" class="tab-icon">
          <ui-icon :name="item.icon" :size="28" :color="modelValue === item.id ? '#FFFFFF' : '#6E6E73'" />
        </view>
        <view v-else class="tab-icon-placeholder">
          <text class="icon-text">{{ item.name.charAt(0) }}</text>
        </view>
        <text class="tab-text">{{ item.name }}</text>
        <view v-if="item.count" class="tab-count">
          <text class="count-text">{{ formatCount(item.count) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface SubCategoryItem {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

const props = withDefaults(defineProps<{
  list: SubCategoryItem[];
  modelValue: string;
  columns?: number;
  rows?: number;
}>(), {
  list: () => [],
  modelValue: '',
  columns: 4,
  rows: 1
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [item: SubCategoryItem];
}>();

const isExpanded = ref(false);

const showExpandBtn = computed(() => {
  return props.list.length > props.columns * props.rows;
});

const displayList = computed(() => {
  if (isExpanded.value) {
    return props.list;
  }
  return props.list.slice(0, props.columns * props.rows);
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const handleClick = (item: SubCategoryItem) => {
  emit('update:modelValue', item.id);
  emit('change', item);
};
</script>

<style lang="scss" scoped>
.ui-sub-category-tabs {
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

.tabs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-sm;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm;
  background: var(--color-bg-gray, rgba(0, 0, 0, 0.02));
  border-radius: $radius-lg;
  border: 2rpx solid transparent;
  transition: all $duration-fast $ease-spring;
  position: relative;

  &:active {
    transform: scale(0.96);
  }

  .tab-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.04));
    transition: all $duration-fast;
  }

  .tab-icon-placeholder {
    width: 64rpx;
    height: 64rpx;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.04));
    transition: all $duration-fast;

    .icon-text {
      font-size: $font-size-md;
      font-weight: $font-weight-bold;
      color: $color-text-sub;
    }
  }

  .tab-text {
    font-size: $font-size-xs;
    color: $color-text-main;
    text-align: center;
    @include text-ellipsis(1);
    max-width: 100%;
  }

  .tab-count {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    padding: 2rpx 8rpx;
    background: rgba(0, 0, 0, 0.06);
    border-radius: $radius-full;

    .count-text {
      font-size: 18rpx;
      color: $color-text-disabled;
      font-weight: $font-weight-medium;
    }
  }

  &.is-active {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-color: var(--color-primary, #FF6A00);

    .tab-icon {
      background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));
    }

    .tab-icon-placeholder {
      background: var(--gradient-primary, linear-gradient(135deg, #FF6A00 0%, #FF8F00 100%));

      .icon-text {
        color: #FFFFFF;
      }
    }

    .tab-text {
      color: var(--color-primary, #FF6A00);
      font-weight: $font-weight-medium;
    }

    .tab-count {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.15));

      .count-text {
        color: var(--color-primary, #FF6A00);
      }
    }
  }
}

[data-theme="dark"] {
  .ui-sub-category-tabs {
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

  .tab-item {
    background: rgba(255, 255, 255, 0.04);

    .tab-icon {
      background: rgba(255, 255, 255, 0.06);
    }

    .tab-icon-placeholder {
      background: rgba(255, 255, 255, 0.06);

      .icon-text {
        color: var(--color-text-sub, #A1A1AA);
      }
    }

    .tab-text {
      color: var(--color-text-main, #F2F2F7);
    }

    .tab-count {
      background: rgba(255, 255, 255, 0.08);

      .count-text {
        color: var(--color-text-disabled, #6B7280);
      }
    }

    &.is-active {
      background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
      border-color: var(--color-primary, #E879F9);

      .tab-icon {
        background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));
      }

      .tab-icon-placeholder {
        background: var(--gradient-sunset, linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%));

        .icon-text {
          color: #FFFFFF;
        }
      }

      .tab-text {
        color: var(--color-primary, #E879F9);
      }

      .tab-count {
        background: var(--color-primary-glass, rgba(232, 121, 249, 0.2));

        .count-text {
          color: var(--color-primary, #E879F9);
        }
      }
    }
  }
}
</style>
