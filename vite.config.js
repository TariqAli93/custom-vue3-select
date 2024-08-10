import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "custom-vue3-select",
      fileName: (format) => `custom-vue3-select.${format}.js`
    },

    assetsInlineLimit: Number.MAX_SAFE_INTEGER,

    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  plugins: [vue()]
});
