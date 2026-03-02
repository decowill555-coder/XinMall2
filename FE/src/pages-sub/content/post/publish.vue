﻿<template>
  <view class="publish-post-page">
    <ui-sub-navbar title="发布帖子" />
    
    <scroll-view scroll-y class="publish-scroll">
      <view class="content-section">
        <textarea 
          class="content-input" 
          v-model="content" 
          placeholder="分享你的数码生活..."
          :maxlength="2000"
        />
        <text class="word-count">{{ content.length }}/2000</text>
      </view>
      
      <view class="image-section">
        <ui-upload v-model="images" :max-count="9" />
      </view>
      
      <view class="option-section">
        <view class="option-item" @click="showTopicPicker = true">
          <text class="option-label">话题</text>
          <view class="option-value">
            <text v-if="selectedTopic">#{{ selectedTopic }}</text>
            <text v-else class="placeholder">选择话题</text>
            <ui-icon name="arrow-right" ::size="32" />
          </view>
        </view>
        
        <view class="option-item" @click="selectGoods">
          <text class="option-label">关联商品</text>
          <view class="option-value">
            <text v-if="relatedGoods">{{ relatedGoods.title }}</text>
            <text v-else class="placeholder">选择商品</text>
            <ui-icon name="arrow-right" ::size="32" />
          </view>
        </view>
        
        <view class="option-item">
          <text class="option-label">同步到动态</text>
          <ui-switch v-model="syncToFeed" />
        </view>
        
        <view class="option-item">
          <text class="option-label">允许评论</text>
          <ui-switch v-model="allowComment" />
        </view>
      </view>
      
      <view class="hot-topics" v-if="hotTopics.length">
        <text class="section-title">热门话题</text>
        <view class="topic-list">
          <text 
            v-for="topic in hotTopics" 
            :key="topic" 
            class="topic-item"
            @click="selectedTopic = topic"
          >
            #{{ topic }}
          </text>
        </view>
      </view>
    </scroll-view>
    
    <view class="publish-footer">
      <ui-button type="primary" block :disabled="!canPublish" @click="handlePublish">
        发布
      </ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const content = ref('');
const images = ref<string[]>([]);
const selectedTopic = ref('');
const relatedGoods = ref<any>(null);
const syncToFeed = ref(true);
const allowComment = ref(true);
const showTopicPicker = ref(false);

const hotTopics = ref([
  'iPhone15', '数码测评', '科技好物', '开箱体验',
  '摄影技巧', '游戏装备', '办公神器', '学生党必看'
]);

const canPublish = computed(() => content.value.trim().length >= 10);

const selectGoods = () => {
  uni.navigateTo({ 
    url: '/pages-sub/seller/goods/list?select=1',
    events: {
      onGoodsSelected: (goods: any) => {
        relatedGoods.value = goods;
      }
    }
  });
};

const handlePublish = () => {
  if (!canPublish.value) {
    uni.showToast({ title: '请输入至少10个字', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '发布中...' });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.publish-post-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.publish-scroll {
  height: calc(100vh - 88rpx - 120rpx);
}

.content-section {
  background: $color-white;
  padding: $space-md;
  
  .content-input {
    width: 100%;
    height: 300rpx;
    font-size: $font-size-md;
    color: $color-text-main;
    line-height: 1.8;
  }
  
  .word-count {
    display: block;
    text-align: right;
    font-size: $font-size-xs;
    color: $color-text-disabled;
  }
}

.image-section {
  background: $color-white;
  padding: $space-md;
  margin-top: $space-sm;
}

.option-section {
  background: $color-white;
  margin-top: $space-sm;
  
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid $color-divider;
    
    &:last-child { border-bottom: none; }
    
    .option-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
    
    .option-value {
      display: flex;
      align-items: center;
      font-size: $font-size-md;
      color: $color-text-main;
      
      .placeholder { color: $color-text-placeholder; }
    }
  }
}

.hot-topics {
  background: $color-white;
  padding: $space-md;
  margin-top: $space-sm;
  
  .section-title {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
  
  .topic-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    
    .topic-item {
      padding: $space-xs $space-md;
      background: rgba($color-primary, 0.1);
      border-radius: $radius-full;
      font-size: $font-size-sm;
      color: $color-primary;
    }
  }
}

.publish-footer {
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
