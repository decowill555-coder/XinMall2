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
  }
};
