import {
  $,
  component$,
  useBrowserVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import Loading from "~/components/loading/loading";
import { QPlayground } from "~/components/q-playground/q-playground";
import { VITE_URL } from "~/constants";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { SAMPLE } from "~/data/sample";
import { initBroadcastChannel } from "~/utils/brodcast";
import { initEsbuild } from "~/utils/execute-code";

export default component$(() => {
  const state = useContext(ExecuteCtx);

  const getCode = $((slug: string) => {
    return fetch(`${VITE_URL}/api/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  });

  const location = useLocation();
  useBrowserVisibleTask$(async () => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug;

    const data = await getCode(state.workspace);
    state.code = data?.code ?? SAMPLE;

    const addMessage = (inMessage: any) => {
      const msg = state.messages;
      state.messages = msg.concat([inMessage]);
    };
    initBroadcastChannel(addMessage);
    await initEsbuild();
    state.ready = true;
    state.loadingMessage = undefined
    state.loading = false;
  });

  return (
    <div>
      {state.loading ? <Loading message={state.loadingMessage} /> : null}
      <QPlayground />
    </div>
  );
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot Play`,
  };
};
