<template>
  <view class="publish-post-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="发布帖子">
      <template #right>
        <view 
          class="publish-btn" 
          :class="{ 'can-publish': canPublish }"
          @click="handlePublish"
        >
          <text>发布</text>
        </view>
      </template>
    </ui-sub-navbar>
    
    <scroll-view 
      scroll-y 
      class="publish-scroll" 
      :style="{ height: scrollHeight + 'px' }"
    >
      <view class="scroll-content">
        <view class="title-section">
          <input 
            v-model="title"
            class="title-input"
            placeholder="请输入标题（必填，5-50字）"
            :maxlength="50"
          />
          <text class="title-count">{{ title.length }}/50</text>
        </view>
        
        <view class="content-section">
          <textarea 
            v-model="content"
            class="content-input"
            placeholder="分享你的想法、经验或问题..."
            :maxlength="5000"
          />
          <text class="content-count">{{ content.length }}/5000</text>
        </view>
        
        <view class="image-section">
          <view class="section-header">
            <text class="section-title">添加图片</text>
            <text class="image-count">{{ images.length }}/9</text>
          </view>
          
          <view class="image-grid">
            <view 
              v-for="(img, index) in images" 
              :key="index"
              class="image-item"
            >
              <image :src="img" class="preview-image" mode="aspectFill" />
              <view class="delete-btn" @click="removeImage(index)">
                <ui-icon name="x" :size="24" color="#FFFFFF" />
              </view>
              <view 
                v-if="index === 0" 
                class="cover-tag"
              >
                <text>封面</text>
              </view>
            </view>
            
            <view 
              v-if="images.length < 9"
              class="add-image-btn"
              @click="chooseImage"
            >
              <ui-icon name="plus" :size="48" color="#C7C7CC" />
              <text>添加图片</text>
            </view>
          </view>
        </view>
        
        <view class="topic-section">
          <view class="section-header">
            <text class="section-title">添加话题/社区</text>
            <text class="topic-hint">最多5个，帖子将出现在这些社区</text>
          </view>
          
          <view class="selected-topics" v-if="selectedTopics.length">
            <view 
              v-for="(topic, index) in selectedTopics" 
              :key="topic.id"
              class="topic-item"
            >
              <view class="topic-info">
                <ui-avatar v-if="topic.icon" :src="topic.icon" :size="32" />
                <text class="topic-name">#{{ topic.name }}</text>
              </view>
              <view class="topic-remove" @click="removeTopic(index)">
                <ui-icon name="x" :size="24" color="currentColor" />
              </view>
            </view>
          </view>
          
          <view class="topic-input-wrapper">
            <input 
              v-model="topicKeyword"
              class="topic-input"
              placeholder="搜索或输入话题..."
              @input="searchTopics"
              @focus="showTopicSearch = true"
            />
            <view v-if="topicKeyword" class="clear-btn" @click="clearTopicKeyword">
              <ui-icon name="x" :size="28" color="#C7C7CC" />
            </view>
          </view>
          
          <view v-if="showTopicSearch && (searchResults.length > 0 || topicKeyword)" class="search-results">
            <view 
              v-for="result in searchResults" 
              :key="result.id"
              class="result-item"
              @click="selectTopic(result)"
            >
              <ui-avatar v-if="result.icon" :src="result.icon" :size="48" />
              <view v-else class="result-icon">
                <ui-icon name="hash" :size="32" color="var(--color-primary, #FF6A00)" />
              </view>
              <view class="result-info">
                <text class="result-name">{{ result.name }}</text>
                <text v-if="result.memberCount" class="result-count">{{ formatCount(result.memberCount) }}人关注</text>
              </view>
              <ui-icon 
                v-if="isTopicSelected(result.id)"
                name="check-circle" 
                :size="36" 
                color="var(--color-primary, #FF6A00)" 
              />
            </view>
            
            <view v-if="topicKeyword && !isExactMatch" class="create-topic" @click="createNewTopic">
              <view class="create-icon">
                <ui-icon name="plus" :size="32" color="var(--color-primary, #FF6A00)" />
              </view>
              <text class="create-text">创建新话题「#{{ topicKeyword }}」</text>
            </view>
          </view>
          
          <view v-if="!showTopicSearch" class="hot-topics">
            <text class="hot-label">热门话题</text>
            <view class="hot-list">
              <view 
                v-for="topic in hotTopics" 
                :key="topic.id"
                class="hot-item"
                :class="{ 'is-selected': isTopicSelected(topic.id) }"
                @click="selectTopic(topic)"
              >
                <text>#{{ topic.name }}</text>
              </view>
            </view>
          </view>
          
          <view v-if="!showTopicSearch" class="my-topics">
            <text class="my-label">我关注的社区</text>
            <view class="my-list">
              <view 
                v-for="topic in myTopics" 
                :key="topic.id"
                class="my-item"
                :class="{ 'is-selected': isTopicSelected(topic.id) }"
                @click="selectTopic(topic)"
              >
                <ui-avatar v-if="topic.icon" :src="topic.icon" :size="40" />
                <text class="my-name">{{ topic.name }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="options-section">
          <view class="option-item">
            <view class="option-left">
              <ui-icon name="eye" :size="36" color="#A1A1A6" />
              <text class="option-label">公开可见</text>
            </view>
            <ui-switch v-model="isPublic" />
          </view>
          
          <view class="option-item">
            <view class="option-left">
              <ui-icon name="message-circle" :size="36" color="#A1A1A6" />
              <text class="option-label">允许评论</text>
            </view>
            <ui-switch v-model="allowComment" />
          </view>
          
          <view class="option-item" @click="showProductPicker = true">
            <view class="option-left">
              <ui-icon name="shopping-bag" :size="36" color="#A1A1A6" />
              <text class="option-label">关联商品</text>
            </view>
            <view class="option-right">
              <text v-if="relatedProduct" class="option-value">{{ relatedProduct.title }}</text>
              <text v-else class="option-placeholder">可选</text>
              <ui-icon name="arrow-right" :size="32" color="#C7C7CC" />
            </view>
          </view>
        </view>
        
        <view class="tips-section">
          <view class="tips-header">
            <ui-icon name="info" :size="28" color="var(--color-primary, #FF6A00)" />
            <text class="tips-title">发帖提示</text>
          </view>
          <view class="tips-content">
            <text>• 标题需简洁明了，能概括帖子内容</text>
            <text>• 添加话题可让更多人看到你的帖子</text>
            <text>• 帖子会出现在所有选择的话题社区中</text>
            <text>• 优质内容可获得更多曝光和奖励</text>
          </view>
        </view>
        
        <view class="bottom-space"></view>
      </view>
    </scroll-view>
    
    <ui-popup v-model:show="showProductPicker" position="bottom" round>
      <view class="product-picker">
        <view class="picker-header">
          <text class="picker-title">选择商品</text>
          <view class="picker-close" @click="showProductPicker = false">
            <ui-icon name="x" :size="40" color="#A1A1A6" />
          </view>
        </view>
        <scroll-view scroll-y class="picker-content">
          <view 
            v-for="product in productList" 
            :key="product.id"
            class="product-item"
            :class="{ 'is-selected': relatedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            <ui-image :src="product.cover" width="120rpx" height="120rpx" radius="md" />
            <view class="product-info">
              <text class="product-title">{{ product.title }}</text>
              <ui-price :value="product.price" :size="24" />
            </view>
            <ui-icon 
              v-if="relatedProduct?.id === product.id"
              name="check-circle" 
              :size="40" 
              color="var(--color-primary, #FF6A00)" 
            />
          </view>
        </scroll-view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores';
import { forumApi } from '@/api/community';

interface Topic {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
}

interface Product {
  id: string;
  title: string;
  cover: string;
  price: number;
}

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack } = useNavigation();
const authStore = useAuthStore();

const title = ref('');
const content = ref('');
const images = ref<string[]>([]);
const selectedTopics = ref<Topic[]>([]);
const topicKeyword = ref('');
const showTopicSearch = ref(false);
const searchResults = ref<Topic[]>([]);
const isPublic = ref(true);
const allowComment = ref(true);
const relatedProduct = ref<Product | null>(null);
const showProductPicker = ref(false);

const hotTopics = ref<Topic[]>([
  { id: 'hot-1', name: '数码测评', memberCount: 125680 },
  { id: 'hot-2', name: '开箱体验', memberCount: 98450 },
  { id: 'hot-3', name: '使用技巧', memberCount: 76890 },
  { id: 'hot-4', name: '问题求助', memberCount: 65430 },
  { id: 'hot-5', name: '好物推荐', memberCount: 54320 },
  { id: 'hot-6', name: 'iPhone15', memberCount: 45670 }
]);

const myTopics = ref<Topic[]>([
  { id: 'my-1', name: 'iPhone 讨论', icon: 'https://picsum.photos/100/100?random=f1', memberCount: 125680 },
  { id: 'my-2', name: '安卓手机', icon: 'https://picsum.photos/100/100?random=f2', memberCount: 98450 },
  { id: 'my-3', name: '电脑硬件', icon: 'https://picsum.photos/100/100?random=f3', memberCount: 76890 }
]);

const productList = ref<Product[]>([
  { id: '1', title: 'iPhone 15 Pro Max 256GB', cover: 'https://picsum.photos/200/200?random=pr1', price: 8999 },
  { id: '2', title: 'MacBook Pro 14寸 M3', cover: 'https://picsum.photos/200/200?random=pr2', price: 14999 },
  { id: '3', title: 'AirPods Pro 2', cover: 'https://picsum.photos/200/200?random=pr3', price: 1899 }
]);

const canPublish = computed(() => {
  return (
    title.value.trim().length >= 5 &&
    content.value.trim().length >= 10
  );
});

const isExactMatch = computed(() => {
  if (!topicKeyword.value.trim()) return false;
  const keyword = topicKeyword.value.trim().toLowerCase();
  return selectedTopics.value.some(t => t.name.toLowerCase() === keyword) ||
         searchResults.value.some(t => t.name.toLowerCase() === keyword);
});

watch(topicKeyword, (val) => {
  if (val.trim()) {
    showTopicSearch.value = true;
  }
});

onLoad(() => {
  fetchHotTopics();
  fetchMyTopics();
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const fetchHotTopics = async () => {
  try {
    const res = await forumApi.getHotTags(undefined, 10);
    if (res.data?.length) {
      hotTopics.value = res.data.map(t => ({
        id: t.name,
        name: t.name,
        memberCount: t.count
      }));
    }
  } catch (error) {
    console.error('获取热门话题失败:', error);
  }
};

const fetchMyTopics = async () => {
  try {
    const res = await forumApi.getJoinedForums(1, 10);
    if (res.data?.list?.length) {
      myTopics.value = res.data.list.map(f => ({
        id: f.id,
        name: f.name,
        icon: f.cover,
        memberCount: f.memberCount
      }));
    }
  } catch (error) {
    console.error('获取关注社区失败:', error);
  }
};

const searchTopics = async () => {
  const keyword = topicKeyword.value.trim();
  if (!keyword) {
    searchResults.value = [];
    return;
  }
  
  try {
    const res = await forumApi.getForumList({ keyword, pageSize: 10 });
    searchResults.value = res.data.list.map(f => ({
      id: f.id,
      name: f.name,
      icon: f.cover,
      memberCount: f.memberCount
    }));
  } catch (error) {
    console.error('搜索话题失败:', error);
    searchResults.value = [];
  }
};

const isTopicSelected = (id: string): boolean => {
  return selectedTopics.value.some(t => t.id === id);
};

const selectTopic = (topic: Topic) => {
  if (isTopicSelected(topic.id)) {
    selectedTopics.value = selectedTopics.value.filter(t => t.id !== topic.id);
  } else if (selectedTopics.value.length < 5) {
    selectedTopics.value.push(topic);
  } else {
    uni.showToast({ title: '最多选择5个话题', icon: 'none' });
  }
};

const removeTopic = (index: number) => {
  selectedTopics.value.splice(index, 1);
};

const createNewTopic = () => {
  const name = topicKeyword.value.trim();
  if (!name) return;
  
  if (selectedTopics.value.length >= 5) {
    uni.showToast({ title: '最多选择5个话题', icon: 'none' });
    return;
  }
  
  const newTopic: Topic = {
    id: `new-${Date.now()}`,
    name: name
  };
  
  selectedTopics.value.push(newTopic);
  topicKeyword.value = '';
  showTopicSearch.value = false;
  searchResults.value = [];
};

const clearTopicKeyword = () => {
  topicKeyword.value = '';
  searchResults.value = [];
  showTopicSearch.value = false;
};

const chooseImage = () => {
  const remaining = 9 - images.value.length;
  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths];
    }
  });
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const selectProduct = (product: Product) => {
  if (relatedProduct.value?.id === product.id) {
    relatedProduct.value = null;
  } else {
    relatedProduct.value = product;
  }
  showProductPicker.value = false;
};

const handlePublish = async () => {
  if (!canPublish.value) {
    if (title.value.trim().length < 5) {
      uni.showToast({ title: '标题至少5个字', icon: 'none' });
    } else if (content.value.trim().length < 10) {
      uni.showToast({ title: '内容至少10个字', icon: 'none' });
    }
    return;
  }
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  uni.showLoading({ title: '发布中...' });
  
  try {
    const uploadedImages = await uploadImages();
    
    const params = {
      title: title.value.trim(),
      content: content.value.trim(),
      images: uploadedImages,
      tags: selectedTopics.value.map(t => t.name),
      forumId: selectedTopics.value[0]?.id,
      isPublic: isPublic.value,
      allowComment: allowComment.value,
      relatedProductId: relatedProduct.value?.id
    };
    
    await forumApi.createPost(params);
    
    uni.hideLoading();
    uni.showToast({ title: '发布成功', icon: 'success' });
    
    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '发布失败，请重试', icon: 'none' });
  }
};

const uploadImages = async (): Promise<string[]> => {
  if (images.value.length === 0) return [];
  
  const uploadedUrls: string[] = [];
  for (const img of images.value) {
    try {
      const res = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(img);
        }, 300);
      });
      uploadedUrls.push(res);
    } catch (error) {
      console.error('上传图片失败:', error);
    }
  }
  return uploadedUrls;
};
</script>

<style lang="scss" scoped>
.publish-post-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.bg-decoration {
  @include decoration-container;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 100rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 400rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.publish-scroll {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.publish-btn {
  padding: 12rpx 32rpx;
  background: $color-bg-gray;
  border-radius: $radius-full;
  
  text {
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }
  
  &.can-publish {
    background: $gradient-sunset;
    
    text {
      color: #FFFFFF;
      font-weight: $font-weight-medium;
    }
  }
}

.title-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin: $space-md;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  .title-input {
    width: 100%;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    @include text-main;
  }
  
  .title-count {
    display: block;
    text-align: right;
    font-size: $font-size-xs;
    @include text-disabled;
    margin-top: $space-xs;
  }
}

.content-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin: 0 $space-md $space-sm;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  .content-input {
    width: 100%;
    min-height: 300rpx;
    font-size: $font-size-md;
    @include text-main;
    line-height: 1.8;
  }
  
  .content-count {
    display: block;
    text-align: right;
    font-size: $font-size-xs;
    @include text-disabled;
    margin-top: $space-sm;
  }
}

.image-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin: 0 $space-md $space-sm;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .image-count {
      font-size: $font-size-sm;
      @include text-sub;
    }
  }
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: $radius-md;
  overflow: hidden;
  
  .preview-image {
    width: 100%;
    height: 100%;
  }
  
  .delete-btn {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    @include flex-center;
  }
  
  .cover-tag {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #FF6A00 0%, #FF9500 100%);
    padding: 4rpx 0;
    text-align: center;
    
    text {
      font-size: $font-size-xs;
      color: #FFFFFF;
    }
  }
}

.add-image-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed $color-divider;
  border-radius: $radius-md;
  @include flex-column-center;
  gap: $space-xs;
  
  text {
    font-size: $font-size-xs;
    @include text-sub;
  }
  
  [data-theme="dark"] & {
    border-color: var(--color-divider, rgba(255, 255, 255, 0.12));
  }
}

.topic-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin: 0 $space-md $space-sm;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  
  .section-header {
    margin-bottom: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }
    
    .topic-hint {
      font-size: $font-size-xs;
      @include text-sub;
      margin-top: 4rpx;
      display: block;
    }
  }
}

.selected-topics {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-bottom: $space-md;
  
  .topic-item {
    display: flex;
    align-items: center;
    gap: $space-xs;
    padding: 8rpx 16rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    border-radius: $radius-full;
    
    .topic-info {
      display: flex;
      align-items: center;
      gap: 8rpx;
    }
    
    .topic-name {
      font-size: $font-size-sm;
      color: var(--color-primary, #FF6A00);
    }
    
    .topic-remove {
      display: flex;
      color: var(--color-primary, #FF6A00);
      margin-left: 4rpx;
    }
  }
}

.topic-input-wrapper {
  position: relative;
  margin-bottom: $space-md;
  
  .topic-input {
    width: 100%;
    height: 80rpx;
    padding: 0 $space-lg 0 $space-md;
    background: $color-bg-gray;
    border-radius: $radius-full;
    font-size: $font-size-md;
    @include text-main;
    
    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  .clear-btn {
    position: absolute;
    right: $space-md;
    top: 50%;
    transform: translateY(-50%);
  }
}

.search-results {
  background: $color-bg-gray;
  border-radius: $radius-lg;
  margin-bottom: $space-md;
  max-height: 400rpx;
  overflow-y: auto;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.result-item {
  display: flex;
  align-items: center;
  padding: $space-md;
  gap: $space-sm;
  
  &:not(:last-child) {
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  }
  
  .result-icon {
    width: 48rpx;
    height: 48rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-radius: $radius-sm;
    @include flex-center;
  }
  
  .result-info {
    flex: 1;
    
    .result-name {
      font-size: $font-size-md;
      @include text-main;
    }
    
    .result-count {
      font-size: $font-size-xs;
      @include text-sub;
      margin-top: 2rpx;
    }
  }
}

.create-topic {
  display: flex;
  align-items: center;
  padding: $space-md;
  gap: $space-sm;
  
  .create-icon {
    width: 48rpx;
    height: 48rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
    border-radius: $radius-sm;
    @include flex-center;
  }
  
  .create-text {
    font-size: $font-size-md;
    color: var(--color-primary, #FF6A00);
  }
}

.hot-topics,
.my-topics {
  margin-bottom: $space-md;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .hot-label,
  .my-label {
    font-size: $font-size-xs;
    @include text-sub;
    margin-bottom: $space-sm;
    display: block;
  }
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.hot-item {
  padding: 8rpx 16rpx;
  background: $color-bg-gray;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  @include text-sub;
  
  &.is-selected {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    color: var(--color-primary, #FF6A00);
  }
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.my-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
}

.my-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: $color-bg-gray;
  border-radius: $radius-full;
  
  &.is-selected {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    
    .my-name {
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .my-name {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
}

.options-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  margin: 0 $space-md $space-sm;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));
  overflow: hidden;
  
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    
    &:not(:last-child) {
      border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    }
    
    .option-left {
      display: flex;
      align-items: center;
      gap: $space-sm;
      
      .option-label {
        font-size: $font-size-md;
        @include text-main;
      }
    }
    
    .option-right {
      display: flex;
      align-items: center;
      gap: $space-xs;
      
      .option-value {
        font-size: $font-size-sm;
        @include text-main;
      }
      
      .option-placeholder {
        font-size: $font-size-sm;
        @include text-disabled;
      }
    }
  }
}

.tips-section {
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border-radius: $radius-lg;
  padding: $space-md;
  margin: 0 $space-md $space-sm;
  
  .tips-header {
    display: flex;
    align-items: center;
    gap: $space-xs;
    margin-bottom: $space-sm;
    
    .tips-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .tips-content {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
    
    text {
      font-size: $font-size-xs;
      @include text-sub;
      line-height: 1.6;
    }
  }
}

.bottom-space {
  height: 120rpx;
}

.product-picker {
  max-height: 70vh;
  
  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
    
    .picker-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      @include text-main;
    }
    
    .picker-close {
      padding: $space-xs;
    }
  }
  
  .picker-content {
    max-height: 60vh;
    padding: $space-sm;
  }
}

.product-item {
  display: flex;
  align-items: center;
  padding: $space-md;
  border-radius: $radius-lg;
  
  &.is-selected {
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  }
  
  .product-info {
    flex: 1;
    margin-left: $space-md;
    
    .product-title {
      font-size: $font-size-md;
      @include text-main;
      @include text-ellipsis(1);
    }
  }
}
</style>
