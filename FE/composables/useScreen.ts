// src/composables/useScreen.ts
import { reactive, toRefs } from 'vue';

const screenState = reactive({
  statusBarHeight: 0,
  navBarHeight: 44,
  safeAreaBottom: 0,
  totalNavHeight: 0,
  screenWidth: 0,
  screenHeight: 0,
  isApp: false
});

const initScreen = () => {
  const sys = uni.getSystemInfoSync();
  screenState.statusBarHeight = sys.statusBarHeight || 0;
  screenState.screenWidth = sys.screenWidth;
  screenState.screenHeight = sys.screenHeight;

  if (sys.safeAreaInsets && sys.safeAreaInsets.bottom) {
    screenState.safeAreaBottom = sys.safeAreaInsets.bottom;
  }

  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect();
  const customNavHeight = (menuButton.top - screenState.statusBarHeight) * 2 + menuButton.height;
  screenState.navBarHeight = customNavHeight > 0 ? customNavHeight : 44;
  // #endif

  // #ifdef APP-PLUS
  screenState.isApp = true;
  if (screenState.statusBarHeight === 0) {
    const platform = sys.platform || '';
    if (platform === 'android') {
      screenState.statusBarHeight = 24;
    } else if (platform === 'ios') {
      screenState.statusBarHeight = 20;
    }
  }
  // #endif

  screenState.totalNavHeight = screenState.statusBarHeight + screenState.navBarHeight;
};

initScreen();

export const useScreen = () => {
  return {
    ...toRefs(screenState)
  };
};