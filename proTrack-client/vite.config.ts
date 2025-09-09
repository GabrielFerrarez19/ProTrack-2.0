import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      port: 5173,
    },
  },
});
