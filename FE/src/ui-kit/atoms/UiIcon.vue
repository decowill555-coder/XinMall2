<template>
  <text 
    class="ui-icon iconfont"
    :class="`icon-${name}`"
    :style="{
      fontSize: parsedSize,
      color: color,
      fontWeight: bold ? 600 : 'normal'
    }"
    @tap="emit('click')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  size?: string | number;
  color?: string;
  bold?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
  color: 'inherit',
  bold: false
});

const emit = defineEmits(['click']);

const parsedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}rpx` : props.size;
});
</script>

<style scoped>
.ui-icon {
  display: inline-block;
  font-style: normal;
  line-height: 1;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
</style>
