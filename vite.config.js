import { defineConfig } from 'vite'
import { loadConfiguration } from './src/utils/loadConfiguration.js'
import { VitePluginRadar } from 'vite-plugin-radar'
import path from 'path'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import markdownAnchor from 'markdown-it-anchor'
import ViteRestart from './src/plugins/vite/restart.js'
import {
  relativeToRouterPlugin,
  variableReplacementPlugin
} from './src/plugins/markdown'
import Pages from 'vite-plugin-pages'
import './src/utils/globalVars'

export default () => {
  const configuration = loadConfiguration(__dirname)

  return defineConfig({
    base: configuration.base_url,
    server: {
      port: 5175
    },
    define: {
      __APP_ENV__: configuration
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(process.cwd())
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },

    build: {
      rollupOptions: {
        output: {
          // Append suffix "-min" to avoid trailing hyphens such as index-328ajA-.js
          // (Cascade CMS doesn't allow filename bases ending with hyphens)
          entryFileNames: 'assets/[name]-[hash]-min.js',
          chunkFileNames: 'assets/[name]-[hash]-min.js',
          assetFileNames: 'assets/[name]-[hash]-min.[ext]'
        }
      }
    },

    plugins: [
      ViteRestart({ dir: ['config/**/*.yml'] }),
      Vue({
        include: [/\.vue$/, /\.md$/]
      }),

      Markdown({
        wrapperComponent: 'markdown-layout',
        markdownItSetup(md) {
          md.use(markdownAnchor)
          md.use(variableReplacementPlugin, {
            variables: { ...configuration }
          })
          md.use(relativeToRouterPlugin, configuration)
        }
      }),

      Pages({
        dirs: 'pages',
        exclude: ['**/components/*.vue', 'components/**/*.vue'],
        extensions: ['vue', 'md'],
        extendRoute(route) {
          if (route.path === '/home') {
            route.alias = '/home'
            route.path = '/'

            return route
          }
        }
      }),

      VitePluginRadar({
        ...configuration?.analytics_services
      })
    ]
  })
}
