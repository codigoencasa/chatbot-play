import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikReact } from "@builder.io/qwik-react/vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig(({ mode}) => {
  const env = loadEnv(mode, process.cwd())

  const processEnvValues = {
    '.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val,
        }
      },
      {
        VITE_URL:process.env.VITE_URL,
        VITE_PUSHER_ID:process.env.VITE_PUSHER_ID,
        VITE_PUSHER_PK:process.env.VITE_PUSHER_PK,
        VITE_PUSHER_SK:process.env.VITE_PUSHER_SK,
        VITE_PUSHER_CLUSTER:process.env.VITE_PUSHER_CLUSTER,
        VITE_DB_URI:process.env.VITE_DB_URI
      },
    )
  }

  return {
    define: processEnvValues,
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact(),
    ],
    ssr: {
      noExternal: []
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