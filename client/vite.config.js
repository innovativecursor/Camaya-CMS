import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@store": path.resolve(__dirname, "./src/redux/store"),
      // "@loginbkg": path.resolve(
      //   __filename,
      //   "url(./src/assets/Images/Loginbkg.webp)"
      // ),
    },
  },
  define: {
    "process.env": {
      REACT_APP_UAT_URL: "https://api.innovativecursor.com",
      // REACT_APP_UAT_URL: "http://localhost:8081",
      REACT_APP_ENCRYPTION: "WABBALABBA@3344$$1DUB43DUB",
    },
  },
  plugins: [react({})],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    port: 3003,
  },
  build: {
    minify: true,
    emptyOutDir: true,
    sourcemap: false, // Disable source maps
    rollupOptions: {
      external: "sweetalert2.all.min.js",
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
