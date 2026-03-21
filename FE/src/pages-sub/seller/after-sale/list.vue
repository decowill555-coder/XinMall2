<template>
  <view class="after-sale-list-page">
    <ui-sub-navbar title="售后管理" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="list-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="after-content">
        <ui-empty 
          v-if="afterSaleList.length === 0" 
          icon="refresh" 
          text="暂无售后记录"
        />
        
        <view v-else class="after-sale-list">
          <ui-after-sale-card 
            v-for="item in afterSaleList" 
            :key="item.id"
            :order-no="item.orderNo"
            :cover="item.goodsCover"
            :title="item.goodsTitle"
            :spec="item.goodsSpec"
            :type="item.type"
            :reason="item.reason"
            :time="item.createTime"
            :status="item.status"
            :show-actions="item.status === 'pending'"
            @click="goDetail(item)"
            @agree="handleAgree(item)"
            @reject="handleReject(item)"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { aftersaleApi, type AftersaleListItem, type AftersaleStatus } from '@/api/aftersale';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const activeTab = ref(0);
const loading = ref(false);

const tabList = ref([
  { name: '全部' },
  { name: '待处理' },
  { name: '处理中' },
  { name: '已完成' }
]);

// 状态映射
const statusMap: Record<number, AftersaleStatus | undefined> = {
  0: undefined, // 全部
  1: 'pending', // 待处理
  2: 'processing', // 处理中
  3: 'completed' // 已完成
};

const afterSaleList = ref<AftersaleListItem[]>([]);
const page = ref(1);
const hasMore = ref(true);

// 加载数据
const loadData = async (reset = false) => {
  if (loading.value) return;

  if (reset) {
    page.value = 1;
    afterSaleList.value = [];
    hasMore.value = true;
  }

  try {
    loading.value = true;
    const status = statusMap[activeTab.value];
    const res = await aftersaleApi.getSellerAftersaleList({
      status,
      page: page.value,
      size: 10
    });

    if (reset) {
      afterSaleList.value = res.list;
    } else {
      afterSaleList.value.push(...res.list);
    }
    hasMore.value = res.hasMore;
  } catch (error) {
    console.error('加载售后列表失败', error);
  } finally {
    loading.value = false;
  }
};

// 监听tab切换
watch(activeTab, () => {
  loadData(true);
});

onMounted(() => {
  loadData();
});

const goDetail = (item: AftersaleListItem) => {
  uni.navigateTo({ url: `/pages-sub/seller/after-sale/detail?id=${item.id}` });
};

const handleAgree = (item: AftersaleListItem) => {
  uni.showModal({
    title: '确认',
    content: '确定同意该售后申请吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await aftersaleApi.agreeAftersale(item.id);
          uni.showToast({ title: '已同意', icon: 'success' });
          loadData(true);
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    }
  });
};

const handleReject = (item: AftersaleListItem) => {
  uni.showModal({
    title: '拒绝原因',
    editable: true,
    placeholderText: '请输入拒绝原因',
    success: async (res) => {
      if (res.confirm && res.content) {
        try {
          await aftersaleApi.rejectAftersale(item.id, res.content);
          uni.showToast({ title: '已拒绝', icon: 'success' });
          loadData(true);
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' });
        }
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.after-sale-list-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.filter-bar {
  background: var(--glass-solid, rgba(255, 255, 255, 0.85));
  backdrop-filter: blur($blur-lg);
  -webkit-backdrop-filter: blur($blur-lg);
  padding: 0 $space-md;
}

.list-scroll {
  overflow: hidden;
}
.after-content{
  padding: $space-sm $space-md;
}
</style>
