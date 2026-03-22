// src/utils/http.ts

import { apiLogger } from './logger';

const DEBUG = process.env.NODE_ENV !== 'production';

// 开发环境和生产环境都使用当前运行的服务器地址
// 生产环境应该配置为实际的服务器地址
export const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // 生产环境使用相对路径，由nginx代理
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
            // 业务错误不显示 toast，让调用方处理
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
          // 服务器错误不显示 toast，让调用方处理
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
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // 如果是/uploads路径，使用当前服务器地址
  if (url.startsWith('/uploads')) {
    // 开发环境使用localhost:8080，生产环境使用相对路径（由nginx代理）
    if (process.env.NODE_ENV === 'production') {
      return url;  // 生产环境直接返回相对路径
    }
    return 'http://localhost:8080' + url;  // 开发环境拼接完整URL
  }
  if (url.startsWith('/static')) return url;
  return url;
};

export const getServerBaseUrl = (): string => {
  // 开发环境返回完整URL，生产环境返回空（使用相对路径）
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return 'http://localhost:8080';
};