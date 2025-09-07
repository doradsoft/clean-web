import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/extension/content.ts'),
<<<<<<< HEAD
        popup: resolve(__dirname, 'src/extension/popup.ts'),
=======
        background: resolve(__dirname, 'src/extension/background.ts'),
        popup: resolve(__dirname, 'src/extension/popup.tsx'),
>>>>>>> e59d59ac8f9c4915bc8b79f299d2037da7245056
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
    outDir: 'dist/extension',
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/business-logic': resolve(__dirname, 'src/business-logic'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})