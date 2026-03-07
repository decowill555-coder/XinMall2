import { http } from '@/utils/http';

export interface ForumDetail {
  id: string;
  name: string;
  type: 'model' | 'user';
  description: string;
  cover: string;
  memberCount: number;
  postCount: number;
  modelId?: string;
  modelName?: string;
  creatorId?: string;
  creatorName?: string;
  createdAt: string;
  isJoined: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface ModelForum {
  id: string;
  modelId: string;
  modelName: string;
  forumId: string;
  forumName: string;
  memberCount: number;
}

export interface UserForum {
  id: string;
  name: string;
  description: string;
  cover: string;
  memberCount: number;
  postCount: number;
  creatorId: string;
  createdAt: string;
}

export const forumApi = {
  getForumDetail: (id: string) => {
    return http<ForumDetail>({
      url: `/forum/${id}`,
      method: 'GET'
    });
  },

  getModelForum: (modelId: string) => {
    return http<ModelForum>({
      url: `/forum/model/${modelId}`,
      method: 'GET'
    });
  },

  getUserForums: (userId?: string, page: number = 1, pageSize: number = 20) => {
    return http<{
      list: UserForum[];
      total: number;
      page: number;
      pageSize: number;
    }>({
      url: `/forum/user-forums`,
      method: 'GET',
      data: { userId, page, pageSize }
    });
  },

  getForumPosts: (forumId: string, page: number = 1, pageSize: number = 20) => {
    return http<{
      list: ForumPost[];
      total: number;
      page: number;
      pageSize: number;
    }>({
      url: `/forum/${forumId}/posts`,
      method: 'GET',
      data: { page, pageSize }
    });
  },

  joinForum: (forumId: string) => {
    return http<{ success: boolean }>({
      url: `/forum/${forumId}/join`,
      method: 'POST'
    });
  },

  leaveForum: (forumId: string) => {
    return http<{ success: boolean }>({
      url: `/forum/${forumId}/leave`,
      method: 'POST'
    });
  },

  createForum: (data: { name: string; description: string; cover?: string }) => {
    return http<ForumDetail>({
      url: `/forum/create`,
      method: 'POST',
      data
    });
  }
};
