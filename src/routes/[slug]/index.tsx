import {
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { CODE, PREAMBLE } from "~/root";
import { initEsbuild, loadWinEvent } from "~/utils/execute-code";

export default component$(() => {

  const state = useStore<IExecute>({ code: CODE, loading: false, preamble: PREAMBLE, messages: [] });

  useContextProvider(ExecuteCtx, state);

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
