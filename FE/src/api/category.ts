import { http } from '@/utils/http';

export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  productCount: number;
  letter: string;
}

export interface AlphabetCategory {
  letter: string;
  categories: CategoryItem[];
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface DeviceTypeDetail {
  id: string;
  name: string;
  subCategories: SubCategory[];
  brands: Brand[];
  productCount: number;
}

export interface ProductListItem {
  id: string | number;
  cover: string;
  title: string;
  price: number;
  sales: number;
  condition?: string;
  specs?: string;
  tags?: string[];
  isNew?: boolean;
}

export interface DeviceTypeProductsParams {
  deviceTypeId: string;
  subCategoryId?: string;
  brandId?: string;
  sort?: 'recommend' | 'sales' | 'new' | 'price';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface DeviceTypeProductsResult {
  list: ProductListItem[];
  total: number;
  hasMore: boolean;
}

export const categoryApi = {
  getDeviceCategories: () => {
    return http<DeviceCategory[]>({
      url: `/category/device-categories`,
      method: 'GET'
    });
  },

  getAllCategories: () => {
    return http<AlphabetCategory[]>({
      url: `/category/all`,
      method: 'GET'
    });
  },

  getCategoriesByLetter: (letter: string) => {
    return http<CategoryItem[]>({
      url: `/category/letter/${letter}`,
      method: 'GET'
    });
  },

  getCategoryDetail: (id: string) => {
    return http<{
      id: string;
      name: string;
      description: string;
      productCount: number;
      children?: CategoryItem[];
    }>({
      url: `/category/${id}`,
      method: 'GET'
    });
  },

  getDeviceTypeDetail: (id: string) => {
    return http<DeviceTypeDetail>({
      url: `/category/device-type/${id}`,
      method: 'GET'
    });
  },

  getDeviceTypeProducts: (params: DeviceTypeProductsParams) => {
    return http<DeviceTypeProductsResult>({
      url: `/category/device-type/${params.deviceTypeId}/products`,
      method: 'GET',
      data: params
    });
  }
};
