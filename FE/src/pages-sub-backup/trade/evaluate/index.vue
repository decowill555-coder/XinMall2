<template>
  <view class="evaluate-page">
    <ui-sub-navbar title="评价" />
    
    <scroll-view scroll-y class="evaluate-scroll">
      <view class="goods-card">
        <view v-for="item in goodsList" :key="item.id" class="goods-item">
          <ui-image :src="item.cover" width="120rpx" height="120rpx" radius="8rpx" />
          <view class="goods-info">
            <text class="goods-title">{{ item.title }}</text>
            <text class="goods-spec">{{ item.spec }}</text>
          </view>
        </view>
      </view>
      
      <view class="rating-card">
        <text class="section-title">商品评分</text>
        <view class="rating-item">
          <text class="rating-label">描述相符</text>
          <ui-rate v-model="ratings.desc" />
        </view>
        <view class="rating-item">
          <text class="rating-label">物流服务</text>
          <ui-rate v-model="ratings.logistics" />
        </view>
        <view class="rating-item">
          <text class="rating-label">服务态度</text>
          <ui-rate v-model="ratings.service" />
        </view>
      </view>
      
      <view class="content-card">
        <text class="section-title">评价内容</text>
        <textarea 
          v-model="content" 
          class="content-input" 
          placeholder="分享你的购物体验吧~"
          :maxlength="500"
        />
        <text class="word-count">{{ content.length }}/500</text>
      </view>
      
      <view class="image-card">
        <text class="section-title">上传图片（选填�?/text>
        <ui-upload v-model="images" :max-count="9" />
      </view>
      
      <view class="tags-card">
        <text class="section-title">快捷标签</text>
        <view class="tags-list">
          <view 
            v-for="tag in tagList" 
            :key="tag" 
            class="tag-item"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="evaluate-footer">
      <ui-button type="primary" block :disabled="!canSubmit" @click="handleSubmit">
        提交评价
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const content = ref('');
const images = ref<string[]>([]);
const selectedTags = ref<string[]>([]);

const ratings = ref({
  desc: 5,
  logistics: 5,
  service: 5
});

const goodsList = ref([
  { id: 1, cover: 'https://picsum.photos/200/200?random=701', title: 'iPhone 15 Pro Max 256GB', spec: '钛金属原�? },
  { id: 2, cover: 'https://picsum.photos/200/200?random=702', title: 'AirPods Pro 第二�?, spec: 'USB-C' }
]);

const tagList = ref([
  '质量很好', '发货很快', '包装精美', '价格实惠',
  '描述相符', '服务态度�?, '物流给力', '性价比高'
]);

const canSubmit = computed(() => content.value.trim().length >= 10);

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const handleSubmit = () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请输入至�?0个字', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '提交�?..' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '评价成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.evaluate-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.evaluate-scroll {
  height: calc(100vh - 88rpx - 120rpx);
  padding: $space-sm $space-md;
}

.goods-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .goods-item {
    display: flex;
    margin-bottom: $space-sm;
    
    &:last-child { margin-bottom: 0; }
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      
      .goods-title {
        font-size: $font-size-sm;
        color: $color-text-main;
        @include text-ellipsis(1);
      }
      
      .goods-spec {
        font-size: $font-size-xs;
        color: $color-text-sub;
        margin-top: $space-xs;
      }
    }
  }
}

.rating-card, .content-card, .image-card, .tags-card {
  background: $color-white;
  border-radius: $radius-md;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-sm 0;
  
  .rating-label {
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.content-input {
  width: 100%;
  height: 200rpx;
  padding: $space-md;
  background: $color-bg-gray;
  border-radius: $radius-md;
  font-size: $font-size-md;
  box-sizing: border-box;
}

.word-count {
  display: block;
  text-align: right;
  font-size: $font-size-xs;
  color: $color-text-disabled;
  margin-top: $space-xs;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  
  .tag-item {
    padding: $space-xs $space-md;
    background: $color-bg-gray;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    color: $color-text-sub;
    
    &.active {
      background: rgba($color-primary, 0.1);
      color: $color-primary;
    }
  }
}

.evaluate-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: $color-white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
