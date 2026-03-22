<template>
  <view class="create-forum-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>

    <ui-sub-navbar title="创建社区">
      <template #right>
        <view
          class="submit-btn"
          :class="{ 'can-submit': canSubmit }"
          @click="handleSubmit"
        >
          <text>提交</text>
        </view>
      </template>
    </ui-sub-navbar>

    <scroll-view
      scroll-y
      class="create-scroll"
      :style="{ height: scrollHeight + 'px' }"
    >
      <view class="scroll-content">
        <view class="cover-section">
          <view class="section-label">社区封面</view>
          <view class="cover-upload" @click="chooseCover">
            <image
              v-if="coverImage"
              :src="coverImage"
              class="cover-preview"
              mode="aspectFill"
            />
            <view v-else class="cover-placeholder">
              <ui-icon name="image" :size="64" color="placeholder" />
              <text>上传封面</text>
              <text class="hint">建议尺寸 750x400</text>
            </view>
            <view v-if="coverImage" class="cover-edit">
              <ui-icon name="edit" :size="32" color="white" />
            </view>
          </view>
        </view>

        <view class="form-section">
          <view class="form-item">
            <view class="form-label">
              <text class="label-text">社区名称</text>
              <text class="required">*</text>
            </view>
            <input
              v-model="form.name"
              class="form-input"
              placeholder="请输入社区名称"
              :maxlength="20"
            />
            <text class="input-count">{{ form.name.length }}/20</text>
          </view>

          <view class="form-item">
            <view class="form-label">
              <text class="label-text">社区简介</text>
              <text class="required">*</text>
            </view>
            <textarea
              v-model="form.description"
              class="form-textarea"
              placeholder="请输入社区简介，让大家了解这个社区是做什么的..."
              :maxlength="200"
            />
            <text class="input-count">{{ form.description.length }}/200</text>
          </view>

          <view class="form-item">
            <view class="form-label">
              <text class="label-text">社区类型</text>
            </view>
            <view class="type-options">
              <view
                class="type-item"
                :class="{ 'is-active': form.type === 'user' }"
                @click="form.type = 'user'"
              >
                <ui-icon
                  :name="form.type === 'user' ? 'check-circle' : 'circle'"
                  :size="36"
                  :color="form.type === 'user' ? 'primary' : 'placeholder'"
                />
                <view class="type-info">
                  <text class="type-name">用户社区</text>
                  <text class="type-desc">由用户创建的兴趣社区</text>
                </view>
              </view>
            </view>
          </view>

          <view class="form-item">
            <view class="form-label">
              <text class="label-text">社区标签</text>
              <text class="label-hint">选择标签方便用户找到你的社区</text>
            </view>
            <view class="tags-input">
              <view
                v-for="(tag, index) in form.tags"
                :key="index"
                class="tag-item"
              >
                <text>{{ tag }}</text>
                <view class="tag-remove" @click="removeTag(index)">
                  <ui-icon name="x" :size="20" color="currentColor" />
                </view>
              </view>
              <input
                v-if="form.tags.length < 5"
                v-model="tagInput"
                class="tag-input"
                placeholder="添加标签"
                :maxlength="10"
                @confirm="addTag"
              />
            </view>
            <view class="hot-tags">
              <text class="hot-label">热门标签</text>
              <view class="hot-list">
                <view
                  v-for="tag in hotTags"
                  :key="tag"
                  class="hot-item"
                  :class="{ 'is-selected': form.tags.includes(tag) }"
                  @click="toggleTag(tag)"
                >
                  <text>{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="notice-section">
          <view class="notice-header">
            <ui-icon name="info" :size="28" color="primary" />
            <text class="notice-title">创建须知</text>
          </view>
          <view class="notice-content">
            <text>1. 社区名称需简洁明了，不能包含敏感词汇</text>
            <text>2. 社区创建后需要平台审核，审核通过后即可使用</text>
            <text>3. 作为创建者，您将自动成为社区管理员</text>
            <text>4. 请确保社区内容符合社区规范和法律法规</text>
          </view>
        </view>

        <view class="bottom-space"></view>
      </view>
    </scroll-view>

    <ui-popup v-model:show="showResult" position="center" round>
      <view class="result-popup">
        <view class="result-icon" :class="{ 'is-success': submitSuccess }">
          <ui-icon
            :name="submitSuccess ? 'check-circle' : 'alert-circle'"
            :size="80"
            :color="submitSuccess ? 'success' : 'warning'"
          />
        </view>
        <text class="result-title">{{ submitSuccess ? '提交成功' : '提交失败' }}</text>
        <text class="result-desc">
          {{ submitSuccess ? '社区申请已提交，请等待审核' : '提交失败，请重试' }}
        </text>
        <ui-button
          v-if="submitSuccess"
          type="primary"
          size="md"
          @click="goBack"
        >
          返回
        </ui-button>
        <ui-button
          v-else
          type="primary"
          size="md"
          @click="showResult = false"
        >
          重试
        </ui-button>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores';
import { forumApi } from '@/api/community';
import { uploadApi } from '@/api/upload';
import { logError } from '@/utils/logger';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack } = useNavigation();
const authStore = useAuthStore();

const coverImage = ref('');
const form = ref({
  name: '',
  description: '',
  type: 'user' as 'user',
  tags: [] as string[]
});

const tagInput = ref('');
const submitting = ref(false);
const showResult = ref(false);
const submitSuccess = ref(false);

const hotTags = ref([
  '数码', '手机', '电脑', '摄影', '游戏',
  '美食', '旅行', '运动', '音乐', '电影'
]);

const canSubmit = computed(() => {
  return (
    form.value.name.trim().length >= 2 &&
    form.value.description.trim().length >= 10
  );
});

const chooseCover = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      coverImage.value = res.tempFilePaths[0];
    }
  });
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (!tag) return;

  if (form.value.tags.length >= 5) {
    uni.showToast({ title: '最多添加5个标签', icon: 'none' });
    return;
  }

  if (form.value.tags.includes(tag)) {
    uni.showToast({ title: '标签已存在', icon: 'none' });
    return;
  }

  form.value.tags.push(tag);
  tagInput.value = '';
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
};

const toggleTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag);
  if (index > -1) {
    form.value.tags.splice(index, 1);
  } else if (form.value.tags.length < 5) {
    form.value.tags.push(tag);
  } else {
    uni.showToast({ title: '最多添加5个标签', icon: 'none' });
  }
};

const handleSubmit = async () => {
  if (!canSubmit.value) {
    if (form.value.name.trim().length < 2) {
      uni.showToast({ title: '社区名称至少2个字', icon: 'none' });
    } else if (form.value.description.trim().length < 10) {
      uni.showToast({ title: '社区简介至少10个字', icon: 'none' });
    }
    return;
  }

  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }

  submitting.value = true;
  uni.showLoading({ title: '提交中...' });

  try {
    let coverUrl = '';
    if (coverImage.value) {
      const uploadResult = await uploadApi.uploadImage(coverImage.value, 'post');
      coverUrl = uploadResult.fileUrl;
    }

    await forumApi.createForum({
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      cover: coverUrl
    });

    submitSuccess.value = true;
    showResult.value = true;
  } catch (error) {
    logError('创建社区失败:', error);
    submitSuccess.value = false;
    showResult.value = true;
  } finally {
    submitting.value = false;
    uni.hideLoading();
  }
};

const goBack = () => {
  showResult.value = false;
  smartBack();
};
</script>

<style lang="scss" scoped>
.create-forum-page {
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

.create-scroll {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.submit-btn {
  padding: 12rpx 32rpx;
  background: $color-bg-gray;
  border-radius: $radius-full;

  text {
    font-size: $font-size-sm;
    color: $color-text-disabled;
  }

  &.can-submit {
    background: $gradient-sunset;

    text {
      color: $color-white;
      font-weight: $font-weight-medium;
    }
  }
}

.cover-section {
  margin: $space-md;

  .section-label {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    @include text-main;
    margin-bottom: $space-sm;
  }
}

.cover-upload {
  width: 100%;
  height: 400rpx;
  border-radius: $radius-lg;
  overflow: hidden;
  position: relative;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  border: 2rpx dashed $color-divider;

  [data-theme="dark"] & {
    border-color: var(--glass-border, rgba(255, 255, 255, 0.12));
  }

  .cover-preview {
    width: 100%;
    height: 100%;
  }

  .cover-placeholder {
    @include flex-column-center;
    height: 100%;
    gap: $space-sm;

    text {
      font-size: $font-size-sm;
      @include text-sub;
    }

    .hint {
      font-size: $font-size-xs;
      @include text-disabled;
    }
  }

  .cover-edit {
    position: absolute;
    right: 16rpx;
    bottom: 16rpx;
    width: 64rpx;
    height: 64rpx;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50%;
    @include flex-center;
  }
}

.form-section {
  margin: $space-md;
}

.form-item {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-md;
  border: 1rpx solid var(--glass-border-light, rgba(255, 255, 255, 0.6));

  .form-label {
    display: flex;
    align-items: center;
    gap: 4rpx;
    margin-bottom: $space-sm;

    .label-text {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
    }

    .required {
      color: $color-error;
    }

    .label-hint {
      font-size: $font-size-xs;
      @include text-sub;
      margin-left: $space-sm;
    }
  }

  .form-input {
    width: 100%;
    height: 80rpx;
    font-size: $font-size-md;
    @include text-main;
    background: $color-bg-gray;
    border-radius: $radius-md;
    padding: 0 $space-md;

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .form-textarea {
    width: 100%;
    min-height: 200rpx;
    font-size: $font-size-md;
    @include text-main;
    line-height: 1.6;
    background: $color-bg-gray;
    border-radius: $radius-md;
    padding: $space-md;

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .input-count {
    display: block;
    text-align: right;
    font-size: $font-size-xs;
    @include text-disabled;
    margin-top: $space-xs;
  }
}

.type-options {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.type-item {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md;
  background: $color-bg-gray;
  border-radius: $radius-md;
  border: 2rpx solid transparent;
  transition: all $duration-fast;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }

  &.is-active {
    border-color: var(--color-primary, #FF6A00);
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  }

  .type-info {
    display: flex;
    flex-direction: column;
    gap: 4rpx;

    .type-name {
      font-size: $font-size-md;
      @include text-main;
    }

    .type-desc {
      font-size: $font-size-xs;
      @include text-sub;
    }
  }
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  padding: $space-sm;
  background: $color-bg-gray;
  border-radius: $radius-md;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }

  .tag-item {
    display: flex;
    align-items: center;
    gap: 4rpx;
    padding: 8rpx 16rpx;
    background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));
    border-radius: $radius-full;

    text {
      font-size: $font-size-sm;
      color: var(--color-primary, #FF6A00);
    }

    .tag-remove {
      color: var(--color-primary, #FF6A00);
      display: flex;
    }
  }

  .tag-input {
    min-width: 120rpx;
    height: 56rpx;
    font-size: $font-size-sm;
    @include text-main;
  }
}

.hot-tags {
  margin-top: $space-md;

  .hot-label {
    font-size: $font-size-xs;
    @include text-sub;
    display: block;
    margin-bottom: $space-sm;
  }

  .hot-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  .hot-item {
    padding: 8rpx 20rpx;
    background: $color-bg-gray;
    border-radius: $radius-full;

    text {
      font-size: $font-size-sm;
      @include text-sub;
    }

    &.is-selected {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.12));

      text {
        color: var(--color-primary, #FF6A00);
      }
    }

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.notice-section {
  margin: 0 $space-md $space-md;
  padding: $space-md;
  background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
  border-radius: $radius-lg;

  .notice-header {
    display: flex;
    align-items: center;
    gap: $space-xs;
    margin-bottom: $space-sm;

    .notice-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: var(--color-primary, #FF6A00);
    }
  }

  .notice-content {
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

.result-popup {
  width: 560rpx;
  padding: $space-xl;
  @include flex-column-center;
  gap: $space-md;

  .result-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    @include flex-center;
  }

  .result-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    @include text-main;
  }

  .result-desc {
    font-size: $font-size-sm;
    @include text-sub;
    text-align: center;
  }
}
</style>
