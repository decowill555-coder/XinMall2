import type { App } from 'vue';

const uiKitComponents = import.meta.glob('../ui-kit/**/*.vue', { eager: true });

export function registerUiKit(app: App) {
  Object.entries(uiKitComponents).forEach(([path, module]: [string, any]) => {
    const fileName = path.split('/').pop() || '';
    const componentName = fileName.replace('.vue', '');
    
    if (componentName.startsWith('Ui') || componentName.startsWith('The')) {
      app.component(componentName, module.default);
    }
  });
}

export default {
  install(app: App) {
    registerUiKit(app);
  }
};
