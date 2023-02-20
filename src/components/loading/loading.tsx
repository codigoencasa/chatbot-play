import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div
      class={
        "fixed top-0 left-0 z-10 w-full h-full backdrop-blur-sm bg-white/30 flex justify-center items-center content-center"
      }
    >
      <div class={"font-semibold dark:text-white text-base"}>Loading...</div>
    </div>
  );
});
