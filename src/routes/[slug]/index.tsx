import {
  $,
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { CODE, PREAMBLE } from "~/root";
import { initEsbuild, loadWinEvent } from "~/utils/execute-code";

// export const getProductData = loader$(({ params }) => {
//   const product = db.getProduct({ id: params.productId });
//   return product;
// });


export default component$(() => {

  const state = useStore<IExecute>({ code: CODE, loading: false, preamble: PREAMBLE, messages: [] });

  useContextProvider(ExecuteCtx, state);

  const handleCb = $((messageEvent: any) => {
    state.messages = state.messages.concat([{ message: messageEvent.data.message, direction: "out" }])
  })

  const location = useLocation();
  useClientEffect$(async() => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug
    await initEsbuild();
    loadWinEvent(handleCb)
    loadWinEvent(handleCb)
  });

  return <QPlayground />;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};