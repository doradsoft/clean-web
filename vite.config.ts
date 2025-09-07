import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isExtension = mode === 'extension';
  
  return {
    plugins: [react()],
    build: {
      rollupOptions: isExtension ? {
        // Extension build configuration
        input: {
          content: resolve(__dirname, 'src/extension/content.ts'),
          background: resolve(__dirname, 'src/extension/background.ts'),
          popup: resolve(__dirname, 'src/extension/popup.tsx'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: '[name].[ext]',
        },
        external: [] // Don't externalize any modules for the extension
      } : {
        // Web app build configuration  
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
      outDir: isExtension ? 'dist/extension' : 'dist',
      target: isExtension ? 'es2020' : undefined,
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
    define: isExtension ? {
      'process.env.NODE_ENV': JSON.stringify('production'),
    } : {},
  }
})