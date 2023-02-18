import { component$, useBrowserVisibleTask$, useContext } from "@builder.io/qwik";
import { DocumentHead,  useNavigate, Link } from "@builder.io/qwik-city";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { UUIDGeneratorBrowser } from "~/utils/uuid-browser";

export default component$(() => {
  const navigate = useNavigate();
  const state = useContext(ExecuteCtx)

  useBrowserVisibleTask$(async () => {
    const slug = UUIDGeneratorBrowser();
    state.workspace = slug
    // console.log('__________',location.params?.slug?.length)
    // if (!location.params?.slug?.length) await navigate(`/workspace/${slug}`);
  });

  return (<div>
    <Link href={`workspace/${state.workspace}`}>Ir a mi workspace</Link>
  </div>);
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
