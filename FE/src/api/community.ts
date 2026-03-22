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
  isOfficial: boolean;
  creatorId?: string;
  creatorName?: string;
  createdAt: string;
  isJoined: boolean;
  isAdmin: boolean;
}

export interface ForumListItem {
  id: string;
  name: string;
  type: 'model' | 'user';
  cover: string;
  description: string;
  memberCount: number;
  postCount: number;
  isOfficial: boolean;
  isJoined: boolean;
}

export interface ForumListParams {
  type?: 'model' | 'user';
  keyword?: string;
  sort?: 'hot' | 'new' | 'member';
  page?: number;
  pageSize?: number;
}

export interface ForumListResult {
  list: ForumListItem[];
  total: number;
  hasMore: boolean;
}

export interface CreateForumParams {
  name: string;
  description: string;
  cover?: string;
}

export interface PostAuthor {
  id: string;
  name: string;
  avatar: string;
  level?: number;
  levelName?: string;
}

export interface PostListItem {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  images: string[];
  tags: string[];
  likeCount: number;
  commentCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
  isPinned: boolean;
  isEssence: boolean;
  createdAt: string;
  forumId?: string;
  forumName?: string;
}

export interface PostListParams {
  forumId?: string;
  tag?: string;
  type?: 'all' | 'pinned' | 'essence';
  sort?: 'new' | 'hot' | 'comment';
  page?: number;
  pageSize?: number;
}

export interface PostListResult {
  list: PostListItem[];
  total: number;
  hasMore: boolean;
}

export interface PostDetail extends PostListItem {
  viewCount: number;
  shareCount: number;
}

export interface CreatePostParams {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  spuId?: number;
}

export interface CommentItem {
  id: string;
  content: string;
  images: string[];
  author: PostAuthor;
  likeCount: number;
  isLiked: boolean;
  replyToId?: string;
  replyTo?: {
    id: string;
    authorName: string;
    content: string;
  };
  replies?: CommentItem[];
  replyCount?: number;
  isCollapsed?: boolean;
  createdAt: string;
}

export interface CommentListParams {
  postId: string;
  sort?: 'new' | 'hot';
  page?: number;
  pageSize?: number;
}

export interface CommentListResult {
  list: CommentItem[];
  total: number;
  hasMore: boolean;
}

export interface CreateCommentParams {
  postId: string;
  content: string;
  images?: string[];
  parentId?: string;
  replyToId?: string;
  replyToUserId?: string;
}

export interface UserForumLevel {
  forumId: string;
  forumName: string;
  level: number;
  levelName: string;
  exp: number;
  nextLevelExp: number;
  postCount: number;
  commentCount: number;
  joinTime: string;
}

export const forumApi = {
  getForumList: (params: ForumListParams) => {
    return http<ForumListResult>({
      url: '/community/list',
      method: 'GET',
      data: params
    });
  },

  getForumDetail: (id: string) => {
    return http<ForumDetail>({
      url: `/community/${id}`,
      method: 'GET'
    });
  },

  getForumByName: (name: string) => {
    return http<ForumDetail>({
      url: '/community/by-name',
      method: 'GET',
      data: { name }
    });
  },

  createForum: (params: CreateForumParams) => {
    return http<{ id: string; status: 'pending' | 'approved' }>({
      url: '/community/create',
      method: 'POST',
      data: params
    });
  },

  joinForum: (forumId: string) => {
    return http<{ success: boolean }>({
      url: `/community/${forumId}/join`,
      method: 'POST'
    });
  },

  leaveForum: (forumId: string) => {
    return http<{ success: boolean }>({
      url: `/community/${forumId}/leave`,
      method: 'POST'
    });
  },

  getJoinedForums: (page?: number, pageSize?: number) => {
    return http<ForumListResult>({
      url: '/community/joined',
      method: 'GET',
      data: { page, pageSize }
    });
  },

  getUserForumLevel: (forumId: string) => {
    return http<UserForumLevel>({
      url: `/community/${forumId}/level`,
      method: 'GET'
    });
  },

  getPosts: (params: PostListParams) => {
    return http<PostListResult>({
      url: '/post/list',
      method: 'GET',
      data: params
    });
  },

  getPostDetail: (postId: string) => {
    return http<PostDetail>({
      url: `/post/${postId}`,
      method: 'GET'
    });
  },

  createPost: (params: CreatePostParams) => {
    return http<{ id: string }>({
      url: '/post',
      method: 'POST',
      data: params
    });
  },

  deletePost: (postId: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}`,
      method: 'DELETE'
    });
  },

  likePost: (postId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/post/${postId}/like`,
      method: 'POST'
    });
  },

  unlikePost: (postId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/post/${postId}/like`,
      method: 'DELETE'
    });
  },

  collectPost: (postId: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/collect`,
      method: 'POST'
    });
  },

  uncollectPost: (postId: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/collect`,
      method: 'DELETE'
    });
  },

  pinPost: (postId: string, forumId?: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/pin`,
      method: 'PUT',
      data: { forumId }
    });
  },

  unpinPost: (postId: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/unpin`,
      method: 'PUT'
    });
  },

  setEssence: (postId: string, forumId?: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/essence`,
      method: 'PUT',
      data: { forumId }
    });
  },

  unsetEssence: (postId: string) => {
    return http<{ success: boolean }>({
      url: `/post/${postId}/essence`,
      method: 'DELETE'
    });
  },

  getComments: (params: CommentListParams) => {
    return http<CommentListResult>({
      url: `/comment/list/${params.postId}`,
      method: 'GET',
      data: { sort: params.sort, page: params.page, pageSize: params.pageSize }
    });
  },

  getReplies: (commentId: string, page?: number, pageSize?: number) => {
    return http<CommentListResult>({
      url: `/comment/replies/${commentId}`,
      method: 'GET',
      data: { page, pageSize }
    });
  },

  createComment: (params: CreateCommentParams) => {
    return http<{ id: string }>({
      url: '/comment',
      method: 'POST',
      data: params
    });
  },

  deleteComment: (commentId: string) => {
    return http<{ success: boolean }>({
      url: `/comment/${commentId}`,
      method: 'DELETE'
    });
  },

  likeComment: (commentId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/comment/${commentId}/like`,
      method: 'POST'
    });
  },

  unlikeComment: (commentId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/comment/${commentId}/like`,
      method: 'DELETE'
    });
  },

  getHotTags: (forumId?: string, limit?: number) => {
    return http<{ name: string; count: number }[]>({
      url: '/community/tags/hot',
      method: 'GET',
      data: { forumId, limit }
    });
  },

  searchPosts: (keyword: string, page?: number, pageSize?: number) => {
    return http<PostListResult>({
      url: '/search/communities',
      method: 'GET',
      data: { keyword, page, pageSize }
    });
  },

  getMyPosts: (page?: number, pageSize?: number) => {
    return http<PostListResult>({
      url: '/post/my',
      method: 'GET',
      data: { page, pageSize }
    });
  },

  getUserPosts: (userId: string, page?: number, pageSize?: number) => {
    return http<PostListResult>({
      url: `/post/user/${userId}`,
      method: 'GET',
      data: { page, pageSize }
    });
  },

  getFollowedPosts: (page?: number, pageSize?: number) => {
    return http<PostListResult>({
      url: '/post/followed',
      method: 'GET',
      data: { page, pageSize }
    });
  }
};
