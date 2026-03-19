import { http } from '@/utils/http';

export type MessageType = 'text' | 'image' | 'goods_card' | 'order_card';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ConversationVO {
  id: number;
  targetId: number;
  targetName: string;
  targetAvatar: string;
  lastMessage: string;
  lastMessageType: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
}

export interface MessageVO {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  receiverId: number;
  type: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface SendMessageRequest {
  receiverId: number;
  type: number;
  content: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  hasMore: boolean;
  // 兼容旧格式
  records?: T[];
  size?: number;
  current?: number;
  pages?: number;
}

export const messageApi = {
  getConversationList: () => {
    return http<ConversationVO[]>({
      url: '/conversation',
      method: 'GET'
    });
  },

  getOrCreateConversation: (targetId: number) => {
    return http<ConversationVO>({
      url: `/conversation/create?targetId=${targetId}`,
      method: 'POST'
    });
  },

  pinConversation: (id: number) => {
    return http<void>({
      url: `/conversation/${id}/pin`,
      method: 'PUT'
    });
  },

  unpinConversation: (id: number) => {
    return http<void>({
      url: `/conversation/${id}/unpin`,
      method: 'PUT'
    });
  },

  muteConversation: (id: number) => {
    return http<void>({
      url: `/conversation/${id}/mute`,
      method: 'PUT'
    });
  },

  unmuteConversation: (id: number) => {
    return http<void>({
      url: `/conversation/${id}/unmute`,
      method: 'PUT'
    });
  },

  deleteConversation: (id: number) => {
    return http<void>({
      url: `/conversation/${id}`,
      method: 'DELETE'
    });
  },

  clearUnreadCount: (id: number) => {
    return http<void>({
      url: `/conversation/${id}/clear-unread`,
      method: 'PUT'
    });
  },

  getMessages: (conversationId: number, page: number = 1, size: number = 20) => {
    return http<PageResult<MessageVO>>({
      url: '/message',
      method: 'GET',
      data: { conversationId, page, size }
    });
  },

  sendMessage: (request: SendMessageRequest) => {
    return http<MessageVO>({
      url: '/message',
      method: 'POST',
      data: request
    });
  },

  markAsRead: (id: number) => {
    return http<void>({
      url: `/message/${id}/read`,
      method: 'PUT'
    });
  },

  markAllAsRead: (conversationId: number) => {
    return http<void>({
      url: '/message/read-all',
      method: 'PUT',
      data: { conversationId }
    });
  }
};

export const MessageTypeMap: Record<string, MessageType> = {
  '文本': 'text',
  '图片': 'image',
  '商品卡片': 'goods_card',
  '订单卡片': 'order_card'
};

export const MessageTypeReverseMap: Record<MessageType, number> = {
  text: 1,
  image: 2,
  goods_card: 3,
  order_card: 4
};

export const MessageStatusMap: Record<string, MessageStatus> = {
  '已发送': 'sent',
  '已送达': 'delivered',
  '已读': 'read'
};

export const MessageStatusReverseMap: Record<MessageStatus, number> = {
  sent: 1,
  delivered: 2,
  read: 3
};
