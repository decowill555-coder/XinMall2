<template>
  <view class="cart-page">
    <ui-sub-navbar title="购物车" />
    
    <scroll-view scroll-y class="cart-scroll" :style="{ height: scrollHeight + 'px' }">
      <ui-empty 
        v-if="!cartStore.hasItems" 
        icon="shopping-cart" 
        text="购物车空空如也"
        action-text="去逛逛"
        @action="goShopping"
      />
      
      <view v-else class="cart-list">
        <view v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <view class="item-check" @click="toggleSelect(item)">
            <ui-icon 
              :name="item.isSelected ? 'check-circle-fill' : 'circle'" 
              :size="40" 
              :color="item.isSelected ? 'success' : 'placeholder'" 
            />
          </view>
          <ui-image :src="item.cover" width="180rpx" height="180rpx" radius="12rpx" />
          <view class="item-info">
            <text class="item-title">{{ item.name }}</text>
            <text class="item-spec">{{ item.skuSpecs?.map(s => s.value).join(' / ') || '' }}</text>
            <view class="item-bottom">
              <ui-price :value="item.price" type="main" :size="28" />
              <ui-stepper :model-value="item.quantity" :min="1" :max="99" @change="(val: number) => updateQuantity(item.id, val)" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <ui-bottom-bar v-if="cartStore.hasItems">
      <view class="footer-left">
        <view class="check-all" @click="toggleSelectAll">
          <ui-icon 
            :name="isAllSelected ? 'check-circle-fill' : 'circle'" 
            :size="40" 
            :color="isAllSelected ? 'success' : 'placeholder'" 
          />
          <text>全选</text>
        </view>
      </view>
      <view class="footer-right">
        <view class="total-price">
          <text class="label">合计：</text>
          <ui-price :value="totalPrice" type="main" :size="36" />
        </view>
        <ui-button type="primary" :disabled="selectedCount === 0" @click="goConfirm">
          结算({{ selectedCount }})
        </ui-button>
      </view>
    </ui-bottom-bar>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useCartStore } from '@/stores';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true
});

const cartStore = useCartStore();

const isAllSelected = computed(() => 
  cartStore.hasItems && cartStore.items.every(item => item.isSelected)
);

const selectedCount = computed(() => cartStore.selectedCount);

const totalPrice = computed(() => cartStore.totalPrice);

const toggleSelect = (item: any) => {
  cartStore.toggleSelection(item.id);
};

const toggleSelectAll = () => {
  cartStore.toggleAllSelection(!isAllSelected.value);
};

const updateQuantity = (id: string, quantity: number) => {
  cartStore.updateQuantity(id, quantity);
};

const goShopping = () => {
  uni.switchTab({ url: '/pages/index/index' });
};

const goConfirm = () => {
  // 获取选中的商品ID，取第一个
  const selectedItems = cartStore.selectedItems;
  if (selectedItems.length === 0) return;

  // 使用第一个选中商品的spuId作为productId
  const productId = selectedItems[0].spuId;
  uni.navigateTo({ url: `/pages-sub/trade/order/confirm?productId=${productId}` });
};
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.cart-scroll {
  overflow: hidden;
}

.cart-list {
  padding: $space-md;
  
  .cart-item {
    display: flex;
    align-items: center;
    padding: $space-md;
    background: $color-white;
    border-radius: $radius-md;
    margin-bottom: $space-sm;
    
    .item-check {
      margin-right: $space-sm;
    }
    
    .item-info {
      flex: 1;
      margin-left: $space-md;
      
      .item-title {
        font-size: $font-size-md;
        color: $color-text-main;
        @include text-ellipsis(2);
      }
      
      .item-spec {
        font-size: $font-size-sm;
        color: $color-text-sub;
        margin: $space-xs 0;
      }
      
      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: $space-sm;
      }
    }
  }
}

.footer-left {
  .check-all {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }
}

.footer-right {
  display: flex;
  align-items: center;
  gap: $space-md;
  
  .total-price {
    display: flex;
    align-items: center;
    
    .label {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
}
</style>
