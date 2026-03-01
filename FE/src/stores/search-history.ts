import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type SearchType = 'product' | 'shop' | 'brand' | 'topic';

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  type: SearchType;
  count: number;
  lastSearchedAt: string;
  createdAt: string;
}

export interface HotSearchItem {
  id: string;
  keyword: string;
  rank: number;
  heat: number;
  trend: 'up' | 'down' | 'stable';
  type: 'hot' | 'new' | 'recommend';
}

export interface SearchSuggestion {
  keyword: string;
  matchType: 'prefix' | 'fuzzy' | 'related';
  count?: number;
}

const MAX_HISTORY_COUNT = 20;

export const useSearchHistoryStore = defineStore('search-history', () => {
  const history = ref<SearchHistoryItem[]>([]);
  const hotSearches = ref<HotSearchItem[]>([]);
  const suggestions = ref<SearchSuggestion[]>([]);
  const currentKeyword = ref<string>('');
  const isSearching = ref(false);

  const recentHistory = computed(() => 
    [...history.value]
      .sort((a, b) => new Date(b.lastSearchedAt).getTime() - new Date(a.lastSearchedAt).getTime())
      .slice(0, 10)
  );

  const frequentHistory = computed(() => 
    [...history.value]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  );

  const hotKeywords = computed(() => 
    hotSearches.value
      .filter(h => h.type === 'hot')
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10)
  );

  const newKeywords = computed(() => 
    hotSearches.value
      .filter(h => h.type === 'new')
      .slice(0, 5)
  );

  const hasHistory = computed(() => history.value.length > 0);

  const addHistory = (keyword: string, type: SearchType = 'product') => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    const existing = history.value.find(
      h => h.keyword.toLowerCase() === trimmedKeyword.toLowerCase()
    );

    if (existing) {
      existing.count += 1;
      existing.lastSearchedAt = new Date().toISOString();
      existing.type = type;
    } else {
      const newItem: SearchHistoryItem = {
        id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        keyword: trimmedKeyword,
        type,
        count: 1,
        lastSearchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      history.value.unshift(newItem);

      if (history.value.length > MAX_HISTORY_COUNT) {
        history.value = history.value.slice(0, MAX_HISTORY_COUNT);
      }
    }

    currentKeyword.value = trimmedKeyword;
    saveToStorage();
  };

  const removeHistory = (id: string) => {
    history.value = history.value.filter(h => h.id !== id);
    saveToStorage();
  };

  const removeHistoryByKeyword = (keyword: string) => {
    history.value = history.value.filter(
      h => h.keyword.toLowerCase() !== keyword.toLowerCase()
    );
    saveToStorage();
  };

  const clearHistory = () => {
    history.value = [];
    saveToStorage();
  };

  const setHotSearches = (list: HotSearchItem[]) => {
    hotSearches.value = list;
  };

  const setSuggestions = (list: SearchSuggestion[]) => {
    suggestions.value = list;
  };

  const clearSuggestions = () => {
    suggestions.value = [];
  };

  const setCurrentKeyword = (keyword: string) => {
    currentKeyword.value = keyword;
  };

  const setSearching = (searching: boolean) => {
    isSearching.value = searching;
  };

  const getHistoryByType = (type: SearchType) => 
    history.value.filter(h => h.type === type);

  const searchInHistory = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return history.value.filter(h => 
      h.keyword.toLowerCase().includes(lowerKeyword)
    );
  };

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('search_history');
    if (stored) {
      history.value = stored;
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('search_history', history.value);
  };

  const exportHistory = () => {
    return JSON.stringify(history.value);
  };

  const importHistory = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        history.value = parsed;
        saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Failed to import search history:', e);
    }
    return false;
  };

  loadFromStorage();

  return {
    history,
    hotSearches,
    suggestions,
    currentKeyword,
    isSearching,
    recentHistory,
    frequentHistory,
    hotKeywords,
    newKeywords,
    hasHistory,
    addHistory,
    removeHistory,
    removeHistoryByKeyword,
    clearHistory,
    setHotSearches,
    setSuggestions,
    clearSuggestions,
    setCurrentKeyword,
    setSearching,
    getHistoryByType,
    searchInHistory,
    loadFromStorage,
    saveToStorage,
    exportHistory,
    importHistory
  };
});
