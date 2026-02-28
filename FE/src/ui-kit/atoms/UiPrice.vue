<!-- src/ui-kit/atoms/UiPrice.vue -->
<template>
  <view 
    class="ui-price" 
    :class="[
      { 'is-del': type === 'del' },
      mode 
    ]"
    :style="{ color: finalColor }"
  >
    <!-- 1. 货币符号 (更小) -->
    <text 
      class="symbol" 
      :style="{ fontSize: symbolSize + 'rpx' }"
      v-if="showSymbol"
    >¥</text>
    
    <!-- 2. 整数部分 (千分位) -->
    <text 
      class="integer" 
      :style="{ 
        fontSize: intSize + 'rpx', 
        fontWeight: bold ? 600 : 400 
      }"
    >{{ priceParts.integer }}</text>
    
    <!-- 3. 小数部分 (更小) -->
    <text 
      class="decimal" 
      :style="{ fontSize: decimalSize + 'rpx' }"
      v-if="decimalDigits > 0"
    >.{{ priceParts.decimal }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { splitPrice } from '@/utils/currency'; // 引入刚才写的工具函数
import type { PropType } from 'vue';

// 定义类型
type PriceType = 'main' | 'sub' | 'del'; // 主价格 | 次要价格 | 划线价
type PriceMode = 'normal' | 'glass';     // 普通模式 | 毛玻璃透视模式

const props = defineProps({
  // 价格数值
  value: {
    type: [Number, String],
    required: true,
    default: 0
  },
  // 价格类型：决定默认颜色和样式
  type: {
    type: String as PropType<PriceType>,
    default: 'main' 
  },
  // 基础字号 (整数部分的大小)
  size: {
    type: Number,
    default: 36
  },
  // 自定义颜色 (优先级最高)
  color: {
    type: String,
    default: ''
  },
  // 是否加粗
  bold: {
    type: Boolean,
    default: true
  },
  // 小数位数
  decimalDigits: {
    type: Number,
    default: 2
  },
  // 是否显示符号
  showSymbol: {
    type: Boolean,
    default: true
  },
  // 模式
  mode: {
    type: String as PropType<PriceMode>,
    default: 'normal'
  }
});

// 核心：使用工具函数拆分价格 (支持千分位)
const priceParts = computed(() => {
  // splitPrice 已经在 utils/currency.ts 中处理了 toFixed 和千分位
  // 这里我们需要手动再处理一下小数位数的截取，因为工具函数默认是2位
  const rawParts = splitPrice(props.value);
  
  // 如果需要的小数位和工具函数不一样，这里微调一下
  // 注意：实际开发中建议直接修改 splitPrice 或在这里做简单的截取
  return {
    integer: rawParts.integer,
    decimal: rawParts.decimal.substring(0, props.decimalDigits)
  };
});

// 颜色逻辑
const finalColor = computed(() => {
  if (props.color) return props.color;
  
  // 划线价强制灰色
  if (props.type === 'del') return '#A1A1A6'; // $color-text-disabled
  
  // 主价格使用品牌红色/黑色，视设计稿而定
  // 在数码商城中，通常主价格用红色或黑色，这里假设用黑色强调高端感，或用红色强调促销
  if (props.type === 'main') return '#FF3D00'; // $color-error (价格红)
  
  return '#1D1D1F'; // $color-text-main
});

// 字号逻辑 (黄金比例)
const intSize = computed(() => props.type === 'del' ? props.size * 0.8 : props.size);
const symbolSize = computed(() => intSize.value * 0.65);
const decimalSize = computed(() => intSize.value * 0.70); // 小数部分稍微比符号大一点点

</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';

.ui-price {
  display: inline-flex;
  align-items: baseline; // 关键：基线对齐
  font-family: 'DIN Alternate', 'Roboto', Helvetica, sans-serif; // 数码产品御用数字字体
  line-height: 1;
  letter-spacing: -1rpx; // 稍微紧凑一点

  .symbol {
    margin-right: 2rpx;
    font-weight: 500;
  }
  
  .integer {
    // 视错觉调整：稍微向下一点点，保证和汉字混排时视觉居中
    position: relative;
    top: -1rpx; 
  }

  // --- 划线价样式 ---
  &.is-del {
    text-decoration: line-through;
    opacity: 0.6;
    margin-left: $space-xs; // 如果和主价格并排，给点左间距
  }
  
  // --- 毛玻璃模式下的价格 (例如在商品图上的浮层) ---
  &.glass {
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
  }
}
</style>