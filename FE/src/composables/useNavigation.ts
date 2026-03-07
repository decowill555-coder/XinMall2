import {
  smartBack,
  backToLevel,
  backToPreviousLevel,
  backToHome,
  switchToTab,
  navigateTo,
  redirectTo,
  reLaunch,
  navigateBack,
  navigateWithReplace,
  canNavigateBack,
  getCurrentPage,
  getCurrentPageRoute,
  getPageStack,
  getStackDepth,
  getPreviousPage,
  getPreviousPageRoute,
  getPageConfig,
  getPageLevel,
  getPageGroup,
  isTabPage,
  type PageLevel,
  type NavigationOptions
} from '@/utils/navigation';

export function useNavigation() {
  const handleSmartBack = (options?: NavigationOptions) => {
    smartBack(options);
  };

  const handleBackToLevel = (targetLevel: PageLevel) => {
    backToLevel(targetLevel);
  };

  const handleBackToPreviousLevel = () => {
    backToPreviousLevel();
  };

  const handleBackToHome = () => {
    backToHome();
  };

  const handleSwitchTab = (url: string) => {
    switchToTab(url);
  };

  const handleNavigateTo = (url: string) => {
    navigateTo(url);
  };

  const handleRedirectTo = (url: string) => {
    redirectTo(url);
  };

  const handleReLaunch = (url: string) => {
    reLaunch(url);
  };

  const handleNavigateBack = (delta?: number) => {
    navigateBack(delta);
  };

  const handleNavigateWithReplace = (url: string, replaceIfSameLevel?: boolean) => {
    navigateWithReplace(url, replaceIfSameLevel);
  };

  return {
    smartBack: handleSmartBack,
    backToLevel: handleBackToLevel,
    backToPreviousLevel: handleBackToPreviousLevel,
    backToHome: handleBackToHome,
    switchToTab: handleSwitchTab,
    navigateTo: handleNavigateTo,
    redirectTo: handleRedirectTo,
    reLaunch: handleReLaunch,
    navigateBack: handleNavigateBack,
    navigateWithReplace: handleNavigateWithReplace,
    canNavigateBack,
    getCurrentPage,
    getCurrentPageRoute,
    getPageStack,
    getStackDepth,
    getPreviousPage,
    getPreviousPageRoute,
    getPageConfig,
    getPageLevel,
    getPageGroup,
    isTabPage
  };
}
