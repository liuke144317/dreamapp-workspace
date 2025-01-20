import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// const resolve = (dir: string) => {
//   return path.resolve(__dirname, dir);
// };
function a(c, b) {}
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
console.log('process.cwd()', path.resolve(process.cwd(), 'src/assets/icons'));
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')], //svg图片存放的目录
      symbolId: 'icon-[name]', // symbol的id
      inject: 'body-last', // 插入的位置
      customDomId: '__svg__icons__dom__', // svg的id
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
