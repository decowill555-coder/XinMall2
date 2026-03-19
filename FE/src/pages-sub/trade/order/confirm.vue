<template>
  <view class="confirm-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <ui-sub-navbar title="确认订单" />
    
    <scroll-view scroll-y class="confirm-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="confirm-content">
        <view v-if="loading" class="loading-state">
          <ui-skeleton :rows="6" />
        </view>
        
        <template v-else>
          <view class="address-card" @click="selectAddress">
            <view v-if="address" class="address-content">
              <view class="address-header">
                <ui-icon name="map-pin" :size="36" color="var(--color-primary, #FF6A00)" />
                <text class="address-name">{{ address.receiverName }}</text>
                <text class="address-phone">{{ address.receiverPhone }}</text>
              </view>
              <text class="address-detail">{{ fullAddress }}</text>
            </view>
            <view v-else class="address-empty">
              <ui-icon name="plus" :size="36" color="var(--color-primary, #FF6A00)" />
              <text>添加收货地址</text>
            </view>
            <ui-icon name="arrow-right" :size="32" color="disabled" />
          </view>
          
          <view class="goods-card">
            <view class="shop-header">
              <ui-avatar :src="product?.seller?.avatar" :size="48" />
              <text class="shop-name">{{ product?.seller?.name }}</text>
            </view>
            
            <view class="goods-item">
              <ui-image :src="product?.images?.[0]" width="180rpx" height="180rpx" radius="md" />
              <view class="goods-info">
                <text class="goods-title">{{ product?.title }}</text>
                <view class="goods-tags" v-if="product?.condition">
                  <text class="goods-tag">{{ product?.condition }}</text>
                </view>
                <view class="goods-bottom">
                  <ui-price :value="product?.price || 0" :size="36" />
                  <text class="goods-quantity">x{{ quantity }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <view class="info-card">
            <view class="info-item">
              <text class="info-label">配送方式</text>
              <text class="info-value">快递包邮</text>
            </view>
            <view class="info-item" @click="showRemark = true">
              <text class="info-label">订单备注</text>
              <view class="info-right">
                <text class="info-value">{{ remark || '选填，建议与卖家协商一致' }}</text>
                <ui-icon name="arrow-right" :size="28" color="disabled" />
              </view>
            </view>
          </view>
          
          <view class="price-card">
            <view class="price-item">
              <text class="price-label">商品金额</text>
              <text class="price-value">¥{{ product?.price ? product.price.toFixed(2) : '0.00' }}</text>
            </view>
            <view class="price-item">
              <text class="price-label">运费</text>
              <text class="price-value">{{ freight > 0 ? '¥' + freight.toFixed(2) : '免运费' }}</text>
            </view>
            <view class="price-item total">
              <text class="price-label">合计</text>
              <view class="total-price">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ totalPrice.toFixed(2) }}</text>
              </view>
            </view>
          </view>
          
          <view class="tips-section">
            <view class="tip-item">
              <ui-icon name="shield-check" :size="28" color="var(--color-primary, #FF6A00)" />
              <text>平台担保交易，资金安全有保障</text>
            </view>
          </view>
        </template>
      </view>
      
    </scroll-view>
    
    <view class="confirm-footer" :style="{ paddingBottom: (safeAreaBottom + 12) + 'px' }">
      <view class="footer-left">
        <text class="total-label">实付款：</text>
        <view class="total-price">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ totalPrice.toFixed(2) }}</text>
        </view>
      </view>
      <ui-button type="primary" :loading="submitting" @click="handleSubmit">提交订单</ui-button>
    </view>
    
    <ui-popup v-model:show="showRemark" position="bottom" round>
      <view class="remark-popup">
        <view class="popup-header">
          <text class="popup-cancel" @click="showRemark = false">取消</text>
          <text class="popup-title">订单备注</text>
          <text class="popup-confirm" @click="showRemark = false">确定</text>
        </view>
        <textarea 
          v-model="remark" 
          class="remark-input" 
          placeholder="选填，建议与卖家协商一致"
          :maxlength="100"
        />
        <view class="remark-count">
          <text>{{ remark.length }}/100</text>
        </view>
      </view>
    </ui-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { usePageLayout } from '@/composables/usePageLayout';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores';
import { tradeApi, type Address, type ProductDetail } from '@/api/trade';
import { logError } from '@/utils/logger';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 100
});

const { smartBack } = useNavigation();
const authStore = useAuthStore();

const productId = ref('');
const loading = ref(true);
const submitting = ref(false);
const showRemark = ref(false);
const remark = ref('');
const quantity = ref(1);
const freight = ref(0);

const address = ref<Address | null>(null);

const product = ref<ProductDetail | null>(null);

const fullAddress = computed(() => {
  if (!address.value) return '';
  const { province, city, district, detail } = address.value;
  return `${province}${city}${district}${detail}`;
});

const totalPrice = computed(() => {
  if (!product.value) return 0;
  return (product.value.price || 0) * quantity.value + freight.value;
});

onLoad((options: any) => {
  if (options.productId) {
    productId.value = options.productId;
    fetchOrderData();
  }
});

onMounted(() => {
  uni.$on('addressSelected', handleAddressSelected);
});

onUnmounted(() => {
  uni.$off('addressSelected', handleAddressSelected);
});

const handleAddressSelected = (selectedAddress: Address) => {
  address.value = selectedAddress;
};

const fetchOrderData = async () => {
  loading.value = true;
  try {
    const [productRes, addressRes] = await Promise.all([
      tradeApi.getProductDetail(productId.value),
      tradeApi.getAddressList()
    ]);
    
    product.value = productRes;
    
    const defaultAddress = addressRes.find(a => a.isDefault) || addressRes[0];
    address.value = defaultAddress || null;
    
    freight.value = 0;
  } catch (error) {
    logError('获取订单数据失败:', error);
    uni.showToast({ title: '获取数据失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const selectAddress = () => {
  uni.navigateTo({ url: '/pages-sub/user/address/list?select=1' });
};

const handleSubmit = async () => {
  if (!address.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' });
    return;
  }
  
  if (!product.value) {
    uni.showToast({ title: '商品信息错误', icon: 'none' });
    return;
  }
  
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages-sub/user/login/index' });
    return;
  }
  
  submitting.value = true;
  
  try {
    const orderRes = await tradeApi.createOrder({
      goodsId: product.value.id,
      addressId: address.value.id,
      quantity: quantity.value,
      remark: remark.value
    });
    
    uni.showToast({ title: '订单创建成功', icon: 'success' });

    setTimeout(() => {
      uni.redirectTo({ url: `/pages-sub/trade/pay/index?orderId=${orderRes}` });
    }, 1000);
  } catch (error) {
    logError('创建订单失败:', error);
    uni.showToast({ title: '订单创建失败，请重试', icon: 'none' });
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.confirm-page {
  @include page-gradient-bg;
  min-height: 100vh;
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
    top: 200rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.confirm-scroll {
  
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.confirm-content {
  padding: $space-sm $space-md;
}



.loading-state {
  padding: $space-lg;
}

.address-card {
  display: flex;
  align-items: center;
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .address-content {
    flex: 1;
    
    .address-header {
      display: flex;
      align-items: center;
      margin-bottom: $space-xs;
      
      .address-name {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        @include text-main;
        margin-left: $space-sm;
      }
      
      .address-phone {
        font-size: $font-size-sm;
        @include text-sub;
        margin-left: $space-md;
      }
    }
    
    .address-detail {
      font-size: $font-size-sm;
      @include text-sub;
      line-height: 1.5;
      margin-left: calc(36rpx + #{$space-sm});
    }
  }
  
  .address-empty {
    flex: 1;
    display: flex;
    align-items: center;
    color: var(--color-primary, #FF6A00);
    font-size: $font-size-md;
    
    text { margin-left: $space-sm; }
  }
}

.goods-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .shop-header {
    display: flex;
    align-items: center;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
    
    .shop-name {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      @include text-main;
      margin-left: $space-sm;
    }
  }
  
  .goods-item {
    display: flex;
    
    .goods-info {
      flex: 1;
      margin-left: $space-md;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-title {
        font-size: $font-size-sm;
        @include text-main;
        @include text-ellipsis(2);
        line-height: 1.4;
      }
      
      .goods-tags {
        margin-top: $space-xs;
        
        .goods-tag {
          font-size: $font-size-xs;
          color: var(--color-primary, #FF6A00);
          background: var(--color-primary-glass, rgba(255, 106, 0, 0.08));
          padding: 2rpx 12rpx;
          border-radius: $radius-xs;
        }
      }
      
      .goods-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $space-sm;
        
        .goods-quantity {
          font-size: $font-size-sm;
          @include text-sub;
        }
      }
    }
  }
}

.info-card, .price-card {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
}

.info-item, .price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-xs 0;
  
  .info-label, .price-label {
    font-size: $font-size-sm;
    @include text-sub;
  }
  
  .info-value, .price-value {
    font-size: $font-size-sm;
    @include text-main;
  }
  
  .info-right {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }
  
  &.total {
    margin-top: $space-sm;
    padding-top: $space-sm;
    border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.04));
    
    .price-label {
      @include text-main;
    }
    
    .total-price {
      display: flex;
      align-items: baseline;
      
      .price-symbol {
        font-size: $font-size-sm;
        font-weight: $font-weight-bold;
        color: $color-error;
      }

      .price-value {
        font-size: 36rpx;
        font-weight: $font-weight-bold;
        color: $color-error;
      }
    }
  }
}

.tips-section {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-sm;
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: $space-xs;
    font-size: $font-size-sm;
    @include text-sub;
  }
}

.confirm-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-md;
  background: var(--glass-solid, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  border-top: 1rpx solid var(--color-divider, rgba(0, 0, 0, 0.06));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
  
  .footer-left {
    display: flex;
    align-items: baseline;
    
    .total-label {
      font-size: $font-size-sm;
      @include text-sub;
    }
    
    .total-price {
      display: flex;
      align-items: baseline;
      
      .price-symbol {
        font-size: $font-size-md;
        font-weight: $font-weight-bold;
        color: $color-error;
      }

      .price-value {
        font-size: 40rpx;
        font-weight: $font-weight-bold;
        color: $color-error;
      }
    }
  }
}

.remark-popup {
  padding: $space-md;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-md;
    
    .popup-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      @include text-main;
    }
    
    .popup-cancel {
      font-size: $font-size-md;
      @include text-sub;
    }
    
    .popup-confirm {
      font-size: $font-size-md;
      color: var(--color-primary, #FF6A00);
    }
  }
  
  .remark-input {
    width: 100%;
    height: 200rpx;
    padding: $space-md;
    background: var(--color-bg-gray, rgba(0, 0, 0, 0.03));
    border-radius: $radius-md;
    font-size: $font-size-md;
    box-sizing: border-box;
  }
  
  .remark-count {
    text-align: right;
    margin-top: $space-xs;
    font-size: $font-size-xs;
    @include text-sub;
  }
}
</style>
