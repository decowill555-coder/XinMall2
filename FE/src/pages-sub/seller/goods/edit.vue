<template>
  <view class="goods-edit-page">
    <ui-sub-navbar title="编辑商品" />
    
    <scroll-view scroll-y class="edit-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">商品图片</text>
          <ui-upload v-model:file-list="imageList" :max-count="9" @after-read="handleAfterRead" @delete="handleImageDelete" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品标题</text>
          <input class="form-input" v-model="goodsInfo.title" placeholder="请输入商品标题" :maxlength="50" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品描述</text>
          <textarea class="form-textarea" v-model="goodsInfo.description" placeholder="请输入商品描述" :maxlength="500" />
        </view>
        
        <view class="form-item">
          <text class="form-label">商品分类</text>
          <view class="form-select" @click="goCategorySelect">
            <text :class="{ placeholder: !goodsInfo.category }">{{ goodsInfo.category || '请选择分类' }}</text>
            <ui-icon name="arrow-right" :size="32" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">商品成色</text>
          <view class="condition-list">
            <view 
              v-for="item in conditions" 
              :key="item"
              class="condition-item"
              :class="{ active: goodsInfo.condition === item }"
              @click="goodsInfo.condition = item"
            >
              {{ item }}
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">商品规格</text>
          <input class="form-input" v-model="goodsInfo.spec" placeholder="如: 256GB / 钛金属原色" />
        </view>
        
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">售价</text>
            <view class="price-input">
              <text class="price-symbol">¥</text>
              <input type="digit" v-model="goodsInfo.price" placeholder="0" />
            </view>
          </view>
          <view class="form-item half">
            <text class="form-label">库存</text>
            <input type="number" class="form-input" v-model="goodsInfo.stock" placeholder="0" />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">原价（选填）</text>
            <view class="price-input">
            <text class="price-symbol">¥</text>
            <input type="digit" v-model="goodsInfo.originalPrice" placeholder="0" />
          </view>
        </view>
        
        <view class="switch-section">
          <view class="switch-item">
            <text class="switch-label">支持议价</text>
            <ui-switch v-model="goodsInfo.canBargin" />
          </view>
          <view class="switch-item">
            <text class="switch-label">推荐商品</text>
            <ui-switch v-model="goodsInfo.isRecommend" />
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="edit-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <ui-button block @click="handleSaveDraft">存草稿</ui-button>
      <ui-button type="primary" block @click="handleSubmit">保存商品</ui-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { tradeApi } from '@/api';
import { uploadApi } from '@/api/upload';
import { getImageUrl } from '@/utils/http';
import { logError } from '@/utils/logger';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 120
});

const { smartBack } = useNavigation();

const conditions = ['全新', '99新', '95新', '9成新', '8成新'];

interface ImageItem {
  url: string;
  status?: 'ready' | 'uploading' | 'done' | 'error';
  file?: string;
}

const productId = ref<number | null>(null);
const loading = ref(false);
const imageList = ref<ImageItem[]>([]);

const goodsInfo = ref({
  images: [] as string[],
  title: '',
  description: '',
  category: '',
  categoryId: 0,
  condition: '全新',
  conditionLevel: 10,
  spec: '',
  price: '',
  originalPrice: '',
  stock: '1',
  canBargin: false,
  isRecommend: false
});

onLoad((options: any) => {
  if (options?.id) {
    productId.value = parseInt(options.id, 10);
    loadProductData(productId.value);
  }

  // 分类选择返回
  if (options?.categoryId) {
    goodsInfo.value.categoryId = parseInt(options.categoryId, 10);
    goodsInfo.value.category = options.categoryName ? decodeURIComponent(options.categoryName) : '';
  }
});

onShow(() => {
  // 检查是否有通过URL传递的分类选择
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;

  // 通过URL options传递
  if (currentPage?.options?.categoryId) {
    const options = currentPage.options;
    if (parseInt(options.categoryId, 10) !== goodsInfo.value.categoryId) {
      goodsInfo.value.categoryId = parseInt(options.categoryId, 10);
      goodsInfo.value.category = options.categoryName ? decodeURIComponent(options.categoryName) : '';
    }
  }

  // 通过全局临时变量传递
  const tempCategory = (uni as any).$tempCategory;
  if (tempCategory) {
    goodsInfo.value.categoryId = tempCategory.id;
    goodsInfo.value.category = tempCategory.name;
    (uni as any).$tempCategory = null;
  }
});

const goCategorySelect = () => {
  uni.navigateTo({
    url: `/pages-sub/seller/publish/category?selectedId=${goodsInfo.value.categoryId}`
  });
};

// 处理图片上传
const handleAfterRead = async (urls: string[]) => {
  console.log('[handleAfterRead] 收到图片:', urls);

  const startIndex = imageList.value.length;
  const newImages: ImageItem[] = urls.map(url => ({
    url,
    status: 'uploading' as const,
    file: url
  }));
  imageList.value = [...imageList.value, ...newImages];

  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    const currentIndex = startIndex + i;

    console.log(`[handleAfterRead] 开始上传第 ${i + 1} 张图片:`, img.file);

    try {
      const uploadRes = await uploadApi.uploadProductImage(img.file!);
      console.log(`[handleAfterRead] 上传成功:`, uploadRes);

      imageList.value.splice(currentIndex, 1, {
        url: uploadRes.fileUrl,
        status: 'done' as const
      });
    } catch (error) {
      console.error(`[handleAfterRead] 上传失败:`, error);
      logError('图片上传失败:', error);
      imageList.value.splice(currentIndex, 1, {
        url: img.url,
        status: 'error' as const
      });
      uni.showToast({ title: '图片上传失败', icon: 'none' });
    }
  }

  // 更新images数组，只保存上传成功的相对路径
  goodsInfo.value.images = imageList.value
    .filter(img => img.status === 'done')
    .map(img => img.url);

  console.log('[handleAfterRead] 最终images:', goodsInfo.value.images);
};

// 处理图片删除
const handleImageDelete = () => {
  goodsInfo.value.images = imageList.value.map(img => img.url);
};

const loadProductData = async (id: number) => {
  loading.value = true;
  try {
    const res = await tradeApi.getProductDetail(String(id));

    goodsInfo.value.title = res.title;
    goodsInfo.value.description = res.description || '';
    goodsInfo.value.categoryId = res.categoryId || 0;
    goodsInfo.value.category = res.categoryName || '';
    goodsInfo.value.price = String(res.price);
    goodsInfo.value.originalPrice = res.originalPrice ? String(res.originalPrice) : '';
    goodsInfo.value.stock = String(res.stock || 1);
    goodsInfo.value.canBargin = res.canBargain || false;

    // 根据 conditionLevel 设置成色显示 (后端使用 100, 99, 95, 90, 80)
    const levelToCondition: Record<number, string> = {
      100: '全新',
      99: '99新',
      95: '95新',
      90: '9成新',
      80: '8成新'
    };
    goodsInfo.value.conditionLevel = res.conditionLevel || 100;
    goodsInfo.value.condition = levelToCondition[res.conditionLevel] || '全新';

    if (res.images && res.images.length > 0) {
      goodsInfo.value.images = res.images;
      imageList.value = res.images.map((url: string) => ({
        url,
        status: 'done' as const
      }));
    }
  } catch (error) {
    logError('加载商品数据失败:', error);
    uni.showToast({ title: '加载商品数据失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const handleSaveDraft = () => {
  uni.showToast({ title: '已保存草稿', icon: 'success' });
};

const handleSubmit = async () => {
  if (!goodsInfo.value.title) {
    uni.showToast({ title: '请输入商品标题', icon: 'none' });
    return;
  }
  if (!goodsInfo.value.price) {
    uni.showToast({ title: '请输入商品价格', icon: 'none' });
    return;
  }
  if (!productId.value) {
    uni.showToast({ title: '商品ID不存在', icon: 'none' });
    return;
  }

  // 后端期望 conditionLevel 为 100, 99, 95, 90, 80
  const conditionMap: Record<string, number> = {
    '全新': 100,
    '99新': 99,
    '95新': 95,
    '9成新': 90,
    '8成新': 80
  };

  try {
    uni.showLoading({ title: '保存中...' });

    const submitData = {
      title: goodsInfo.value.title,
      description: goodsInfo.value.description,
      categoryId: goodsInfo.value.categoryId,
      conditionLevel: conditionMap[goodsInfo.value.condition] || 10,
      price: parseFloat(goodsInfo.value.price),
      originalPrice: goodsInfo.value.originalPrice ? parseFloat(goodsInfo.value.originalPrice) : undefined,
      stock: parseInt(goodsInfo.value.stock) || 1,
      images: imageList.value.map(img => img.url),
      canBargain: goodsInfo.value.canBargin
    };

    await tradeApi.updateProduct(String(productId.value), submitData);

    uni.hideLoading();
    uni.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      smartBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    logError('保存商品失败:', error);
    uni.showToast({ title: '保存失败，请重试', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.goods-edit-page {
  min-height: 100vh;
  background: var(--color-bg-page, $color-bg-page);
}

.edit-scroll {
  overflow: hidden;
}

.form-section {
  background: var(--color-bg-white, $color-white);
  border-radius: $radius-md;
  padding: $space-md;
  
  .form-item {
    margin-bottom: $space-lg;
    
    &:last-child { margin-bottom: 0; }
    
    .form-label {
      font-size: $font-size-sm;
      color: var(--color-text-sub, $color-text-sub);
      margin-bottom: $space-sm;
    }
    
    .form-input {
      width: 100%;
      height: 80rpx;
      padding: 0 $space-md;
      background: var(--color-bg-gray, $color-bg-gray);
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: var(--color-text-main, $color-text-main);
      box-sizing: border-box;
      
      &::placeholder {
        color: var(--color-text-placeholder, $color-text-placeholder);
      }
    }
    
    .form-textarea {
      width: 100%;
      height: 160rpx;
      padding: $space-md;
      background: var(--color-bg-gray, $color-bg-gray);
      border-radius: $radius-sm;
      font-size: $font-size-md;
      color: var(--color-text-main, $color-text-main);
      box-sizing: border-box;
      
      &::placeholder {
        color: var(--color-text-placeholder, $color-text-placeholder);
      }
    }
    
    .form-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      padding: 0 $space-md;
      background: var(--color-bg-gray, $color-bg-gray);
      border-radius: $radius-sm;
      color: var(--color-text-main, $color-text-main);

      .placeholder {
        color: var(--color-text-placeholder, $color-text-placeholder);
      }
    }
    
    .condition-list {
      display: flex;
      flex-wrap: wrap;
      gap: $space-sm;
      
      .condition-item {
        padding: $space-sm $space-md;
        background: var(--color-bg-gray, $color-bg-gray);
        border-radius: $radius-sm;
        font-size: $font-size-sm;
        color: var(--color-text-sub, $color-text-sub);
        
        &.active {
          color: var(--color-primary, $color-primary);
          background: var(--color-primary-light, rgba($color-primary, 0.1));
        }
      }
    }
    
    .price-input {
      display: flex;
      align-items: center;
      height: 80rpx;
      padding: 0 $space-md;
      background: var(--color-bg-gray, $color-bg-gray);
      border-radius: $radius-sm;
      
      .price-symbol {
        font-size: $font-size-lg;
        color: var(--color-error, $color-error);
        margin-right: $space-xs;
      }
      
      input {
        flex: 1;
        font-size: $font-size-lg;
        color: var(--color-text-main, $color-text-main);
        
        &::placeholder {
          color: var(--color-text-placeholder, $color-text-placeholder);
        }
      }
    }
  }
  
  .form-row {
    display: flex;
    gap: $space-md;
    
    .form-item.half {
      flex: 1;
    }
  }
}

.switch-section {
  margin-top: $space-md;
  padding-top: $space-md;
  border-top: 1rpx solid var(--color-divider, $color-divider);
  
  .switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    
    .switch-label {
      font-size: $font-size-md;
      color: var(--color-text-main, $color-text-main);
    }
  }
}

.edit-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: $space-sm;
  padding: $space-md;
  padding-bottom: calc(#{$space-md} + env(safe-area-inset-bottom));
  background: var(--color-bg-white, $color-white);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>
