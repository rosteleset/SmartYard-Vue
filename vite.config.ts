import { ProxyOptions, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const BASE_PATH = process.env.VITE_BASE_PATH || "/";
  const PROXY_TARGET = process.env.VITE_DEV_PROXY_TARGET;
  const PROXY_PREFIX = process.env.VITE_DEV_PROXY_PREFIX;

  const proxy: Record<string, ProxyOptions> = {};

  if (PROXY_TARGET && PROXY_PREFIX)
    proxy[PROXY_PREFIX] = {
      target: PROXY_TARGET,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(new RegExp(`^\\${PROXY_PREFIX}`), ""),
    };

  return {
    plugins: [vue(), svgLoader()],
    base: BASE_PATH,
    server: {
      proxy: proxy,
    }
  };
});
