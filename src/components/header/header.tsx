import {
  $,
  component$,
  useBrowserVisibleTask$,
  useContext,
} from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { apiSaveWorkspace } from "~/services/api";
import ButtonLight from "~/ui/button-light";
import { Logo } from "../icons/logo";

export default component$(() => {
  const state = useContext(ExecuteCtx);

  useBrowserVisibleTask$(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
      state.theme = "vs-dark";
      window.localStorage.theme = "dark";
    }
  });

  const saveWorkspace$ = $(async () => {
    if (state.workspace) await apiSaveWorkspace(state.workspace, state.code);
  });

  const handleTheme$ = $(() => {
    if (state.theme === "vs-dark") {
      document.documentElement.classList.remove("dark");
      state.theme = "vs-light";
      window.localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      state.theme = "vs-dark";
      window.localStorage.theme = "dark";
    }
  });

  return (
    <header
      class={
        "bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 dark:border-gray-800 border-gray-100 h-[60px]"
      }
    >
      <div class="logo flex gap-3">
        <a
          href="https://bot-whatsapp.netlify.app/"
          target="_blank"
          title="Chatbot Whatsapp"
        >
          <Logo />
        </a>
        <button onClick$={saveWorkspace$} class={"btn-seconday"}>
          Compartir
        </button>
      </div>

      <ul class={"flex items-center gap-3 justify-end py-3"}>
        <li>
          <ButtonLight onClick$={handleTheme$} />
        </li>
      </ul>
    </header>
  );
});
