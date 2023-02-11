import * as esbuild from "esbuild-wasm";

export const NPM_BROWSER: { [key: string]: string } = {
  "node:events": "https://unpkg.com/events@3.3.0/events.js",
  crypto: "https://mp3musica.s3.amazonaws.com/crypto-fake.js",
  console: "https://mp3musica.s3.amazonaws.com/console-fake.js",
  fs: "https://mp3musica.s3.amazonaws.com/fs-fake.js",
  "@bot-whatsapp/provider/mock": "https://unpkg.com/@bot-whatsapp/provider@0.1.21/lib/mock/index.cjs",
  "@bot-whatsapp/provider/web-whatsapp": "https://unpkg.com/@bot-whatsapp/provider@0.1.21/lib/mock/index.cjs",
  "@bot-whatsapp/database/mock": "https://unpkg.com/@bot-whatsapp/database@0.1.21/lib/mock/index.cjs",
};

export const mapMockModule = (args: any) => {
  console.log(`🚩`,args?.path)
  const moduleUrl = NPM_BROWSER[args?.path] ?? `https://unpkg.com/${args.path}`;
  return {
    namespace: "a",
    path: moduleUrl,
  };
};

export const unpkgBotenvPlugin = (): esbuild.Plugin => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind === "entry-point") {
          return { path: args.path, namespace: "a" };
        }
      });

      //match relative path in a module "./" or "../"
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          namespace: "a",
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      });

      //match main file in a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return mapMockModule(args);
      });
    },
  };
};
