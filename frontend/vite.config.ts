/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import path from 'node:path'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        dts: 'types/typed-router.d.ts',
        exclude: ['**/components', '**/*.ts'],
      }),

      // ⚠️ Vue must be placed after VueRouter()
      Vue({
        template: { transformAssetUrls },
      }),

      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/vuetify.scss',
        },
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: 'types/components.d.ts',
        types: [],
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        dts: 'types/auto-imports.d.ts',
        imports: ['vue', '@vueuse/core', VueRouterAutoImports],
      }),

      // https://github.com/unocss/unocss
      Unocss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3560',
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
    },
  }
})
