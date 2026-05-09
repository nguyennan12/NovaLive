import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'static4j.app',
      'www.static4j.app'
    ],
    proxy: {
      '/v1/api': {
        target: 'http://backend:3031',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://backend:3031',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
