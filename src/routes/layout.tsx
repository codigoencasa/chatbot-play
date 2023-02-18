import { component$, Slot, useContextProvider, useStore } from "@builder.io/qwik";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { PREAMBLE } from "~/data/preamble";
import { SAMPLE } from "~/data/sample";
import Header from "../components/header/header";

export default component$(() => {
  const state = useStore<IExecute>({
    code: SAMPLE,
    loading: false,
    preamble: PREAMBLE,
    messages: [],
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
