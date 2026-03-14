import { http } from '@/utils/http';

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  letter: string;
}

export interface AlphabetCategory {
  letter: string;
  categories: DeviceCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export interface DeviceTypeDetail {
  id: string;
  name: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
  brands: Brand[];
  productCount: number;
}

export interface ModelListItem {
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
  specs: Record<string, string>;
  tags: string[];
}

export interface ModelListParams {
  deviceTypeId: string;
  brandId?: string;
  subCategoryId?: string;
  keyword?: string;
  sort?: 'recommend' | 'sales' | 'new' | 'price';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ModelListResult {
  list: ModelListItem[];
  total: number;
  hasMore: boolean;
}

export interface ModelDetail {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  deviceTypeId: string;
  deviceTypeName: string;
  cover: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  productCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  avgRating: number;
  tags: string[];
}

export interface ModelProductParams {
  modelId: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'recommend' | 'price' | 'sales' | 'new';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ModelProductItem {
  id: string;
  cover: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  sellerType: 'personal' | 'merchant';
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  createTime: string;
}

export interface ModelProductResult {
  list: ModelProductItem[];
  total: number;
  hasMore: boolean;
}

export interface HotModel {
  id: string;
  name: string;
  brandName: string;
  cover: string;
  productCount: number;
  trend: 'up' | 'down' | 'stable';
}

export const categoryApi = {
  getDeviceCategories: () => {
    return http<AlphabetCategory[]>({
      url: '/category/tree',
      method: 'GET'
    });
  },

  getDeviceTypeDetail: (id: string) => {
    return http<DeviceTypeDetail>({
      url: `/category/${id}`,
      method: 'GET'
    });
  },

  getModels: (params: ModelListParams) => {
    return http<ModelListResult>({
      url: '/spu/search',
      method: 'GET',
      data: params
    });
  },

  getModelDetail: (id: string) => {
    return http<ModelDetail>({
      url: `/spu/${id}`,
      method: 'GET'
    });
  },

  getModelProducts: (params: ModelProductParams) => {
    return http<ModelProductResult>({
      url: `/spu/${params.modelId}/products`,
      method: 'GET',
      data: params
    });
  },

  getHotModels: (deviceTypeId?: string, limit?: number) => {
    return http<HotModel[]>({
      url: '/spu/hot',
      method: 'GET',
      data: { deviceTypeId, limit }
    });
  },

  getBrands: (deviceTypeId?: string) => {
    return http<Brand[]>({
      url: '/brand/list',
      method: 'GET',
      data: { categoryId: deviceTypeId }
    });
  },

  searchModels: (keyword: string, page?: number, pageSize?: number) => {
    return http<ModelListResult>({
      url: '/spu/search',
      method: 'GET',
      data: { keyword, page, pageSize }
    });
  }
};
