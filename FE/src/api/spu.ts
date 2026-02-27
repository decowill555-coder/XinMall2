import { http } from '@/utils/http';

export interface SpuItem {
  id: string;
  name: string; // iPhone 15 Pro
  cover: string;
  brand: string;
}

export const spuApi = {
  // 搜索型号
  searchSpu: (keyword: string) => {
    return http<SpuItem[]>({
      url: '/spu/search',
      method: 'GET',
      data: { keyword }
    });
  },

  // 获取型号详情
  getSpuDetail: (id: string) => {
    return http<any>({
      url: `/spu/${id}`,
      method: 'GET'
    });
  }
};