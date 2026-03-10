import { http } from '@/utils/http';

export interface SpuDetail {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  deviceTypeId: string;
  deviceTypeName: string;
  cover: string;
  images: string[];
  description: string;
  specs: SpuSpec[];
  productCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  avgRating: number;
  memberCount: number;
  postCount: number;
  isFollowed: boolean;
  tags: string[];
  createdAt: string;
}

export interface SpuSpec {
  name: string;
  options: string[];
}

export interface SpuListItem {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  deviceTypeId: string;
  deviceTypeName: string;
  cover: string;
  productCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  memberCount: number;
  isFollowed: boolean;
  tags: string[];
}

export interface SpuListParams {
  deviceTypeId?: string;
  brandId?: string;
  keyword?: string;
  sort?: 'hot' | 'new' | 'product_count';
  page?: number;
  pageSize?: number;
}

export interface SpuListResult {
  list: SpuListItem[];
  total: number;
  hasMore: boolean;
}

export interface SpuProductParams {
  spuId: string;
  specFilters?: Record<string, string>;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  sellerType?: 'personal' | 'merchant';
  sort?: 'recommend' | 'price' | 'new';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface SpuProductItem {
  id: string;
  cover: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  specValues: Record<string, string>;
  sellerType: 'personal' | 'merchant';
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface SpuProductResult {
  list: SpuProductItem[];
  total: number;
  hasMore: boolean;
}

export interface SpuPostItem {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level?: number;
    levelName?: string;
  };
  images: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isPinned: boolean;
  isEssence: boolean;
  createdAt: string;
}

export interface SpuPostParams {
  spuId: string;
  type?: 'all' | 'pinned' | 'essence';
  sort?: 'new' | 'hot';
  page?: number;
  pageSize?: number;
}

export interface SpuPostResult {
  list: SpuPostItem[];
  total: number;
  hasMore: boolean;
}

export interface SpuEvaluation {
  id: string;
  productId: string;
  productCover: string;
  productTitle: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
}

export interface SpuEvaluationParams {
  spuId: string;
  page?: number;
  pageSize?: number;
}

export interface SpuEvaluationResult {
  list: SpuEvaluation[];
  total: number;
  hasMore: boolean;
}

export interface SpuPriceTrend {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  productCount: number;
}

export interface HotSpuItem {
  id: string;
  name: string;
  brandName: string;
  cover: string;
  productCount: number;
  memberCount: number;
  heat: number;
  trend: 'up' | 'down' | 'stable';
}

export const spuApi = {
  getSpuDetail: (id: string) => {
    return http<SpuDetail>({
      url: `/spu/${id}`,
      method: 'GET'
    });
  },

  getSpuList: (params: SpuListParams) => {
    return http<SpuListResult>({
      url: '/spu/list',
      method: 'GET',
      data: params
    });
  },

  searchSpu: (keyword: string, limit?: number) => {
    return http<SpuListItem[]>({
      url: '/spu/search',
      method: 'GET',
      data: { keyword, limit }
    });
  },

  getSpuProducts: (params: SpuProductParams) => {
    return http<SpuProductResult>({
      url: `/spu/${params.spuId}/products`,
      method: 'GET',
      data: {
        specFilters: params.specFilters,
        condition: params.condition,
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        sellerType: params.sellerType,
        sort: params.sort,
        priceOrder: params.priceOrder,
        page: params.page,
        pageSize: params.pageSize
      }
    });
  },

  getSpuPosts: (params: SpuPostParams) => {
    return http<SpuPostResult>({
      url: `/spu/${params.spuId}/posts`,
      method: 'GET',
      data: {
        type: params.type,
        sort: params.sort,
        page: params.page,
        pageSize: params.pageSize
      }
    });
  },

  getSpuEvaluations: (params: SpuEvaluationParams) => {
    return http<SpuEvaluationResult>({
      url: `/spu/${params.spuId}/evaluations`,
      method: 'GET',
      data: { page: params.page, pageSize: params.pageSize }
    });
  },

  followSpu: (spuId: string) => {
    return http<{ success: boolean; memberCount: number }>({
      url: `/spu/${spuId}/follow`,
      method: 'POST'
    });
  },

  unfollowSpu: (spuId: string) => {
    return http<{ success: boolean; memberCount: number }>({
      url: `/spu/${spuId}/unfollow`,
      method: 'POST'
    });
  },

  getHotSpus: (deviceTypeId?: string, limit?: number) => {
    return http<HotSpuItem[]>({
      url: '/spu/hot',
      method: 'GET',
      data: { deviceTypeId, limit }
    });
  },

  getPriceTrend: (spuId: string, days?: number) => {
    return http<SpuPriceTrend[]>({
      url: `/spu/${spuId}/price-trend`,
      method: 'GET',
      data: { days }
    });
  },

  getSpecOptions: (spuId: string) => {
    return http<{ name: string; options: { value: string; count: number }[] }[]>({
      url: `/spu/${spuId}/spec-options`,
      method: 'GET'
    });
  },

  getRelatedSpus: (spuId: string, limit?: number) => {
    return http<SpuListItem[]>({
      url: `/spu/${spuId}/related`,
      method: 'GET',
      data: { limit }
    });
  },

  getFollowedSpus: (page?: number, pageSize?: number) => {
    return http<SpuListResult>({
      url: '/spu/followed',
      method: 'GET',
      data: { page, pageSize }
    });
  }
};
