import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'green' | 'orange' | 'pink';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  gradient: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'small' | 'medium' | 'large';
  animationEnabled: boolean;
  glassEffectEnabled: boolean;
  highContrast: boolean;
}

const THEME_COLORS: Record<ThemeColor, ThemeColors> = {
  emerald: {
    primary: '#1ABC9C',
    primaryLight: '#E8F8F5',
    primaryDark: '#16A085',
    gradient: 'linear-gradient(135deg, #1ABC9C 0%, #10AC84 100%)'
  },
  blue: {
    primary: '#2979FF',
    primaryLight: '#E3F2FD',
    primaryDark: '#1565C0',
    gradient: 'linear-gradient(135deg, #2979FF 0%, #7C4DFF 100%)'
  },
  purple: {
    primary: '#7C4DFF',
    primaryLight: '#EDE7F6',
    primaryDark: '#651FFF',
    gradient: 'linear-gradient(135deg, #7C4DFF 0%, #E040FB 100%)'
  },
  green: {
    primary: '#00C853',
    primaryLight: '#E8F5E9',
    primaryDark: '#00A844',
    gradient: 'linear-gradient(135deg, #00C853 0%, #00BFA5 100%)'
  },
  orange: {
    primary: '#FF6D00',
    primaryLight: '#FFF3E0',
    primaryDark: '#E65100',
    gradient: 'linear-gradient(135deg, #FF6D00 0%, #FFAB00 100%)'
  },
  pink: {
    primary: '#FF4081',
    primaryLight: '#FCE4EC',
    primaryDark: '#C51162',
    gradient: 'linear-gradient(135deg, #FF4081 0%, #F50057 100%)'
  }
};

const FONT_SIZE_MAP = {
  small: { base: 28, ratio: 0.9 },
  medium: { base: 32, ratio: 1 },
  large: { base: 36, ratio: 1.1 }
};

const BORDER_RADIUS_MAP = {
  small: { sm: 4, md: 8, lg: 12 },
  medium: { sm: 8, md: 16, lg: 24 },
  large: { sm: 12, md: 24, lg: 32 }
};

export const useThemeStore = defineStore('theme', () => {
  const config = ref<ThemeConfig>({
    mode: 'light',
    color: 'blue',
    fontSize: 'medium',
    borderRadius: 'medium',
    animationEnabled: true,
    glassEffectEnabled: true,
    highContrast: false
  });

  const systemTheme = ref<'light' | 'dark'>('light');
  const isTransitioning = ref(false);

  const currentMode = computed(() => {
    if (config.value.mode === 'system') {
      return systemTheme.value;
    }
    return config.value.mode;
  });

  const isDark = computed(() => currentMode.value === 'dark');
  const isLight = computed(() => currentMode.value === 'light');

  const currentColors = computed(() => THEME_COLORS[config.value.color]);

  const currentFontSize = computed(() => FONT_SIZE_MAP[config.value.fontSize]);

  const currentBorderRadius = computed(() => 
    BORDER_RADIUS_MAP[config.value.borderRadius]
  );

  const themeVars = computed(() => {
    const colors = currentColors.value;
    const fontSize = currentFontSize.value;
    const radius = currentBorderRadius.value;
    
    return {
      '--color-primary': colors.primary,
      '--color-primary-light': colors.primaryLight,
      '--color-primary-dark': colors.primaryDark,
      '--gradient-primary': colors.gradient,
      
      '--font-size-xs': `${fontSize.base * 0.625 * fontSize.ratio}rpx`,
      '--font-size-sm': `${fontSize.base * 0.75 * fontSize.ratio}rpx`,
      '--font-size-md': `${fontSize.base * fontSize.ratio}rpx`,
      '--font-size-lg': `${fontSize.base * 1.25 * fontSize.ratio}rpx`,
      '--font-size-xl': `${fontSize.base * 1.5 * fontSize.ratio}rpx`,
      
      '--radius-sm': `${radius.sm}rpx`,
      '--radius-md': `${radius.md}rpx`,
      '--radius-lg': `${radius.lg}rpx`,
      
      '--animation-duration': config.value.animationEnabled ? '0.3s' : '0s',
      '--glass-blur': config.value.glassEffectEnabled ? '16px' : '0px'
    };
  });

  const darkModeVars = computed(() => {
    if (!isDark.value) return {};
    
    return {
      '--color-bg-page': '#121212',
      '--color-bg-white': '#1E1E1E',
      '--color-bg-gray': '#2D2D2D',
      '--color-text-main': '#FFFFFF',
      '--color-text-sub': '#B0B0B0',
      '--color-text-disabled': '#6E6E6E',
      '--color-border': 'rgba(255, 255, 255, 0.12)',
      '--color-divider': 'rgba(255, 255, 255, 0.08)',
      '--glass-white-high': 'rgba(30, 30, 30, 0.85)',
      '--glass-white-mid': 'rgba(30, 30, 30, 0.65)',
      '--glass-white-low': 'rgba(30, 30, 30, 0.45)'
    };
  });

  const allThemeVars = computed(() => ({
    ...themeVars.value,
    ...darkModeVars.value
  }));

  const setMode = (mode: ThemeMode) => {
    config.value.mode = mode;
    applyTheme();
    saveToStorage();
  };

  const toggleMode = () => {
    if (config.value.mode === 'light') {
      setMode('dark');
    } else if (config.value.mode === 'dark') {
      setMode('light');
    } else {
      setMode(systemTheme.value === 'light' ? 'dark' : 'light');
    }
  };

  const setColor = (color: ThemeColor) => {
    config.value.color = color;
    applyTheme();
    saveToStorage();
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    config.value.fontSize = size;
    applyTheme();
    saveToStorage();
  };

  const setBorderRadius = (radius: 'small' | 'medium' | 'large') => {
    config.value.borderRadius = radius;
    applyTheme();
    saveToStorage();
  };

  const setAnimationEnabled = (enabled: boolean) => {
    config.value.animationEnabled = enabled;
    applyTheme();
    saveToStorage();
  };

  const setGlassEffectEnabled = (enabled: boolean) => {
    config.value.glassEffectEnabled = enabled;
    applyTheme();
    saveToStorage();
  };

  const setHighContrast = (enabled: boolean) => {
    config.value.highContrast = enabled;
    applyTheme();
    saveToStorage();
  };

  const updateSystemTheme = () => {
    // #ifdef H5
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    systemTheme.value = isDarkMode ? 'dark' : 'light';
    
    if (config.value.mode === 'system') {
      applyTheme();
    }
    // #endif
    
    // #ifndef H5
    const sys = uni.getSystemInfoSync();
    // 小程序和 App 可能没有系统主题 API，默认 light
    systemTheme.value = 'light';
    // #endif
  };

  const applyTheme = () => {
    isTransitioning.value = true;
    
    const vars = allThemeVars.value;
    const root = document?.documentElement || document?.body;
    
    if (root) {
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      
      root.setAttribute('data-theme', currentMode.value);
      root.setAttribute('data-color', config.value.color);
    }
    
    // 设置导航栏颜色
    uni.setNavigationBarColor({
      frontColor: isDark.value ? '#ffffff' : '#000000',
      backgroundColor: isDark.value ? '#1E1E1E' : '#FFFFFF',
      animation: {
        duration: 300,
        timingFunc: 'easeInOut'
      }
    });
    
    setTimeout(() => {
      isTransitioning.value = false;
    }, 300);
  };

  const initTheme = () => {
    loadFromStorage();
    updateSystemTheme();
    applyTheme();
    
    // #ifdef H5
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateSystemTheme);
    // #endif
  };

  const resetTheme = () => {
    config.value = {
      mode: 'light',
      color: 'blue',
      fontSize: 'medium',
      borderRadius: 'medium',
      animationEnabled: true,
      glassEffectEnabled: true,
      highContrast: false
    };
    
    applyTheme();
    saveToStorage();
  };

  const exportTheme = (): string => {
    return JSON.stringify(config.value);
  };

  const importTheme = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data) as ThemeConfig;
      
      if (parsed.mode && parsed.color) {
        config.value = parsed;
        applyTheme();
        saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Failed to import theme:', e);
    }
    return false;
  };

  const getAvailableColors = (): Array<{ key: ThemeColor; name: string; colors: ThemeColors }> => [
    { key: 'blue', name: '科技蓝', colors: THEME_COLORS.blue },
    { key: 'purple', name: '优雅紫', colors: THEME_COLORS.purple },
    { key: 'green', name: '清新绿', colors: THEME_COLORS.green },
    { key: 'orange', name: '活力橙', colors: THEME_COLORS.orange },
    { key: 'pink', name: '浪漫粉', colors: THEME_COLORS.pink }
  ];

  const loadFromStorage = () => {
    const stored = uni.getStorageSync('theme_config');
    if (stored) {
      try {
        config.value = {
          ...config.value,
          ...JSON.parse(stored)
        };
      } catch (e) {
        console.error('Failed to load theme config:', e);
      }
    }
  };

  const saveToStorage = () => {
    uni.setStorageSync('theme_config', JSON.stringify(config.value));
  };

  watch(
    () => config.value,
    () => {
      saveToStorage();
    },
    { deep: true }
  );

  return {
    config,
    systemTheme,
    isTransitioning,
    currentMode,
    isDark,
    isLight,
    currentColors,
    currentFontSize,
    currentBorderRadius,
    themeVars,
    darkModeVars,
    allThemeVars,
    setMode,
    toggleMode,
    setColor,
    setFontSize,
    setBorderRadius,
    setAnimationEnabled,
    setGlassEffectEnabled,
    setHighContrast,
    updateSystemTheme,
    applyTheme,
    initTheme,
    resetTheme,
    exportTheme,
    importTheme,
    getAvailableColors,
    loadFromStorage,
    saveToStorage
  };
});
