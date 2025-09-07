import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
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
    emptyOutDir: false,
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
