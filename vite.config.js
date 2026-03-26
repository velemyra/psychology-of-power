import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3000,
    https: false, // Disable HTTPS for testing
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      external: ['aws-sdk'],
      output: {
        manualChunks: undefined
      }
    },
    target: 'es2015',
    minify: 'esbuild'
  },
  define: {
    global: 'globalThis'
  }
})