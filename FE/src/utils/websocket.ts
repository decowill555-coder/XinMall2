import { BASE_URL } from './http';

const WS_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'wss://api.xinmall.com/ws/chat'
  : 'ws://localhost:8080/ws/chat';

export interface WsMessage {
  type: string;
  senderId?: number;
  senderName?: string;
  receiverId?: number;
  conversationId?: number;
  content?: string;
  timestamp?: number;
}

type MessageHandler = (message: WsMessage) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class WebSocketService {
  private ws: UniApp.SocketTask | null = null;
  private url: string = '';
  private reconnectTimer: number | null = null;
  private heartbeatTimer: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private heartbeatInterval: number = 30000;
  private isManualClose: boolean = false;
  private messageQueue: WsMessage[] = [];
  
  private messageHandlers: MessageHandler[] = [];
  private statusHandlers: StatusHandler[] = [];
  
  private _status: 'connecting' | 'connected' | 'disconnected' | 'error' = 'disconnected';
  
  get status() {
    return this._status;
  }
  
  private setStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error') {
    this._status = status;
    this.statusHandlers.forEach(handler => handler(status));
  }

  connect(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws && this._status === 'connected') {
        resolve(true);
        return;
      }
      
      this.isManualClose = false;
      this.url = `${WS_BASE_URL}?token=${token}`;
      this.setStatus('connecting');
      
      try {
        this.ws = uni.connectSocket({
          url: this.url,
          success: () => {
            console.log('[WebSocket] 连接中...');
          },
          fail: (err) => {
            console.error('[WebSocket] 连接失败:', err);
            this.setStatus('error');
            this.scheduleReconnect();
            resolve(false);
          }
        });
        
        this.setupEventListeners(resolve);
      } catch (error) {
        console.error('[WebSocket] 创建连接异常:', error);
        this.setStatus('error');
        resolve(false);
      }
    });
  }

  private setupEventListeners(resolve: (value: boolean) => void) {
    if (!this.ws) return;
    
    this.ws.onOpen(() => {
      console.log('[WebSocket] 连接成功');
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
      resolve(true);
    });
    
    this.ws.onMessage((res) => {
      try {
        const message: WsMessage = JSON.parse(res.data as string);
        console.log('[WebSocket] 收到消息:', message);
        this.handleMessage(message);
      } catch (error) {
        console.error('[WebSocket] 解析消息失败:', error);
      }
    });
    
    this.ws.onClose((res) => {
      console.log('[WebSocket] 连接关闭:', res.code, res.reason);
      this.setStatus('disconnected');
      this.stopHeartbeat();
      
      if (!this.isManualClose) {
        this.scheduleReconnect();
      }
    });
    
    this.ws.onError((err) => {
      console.error('[WebSocket] 连接错误:', err);
      this.setStatus('error');
    });
  }

  private handleMessage(message: WsMessage) {
    if (message.type === 'pong') {
      return;
    }
    
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('[WebSocket] 消息处理器错误:', error);
      }
    });
  }

  send(message: WsMessage): boolean {
    if (this._status !== 'connected' || !this.ws) {
      console.warn('[WebSocket] 未连接，消息已缓存');
      this.messageQueue.push(message);
      return false;
    }
    
    try {
      this.ws.send({
        data: JSON.stringify(message),
        success: () => {
          console.log('[WebSocket] 消息发送成功');
        },
        fail: (err) => {
          console.error('[WebSocket] 消息发送失败:', err);
          this.messageQueue.push(message);
        }
      });
      return true;
    } catch (error) {
      console.error('[WebSocket] 发送异常:', error);
      return false;
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0 && this._status === 'connected') {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this._status === 'connected' && this.ws) {
        this.ws.send({
          data: JSON.stringify({ type: 'ping' }),
          fail: () => {
            console.warn('[WebSocket] 心跳发送失败');
          }
        });
      }
    }, this.heartbeatInterval) as unknown as number;
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.isManualClose) return;
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] 达到最大重连次数');
      return;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`[WebSocket] ${delay / 1000}秒后尝试第${this.reconnectAttempts}次重连`);
    
    this.reconnectTimer = setTimeout(() => {
      const token = uni.getStorageSync('token');
      if (token) {
        this.connect(token);
      }
    }, delay) as unknown as number;
  }

  disconnect() {
    this.isManualClose = true;
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close({
        code: 1000,
        reason: 'User disconnect'
      });
      this.ws = null;
    }
    
    this.setStatus('disconnected');
    this.reconnectAttempts = 0;
    this.messageQueue = [];
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.push(handler);
    return () => {
      const index = this.statusHandlers.indexOf(handler);
      if (index > -1) {
        this.statusHandlers.splice(index, 1);
      }
    };
  }

  isConnected(): boolean {
    return this._status === 'connected';
  }
}

export const wsService = new WebSocketService();

export default wsService;
