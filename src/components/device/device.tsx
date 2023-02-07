import {
  $,
  component$,
  noSerialize,
  useClientEffect$,
  useContext,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { io } from "socket.io-client";
// @ts-ignore
import logoSrc from "~/assets/images/chatbot-whatsapp.png?width=64&height=64&png";
import { SOCKET_ENDPOINT } from "~/constants";
import { GeneralCTX } from "~/contexts/general.ctx";

export const DeviceHeader = () => {
  return (
    <div
      class={
        "bg-[#128C7E] h-[60px] content-center items-center flex gap-2 px-2 rounded-t-lg justify-between "
      }
    >
      <div
        class={
          "bg-white rounded-full flex items-center content-center w-[40px] h-[40px]"
        }
      >
        <img
          class={"object-cover rounded-full"}
          width={38}
          height={38}
          src={logoSrc}
          alt=""
        />
      </div>
      <div class={" w-full flex content-center items-center px-2"}>
        <span class={"text-white font-semibold"}>Bot</span>
      </div>
    </div>
  );
};

export const BodyFooter = component$(() => {
  const stateGeneral = useContext(GeneralCTX);
  return (
    <div
      class={
        "bg-[#FEF3EE] overflow-y-auto h-full content-center  flex gap-2 p-3 justify-between "
      }
    >
      <ul class={"flex flex-col gap-2 font-semibold w-full"}>
        {stateGeneral.messages.map((msg: any) => (
          <li
            class={{
              "w-full flex justify-end": msg?.direction === "in",
              "w-fsull flex justify-send": msg?.direction === "out",
            }}
          >
            <span
              class={{
                "bg-[#DCF7C9] shadow px-2 py-1 rounded-lg":
                  msg?.direction === "in",
                "bg-white shadow px-2 py-1 rounded-lg":
                  msg?.direction === "out",
              }}
            >
              {msg?.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const DeviceFooter = component$((props: { socket: any }) => {
  const stateGeneral = useContext(GeneralCTX);

  const store = useStore({
    value: "",
  });

  const handleMessage = $(() => {
    const payload = {
      slug: stateGeneral.slug,
      message: store.value,
    };

    stateGeneral.messages = stateGeneral.messages.concat({
      message: store.value,
      direction: "in",
    });

    store.value = "";
    props.socket.value?.emit("ping", payload);
  });

  return (
    <form
      preventdefault:submit
      onSubmit$={handleMessage}
      class={
        "bg-white h-[60px] content-center items-center flex gap-2  rounded-b-lg justify-between "
      }
    >
      <input
        value={store.value}
        onInput$={(ev: any) => (store.value = ev?.target?.value)}
        class={"outline-none w-full h-full rounded-b-lg px-2"}
        placeholder="Mensaje..."
      />
      <button class={"bg-red-400"}>Enviar</button>
    </form>
  );
});

export default component$(() => {
  const stateGeneral = useContext(GeneralCTX);
  const stateIo = useSignal<any>();

  useClientEffect$(() => {
    const socket = io(SOCKET_ENDPOINT, {
      reconnectionDelayMax: 10000,
    });


    stateIo.value = noSerialize(socket);

    socket.emit("join", { slug: stateGeneral.slug });
    socket.on("pong", (arg: { message: string }) => {
      stateGeneral.messages = stateGeneral.messages.concat({
        message: arg.message,
        direction: "out",
      });
      console.log("Pong componente...", arg);
    });
  });

  return (
    <div
      class={
        "bg-white drop-shadow-xl  flex flex-col justify-between  h-full rounded-lg w-full"
      }>
      <DeviceHeader />
      <BodyFooter />
      <DeviceFooter socket={stateIo} />
    </div>
  );
});
