import { authApi } from './auth';
import { spuApi } from './spu';
import { tradeApi } from './trade';
import { uploadApi } from './upload';
import { searchApi } from './search';
import { forumApi } from './forum';
import { categoryApi } from './category';

export { authApi, spuApi, tradeApi, uploadApi, searchApi, forumApi, categoryApi };

export const api = {
  auth: authApi,
  spu: spuApi,
  trade: tradeApi,
  upload: uploadApi,
  search: searchApi,
  forum: forumApi,
  category: categoryApi
};