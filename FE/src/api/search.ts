import { http } from '@/utils/http';

export interface SearchSuggestionItem {
  id: string;
  type: 'model' | 'forum';
  name: string;
  subtitle?: string;
  cover?: string;
  forumType?: 'model' | 'user';
  memberCount?: number;
  brand?: string;
  modelId?: string;
  forumId?: string;
}

export interface HotModelItem {
  id: string;
  name: string;
  brand: string;
  cover: string;
  heat: number;
  trend: 'up' | 'down' | 'stable';
}

export interface HotForumItem {
  id: string;
  name: string;
  type: 'model' | 'user';
  memberCount: number;
  postCount: number;
  cover?: string;
}

export const searchApi = {
  getSearchSuggestions: (keyword: string) => {
    return http<SearchSuggestionItem[]>({
      url: `/search/suggestions?keyword=${encodeURIComponent(keyword)}`,
      method: 'GET'
    });
  },

  getHotModels: (limit: number = 10) => {
    return http<HotModelItem[]>({
      url: `/search/hot-models?limit=${limit}`,
      method: 'GET'
    });
  },

  getHotForums: (limit: number = 10) => {
    return http<HotForumItem[]>({
      url: `/search/hot-forums?limit=${limit}`,
      method: 'GET'
    });
  },

  searchModels: (keyword: string, page: number = 1, pageSize: number = 20) => {
    return http<{
      list: any[];
      total: number;
      page: number;
      pageSize: number;
    }>({
      url: `/search/models`,
      method: 'GET',
      data: { keyword, page, pageSize }
    });
  }
};
