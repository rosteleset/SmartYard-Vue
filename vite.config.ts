import {defineConfig, loadEnv, ProxyOptions} from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import {fileURLToPath} from "url";
import {VitePWA} from "vite-plugin-pwa";
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    const BASE_PATH = process.env.VITE_BASE_PATH || "/";
    const PROXY_TARGET = process.env.VITE_DEV_PROXY_TARGET;
    const PROXY_PREFIX = process.env.VITE_DEV_PROXY_PREFIX;

    const proxy: Record<string, ProxyOptions> = {};

    // if (PROXY_TARGET && PROXY_PREFIX)
    proxy[`${PROXY_PREFIX}`] = {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(new RegExp(`^\\${PROXY_PREFIX}`), ""),
    };

    return {
        plugins: [
            vue(),
            VitePWA({
                srcDir: "src",
                filename: "firebase-messaging-sw.ts",
                strategies: "injectManifest",
                injectRegister: false,
                manifest: false,
                injectManifest: {
                    injectionPoint: undefined,
                },

                devOptions: {
                    enabled: true,
                    type: "module",
                },
            }),
            svgLoader(),
            // basicSsl()
        ],
        base: BASE_PATH,
        resolve: {
            alias: [
                {find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url))}
            ],
        },
        server: {
            proxy: proxy,
        }
    };
});
