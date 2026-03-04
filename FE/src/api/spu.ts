import { http } from '@/utils/http';

export interface SpuItem {
  id: string;
  name: string;
  cover: string;
  brand: string;
}

export interface HotSpuItem {
  id: string | number;
  keyword: string;
  rank: number;
  heat: number;
  trend: 'up' | 'down' | 'stable';
}

export const spuApi = {
  searchSpu: (keyword: string) => {
    return http<SpuItem[]>({
      url: '/spu/search',
      method: 'GET',
      data: { keyword }
    });
  },

  getSpuDetail: (id: string) => {
    return http<any>({
      url: `/spu/${id}`,
      method: 'GET'
    });
  },

  getHotSpus: (limit: number = 10) => {
    return http<HotSpuItem[]>({
      url: '/spu/hot',
      method: 'GET',
      data: { limit }
    });
  }
};