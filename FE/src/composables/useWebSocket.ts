import { ref, onMounted, onUnmounted } from 'vue';
import { wsService, type WsMessage } from '@/utils/websocket';
import { useChatStore, useUserStore } from '@/stores';

export type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useWebSocket() {
  const chatStore = useChatStore();
  const userStore = useUserStore();
  
  const status = ref<WsStatus>('disconnected');
  let unsubscribeMessage: (() => void) | null = null;
  let unsubscribeStatus: (() => void) | null = null;

  const connect = async () => {
    const token = uni.getStorageSync('token');
    if (!token) {
      console.warn('[useWebSocket] 未登录，跳过连接');
      return false;
    }
    
    return wsService.connect(token);
  };

  const disconnect = () => {
    wsService.disconnect();
  };

  const handleIncomingMessage = (message: WsMessage) => {
    console.log('[useWebSocket] 处理消息:', message);
    
    switch (message.type) {
      case 'chat':
        handleChatMessage(message);
        break;
      case 'system':
        handleSystemMessage(message);
        break;
      default:
        console.log('[useWebSocket] 未知消息类型:', message.type);
    }
  };

  const handleChatMessage = (message: WsMessage) => {
    if (!message.senderId || !message.content) return;
    
    const currentUserId = userStore.userInfo?.id;
    if (!currentUserId) return;
    
    const senderId = String(message.senderId);
    
    let conversation = chatStore.conversations.find(c => c.targetUserId === senderId);
    
    const conversationId = conversation ? conversation.id : (message.conversationId ? String(message.conversationId) : '');
    
    const chatMessage = {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId: conversationId,
      senderId: senderId,
      senderName: message.senderName || '未知用户',
      senderAvatar: '',
      receiverId: String(currentUserId),
      content: message.content,
      type: 'text' as const,
      status: 'sent' as const,
      createdAt: new Date(message.timestamp || Date.now()).toISOString()
    };
    
    chatStore.handleIncomingMessage(chatMessage);
    
    if (chatStore.currentConversationId !== conversationId) {
      showNotification(message);
    }
  };

  const handleSystemMessage = (message: WsMessage) => {
    console.log('[useWebSocket] 系统消息:', message.content);
    
    if (message.content?.includes('连接成功')) {
      chatStore.setConnected(true);
    }
  };

  const showNotification = (message: WsMessage) => {
    if (message.content) {
      uni.vibrateShort({
        success: () => {},
        fail: () => {}
      });
    }
  };

  const setupListeners = () => {
    unsubscribeMessage = wsService.onMessage(handleIncomingMessage);
    unsubscribeStatus = wsService.onStatusChange((newStatus) => {
      status.value = newStatus;
      chatStore.setConnected(newStatus === 'connected');
      chatStore.setConnecting(newStatus === 'connecting');
    });
  };

  const cleanupListeners = () => {
    if (unsubscribeMessage) {
      unsubscribeMessage();
      unsubscribeMessage = null;
    }
    if (unsubscribeStatus) {
      unsubscribeStatus();
      unsubscribeStatus = null;
    }
  };

  onMounted(() => {
    setupListeners();
    status.value = wsService.status;
  });

  onUnmounted(() => {
    cleanupListeners();
  });

  return {
    status,
    connect,
    disconnect,
    isConnected: () => wsService.isConnected()
  };
}

export function useWebSocketAutoConnect() {
  const { status, connect, disconnect } = useWebSocket();
  
  const autoConnect = async () => {
    const token = uni.getStorageSync('token');
    if (token) {
      await connect();
    }
  };

  const autoDisconnect = () => {
    disconnect();
  };

  return {
    status,
    autoConnect,
    autoDisconnect
  };
}
