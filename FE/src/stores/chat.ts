import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { messageApi, MessageTypeMap, MessageTypeReverseMap, MessageStatusMap, type ConversationVO, type MessageVO, type SendMessageRequest, type MessageType, type MessageStatus } from '@/api/message';
import { logError } from '@/utils/logger';

export type { MessageType, MessageStatus } from '@/api/message';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
  readAt?: string;
  extra?: {
    productId?: string;
    productName?: string;
    productCover?: string;
    productPrice?: number;
    orderId?: string;
    orderStatus?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
  };
}

export interface Conversation {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  lastMessage: string;
  lastMessageType: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const transformConversation = (vo: ConversationVO): Conversation => ({
  id: String(vo.id),
  targetUserId: String(vo.targetId),
  targetUserName: vo.targetName,
  targetUserAvatar: vo.targetAvatar,
  lastMessage: vo.lastMessage,
  lastMessageType: vo.lastMessageType,
  lastMessageTime: vo.lastMessageTime,
  unreadCount: vo.unreadCount,
  isOnline: false,
  isMuted: vo.isMuted,
  isPinned: vo.isPinned,
  createdAt: vo.lastMessageTime,
  updatedAt: vo.lastMessageTime
});

const transformMessage = (vo: MessageVO): ChatMessage => {
  const baseMessage = {
    id: String(vo.id),
    conversationId: String(vo.conversationId),
    senderId: String(vo.senderId),
    senderName: vo.senderName,
    senderAvatar: vo.senderAvatar,
    receiverId: String(vo.receiverId),
    content: vo.content,
    type: MessageTypeMap[vo.type] || 'text',
    status: MessageStatusMap[vo.status] || 'sent',
    createdAt: vo.createdAt
  };

  if (vo.type === '图片') {
    return {
      ...baseMessage,
      extra: {
        imageUrl: vo.content
      }
    };
  }

  if (vo.type === '商品卡片' || vo.type === '订单卡片') {
    try {
      const extraData = JSON.parse(vo.content);
      return {
        ...baseMessage,
        extra: extraData
      };
    } catch {
      return baseMessage;
    }
  }

  return baseMessage;
};

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([]);
  const currentConversationId = ref<string>('');
  const messages = ref<Record<string, ChatMessage[]>>({});
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const isLoadingConversations = ref(false);
  const isLoadingMessages = ref<Record<string, boolean>>({});
  const messagePages = ref<Record<string, { current: number; pages: number; hasMore: boolean }>>({});

  const currentConversation = computed(() => 
    conversations.value.find(c => c.id === currentConversationId.value) || null
  );

  const currentMessages = computed(() => 
    messages.value[currentConversationId.value] || []
  );

  const totalUnreadCount = computed(() => 
    conversations.value.reduce((sum, c) => sum + c.unreadCount, 0)
  );

  const sortedConversations = computed(() => 
    [...conversations.value].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    })
  );

  const pinnedConversations = computed(() => 
    conversations.value.filter(c => c.isPinned)
  );

  const fetchConversations = async () => {
    if (isLoadingConversations.value) return;
    
    isLoadingConversations.value = true;
    try {
      const result = await messageApi.getConversationList();
      if (result) {
        conversations.value = result.map(transformConversation);
      }
    } catch (error) {
      logError('获取会话列表失败:', error);
      throw error;
    } finally {
      isLoadingConversations.value = false;
    }
  };

  const fetchMessages = async (conversationId: string, page: number = 1, size: number = 20) => {
    if (isLoadingMessages.value[conversationId]) return;
    
    isLoadingMessages.value[conversationId] = true;
    try {
      const result = await messageApi.getMessages(Number(conversationId), page, size);
      if (result) {
        const transformedMessages = (result.list || result.records || []).map(transformMessage);

        if (page === 1) {
          messages.value[conversationId] = transformedMessages.reverse();
        } else {
          messages.value[conversationId] = [...transformedMessages.reverse(), ...(messages.value[conversationId] || [])];
        }

        messagePages.value[conversationId] = {
          current: result.current || page,
          pages: result.pages || Math.ceil(result.total / size),
          hasMore: result.hasMore ?? (result.current !== undefined && result.pages !== undefined && result.current < result.pages)
        };
      }
    } catch (error) {
      logError('获取消息列表失败:', error);
      throw error;
    } finally {
      isLoadingMessages.value[conversationId] = false;
    }
  };

  const loadMoreMessages = async (conversationId: string, size: number = 20) => {
    const pageInfo = messagePages.value[conversationId];
    if (!pageInfo || !pageInfo.hasMore || isLoadingMessages.value[conversationId]) {
      return false;
    }
    
    await fetchMessages(conversationId, pageInfo.current + 1, size);
    return true;
  };

  const sendMessageToAPI = async (request: SendMessageRequest) => {
    const result = await messageApi.sendMessage(request);
    if (result) {
      return transformMessage(result);
    }
    return null;
  };

  const setConversations = (list: Conversation[]) => {
    conversations.value = list;
  };

  const addConversation = (conversation: Conversation) => {
    const existing = conversations.value.find(c => c.id === conversation.id);
    if (!existing) {
      conversations.value.unshift(conversation);
      messages.value[conversation.id] = [];
    }
  };

  const removeConversation = (conversationId: string) => {
    conversations.value = conversations.value.filter(c => c.id !== conversationId);
    delete messages.value[conversationId];
    delete messagePages.value[conversationId];
    if (currentConversationId.value === conversationId) {
      currentConversationId.value = '';
    }
  };

  const setCurrentConversation = (conversationId: string) => {
    currentConversationId.value = conversationId;
    markAsRead(conversationId);
  };

  const setMessages = (conversationId: string, list: ChatMessage[]) => {
    messages.value[conversationId] = list;
  };

  const addMessage = (message: ChatMessage) => {
    if (!messages.value[message.conversationId]) {
      messages.value[message.conversationId] = [];
    }
    messages.value[message.conversationId].push(message);
    
    updateConversationLastMessage(message.conversationId, message.content, message.createdAt);
  };

  const updateMessageStatus = (conversationId: string, messageId: string, status: MessageStatus) => {
    const msgs = messages.value[conversationId];
    if (msgs) {
      const msg = msgs.find(m => m.id === messageId);
      if (msg) {
        msg.status = status;
      }
    }
  };

  const updateConversationLastMessage = (conversationId: string, content: string, time: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = content;
      conversation.lastMessageTime = time;
      conversation.updatedAt = time;
    }
  };

  const markAsRead = async (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
    
    const msgs = messages.value[conversationId];
    if (msgs) {
      msgs.forEach(m => {
        if (m.status !== 'read') {
          m.status = 'read';
          m.readAt = new Date().toISOString();
        }
      });
    }

    try {
      await messageApi.clearUnreadCount(Number(conversationId));
    } catch (error) {
      logError('清空未读数失败:', error);
    }
  };

  const incrementUnread = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation && !conversation.isMuted) {
      conversation.unreadCount += 1;
    }
  };

  const togglePin = async (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      try {
        if (conversation.isPinned) {
          await messageApi.unpinConversation(Number(conversationId));
        } else {
          await messageApi.pinConversation(Number(conversationId));
        }
        conversation.isPinned = !conversation.isPinned;
      } catch (error) {
        logError('置顶操作失败:', error);
        throw error;
      }
    }
  };

  const toggleMute = async (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      try {
        if (conversation.isMuted) {
          await messageApi.unmuteConversation(Number(conversationId));
        } else {
          await messageApi.muteConversation(Number(conversationId));
        }
        conversation.isMuted = !conversation.isMuted;
      } catch (error) {
        logError('免打扰操作失败:', error);
        throw error;
      }
    }
  };

  const deleteConversationAPI = async (conversationId: string) => {
    try {
      await messageApi.deleteConversation(Number(conversationId));
      removeConversation(conversationId);
    } catch (error) {
      logError('删除会话失败:', error);
      throw error;
    }
  };

  const setOnlineStatus = (userId: string, isOnline: boolean) => {
    const conversation = conversations.value.find(c => c.targetUserId === userId);
    if (conversation) {
      conversation.isOnline = isOnline;
    }
  };

  const setConnected = (connected: boolean) => {
    isConnected.value = connected;
    isConnecting.value = false;
  };

  const setConnecting = (connecting: boolean) => {
    isConnecting.value = connecting;
  };

  const clearAllMessages = (conversationId: string) => {
    messages.value[conversationId] = [];
  };

  const clearAllConversations = () => {
    conversations.value = [];
    messages.value = {};
    messagePages.value = {};
    currentConversationId.value = '';
  };

  const hasMoreMessages = (conversationId: string) => {
    const pageInfo = messagePages.value[conversationId];
    return pageInfo ? pageInfo.hasMore : false;
  };

  const handleIncomingMessage = (message: ChatMessage) => {
    const senderId = message.senderId;
    
    let conversation = conversations.value.find(c => c.targetUserId === senderId);
    
    if (!conversation && message.conversationId) {
      conversation = conversations.value.find(c => c.id === message.conversationId);
    }
    
    if (!conversation) {
      conversation = {
        id: message.conversationId || `temp-${Date.now()}`,
        targetUserId: senderId,
        targetUserName: message.senderName || '未知用户',
        targetUserAvatar: message.senderAvatar || '',
        lastMessage: message.content,
        lastMessageType: '文本',
        lastMessageTime: message.createdAt,
        unreadCount: 0,
        isOnline: false,
        isMuted: false,
        isPinned: false,
        createdAt: message.createdAt,
        updatedAt: message.createdAt
      };
      conversations.value.unshift(conversation);
    }
    
    const actualConversationId = conversation.id;
    
    if (!messages.value[actualConversationId]) {
      messages.value[actualConversationId] = [];
    }
    
    const existingMsg = messages.value[actualConversationId].find(m => m.id === message.id);
    if (!existingMsg) {
      messages.value[actualConversationId].push({
        ...message,
        conversationId: actualConversationId
      });
    }
    
    conversation.lastMessage = message.content;
    conversation.lastMessageTime = message.createdAt;
    conversation.updatedAt = message.createdAt;
    
    if (currentConversationId.value !== actualConversationId) {
      if (!conversation.isMuted) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    }
  };

  const upsertConversationFromMessage = (message: ChatMessage, targetUserInfo?: { name: string; avatar: string }) => {
    const senderId = message.senderId;
    let conversation = conversations.value.find(c => c.targetUserId === senderId);
    
    if (!conversation) {
      conversation = {
        id: message.conversationId || `temp-${Date.now()}`,
        targetUserId: senderId,
        targetUserName: targetUserInfo?.name || message.senderName || '未知用户',
        targetUserAvatar: targetUserInfo?.avatar || message.senderAvatar || '',
        lastMessage: message.content,
        lastMessageType: '文本',
        lastMessageTime: message.createdAt,
        unreadCount: 1,
        isOnline: false,
        isMuted: false,
        isPinned: false,
        createdAt: message.createdAt,
        updatedAt: message.createdAt
      };
      conversations.value.unshift(conversation);
    } else {
      conversation.lastMessage = message.content;
      conversation.lastMessageTime = message.createdAt;
      conversation.updatedAt = message.createdAt;
      
      if (currentConversationId.value !== conversation.id && !conversation.isMuted) {
        conversation.unreadCount += 1;
      }
    }
    
    return conversation;
  };

  return {
    conversations,
    currentConversationId,
    messages,
    isConnected,
    isConnecting,
    isLoadingConversations,
    isLoadingMessages,
    messagePages,
    currentConversation,
    currentMessages,
    totalUnreadCount,
    sortedConversations,
    pinnedConversations,
    fetchConversations,
    fetchMessages,
    loadMoreMessages,
    sendMessageToAPI,
    setConversations,
    addConversation,
    removeConversation,
    setCurrentConversation,
    setMessages,
    addMessage,
    updateMessageStatus,
    updateConversationLastMessage,
    markAsRead,
    incrementUnread,
    togglePin,
    toggleMute,
    deleteConversationAPI,
    setOnlineStatus,
    setConnected,
    setConnecting,
    clearAllMessages,
    clearAllConversations,
    hasMoreMessages,
    handleIncomingMessage,
    upsertConversationFromMessage
  };
});
