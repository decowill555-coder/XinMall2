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
    <!-- 1. 货币符号 -->
    <text 
      class="symbol" 
      :style="{ fontSize: symbolSize + 'rpx' }"
      v-if="showSymbol"
    >¥</text>
    
    <!-- 2. 整数部分 -->
    <text 
      class="integer" 
      :style="{ 
        fontSize: intSize + 'rpx', 
        fontWeight: bold ? 600 : 400 
      }"
    >{{ priceParts.integer }}</text>
    
    <!-- 3. 小数部分 -->
    <text 
      class="decimal" 
      :style="{ fontSize: decimalSize + 'rpx' }"
      v-if="decimalDigits > 0"
    >.{{ priceParts.decimal }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { splitPrice } from '@/utils/currency';
import type { PropType } from 'vue';

type PriceType = 'main' | 'sub' | 'del';
type PriceMode = 'normal' | 'glass';

const props = defineProps({
  value: {
    type: [Number, String],
    required: true,
    default: 0
  },
  type: {
    type: String as PropType<PriceType>,
    default: 'main' 
  },
  size: {
    type: Number,
    default: 36
  },
  color: {
    type: String,
    default: ''
  },
  bold: {
    type: Boolean,
    default: true
  },
  decimalDigits: {
    type: Number,
    default: 2
  },
  showSymbol: {
    type: Boolean,
    default: true
  },
  mode: {
    type: String as PropType<PriceMode>,
    default: 'normal'
  }
});

const priceParts = computed(() => {
  const rawParts = splitPrice(props.value);
  return {
    integer: rawParts.integer,
    decimal: rawParts.decimal.substring(0, props.decimalDigits)
  };
});

const finalColor = computed(() => {
  if (props.color) return props.color;
  if (props.type === 'del') return '#A1A1A6';
  if (props.type === 'main') return '#FF3D00';
  return '#1D1D1F';
});

const intSize = computed(() => props.type === 'del' ? props.size * 0.8 : props.size);
const symbolSize = computed(() => intSize.value * 0.65);
const decimalSize = computed(() => intSize.value * 0.70);

</script>

<style lang="scss" scoped>
.ui-price {
  display: inline-flex;
  align-items: baseline;
  font-family: 'DIN Alternate', 'Roboto', Helvetica, sans-serif;
  line-height: 1;
  letter-spacing: -1rpx;
  
  .symbol {
    margin-right: 2rpx;
    font-weight: 500;
  }
  
  .integer {
    position: relative;
    top: -1rpx; 
  }

  &.is-del {
    text-decoration: line-through;
    opacity: 0.6;
    margin-left: $space-xs;
  }
  
  &.glass {
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
  }
}
</style>
