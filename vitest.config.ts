import {mergeConfig, defineConfig} from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((env) =>
    mergeConfig(
        viteConfig(env),
        defineConfig({
            test: {
                environment: "happy-dom",
                setupFiles: './src/vitest-setup.ts',
            },
        })
    )
);
