<template>
  <view class="edit-post-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="编辑帖子">
      <template #right>
        <view 
          class="save-btn" 
          :class="{ 'can-save': canSave }"
          @click="handleSave"
        >
          <text>保存</text>
        </view>
      </template>
    </ui-sub-navbar>
    
    <scroll-view 
      scroll-y 
      class="edit-scroll" 
      :style="{ height: scrollHeight + 'px' }"
    >
      <view class="scroll-content" v-if="!isLoading">
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
                <ui-icon name="x" :size="24" color="white" />
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
              <ui-icon name="plus" :size="48" color="disabled" />
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
              <ui-icon name="x" :size="28" color="disabled" />
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
                <ui-icon name="hash" :size="32" color="primary" />
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
        </view>
        
        <view class="bottom-space"></view>
      </view>
      
      <view v-else class="loading-state">
        <text>加载中...</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores';
import { forumApi, type Topic } from '@/api/community';
import { logError } from '@/utils/logger';

interface LocalTopic {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
}

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack } = useNavigation();
const authStore = useAuthStore();

const postId = ref('');
const isLoading = ref(true);

const title = ref('');
const content = ref('');
const images = ref<string[]>([]);
const selectedTopics = ref<LocalTopic[]>([]);
const topicKeyword = ref('');
const showTopicSearch = ref(false);
const searchResults = ref<LocalTopic[]>([]);

const hotTopics = ref<LocalTopic[]>([
  { id: 'hot-1', name: '数码测评', memberCount: 125680 },
  { id: 'hot-2', name: '开箱体验', memberCount: 98450 },
  { id: 'hot-3', name: '使用技巧', memberCount: 76890 },
  { id: 'hot-4', name: '问题求助', memberCount: 65430 },
  { id: 'hot-5', name: '好物推荐', memberCount: 54320 }
]);

const canSave = computed(() => {
  return (
    title.value.trim().length >= 5 &&
    content.value.trim().length >= 10
  );
});

watch(topicKeyword, (val) => {
  if (val.trim()) {
    showTopicSearch.value = true;
  }
});

onLoad((options: any) => {
  if (options.id) {
    postId.value = options.id;
    fetchPostDetail();
    fetchHotTopics();
  } else {
    uni.showToast({ title: '帖子ID不存在', icon: 'none' });
    setTimeout(() => smartBack(), 1500);
  }
});

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

const fetchPostDetail = async () => {
  isLoading.value = true;
  
  try {
    const post = await forumApi.getPostDetail(postId.value);
    title.value = post.title || '';
    content.value = post.content || '';
    images.value = post.images || [];
    
    if (post.tags?.length) {
      selectedTopics.value = post.tags.map(tag => ({
        id: tag,
        name: tag
      }));
    }
  } catch (error) {
    logError('获取帖子详情失败:', error);
    uni.showToast({ title: '获取帖子详情失败', icon: 'none' });
    setTimeout(() => smartBack(), 1500);
  } finally {
    isLoading.value = false;
  }
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
    logError('获取热门话题失败:', error);
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
    logError('搜索话题失败:', error);
    searchResults.value = [];
  }
};

const isTopicSelected = (id: string): boolean => {
  return selectedTopics.value.some(t => t.id === id);
};

const selectTopic = (topic: LocalTopic) => {
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

const handleSave = async () => {
  if (!canSave.value) {
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
  
  uni.showLoading({ title: '保存中...' });
  
  try {
    const params = {
      title: title.value.trim(),
      content: content.value.trim(),
      images: images.value,
      tags: selectedTopics.value.map(t => t.name)
    };
    
    await forumApi.updatePost(postId.value, params);
    
    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });
    
    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    logError('保存帖子失败:', error);
    uni.showToast({ title: '保存失败，请重试', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.edit-post-page {
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

.edit-scroll {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.save-btn {
  padding: 12rpx 32rpx;
  background: $color-bg-gray;
  border-radius: $radius-full;
  
  text {
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }
  
  &.can-save {
    background: $gradient-sunset;

    text {
      color: $color-white;
      font-weight: $font-weight-medium;
    }
  }
}

.loading-state {
  @include flex-center;
  height: 400rpx;
  
  text {
    font-size: $font-size-md;
    @include text-sub;
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
      color: $color-white;
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

.hot-topics {
  margin-bottom: $space-md;
  
  .hot-label {
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

.bottom-space {
  height: 120rpx;
}
</style>
