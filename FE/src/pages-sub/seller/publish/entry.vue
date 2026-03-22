<template>
  <view class="publish-page">
    <ui-sub-navbar title="发布商品" />
    
    <scroll-view scroll-y class="publish-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="publish-form">
        
        <ui-form-item label="商品图片" required>
          <view class="image-upload">
            <view class="image-grid">
              <view
                v-for="(img, index) in imageList"
                :key="index"
                class="image-item"
                @click="showImageActions(index)"
              >
                <image
                  class="preview-image"
                  :src="getImageUrl(img.url)"
                  mode="aspectFill"
                />
                <view class="delete-btn" @click.stop="removeImage(index)">
                  <ui-icon name="close" :size="24" color="white" />
                </view>
                <view v-if="index === 0" class="cover-tag">
                  <text>封面</text>
                </view>
              </view>
              
              <view 
                v-if="imageList.length < 9" 
                class="add-image-btn"
                @click="chooseImage"
              >
                <ui-icon name="camera" :size="48" color="disabled" />
                <text class="add-text">添加图片</text>
                <text class="add-hint">{{ imageList.length }}/9</text>
              </view>
            </view>
          </view>
        </ui-form-item>
        
        <ui-form-item label="商品名称" required>
          <ui-input 
            v-model="form.title" 
            placeholder="请输入商品名称（最多50字）" 
            :maxlength="50"
          />
        </ui-form-item>
        
        <ui-form-item label="商品描述" required>
          <ui-textarea 
            v-model="form.description" 
            placeholder="请描述商品详情，如品牌、型号、购买渠道、使用时长等"
            :maxlength="500"
            :rows="4"
          />
        </ui-form-item>
        
        <ui-form-item label="分类" required>
          <view class="category-picker" @click="goCategorySelect">
            <text class="category-text" :class="{ placeholder: !form.categoryName }">
              {{ form.categoryName || '请选择分类' }}
            </text>
            <ui-icon name="chevron-right" :size="32" />
          </view>
        </ui-form-item>
        
        <ui-form-item label="成色" required>
          <ui-condition-picker v-model="form.condition" />
        </ui-form-item>
        
        <ui-form-item label="价格" required>
          <ui-price-input v-model="form.price" placeholder="请输入价格" />
        </ui-form-item>
        
        <ui-form-item label="原价">
          <ui-price-input v-model="form.originalPrice" placeholder="请输入原价（选填）" />
        </ui-form-item>
        
        <ui-form-item label="库存" required>
          <ui-input 
            v-model="form.stock" 
            type="number" 
            placeholder="请输入库存数量"
          />
        </ui-form-item>
        
        <ui-form-item label="发货方式">
          <view class="delivery-options">
            <view 
              v-for="item in deliveryOptions" 
              :key="item.value"
              class="delivery-item"
              :class="{ active: form.deliveryMethod === item.value }"
              @click="form.deliveryMethod = item.value"
            >
              <ui-icon :name="item.icon" :size="32" />
              <text>{{ item.label }}</text>
            </view>
          </view>
        </ui-form-item>
        
        <ui-form-item label="所在地区">
          <view class="location-picker" @click="chooseLocation">
            <text class="location-text" :class="{ placeholder: !form.location }">
              {{ form.location || '请选择地区' }}
            </text>
            <ui-icon name="map-pin" :size="32" />
          </view>
        </ui-form-item>
        
      </view>
      
      <view class="bottom-space"></view>
    </scroll-view>
    
    <view class="publish-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button type="default" @click="saveDraft">存草稿</ui-button>
      <ui-button type="primary" @click="publish">发布</ui-button>
    </view>
    
    <ui-popup v-model:show="showActionPopup" position="bottom" round>
      <view class="action-popup">
        <view class="action-list">
          <view class="action-item" @click="handleAction('preview')">
            <ui-icon name="eye" :size="40" />
            <text>查看大图</text>
          </view>
          <view v-if="currentImageIndex !== 0" class="action-item primary" @click="handleAction('cover')">
            <ui-icon name="star" :size="40" />
            <text>设为封面</text>
          </view>
          <view class="action-item danger" @click="handleAction('delete')">
            <ui-icon name="trash" :size="40" />
            <text>删除</text>
          </view>
        </view>
        <view class="action-cancel" @click="showActionPopup = false">
          <text>取消</text>
        </view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { tradeApi } from '@/api';
import { uploadApi } from '@/api/upload';
import { getImageUrl } from '@/utils/http';
import { logError } from '@/utils/logger';

const { safeAreaBottom } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const scrollHeight = ref(0);
const { smartBack } = useNavigation();

interface ImageItem {
  url: string;
  status?: 'ready' | 'uploading' | 'done' | 'error';
  file?: string;
}

const imageList = ref<ImageItem[]>([]);
const showActionPopup = ref(false);
const currentImageIndex = ref(0);
const isEdit = ref(false);
const editProductId = ref<number | null>(null);
const loading = ref(false);

const form = reactive({
  images: [] as string[],
  title: '',
  description: '',
  categoryId: 0,
  categoryName: '',
  condition: 100,
  price: '',
  originalPrice: '',
  stock: '',
  deliveryMethod: 'express',
  location: ''
});

const deliveryOptions = [
  { label: '快递', value: 'express', icon: 'package' },
  { label: '自提', value: 'pickup', icon: 'map-pin' },
  { label: '同城配送', value: 'local', icon: 'truck' }
];

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  scrollHeight.value = systemInfo.windowHeight - 120;
});

onLoad((options: any) => {
  // 编辑模式：加载商品数据
  if (options?.id) {
    isEdit.value = true;
    editProductId.value = parseInt(options.id, 10);
    loadProductData(editProductId.value);
  }

  // 分类选择返回
  if (options?.categoryId) {
    form.categoryId = parseInt(options.categoryId, 10);
    form.categoryName = options.categoryName ? decodeURIComponent(options.categoryName) : '';
  }
});

onShow(() => {
  // 检查是否有通过URL传递的分类选择
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;

  // 方式1: 通过URL options传递
  if (currentPage?.options?.categoryId) {
    const options = currentPage.options;
    if (parseInt(options.categoryId, 10) !== form.categoryId) {
      form.categoryId = parseInt(options.categoryId, 10);
      form.categoryName = options.categoryName ? decodeURIComponent(options.categoryName) : '';
    }
  }

  // 方式2: 通过全局临时变量传递
  const tempCategory = (uni as any).$tempCategory;
  if (tempCategory) {
    form.categoryId = tempCategory.id;
    form.categoryName = tempCategory.name;
    (uni as any).$tempCategory = null;
  }
});

const chooseImage = async () => {
  const remaining = 9 - imageList.value.length;
  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      console.log('[chooseImage] 选择的图片:', res.tempFilePaths);

      const startIndex = imageList.value.length;
      const newImages: ImageItem[] = res.tempFilePaths.map(url => ({
        url,
        status: 'uploading' as const,
        file: url
      }));
      imageList.value = [...imageList.value, ...newImages];

      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        const currentIndex = startIndex + i;

        console.log(`[chooseImage] 开始上传第 ${i + 1} 张图片:`, img.file);

        try {
          const uploadRes = await uploadApi.uploadProductImage(img.file!);
          console.log(`[chooseImage] 上传成功:`, uploadRes);
          console.log(`[chooseImage] 上传成功 - fileUrl:`, uploadRes.fileUrl);
          console.log(`[chooseImage] 上传成功 - fileKey:`, uploadRes.fileKey);

          imageList.value.splice(currentIndex, 1, {
            url: uploadRes.fileUrl,
            status: 'done' as const
          });
        } catch (error) {
          console.error(`[chooseImage] 上传失败:`, error);
          logError('图片上传失败:', error);
          imageList.value.splice(currentIndex, 1, {
            url: img.url,
            status: 'error' as const
          });
          uni.showToast({ title: '图片上传失败', icon: 'none' });
        }
      }

      // 更新images数组，只保存上传成功的相对路径
      form.images = imageList.value
        .filter(img => img.status === 'done')
        .map(img => img.url);

      console.log('[chooseImage] 最终images:', form.images);
      console.log('[chooseImage] imageList状态:', JSON.stringify(imageList.value.map(i => ({ url: i.url, status: i.status }))));
    }
  });
};

const removeImage = (index: number) => {
  imageList.value.splice(index, 1);
  form.images = imageList.value.map(img => img.url);
};

const setCover = (index: number) => {
  if (index === 0) {
    uni.showToast({ title: '已是封面', icon: 'none' });
    return;
  }
  
  const targetImage = imageList.value[index];
  imageList.value.splice(index, 1);
  imageList.value.unshift(targetImage);
  form.images = imageList.value.map(img => img.url);
  uni.showToast({ title: '已设置为封面', icon: 'success' });
};

const showImageActions = (index: number) => {
  currentImageIndex.value = index;
  showActionPopup.value = true;
};

const handleAction = (action: string) => {
  showActionPopup.value = false;
  
  switch (action) {
    case 'preview':
      previewImage(currentImageIndex.value);
      break;
    case 'cover':
      setCover(currentImageIndex.value);
      break;
    case 'delete':
      removeImage(currentImageIndex.value);
      break;
  }
};

const previewImage = (index: number) => {
  const urls = imageList.value.map(img => getImageUrl(img.url));
  uni.previewImage({
    current: urls[index],
    urls: urls
  });
};

const goCategorySelect = () => {
  uni.navigateTo({ 
    url: `/pages-sub/seller/publish/category?selectedId=${form.categoryId}` 
  });
};

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      form.location = res.name || res.address;
    }
  });
};

const loadProductData = async (productId: number) => {
  loading.value = true;
  try {
    const res = await tradeApi.getProductDetail(String(productId));
    // 填充表单数据
    form.title = res.title;
    form.description = res.description;
    form.categoryId = res.categoryId;
    form.categoryName = res.categoryName || '';
    form.condition = res.conditionLevel ? res.conditionLevel * 10 : 100;
    form.price = String(res.price);
    form.originalPrice = res.originalPrice ? String(res.originalPrice) : '';
    form.stock = String(res.stock || 1);
    form.deliveryMethod = res.deliveryMethod || 'express';
    form.location = res.location || '';

    // 填充图片
    if (res.images && res.images.length > 0) {
      imageList.value = res.images.map((url: string) => ({
        url,
        status: 'done' as const
      }));
      form.images = res.images;
    }
  } catch (error) {
    logError('加载商品数据失败:', error);
    uni.showToast({ title: '加载商品数据失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const saveDraft = () => {
  uni.showToast({ title: '已保存草稿', icon: 'success' });
};

const publish = async () => {
  // 表单验证
  const errors: string[] = [];

  if (imageList.value.length === 0) {
    errors.push('请添加商品图片');
  }
  if (!form.title.trim()) {
    errors.push('请输入商品名称');
  }
  if (!form.description.trim()) {
    errors.push('请输入商品描述');
  }
  if (!form.categoryId) {
    errors.push('请选择分类');
  }
  if (!form.price || parseFloat(form.price) <= 0) {
    errors.push('请输入有效价格');
  }
  if (!form.stock || parseInt(form.stock) <= 0) {
    errors.push('请输入有效库存数量');
  }

  // 显示验证错误
  if (errors.length > 0) {
    uni.showToast({
      title: errors[0],
      icon: 'none',
      duration: 2000
    });
    return;
  }

  try {
    const submitData = {
      title: form.title,
      description: form.description,
      categoryId: form.categoryId,
      conditionLevel: Math.round(form.condition / 10), // 100 -> 10, 90 -> 9, etc.
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      stock: parseInt(form.stock) || 1,
      location: form.location,
      images: form.images
    };

    console.log('[publish] ========== 开始发布商品 ==========');
    console.log('[publish] form.images:', form.images);
    console.log('[publish] submitData:', JSON.stringify(submitData, null, 2));
    console.log('[publish] submitData.images:', submitData.images);

    if (isEdit.value && editProductId.value) {
      // 编辑模式：更新商品
      console.log('[publish] 编辑模式，更新商品ID:', editProductId.value);
      await tradeApi.updateProduct(String(editProductId.value), submitData);
      uni.showToast({ title: '商品更新成功', icon: 'success' });
    } else {
      // 发布模式：创建商品
      console.log('[publish] 发布模式，创建新商品');
      const result = await tradeApi.createProduct(submitData);
      console.log('[publish] 创建商品成功，返回ID:', result);
      uni.showToast({ title: '发布成功', icon: 'success' });
    }

    console.log('[publish] ========== 商品发布完成 ==========');

    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error) {
    logError('操作失败:', error);
    uni.showToast({ title: '操作失败，请重试', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.publish-scroll {
  overflow: hidden;
}

.publish-form {
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  
  [data-theme="dark"] & {
    background: var(--glass-solid, rgba(30, 30, 30, 0.85));
  }
}

.image-upload {
  width: 100%;
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
    width: 48rpx;
    height: 48rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    @include flex-center;
    z-index: 2;
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
  gap: 4rpx;
  
  .add-text {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  .add-hint {
    font-size: $font-size-xs;
    @include text-disabled;
  }
  
  [data-theme="dark"] & {
    border-color: var(--color-divider, rgba(255, 255, 255, 0.12));
  }
}

.category-picker,
.location-picker {
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
  
  [data-theme="dark"] & {
    background: var(--glass-crystal-high, rgba(50, 50, 50, 0.6));
    border-color: var(--glass-border-subtle, rgba(255, 255, 255, 0.08));
  }
  
  .category-text,
  .location-text {
    font-size: $font-size-md;
    color: $color-text-main;
    
    &.placeholder {
      color: $color-text-placeholder;
    }
  }
}

.delivery-options {
  display: flex;
  gap: $space-sm;
  
  .delivery-item {
    flex: 1;
    @include flex-column-center;
    padding: $space-md 0;
    background: var(--glass-crystal-high, rgba(255, 255, 255, 0.6));
    backdrop-filter: blur($blur-sm);
    -webkit-backdrop-filter: blur($blur-sm);
    border-radius: $radius-md;
    border: 1px solid transparent;
    transition: all $duration-fast $ease-spring;
    
    [data-theme="dark"] & {
      background: var(--glass-crystal-high, rgba(50, 50, 50, 0.6));
    }
    
    text {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
    
    &.active {
      border-color: var(--color-primary, #FF6A00);
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
      
      text { color: var(--color-primary, #FF6A00); }
    }
  }
}

.publish-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: $space-md;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  
  [data-theme="dark"] & {
    background: var(--glass-solid, rgba(30, 30, 30, 0.95));
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.2);
  }
}

.bottom-space {
  height: 160rpx;
}

.action-popup {
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-xl $radius-xl 0 0;
  
  [data-theme="dark"] & {
    background: var(--glass-solid, rgba(30, 30, 30, 0.95));
  }
}

.action-list {
  padding: $space-sm;
}

.action-item {
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md $space-lg;
  border-radius: $radius-md;
  transition: all $duration-fast;
  
  text {
    font-size: $font-size-md;
    @include text-main;
  }
  
  &:active {
    background: $color-bg-gray;
    
    [data-theme="dark"] &{
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  &.primary {
    text {
      color: var(--color-primary, #FF6A00);
    }
  }
  
  &.danger {
    text {
      color: $color-error;
    }
  }
}

.action-cancel {
  padding: $space-md;
  margin: $space-sm;
  text-align: center;
  background: $color-bg-gray;
  border-radius: $radius-md;
  
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }
  
  text {
    font-size: $font-size-md;
    font-weight: $font-weight-medium;
    @include text-main;
  }
}
</style>
