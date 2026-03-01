<template>
  <view class="message-page">
    <view class="page-content">
      <view class="header">
        <text class="title">消息</text>
      </view>
      
      <view class="message-tabs">
        <ui-tabs v-model="activeTab" :list="tabList" type="line" />
      </view>
      
      <scroll-view scroll-y class="message-list">
        <view v-if="activeTab === 0" class="message-group">
          <view class="group-title">交易消息</view>
          <view 
            v-for="item in tradeMessages" 
            :key="item.id" 
            class="message-item"
            @click="goChat(item)"
          >
            <view class="item-left">
              <ui-avatar :src="item.avatar" :size="88" />
              <view v-if="item.unread" class="unread-dot"></view>
            </view>
            <view class="item-content">
              <view class="item-header">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-time">{{ item.time }}</text>
              </view>
              <view class="item-desc">
                <text class="item-message">{{ item.lastMessage }}</text>
                <ui-badge v-if="item.unread > 0" :value="item.unread" />
              </view>
            </view>
          </view>
        </view>
        
        <view v-if="activeTab === 1" class="message-group">
          <view class="group-title">系统通知</view>
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
                <text class="item-title">{{ item.title }}</text>
                <text class="item-time">{{ item.time }}</text>
              </view>
              <text class="item-message">{{ item.content }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="activeTab === 2" class="message-group">
          <view class="group-title">互动消息</view>
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
                <text class="item-title">{{ item.userName }}</text>
                <text class="item-time">{{ item.time }}</text>
              </view>
              <text class="item-message">{{ item.content }}</text>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-if="isEmpty">
          <ui-icon name="message" size="80" color="#A1A1A6" />
          <text class="empty-text">暂无消息</text>
        </view>
      </scroll-view>
    </view>
    
    <TheTabbar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const activeTab = ref(0);

const tabList = ref([
  { name: '交易' },
  { name: '通知' },
  { name: '互动' }
]);

const tradeMessages = ref([
  {
    id: 1,
    avatar: 'https://picsum.photos/100/100?random=20',
    title: '卖家：数码达人',
    lastMessage: '好的，明天发货，请注意查收',
    time: '刚刚',
    unread: 2
  },
  {
    id: 2,
    avatar: 'https://picsum.photos/100/100?random=21',
    title: '买家：小明',
    lastMessage: '请问这个还在吗？可以便宜点吗？',
    time: '10分钟前',
    unread: 0
  },
  {
    id: 3,
    avatar: 'https://picsum.photos/100/100?random=22',
    title: '卖家：科技博主',
    lastMessage: '已经为您安排发货了，单号：SF123456789',
    time: '1小时前',
    unread: 1
  },
  {
    id: 4,
    avatar: 'https://picsum.photos/100/100?random=23',
    title: '系统客服',
    lastMessage: '您的订单已签收，请确认收货',
    time: '昨天',
    unread: 0
  }
]);

const systemMessages = ref([
  {
    id: 1,
    icon: 'check-circle',
    iconColor: '#00C853',
    title: '订单发货通知',
    content: '您购买的 iPhone 15 Pro Max 已发货，预计3天内送达',
    time: '2小时前'
  },
  {
    id: 2,
    icon: 'info-circle',
    iconColor: '#00B8D4',
    title: '实名认证成功',
    content: '恭喜您完成实名认证，现在可以发布商品了',
    time: '昨天'
  },
  {
    id: 3,
    icon: 'close-circle',
    iconColor: '#FF3D00',
    title: '商品审核未通过',
    content: '您发布的商品"测试商品"因信息不完整被驳回，请补充后重新提交',
    time: '3天前'
  }
]);

const interactMessages = ref([
  {
    id: 1,
    avatar: 'https://picsum.photos/100/100?random=30',
    userName: '数码爱好者',
    content: '赞了你的帖子《iPhone 15 Pro 深度测评》',
    time: '30分钟前'
  },
  {
    id: 2,
    avatar: 'https://picsum.photos/100/100?random=31',
    userName: '科技小白',
    content: '关注了你',
    time: '1小时前'
  },
  {
    id: 3,
    avatar: 'https://picsum.photos/100/100?random=32',
    userName: '摄影师老李',
    content: '评论了你的帖子：拍得真好！请问用的什么镜头？',
    time: '2小时前'
  }
]);

const isEmpty = computed(() => {
  if (activeTab.value === 0) return tradeMessages.value.length === 0;
  if (activeTab.value === 1) return systemMessages.value.length === 0;
  if (activeTab.value === 2) return interactMessages.value.length === 0;
  return false;
});

const goChat = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/chat/index?id=${item.id}` });
};

const handleSystemMessage = (item: any) => {
  uni.showToast({ title: item.title, icon: 'none' });
};

const handleInteract = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.id}` });
};
</script>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.page-content {
  padding-bottom: 120rpx;
}

.header {
  padding: $space-lg $space-md;
  background: $color-white;
  
  .title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-main;
  }
}

.message-tabs {
  background: $color-white;
  padding: 0 $space-md;
}

.message-list {
  height: calc(100vh - 200rpx - 120rpx);
}

.message-group {
  .group-title {
    padding: $space-md;
    font-size: $font-size-sm;
    color: $color-text-sub;
  }
}

.message-item {
  display: flex;
  padding: $space-md;
  background: $color-white;
  
  .item-left {
    position: relative;
    margin-right: $space-md;
    
    .unread-dot {
      position: absolute;
      top: 0;
      right: 0;
      width: 16rpx;
      height: 16rpx;
      background: $color-error;
      border-radius: 50%;
    }
  }
  
  .item-content {
    flex: 1;
    overflow: hidden;
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-xs;
      
      .item-title {
        font-size: $font-size-md;
        font-weight: $font-weight-medium;
        color: $color-text-main;
      }
      
      .item-time {
        font-size: $font-size-xs;
        color: $color-text-disabled;
      }
    }
    
    .item-desc {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .item-message {
      font-size: $font-size-sm;
      color: $color-text-sub;
      @include text-ellipsis(1);
      flex: 1;
      margin-right: $space-sm;
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
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin-top: $space-md;
  }
}
</style>
