<template>
  <view class="message-page">
    <view class="page-header" :style="{ paddingTop: (safeAreaTop + headerExtraTop) + 'px' }">
      <ui-card :glass="true" :shadow="true" radius="lg" padding="lg" class="header-card">
        <ui-text size="xl" weight="bold" color="main">消息</ui-text>
      </ui-card>
      
      <view class="message-tabs">
        <ui-tabs v-model="activeTab" :list="tabList" type="line" />
      </view>
    </view>
    
    <view class="page-content" :style="{ paddingTop: headerHeight + 'px' }">
      <scroll-view scroll-y class="message-list" :style="{ height: scrollHeight + 'px' }">
        <view v-if="activeTab === 0" class="message-group">
          <ui-card :glass="true" :shadow="false" radius="lg" padding="none" class="group-card">
            <view class="group-title">
              <ui-text size="sm" color="sub">交易消息</ui-text>
            </view>
            <view 
              v-for="item in tradeMessages" 
              :key="item.id" 
              class="message-item"
              @click="goChat(item)"
            >
              <view class="item-left">
                <ui-avatar :src="item.avatar" :size="88" />
                <ui-badge v-if="item.unread > 0" :value="item.unread" is-dot />
              </view>
              <view class="item-content">
                <view class="item-header">
                  <ui-text size="md" weight="medium" color="main">{{ item.title }}</ui-text>
                  <ui-text size="xs" color="placeholder">{{ item.time }}</ui-text>
                </view>
                <view class="item-desc">
                  <ui-text size="sm" color="sub" class="item-message">{{ item.lastMessage }}</ui-text>
                  <ui-badge v-if="item.unread > 0" :value="item.unread" />
                </view>
              </view>
            </view>
          </ui-card>
        </view>
        
        <view v-if="activeTab === 1" class="message-group">
          <ui-card :glass="true" :shadow="false" radius="lg" padding="none" class="group-card">
            <view class="group-title">
              <ui-text size="sm" color="sub">系统通知</ui-text>
            </view>
            <view 
              v-for="item in systemMessages" 
              :key="item.id" 
              class="message-item system-item"
              @click="handleSystemMessage(item)"
            >
              <view class="system-icon">
                <ui-icon :name="item.icon" :size="40" :color="item.iconColor" />
              </view>
              <view class="item-content">
                <view class="item-header">
                  <ui-text size="md" weight="medium" color="main">{{ item.title }}</ui-text>
                  <ui-text size="xs" color="placeholder">{{ item.time }}</ui-text>
                </view>
                <ui-text size="sm" color="sub" class="item-message">{{ item.content }}</ui-text>
              </view>
            </view>
          </ui-card>
        </view>
        
        <view v-if="activeTab === 2" class="message-group">
          <ui-card :glass="true" :shadow="false" radius="lg" padding="none" class="group-card">
            <view class="group-title">
              <ui-text size="sm" color="sub">互动消息</ui-text>
            </view>
            <view 
              v-for="item in interactMessages" 
              :key="item.id" 
              class="message-item"
              @click="handleInteract(item)"
            >
              <view class="item-left">
                <ui-avatar :src="item.avatar" :size="88" />
              </view>
              <view class="item-content">
                <view class="item-header">
                  <ui-text size="md" weight="medium" color="main">{{ item.userName }}</ui-text>
                  <ui-text size="xs" color="placeholder">{{ item.time }}</ui-text>
                </view>
                <ui-text size="sm" color="sub" class="item-message">{{ item.content }}</ui-text>
              </view>
            </view>
          </ui-card>
        </view>
        
        <view class="empty-state" v-if="isEmpty">
          <ui-icon name="message" :size="80" color="#A1A1A6" />
          <ui-text size="md" color="placeholder" class="empty-text">暂无消息</ui-text>
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar current="message" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useChatStore } from '@/stores';
import { formatTimeAgo } from '@/utils/date';

const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
  hasTabbar: true,
  headerSelector: '.page-header',
  headerEstimatedHeight: 180
});

const chatStore = useChatStore();

const activeTab = ref(0);

const tabList = ref([
  { name: '交易' },
  { name: '通知' },
  { name: '互动' }
]);

const tradeMessages = computed(() => 
  chatStore.sortedConversations.map(c => ({
    id: c.id,
    avatar: c.targetUserAvatar,
    title: `卖家：${c.targetUserName}`,
    lastMessage: c.lastMessage,
    time: formatTimeAgo(c.lastMessageTime),
    unread: c.unreadCount
  }))
);

const systemMessages = ref([
  {
    id: 1,
    icon: 'check-circle',
    iconColor: '#00C853',
    title: '订单发货通知',
    content: '您购买的 iPhone 15 Pro Max 已发货，预计3天内送达',
    time: formatTimeAgo(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    icon: 'info-circle',
    iconColor: '#00B8D4',
    title: '实名认证成功',
    content: '恭喜您完成实名认证，现在可以发布商品了',
    time: formatTimeAgo(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    icon: 'close-circle',
    iconColor: '#FF3D00',
    title: '商品审核未通过',
    content: '您发布的商品"测试商品"因信息不完整被驳回，请补充后重新提交',
    time: formatTimeAgo(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    icon: 'check-circle',
    iconColor: '#00C853',
    title: '交易成功',
    content: '您出售的"MacBook Pro 2023"已成功交易，款项已到账',
    time: formatTimeAgo(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 5,
    icon: 'info-circle',
    iconColor: '#00B8D4',
    title: '账户安全提醒',
    content: '您的账号于今日在新设备登录，如非本人操作请及时修改密码',
    time: formatTimeAgo(Date.now() - 30 * 60 * 1000)
  }
]);

const interactMessages = ref([
  {
    id: 1,
    avatar: 'https://picsum.photos/100/100?random=30',
    userName: '数码爱好者',
    content: '赞了你的帖子《iPhone 15 Pro 深度测评》',
    time: formatTimeAgo(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 2,
    avatar: 'https://picsum.photos/100/100?random=31',
    userName: '科技小白',
    content: '关注了你',
    time: formatTimeAgo(Date.now() - 60 * 60 * 1000)
  },
  {
    id: 3,
    avatar: 'https://picsum.photos/100/100?random=32',
    userName: '摄影师老李',
    content: '评论了你的帖子：拍得真好！请问用的什么镜头？',
    time: formatTimeAgo(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 4,
    avatar: 'https://picsum.photos/100/100?random=33',
    userName: '游戏玩家',
    content: '赞了你的帖子《PS5 开箱体验》',
    time: formatTimeAgo(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: 5,
    avatar: 'https://picsum.photos/100/100?random=34',
    userName: '设计师小王',
    content: '收藏了你的帖子《UI设计趋势2024》',
    time: formatTimeAgo(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: 6,
    avatar: 'https://picsum.photos/100/100?random=35',
    userName: '健身达人',
    content: '评论了你的帖子：这个健身计划很棒，已收藏！',
    time: formatTimeAgo(Date.now() - 24 * 60 * 60 * 1000)
  }
]);

const isEmpty = computed(() => {
  if (activeTab.value === 0) return tradeMessages.value.length === 0;
  if (activeTab.value === 1) return systemMessages.value.length === 0;
  if (activeTab.value === 2) return interactMessages.value.length === 0;
  return false;
});

const goChat = (item: any) => {
  chatStore.setCurrentConversation(item.id);
  uni.showToast({ title: '聊天功能开发中', icon: 'none' });
};

const handleSystemMessage = (item: any) => {
  uni.showToast({ title: item.title, icon: 'none' });
};

const handleInteract = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.id}` });
};

onMounted(() => {
  if (chatStore.conversations.length === 0) {
    chatStore.setConversations([
      {
        id: 'conv-1',
        targetUserId: 'user-1',
        targetUserName: '数码达人',
        targetUserAvatar: 'https://picsum.photos/100/100?random=seller1',
        lastMessage: '好的，明天发货',
        lastMessageTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        unreadCount: 2,
        isOnline: true,
        isMuted: false,
        isPinned: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'conv-2',
        targetUserId: 'user-2',
        targetUserName: '二手书店',
        targetUserAvatar: 'https://picsum.photos/100/100?random=seller2',
        lastMessage: '这本书还有吗？',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        isOnline: false,
        isMuted: false,
        isPinned: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'conv-3',
        targetUserId: 'user-3',
        targetUserName: '游戏玩家',
        targetUserAvatar: 'https://picsum.photos/100/100?random=seller3',
        lastMessage: 'PS5 能便宜点吗？',
        lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        unreadCount: 1,
        isOnline: true,
        isMuted: false,
        isPinned: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
  }
});
</script>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $color-bg-page;
}

.header-card {
  margin: $space-md;
}

.message-tabs {
  background: $color-white;
  padding: 0 $space-md;
  margin: 0 $space-md;
  border-radius: $radius-lg;
}

.page-content {
  padding-bottom: 0;
}

.message-list {
  padding: $space-md;
  box-sizing: border-box;
  overflow: hidden;
}

.message-group {
  margin-bottom: $space-md;
}

.group-card {
  .group-title {
    padding: $space-md;
    border-bottom: 1px solid $color-divider;
  }
}

.message-item {
  display: flex;
  padding: $space-md;
  border-bottom: 1px solid $color-divider;
  
  &:last-child {
    border-bottom: none;
  }
  
  .item-left {
    position: relative;
    margin-right: $space-md;
  }
  
  .item-content {
    flex: 1;
    overflow: hidden;
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-xs;
    }
    
    .item-desc {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .item-message {
      flex: 1;
      margin-right: $space-sm;
      @include text-ellipsis(1);
    }
  }
  
  &.system-item {
    .system-icon {
      width: 88rpx;
      height: 88rpx;
      background: $color-bg-gray;
      border-radius: 50%;
      @include flex-center;
      margin-right: $space-md;
    }
  }
}

.empty-state {
  @include flex-column-center;
  padding-top: 200rpx;
  
  .empty-text {
    margin-top: $space-md;
  }
}
</style>
