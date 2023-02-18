import { component$, useBrowserVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, useLocation, useNavigate } from "@builder.io/qwik-city";
import { UUIDGeneratorBrowser } from "~/utils/uuid-browser";

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useBrowserVisibleTask$(() => {
    const slug = UUIDGeneratorBrowser();
    if (!location.params?.slug) navigate(`/workspace/${slug}`)
    return () => null;
  });

  return <>Redirect...</>;
});

export const head: DocumentHead = () => {
  return {
    title: `Chatbot (Playground)`,
  };
};
