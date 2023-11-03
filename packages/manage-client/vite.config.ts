import { fileURLToPath, URL } from 'node:url'
// @ts-ignore
import topLevelAwait from 'vite-plugin-top-level-await'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    topLevelAwait({

      promiseExportName: "__tla"
    })],
  base: "/manage",
  build: {
    chunkSizeWarningLimit: 2048,
    outDir: 'manage', //指定输出路径
    minify: 'terser' // 混淆器，terser构建后文件体积更小
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
