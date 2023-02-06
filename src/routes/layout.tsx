import { component$, Slot } from "@builder.io/qwik";
import Header from "../components/header/header";

export default component$(() => {
  return (
    <div >
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
    </div>
  );
});
