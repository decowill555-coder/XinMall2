<template>
  <view class="ui-rate">
    <view 
      v-for="index in count" 
      :key="index"
      class="star-item"
      @click="onRate(index)"
    >
      <ui-icon 
        :name="index <= modelValue ? 'star-fill' : 'star'" 
        :size="size"
        :color="index <= modelValue ? activeColor : voidColor"
      />
    </view>
    
    <!-- 辅助文字 -->
    <text v-if="showScore" class="rate-score" :style="{ color: activeColor }">
      {{ modelValue.toFixed(1) }}
    </text>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: number;
  count?: number;
  size?: number;
  activeColor?: string;
  voidColor?: string;
  readonly?: boolean;
  showScore?: boolean;
}>(), {
  modelValue: 0,
  count: 5,
  size: 32,
  activeColor: '#FFAB00',
  voidColor: '#E5E5E5',
  readonly: false,
  showScore: false
});

const emit = defineEmits(['update:modelValue', 'change']);

const onRate = (index: number) => {
  if (props.readonly) return;
  emit('update:modelValue', index);
  emit('change', index);
};
</script>

<style lang="scss" scoped>
.ui-rate {
  display: inline-flex;
  align-items: center;

  .star-item {
    margin-right: 6rpx;
    transition: transform 0.1s;
    
    &:active {
      transform: scale(1.2);
    }
  }

  .rate-score {
    margin-left: $space-sm;
    font-size: $font-size-md;
    font-weight: $font-weight-bold;
    font-family: 'DIN Alternate', sans-serif;
  }
}
</style>
