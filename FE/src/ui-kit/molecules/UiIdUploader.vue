<template>
  <view class="ui-id-uploader">
    <view class="upload-item" @click="emit('upload', type)">
      <view v-if="!modelValue" class="upload-placeholder">
        <ui-icon name="camera" :size="48" />
        <text class="placeholder-text">{{ placeholder }}</text>
      </view>
      <ui-image v-else :src="modelValue" width="100%" height="100%" radius="8rpx" />
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  type?: 'front' | 'back';
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'front',
  placeholder: '上传身份证照片'
});

const emit = defineEmits(['upload', 'update:modelValue']);
</script>

<style lang="scss" scoped>
.ui-id-uploader {
  .upload-item {
    aspect-ratio: 1.6;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border: 2rpx dashed var(--color-border, rgba(0, 0, 0, 0.1));
    border-radius: $radius-md;
    overflow: hidden;

    .upload-placeholder {
      @include flex-column-center;
      height: 100%;

      .placeholder-text {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin-top: $space-sm;
      }
    }
  }
}
</style>
