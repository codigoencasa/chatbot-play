import { component$, QRL } from "@builder.io/qwik";

export default component$(
  (props: { onClick$?: QRL<any>; theme?: string; label: string }) => {
    return (
      <button class={"btn-light"} onClick$={props.onClick$}>
        {props.label}
      </button>
    );
  }
);
