<!-- src/ui-kit/molecules/UiRegionPicker.vue -->
<template>
  <view class="ui-region-picker">
    <view class="region-select" @click="openPicker">
      <text :class="{ placeholder: !displayText }">{{ displayText || placeholder }}</text>
      <ui-icon name="chevron-right" :size="32" />
    </view>

    <ui-popup v-model:show="showPicker" position="bottom" round>
      <view class="picker-container">
        <view class="picker-header">
          <text class="picker-cancel" @click="cancelPicker">取消</text>
          <text class="picker-title">选择地区</text>
          <text class="picker-confirm" @click="confirmPicker">确定</text>
        </view>

        <picker-view
          :value="pickerValue"
          @change="onPickerChange"
          class="picker-view"
        >
          <picker-view-column>
            <view v-for="province in provinces" :key="province.name" class="picker-item">
              {{ province.name }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="city in cities" :key="city.name" class="picker-item">
              {{ city.name }}
            </view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="district in districts" :key="district.name" class="picker-item">
              {{ district.name }}
            </view>
          </picker-view-column>
        </picker-view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import regionData from '@/data/region.json';

interface RegionItem {
  name: string;
  children?: RegionItem[];
}

const props = withDefaults(defineProps<{
  modelValue?: string[];
  placeholder?: string;
}>(), {
  modelValue: () => [],
  placeholder: '请选择省市区'
});

const emit = defineEmits(['update:modelValue', 'change']);

const showPicker = ref(false);
const pickerValue = ref([0, 0, 0]);

// 临时选择的值
const tempProvince = ref('');
const tempCity = ref('');
const tempDistrict = ref('');

// 省份列表
const provinces = computed(() => regionData as RegionItem[]);

// 市列表
const cities = computed(() => {
  const province = provinces.value[pickerValue.value[0]];
  return province?.children || [];
});

// 区列表
const districts = computed(() => {
  const city = cities.value[pickerValue.value[1]];
  return city?.children || [];
});

// 显示文本
const displayText = computed(() => {
  if (props.modelValue && props.modelValue.length === 3) {
    return props.modelValue.join(' ');
  }
  return '';
});

// 初始化 picker 值
const initPickerValue = () => {
  if (props.modelValue && props.modelValue.length === 3) {
    const [provinceName, cityName, districtName] = props.modelValue;

    const provinceIndex = provinces.value.findIndex(p => p.name === provinceName);
    if (provinceIndex >= 0) {
      const cityList = provinces.value[provinceIndex].children || [];
      const cityIndex = cityList.findIndex(c => c.name === cityName);
      if (cityIndex >= 0) {
        const districtList = cityList[cityIndex].children || [];
        const districtIndex = districtList.findIndex(d => d.name === districtName);
        pickerValue.value = [provinceIndex, cityIndex, districtIndex >= 0 ? districtIndex : 0];
      } else {
        pickerValue.value = [provinceIndex, 0, 0];
      }
    }
  } else {
    pickerValue.value = [0, 0, 0];
  }
};

// 监听 modelValue 变化
watch(() => props.modelValue, () => {
  initPickerValue();
}, { immediate: true });

// 打开选择器
const openPicker = () => {
  initPickerValue();
  showPicker.value = true;
};

// 选择器变化
const onPickerChange = (e: any) => {
  const [provinceIndex, cityIndex, districtIndex] = e.detail.value;

  // 如果省份变了，重置市和区
  if (provinceIndex !== pickerValue.value[0]) {
    pickerValue.value = [provinceIndex, 0, 0];
  } else if (cityIndex !== pickerValue.value[1]) {
    // 如果市变了，重置区
    pickerValue.value = [provinceIndex, cityIndex, 0];
  } else {
    pickerValue.value = [provinceIndex, cityIndex, districtIndex];
  }
};

// 取消选择
const cancelPicker = () => {
  showPicker.value = false;
};

// 确认选择
const confirmPicker = () => {
  const province = provinces.value[pickerValue.value[0]];
  const city = cities.value[pickerValue.value[1]];
  const district = districts.value[pickerValue.value[2]];

  if (province && city && district) {
    const value = [province.name, city.name, district.name];
    emit('update:modelValue', value);
    emit('change', value);
  }

  showPicker.value = false;
};
</script>

<style lang="scss" scoped>
.ui-region-picker {
  width: 100%;
}

.region-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
  backdrop-filter: blur($blur-sm);
  -webkit-backdrop-filter: blur($blur-sm);
  border: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.04));
  border-radius: $radius-md;

  text {
    font-size: $font-size-md;
    color: $color-text-main;

    &.placeholder {
      color: $color-text-placeholder;
    }
  }
}

.picker-container {
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-xxl);
  -webkit-backdrop-filter: blur($blur-xxl);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 $space-md;
  border-bottom: 1rpx solid var(--glass-border-subtle, rgba(0, 0, 0, 0.06));

  .picker-title {
    font-size: $font-size-lg;
    font-weight: 500;
    color: $color-text-main;
  }

  .picker-cancel {
    font-size: $font-size-md;
    color: $color-text-sub;
    padding: $space-sm;
  }

  .picker-confirm {
    font-size: $font-size-md;
    color: var(--color-primary, #FF6A00);
    font-weight: 500;
    padding: $space-sm;
  }
}

.picker-view {
  height: 500rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  color: $color-text-main;
}
</style>
