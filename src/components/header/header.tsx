import {
  $,
  component$,
  useBrowserVisibleTask$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { apiSaveWorkspace } from "~/services/api";
import ButtonLight from "~/ui/button-light";
import Toast from "~/ui/toast";
import { Logo } from "../icons/logo";

export default component$(() => {
  const state = useContext(ExecuteCtx);
  const saving = useSignal(false);

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
    saving.value = true;
    if (state.workspace) await apiSaveWorkspace(state.workspace, state.code);
    saving.value = false;
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
    <>
      <header
        class={
          "bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 dark:border-gray-800 border-gray-100 h-[60px]"
        }
      >
        <div class="logo flex gap-3">
          <a href="/" target="_blank" title="Chatbot Whatsapp">
            <Logo />
          </a>
          <button
            disabled={saving.value}
            onClick$={saveWorkspace$}
            class={"btn-seconday disabled:opacity-30"}
          >
            Compartir
          </button>
        </div>

        <ul class={"flex items-center gap-5 justify-end py-3 dark:text-white"}>
          <li>
            <a href="https://bot-whatsapp.netlify.app/docs/" target={"_blank"}>
              Documentación
            </a>
          </li>
          <li>
            <a href="https://link.codigoencasa.com/DISCORD" target={"_blank"}>
              Discord
            </a>
          </li>
          <li class={"pl-4"}>
            <ButtonLight onClick$={handleTheme$} />
          </li>
        </ul>
      </header>
      <Toast />
    </>
  );
});
