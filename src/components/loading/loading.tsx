import { component$ } from "@builder.io/qwik";

export default component$((props:{message?:string}) => {
  return (
    <div
      class={
        "fixed top-0 left-0 z-50 w-full h-full backdrop-blur-xl bg-white/30 flex justify-center items-center content-center"
      }
    >
      <div class={"font-semibold dark:text-white text-base"}>{props.message}</div>
    </div>
  );
});
