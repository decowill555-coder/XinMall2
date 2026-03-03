import { ref, computed, onMounted, nextTick } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores';

export interface PageLayoutOptions {
  hasTabbar?: boolean;
  hasSubNavbar?: boolean;
  headerSelector?: string;
  headerEstimatedHeight?: number;
}

export function usePageLayout(options: PageLayoutOptions = {}) {
  const {
    hasTabbar = false,
    hasSubNavbar = false,
    headerSelector = '.page-header',
    headerEstimatedHeight = 88
  } = options;

  const appStore = useAppStore();

  const safeAreaTop = computed(() => appStore.safeAreaInsets.top);
  const safeAreaBottom = computed(() => appStore.safeAreaInsets.bottom);
  const isH5 = computed(() => appStore.isH5);

  const headerExtraTop = computed(() => isH5.value ? 12 : 0);

  const headerHeight = ref(0);
  const scrollHeight = ref(0);

  const rpxToPx = (rpx: number): number => {
    const systemInfo = uni.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth || 375;
    return (rpx * screenWidth) / 750;
  };

  const calcLayout = () => {
    const systemInfo = uni.getSystemInfoSync();
    const tabbarHeight = hasTabbar ? rpxToPx(100) : 0;
    
    if (hasSubNavbar) {
      const navBarHeight = 44;
      const totalNavHeight = safeAreaTop.value + navBarHeight;
      headerHeight.value = totalNavHeight;
      scrollHeight.value = systemInfo.windowHeight - totalNavHeight - tabbarHeight - safeAreaBottom.value;
      return;
    }
    
    const query = uni.createSelectorQuery();
    query.select(headerSelector).boundingClientRect((rect: any) => {
      if (rect && rect.height > 0) {
        headerHeight.value = rect.height;
        scrollHeight.value = systemInfo.windowHeight - rect.height - tabbarHeight - safeAreaBottom.value;
      }
    }).exec();
  };

  const initLayout = () => {
    const systemInfo = uni.getSystemInfoSync();
    const tabbarHeight = hasTabbar ? rpxToPx(100) : 0;
    
    if (hasSubNavbar) {
      const navBarHeight = 44;
      const totalNavHeight = safeAreaTop.value + navBarHeight;
      headerHeight.value = totalNavHeight;
      scrollHeight.value = systemInfo.windowHeight - totalNavHeight - tabbarHeight - safeAreaBottom.value;
      return;
    }
    
    const estimatedHeader = rpxToPx(headerEstimatedHeight) + safeAreaTop.value + headerExtraTop.value;
    
    headerHeight.value = estimatedHeader;
    scrollHeight.value = systemInfo.windowHeight - estimatedHeader - tabbarHeight - safeAreaBottom.value;
  };

  onMounted(() => {
    initLayout();
  });

  onReady(() => {
    nextTick(() => {
      calcLayout();
    });
  });

  return {
    safeAreaTop,
    safeAreaBottom,
    isH5,
    headerExtraTop,
    headerHeight,
    scrollHeight,
    rpxToPx,
    calcLayout,
    initLayout
  };
}
