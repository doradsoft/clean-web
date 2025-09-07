import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/extension/content.ts"),
        popup: resolve(__dirname, "src/extension/popup.ts"),
        background: resolve(__dirname, "src/extension/background.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: "dist/extension",
    target: "es2020",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/business-logic": resolve(__dirname, "src/business-logic"),
      "@/components": resolve(__dirname, "src/components"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

// Separate config for content script (IIFE)
export const contentConfig = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/extension/content.ts"),
      output: {
        entryFileNames: "content.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name].[ext]",
        format: "iife",
        name: "CleanWebContent",
      },
    },
    outDir: "dist/extension",
    target: "es2020",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/business-logic": resolve(__dirname, "src/business-logic"),
      "@/components": resolve(__dirname, "src/components"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

// Separate config for background script (ES module)
export const backgroundConfig = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/extension/background.ts"),
      output: {
        entryFileNames: "background.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name].[ext]",
        format: "es",
      },
    },
    outDir: "dist/extension",
    target: "es2020",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/business-logic": resolve(__dirname, "src/business-logic"),
      "@/components": resolve(__dirname, "src/components"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

// Separate config for popup script (ES module)
export const popupConfig = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/extension/popup.ts"),
      output: {
        entryFileNames: "popup.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name].[ext]",
        format: "es",
      },
    },
    outDir: "dist/extension",
    target: "es2020",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/business-logic": resolve(__dirname, "src/business-logic"),
      "@/components": resolve(__dirname, "src/components"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
