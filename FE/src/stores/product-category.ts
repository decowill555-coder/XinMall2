import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoryApi, type DeviceCategory, type AlphabetCategory, type CategoryItem } from '@/api/category';

const DEFAULT_DEVICE_CATEGORIES: DeviceCategory[] = [
  { id: '1', name: '手机', icon: 'phone', productCount: 12580 },
  { id: '2', name: '笔记本', icon: 'laptop', productCount: 8960 },
  { id: '3', name: '平板', icon: 'tablet', productCount: 5620 },
  { id: '4', name: '台式机', icon: 'desktop', productCount: 3280 },
  { id: '5', name: '相机', icon: 'camera', productCount: 4560 },
  { id: '6', name: '耳机', icon: 'headphone', productCount: 7890 },
  { id: '7', name: '手表', icon: 'watch', productCount: 3420 },
  { id: '8', name: '游戏机', icon: 'game', productCount: 2890 },
  { id: '9', name: '音箱', icon: 'speaker', productCount: 2340 },
  { id: '10', name: '键盘', icon: 'keyboard', productCount: 4560 },
  { id: '11', name: '鼠标', icon: 'mouse', productCount: 5670 },
  { id: '12', name: '显示器', icon: 'monitor', productCount: 3210 }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const useProductCategoryStore = defineStore('product-category', () => {
  const deviceCategories = ref<DeviceCategory[]>([]);
  const allCategories = ref<AlphabetCategory[]>([]);
  const currentLetter = ref<string>('A');
  const loading = ref(false);
  const categoriesLoading = ref(false);

  const availableLetters = computed(() => {
    return allCategories.value
      .filter(ac => ac.categories.length > 0)
      .map(ac => ac.letter);
  });

  const fetchDeviceCategories = async () => {
    loading.value = true;
    try {
      const res = await categoryApi.getDeviceCategories();
      deviceCategories.value = res.length > 0 ? res : DEFAULT_DEVICE_CATEGORIES;
    } catch {
      deviceCategories.value = DEFAULT_DEVICE_CATEGORIES;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllCategories = async () => {
    categoriesLoading.value = true;
    try {
      const res = await categoryApi.getAllCategories();
      allCategories.value = res;
    } catch {
      allCategories.value = generateMockCategories();
    } finally {
      categoriesLoading.value = false;
    }
  };

  const setCurrentLetter = (letter: string) => {
    currentLetter.value = letter.toUpperCase();
  };

  const getCategoriesByLetter = (letter: string) => {
    const found = allCategories.value.find(ac => ac.letter === letter.toUpperCase());
    return found?.categories ?? [];
  };

  return {
    deviceCategories,
    allCategories,
    currentLetter,
    loading,
    categoriesLoading,
    availableLetters,
    fetchDeviceCategories,
    fetchAllCategories,
    setCurrentLetter,
    getCategoriesByLetter
  };
});

function generateMockCategories(): AlphabetCategory[] {
  const mockData: Record<string, CategoryItem[]> = {
    'A': [
      { id: 'a1', name: '按摩器', productCount: 120, letter: 'A' },
      { id: 'a2', name: '按摩椅', productCount: 85, letter: 'A' }
    ],
    'B': [
      { id: 'b1', name: '笔记本电脑', productCount: 8960, letter: 'B' },
      { id: 'b2', name: '冰箱', productCount: 320, letter: 'B' },
      { id: 'b3', name: '蓝牙音箱', productCount: 1560, letter: 'B' }
    ],
    'C': [
      { id: 'c1', name: '打印机', productCount: 450, letter: 'C' },
      { id: 'c2', name: '存储卡', productCount: 890, letter: 'C' }
    ],
    'D': [
      { id: 'd1', name: '电脑配件', productCount: 2340, letter: 'D' },
      { id: 'd2', name: '电源适配器', productCount: 560, letter: 'D' }
    ],
    'E': [
      { id: 'e1', name: '耳机', productCount: 7890, letter: 'E' },
      { id: 'e2', name: '耳麦', productCount: 1230, letter: 'E' }
    ],
    'F': [
      { id: 'f1', name: '服务器', productCount: 180, letter: 'F' }
    ],
    'G': [
      { id: 'g1', name: '显卡', productCount: 3450, letter: 'G' },
      { id: 'g2', name: '游戏机', productCount: 2890, letter: 'G' }
    ],
    'H': [
      { id: 'h1', name: '硬盘', productCount: 2680, letter: 'H' },
      { id: 'h2', name: '路由器', productCount: 1890, letter: 'H' }
    ],
    'I': [
      { id: 'i1', name: 'iPad', productCount: 5620, letter: 'I' },
      { id: 'i2', name: 'iPhone', productCount: 12580, letter: 'I' }
    ],
    'J': [
      { id: 'j1', name: '键盘', productCount: 4560, letter: 'J' }
    ],
    'K': [
      { id: 'k1', name: '扩展坞', productCount: 890, letter: 'K' }
    ],
    'L': [
      { id: 'l1', name: '路由器', productCount: 1890, letter: 'L' }
    ],
    'M': [
      { id: 'm1', name: '鼠标', productCount: 5670, letter: 'M' },
      { id: 'm2', name: '显示器', productCount: 3210, letter: 'M' }
    ],
    'N': [
      { id: 'n1', name: '内存条', productCount: 2340, letter: 'N' }
    ],
    'P': [
      { id: 'p1', name: '平板电脑', productCount: 5620, letter: 'P' },
      { id: 'p2', name: '投影仪', productCount: 780, letter: 'P' }
    ],
    'Q': [
      { id: 'q1', name: '驱动器', productCount: 340, letter: 'Q' }
    ],
    'S': [
      { id: 's1', name: '手机', productCount: 12580, letter: 'S' },
      { id: 's2', name: '摄像头', productCount: 1230, letter: 'S' },
      { id: 's3', name: '手写板', productCount: 450, letter: 'S' }
    ],
    'T': [
      { id: 't1', name: '台式机', productCount: 3280, letter: 'T' },
      { id: 't2', name: '投影仪', productCount: 780, letter: 'T' }
    ],
    'U': [
      { id: 'u1', name: 'U盘', productCount: 1890, letter: 'U' }
    ],
    'W': [
      { id: 'w1', name: '网络设备', productCount: 1560, letter: 'W' },
      { id: 'w2', name: '外置光驱', productCount: 230, letter: 'W' }
    ],
    'X': [
      { id: 'x1', name: '显卡', productCount: 3450, letter: 'X' }
    ],
    'Y': [
      { id: 'y1', name: '硬盘盒', productCount: 560, letter: 'Y' }
    ],
    'Z': [
      { id: 'z1', name: '主板', productCount: 1890, letter: 'Z' },
      { id: 'z2', name: '智能手表', productCount: 3420, letter: 'Z' }
    ]
  };

  return ALPHABET.map(letter => ({
    letter,
    categories: mockData[letter] || []
  }));
}
