import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { qwikReact } from "@builder.io/qwik-react/vite";
import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig(() => {
  return {
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
                  buffer: true,
              }),
          ],
      },
  },
  resolve: {
      alias: {
          process: "process/browser",
          stream: "stream-browserify",
          zlib: "browserify-zlib",
          util: "util",
      },
  },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    }
  };
});
