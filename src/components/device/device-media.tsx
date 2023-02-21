import { component$, useSignal } from "@builder.io/qwik";
import Button from "~/ui/button";

export default component$(({ media }: { media: string | undefined }) => {
  const state = useSignal<"image" | "video" | "file">("image");
  return (
    <>
      {media && media.length ? (
        <div class={"relative w-fit"}>
          {state.value === "image" ? (
            <img
              class={"rounded-lg  w-full"}
              onError$={() => (state.value = "video")}
              src={media}
              alt=""
            />
          ) : null}
          {state.value === "video" ? (
            <video
              controls
              width={300}
              class={"rounded-lg w-full"}
              onError$={() => (state.value = "file")}
              src={media}
            />
          ) : null}
          {state.value === "file" ? (
            <div class={"rounded-lg w-full h-14"}>
              <Button label="Ver adjunto" />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
});
