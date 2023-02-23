import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

export const fileCache = localForage.createInstance({
  name: "fileCache",
});

export const unpkgFetchPlugin = (
  inputCode: string | undefined, cb?:Function
): esbuild.Plugin => {
  let loading = 0
  const loadingPks:string[] = []
  return {
    name: "unpkg-fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "js",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cacheResult) {
          return cacheResult;
        }
      });

      //=================================================

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        loading++
        loadingPks.push(args.path)

        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "js",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        
        await fileCache.setItem(args.path, result);
        console.log("end of fetching");
        loading--
        if(cb) cb(({loading, loadingPks}))
        return result;
      });
    },
  };
};
