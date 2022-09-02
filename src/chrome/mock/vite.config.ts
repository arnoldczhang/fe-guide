import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: ['vue', 'vue-router'],
      dts: false, // src/auto-imports.d.ts
    }),
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: path.resolve('src') + '/',
      },
    ],
  },
});
