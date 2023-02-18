import { component$, useBrowserVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { UUIDGeneratorBrowser } from "~/utils/uuid-browser";

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useBrowserVisibleTask$(async () => {
    const slug = UUIDGeneratorBrowser();
    console.log('__________',location.params?.slug?.length)
    if (!location.params?.slug?.length) await navigate(`/workspace/${slug}`);
  });

  return <>Redirecting...</>;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
