import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
// @ts-ignore
import logoSrc from "~/assets/images/chatbot-whatsapp.png?width=64&height=64&png";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { VITE_URL } from "~/constants";
import { apiSaveWorkspace } from "~/services/api";

export const DeviceHeader = component$(() => {
  const state = useContext(ExecuteCtx);
  return (
    <div
      class={
        "bg-[#128C7E] dark:bg-gray-800 text-white h-[60px] content-center items-center flex gap-2 px-2 justify-between  rounded-t-lg"
      }
    >
      <div>
        <img
          class={"object-cover rounded-full"}
          width={38}
          height={38}
          src={logoSrc}
          alt=""
        />
      </div>
      <div class={" w-full flex content-center items-center px-2"}>
        <span class={" font-semibold"}>Bot</span>
      </div>
      <div class={"flex gap-5"}>
        <button
          class={"btn-light"}
          onClick$={() => {
            state.messages = [];
          }}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
});

export const BodyFooter = component$((props: { messages: any[] }) => {
  return (
    <div
      class={
        "bg-[#FEF3EE] dark:bg-gray-700 overflow-y-auto h-full content-center dark:rounded-lg flex gap-2 p-3 justify-between "
      }
    >
      <ul class={"flex flex-col gap-2 font-normal w-full"}>
        {props.messages.map((msg: any) => (
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

export const DeviceFooter = component$((props: { sendMessage: QRL<any> }) => {
  const store = useSignal<string>();

  return (
    <form
      preventdefault:submit
      onSubmit$={() => {
        props.sendMessage(store.value);
        store.value = "";
      }}
      class={
        "bg-white dark:bg-gray-800 h-[60px] content-center items-center flex gap-2 px-2  rounded-b-lg justify-between "
      }
    >
      <input
        value={store.value}
        onInput$={(ev: any) => (store.value = ev?.target?.value)}
        class={"outline-none w-full h-full rounded-b-lg px-2 bg-white dark:text-white dark:bg-gray-800"}
        placeholder="Mensaje..."
      />
      <button class={"btn-primary"}>Enviar</button>
    </form>
  );
});

export default component$(() => {
  const state = useContext(ExecuteCtx);

  const sendEvent = $(async (message: string) => {
    await fetch(`${VITE_URL}/api/${state.workspace}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
      redirect: "follow",
    });
  });

  const sendMessage$ = $(async (inMessage: any) => {
    state.messages = state.messages.concat({
      message: inMessage,
      direction: "in",
    });
    await sendEvent(inMessage);
  });

  return (
    <div
      class={
        "bg-white dark:bg-gray-800 flex flex-col justify-between rounded-lg drop-shadow-xl border-4 dark:border-gray-800 border-white h-full  w-full"
      }
    >
      <DeviceHeader />
      <BodyFooter messages={state.messages} />
      <DeviceFooter sendMessage={sendMessage$} />
    </div>
  );
});
