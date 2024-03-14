import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.DEPLOY_ENV === "gh-pages" ? "/SmartYard-Web/" : "/",
  server: {
    proxy: {
      "/api": {
        target: "https://rbt-demo.lanta.me",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
