import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/business-logic': resolve(__dirname, 'src/business-logic'),
        '@/components': resolve(__dirname, 'src/components'),
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/types': resolve(__dirname, 'src/types'),
      },
    },
  };

  if (mode === 'extension') {
    // Extension build configuration
    return {
      ...baseConfig,
      build: {
        outDir: 'dist-extension',
        rollupOptions: {
          input: {
            content: resolve(__dirname, 'src/extension/content.ts'),
            popup: resolve(__dirname, 'src/extension/popup.ts'),
          },
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            assetFileNames: '[name].[ext]'
          }
        },
        sourcemap: false,
      },
    };
  }
  
  // Default web app configuration
  return {
    ...baseConfig,
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
      },
    },
  };
});