import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'sunset';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  gradient: string;
  success?: string;
  successLight?: string;
  successDark?: string;
  warning?: string;
  warningLight?: string;
  warningDark?: string;
  error?: string;
  errorLight?: string;
  errorDark?: string;
  info?: string;
  infoLight?: string;
  infoDark?: string;
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
  },
  sunset: {
    primary: '#D946EF',
    primaryLight: '#FAE8FF',
    primaryDark: '#A21CAF',
    gradient: 'linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%)',
    success: '#00F5D4',
    successLight: '#E0FFFA',
    successDark: '#00C4AA',
    warning: '#FFD600',
    warningLight: '#FFFBE6',
    warningDark: '#CCAB00',
    error: '#FF2A6D',
    errorLight: '#FFEDF2',
    errorDark: '#D91855',
    info: '#00D2FF',
    infoLight: '#E5FAFF',
    infoDark: '#00A6CC'
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

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
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
      '--color-primary-glass': `rgba(${hexToRgb(colors.primary)}, 0.15)`,
      '--gradient-primary': colors.gradient,
      
      '--color-success': colors.success || '#00C853',
      '--color-success-light': colors.successLight || '#E8F5E9',
      '--color-success-dark': colors.successDark || '#00A844',
      '--color-warning': colors.warning || '#FFAB00',
      '--color-warning-light': colors.warningLight || '#FFF8E1',
      '--color-warning-dark': colors.warningDark || '#E69500',
      '--color-error': colors.error || '#FF3D00',
      '--color-error-light': colors.errorLight || '#FFEBEE',
      '--color-error-dark': colors.errorDark || '#D32F2F',
      '--color-info': colors.info || '#00B8D4',
      '--color-info-light': colors.infoLight || '#E0F7FA',
      '--color-info-dark': colors.infoDark || '#0097A7',
      
      '--font-size-xs': `${fontSize.base * 0.625 * fontSize.ratio}rpx`,
      '--font-size-sm': `${fontSize.base * 0.75 * fontSize.ratio}rpx`,
      '--font-size-md': `${fontSize.base * fontSize.ratio}rpx`,
      '--font-size-lg': `${fontSize.base * 1.25 * fontSize.ratio}rpx`,
      '--font-size-xl': `${fontSize.base * 1.5 * fontSize.ratio}rpx`,
      
      '--radius-sm': `${radius.sm}rpx`,
      '--radius-md': `${radius.md}rpx`,
      '--radius-lg': `${radius.lg}rpx`,
      
      '--animation-duration': config.value.animationEnabled ? '0.4s' : '0s',
      '--glass-blur': config.value.glassEffectEnabled ? '24px' : '0px'
    };
  });

  const lightModeVars = computed(() => {
    if (isDark.value) return {};
    
    return {
      '--color-bg-page': '#FFF5F2',
      '--color-bg-card': 'rgba(255, 255, 255, 0.65)',
      '--color-bg-white': '#FFFFFF',
      '--color-bg-gray': '#FAF8F7',
      '--color-bg-glass': 'rgba(255, 255, 255, 0.65)',
      '--color-bg-solid': '#FFFFFF',
      '--color-text-main': '#2C2624',
      '--color-text-sub': '#867A76',
      '--color-text-disabled': '#C4C0BE',
      '--color-text-placeholder': '#A9A5A2',
      '--color-text-white': '#FFFFFF',
      '--color-white': '#FFFFFF',
      '--color-border': 'rgba(44, 38, 36, 0.08)',
      '--color-border-light': 'rgba(44, 38, 36, 0.04)',
      '--color-divider': 'rgba(44, 38, 36, 0.06)',
      '--glass-white-high': 'rgba(255, 255, 255, 0.85)',
      '--glass-white-mid': 'rgba(255, 255, 255, 0.65)',
      '--glass-white-low': 'rgba(255, 255, 255, 0.45)',
      '--glass-crystal': 'rgba(255, 255, 255, 0.25)',
      '--glass-crystal-mid': 'rgba(255, 255, 255, 0.45)',
      '--glass-crystal-high': 'rgba(255, 255, 255, 0.65)',
      '--glass-solid': 'rgba(255, 255, 255, 0.85)',
      '--glass-border-light': 'rgba(255, 255, 255, 0.6)',
      '--glass-border-mid': 'rgba(255, 255, 255, 0.5)',
      '--glass-border-subtle': 'rgba(255, 255, 255, 0.3)',
      '--glass-border-highlight': 'rgba(255, 255, 255, 0.8)',
      '--input-bg': 'rgba(255, 255, 255, 0.65)',
      '--input-border': 'rgba(44, 38, 36, 0.08)',
      '--input-focus-glow': '0 0 15px rgba(255, 106, 0, 0.3)',
      '--shadow-card': '0 8rpx 24rpx rgba(0, 0, 0, 0.04), 0 2rpx 6rpx rgba(0, 0, 0, 0.02)',
      '--shadow-glow-primary': '0 0 25px rgba(255, 106, 0, 0.5)',
      '--color-price': '#FF3B30',
      '--color-price-glow': '0 0 20px rgba(255, 59, 48, 0.4)',
      '--skeleton-from': '#F5F5F5',
      '--skeleton-to': '#FAFAFA',
      '--overlay-bg': 'rgba(0, 0, 0, 0.5)',
      '--tabbar-bg': 'rgba(255, 255, 255, 0.95)',
      '--tabbar-border': 'rgba(0, 0, 0, 0.05)',
      '--tabbar-icon-inactive': '#6B7280',
      '--tabbar-icon-active': '#FF6A00',
      '--tabbar-icon-glow': '0 0 8px rgba(255, 106, 0, 0.6)',
      '--modal-bg': 'rgba(255, 255, 255, 0.95)',
      '--modal-border': 'rgba(0, 0, 0, 0.1)',
      '--tag-hot-bg': 'rgba(255, 106, 0, 0.1)',
      '--tag-hot-text': '#FF6A00',
      '--tag-hot-border': 'rgba(255, 106, 0, 0.2)',
      '--tag-new-bg': 'rgba(52, 199, 89, 0.1)',
      '--tag-new-text': '#34C759',
      '--tag-new-border': 'rgba(52, 199, 89, 0.2)'
    };
  });

  const darkModeVars = computed(() => {
    if (!isDark.value) return {};
    
    return {
      '--color-bg-page': '#0B0A12',
      '--color-bg-card': 'rgba(255, 255, 255, 0.06)',
      '--color-bg-white': '#16161E',
      '--color-bg-gray': '#0F0E16',
      '--color-bg-glass': 'rgba(255, 255, 255, 0.06)',
      '--color-bg-solid': '#16161E',
      
      '--color-text-main': '#F2F2F7',
      '--color-text-sub': '#A1A1AA',
      '--color-text-disabled': '#52525B',
      '--color-text-placeholder': '#6B7280',
      '--color-text-white': '#FFFFFF',
      '--color-white': '#FFFFFF',
      
      '--color-border': 'rgba(255, 255, 255, 0.1)',
      '--color-border-light': 'rgba(255, 255, 255, 0.05)',
      '--color-divider': 'rgba(255, 255, 255, 0.08)',
      
      '--glass-white-high': 'rgba(22, 22, 30, 0.85)',
      '--glass-white-mid': 'rgba(255, 255, 255, 0.06)',
      '--glass-white-low': 'rgba(255, 255, 255, 0.04)',
      '--glass-crystal': 'rgba(255, 255, 255, 0.04)',
      '--glass-crystal-mid': 'rgba(255, 255, 255, 0.06)',
      '--glass-crystal-high': 'rgba(255, 255, 255, 0.08)',
      '--glass-solid': 'rgba(22, 22, 30, 0.90)',
      '--glass-border-light': 'rgba(255, 255, 255, 0.12)',
      '--glass-border-mid': 'rgba(255, 255, 255, 0.1)',
      '--glass-border-subtle': 'rgba(255, 255, 255, 0.08)',
      '--glass-border-highlight': 'rgba(255, 255, 255, 0.25)',
      
      '--input-bg': 'rgba(0, 0, 0, 0.3)',
      '--input-border': 'rgba(255, 255, 255, 0.05)',
      '--input-focus-glow': '0 0 15px rgba(217, 70, 239, 0.3)',
      
      '--shadow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      '--shadow-glow-primary': '0 0 25px rgba(217, 70, 239, 0.5)',
      
      '--color-price': '#FF78E1',
      '--color-price-glow': '0 0 20px rgba(255, 120, 225, 0.6)',
      
      '--skeleton-from': '#1F1F25',
      '--skeleton-to': '#2A2A35',
      
      '--overlay-bg': 'rgba(0, 0, 0, 0.7)',
      
      '--tabbar-bg': 'rgba(20, 20, 30, 0.75)',
      '--tabbar-border': 'rgba(255, 255, 255, 0.1)',
      '--tabbar-icon-inactive': '#6B7280',
      '--tabbar-icon-active': '#D946EF',
      '--tabbar-icon-glow': '0 0 8px rgba(217, 70, 239, 0.6)',
      
      '--modal-bg': 'rgba(30, 25, 35, 0.85)',
      '--modal-border': 'rgba(255, 255, 255, 0.2)',
      
      '--tag-hot-bg': 'rgba(255, 42, 109, 0.2)',
      '--tag-hot-text': '#FF2A6D',
      '--tag-hot-border': 'rgba(255, 42, 109, 0.5)',
      '--tag-new-bg': 'rgba(0, 245, 212, 0.2)',
      '--tag-new-text': '#00F5D4',
      '--tag-new-border': 'rgba(0, 245, 212, 0.5)',
      
      '--gradient-sunset': 'linear-gradient(135deg, #C026D3 0%, #F43F5E 60%, #FF7849 100%)'
    };
  });

  const themeVarsObject = computed(() => {
    return {
      ...themeVars.value,
      ...lightModeVars.value,
      ...darkModeVars.value
    };
  });

  const allThemeVars = computed(() => {
    return Object.entries(themeVarsObject.value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });

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
    systemTheme.value = 'light';
    // #endif
  };

  const applyTheme = () => {
    isTransitioning.value = true;
    
    const vars = themeVarsObject.value;
    
    // #ifdef H5
    const root = document?.documentElement || document?.body;
    
    if (root) {
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      
      root.setAttribute('data-theme', currentMode.value);
      root.setAttribute('data-color', config.value.color);
    }
    // #endif
    
    uni.setNavigationBarColor({
      frontColor: isDark.value ? '#ffffff' : '#000000',
      backgroundColor: isDark.value ? '#0B0A12' : '#FFFFFF',
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
    { key: 'emerald', name: '翡翠绿', colors: THEME_COLORS.emerald },
    { key: 'blue', name: '科技蓝', colors: THEME_COLORS.blue },
    { key: 'purple', name: '优雅紫', colors: THEME_COLORS.purple },
    { key: 'green', name: '清新绿', colors: THEME_COLORS.green },
    { key: 'orange', name: '活力橙', colors: THEME_COLORS.orange },
    { key: 'pink', name: '浪漫粉', colors: THEME_COLORS.pink },
    { key: 'sunset', name: '超现实日落', colors: THEME_COLORS.sunset }
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
    themeVarsObject,
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
