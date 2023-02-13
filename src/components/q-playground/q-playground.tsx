import { $, component$, useClientEffect$, useContext } from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { executeCode, getCompileCode } from "~/utils/execute-code";
import Device from "../device/device";
import { QMonaco } from "./q-monaco/q-monaco";

declare global {
  interface Window {
    WSBOT: any;
  }
}

export const QPlayground = component$(() => {
  const state = useContext(ExecuteCtx);

  const handlePlay = $(async () => {
    if(!state.running) return
    if (state.messages.length) {
      const getLiterraly = state.messages[state.messages.length -1];
      getLiterraly?.message;
      state.after = `
          await window.WSBOT.delaySendMessage(10, 'message', {
            from: '000',
            body: '${getLiterraly?.message}',
        })`;
    }
    const mergeCode = [state.preamble, state.code, state.after].join(" \n ");
    const fullCode = `
      const MAIN_FUNCTION_PRINCIPAL_SCOPE = async () => {
          ${mergeCode}
      }
      MAIN_FUNCTION_PRINCIPAL_SCOPE().then()
    `;
    const resultExection = await getCompileCode(fullCode, "index.js")();
    console.log(`🙌🙌🙌`,resultExection)
    state.result = resultExection?.outputFiles[0].text;
    if (state.result) await executeCode(state.result)
    state.running = false
  });

  useClientEffect$(({ track }) => {
    track(() => state.running);
    handlePlay();
  });

  /**
   * RUN Transformation and runtime
   */

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
