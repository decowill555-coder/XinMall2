<template>
  <view class="ui-waterfalls">
    <view class="waterfalls-column" v-for="(column, colIndex) in columns" :key="colIndex">
      <view 
        class="waterfalls-item" 
        v-for="(item, itemIndex) in column" 
        :key="item.id || itemIndex"
        @click="handleClick(item)"
      >
        <slot name="item" :item="item" :index="itemIndex"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
  list: any[];
  columns?: number;
  gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  columns: 2,
  gap: 16
});

const emit = defineEmits<{
  click: [item: any];
}>();

const columnData = ref<any[][]>([]);

const columns = computed(() => {
  const result: any[][] = Array.from({ length: props.columns }, () => []);
  
  props.list.forEach((item, index) => {
    const colIndex = index % props.columns;
    result[colIndex].push(item);
  });
  
  return result;
});

const handleClick = (item: any) => {
  emit('click', item);
};
</script>

<style lang="scss" scoped>
.ui-waterfalls {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.waterfalls-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: $space-sm;

  &:not(:last-child) {
    padding-right: $space-sm;
  }
}

.waterfalls-item {
  break-inside: avoid;
  width: 100%;
  box-sizing: border-box;
}
</style>
