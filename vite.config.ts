import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
<<<<<<< HEAD
  const baseConfig = {
    plugins: [react()],
=======
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
>>>>>>> e59d59ac8f9c4915bc8b79f299d2037da7245056
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/business-logic': resolve(__dirname, 'src/business-logic'),
        '@/components': resolve(__dirname, 'src/components'),
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/types': resolve(__dirname, 'src/types'),
      },
    },
<<<<<<< HEAD
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
=======
    define: isExtension ? {
      'process.env.NODE_ENV': JSON.stringify('production'),
    } : {},
  }
})
>>>>>>> e59d59ac8f9c4915bc8b79f299d2037da7245056
