import {
  component$,
  useClientEffect$,
  useContext,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { initEsbuild, loadWinEvent } from "~/utils/execute-code";

export default component$(() => {

  const state = useContext(ExecuteCtx)

  const location = useLocation();
  useClientEffect$(() => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug

    initEsbuild()();
    loadWinEvent((messageEvent: any) => {
      state.messages = state.messages.concat([{ message: messageEvent.data.message, direction: "out" }])
    })
  });

  return <QPlayground />;
});
