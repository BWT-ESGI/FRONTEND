import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  mode: "production",
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const parts = id.split("node_modules/")[1].split("/");
            const pkgName = parts[0].startsWith("@")
              ? `${parts[0]}/${parts[1]}`
              : parts[0];
            return pkgName;
          }
        },
      },
    },
  },
});
