import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    uni({
      manifest: resolve(__dirname, 'src/manifest.json'),
      pages: resolve(__dirname, 'src/pages.json')
    })
  ],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, 'src/ui-kit'),
      '@design': resolve(__dirname, 'src/design'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@api': resolve(__dirname, 'src/api'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@design/_mixins.scss" as *;`,
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import']
      }
    }
  }
});
