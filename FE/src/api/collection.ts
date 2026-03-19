import { http } from '@/utils/http';

// 收藏类型枚举
export enum CollectionType {
  GOODS = 1,      // 商品
  POST = 2,       // 帖子
  PRODUCT_MODEL = 3, // 产品型号
  SHOP = 4,       // 店铺
  TOPIC = 5       // 话题
}

export interface CollectionRequest {
  targetId: number;
  targetType: CollectionType;
}

export interface CollectionItem {
  id: number;
  productId: number;
  title: string;
  cover?: string;
  images?: string[];
  price?: number;
  sellerId?: number;
  sellerName?: string;
  createdAt: string;
}

export interface CollectionListResult {
  records: CollectionItem[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const collectionApi = {
  // 添加收藏
  add: (params: CollectionRequest) => {
    return http<void>({
      url: '/collection',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  // 取消收藏
  remove: (params: CollectionRequest) => {
    return http<void>({
      url: '/collection',
      method: 'DELETE',
      data: params,
      loading: true
    });
  },

  // 检查是否已收藏
  check: (targetId: number, targetType: CollectionType) => {
    return http<boolean>({
      url: '/collection/check',
      method: 'GET',
      data: { targetId, targetType }
    });
  },

  // 获取我的收藏列表
  getMyCollections: (targetType?: CollectionType, page: number = 1, size: number = 10) => {
    return http<CollectionListResult>({
      url: '/collection/my',
      method: 'GET',
      data: { targetType, page, size }
    });
  },

  // 获取收藏数量
  getCount: (targetId: number, targetType: CollectionType) => {
    return http<number>({
      url: '/collection/count',
      method: 'GET',
      data: { targetId, targetType }
    });
  }
};
