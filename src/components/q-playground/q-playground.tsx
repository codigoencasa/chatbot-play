import { $, component$, useClientEffect$, useContext } from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { executeCode, getCompileCode } from "~/utils/execute-code";
import Device from "../device/device";
import { QMonaco } from "./q-monaco/q-monaco";

declare global{
  interface Window{
    idRuntime:any
  }
}

export const QPlayground = component$(() => {
  const state = useContext(ExecuteCtx);

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
          console.log(1)

          // Enable pusher logging - don't include this in production

          var pusher = new Pusher('adb4202d50dff49b170a', {
            cluster: 'eu'
          });
      
          var channel = pusher.subscribe('my-channel');
          channel.bind('my-event', async (data) => {

            await window.delaySendMessage(0, 'message', {
                from: '000',
                body: data.message,
            })
        

            console.log('RUNKIT:',JSON.stringify(data));
          });

          window.idRuntime = setInterval(() => null, 20)
      }
      MAIN_FUNCTION_PRINCIPAL_SCOPE().then()
    `;
    const resultExection = await getCompileCode(fullCode, "index.js")();
    state.result = resultExection?.outputFiles[0].text;
    if (state.result) await executeCode(state.result);
    state.running = false;
  });

  const cleanWorker = $(() => {
    if(window.idRuntime) clearInterval(window.idRuntime)
  })

  useClientEffect$(({ track }) => {
    track(() => state.ready);
    handlePlay();

    track(() => state.code)
    cleanWorker()

    return () => {
      cleanWorker()
    }
  });

  return (
    <div class={"flex "}>
      <div class={"w-full border-r  border-gray-100 "}>
        <QMonaco />
      </div>
      <div class={"w-1/2"}>
        <Device />
      </div>
    </div>
  );
});
