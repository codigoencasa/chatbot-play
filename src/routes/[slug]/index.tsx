import { component$, useClientEffect$, useStore } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { io } from "socket.io-client";
import Device from "~/components/device/device";
import { PREAMBLE } from "~/data/preamble";
import { SOCKET_ENDPOINT } from "~/constants";
import Runkit from "~/components/runkit/runkit";

export default component$(() => {
  const location = useLocation();
  const state = useStore<{ messages: any[]; slug: string }>({
    messages: [],
    slug: "",
  });

  useClientEffect$(() => {
    const slug = location.params?.slug ?? null;
    state.slug = slug;
    const socket = io(SOCKET_ENDPOINT, {
      reconnectionDelayMax: 10000,
    });


    console.log('----------->',SOCKET_ENDPOINT, slug)
    socket.emit("join", { slug: slug });
    socket.on("pong", (arg: { message: any }) => {
      const currentMsg = state.messages;
      state.messages = [...currentMsg, arg.message];
      console.log("Pong componente...", arg);
    });

  });

  return (
    <div
      class={"relative bg-gray-100 p-2 px-4 h-[calc(100vh_-_60px)] flex gap-2"}
    >
      <div class={"w-full relative z-20 "}>
        <Runkit
          preamble={PREAMBLE({ slug: state.slug, socketUrl: SOCKET_ENDPOINT })}
        />
      </div>
      <div class={"w-1/2 relative  bg-gray-100 "}>
        <Device
          messages={[
            {
              message: "Hola",
              direction:'in'
            },
            {
              message: "Buenas",
              direction:'out'
            }
          ]}
        />
      </div>
    </div>
  );
});
