import * as esbuild from "esbuild-wasm";
import { VITE_URL } from "~/constants";

export const NPM_BROWSER: { [key: string]: string } = {
  "node:events": "https://unpkg.com/events@3.3.0/events.js",
  crypto: `${VITE_URL}/sdk/crypto.playground.js`,
  console: "https://mp3musica.s3.amazonaws.com/console-fake.js",
  fs: `${VITE_URL}/sdk/fs.playground.js`,
  "@adiwajshing/baileys": `${VITE_URL}/sdk/void.playground.js`,
  "@bot-whatsapp/portal": `${VITE_URL}/sdk/portal.playground.js`,
  "@bot-whatsapp/provider/mock": `${VITE_URL}/sdk/provider.playground-2.js`,
  "@bot-whatsapp/provider/web-whatsapp": `${VITE_URL}/sdk/provider.playground.js`,
  "@bot-whatsapp/provider/baileys": `${VITE_URL}/sdk/provider.playground.js`,
  "@bot-whatsapp/provider/venom": `${VITE_URL}/sdk/provider.playground.js`,
  "@bot-whatsapp/database/mock": `${VITE_URL}/sdk/database.playground-2.js`,
  "@bot-whatsapp/database/json": `${VITE_URL}/sdk/database.playground.js`,
  "@bot-whatsapp/database/mongo": `${VITE_URL}/sdk/database.playground.js`,
  "@bot-whatsapp/database/mysql": `${VITE_URL}/sdk/database.playground.js`,
  "@bot-whatsapp/bot": `${VITE_URL}/sdk/bot.playground-2.js`
};

export const mapMockModule = (args: any) => {
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
