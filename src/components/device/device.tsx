import { $, component$, Signal, useContext, useSignal } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
// @ts-ignore
import logoSrc from "~/assets/images/chatbot-whatsapp.png?width=64&height=64&png";
import { ExecuteCtx } from "~/contexts/execute.ctx";
import { VITE_URL } from "~/constants";
import DeviceText from "./device-text";
import DeviceMedia from "./device-media";
import Button from "~/ui/button";
import DeviceButton from "./device-button";
// import { apiSaveWorkspace } from "~/services/api";

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
        <Button
          label="Limpiar"
          onClick$={() => {
            state.messages = [];
          }}
        />
      </div>
    </div>
  );
});

export const Body = component$((props: { messages: any[], sendMessage: QRL<any>, loading:Signal<boolean>   }) => {
  return (
    <div
      class={
        "bg-[#FEF3EE] dark:bg-gray-700 scrollbar-thumb-gray-300 scrollbar-track-slate-50 dark:scrollbar-thumb-blue-100/20 dark:scrollbar-track-gray-700 scrollbar-thin overflow-y-auto h-full content-center dark:rounded-lg flex gap-2 p-3 justify-between "
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
            <div class={"flex flex-col gap-1"}>
              {!msg?.templateButtons?.length ? (
                <div
                  class={{
                    "bg-[#DCF7C9] shadow px-2 py-1 rounded-lg":
                      msg?.direction === "in",
                    "bg-white shadow px-2 py-1 rounded-lg":
                      msg?.direction === "out",
                  }}
                >
                  <DeviceText text={msg.message} />
                  <DeviceMedia media={msg?.file} />
                </div>
              ) : null}
              {msg?.templateButtons?.map((btn: any) => (
                <DeviceButton onClick$={() => {
                  props.sendMessage(btn?.buttonText?.displayText);
                }} disabled={props.loading.value} text={btn?.buttonText?.displayText} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export const DeviceFooter = component$((props: { sendMessage: QRL<any>, loading:Signal<boolean> }) => {
  const store = useSignal<string>();

  return (
    <form
      preventdefault:submit
      onSubmit$={() => {
        props.loading.value = true
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
        class={
          "outline-none w-full h-full rounded-b-lg px-2 bg-white dark:text-white dark:bg-gray-800"
        }
        placeholder="Mensaje..."
      />
      <button disabled={props.loading.value} class={"btn-primary disabled:opacity-30"}>Enviar</button>
    </form>
  );
});

export default component$(() => {
  const state = useContext(ExecuteCtx);
  const stateSending = useSignal(false)

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
    stateSending.value = true
    state.messages = state.messages.concat({
      message: inMessage,
      direction: "in",
    });
    await sendEvent(inMessage);
    stateSending.value = false
  });

  return (
    <div
      class={
        "bg-white dark:bg-gray-800 flex flex-col justify-between rounded-lg drop-shadow-xl border-4 dark:border-gray-800 border-white h-full  w-full"
      }
    >
      <DeviceHeader />
      <Body messages={state.messages} sendMessage={sendMessage$} loading={stateSending} />
      <DeviceFooter sendMessage={sendMessage$} loading={stateSending} />
    </div>
  );
});
