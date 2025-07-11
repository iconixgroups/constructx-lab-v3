import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      "5174-i3v06pxl4s9bg4k2338gk-41c6555c.manus.computer",
      "8329-i3v06pxl4s9bg4k2338gk-41c6555c.manus.computer",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})


