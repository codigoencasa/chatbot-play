import { component$, useContext } from "@builder.io/qwik";
import { ExecuteCtx } from "~/contexts/execute.ctx";

export const QIframe = component$(() => {
  const state = useContext(ExecuteCtx);

  return <div>AQUI:{state.code}</div>;
});
