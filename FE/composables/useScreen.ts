// src/composables/useScreen.ts
import { reactive, toRefs } from 'vue';

const screenState = reactive({
  statusBarHeight: 0, // 状态栏高度 (刘海高度)
  navBarHeight: 44,   // 导航栏内容高度 (固定)
  safeAreaBottom: 0,  // 底部安全区 (iPhone X 横条)
  totalNavHeight: 0,  // 状态栏 + 导航栏 (用于自定义顶部Fixed定位)
  screenWidth: 0,
  screenHeight: 0
});

// 初始化一次即可
const initScreen = () => {
  const sys = uni.getSystemInfoSync();
  screenState.statusBarHeight = sys.statusBarHeight || 0;
  screenState.screenWidth = sys.screenWidth;
  screenState.screenHeight = sys.screenHeight;
  
  // 底部安全区
  if (sys.safeAreaInsets && sys.safeAreaInsets.bottom) {
    screenState.safeAreaBottom = sys.safeAreaInsets.bottom;
  }

  // 胶囊按钮位置 (小程序特有)
  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect();
  // 导航栏高度 = (胶囊顶部 - 状态栏高度) * 2 + 胶囊高度
  const customNavHeight = (menuButton.top - screenState.statusBarHeight) * 2 + menuButton.height;
  screenState.navBarHeight = customNavHeight > 0 ? customNavHeight : 44;
  // #endif

  screenState.totalNavHeight = screenState.statusBarHeight + screenState.navBarHeight;
};

// 立即初始化
initScreen();

export const useScreen = () => {
  return {
    ...toRefs(screenState)
  };
};