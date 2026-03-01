import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import UiKitPlugin from './plugins/ui-kit';

export function createApp() {
  const app = createSSRApp(App);
  
  app.use(createPinia());
  app.use(UiKitPlugin);

  return {
    app,
  };
}
