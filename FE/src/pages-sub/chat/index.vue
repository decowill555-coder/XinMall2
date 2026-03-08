<template>
  <view class="chat-page">
    <view class="bg-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
    </view>
    
    <view class="chat-header" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="header-content">
        <view class="header-left" @click="goBack">
          <ui-icon name="arrow-left" :size="44" />
        </view>
        <view class="header-center" @click="showUserInfo">
          <ui-avatar :src="targetUser.avatar" :size="64" />
          <view class="user-info">
            <text class="user-name">{{ targetUser.name }}</text>
            <view class="user-status">
              <view :class="['status-dot', { 'online': targetUser.isOnline }]"></view>
              <text class="status-text">{{ targetUser.isOnline ? '在线' : '离线' }}</text>
            </view>
          </view>
        </view>
        <view class="header-right" @click="showMoreActions">
          <ui-icon name="more" :size="44" />
        </view>
      </view>
    </view>
    
    <view class="message-list-wrapper">
      <scroll-view 
        scroll-y 
        class="message-list" 
        :scroll-top="scrollTop"
        :scroll-into-view="scrollIntoView"
        :scroll-with-animation="scrollWithAnimation"
        @scrolltoupper="loadMoreMessages"
      >
      <view class="message-container">
        <view 
          v-for="(msg, index) in messages" 
          :key="msg.id" 
          :id="'msg-' + msg.id"
          class="message-item"
          :class="{ 'is-self': msg.isSelf }"
        >
          <view v-if="shouldShowTime(index)" class="message-time">
            <text class="time-text">{{ formatMessageTime(msg.createdAt) }}</text>
          </view>
          
          <view class="message-bubble-wrapper">
            <view v-if="!msg.isSelf" class="avatar-wrapper">
              <ui-avatar :src="targetUser.avatar" :size="64" @click="showUserInfo" />
            </view>
            
            <view v-if="msg.isSelf" class="message-status">
              <ui-icon 
                v-if="msg.status === 'failed'" 
                name="error" 
                :size="28" 
                class="error-icon"
                @click="resendMessage(msg)"
              />
              <view v-else-if="msg.status === 'sending'" class="sending-indicator">
                <view class="sending-dot"></view>
              </view>
            </view>
            
            <view class="message-bubble" :class="{ 'self-bubble': msg.isSelf }">
              <view v-if="msg.type === 'text'" class="text-message">
                <text :class="msg.isSelf ? 'self-text' : 'other-text'">{{ msg.content }}</text>
              </view>
              
              <view v-else-if="msg.type === 'image'" class="image-message" @click="previewImage(msg.content)">
                <image 
                  :src="msg.content" 
                  mode="widthFix" 
                  class="message-image"
                  @load="onImageLoad(index)"
                />
              </view>
              
              <view v-else-if="msg.type === 'product'" class="product-message" @click="goProductDetail(msg.extra)">
                <image :src="msg.extra?.productCover" class="product-cover" mode="aspectFill" />
                <view class="product-info">
                  <text class="product-name">{{ msg.extra?.productName }}</text>
                  <text class="product-price">¥{{ msg.extra?.productPrice }}</text>
                </view>
              </view>
              
              <view v-else-if="msg.type === 'order'" class="order-message" @click="goOrderDetail(msg.extra)">
                <view class="order-header">
                  <ui-icon name="package" :size="32" class="order-icon" />
                  <text class="order-title">订单信息</text>
                </view>
                <view class="order-status">
                  <text class="order-status-text">{{ msg.extra?.orderStatus }}</text>
                </view>
              </view>
            </view>
            
            <view v-if="msg.isSelf" class="avatar-wrapper">
              <ui-avatar :src="currentUser.avatar" :size="64" />
            </view>
          </view>
        </view>
        
        <view v-if="isLoading" class="loading-more">
          <text class="loading-text">加载中...</text>
        </view>
      </view>
    </scroll-view>
    </view>
    
    <view class="input-area" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="input-wrapper">
        <view class="action-btn" @click="showEmojiPanel = !showEmojiPanel">
          <ui-icon name="heart" :size="40" />
        </view>
        
        <view class="input-box" :class="{ 'is-focused': isInputFocused }">
          <input 
            v-model="inputText"
            class="chat-input"
            type="text"
            placeholder="输入消息..."
            :adjust-position="true"
            :confirm-type="'send'"
            @confirm="sendMessage"
            @focus="onInputFocus"
            @blur="onInputBlur"
          />
        </view>
        
        <view class="action-btn" @click="showMorePanel = !showMorePanel">
          <ui-icon name="plus" :size="40" />
        </view>
        
        <ui-button 
          v-if="inputText.trim()" 
          label="发送" 
          size="sm" 
          @click="sendMessage" 
        />
      </view>
      
      <view v-if="showMorePanel" class="more-panel">
        <view class="panel-grid">
          <view class="panel-item" @click="chooseImage">
            <view class="panel-icon">
              <ui-icon name="image" :size="44" />
            </view>
            <text class="panel-text">图片</text>
          </view>
          <view class="panel-item" @click="chooseCamera">
            <view class="panel-icon">
              <ui-icon name="camera" :size="44" />
            </view>
            <text class="panel-text">拍照</text>
          </view>
          <view class="panel-item" @click="shareProduct">
            <view class="panel-icon">
              <ui-icon name="goods" :size="44" />
            </view>
            <text class="panel-text">商品</text>
          </view>
          <view class="panel-item" @click="shareOrder">
            <view class="panel-icon">
              <ui-icon name="package" :size="44" />
            </view>
            <text class="panel-text">订单</text>
          </view>
        </view>
      </view>
    </view>
    
    <ui-action-sheet 
      :show="showActions" 
      :actions="actionList"
      @update:show="showActions = $event"
      @select="onActionSelect" 
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useChatStore, useUserStore, type ChatMessage } from '@/stores';

const chatStore = useChatStore();
const userStore = useUserStore();

const conversationId = ref('');
const scrollTop = ref(999999);
const scrollIntoView = ref('');
const scrollWithAnimation = ref(false);
const inputText = ref('');
const showMorePanel = ref(false);
const showEmojiPanel = ref(false);
const showActions = ref(false);
const isLoading = ref(false);
const isInputFocused = ref(false);

const targetUser = ref({
  id: '',
  name: '',
  avatar: '',
  isOnline: false
});

const currentUser = computed(() => ({
  id: userStore.userInfo?.id || 'current-user',
  name: userStore.userInfo?.nickname || '我',
  avatar: userStore.userInfo?.avatar || 'https://picsum.photos/100/100?random=me'
}));

const messages = computed(() => {
  const msgs = chatStore.currentMessages;
  return msgs.map(msg => ({
    ...msg,
    isSelf: msg.senderId === currentUser.value.id
  }));
});

const safeAreaTop = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.safeAreaInsets?.top || 44;
});

const safeAreaBottom = computed(() => {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.safeAreaInsets?.bottom || 0;
});

const actionList = ref([
  { name: '查看资料', value: 'profile' },
  { name: '清空聊天记录', value: 'clear' },
  { name: '举报', value: 'report' }
]);

onLoad((options: any) => {
  if (options.id) {
    conversationId.value = options.id;
    chatStore.setCurrentConversation(options.id);
    loadConversationInfo();
    loadMessages();
  }
});

const loadConversationInfo = () => {
  const conversation = chatStore.currentConversation;
  if (conversation) {
    targetUser.value = {
      id: conversation.targetUserId,
      name: conversation.targetUserName,
      avatar: conversation.targetUserAvatar,
      isOnline: conversation.isOnline
    };
  }
};

const loadMessages = () => {
  if (chatStore.currentMessages.length === 0) {
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '您好，请问这个商品还在吗？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '在的，您想要吗？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 118 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-3',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '请问可以便宜点吗？原价有点贵',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 115 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-4',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '这款已经很优惠了，包邮可以吗？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-5',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '好的，包邮的话我可以接受',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 105 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-6',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '太好了！那您什么时候方便付款呢？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 100 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-7',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '我现在就可以付款，请问发货地址在哪里修改？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 95 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-8',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '您下单后可以在订单详情里修改收货地址',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-9',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '',
        type: 'product',
        status: 'read',
        createdAt: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
        extra: {
          productId: 'prod-1',
          productName: 'iPhone 15 Pro Max 256GB 原色钛金属 全新未拆封',
          productCover: 'https://picsum.photos/200/200?random=iphone',
          productPrice: 8999
        }
      },
      {
        id: 'msg-10',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '是这个商品对吧？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-11',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '对的，就是这个！全新未拆封的',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-12',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '好的，我已经下单了，麻烦尽快发货哦',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 70 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-13',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '收到！我明天一早就给您发货',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-14',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '好的，谢谢！请问发什么快递呢？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-15',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '顺丰快递，速度比较快，一般2-3天就能到',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-16',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '太好了！顺丰很靠谱',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-17',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '是的，有任何问题随时联系我',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-18',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '对了，请问有发票吗？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-19',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '有的，电子发票会随订单一起发送到您的邮箱',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-20',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '完美！那我就放心了',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-21',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '好的，明天发货',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-22',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '好的，期待收到商品！',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-23',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '一定会让您满意的！',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-24',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '对了，请问这个手机有保修吗？',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-25',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '有的，官方保修一年，从激活日期开始计算',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-26',
        conversationId: conversationId.value,
        senderId: targetUser.value.id,
        senderName: targetUser.value.name,
        senderAvatar: targetUser.value.avatar,
        content: '太好了，非常感谢您的耐心解答！',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-27',
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: '不客气，祝您使用愉快！有问题随时联系',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString()
      }
    ];
    chatStore.setMessages(conversationId.value, mockMessages);
  }
  
  nextTick(() => {
    scrollTop.value = 999999;
  });
};

const loadMoreMessages = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

const shouldShowTime = (index: number) => {
  if (index === 0) return true;
  const currentMsg = messages.value[index];
  const prevMsg = messages.value[index - 1];
  const diff = new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
  return diff > 5 * 60 * 1000;
};

const formatMessageTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + 
    ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = (withAnimation: boolean = false) => {
  scrollWithAnimation.value = withAnimation;
  nextTick(() => {
    setTimeout(() => {
      if (messages.value.length > 0) {
        const lastMsg = messages.value[messages.value.length - 1];
        scrollIntoView.value = '';
        nextTick(() => {
          scrollIntoView.value = 'msg-' + lastMsg.id;
        });
      }
    }, 50);
  });
};

const sendMessage = () => {
  const content = inputText.value.trim();
  if (!content) return;
  
  const message: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId: conversationId.value,
    senderId: currentUser.value.id,
    senderName: currentUser.value.name,
    senderAvatar: currentUser.value.avatar,
    content,
    type: 'text',
    status: 'sending',
    createdAt: new Date().toISOString()
  };
  
  chatStore.addMessage(message);
  inputText.value = '';
  
  scrollToBottom(true);
  
  setTimeout(() => {
    chatStore.updateMessageStatus(conversationId.value, message.id, 'sent');
    setTimeout(() => {
      chatStore.updateMessageStatus(conversationId.value, message.id, 'delivered');
    }, 500);
  }, 300);
};

const resendMessage = (msg: ChatMessage) => {
  chatStore.updateMessageStatus(conversationId.value, msg.id, 'sending');
  setTimeout(() => {
    chatStore.updateMessageStatus(conversationId.value, msg.id, 'sent');
  }, 500);
};

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: res.tempFilePaths[0],
        type: 'image',
        status: 'sending',
        createdAt: new Date().toISOString()
      };
      chatStore.addMessage(message);
      showMorePanel.value = false;
      scrollToBottom(true);
    }
  });
};

const chooseCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    success: (res) => {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: conversationId.value,
        senderId: currentUser.value.id,
        senderName: currentUser.value.name,
        senderAvatar: currentUser.value.avatar,
        content: res.tempFilePaths[0],
        type: 'image',
        status: 'sending',
        createdAt: new Date().toISOString()
      };
      chatStore.addMessage(message);
      showMorePanel.value = false;
      scrollToBottom();
    }
  });
};

const shareProduct = () => {
  uni.navigateTo({
    url: '/pages-sub/trade/product/list?selectMode=true',
    events: {
      onSelectProduct: (product: any) => {
        const message: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId: conversationId.value,
          senderId: currentUser.value.id,
          senderName: currentUser.value.name,
          senderAvatar: currentUser.value.avatar,
          content: '',
          type: 'product',
          status: 'sent',
          createdAt: new Date().toISOString(),
          extra: {
            productId: product.id,
            productName: product.name,
            productCover: product.cover,
            productPrice: product.price
          }
        };
        chatStore.addMessage(message);
        showMorePanel.value = false;
        scrollToBottom();
      }
    }
  });
};

const shareOrder = () => {
  uni.showToast({ title: '选择订单功能开发中', icon: 'none' });
};

const previewImage = (url: string) => {
  uni.previewImage({
    urls: [url],
    current: url
  });
};

const goProductDetail = (extra: any) => {
  if (extra?.productId) {
    uni.navigateTo({
      url: `/pages-sub/trade/product/detail?id=${extra.productId}`
    });
  }
};

const goOrderDetail = (extra: any) => {
  if (extra?.orderId) {
    uni.navigateTo({
      url: `/pages-sub/trade/order/detail?id=${extra.orderId}`
    });
  }
};

const onImageLoad = (index: number) => {
  scrollToBottom();
};

const onInputFocus = () => {
  showMorePanel.value = false;
  showEmojiPanel.value = false;
  isInputFocused.value = true;
  scrollToBottom();
};

const onInputBlur = () => {
  isInputFocused.value = false;
};

const goBack = () => {
  uni.navigateBack();
};

const showUserInfo = () => {
  uni.navigateTo({
    url: `/pages-sub/content/user/index?id=${targetUser.value.id}`
  });
};

const showMoreActions = () => {
  showActions.value = true;
};

const onActionSelect = (item: any) => {
  showActions.value = false;
  
  switch (item.value) {
    case 'profile':
      showUserInfo();
      break;
    case 'clear':
      uni.showModal({
        title: '确认清空',
        content: '确定要清空与该用户的聊天记录吗？',
        success: (res) => {
          if (res.confirm) {
            chatStore.clearAllMessages(conversationId.value);
            uni.showToast({ title: '已清空', icon: 'success' });
          }
        }
      });
      break;
    case 'report':
      uni.showToast({ title: '举报功能开发中', icon: 'none' });
      break;
  }
};

watch(showMorePanel, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style lang="scss" scoped>
.chat-page {
  @include page-gradient-bg;
  display: flex;
  flex-direction: column;
}

.bg-decoration {
  @include decoration-container;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
  }
  
  .circle-1 {
    width: 400rpx;
    height: 400rpx;
    top: 200rpx;
    right: -100rpx;
    background: $decoration-circle-1;
  }
  
  .circle-2 {
    width: 300rpx;
    height: 300rpx;
    bottom: 300rpx;
    left: -80rpx;
    background: $decoration-circle-2;
  }
}

.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-card;
  border-bottom: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 $space-md;
}

.header-left,
.header-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  @include text-main;
  
  &:active {
    background: var(--color-active-bg, $color-bg-gray);
  }
}

.header-center {
  display: flex;
  align-items: center;
  gap: $space-sm;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  @include text-main;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 4rpx;
}

.status-dot {
  @include offline-dot;
  
  &.online {
    @include online-dot;
  }
}

.status-text {
  font-size: $font-size-xs;
  @include text-sub;
}

.message-list-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.message-list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 $space-lg;
  box-sizing: border-box;
  z-index: 1;
}

.message-container {
  padding-top: calc(112rpx + env(safe-area-inset-top));
  padding-bottom: 200rpx;
}

.message-item {
  margin-bottom: $space-lg;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  &.is-self {
    align-items: flex-end;
  }
}

.message-time {
  text-align: center;
  margin-bottom: $space-lg;
  width: 100%;
  display: flex;
  justify-content: center;
}

.time-text {
  @include message-time-tag;
}

.message-bubble-wrapper {
  display: flex;
  align-items: flex-end;
  gap: $space-sm;
  max-width: 85%;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.message-status {
  display: flex;
  align-items: center;
  padding: 0 $space-xs;
  flex-shrink: 0;
  
  .error-icon {
    color: $color-error;
  }
}

.message-bubble {
  max-width: 100%;
  padding: $space-md $space-lg;
  
  &:not(.self-bubble) {
    @include bubble-other;
  }
  
  &.self-bubble {
    @include bubble-self;
  }
}

.text-message {
  word-break: break-all;
  line-height: 1.6;
}

.self-text {
  font-size: $font-size-md;
  color: $color-text-white;
  font-weight: $font-weight-medium;
}

.other-text {
  font-size: $font-size-md;
  @include text-main;
}

.image-message {
  .message-image {
    max-width: 420rpx;
    border-radius: $radius-md;
  }
}

.product-message {
  display: flex;
  gap: $space-md;
  min-width: 420rpx;
  padding: $space-sm;
}

.product-cover {
  width: 140rpx;
  height: 140rpx;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: $space-xs 0;
}

.product-name {
  font-size: $font-size-sm;
  @include text-main;
  line-height: 1.4;
  font-weight: $font-weight-medium;
  @include text-ellipsis(2);
}

.product-price {
  font-size: $font-size-lg;
  color: $color-price;
  font-weight: $font-weight-bold;
  
  [data-theme="dark"] & {
    color: $color-price;
  }
}

.order-message {
  min-width: 300rpx;
}

.order-header {
  display: flex;
  align-items: center;
  gap: $space-sm;
  margin-bottom: $space-sm;
  
  .order-icon {
    color: $color-primary;
  }
}

.order-title {
  font-size: $font-size-sm;
  @include text-main;
  font-weight: $font-weight-medium;
}

.order-status {
  padding-top: $space-sm;
  border-top: 1px solid $color-divider;
  
  [data-theme="dark"] & {
    border-top-color: var(--color-divider, rgba(255, 255, 255, 0.08));
  }
}

.order-status-text {
  font-size: $font-size-xs;
  @include text-sub;
}

.sending-indicator {
  .sending-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: $color-text-placeholder;
    animation: pulse 1s infinite;
    
    [data-theme="dark"] & {
      background: $color-text-placeholder;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.loading-more {
  text-align: center;
  padding: $space-lg 0;
}

.loading-text {
  font-size: $font-size-xs;
  @include text-sub;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: $color-bg-card;
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-top: 1px solid $color-border;
  
  [data-theme="dark"] & {
    background: var(--glass-card-bg, rgba(255, 255, 255, 0.06));
    border-top: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  }
}

.input-wrapper {
  display: flex;
  align-items: center;
  padding: $space-md $space-lg;
  gap: $space-md;
}

.action-btn {
  @include action-button;
}

.input-box {
  @include chat-input-box;
  
  &.is-focused {
    @include chat-input-focused;
  }
}

.chat-input {
  width: 100%;
  height: 80rpx;
  font-size: $font-size-md;
  @include text-main;
  background: transparent;
  
  &::placeholder {
    @include text-placeholder;
  }
}

.more-panel {
  @include more-panel-bg;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-lg;
}

.panel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-sm;
  
  &:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.panel-icon {
  @include panel-icon;
}

.panel-text {
  font-size: $font-size-xs;
  @include text-sub;
  font-weight: $font-weight-medium;
}
</style>
