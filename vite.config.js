import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    
    VueSetupExtend(),],// 允许在script标签中添加setup属性],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),//__dirname 当前目录
    },
  },
})
