import { ref, onMounted } from 'vue';

export function useScreen() {
  const statusBarHeight = ref(20);
  const navBarHeight = ref(44);
  const totalNavHeight = ref(64);
  const screenWidth = ref(375);
  const screenHeight = ref(667);

  onMounted(() => {
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight || 20;
    screenWidth.value = systemInfo.screenWidth || 375;
    screenHeight.value = systemInfo.screenHeight || 667;
    
    // 小程序导航栏高度 (iOS: 44px, Android: 48px)
    if (systemInfo.platform === 'ios') {
      navBarHeight.value = 44;
    } else {
      navBarHeight.value = 48;
    }
    
    totalNavHeight.value = statusBarHeight.value + navBarHeight.value;
  });

  return {
    statusBarHeight,
    navBarHeight,
    totalNavHeight,
    screenWidth,
    screenHeight
  };
}
