import { useUserStore } from './user';
import { useChatStore } from './chat';
import { useSearchHistoryStore } from './search-history';
import { useAppStore } from './app';
import { useCollectionStore } from './collection';
import { useSessionStore } from './session';
import { useAuthStore } from './auth';
import { useThemeStore } from './theme';

export {
  useUserStore,
  useChatStore,
  useSearchHistoryStore,
  useAppStore,
  useCollectionStore,
  useSessionStore,
  useAuthStore,
  useThemeStore
};

export const stores = {
  user: useUserStore,
  chat: useChatStore,
  searchHistory: useSearchHistoryStore,
  app: useAppStore,
  collection: useCollectionStore,
  session: useSessionStore,
  auth: useAuthStore,
  theme: useThemeStore
};
