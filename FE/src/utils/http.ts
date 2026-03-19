// src/utils/http.ts

import { apiLogger } from './logger';

const DEBUG = process.env.NODE_ENV !== 'production';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.xinmall.com/api'
  : 'http://localhost:8080/api';
const TIMEOUT = 10000;

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface HttpError {
  statusCode: number;
  message: string;
  data?: unknown;
}

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  loading?: boolean;
  skipAuthRefresh?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = uni.getStorageSync('refreshToken');
  if (!refreshToken) {
    return false;
  }

  isRefreshing = true;
  refreshPromise = new Promise((resolve) => {
    uni.request({
      url: BASE_URL + '/auth/token/refresh',
      method: 'POST',
      data: { refreshToken },
      header: { 'Content-Type': 'application/json' },
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        const data = res.data as ApiResponse<{ token: string; refreshToken: string }>;
        if (res.statusCode === 200 && data.code === 200) {
          const { token, refreshToken: newRefreshToken } = data.data;
          uni.setStorageSync('token', token);
          if (newRefreshToken) {
            uni.setStorageSync('refreshToken', newRefreshToken);
          }
          resolve(true);
        } else {
          uni.removeStorageSync('token');
          uni.removeStorageSync('refreshToken');
          resolve(false);
        }
      },
      fail: () => {
        uni.removeStorageSync('token');
        uni.removeStorageSync('refreshToken');
        resolve(false);
      },
      complete: () => {
        isRefreshing = false;
        refreshPromise = null;
      }
    });
  });

  return refreshPromise;
};

export const http = <T>(options: RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const header = {
      'Content-Type': 'application/json',
      ...options.header,
    };
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    if (options.loading) {
      uni.showLoading({ title: '加载中...', mask: true });
    }

    let url = options.url.startsWith('http') ? options.url : BASE_URL + options.url;
    
    if (options.method === 'GET' && options.data) {
      const params = new URLSearchParams();
      Object.entries(options.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    if (DEBUG) {
      apiLogger.log('[Request]', options.method || 'GET', url);
      if (options.data) {
        apiLogger.debug('[Request Data]', options.data);
      }
    }

    uni.request({
      url,
      method: options.method || 'GET',
      data: options.method !== 'GET' ? options.data : undefined,
      header: header,
      timeout: TIMEOUT,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        const response = res.data as ApiResponse;
        if (DEBUG) {
          apiLogger.log('[Response]', url, res.statusCode, res.data);
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (response.code === 200 || response.code === 201) {
            resolve(res.data.data as T);
          } else {
            uni.showToast({ title: response.message || '请求失败', icon: 'none' });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 清除过期的token
          uni.removeStorageSync('token');
          uni.removeStorageSync('refreshToken');

          // 显示提示并跳转登录页
          uni.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 1500
          });

          setTimeout(() => {
            uni.navigateTo({ url: '/pages-sub/user/login/index' });
          }, 500);

          reject(res);
        } else if (res.statusCode === 403) {
          uni.showToast({ title: '没有访问权限', icon: 'none' });
          reject(res);
        } else if (res.statusCode === 404) {
          uni.showToast({ title: '接口不存在', icon: 'none' });
          reject(res);
        } else {
          uni.showToast({ title: `服务器错误(${res.statusCode})`, icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        if (DEBUG) {
          apiLogger.error('[Error]', url, err);
        }
        
        let message = '网络连接失败';
        if (err.errMsg) {
          if (err.errMsg.includes('timeout')) {
            message = '请求超时，请检查网络或后端服务';
          } else if (err.errMsg.includes('network')) {
            message = '网络不可用，请检查网络连接';
          }
        }
        uni.showToast({ title: message, icon: 'none' });
        reject(err);
      },
      complete: () => {
        if (options.loading) {
          uni.hideLoading();
        }
      },
    });
  });
};

export const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return '/static/default-avatar.png';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) {
    return BASE_URL.replace('/api', '') + url;
  }
  if (url.startsWith('/static')) return url;
  return url;
};

export const getServerBaseUrl = (): string => {
  return BASE_URL.replace('/api', '');
};