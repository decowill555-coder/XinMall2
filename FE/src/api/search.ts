import { http } from '@/utils/http';

export interface SearchSuggestion {
  keyword: string;
  type: 'keyword' | 'model' | 'product' | 'community';
  subtitle?: string;
  cover?: string;
  id?: string;
}

export interface HotSearchItem {
  keyword: string;
  type: 'keyword' | 'model' | 'product';
  heat: number;
  trend: 'up' | 'down' | 'stable';
  cover?: string;
  id?: string;
}

export interface SearchResultItem {
  id: string;
  type: 'product' | 'model' | 'community';
  title: string;
  subtitle?: string;
  cover: string;
  price?: number;
  originalPrice?: number;
  condition?: string;
  memberCount?: number;
  postCount?: number;
  productCount?: number;
  sellerType?: 'personal' | 'merchant';
  sellerName?: string;
  tags?: string[];
  highlight?: string;
}

export interface SearchParams {
  keyword?: string;
  modelId?: string;
  type?: 'all' | 'product' | 'model' | 'community';
  deviceTypeId?: string | number;
  brandId?: string | number;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  sellerType?: 'personal' | 'merchant';
  tradeMethod?: string;
  hasInvoice?: boolean;
  hasWarranty?: boolean;
  canInspect?: boolean;
  freeShipping?: boolean;
  publishTime?: string;
  storage?: string;
  sort?: 'relevance' | 'new' | 'price' | 'sales';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  size?: number;
}

export interface SearchResult {
  list: SearchResultItem[];
  total: number;
  hasMore: boolean;
  aggregations?: SearchAggregations;
}

export interface SearchAggregations {
  productCount: number;
  modelCount: number;
  communityCount: number;
  brands: { id: string; name: string; count: number }[];
  conditions: { name: string; value: string; count: number }[];
  priceRange: { min: number; max: number };
  storages: { value: string; name: string; count: number }[];
}

export interface HotModelItem {
  id: string;
  name: string;
  brand: string;
  cover: string;
  productCount: number;
  heat: number;
  trend: 'up' | 'down' | 'stable';
}

export interface HotCommunityItem {
  id: string;
  name: string;
  type: 'model' | 'user';
  cover: string;
  memberCount: number;
  postCount: number;
}

export const searchApi = {
  getSuggestions: (keyword: string, limit?: number) => {
    return http<SearchSuggestion[]>({
      url: '/search/suggestions',
      method: 'GET',
      data: { keyword, limit }
    });
  },

  getHotSearches: (limit?: number) => {
    return http<HotSearchItem[]>({
      url: '/search/hot',
      method: 'GET',
      data: { limit }
    });
  },

  search: (params: SearchParams) => {
    return http<SearchResult>({
      url: '/search',
      method: 'GET',
      data: params
    });
  },

  searchProducts: (params: SearchParams) => {
    return http<SearchResult>({
      url: '/search/products',
      method: 'GET',
      data: { ...params, type: 'product' }
    });
  },

  searchModels: (params: SearchParams) => {
    return http<SearchResult>({
      url: '/search/models',
      method: 'GET',
      data: { ...params, type: 'model' }
    });
  },

  searchCommunities: (params: SearchParams) => {
    return http<SearchResult>({
      url: '/search/communities',
      method: 'GET',
      data: { ...params, type: 'community' }
    });
  },

  getHotModels: (limit?: number) => {
    return http<HotModelItem[]>({
      url: '/search/hot-models',
      method: 'GET',
      data: { limit }
    });
  },

  getHotCommunities: (limit?: number) => {
    return http<HotCommunityItem[]>({
      url: '/search/hot-communities',
      method: 'GET',
      data: { limit }
    });
  },

  getRecommendKeywords: (limit?: number) => {
    return http<{ keyword: string; category?: string }[]>({
      url: '/search/recommend-keywords',
      method: 'GET',
      data: { limit }
    });
  },

  getSearchFilters: (keyword: string) => {
    return http<SearchAggregations>({
      url: '/search/filters',
      method: 'GET',
      data: { keyword }
    });
  }
};
