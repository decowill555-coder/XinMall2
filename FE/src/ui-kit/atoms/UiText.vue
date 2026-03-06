<template>
  <text 
    class="ui-text"
    :class="[
      `ui-text--${size}`, 
      `ui-text--${color}`,
      `ui-text--weight-${weight}`,
      { 'ui-text--price': price },
      { 'ui-text--line-through': lineThrough }
    ]"
    @tap="emit('click')"
  >
    <!-- 如果是价格模式，自动�?¥ 符号 -->
    <template v-if="price">¥</template>
    <slot></slot>
  </text>
</template>

<script setup lang="ts">
interface Props {
  // 尺寸: xs(20), sm(24), md(28), lg(32), xl(40), xxl(48)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  // 颜色: main(�?, sub(深灰), placeholder(浅灰), primary(�?, error(�?, warning(�?
  color?: 'main' | 'sub' | 'placeholder' | 'primary' | 'error' | 'warning' | 'white';
  // 字重: regular(400), medium(500), bold(600)
  weight?: 'regular' | 'medium' | 'bold';
  // 特殊模式: 价格显示 (�?¥1999)
  price?: boolean;
  // 特殊模式: 删除�?(原价)
  lineThrough?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'main',
  weight: 'regular',
  price: false,
  lineThrough: false
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
.ui-text {
  line-height: 1.5;
  
  // --- Sizes ---
  &--xs  { font-size: $font-size-xs; }
  &--sm  { font-size: $font-size-sm; }
  &--md  { font-size: $font-size-md; }
  &--lg  { font-size: $font-size-lg; }
  &--xl  { font-size: $font-size-xl; }
  &--xxl { font-size: $font-size-xxl; }

  // --- Colors (使用 CSS 变量响应主题) ---
  &--main        { color: var(--color-text-main, #2C2624); }
  &--sub         { color: var(--color-text-sub, #867A76); }
  &--placeholder { color: var(--color-text-placeholder, #A9A5A2); }
  &--primary     { color: var(--color-primary, #1ABC9C); }
  &--error       { color: var(--color-error, #FF6B6B); }
  &--warning     { color: var(--color-warning, #FFB347); }
  &--white       { color: var(--color-text-white, #FFFFFF); }

  // --- Weights ---
  &--weight-regular { font-weight: $font-weight-regular; }
  &--weight-medium  { font-weight: $font-weight-medium; }
  &--weight-bold    { font-weight: $font-weight-bold; }

  // --- Special ---
  &--price {
    font-family: DINAlternate-Bold, Roboto, sans-serif;
    font-weight: bold;
    color: var(--color-error, #FF6B6B);
  }
  
  &--line-through {
    text-decoration: line-through;
    color: var(--color-text-placeholder, #A9A5A2);
  }
}
</style>