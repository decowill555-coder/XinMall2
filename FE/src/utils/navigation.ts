export type PageLevel = 0 | 1 | 2 | 3;

export interface PageConfig {
  level: PageLevel;
  group?: string;
  name: string;
}

export interface NavigationOptions {
  skipSameGroup?: boolean;
  skipSameLevel?: boolean;
  targetLevel?: PageLevel;
  fallbackUrl?: string;
}

const AUTH_REQUIRED_PAGES = [
  'pages/message/index',
  'pages/my/index',
  'pages-sub/trade/cart/index',
  'pages-sub/trade/order/list',
  'pages-sub/trade/order/detail',
  'pages-sub/trade/order/confirm',
  'pages-sub/trade/pay/index',
  'pages-sub/trade/evaluate/index',
  'pages-sub/seller/publish/entry',
  'pages-sub/seller/shop/index',
  'pages-sub/seller/shop/manage',
  'pages-sub/seller/goods/list',
  'pages-sub/seller/goods/edit',
  'pages-sub/seller/after-sale/list',
  'pages-sub/seller/after-sale/detail',
  'pages-sub/content/post/publish',
  'pages-sub/user/address/list',
  'pages-sub/user/address/edit',
  'pages-sub/user/collection/index',
  'pages-sub/user/history/index',
  'pages-sub/user/settings/index',
  'pages-sub/user/wallet/index',
  'pages-sub/auth/real-name/index',
  'pages-sub/auth/shop-auth/index',
];

const LOGIN_PAGE = '/pages-sub/user/login/index';
const REDIRECT_URL_KEY = 'redirectUrl';

const PAGE_CONFIGS: Record<string, PageConfig> = {
  'pages/index/index': { level: 0, name: '首页' },
  'pages/follow/index': { level: 0, name: '关注' },
  'pages/message/index': { level: 0, name: '消息' },
  'pages/my/index': { level: 0, name: '我的' },
  'pages/publish/placeholder': { level: 0, name: '发布占位' },

  'pages-sub/search/index': { level: 1, group: 'search', name: '搜索' },
  'pages-sub/search/entry': { level: 1, group: 'search', name: '搜索入口' },
  'pages-sub/search/result': { level: 2, group: 'search-result', name: '搜索结果' },
  'pages-sub/search/category': { level: 1, group: 'category', name: '找产品' },
  'pages-sub/trade/product/list': { level: 1, group: 'product-list', name: '商品列表' },
  'pages-sub/trade/cart/index': { level: 1, group: 'cart', name: '购物车' },
  'pages-sub/trade/order/list': { level: 1, group: 'order-list', name: '订单列表' },
  'pages-sub/seller/goods/list': { level: 1, group: 'goods-manage', name: '商品管理' },
  'pages-sub/seller/after-sale/list': { level: 1, group: 'after-sale-list', name: '售后管理' },
  'pages-sub/seller/shop/index': { level: 1, group: 'shop', name: '我的店铺' },
  'pages-sub/user/address/list': { level: 1, group: 'address-list', name: '收货地址' },
  'pages-sub/user/collection/index': { level: 1, group: 'collection', name: '我的收藏' },
  'pages-sub/user/history/index': { level: 1, group: 'history', name: '浏览足迹' },
  'pages-sub/user/settings/index': { level: 1, group: 'settings', name: '设置' },
  'pages-sub/user/theme/index': { level: 1, group: 'theme', name: '主题设置' },
  'pages-sub/user/wallet/index': { level: 1, group: 'wallet', name: '我的钱包' },
  'pages-sub/content/topic/index': { level: 1, group: 'topic', name: '话题' },
  'pages-sub/auth/real-name/index': { level: 1, group: 'auth', name: '实名认证' },
  'pages-sub/auth/shop-auth/index': { level: 1, group: 'auth', name: '店铺认证' },
  'pages-sub/user/login/index': { level: 1, group: 'login', name: '登录' },

  'pages-sub/trade/product/detail': { level: 2, group: 'product-detail', name: '商品详情' },
  'pages-sub/trade/order/detail': { level: 2, group: 'order-detail', name: '订单详情' },
  'pages-sub/trade/order/confirm': { level: 2, group: 'order-confirm', name: '确认订单' },
  'pages-sub/trade/evaluate/index': { level: 2, group: 'evaluate', name: '评价' },
  'pages-sub/seller/after-sale/detail': { level: 2, group: 'after-sale-detail', name: '售后详情' },
  'pages-sub/content/post/detail': { level: 2, group: 'post-detail', name: '帖子详情' },
  'pages-sub/content/forum/detail': { level: 2, group: 'forum-detail', name: '论坛详情' },
  'pages-sub/content/user/index': { level: 2, group: 'user-profile', name: 'Ta的主页' },
  'pages-sub/seller/shop/manage': { level: 2, group: 'shop-manage', name: '店铺管理' },

  'pages-sub/trade/pay/index': { level: 3, group: 'pay', name: '支付' },
  'pages-sub/seller/publish/entry': { level: 3, group: 'publish', name: '发布闲置' },
  'pages-sub/seller/goods/edit': { level: 3, group: 'goods-edit', name: '编辑商品' },
  'pages-sub/content/post/publish': { level: 3, group: 'post-publish', name: '发布帖子' },
  'pages-sub/user/address/edit': { level: 3, group: 'address-edit', name: '编辑地址' },
};

const TAB_PAGES = [
  '/pages/index/index',
  '/pages/follow/index',
  '/pages/message/index',
  '/pages/my/index'
];

function normalizeRoute(route: string): string {
  if (route.startsWith('/')) {
    return route.slice(1);
  }
  return route;
}

function isAuthRequired(url: string): boolean {
  const normalizedRoute = normalizeRoute(url);
  return AUTH_REQUIRED_PAGES.some(page => normalizedRoute.includes(page));
}

function isLoggedIn(): boolean {
  return !!uni.getStorageSync('token');
}

function redirectToLogin(targetUrl: string): void {
  uni.setStorageSync(REDIRECT_URL_KEY, targetUrl);
  uni.navigateTo({ url: LOGIN_PAGE });
}

export function getPageConfig(route: string): PageConfig | undefined {
  const normalizedRoute = normalizeRoute(route);
  return PAGE_CONFIGS[normalizedRoute];
}

export function getPageLevel(route: string): PageLevel {
  const config = getPageConfig(route);
  return config?.level ?? 1;
}

export function getPageGroup(route: string): string | undefined {
  const config = getPageConfig(route);
  return config?.group;
}

export function isTabPage(route: string): boolean {
  const normalizedRoute = normalizeRoute(route);
  return TAB_PAGES.includes('/' + normalizedRoute);
}

export function getCurrentPage(): UniApp.Page | null {
  const pages = getCurrentPages();
  return pages.length > 0 ? pages[pages.length - 1] : null;
}

export function getCurrentPageRoute(): string {
  const page = getCurrentPage();
  return page?.route || '';
}

export function getPageStack(): UniApp.Page[] {
  return getCurrentPages();
}

export function getStackDepth(): number {
  return getCurrentPages().length;
}

export function smartBack(options: NavigationOptions = {}): void {
  const {
    skipSameGroup = true,
    skipSameLevel = false,
    targetLevel,
    fallbackUrl = '/pages/index/index'
  } = options;

  const pages = getCurrentPages();

  if (pages.length <= 1) {
    switchToTab(fallbackUrl);
    return;
  }

  const currentPage = pages[pages.length - 1];
  const currentRoute = currentPage.route || '';
  const currentLevel = getPageLevel(currentRoute);
  const currentGroup = getPageGroup(currentRoute);

  if (typeof targetLevel === 'number') {
    for (let i = pages.length - 2; i >= 0; i--) {
      const targetRoute = pages[i].route || '';
      const level = getPageLevel(targetRoute);

      if (level <= targetLevel) {
        const delta = pages.length - 1 - i;
        uni.navigateBack({ delta });
        return;
      }
    }
    switchToTab(fallbackUrl);
    return;
  }

  for (let i = pages.length - 2; i >= 0; i--) {
    const targetRoute = pages[i].route || '';
    const targetLevelInStack = getPageLevel(targetRoute);
    const targetGroup = getPageGroup(targetRoute);

    if (skipSameLevel && targetLevelInStack === currentLevel) {
      continue;
    }

    if (skipSameGroup && currentGroup && targetGroup === currentGroup) {
      continue;
    }

    if (targetLevelInStack < currentLevel) {
      const delta = pages.length - 1 - i;
      uni.navigateBack({ delta });
      return;
    }
  }

  const firstPage = pages[0];
  const firstRoute = firstPage?.route || '';

  if (isTabPage(firstRoute)) {
    switchToTab('/' + firstRoute);
  } else {
    switchToTab(fallbackUrl);
  }
}

export function backToLevel(targetLevel: PageLevel): void {
  smartBack({ targetLevel });
}

export function backToPreviousLevel(): void {
  const currentRoute = getCurrentPageRoute();
  const currentLevel = getPageLevel(currentRoute);

  if (currentLevel > 0) {
    backToLevel((currentLevel - 1) as PageLevel);
  } else {
    smartBack();
  }
}

export function backToHome(): void {
  switchToTab('/pages/index/index');
}

export function switchToTab(url: string): void {
  const normalizedUrl = url.startsWith('/') ? url : '/' + url;

  if (isAuthRequired(normalizedUrl) && !isLoggedIn()) {
    redirectToLogin(normalizedUrl);
    return;
  }

  uni.switchTab({ url: normalizedUrl });
}

export function navigateTo(url: string): void {
  const normalizedUrl = url.startsWith('/') ? url : '/' + url;

  if (isAuthRequired(normalizedUrl) && !isLoggedIn()) {
    redirectToLogin(normalizedUrl);
    return;
  }

  uni.navigateTo({ url: normalizedUrl });
}

export function redirectTo(url: string): void {
  const normalizedUrl = url.startsWith('/') ? url : '/' + url;

  if (isAuthRequired(normalizedUrl) && !isLoggedIn()) {
    redirectToLogin(normalizedUrl);
    return;
  }

  uni.redirectTo({ url: normalizedUrl });
}

export function reLaunch(url: string): void {
  const normalizedUrl = url.startsWith('/') ? url : '/' + url;

  if (isAuthRequired(normalizedUrl) && !isLoggedIn()) {
    uni.setStorageSync(REDIRECT_URL_KEY, normalizedUrl);
    uni.reLaunch({ url: LOGIN_PAGE });
    return;
  }

  uni.reLaunch({ url: normalizedUrl });
}

export function navigateBack(delta: number = 1): void {
  const pages = getCurrentPages();

  if (pages.length <= delta) {
    switchToTab('/pages/index/index');
    return;
  }

  uni.navigateBack({ delta });
}

export function canNavigateBack(): boolean {
  return getStackDepth() > 1;
}

export function navigateWithReplace(url: string, replaceIfSameLevel: boolean = true): void {
  if (!replaceIfSameLevel) {
    navigateTo(url);
    return;
  }

  const currentRoute = getCurrentPageRoute();
  const currentLevel = getPageLevel(currentRoute);

  const targetConfig = getPageConfig(url);
  const targetLevel = targetConfig?.level ?? 1;

  if (currentLevel === targetLevel && currentLevel >= 1) {
    redirectTo(url);
  } else {
    navigateTo(url);
  }
}

export function getPreviousPage(): UniApp.Page | null {
  const pages = getCurrentPages();
  return pages.length > 1 ? pages[pages.length - 2] : null;
}

export function getPreviousPageRoute(): string {
  const prevPage = getPreviousPage();
  return prevPage?.route || '';
}

export function handleRedirectAfterLogin(): void {
  const redirectUrl = uni.getStorageSync(REDIRECT_URL_KEY);
  uni.removeStorageSync(REDIRECT_URL_KEY);

  if (redirectUrl) {
    const normalizedUrl = redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl;
    if (isTabPage(normalizedUrl)) {
      uni.switchTab({ url: normalizedUrl });
    } else {
      uni.redirectTo({ url: normalizedUrl });
    }
  } else {
    uni.switchTab({ url: '/pages/index/index' });
  }
}

export const navigation = {
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
  handleRedirectAfterLogin
};

export default navigation;
