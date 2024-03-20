import { ProxyOptions, defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const BASE_PATH = process.env.VITE_BASE_PATH || "/";
  const SERVER_URL = process.env.VITE_SERVER_URL || "";
  const PROXY_TARGET = process.env.VITE_DEV_PROXY_TARGET;
  const PROXY_PREFIX = process.env.VITE_DEV_PROXY_PREFIX;

  const proxy: Record<string, ProxyOptions> = {};

  if (PROXY_TARGET && PROXY_PREFIX)
    proxy[PROXY_PREFIX] = {
      target: PROXY_TARGET,
      changeOrigin: false,
      secure: false,
      rewrite: (path) => path.replace(new RegExp(`^\\${PROXY_PREFIX}`), ""),
    };

    console.log(`${PROXY_TARGET} ${PROXY_PREFIX}`);
    
  // proxy["/fpst"] = {
  //   target: "https://fpst.garant.tv/",
  //   changeOrigin: true,
  //   secure: false,
  //   rewrite: (path) => path.replace(new RegExp(`^\/frpst`), ""),
  // };

  return {
    plugins: [vue()],
    base: BASE_PATH,
    server: {
      proxy: proxy,
    },
  };
});
