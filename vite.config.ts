import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikReact } from "@builder.io/qwik-react/vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd())

  const processEnvValues = {
    '.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val,
        }
      },
    )
  }

  return {
    define: processEnvValues,
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact(),
    ],
    resolve:{
      alias: {
        crypto: "crypto-browserify",
        stream: "rollup-plugin-node-polyfills/polyfills/stream",
        string_decoder: "rollup-plugin-node-polyfills/polyfills/string-decoder",
        url: "rollup-plugin-node-polyfills/polyfills/url",
        util: "util"
      }
    },
    optimizeDeps: {
      esbuildOptions: {
          define: {
              global: "globalThis",
          },
          plugins: [
            NodeGlobalsPolyfillPlugin({
                  process: true,
                  buffer: true
              }),
            NodeModulesPolyfillPlugin() 
          ],
      },
  },
  };
});
