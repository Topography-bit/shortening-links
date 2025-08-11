import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/register': { target: 'http://localhost:8001', changeOrigin: true },
      '/log_in': { target: 'http://localhost:8001', changeOrigin: true },
      '/verify_email': { target: 'http://localhost:8001', changeOrigin: true },
      '/refresh': { target: 'http://localhost:8001', changeOrigin: true },
      '/short_links': { target: 'http://localhost:8001', changeOrigin: true }
    }
  }
})


