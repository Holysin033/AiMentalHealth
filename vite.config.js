import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'


// https://vite.dev/config/
const pathSrc = path.resolve(__dirname, 'src')//src目录路径 __dirname 当前目录
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),// vue开发工具
    VueSetupExtend(),// 允许在script标签中添加setup属性],
    AutoImport({
      // imports: ['vue', 'vue-router','pinia'],// 自动导入vue、vue-router、pinia相关函数
      resolvers: [
        ElementPlusResolver(),
        IconsResolver()
      ],
      // 自动导入的API会生成在该文件中，避免重复导入
      dts: 'src/auto-imports.d.ts'
    }),
    // 配置组件自动注册：自动识别组件并注册
    Components({
      resolvers: [
        // 解析 Element Plus 组件
        ElementPlusResolver({
          importStyle: 'css',
        }),
        // 解析图标组件,启用 Element Plus 图标集
        // 使用自动导入图标格式 {prefix}-{collection}-{icon},感觉不如按需导入方便
        // IconsResolver({ prefix: 'I',enabledCollections: ['ep'] }),
        IconsResolver({ prefix: false, enabledCollections: ['ep'] }),
        //// 可选，设置图标组件前缀, 默认为 i,
        // false表述不添加前缀-》{collection}-{icon}
      ],
      // 自动注册的组件会生成在该文件中
      dts: 'src/components.d.ts'
    }),
    // 图标插件
    Icons({
      autoInstall: true, // 自动安装,
    }),
  ],
  resolve: {
    alias: {
      // '@': resolve(__dirname, 'src'),
      '@': pathSrc,
    },
  },
})
