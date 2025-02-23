import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
// const resolve = (dir: string) => {
//   return path.resolve(__dirname, dir);
// };
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
console.log('process.cwd()', path.resolve(process.cwd(), 'src/assets/icons'));
// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          mockjs: ['mockjs'],
        },
      },
    },
  },
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')], //svg图片存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__', // svg的id
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/DreamApp': {
        // target: 'https://nas.liuke12355.top:13531/node', // 正式环境
        target: 'https://localhost:3000', // 开发环境
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/DreamApp/, '/DreamApp'),
      },
    },
  },
});
