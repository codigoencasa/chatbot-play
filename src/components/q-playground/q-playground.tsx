import { $, component$, useClientEffect$, useContext } from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { executeCode, getCompileCode } from "~/utils/execute-code";
import Device from "../device/device";
import { QMonaco } from "./q-monaco/q-monaco";

declare global {
  var WSBOT: any
}

export const QPlayground = component$(() => {
  const state = useContext(ExecuteCtx);

  const handlePlay = $(async () => {
    if (state.messages.length) {
      const getLiterraly = state.messages.pop();
      getLiterraly?.message;
      state.after = `
          await window.WSBOT.delaySendMessage(10, 'message', {
            from: '000',
            body: '${getLiterraly?.message}',
        })`;

      console.log(state.after);
    }
    const mergeCode = [state.preamble, state.code, state.after].join(" \n ");
    const fullCode = `
      const MAIN_FUNCTION_PRINCIPAL_SCOPE = async () => {
          ${mergeCode}
      }
      MAIN_FUNCTION_PRINCIPAL_SCOPE().then()
    `;
    const resultExection = await getCompileCode(fullCode, "index.js")();
    state.result = resultExection?.outputFiles[0].text;
    if (state.result) await executeCode(state.result);
  });

  useClientEffect$(({ track }) => {
    track(() => state.messages);
    handlePlay();
    window.WSBOT = {
      bridgeEvents: new BroadcastChannel("bridge-events"),
  
    }
    window.WSBOT.bridgeEvents.onmessage = (messageEvent: any) => {
      console.log('........................', messageEvent.data)
    }

  });

  /**
   * RUN Transformation and runtime
   */

  return (
    <div class={"flex gap-3"}>
      <div class={"w-full border-r  border-gray-100 "}>
        <QMonaco />
      </div>
      <div class={"w-1/2"}>
        <Device />
      </div>
    </div>
  );
});
