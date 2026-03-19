import { http } from '@/utils/http';

export interface CategoryVO {
  id: number;
  name: string;
  parentId?: number;
  level?: number;
  icon?: string;
  image?: string;
  sort?: number;
  children?: CategoryVO[];
}

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
  size?: number;
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
  size?: number;
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

export interface CategoryItem {
  id: string;
  name: string;
  productCount: number;
  letter: string;
}

export interface BackendModelItem {
  id: number;
  title?: string;
  name?: string;
  brandId?: number;
  brandName?: string;
  deviceTypeId?: number;
  categoryId?: number;
  deviceTypeName?: string;
  categoryName?: string;
  cover?: string;
  productCount?: number;
  price?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  specs?: Record<string, string>;
  tags?: string[];
}

export const categoryApi = {
  getDeviceCategories: () => {
    return http<CategoryVO[]>({
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
    // 将前端的 deviceTypeId 映射为后端的参数
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.deviceTypeId) {
      queryParams.deviceTypeId = params.deviceTypeId;
    }
    if (params.brandId) {
      queryParams.brandId = params.brandId;
    }
    if (params.subCategoryId) {
      queryParams.subCategoryId = params.subCategoryId;
    }
    if (params.keyword) {
      queryParams.keyword = params.keyword;
    }
    if (params.sort) {
      queryParams.sort = params.sort;
    }
    if (params.priceOrder) {
      queryParams.priceOrder = params.priceOrder;
    }
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.size) {
      queryParams.pageSize = params.size;
    }

    // 使用 /search/models 接口，不需要 keyword 参数
    return http<{ list: BackendModelItem[]; total: number; hasMore: boolean }>({
      url: '/search/models',
      method: 'GET',
      data: queryParams
    }).then(result => {
      // 转换后端返回的分页数据格式
      const list = result.list || [];
      return {
        list: list.map((item: BackendModelItem) => ({
          id: String(item.id),
          name: item.title || item.name || '',
          brandId: String(item.brandId || ''),
          brandName: item.brandName || '',
          deviceTypeId: String(item.deviceTypeId || item.categoryId || ''),
          deviceTypeName: item.deviceTypeName || item.categoryName || '',
          cover: item.cover || '',
          productCount: item.productCount || 0,
          priceRange: {
            min: item.price ? item.price * 100 : (item.priceRange?.min || 0),
            max: item.price ? item.price * 100 : (item.priceRange?.max || 0)
          },
          specs: item.specs || {},
          tags: item.tags || []
        })),
        total: result.total || list.length,
        hasMore: result.hasMore !== undefined ? result.hasMore : false
      };
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

  searchModels: (keyword: string, page?: number, size?: number) => {
    return http<ModelListResult>({
      url: '/spu/search',
      method: 'GET',
      data: { keyword, page, size }
    });
  },

  getAllCategories: () => {
    return http<AlphabetCategory[]>({
      url: '/category/all',
      method: 'GET'
    });
  }
};
