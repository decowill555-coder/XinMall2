// =============================================================================
// THEME STORE - 主题状态管理
// 使用 config/theme.config.ts 作为单一数据源
// =============================================================================

import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  type ThemeMode,
  type ThemeColor,
  type ThemeConfig,
  type ThemeColorConfig,
  THEME_COLORS,
  THEME_COLOR_LABELS,
  FONT_SIZE_MAP,
  BORDER_RADIUS_MAP,
  DEFAULT_THEME_CONFIG,
  generateColorVars,
  generateFontSizeVars,
  generateRadiusVars,
  generateFeatureVars,
  generateLightModeVars,
  generateDarkModeVars
} from '@/config/theme.config';

// Re-export types for backward compatibility
export type { ThemeMode, ThemeColor, ThemeConfig, ThemeColorConfig };

export const useThemeStore = defineStore('theme', () => {
  // =============================================================================
  // STATE - 状态
  // =============================================================================

  const config = ref<ThemeConfig>({ ...DEFAULT_THEME_CONFIG });
  const systemTheme = ref<'light' | 'dark'>('light');
  const isTransitioning = ref(false);

  // =============================================================================
  // COMPUTED - 计算属性
  // =============================================================================

  /** 当前实际主题模式（解析 system 后） */
  const currentMode = computed(() => {
    if (config.value.mode === 'system') {
      return systemTheme.value;
    }
    return config.value.mode;
  });

  const isDark = computed(() => currentMode.value === 'dark');
  const isLight = computed(() => currentMode.value === 'light');

  /** 当前主题色配置 */
  const currentColors = computed<ThemeColorConfig>(() => THEME_COLORS[config.value.color]);

  /** 当前字体大小配置 */
  const currentFontSize = computed(() => FONT_SIZE_MAP[config.value.fontSize]);

  /** 当前圆角配置 */
  const currentBorderRadius = computed(() => BORDER_RADIUS_MAP[config.value.borderRadius]);

  /** 主题色相关 CSS 变量 */
  const colorVars = computed(() => generateColorVars(currentColors.value));

  /** 字体大小相关 CSS 变量 */
  const fontSizeVars = computed(() => generateFontSizeVars(config.value.fontSize));

  /** 圆角相关 CSS 变量 */
  const radiusVars = computed(() => generateRadiusVars(config.value.borderRadius));

  /** 功能相关 CSS 变量（动画、玻璃效果） */
  const featureVars = computed(() => generateFeatureVars(config.value));

  /** 浅色模式 CSS 变量 */
  const lightModeVars = computed(() => isDark.value ? {} : generateLightModeVars());

  /** 深色模式 CSS 变量 */
  const darkModeVars = computed(() => isDark.value ? generateDarkModeVars() : {});

  /** 所有 CSS 变量对象 */
  const themeVarsObject = computed(() => ({
    ...colorVars.value,
    ...fontSizeVars.value,
    ...radiusVars.value,
    ...featureVars.value,
    ...lightModeVars.value,
    ...darkModeVars.value
  }));

  /** CSS 变量字符串（用于内联样式） */
  const allThemeVars = computed(() =>
    Object.entries(themeVarsObject.value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')
  );

  // =============================================================================
  // ACTIONS - 操作方法
  // =============================================================================

  /** 设置主题模式 */
  const setMode = (mode: ThemeMode) => {
    config.value.mode = mode;
    applyTheme();
    saveToStorage();
  };

  /** 切换深色/浅色模式 */
  const toggleMode = () => {
    if (config.value.mode === 'light') {
      setMode('dark');
    } else if (config.value.mode === 'dark') {
      setMode('light');
    } else {
      setMode(systemTheme.value === 'light' ? 'dark' : 'light');
    }
  };

  /** 设置主题色 */
  const setColor = (color: ThemeColor) => {
    config.value.color = color;
    applyTheme();
    saveToStorage();
  };

  /** 设置字体大小 */
  const setFontSize = (size: ThemeConfig['fontSize']) => {
    config.value.fontSize = size;
    applyTheme();
    saveToStorage();
  };

  /** 设置圆角大小 */
  const setBorderRadius = (radius: ThemeConfig['borderRadius']) => {
    config.value.borderRadius = radius;
    applyTheme();
    saveToStorage();
  };

  /** 设置动画开关 */
  const setAnimationEnabled = (enabled: boolean) => {
    config.value.animationEnabled = enabled;
    applyTheme();
    saveToStorage();
  };

  /** 设置玻璃效果开关 */
  const setGlassEffectEnabled = (enabled: boolean) => {
    config.value.glassEffectEnabled = enabled;
    applyTheme();
    saveToStorage();
  };

  /** 设置高对比度模式 */
  const setHighContrast = (enabled: boolean) => {
    config.value.highContrast = enabled;
    applyTheme();
    saveToStorage();
  };

  /** 更新系统主题 */
  const updateSystemTheme = () => {
    // #ifdef H5
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    systemTheme.value = isDarkMode ? 'dark' : 'light';

    if (config.value.mode === 'system') {
      applyTheme();
    }
    // #endif

    // #ifndef H5
    try {
      const sys = uni.getSystemInfoSync();
      const osTheme = sys.osTheme || 'light';
      systemTheme.value = osTheme === 'dark' ? 'dark' : 'light';

      if (config.value.mode === 'system') {
        applyTheme();
      }
    } catch {
      systemTheme.value = 'light';
    }
    // #endif
  };

  /** 应用主题到页面 */
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

    // #ifndef H5
    uni.setStorageSync('theme_mode', currentMode.value);
    uni.setStorageSync('theme_color', config.value.color);
    // #endif

    // 设置导航栏颜色
    try {
      uni.setNavigationBarColor({
        frontColor: isDark.value ? '#ffffff' : '#000000',
        backgroundColor: isDark.value ? '#0B0A12' : '#FFFFFF',
        animation: {
          duration: 300,
          timingFunc: 'easeInOut'
        }
      });
    } catch {
      // 忽略错误
    }

    setTimeout(() => {
      isTransitioning.value = false;
    }, 300);
  };

  /** 初始化主题 */
  const initTheme = () => {
    loadFromStorage();
    updateSystemTheme();
    applyTheme();

    // #ifdef H5
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateSystemTheme);
    // #endif
  };

  /** 重置主题为默认值 */
  const resetTheme = () => {
    config.value = { ...DEFAULT_THEME_CONFIG };
    applyTheme();
    saveToStorage();
  };

  /** 导出主题配置 */
  const exportTheme = (): string => JSON.stringify(config.value);

  /** 导入主题配置 */
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

  /** 获取所有可用的主题色选项 */
  const getAvailableColors = () =>
    (Object.keys(THEME_COLORS) as ThemeColor[]).map(key => ({
      key,
      name: THEME_COLOR_LABELS[key],
      colors: THEME_COLORS[key]
    }));

  // =============================================================================
  // PERSISTENCE - 持久化
  // =============================================================================

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

  // 自动保存配置变更
  watch(
    () => config.value,
    () => saveToStorage(),
    { deep: true }
  );

  // =============================================================================
  // RETURN - 导出
  // =============================================================================

  return {
    // State
    config,
    systemTheme,
    isTransitioning,

    // Computed - 模式
    currentMode,
    isDark,
    isLight,

    // Computed - 配置
    currentColors,
    currentFontSize,
    currentBorderRadius,

    // Computed - CSS 变量
    colorVars,
    fontSizeVars,
    radiusVars,
    featureVars,
    lightModeVars,
    darkModeVars,
    themeVarsObject,
    allThemeVars,

    // Actions - 设置
    setMode,
    toggleMode,
    setColor,
    setFontSize,
    setBorderRadius,
    setAnimationEnabled,
    setGlassEffectEnabled,
    setHighContrast,

    // Actions - 生命周期
    updateSystemTheme,
    applyTheme,
    initTheme,
    resetTheme,

    // Actions - 导入导出
    exportTheme,
    importTheme,
    getAvailableColors,

    // Persistence
    loadFromStorage,
    saveToStorage
  };
});
