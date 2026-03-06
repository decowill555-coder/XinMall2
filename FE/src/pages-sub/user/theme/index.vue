<template>
  <view class="theme-page">
    <ui-sub-navbar title="主题设置" />
    
    <scroll-view scroll-y class="theme-scroll" :style="{ height: scrollHeight + 'px' }">
      <view class="theme-content">
        <view class="theme-section">
          <view class="section-title">外观模式</view>
          <view class="mode-list">
            <view 
              v-for="mode in modeList" 
              :key="mode.value"
              class="mode-item"
              :class="{ 'is-active': themeStore.config.mode === mode.value }"
              @click="handleModeChange(mode.value)"
            >
              <view class="mode-icon">
                <ui-icon :name="mode.icon" :size="48" />
              </view>
              <text class="mode-name">{{ mode.label }}</text>
              <view v-if="themeStore.config.mode === mode.value" class="mode-check">
                <ui-icon name="check" :size="32" color="#1ABC9C" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="theme-section">
          <view class="section-title">主题色</view>
          <view class="color-list">
            <view 
              v-for="color in colorList" 
              :key="color.key"
              class="color-item"
              :class="{ 'is-active': themeStore.config.color === color.key }"
              @click="handleColorChange(color.key)"
            >
              <view class="color-preview" :style="{ background: color.colors.primary }">
                <view v-if="themeStore.config.color === color.key" class="color-check">
                  <ui-icon name="check" :size="32" color="#FFFFFF" />
                </view>
              </view>
              <text class="color-name">{{ color.name }}</text>
            </view>
          </view>
        </view>
        
        <view class="theme-section">
          <view class="section-title">字体大小</view>
          <view class="font-size-list">
            <view 
              v-for="size in fontSizeList" 
              :key="size.value"
              class="font-size-item"
              :class="{ 'is-active': themeStore.config.fontSize === size.value }"
              @click="handleFontSizeChange(size.value)"
            >
              <text class="font-size-label">{{ size.label }}</text>
              <text class="font-size-preview" :style="{ fontSize: size.previewSize }">Aa</text>
              <view v-if="themeStore.config.fontSize === size.value" class="font-size-check">
                <ui-icon name="check" :size="32" color="#1ABC9C" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="theme-section">
          <view class="section-title">圆角大小</view>
          <view class="radius-list">
            <view 
              v-for="radius in radiusList" 
              :key="radius.value"
              class="radius-item"
              :class="{ 'is-active': themeStore.config.borderRadius === radius.value }"
              @click="handleRadiusChange(radius.value)"
            >
              <view class="radius-preview" :style="{ borderRadius: radius.previewRadius }"></view>
              <text class="radius-label">{{ radius.label }}</text>
              <view v-if="themeStore.config.borderRadius === radius.value" class="radius-check">
                <ui-icon name="check" :size="32" color="#1ABC9C" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="theme-section">
          <view class="section-title">其他设置</view>
          <view class="settings-list">
            <view class="setting-item">
              <text class="setting-label">动画效果</text>
              <switch 
                :checked="themeStore.config.animationEnabled" 
                @change="handleAnimationToggle"
                color="#1ABC9C"
              />
            </view>
            <view class="setting-item">
              <text class="setting-label">毛玻璃效果</text>
              <switch 
                :checked="themeStore.config.glassEffectEnabled" 
                @change="handleGlassEffectToggle"
                color="#1ABC9C"
              />
            </view>
            <view class="setting-item">
              <text class="setting-label">高对比度</text>
              <switch 
                :checked="themeStore.config.highContrast" 
                @change="handleHighContrastToggle"
                color="#1ABC9C"
              />
            </view>
          </view>
        </view>
        
        <view class="theme-actions">
          <ui-button type="primary" plain block @click="handleReset">恢复默认设置</ui-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePageLayout } from '@/composables/usePageLayout';
import { useThemeStore, type ThemeMode, type ThemeColor } from '@/stores/theme';

const { scrollHeight } = usePageLayout({
  hasSubNavbar: true
});

const themeStore = useThemeStore();

const modeList = ref([
  { label: '浅色模式', value: 'light' as ThemeMode, icon: 'sun' },
  { label: '深色模式', value: 'dark' as ThemeMode, icon: 'moon' },
  { label: '跟随系统', value: 'system' as ThemeMode, icon: 'smartphone' }
]);

const colorList = ref(themeStore.getAvailableColors());

const fontSizeList = ref([
  { label: '小', value: 'small' as const, previewSize: '24rpx' },
  { label: '标准', value: 'medium' as const, previewSize: '28rpx' },
  { label: '大', value: 'large' as const, previewSize: '32rpx' }
]);

const radiusList = ref([
  { label: '小', value: 'small' as const, previewRadius: '8rpx' },
  { label: '标准', value: 'medium' as const, previewRadius: '16rpx' },
  { label: '大', value: 'large' as const, previewRadius: '24rpx' }
]);

const handleModeChange = (mode: ThemeMode) => {
  themeStore.setMode(mode);
  uni.showToast({ title: '主题模式已切换', icon: 'success' });
};

const handleColorChange = (color: ThemeColor) => {
  themeStore.setColor(color);
  uni.showToast({ title: '主题色已更换', icon: 'success' });
};

const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
  themeStore.setFontSize(size);
  uni.showToast({ title: '字体大小已调整', icon: 'success' });
};

const handleRadiusChange = (radius: 'small' | 'medium' | 'large') => {
  themeStore.setBorderRadius(radius);
  uni.showToast({ title: '圆角大小已调整', icon: 'success' });
};

const handleAnimationToggle = (e: any) => {
  themeStore.setAnimationEnabled(e.detail.value);
};

const handleGlassEffectToggle = (e: any) => {
  themeStore.setGlassEffectEnabled(e.detail.value);
};

const handleHighContrastToggle = (e: any) => {
  themeStore.setHighContrast(e.detail.value);
};

const handleReset = () => {
  uni.showModal({
    title: '提示',
    content: '确定恢复默认主题设置吗？',
    success: (res) => {
      if (res.confirm) {
        themeStore.resetTheme();
        uni.showToast({ title: '已恢复默认设置', icon: 'success' });
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.theme-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.theme-scroll {
  overflow: hidden;
}

.theme-content {
  padding: $space-md;
}

.theme-section {
  background: $color-bg-card;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: $radius-lg;
  padding: $space-md;
  margin-bottom: $space-md;
  border: 1px solid $color-border;
  
  .section-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-main;
    margin-bottom: $space-md;
  }
}

.mode-list {
  display: flex;
  gap: $space-md;
  
  .mode-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-md;
    background: var(--color-bg-gray, #FAF8F7);
    border-radius: $radius-md;
    border: 2rpx solid transparent;
    transition: all $duration-fast $ease-spring;
    position: relative;
    
    &.is-active {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
      border-color: var(--color-primary, #FF6A00);
    }
    
    .mode-icon {
      width: 80rpx;
      height: 80rpx;
      @include flex-center;
      background: var(--color-bg-card, rgba(255, 255, 255, 0.65));
      border-radius: 50%;
      margin-bottom: $space-sm;
    }
    
    .mode-name {
      font-size: $font-size-sm;
      color: $color-text-main;
    }
    
    .mode-check {
      position: absolute;
      top: $space-xs;
      right: $space-xs;
    }
  }
}

.color-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-md;
  
  .color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .color-preview {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      @include flex-center;
      margin-bottom: $space-sm;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
      border: 3px solid transparent;
      transition: all 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      .color-check {
        @include flex-center;
      }
    }
    
    .color-name {
      font-size: $font-size-xs;
      color: $color-text-sub;
      text-align: center;
    }
  }
}

.font-size-list {
  display: flex;
  gap: $space-md;
  
  .font-size-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-md;
    background: var(--color-bg-gray, #FAF8F7);
    border-radius: $radius-md;
    border: 2rpx solid transparent;
    transition: all $duration-fast $ease-spring;
    position: relative;
    
    &.is-active {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
      border-color: var(--color-primary, #FF6A00);
    }
    
    .font-size-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
      margin-bottom: $space-xs;
    }
    
    .font-size-preview {
      color: $color-text-main;
      font-weight: $font-weight-bold;
    }
    
    .font-size-check {
      position: absolute;
      top: $space-xs;
      right: $space-xs;
    }
  }
}

.radius-list {
  display: flex;
  gap: $space-md;
  
  .radius-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-md;
    background: var(--color-bg-gray, #FAF8F7);
    border-radius: $radius-md;
    border: 2rpx solid transparent;
    transition: all $duration-fast $ease-spring;
    position: relative;
    
    &.is-active {
      background: var(--color-primary-glass, rgba(255, 106, 0, 0.1));
      border-color: var(--color-primary, #FF6A00);
    }
    
    .radius-preview {
      width: 60rpx;
      height: 60rpx;
      background: var(--color-primary, #FF6A00);
      margin-bottom: $space-sm;
    }
    
    .radius-label {
      font-size: $font-size-sm;
      color: $color-text-sub;
    }
    
    .radius-check {
      position: absolute;
      top: $space-xs;
      right: $space-xs;
    }
  }
}

.settings-list {
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-md 0;
    border-bottom: 1rpx solid $color-divider;
    
    &:last-child {
      border-bottom: none;
    }
    
    .setting-label {
      font-size: $font-size-md;
      color: $color-text-main;
    }
  }
}

.theme-actions {
  margin-top: $space-xl;
}

[data-theme="dark"] {
  .theme-section {
    background: var(--color-bg-card, rgba(255, 255, 255, 0.06));
    border-color: var(--color-border, rgba(255, 255, 255, 0.1));
  }
  
  .mode-item {
    background: var(--color-bg-gray, #0F0E16);
    
    &.is-active {
      background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
      border-color: var(--color-primary, #E879F9);
    }
    
    .mode-icon {
      background: var(--color-bg-card, rgba(255, 255, 255, 0.06));
    }
  }
  
  .font-size-item,
  .radius-item {
    background: var(--color-bg-gray, #0F0E16);
    
    &.is-active {
      background: var(--color-primary-glass, rgba(232, 121, 249, 0.15));
      border-color: var(--color-primary, #E879F9);
    }
  }
  
  .color-preview {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);
  }
}
</style>
