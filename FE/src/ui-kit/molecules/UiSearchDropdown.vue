<template>
  <view 
    v-if="visible" 
    class="ui-search-dropdown"
    :style="{ top: positionTop + 'px' }"
  >
    <view v-if="loading" class="dropdown-loading">
      <text>搜索中...</text>
    </view>
    
    <view v-else-if="suggestions.length === 0 && keyword" class="dropdown-empty">
      <text>暂无搜索结果</text>
    </view>
    
    <view v-else class="dropdown-content">
      <view v-if="modelItems.length > 0" class="section">
        <view class="section-header">
          <ui-icon name="box" :size="28" color="#FF6A00" />
          <text class="section-title">商品型号</text>
        </view>
        <view 
          v-for="item in modelItems" 
          :key="item.id" 
          class="dropdown-item"
          @click="handleModelClick(item)"
        >
          <ui-model-search-item :data="item" />
        </view>
      </view>
      
      <view v-if="forumItems.length > 0" class="section">
        <view class="section-header">
          <ui-icon name="message-circle" :size="28" color="#5856D6" />
          <text class="section-title">论坛入口</text>
        </view>
        <view 
          v-for="item in forumItems" 
          :key="item.id" 
          class="dropdown-item"
          @click="handleForumClick(item)"
        >
          <ui-forum-entry-item :data="item" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SearchSuggestionItem } from '@/api/search';

interface Props {
  visible: boolean;
  keyword?: string;
  suggestions?: SearchSuggestionItem[];
  loading?: boolean;
  positionTop?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  keyword: '',
  suggestions: () => [],
  loading: false,
  positionTop: 0
});

const emit = defineEmits<{
  'select-model': [item: SearchSuggestionItem];
  'select-forum': [item: SearchSuggestionItem];
}>();

const modelItems = computed(() => 
  props.suggestions.filter(s => s.type === 'model')
);

const forumItems = computed(() => 
  props.suggestions.filter(s => s.type === 'forum')
);

const handleModelClick = (item: SearchSuggestionItem) => {
  emit('select-model', item);
};

const handleForumClick = (item: SearchSuggestionItem) => {
  emit('select-forum', item);
};
</script>

<style lang="scss" scoped>
.ui-search-dropdown {
  position: fixed;
  left: 0;
  right: 0;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: 0 0 $radius-lg $radius-lg;
  box-shadow: $shadow-lg;
  max-height: 60vh;
  overflow-y: auto;
  z-index: $z-dropdown;
}

.dropdown-loading,
.dropdown-empty {
  padding: $space-xl;
  text-align: center;
  
  text {
    font-size: $font-size-md;
    color: $color-text-sub;
  }
}

.dropdown-content {
  padding: $space-sm;
}

.section {
  margin-bottom: $space-md;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
}

.section-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-sub;
}

.dropdown-item {
  padding: $space-sm $space-md;
  border-radius: $radius-md;
  transition: background $duration-fast;
  
  &:active {
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
  }
}
</style>
