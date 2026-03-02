import { ref, computed, onMounted, onUnmounted } from 'vue';

export type Platform = 'ios' | 'android' | 'mp-weixin' | 'h5' | 'unknown';

export interface ScreenInfo {
  statusBarHeight: number;
  navBarHeight: number;
  totalNavHeight: number;
  screenWidth: number;
  screenHeight: number;
  windowHeight: number;
  windowWidth: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  pixelRatio: number;
  platform: Platform;
  isIOS: boolean;
  isAndroid: boolean;
  isMP: boolean;
  isH5: boolean;
  isApp: boolean;
  hasNotch: boolean;
  bottomSafeHeight: number;
  capsuleWidth: number;
  capsuleHeight: number;
  capsuleRight: number;
  capsuleTop: number;
}

const IOS_NAV_BAR_HEIGHT = 44;
const ANDROID_NAV_BAR_HEIGHT = 48;
const DEFAULT_STATUS_BAR_HEIGHT = 20;
const DEFAULT_SCREEN_WIDTH = 375;
const DEFAULT_SCREEN_HEIGHT = 667;

function getPlatform(): Platform {
  const systemInfo = uni.getSystemInfoSync();
  const platform = systemInfo.platform || '';
  const uniPlatform = systemInfo.uniPlatform || '';

  if (uniPlatform === 'mp-weixin' || platform === 'mp-weixin') {
    return 'mp-weixin';
  }

  if (uniPlatform === 'h5' || typeof window !== 'undefined') {
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    return 'h5';
  }

  if (uniPlatform === 'app' || platform === 'ios' || platform === 'android') {
    return platform === 'ios' ? 'ios' : 'android';
  }

  return 'unknown';
}

function getIOSStatusBarHeight(): number {
  const systemInfo = uni.getSystemInfoSync();
  const model = systemInfo.model || '';
  const statusBarHeight = systemInfo.statusBarHeight || 0;

  if (statusBarHeight > 0) {
    return statusBarHeight;
  }

  const notchModels = ['iPhone X', 'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'];
  const hasNotch = notchModels.some(m => model.includes(m)) || model.includes('iPhone');

  if (hasNotch && model.includes('iPhone')) {
    return 44;
  }

  return DEFAULT_STATUS_BAR_HEIGHT;
}

function getAndroidStatusBarHeight(): number {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.statusBarHeight || 24;
}

function getMPNavBarHeight(): number {
  return IOS_NAV_BAR_HEIGHT;
}

function getH5NavBarHeight(): number {
  return IOS_NAV_BAR_HEIGHT;
}

function getAppNavBarHeight(platform: Platform): number {
  return platform === 'ios' ? IOS_NAV_BAR_HEIGHT : ANDROID_NAV_BAR_HEIGHT;
}

function getSafeArea(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const systemInfo = uni.getSystemInfoSync();
  const safeArea = systemInfo.safeArea || {
    top: 0,
    bottom: systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT,
    left: 0,
    right: systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH
  };

  return {
    top: safeArea.top || 0,
    bottom: safeArea.bottom || systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT,
    left: safeArea.left || 0,
    right: safeArea.right || systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH
  };
}

function getBottomSafeHeight(platform: Platform, screenHeight: number, safeAreaBottom: number): number {
  if (platform === 'h5') {
    return 0;
  }

  const bottomSafe = screenHeight - safeAreaBottom;
  return bottomSafe > 0 ? bottomSafe : 0;
}

function getMPCapsuleInfo(): {
  width: number;
  height: number;
  right: number;
  top: number;
} {
  try {
    if (uni.getMenuButtonBoundingClientRect) {
      const rect = uni.getMenuButtonBoundingClientRect();
      return {
        width: rect.width || 87,
        height: rect.height || 32,
        right: rect.right || 0,
        top: rect.top || 0
      };
    }
  } catch {
    console.warn('获取胶囊按钮信息失败');
  }

  return {
    width: 87,
    height: 32,
    right: 7,
    top: 4
  };
}

function checkHasNotch(platform: Platform, statusBarHeight: number): boolean {
  if (platform === 'ios') {
    return statusBarHeight >= 44;
  }

  if (platform === 'android') {
    return statusBarHeight >= 28;
  }

  return false;
}

export function useScreen() {
  const statusBarHeight = ref(DEFAULT_STATUS_BAR_HEIGHT);
  const navBarHeight = ref(IOS_NAV_BAR_HEIGHT);
  const totalNavHeight = ref(64);
  const screenWidth = ref(DEFAULT_SCREEN_WIDTH);
  const screenHeight = ref(DEFAULT_SCREEN_HEIGHT);
  const windowHeight = ref(DEFAULT_SCREEN_HEIGHT);
  const windowWidth = ref(DEFAULT_SCREEN_WIDTH);
  const safeAreaTop = ref(0);
  const safeAreaBottom = ref(DEFAULT_SCREEN_HEIGHT);
  const safeAreaLeft = ref(0);
  const safeAreaRight = ref(DEFAULT_SCREEN_WIDTH);
  const pixelRatio = ref(1);
  const platform = ref<Platform>('unknown');
  const bottomSafeHeight = ref(0);
  const capsuleWidth = ref(87);
  const capsuleHeight = ref(32);
  const capsuleRight = ref(7);
  const capsuleTop = ref(4);

  const isIOS = computed(() => platform.value === 'ios');
  const isAndroid = computed(() => platform.value === 'android');
  const isMP = computed(() => platform.value === 'mp-weixin');
  const isH5 = computed(() => platform.value === 'h5');
  const isApp = computed(() => isIOS.value || isAndroid.value);
  const hasNotch = computed(() => checkHasNotch(platform.value, statusBarHeight.value));

  const safeArea = computed(() => ({
    top: safeAreaTop.value,
    bottom: safeAreaBottom.value,
    left: safeAreaLeft.value,
    right: safeAreaRight.value,
    width: safeAreaRight.value - safeAreaLeft.value,
    height: safeAreaBottom.value - safeAreaTop.value
  }));

  const contentHeight = computed(() => {
    return windowHeight.value - totalNavHeight.value - bottomSafeHeight.value;
  });

  const screenInfo = computed<ScreenInfo>(() => ({
    statusBarHeight: statusBarHeight.value,
    navBarHeight: navBarHeight.value,
    totalNavHeight: totalNavHeight.value,
    screenWidth: screenWidth.value,
    screenHeight: screenHeight.value,
    windowHeight: windowHeight.value,
    windowWidth: windowWidth.value,
    safeAreaTop: safeAreaTop.value,
    safeAreaBottom: safeAreaBottom.value,
    safeAreaLeft: safeAreaLeft.value,
    safeAreaRight: safeAreaRight.value,
    pixelRatio: pixelRatio.value,
    platform: platform.value,
    isIOS: isIOS.value,
    isAndroid: isAndroid.value,
    isMP: isMP.value,
    isH5: isH5.value,
    isApp: isApp.value,
    hasNotch: hasNotch.value,
    bottomSafeHeight: bottomSafeHeight.value,
    capsuleWidth: capsuleWidth.value,
    capsuleHeight: capsuleHeight.value,
    capsuleRight: capsuleRight.value,
    capsuleTop: capsuleTop.value
  }));

  function initScreenInfo() {
    const systemInfo = uni.getSystemInfoSync();
    const currentPlatform = getPlatform();
    platform.value = currentPlatform;

    screenWidth.value = systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH;
    screenHeight.value = systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT;
    windowWidth.value = systemInfo.windowWidth || screenWidth.value;
    windowHeight.value = systemInfo.windowHeight || screenHeight.value;
    pixelRatio.value = systemInfo.pixelRatio || 1;

    const safeAreaInfo = getSafeArea();
    safeAreaTop.value = safeAreaInfo.top;
    safeAreaBottom.value = safeAreaInfo.bottom;
    safeAreaLeft.value = safeAreaInfo.left;
    safeAreaRight.value = safeAreaInfo.right;

    switch (currentPlatform) {
      case 'ios':
        statusBarHeight.value = getIOSStatusBarHeight();
        navBarHeight.value = getAppNavBarHeight('ios');
        break;

      case 'android':
        statusBarHeight.value = getAndroidStatusBarHeight();
        navBarHeight.value = getAppNavBarHeight('android');
        break;

      case 'mp-weixin':
        statusBarHeight.value = systemInfo.statusBarHeight || DEFAULT_STATUS_BAR_HEIGHT;
        navBarHeight.value = getMPNavBarHeight();
        const capsuleInfo = getMPCapsuleInfo();
        capsuleWidth.value = capsuleInfo.width;
        capsuleHeight.value = capsuleInfo.height;
        capsuleRight.value = capsuleInfo.right;
        capsuleTop.value = capsuleInfo.top;
        break;

      case 'h5':
        statusBarHeight.value = 0;
        navBarHeight.value = getH5NavBarHeight();
        break;

      default:
        statusBarHeight.value = systemInfo.statusBarHeight || DEFAULT_STATUS_BAR_HEIGHT;
        navBarHeight.value = IOS_NAV_BAR_HEIGHT;
    }

    totalNavHeight.value = statusBarHeight.value + navBarHeight.value;

    bottomSafeHeight.value = getBottomSafeHeight(
      currentPlatform,
      screenHeight.value,
      safeAreaBottom.value
    );
  }

  function pxToRpx(px: number): number {
    return px * (750 / screenWidth.value);
  }

  function rpxToPx(rpx: number): number {
    return rpx * (screenWidth.value / 750);
  }

  function getNavStyle() {
    return {
      paddingTop: `${statusBarHeight.value}px`,
      height: `${navBarHeight.value}px`,
      lineHeight: `${navBarHeight.value}px`,
      totalHeight: `${totalNavHeight.value}px`
    };
  }

  function getSafeAreaStyle() {
    return {
      paddingTop: `${safeAreaTop.value}px`,
      paddingBottom: `${bottomSafeHeight.value}px`,
      paddingLeft: `${safeAreaLeft.value}px`,
      paddingRight: `${safeAreaRight.value - windowWidth.value}px`
    };
  }

  function getMPCapsuleStyle() {
    if (!isMP.value) {
      return null;
    }

    return {
      width: `${capsuleWidth.value}px`,
      height: `${capsuleHeight.value}px`,
      right: `${capsuleRight.value}px`,
      top: `${capsuleTop.value}px`
    };
  }

  function getCustomNavStyle() {
    return {
      statusBarHeight: `${statusBarHeight.value}px`,
      navBarHeight: `${navBarHeight.value}px`,
      totalHeight: `${totalNavHeight.value}px`,
      bottomSafe: `${bottomSafeHeight.value}px`,
      capsuleRight: isMP.value ? `${capsuleRight.value}px` : '0',
      capsuleWidth: isMP.value ? `${capsuleWidth.value}px` : '0'
    };
  }

  let resizeCallback: (() => void) | null = null;

  function onScreenResize(callback: () => void) {
    resizeCallback = callback;
    uni.onWindowResize(() => {
      initScreenInfo();
      if (resizeCallback) {
        resizeCallback();
      }
    });
  }

  function offScreenResize() {
    resizeCallback = null;
    uni.offWindowResize(() => {});
  }

  onMounted(() => {
    initScreenInfo();
  });

  onUnmounted(() => {
    offScreenResize();
  });

  return {
    statusBarHeight,
    navBarHeight,
    totalNavHeight,
    screenWidth,
    screenHeight,
    windowHeight,
    windowWidth,
    safeAreaTop,
    safeAreaBottom,
    safeAreaLeft,
    safeAreaRight,
    pixelRatio,
    platform,
    bottomSafeHeight,
    capsuleWidth,
    capsuleHeight,
    capsuleRight,
    capsuleTop,
    isIOS,
    isAndroid,
    isMP,
    isH5,
    isApp,
    hasNotch,
    safeArea,
    contentHeight,
    screenInfo,
    pxToRpx,
    rpxToPx,
    getNavStyle,
    getSafeAreaStyle,
    getMPCapsuleStyle,
    getCustomNavStyle,
    onScreenResize,
    offScreenResize,
    initScreenInfo
  };
}
