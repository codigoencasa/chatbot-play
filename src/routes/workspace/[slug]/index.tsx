import {
  component$,
  useBrowserVisibleTask$,
  useContext,

} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { initBroadcastChannel } from "~/utils/brodcast";
import { initEsbuild } from "~/utils/execute-code";

export default component$(() => {

  const state = useContext(ExecuteCtx)

  const location = useLocation();
  useBrowserVisibleTask$(async () => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug;
    const addMessage = (inMessage: any) => {
      const msg = state.messages;
      state.messages = msg.concat([inMessage]);
    };
    initBroadcastChannel(addMessage);
    await initEsbuild();
    state.ready = true;
  });

  return <QPlayground />;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
