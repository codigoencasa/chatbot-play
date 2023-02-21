import * as esbuild from "esbuild-wasm";
import { unpkgBotenvPlugin, unpkgFetchPlugin } from "~/esbuild/plugins";

export const swc: any = null;

declare global {
  interface Window {
    delaySendMessage: any;
  }
}

export function initEsbuild() {
  if (window && !window.delaySendMessage) {
    window.delaySendMessage = () => null;
  }
  return esbuild.initialize({
    worker: false,
    wasmURL: "https://unpkg.com/esbuild-wasm@0.14.54/esbuild.wasm",
  });
}

export async function executeCode(codeString: string) {
  const func = new Function(codeString);
  return func();
}

export function getCompileCode(rawCode: string, entryPoint: string, cb?:Function) {
  return async () => {
    try {
      const result = await esbuild.build({
        entryPoints: [`${entryPoint}`],
        bundle: true,
        write: false,
        minify: true,
        outdir: "/",
        plugins: [unpkgBotenvPlugin(), unpkgFetchPlugin(rawCode, cb)],
        metafile: true,
        allowOverwrite: true,
      });
      return result;
    } catch (error) {
      console.log(`🔴ERROR:`, error);
      return;
    }
  };
}
