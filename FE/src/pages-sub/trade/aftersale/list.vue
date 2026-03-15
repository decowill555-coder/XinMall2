<template>
  <view class="aftersale-list-page">
    <ui-sub-navbar title="退款/售后" />
    
    <view class="filter-bar">
      <ui-tabs v-model="activeTab" :list="tabList" type="line" />
    </view>
    
    <scroll-view scroll-y class="list-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="aftersale-content">
        <ui-empty 
          v-if="aftersaleList.length === 0" 
          icon="refresh" 
          text="暂无售后记录"
        />
        
        <view v-else class="aftersale-list">
          <ui-after-sale-card 
            v-for="item in aftersaleList" 
            :key="item.id"
            :order-no="item.orderNo"
            :cover="item.goodsCover"
            :title="item.goodsTitle"
            :spec="item.goodsSpec"
            :type="item.type"
            :reason="item.reason"
            :time="item.createTime"
            :status="item.status"
            @click="goDetail(item)"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true,
  headerEstimatedHeight: 176
});

const activeTab = ref(0);

const tabList = ref([
  { name: '全部' },
  { name: '待处理' },
  { name: '处理中' },
  { name: '已完成' }
]);

const statusMap: Record<number, string | undefined> = {
  0: undefined,
  1: 'pending',
  2: 'processing',
  3: 'completed'
};

const aftersaleList = ref<any[]>([]);

const fetchAftersaleList = async () => {
  const status = statusMap[activeTab.value];
  
};

watch(activeTab, () => {
  fetchAftersaleList();
});

onMounted(() => {
  fetchAftersaleList();
});

const goDetail = (item: any) => {
  uni.navigateTo({ url: `/pages-sub/trade/aftersale/detail?id=${item.id}` });
};
</script>

<style lang="scss" scoped>
.aftersale-list-page {
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

.aftersale-content {
  padding: $space-sm $space-md;
}
</style>
