import { component$ } from "@builder.io/qwik";

export const QLog = component$(() => {
  return (
    <div class="text-gray-300 relative h-full">
      <div class="flex items-center justify-between px-3 h-9">
        <button
          onClick$={() => console.log('CLICICICC')}
          class="editor-button h-5 mr-3"
        >
          Clear
        </button>
      </div>

      <div class="h-80 overflow-auto">
        CONSOLA 🚀
      </div>
    </div>
  );
});
