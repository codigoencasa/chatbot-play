import { component$, Slot, useContextProvider, useStore } from '@builder.io/qwik';
import { MessageCTX } from '~/contexts/message';
import Header from '../components/header/header';

export default component$(() => {
  const state = useStore<{messages:any[]}>({messages:[]})
  useContextProvider(MessageCTX, state);

  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
