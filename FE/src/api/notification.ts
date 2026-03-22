import { http } from '@/utils/http';

// 通知类型枚举
export type NotificationType =
  | 'ORDER_SHIPPED'
  | 'ORDER_RECEIVED'
  | 'ORDER_CANCELLED'
  | 'ORDER_REFUND'
  | 'REAL_NAME_SUCCESS'
  | 'REAL_NAME_FAILED'
  | 'PRODUCT_AUDIT_PASS'
  | 'PRODUCT_AUDIT_FAIL'
  | 'TRADE_SUCCESS'
  | 'SECURITY_ALERT'
  | 'SYSTEM_NOTICE';

// 互动类型枚举
export type InteractionType =
  | 'POST_LIKE'
  | 'POST_COMMENT'
  | 'COMMENT_REPLY'
  | 'FOLLOW'
  | 'POST_COLLECT';

// 系统通知VO
export interface SystemNotificationVO {
  id: number;
  type: NotificationType;
  typeName: string;
  icon: string;
  iconColor: string;
  title: string;
  content: string;
  relatedId: number | null;
  relatedType: string | null;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

// 互动消息VO
export interface InteractionMessageVO {
  id: number;
  actorId: number;
  actorName: string;
  actorAvatar: string;
  type: InteractionType;
  typeName: string;
  postId: number | null;
  postTitle: string | null;
  commentId: number | null;
  content: string | null;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

// 分页结果
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const notificationApi = {
  // 获取系统通知列表
  getNotifications: (page: number = 1, size: number = 20) => {
    return http<PageResult<SystemNotificationVO>>({
      url: '/notification/list',
      method: 'GET',
      data: { page, size }
    });
  },

  // 获取未读通知数量
  getUnreadCount: () => {
    return http<{ count: number }>({
      url: '/notification/unread-count',
      method: 'GET'
    });
  },

  // 标记通知为已读
  markAsRead: (id: number) => {
    return http<void>({
      url: `/notification/${id}/read`,
      method: 'PUT'
    });
  },

  // 标记所有通知为已读
  markAllAsRead: () => {
    return http<void>({
      url: '/notification/read-all',
      method: 'PUT'
    });
  },

  // 删除通知
  deleteNotification: (id: number) => {
    return http<void>({
      url: `/notification/${id}`,
      method: 'DELETE'
    });
  }
};

export const interactionApi = {
  // 获取互动消息列表
  getInteractions: (page: number = 1, size: number = 20) => {
    return http<PageResult<InteractionMessageVO>>({
      url: '/interaction/list',
      method: 'GET',
      data: { page, size }
    });
  },

  // 获取未读互动消息数量
  getUnreadCount: () => {
    return http<{ count: number }>({
      url: '/interaction/unread-count',
      method: 'GET'
    });
  },

  // 标记互动消息为已读
  markAsRead: (id: number) => {
    return http<void>({
      url: `/interaction/${id}/read`,
      method: 'PUT'
    });
  },

  // 标记所有互动消息为已读
  markAllAsRead: () => {
    return http<void>({
      url: '/interaction/read-all',
      method: 'PUT'
    });
  },

  // 删除互动消息
  deleteInteraction: (id: number) => {
    return http<void>({
      url: `/interaction/${id}`,
      method: 'DELETE'
    });
  }
};
