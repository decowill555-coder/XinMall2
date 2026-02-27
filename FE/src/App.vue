<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
  // 核心逻辑：隐藏原生 Tabbar，由组件 components/layout/TheTabbar 接管
  uni.hideTabBar();
});

onShow(() => {
  // console.log('App Show')
});

onHide(() => {
  // console.log('App Hide')
});
</script>

<style lang="scss">
/* 
 * 全局样式入口
 * 注意：无需 @import，vite.config.ts 已自动注入 _tokens.scss
 */

/* 设置整个小程序的背景色 (Page) */
page {
  /* 使用 Token 变量：极淡的蓝灰色，配合毛玻璃效果最佳 */
  background-color: $color-bg-page; 
  
  /* 统一字体：优先使用 iOS/Mac 系统字体，最后回退到无衬线 */
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
    
  /* 统一字号和颜色 */
  font-size: $font-size-md;
  color: $color-text-main;
  
  /* 确保页面至少撑满屏幕高度 */
  min-height: 100vh;
  box-sizing: border-box;
}

/* (可选) 全局隐藏滚动条，保持界面简洁 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* (可选) 引入 Iconfont */
/* @import "@/static/iconfont/iconfont.css"; */
</style>