import { component$, Signal, Slot } from "@builder.io/qwik";
import Button from "~/ui/button";

export default component$((props: { time?: number; show: Signal<boolean> }) => {
  return (
    <>
      {props.show?.value ? (
        <div
          class={
            "fixed top-0 left-0 z-50 w-full h-full backdrop-blur-sm bg-white/10 flex justify-center items-center content-center"
          }
        >
          <div class={'flex flex-col gap-2'}>
            <div><Slot /></div>
            <div>
                <Button label="Cerrar" onClick$={() => props.show.value = false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
