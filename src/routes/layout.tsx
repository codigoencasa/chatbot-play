import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { PREAMBLE } from "~/data/preamble";
import { SAMPLE } from "~/data/sample";
import Header from "../components/header/header";

export default component$(() => {
  const state = useStore<IExecute>({
    code: SAMPLE,
    loading:true,
    preamble: PREAMBLE,
    messages: [],
    theme:'vs-light'
  });

  useContextProvider(ExecuteCtx, state);
  return (
    <div>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
    </div>
  );
});
