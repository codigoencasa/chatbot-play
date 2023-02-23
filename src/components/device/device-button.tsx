import { component$, QRL } from "@builder.io/qwik";

export default component$(
  (props: { text: string; onClick$: QRL<any>; disabled?: boolean }) => {
    return (
      <button
        disabled={props.disabled}
        onClick$={props.onClick$}
        class={
          "bg-white/80 hover:bg-white/100 cursor-pointer text-blue-600 text-sm p-2 rounded-lg drop-shadow-md"
        }
      >
        {props.text}
      </button>
    );
  }
);
