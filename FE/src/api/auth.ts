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
  followers: number;
  following: number;
  likes: number;
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

export interface UserDetailInfo extends UserInfo {
  cover: string;
  level?: number;
  levelName?: string;
  isVerified: boolean;
  isFollowed: boolean;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  postsCount: number;
  goodsCount: number;
  tags: string[];
  location?: string;
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
      url: '/user/info',
      method: 'GET'
    });
  },

  updateUserInfo: (data: Partial<UserInfo>) => {
    return http<UserInfo>({
      url: '/user/info',
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
  },

  getUserProfile: (userId: string) => {
    return http<UserDetailInfo>({
      url: `/user/profile/${userId}`,
      method: 'GET'
    });
  },

  followUser: (userId: string) => {
    return http<{ success: boolean; followersCount: number }>({
      url: `/user/follow/${userId}`,
      method: 'POST'
    });
  },

  unfollowUser: (userId: string) => {
    return http<{ success: boolean; followersCount: number }>({
      url: `/user/unfollow/${userId}`,
      method: 'POST'
    });
  },

  getUserGoods: (userId: string, params?: { status?: 'all' | 'selling' | 'sold'; page?: number; pageSize?: number }) => {
    return http<{ list: any[]; total: number; hasMore: boolean }>({
      url: `/user/goods/${userId}`,
      method: 'GET',
      data: params
    });
  },

  getUserCollections: (userId: string, params?: { page?: number; pageSize?: number }) => {
    return http<{ list: any[]; total: number; hasMore: boolean }>({
      url: `/user/collections/${userId}`,
      method: 'GET',
      data: params
    });
  },

  getUserLikes: (userId: string, params?: { page?: number; pageSize?: number }) => {
    return http<{ list: any[]; total: number; hasMore: boolean }>({
      url: `/user/likes/${userId}`,
      method: 'GET',
      data: params
    });
  }
};
