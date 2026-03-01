import { authApi } from './auth';
import { spuApi } from './spu';
import { tradeApi } from './trade';
import { uploadApi } from './upload';

export { authApi, spuApi, tradeApi, uploadApi };

export const api = {
  auth: authApi,
  spu: spuApi,
  trade: tradeApi,
  upload: uploadApi
};