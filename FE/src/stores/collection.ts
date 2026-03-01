import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type CollectionType = 'product' | 'shop' | 'topic' | 'article';

export type CollectionFolder = 'default' | 'wish' | 'watch' | 'custom';

export interface CollectionItem {
  id: string;
  targetId: string;
  type: CollectionType;
  folder: CollectionFolder;
  folderName?: string;
  title: string;
  cover: string;
  price?: number;
  originalPrice?: number;
  extra?: {
    brand?: string;
    category?: string;
    status?: string;
    shopName?: string;
    shopAvatar?: string;
    followerCount?: number;
    productCount?: number;
  };
  isNotified: boolean;
  note: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFolderInfo {
  id: CollectionFolder | string;
  name: string;
  icon: string;
  count: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PriceDropAlert {
  collectionId: string;
  targetId: string;
  type: CollectionType;
  title: string;
  cover: string;
  originalPrice: number;
  currentPrice: number;
  dropRate: number;
  createdAt: string;
}

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<CollectionItem[]>([]);
  const folders = ref<CollectionFolderInfo[]>([
    {
      id: 'default',
      name: '全部收藏',
      icon: 'star',
      count: 0,
      isDefault: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'wish',
      name: '心愿单',
      icon: 'heart',
      count: 0,
      isDefault: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'watch',
      name: '关注店铺',
      icon: 'shop',
      count: 0,
      isDefault: true,
      createdAt: new Date().toISOString()
    }
  ]);
  const priceDropAlerts = ref<PriceDropAlert[]>([]);
  const currentFolder = ref<CollectionFolder | string>('default');

  const totalCollectionCount = computed(() => collections.value.length);

  const productCollections = computed(() => 
    collections.value.filter(c => c.type === 'product')
  );

  const shopCollections = computed(() => 
    collections.value.filter(c => c.type === 'shop')
  );

  const topicCollections = computed(() => 
    collections.value.filter(c => c.type === 'topic')
  );

  const currentFolderCollections = computed(() => {
    if (currentFolder.value === 'default') {
      return collections.value;
    }
    return collections.value.filter(c => c.folder === currentFolder.value);
  });

  const folderCounts = computed(() => {
    const counts: Record<string, number> = {
      default: collections.value.length
    };
    
    collections.value.forEach(c => {
      counts[c.folder] = (counts[c.folder] || 0) + 1;
    });
    
    return counts;
  });

  const isCollected = (targetId: string, type: CollectionType) => 
    collections.value.some(c => c.targetId === targetId && c.type === type);

  const getCollectionItem = (targetId: string, type: CollectionType) => 
    collections.value.find(c => c.targetId === targetId && c.type === type);

  const addCollection = (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existing = getCollectionItem(item.targetId, item.type);
    
    if (existing) {
      return existing;
    }

    const newItem: CollectionItem = {
      ...item,
      id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    collections.value.unshift(newItem);
    updateFolderCount();
    saveToStorage();
    
    return newItem;
  };

  const removeCollection = (targetId: string, type: CollectionType) => {
    const index = collections.value.findIndex(
      c => c.targetId === targetId && c.type === type
    );
    
    if (index > -1) {
      collections.value.splice(index, 1);
      updateFolderCount();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const removeCollectionById = (id: string) => {
    const index = collections.value.findIndex(c => c.id === id);
    
    if (index > -1) {
      collections.value.splice(index, 1);
      updateFolderCount();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const toggleCollection = (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
    if (isCollected(item.targetId, item.type)) {
      removeCollection(item.targetId, item.type);
      return false;
    } else {
      addCollection(item);
      return true;
    }
  };

  const moveCollection = (collectionId: string, folder: CollectionFolder | string) => {
    const item = collections.value.find(c => c.id === collectionId);
    
    if (item) {
      item.folder = folder;
      item.updatedAt = new Date().toISOString();
      updateFolderCount();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const updateCollectionNote = (collectionId: string, note: string) => {
    const item = collections.value.find(c => c.id === collectionId);
    
    if (item) {
      item.note = note;
      item.updatedAt = new Date().toISOString();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const addCollectionTag = (collectionId: string, tag: string) => {
    const item = collections.value.find(c => c.id === collectionId);
    
    if (item && !item.tags.includes(tag)) {
      item.tags.push(tag);
      item.updatedAt = new Date().toISOString();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const removeCollectionTag = (collectionId: string, tag: string) => {
    const item = collections.value.find(c => c.id === collectionId);
    
    if (item) {
      item.tags = item.tags.filter(t => t !== tag);
      item.updatedAt = new Date().toISOString();
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const toggleNotification = (collectionId: string) => {
    const item = collections.value.find(c => c.id === collectionId);
    
    if (item) {
      item.isNotified = !item.isNotified;
      item.updatedAt = new Date().toISOString();
      saveToStorage();
      return item.isNotified;
    }
    
    return false;
  };

  const setCurrentFolder = (folder: CollectionFolder | string) => {
    currentFolder.value = folder;
  };

  const addFolder = (name: string, icon: string = 'folder') => {
    const newFolder: CollectionFolderInfo = {
      id: `custom-${Date.now()}`,
      name,
      icon,
      count: 0,
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    
    folders.value.push(newFolder);
    saveToStorage();
    
    return newFolder;
  };

  const removeFolder = (folderId: string) => {
    if (folders.value.find(f => f.id === folderId)?.isDefault) {
      return false;
    }

    collections.value.forEach(c => {
      if (c.folder === folderId) {
        c.folder = 'default';
      }
    });
    
    folders.value = folders.value.filter(f => f.id !== folderId);
    updateFolderCount();
    saveToStorage();
    
    return true;
  };

  const renameFolder = (folderId: string, name: string) => {
    const folder = folders.value.find(f => f.id === folderId);
    
    if (folder && !folder.isDefault) {
      folder.name = name;
      saveToStorage();
      return true;
    }
    
    return false;
  };

  const updateFolderCount = () => {
    folders.value.forEach(f => {
      if (f.id === 'default') {
        f.count = collections.value.length;
      } else {
        f.count = collections.value.filter(c => c.folder === f.id).length;
      }
    });
  };

  const addPriceDropAlert = (alert: Omit<PriceDropAlert, 'createdAt'>) => {
    const newAlert: PriceDropAlert = {
      ...alert,
      createdAt: new Date().toISOString()
    };
    
    priceDropAlerts.value.unshift(newAlert);
  };

  const clearPriceDropAlert = (collectionId: string) => {
    priceDropAlerts.value = priceDropAlerts.value.filter(
      a => a.collectionId !== collectionId
    );
  };

  const clearAllPriceDropAlerts = () => {
    priceDropAlerts.value = [];
  };

  const clearFolder = (folderId: string) => {
    if (folderId === 'default') {
      collections.value = [];
    } else {
      collections.value = collections.value.filter(c => c.folder !== folderId);
    }
    updateFolderCount();
    saveToStorage();
  };

  const clearAllCollections = () => {
    collections.value = [];
    priceDropAlerts.value = [];
    updateFolderCount();
    saveToStorage();
  };

  const searchCollections = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase();
    return collections.value.filter(c => 
      c.title.toLowerCase().includes(lowerKeyword) ||
      c.tags.some(t => t.toLowerCase().includes(lowerKeyword)) ||
      c.note.toLowerCase().includes(lowerKeyword)
    );
  };

  const getCollectionsByTag = (tag: string) => 
    collections.value.filter(c => c.tags.includes(tag));

  const loadFromStorage = () => {
    const storedCollections = uni.getStorageSync('collections');
    if (storedCollections) {
      collections.value = storedCollections;
    }
    
    const storedFolders = uni.getStorageSync('collection_folders');
    if (storedFolders) {
      folders.value = storedFolders;
    }
    
    const storedAlerts = uni.getStorageSync('price_drop_alerts');
    if (storedAlerts) {
      priceDropAlerts.value = storedAlerts;
    }
    
    updateFolderCount();
  };

  const saveToStorage = () => {
    uni.setStorageSync('collections', collections.value);
    uni.setStorageSync('collection_folders', folders.value);
    uni.setStorageSync('price_drop_alerts', priceDropAlerts.value);
  };

  loadFromStorage();

  return {
    collections,
    folders,
    priceDropAlerts,
    currentFolder,
    totalCollectionCount,
    productCollections,
    shopCollections,
    topicCollections,
    currentFolderCollections,
    folderCounts,
    isCollected,
    getCollectionItem,
    addCollection,
    removeCollection,
    removeCollectionById,
    toggleCollection,
    moveCollection,
    updateCollectionNote,
    addCollectionTag,
    removeCollectionTag,
    toggleNotification,
    setCurrentFolder,
    addFolder,
    removeFolder,
    renameFolder,
    updateFolderCount,
    addPriceDropAlert,
    clearPriceDropAlert,
    clearAllPriceDropAlerts,
    clearFolder,
    clearAllCollections,
    searchCollections,
    getCollectionsByTag,
    loadFromStorage,
    saveToStorage
  };
});
