import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  icon?: string;
  position?: 'top' | 'center' | 'bottom';
}

export interface ModalOptions {
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  confirmColor?: string;
  cancelColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ActionSheetOption {
  label: string;
  value: string;
  color?: string;
  disabled?: boolean;
}

export interface ActionSheetOptions {
  title?: string;
  options: ActionSheetOption[];
  cancelText?: string;
  onSelect?: (value: string) => void;
  onCancel?: () => void;
}

export interface LoadingOptions {
  message?: string;
  mask?: boolean;
}

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false);
  const loadingMessage = ref<string>('');
  const loadingCount = ref(0);

  const toast = ref<ToastOptions | null>(null);
  const toastTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const modal = ref<ModalOptions | null>(null);
  const modalVisible = ref(false);

  const actionSheet = ref<ActionSheetOptions | null>(null);
  const actionSheetVisible = ref(false);

  const networkType = ref<string>('unknown');
  const isConnected = ref(true);

  const pageLoading = ref<Record<string, boolean>>({});

  const pullDownRefreshing = ref(false);

  const safeAreaInsets = ref({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });

  const systemInfo = ref<UniApp.GetSystemInfoSyncRes | null>(null);
  
  const platform = ref<string>('unknown');
  
  const isH5 = computed(() => {
    const sys = systemInfo.value;
    if (!sys) return false;
    const uniPlatform = (sys as any).uniPlatform || '';
    return uniPlatform === 'h5' || typeof window !== 'undefined';
  });

  const isPageLoading = computed(() => 
    Object.values(pageLoading.value).some(loading => loading)
  );

  const hasSafeArea = computed(() => 
    safeAreaInsets.value.bottom > 0
  );

  const showLoading = (options: LoadingOptions = {}) => {
    loadingCount.value += 1;
    isLoading.value = true;
    loadingMessage.value = options.message || '加载中...';
    
    uni.showLoading({
      title: loadingMessage.value,
      mask: options.mask !== false
    });
  };

  const hideLoading = (force = false) => {
    if (force) {
      loadingCount.value = 0;
    } else {
      loadingCount.value = Math.max(0, loadingCount.value - 1);
    }

    if (loadingCount.value === 0) {
      isLoading.value = false;
      loadingMessage.value = '';
      uni.hideLoading();
    }
  };

  const showToast = (options: ToastOptions | string) => {
    const opts: ToastOptions = typeof options === 'string' 
      ? { message: options } 
      : options;

    if (toastTimer.value) {
      clearTimeout(toastTimer.value);
    }

    toast.value = {
      message: opts.message,
      type: opts.type || 'info',
      duration: opts.duration || 2000,
      icon: opts.icon,
      position: opts.position || 'center'
    };

    uni.showToast({
      title: opts.message,
      icon: opts.type === 'success' ? 'success' : opts.type === 'error' ? 'error' : 'none',
      duration: opts.duration || 2000,
      position: opts.position || 'center'
    });

    toastTimer.value = setTimeout(() => {
      toast.value = null;
      toastTimer.value = null;
    }, opts.duration || 2000);
  };

  const hideToast = () => {
    if (toastTimer.value) {
      clearTimeout(toastTimer.value);
      toastTimer.value = null;
    }
    toast.value = null;
    uni.hideToast();
  };

  const showModal = (options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      modal.value = {
        ...options,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        showCancel: options.showCancel !== false,
        onConfirm: () => {
          modalVisible.value = false;
          modal.value = null;
          resolve(true);
        },
        onCancel: () => {
          modalVisible.value = false;
          modal.value = null;
          resolve(false);
        }
      };
      modalVisible.value = true;
    });
  };

  const hideModal = () => {
    modalVisible.value = false;
    modal.value = null;
  };

  const showActionSheet = (options: ActionSheetOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      actionSheet.value = {
        ...options,
        cancelText: options.cancelText || '取消',
        onSelect: (value: string) => {
          actionSheetVisible.value = false;
          actionSheet.value = null;
          resolve(value);
        },
        onCancel: () => {
          actionSheetVisible.value = false;
          actionSheet.value = null;
          resolve(null);
        }
      };
      actionSheetVisible.value = true;
    });
  };

  const hideActionSheet = () => {
    actionSheetVisible.value = false;
    actionSheet.value = null;
  };

  const setPageLoading = (pageKey: string, loading: boolean) => {
    pageLoading.value[pageKey] = loading;
  };

  const setPullDownRefreshing = (refreshing: boolean) => {
    pullDownRefreshing.value = refreshing;
  };

  const updateNetworkStatus = () => {
    uni.getNetworkType({
      success: (res) => {
        networkType.value = res.networkType;
        isConnected.value = res.networkType !== 'none';
      }
    });
  };

  const updateSafeArea = () => {
    const sys = uni.getSystemInfoSync();
    systemInfo.value = sys;
    platform.value = (sys as any).uniPlatform || sys.platform || 'unknown';
    
    safeAreaInsets.value = {
      top: sys.safeAreaInsets?.top || 0,
      bottom: sys.safeAreaInsets?.bottom || 0,
      left: sys.safeAreaInsets?.left || 0,
      right: sys.safeAreaInsets?.right || 0
    };
  };

  const alert = (message: string, title?: string) => {
    return showModal({
      title: title || '提示',
      content: message,
      showCancel: false
    });
  };

  const confirm = (message: string, title?: string): Promise<boolean> => {
    return showModal({
      title: title || '确认',
      content: message,
      showCancel: true
    });
  };

  const success = (message: string) => {
    showToast({ message, type: 'success' });
  };

  const error = (message: string) => {
    showToast({ message, type: 'error' });
  };

  const warning = (message: string) => {
    showToast({ message, type: 'warning' });
  };

  const info = (message: string) => {
    showToast({ message, type: 'info' });
  };

  const init = () => {
    updateNetworkStatus();
    updateSafeArea();

    uni.onNetworkStatusChange((res) => {
      networkType.value = res.networkType;
      isConnected.value = res.isConnected;
    });
  };

  init();

  return {
    isLoading,
    loadingMessage,
    loadingCount,
    toast,
    modal,
    modalVisible,
    actionSheet,
    actionSheetVisible,
    networkType,
    isConnected,
    pageLoading,
    pullDownRefreshing,
    safeAreaInsets,
    systemInfo,
    platform,
    isH5,
    isPageLoading,
    hasSafeArea,
    showLoading,
    hideLoading,
    showToast,
    hideToast,
    showModal,
    hideModal,
    showActionSheet,
    hideActionSheet,
    setPageLoading,
    setPullDownRefreshing,
    updateNetworkStatus,
    updateSafeArea,
    alert,
    confirm,
    success,
    error,
    warning,
    info,
    init
  };
});
