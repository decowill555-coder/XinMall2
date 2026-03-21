import { http } from '@/utils/http';

export type ShopAuthStatus = 'pending' | 'approved' | 'rejected';

export interface ShopAuthInfo {
  id: string;
  userId: string;
  shopName: string;
  shopDesc?: string;
  category: string;
  licenseImage: string;
  legalPerson: string;
  phone: string;
  address: string;
  status: ShopAuthStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopAuthParams {
  shopName: string;
  shopDesc?: string;
  category: string;
  licenseImage: string;
  legalPerson: string;
  phone: string;
  address: string;
}

export const shopAuthApi = {
  // 提交店铺认证
  submitAuth: (params: ShopAuthParams) => {
    return http<number>({
      url: '/shop-auth',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  // 获取认证状态
  getAuthStatus: () => {
    return http<ShopAuthInfo | null>({
      url: '/shop-auth/status',
      method: 'GET'
    });
  }
};
