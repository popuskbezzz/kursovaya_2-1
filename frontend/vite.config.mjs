import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ESM-конфигурация Vite. Формат .mjs гарантирует корректную загрузку @vitejs/plugin-react (ESM-only).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
