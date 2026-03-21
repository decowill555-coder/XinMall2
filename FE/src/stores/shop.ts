import { defineStore } from 'pinia';
import { ref } from 'vue';
import { shopApi, type ShopInfo, type ShopDashboard } from '@/api/shop';

export const useShopStore = defineStore('shop', () => {
  // State
  const shopInfo = ref<ShopInfo | null>(null);
  const dashboard = ref<ShopDashboard | null>(null);
  const loading = ref(false);
  const hasShop = ref<boolean | null>(null);

  // Actions
  const fetchMyShop = async () => {
    try {
      loading.value = true;
      const res = await shopApi.getMyShop();
      shopInfo.value = res;
      hasShop.value = true;
      return res;
    } catch (error: any) {
      if (error.message?.includes('还没有店铺') || error.code === 404) {
        hasShop.value = false;
        shopInfo.value = null;
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchDashboard = async () => {
    try {
      loading.value = true;
      const res = await shopApi.getShopDashboard();
      dashboard.value = res;
      shopInfo.value = res.shop;
      hasShop.value = true;
      return res;
    } catch (error: any) {
      if (error.message?.includes('还没有店铺') || error.code === 404) {
        hasShop.value = false;
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateShop = async (id: string, params: Partial<ShopInfo>) => {
    try {
      loading.value = true;
      await shopApi.updateShop(id, params);
      // 更新本地数据
      if (shopInfo.value) {
        shopInfo.value = { ...shopInfo.value, ...params };
      }
    } finally {
      loading.value = false;
    }
  };

  const checkShopExists = async () => {
    try {
      const res = await shopApi.checkShopExists();
      hasShop.value = res;
      return res;
    } catch {
      hasShop.value = false;
      return false;
    }
  };

  const createShop = async (params: { name: string; avatar?: string; cover?: string; description?: string }) => {
    try {
      loading.value = true;
      const id = await shopApi.createShop(params);
      hasShop.value = true;
      await fetchMyShop();
      return id;
    } finally {
      loading.value = false;
    }
  };

  const clearShop = () => {
    shopInfo.value = null;
    dashboard.value = null;
    hasShop.value = null;
  };

  return {
    shopInfo,
    dashboard,
    loading,
    hasShop,
    fetchMyShop,
    fetchDashboard,
    updateShop,
    checkShopExists,
    createShop,
    clearShop
  };
});
