import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  base: '/',
  plugins: [react(), commonjs()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          maps: ['leaflet', 'react-leaflet'],
          animations: ['framer-motion'],
          ui: ['react-google-recaptcha']
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    reportCompressedSize: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})
