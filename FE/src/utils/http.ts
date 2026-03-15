// src/utils/http.ts

const DEBUG = process.env.NODE_ENV !== 'production';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.xinmall.com/api'
  : 'http://localhost:8080/api';
const TIMEOUT = 10000;

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
  loading?: boolean; // 是否显示 loading
}

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
      console.log('[API Request]', options.method || 'GET', url);
      if (options.data) {
        console.log('[API Request Data]', options.data);
      }
    }

    uni.request({
      url,
      method: options.method || 'GET',
      data: options.method !== 'GET' ? options.data : undefined,
      header: header,
      timeout: TIMEOUT,
      success: (res: any) => {
        if (DEBUG) {
          console.log('[API Response]', url, res.statusCode, res.data);
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 200 || res.data.code === 201) {
            resolve(res.data.data as T);
          } else {
            uni.showToast({ title: res.data.message || '请求失败', icon: 'none' });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.navigateTo({ url: '/pages-sub/user/login/index' });
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
          console.error('[API Error]', url, err);
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