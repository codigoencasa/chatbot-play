import * as esbuild from "esbuild-wasm";
import { unpkgBotenvPlugin, unpkgFetchPlugin } from "~/esbuild/plugins";
export const swc: any = null;

export function initEsbuild() {
  return async () => {
    await esbuild
      .initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm@0.14.54/esbuild.wasm",
      })
      .then(() => {
        console.log("INIT READY");
      })
      .catch(() => console.log("ERROR_INIT"));
  };
}

export async function executeCode(codeString: string) {
  const func = new Function(codeString);
  return func();
}

export function getCompileCode(rawCode: string, entryPoint: string) {
  return async () => {
    try {
      const result = await esbuild.build({
        entryPoints: [`${entryPoint}`],
        bundle: true,
        write: false,
        minify: true,
        outdir: "/",
        plugins: [unpkgBotenvPlugin(), unpkgFetchPlugin(rawCode)],
        metafile: true,
        allowOverwrite: true,
      });
      return result;
    } catch (error) {
      return;
    }
  };
}
