import {
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { stat } from "fs";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { PREAMBLE } from "~/data/preamble";
import { SAMPLE } from "~/data/sample";
import { initBroadcastChannel } from "~/utils/brodcast";
import { initEsbuild } from "~/utils/execute-code";

export default component$(() => {
  const state = useStore<IExecute>({
    code: SAMPLE,
    loading: false,
    preamble: PREAMBLE,
    messages: [],
  });

  useContextProvider(ExecuteCtx, state);

  const location = useLocation();
  useClientEffect$(async ({track}) => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug;
    const addMessage = (inMessage: any) => {
      const msg = state.messages;
      state.messages = msg.concat([inMessage]);
      console.log(state.messages);
    };
    initBroadcastChannel(addMessage);
    await initEsbuild();
    state.ready = true
  });

  return <QPlayground />;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
