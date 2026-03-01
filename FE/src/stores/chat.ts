import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type MessageType = 'text' | 'image' | 'product' | 'order' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
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
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([]);
  const currentConversationId = ref<string>('');
  const messages = ref<Record<string, ChatMessage[]>>({});
  const isConnected = ref(false);
  const isConnecting = ref(false);

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

  const markAsRead = (conversationId: string) => {
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
  };

  const incrementUnread = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation && !conversation.isMuted) {
      conversation.unreadCount += 1;
    }
  };

  const togglePin = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      conversation.isPinned = !conversation.isPinned;
    }
  };

  const toggleMute = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      conversation.isMuted = !conversation.isMuted;
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
    currentConversationId.value = '';
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('chat_conversations');
    if (stored) {
      conversations.value = stored;
    }
    
    const storedMessages = uni.getStorageSync('chat_messages');
    if (storedMessages) {
      messages.value = storedMessages;
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('chat_conversations', conversations.value);
    uni.setStorageSync('chat_messages', messages.value);
  };

  loadFromStorage();

  return {
    conversations,
    currentConversationId,
    messages,
    isConnected,
    isConnecting,
    currentConversation,
    currentMessages,
    totalUnreadCount,
    sortedConversations,
    pinnedConversations,
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
    setOnlineStatus,
    setConnected,
    setConnecting,
    clearAllMessages,
    clearAllConversations,
    loadFromStorage,
    saveToStorage
  };
});
