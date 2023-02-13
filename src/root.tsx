import { component$,  useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import globalStyles from '~/assets/styles/global.css?inline';

export const PREAMBLE = `
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

export const CODE = `



const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const WebWhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('Cual es tu mail',{ capture: true }, async (ctx, {fallBack}) => {
        console.log('--->',ctx)
        if(!ctx.body.includes('@')) return fallBack()
    })
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


export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  useStyles$(globalStyles);
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
      <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
