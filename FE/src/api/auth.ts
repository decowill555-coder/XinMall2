import { http } from '@/utils/http';

export interface LoginParams {
  phone: string;
  password: string;
}

export interface LoginResult {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo{
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  gender: 0 | 1 | 2;
  birthday: string;
  signature: string;
  isSeller: boolean;
  sellerId: string | null;
  createTime: string;
}

export interface SendCodeParams {
  phone: string;
  type: 'register' | 'forgot' | 'login';
}

export interface RegisterParams {
  phone: string;
  code: string;
  password: string;
}

export interface ResetPasswordParams {
  phone: string;
  code: string;
  password: string;
}

export interface SocialLoginParams {
  platform: 'wechat' | 'alipay';
  code: string;
}

export interface SocialLoginResult {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
  isNewUser: boolean;
}

export interface RefreshTokenResult {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  login: (params: LoginParams) => {
    return http<LoginResult>({
      url: '/auth/login',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  sendCode: (params: SendCodeParams) => {
    return http<{ success: boolean; expireIn: number }>({
      url: '/auth/sms/send',
      method: 'POST',
      data: params
    });
  },

  register: (params: RegisterParams) => {
    return http<LoginResult>({
      url: '/auth/register',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  resetPassword: (params: ResetPasswordParams) => {
    return http<{ success: boolean }>({
      url: '/auth/password/reset',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  socialLogin: (params: SocialLoginParams) => {
    return http<SocialLoginResult>({
      url: '/auth/social/login',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  wechatLogin: (code: string) => {
    return authApi.socialLogin({ platform: 'wechat', code });
  },

  alipayLogin: (code: string) => {
    return authApi.socialLogin({ platform: 'alipay', code });
  },

  logout: () => {
    return http<{ success: boolean }>({
      url: '/auth/logout',
      method: 'POST'
    });
  },

  refreshToken: (refreshToken: string) => {
    return http<RefreshTokenResult>({
      url: '/auth/token/refresh',
      method: 'POST',
      data: { refreshToken }
    });
  },

  getUserInfo: () => {
    return http<UserInfo>({
      url: '/user/profile',
      method: 'GET'
    });
  },

  updateUserInfo: (data: Partial<UserInfo>) => {
    return http<UserInfo>({
      url: '/user/profile',
      method: 'PUT',
      data
    });
  },

  checkPhone: (phone: string) => {
    return http<{ exists: boolean }>({
      url: '/auth/check/phone',
      method: 'GET',
      data: { phone }
    });
  }
};
