import { useUserStore } from './user';
import { useChatStore } from './chat';
import { useSearchHistoryStore } from './search-history';
import { useSearchFilterStore } from './search-filter';
import { useAppStore } from './app';
import { useCollectionStore } from './collection';
import { useSessionStore } from './session';
import { useAuthStore } from './auth';
import { useThemeStore } from './theme';
import { useCartStore } from './cart';
import { useOrderStore } from './order';
import { useProductDetailStore } from './product-detail';
import { usePublishStore } from './publish';

export {
  useUserStore,
  useChatStore,
  useSearchHistoryStore,
  useSearchFilterStore,
  useAppStore,
  useCollectionStore,
  useSessionStore,
  useAuthStore,
  useThemeStore,
  useCartStore,
  useOrderStore,
  useProductDetailStore,
  usePublishStore
};

export const stores = {
  user: useUserStore,
  chat: useChatStore,
  searchHistory: useSearchHistoryStore,
  searchFilter: useSearchFilterStore,
  app: useAppStore,
  collection: useCollectionStore,
  session: useSessionStore,
  auth: useAuthStore,
  theme: useThemeStore,
  cart: useCartStore,
  order: useOrderStore,
  productDetail: useProductDetailStore,
  publish: usePublishStore
};
