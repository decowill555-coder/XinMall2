import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 如果你有全局的 CSS 文件（非 SCSS 变量），可以在这里引入
// import '@/static/css/common.css';

export function createApp() {
  const app = createSSRApp(App);
  
	app.use(createPinia());

  return {
    app,
  };
}