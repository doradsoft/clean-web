import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: ''
        },
        {
          src: 'src/popup.html',
          dest: ''
        },
        {
          src: 'src/background.js',
          dest: '',
          transform: (content) => {
            // Wrap in IIFE for Chrome extension compatibility
            return `(function() {\n'use strict';\n${content}\n})();`
          }
        },
        {
          src: 'src/popup.js',
          dest: '',
          transform: (content) => {
            // Wrap in IIFE for Chrome extension compatibility
            return `(function() {\n'use strict';\n${content}\n})();`
          }
        },
        {
          src: 'src/content.js',
          dest: ''
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    write: false  // Don't write build output, only use plugins
  }
})