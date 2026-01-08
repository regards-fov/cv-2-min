import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    {
      name: 'serve-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0]

          // Route racine
          if (url === '/') {
            const filePath = path.join(__dirname, 'public', 'index.html')
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html')
              res.end(fs.readFileSync(filePath))
              return
            }
          }

          // Routes /cv et /app → app/index.html (sans extension de fichier)
          if ((url.startsWith('/cv') || url.startsWith('/app')) && !path.extname(url)) {
            const filePath = path.join(__dirname, 'app', 'index.html')
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html')
              res.end(fs.readFileSync(filePath))
              return
            }
          }

          next()
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@directives': path.resolve(__dirname, './src/directives'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'app/index.html')
    }
  }
})