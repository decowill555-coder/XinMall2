<template>
  <view class="ui-upload">
    <view class="upload-grid">
      <!-- 1. 已上传图片预览 -->
      <view 
        v-for="(item, index) in fileList" 
        :key="index" 
        class="upload-item"
      >
        <image 
          class="preview-img" 
          :src="item.url" 
          mode="aspectFill"
          @click="onPreview(index)"
        />
        <!-- 删除按钮 -->
        <view class="delete-btn" @click.stop="onRemove(index)">
          <ui-icon name="close" size="20" color="#fff" />
        </view>
        <!-- 状态层 (上传中/失败) -->
        <view v-if="item.status === 'uploading'" class="status-layer">
          <ui-icon name="loading" size="32" color="#fff" class="spin" />
        </view>
      </view>

      <!-- 2. 上传按钮 (数量未满时显示) -->
      <view 
        v-if="fileList.length < maxCount" 
        class="upload-btn" 
        @click="onChoose"
      >
        <ui-icon name="camera" size="48" color="#A1A1A6" />
        <text class="upload-text">添加图片</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface FileItem {
  url: string;
  status?: 'ready' | 'uploading' | 'done' | 'error';
}

const props = withDefaults(defineProps<{
  fileList: FileItem[]; // 双向绑定的文件列表
  maxCount?: number;
}>(), {
  maxCount: 9
});

const emit = defineEmits(['update:fileList', 'after-read', 'delete']);

const onChoose = () => {
  uni.chooseImage({
    count: props.maxCount - props.fileList.length,
    sizeType: ['compressed'], // 数码图片建议压缩
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 抛出事件给父组件处理上传逻辑 (因为上传接口通常在业务层)
      emit('after-read', res.tempFilePaths);
    }
  });
};

const onRemove = (index: number) => {
  const newList = [...props.fileList];
  newList.splice(index, 1);
  emit('update:fileList', newList);
  emit('delete', index);
};

const onPreview = (index: number) => {
  const urls = props.fileList.map(item => item.url);
  uni.previewImage({
    current: urls[index],
    urls: urls
  });
};
</script>

<style lang="scss" scoped>
@import '@/design/_tokens.scss';
@import '@/design/_mixins.scss';

.ui-upload {
  width: 100%;
}

.upload-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx; // 抵消 item 的 margin
}

.upload-item, .upload-btn {
  position: relative;
  width: 220rpx; // 约三分之一宽度
  height: 220rpx;
  margin: 10rpx;
  border-radius: $radius-md;
  overflow: hidden;
}

.upload-item {
  .preview-img {
    width: 100%;
    height: 100%;
  }

  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0,0,0,0.5);
    border-bottom-left-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .status-layer {
    @include absolute-center;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.upload-btn {
  background-color: $color-bg-gray; // 浅灰背景
  border: 2rpx dashed $color-border; // 虚线框
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:active { background-color: #EFEFEF; }

  .upload-text {
    font-size: $font-size-xs;
    color: $color-text-sub;
    margin-top: $space-sm;
  }
}

// 旋转动画 (loading)
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>