import {
  component$,
  useBrowserVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import { DocumentHead, useLocation } from "@builder.io/qwik-city";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { UUIDGeneratorBrowser } from "~/utils/uuid-browser";

export default component$(() => {
  const state = useContext(ExecuteCtx);
  const location = useLocation();

  useBrowserVisibleTask$(async () => {
    const slug = UUIDGeneratorBrowser();
    state.workspace = slug;
    // if (!location.params?.slug?.length) await navigate(`/workspace/${slug}`);
    if (!location.params?.slug?.length)
      window.location.replace(`/workspace/${slug}`);
  });

  return <div>Redireccionando...</div>;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
