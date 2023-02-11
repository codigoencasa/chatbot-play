import {
  component$,
  useClientEffect$,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { QPlayground } from "~/components/q-playground/q-playground";
import { ExecuteCtx, IExecute } from "~/contexts/execute.ctx";
import { GeneralCTX, IGeneralCtx } from "~/contexts/general.ctx";
import { initEsbuild } from "~/utils/execute-code";

export default component$(() => {
  const PREAMBLE = `
  (() => {
  
    globalThis.process = {
      env: {
        NODE_ENV: "dev",
      },
      stdout: {
        isTTY: null
      },
      cwd:() => null
    }
  
    if(typeof fs !== 'undefined') fs.prototype.createWriteStream = () => console.log('createWriteStream')
  
  })()`

  const CODE =`
  const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

  const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
  const MockAdapter = require('@bot-whatsapp/database/mock')
  
  const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
      .addAnswer(['Hola, bienvenido a mi tienda', '¿Como puedo ayudarte?'])
      .addAnswer(['Tengo:', 'Zapatos', 'Bolsos', 'etc ...'])
  
  /**
   * Esta es la funcion importante es la que realmente inicia
   * el chatbot.
   */
  const adapterProvider = createProvider(WebWhatsappProvider)
  const main = async () => {
      const adapterDB = new MockAdapter()
      const adapterFlow = createFlow([flowPrincipal])

      createBot({
          flow: adapterFlow,
          provider: adapterProvider,
          database: adapterDB,
      })

  }
  
  main()
  `

  const state = useStore<IExecute>({ code: CODE, loading: false, preamble:PREAMBLE, messages:[] });

  const stateGeneral = useStore<IGeneralCtx>({
    messages:[],
    runkitrunning:false,
    slug:''
  })
  
  useContextProvider(ExecuteCtx, state);
  useContextProvider(GeneralCTX, stateGeneral)

  const location = useLocation();
  useClientEffect$(() => {
    const slug = location.params?.slug ?? null;
    state.workspace = slug

    initEsbuild()();
  });

  return <QPlayground />;
});
