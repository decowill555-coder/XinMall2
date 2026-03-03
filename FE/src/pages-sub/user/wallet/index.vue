<template>
  <view class="wallet-page">
    <ui-sub-navbar title="我的钱包" />
    
    <view class="wallet-header">
      <text class="balance-label">账户余额（元）</text>
      <text class="balance-value">{{ balance.toFixed(2) }}</text>
      <view class="wallet-actions">
        <view class="action-item" @click="handleWithdraw">
          <ui-icon name="arrow-up" ::size="40" />
          <text>提现</text>
        </view>
        <view class="action-item" @click="handleRecharge">
          <ui-icon name="arrow-down" ::size="40" />
          <text>充值</text>
        </view>
        <view class="action-item" @click="goBankCard">
          <ui-icon name="credit-card" ::size="40" />
          <text>银行卡</text>
        </view>
      </view>
    </view>
    
    <view class="quick-stats">
      <view class="stat-item">
        <text class="stat-value">{{ frozenAmount.toFixed(2) }}</text>
        <text class="stat-label">冻结金额</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ income.toFixed(2) }}</text>
        <text class="stat-label">本月收入</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ expense.toFixed(2) }}</text>
        <text class="stat-label">本月支出</text>
      </view>
    </view>
    
    <view class="transaction-section">
      <view class="section-header">
        <text class="section-title">交易记录</text>
        <text class="section-more" @click="goAllTransactions">全部</text>
      </view>
      
      <scroll-view scroll-y class="transaction-scroll" :style="{ height: scrollHeight + 'px' }">
        <view v-if="transactions.length === 0" class="empty-state">
          <ui-icon name="file-text" :size="80" color="#A1A1A6" />
          <text class="empty-text">暂无交易记录</text>
        </view>
        
        <view v-else class="transaction-list">
          <view v-for="item in transactions" :key="item.id" class="transaction-item">
            <view class="item-left">
              <ui-icon :name="item.type === 'income' ? 'arrow-down' : 'arrow-up'" ::size="40" :color="item.type === 'income' ? '#1ABC9C' : '#FF3D00'" />
              <view class="item-info">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-time">{{ item.time }}</text>
              </view>
            </view>
            <text class="item-amount" :class="item.type">
              {{ item.type === 'income' ? '+' : '-' }}{{ item.amount.toFixed(2) }}
            </text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { safeAreaBottom, scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 468
});

const balance = ref(8888.88);
const frozenAmount = ref(500.00);
const income = ref(3580.00);
const expense = ref(1200.00);

const transactions = ref([
  { id: 1, type: 'income', title: '商品销售收入', amount: 7999.00, time: '2024-01-15 10:30' },
  { id: 2, type: 'expense', title: '提现', amount: 5000.00, time: '2024-01-14 15:20' },
  { id: 3, type: 'income', title: '商品销售收入', amount: 1399.00, time: '2024-01-13 09:15' },
  { id: 4, type: 'expense', title: '平台服务费', amount: 50.00, time: '2024-01-12 18:00' },
  { id: 5, type: 'income', title: '商品销售收入', amount: 2199.00, time: '2024-01-11 14:30' }
]);

const handleWithdraw = () => {
  uni.showToast({ title: '提现功能开发中', icon: 'none' });
};

const handleRecharge = () => {
  uni.showToast({ title: '充值功能开发中', icon: 'none' });
};

const goBankCard = () => {
  uni.showToast({ title: '银行卡管理', icon: 'none' });
};

const goAllTransactions = () => {
  uni.showToast({ title: '全部交易记录', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.wallet-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.wallet-header {
  @include flex-column-center;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  
  .balance-label {
    font-size: $font-size-sm;
    color: rgba($color-white, 0.8);
  }
  
  .balance-value {
    font-size: 64rpx;
    font-weight: $font-weight-bold;
    color: $color-white;
    margin: $space-sm 0;
  }
  
  .wallet-actions {
    display: flex;
    gap: $space-xl;
    margin-top: $space-lg;
    
    .action-item {
      @include flex-column-center;
      
      text {
        font-size: $font-size-xs;
        color: $color-white;
        margin-top: $space-xs;
      }
    }
  }
}

.quick-stats {
  display: flex;
  justify-content: space-around;
  padding: $space-lg;
  background: $color-white;
  
  .stat-item {
    @include flex-column-center;
    
    .stat-value {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-main;
    }
    
    .stat-label {
      font-size: $font-size-xs;
      color: $color-text-sub;
      margin-top: $space-xs;
    }
  }
}

.transaction-section {
  margin-top: $space-sm;
  background: $color-white;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md;
    
    .section-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $color-text-main;
    }
    
    .section-more {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
  }
}

.transaction-scroll {
  overflow: hidden;
}
  padding: 0 $space-md;
}

.empty-state {
  @include flex-column-center;
  padding-top: 100rpx;
  
  .empty-text {
    font-size: $font-size-md;
    color: $color-text-disabled;
    margin-top: $space-md;
  }
}

.transaction-list {
  .transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    border-bottom: 1rpx solid $color-divider;
    
    .item-left {
      display: flex;
      align-items: center;
      
      .item-info {
        margin-left: $space-sm;
        
        .item-title {
          font-size: $font-size-md;
          color: $color-text-main;
        }
        
        .item-time {
          font-size: $font-size-xs;
          color: $color-text-disabled;
          margin-top: $space-xs;
        }
      }
    }
    
    .item-amount {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      
      &.income { color: $color-success; }
      &.expense { color: $color-error; }
    }
  }
}
</style>
