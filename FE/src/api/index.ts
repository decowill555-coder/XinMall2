import { authApi } from './auth';
import { spuApi } from './spu';
import { tradeApi } from './trade';
import { uploadApi } from './upload';
import { searchApi } from './search';
import { forumApi } from './community';
import { categoryApi } from './category';
import { bannerApi } from './banner';
import { messageApi } from './message';

export { authApi, spuApi, tradeApi, uploadApi, searchApi, forumApi, categoryApi, bannerApi, messageApi };

export const api = {
  auth: authApi,
  spu: spuApi,
  trade: tradeApi,
  upload: uploadApi,
  search: searchApi,
  forum: forumApi,
  category: categoryApi,
  banner: bannerApi,
  message: messageApi
};