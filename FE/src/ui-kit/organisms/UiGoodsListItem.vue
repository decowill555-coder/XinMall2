<template>
  <view class="ui-goods-list-item" @click="emit('click')">
    <ui-image 
      :src="cover" 
      :width="imageSize"
      :height="imageSize"
      radius="8rpx"
    />
    
    <ui-goods-info 
      :title="title"
      :tags="tags"
      :price="price"
      :stock="stock"
      :time="time"
    />
    
    <slot name="right">
      <ui-goods-actions 
        v-if="showActions"
        :actions="actions"
        @click="handleAction"
      />
    </slot>
  </view>
</template>

<script setup lang="ts">
interface TagItem {
  text: string;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

interface ActionItem {
  text: string;
  type?: 'default' | 'primary' | 'warning' | 'danger';
  action: string;
}

interface Props {
  cover?: string;
  title?: string;
  tags?: TagItem[];
  price?: number;
  stock?: number;
  time?: string;
  showActions?: boolean;
  actions?: ActionItem[];
  imageSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  cover: '',
  title: '',
  tags: () => [],
  price: 0,
  showActions: false,
  actions: () => [
    { text: '编辑', type: 'default', action: 'edit' },
    { text: '下架', type: 'warning', action: 'offShelf' },
    { text: '删除', type: 'danger', action: 'delete' }
  ],
  imageSize: '160rpx'
});

const emit = defineEmits(['click', 'action']);

const handleAction = (action: ActionItem) => {
  emit('action', action.action);
};
</script>

<style lang="scss" scoped>
.ui-goods-list-item {
  display: flex;
  align-items: flex-start;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-md;
  margin-bottom: $space-sm;
  gap: $space-md;
  
  &:active {
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.95));
  }
}
</style>
