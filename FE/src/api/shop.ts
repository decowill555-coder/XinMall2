import { http } from '@/utils/http';

export interface ShopInfo {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  phone?: string;
  wechat?: string;
  category?: string;
  address?: string;
  isOpen?: boolean;
  autoAccept?: boolean;
  rating: number;
  followerCount: number;
  goodsCount: number;
  soldCount: number;
  status: string;
  createdAt: string;
}

export interface ShopCreateParams {
  name: string;
  avatar?: string;
  cover?: string;
  description?: string;
  phone?: string;
  wechat?: string;
  category?: string;
  address?: string;
  isOpen?: boolean;
  autoAccept?: boolean;
}

export interface ShopUpdateParams {
  name?: string;
  avatar?: string;
  cover?: string;
  description?: string;
  phone?: string;
  wechat?: string;
  category?: string;
  address?: string;
  isOpen?: boolean;
  autoAccept?: boolean;
}

export interface RecentGoods {
  id: string;
  title: string;
  cover: string;
  price: number;
  stock: number;
  status: string;
  createdAt: string;
}

export interface ShopDashboard {
  shop: ShopInfo;
  orderCounts: Record<string, number>;
  aftersaleCount: number;
  recentGoods: RecentGoods[];
}

export const shopApi = {
  // 获取我的店铺
  getMyShop: () => {
    return http<ShopInfo>({
      url: '/shop/my',
      method: 'GET'
    });
  },

  // 获取店铺详情
  getShopById: (id: string) => {
    return http<ShopInfo>({
      url: `/shop/${id}`,
      method: 'GET'
    });
  },

  // 创建店铺
  createShop: (params: ShopCreateParams) => {
    return http<number>({
      url: '/shop',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  // 更新店铺
  updateShop: (id: string, params: ShopUpdateParams) => {
    return http<{ success: boolean }>({
      url: `/shop/${id}`,
      method: 'PUT',
      data: params,
      loading: true
    });
  },

  // 关闭店铺
  closeShop: (id: string) => {
    return http<{ success: boolean }>({
      url: `/shop/${id}/close`,
      method: 'PUT'
    });
  },

  // 重新开店
  reopenShop: (id: string) => {
    return http<{ success: boolean }>({
      url: `/shop/${id}/reopen`,
      method: 'PUT'
    });
  },

  // 店铺列表
  getShopList: (page?: number, size?: number) => {
    return http<{ records: ShopInfo[]; total: number; current: number; pages: number }>({
      url: '/shop/list',
      method: 'GET',
      data: { page, size }
    });
  },

  // 店铺首页仪表盘数据
  getShopDashboard: () => {
    return http<ShopDashboard>({
      url: '/shop/my/dashboard',
      method: 'GET'
    });
  },

  // 检查是否有店铺
  checkShopExists: () => {
    return http<boolean>({
      url: '/shop/exists',
      method: 'GET'
    });
  }
};
