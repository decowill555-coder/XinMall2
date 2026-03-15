import { http } from '@/utils/http';

export interface BannerItem {
  id: number;
  image: string;
  title: string;
  link: string;
  sort: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export const bannerApi = {
  getBannerList: () => {
    return http<BannerItem[]>({
      url: '/banner/list',
      method: 'GET'
    });
  }
};
