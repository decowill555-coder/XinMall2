<template>
  <text 
    class="ui-icon iconfont" 
    :class="[`icon-${name}`]"
    :style="{ 
      fontSize: parseSize(size), 
      color: color,
      fontWeight: bold ? '600' : 'normal'
    }"
    @tap="emit('click')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;      // 图标类名后缀，例如 'home' -> .icon-home
  size?: string | number; // 支持 32 或 '32rpx'
  color?: string;    // 图标颜色
  bold?: boolean;    // 是否加粗
}

const props = withDefaults(defineProps<Props>(), {
  size: 32,
  color: 'inherit',
  bold: false
});

const emit = defineEmits(['click']);

// 兼容数字和字符串单位
const parseSize = (val: string | number) => {
  return typeof val === 'number' ? `${val}rpx` : val;
};
</script>

<style scoped>
/* 
 * 必须在全局 App.vue 或 uni.scss 中引入 iconfont.css 
 * .iconfont { font-family: "iconfont" !important; ... }
 */
.ui-icon {
  display: inline-block;
  font-style: normal;
  line-height: 1;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
</style>