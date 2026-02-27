import { http } from '@/utils/http';

export const authApi = {
  // 登录 (假设用手机号+验证码)
  login: (phone: string, code: string) => {
    return http<{ token: string; user: any }>({
      url: '/auth/login',
      method: 'POST',
      data: { phone, code },
      loading: true
    });
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return http<any>({
      url: '/user/profile',
      method: 'GET'
    });
  }
};