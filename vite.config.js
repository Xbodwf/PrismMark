import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy'
import htmlPostBuildPlugin from './no-attr'

const noAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html) {
      return html.replace(`type="module" crossorigin`, "");
    }
}}

const base = './'

// https://vite.dev/config/
export default defineConfig((mode, command) => {
  const isBuild = command == 'build'
  const plugins = [
    react(),
  ]
  plugins.push(legacy({
    targets: ['defaults', 'not IE 11'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime']
  }))
  plugins.push(htmlPostBuildPlugin(base))
  return {
    plugins: plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      }
    },
    base: base,
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/assets/js/[name]-[hash].js',
          entryFileNames: 'static/assets/js/[name]-[hash].js',
          assetFileNames: 'static/assets/[ext]/[name]-[hash].[ext]',
        }
      }
    }
  }
})
