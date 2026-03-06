// src/utils/http.ts

// 基础配置
const BASE_URL = 'https://api.xinmall.com/v1'; // 替换为你的真实域名
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

    uni.request({
      url,
      method: options.method || 'GET',
      data: options.method !== 'GET' ? options.data : undefined,
      header: header,
      timeout: TIMEOUT,
      success: (res: any) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 0) {
            resolve(res.data.data as T);
          } else {
            uni.showToast({ title: res.data.msg || '请求失败', icon: 'none' });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          uni.removeStorageSync('token');
          uni.navigateTo({ url: '/pages-sub/user/login/index' });
          reject(res);
        } else {
          uni.showToast({ title: '服务器开小差了', icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接失败', icon: 'none' });
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