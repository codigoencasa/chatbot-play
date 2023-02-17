import { defineConfig, loadEnv } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikReact } from "@builder.io/qwik-react/vite";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig(({ mode}) => {
  const env = loadEnv(mode, process.cwd())

  const processEnvValues = {
    'process.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val,
        }
      },
      {
        VITE_PUSHER_ID:process.env.VITE_PUSHER_ID,
        VITE_PUSHER_PK:process.env.VITE_PUSHER_PK,
        VITE_PUSHER_SK:process.env.VITE_PUSHER_SK,
        VITE_PUSHER_CLUSTER:process.env.VITE_PUSHER_CLUSTER
      },
    )
  }

  return {
    define: processEnvValues,
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), qwikReact(),
    ],
    optimizeDeps: {
      esbuildOptions: {
          define: {
              global: "globalThis",
          },
          plugins: [
              GlobalPolyFill({
                  process: true,
                  buffer: true
              }),
          ],
      },
  },
    preview: {
      // headers: {
      //   "Cache-Control": "public, max-age=600",
      // },
    }
  };
});
