import {
  $,
  component$,
  useBrowserVisibleTask$,
  useContext,
  useStore,
} from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { executeCode, getCompileCode } from "~/utils/execute-code";
import Device from "../device/device";
import { QMonaco } from "./q-monaco/q-monaco";

declare global {
  interface Window {
    idRuntime: any;
  }
}
export const BoxLoadings = component$((props: { loadingState: any }) => {
  return (
    <div
      class={
        "absolute flex flex-col gap-1 bottom-0 h-64 drop-shadow-xl p-4 dark:text-white w-full border border-t rounded-tr-lg dark:border-gray-500 bg-white dark:bg-gray-800 z-10"
      }
    >
      {props.loadingState.list.map((pk: any) => (
        <div class={"truncate p-1 px-2 rounded-lg bg-slate-700"}>
          🚀 Instalando {pk}...
        </div>
      ))}
    </div>
  );
});

export const QPlayground = component$(() => {
  const state = useContext(ExecuteCtx);
  const loadingState = useStore({
    list: [],
    loading: false,
  });

  const handlePlay = $(async () => {
    if (!state.ready) return;
    if (state.messages.length) {
      const getLiterraly = state.messages[state.messages.length - 1];
      getLiterraly?.message;
      state.after = ``;
    }
    const mergeCode = [state.preamble, state.code, state.after].join(" \n ");
    const fullCode = `
      const MAIN_FUNCTION_PRINCIPAL_SCOPE = async () => {
          ${mergeCode}

          if(!window.pusherJoined){
            window.pusherJoined = true
            window.pusherChannel.bind('my-event', async (data) => {
              console.log(data)
              window.pusherJoined = true
              if(data.from === '${state.workspace}'){
                await window.delaySendMessage(0, 'message', {
                    from: '${state.workspace}',
                    body: data.message,
                })
              }
          
  
              console.log('RUNKIT:',JSON.stringify(data));
            });
          }

          window.idRuntime = setInterval(() => null, 20)
      }
      MAIN_FUNCTION_PRINCIPAL_SCOPE().then()
    `;

    const resultExection = await getCompileCode(
      fullCode,
      "index.js",
      (pks: any) => {
        loadingState.list = pks?.loadingPks ?? [];
        loadingState.loading = !!pks?.loading;
      }
    )();
    state.result = resultExection?.outputFiles[0].text;
    if (state.result) await executeCode(state.result);

    state.running = false;
  });

  const cleanWorker = $(() => {
    if (window.idRuntime) clearInterval(window.idRuntime);
  });

  useBrowserVisibleTask$(({ track }) => {
    track(() => state.ready);
    handlePlay();

    track(() => state.code);
    cleanWorker();

    return () => {
      cleanWorker();
    };
  });

  return (
    <div class={"relative"}>
 
      <div class={"flex"}>
        <div
          class={
            "w-full relative border-r border-gray-100 dark:border-gray-900 "
          }
        >
          {loadingState.loading ? (
            <BoxLoadings loadingState={loadingState} />
          ) : null}
          <QMonaco />
        </div>

        <div class="w-1/2 relative flex flex-col justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 py-6 sm:py-12">
          <div class="absolute p-6 pt-3  inset-0 bg-[url(https://play.tailwindcss.com/img/grid.svg)] bg-center">
            <Device />
          </div>
        </div>
      </div>
    </div>
  );
});
