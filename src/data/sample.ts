export const SAMPLE = `const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fakeHTTP = async()=>{
    console.log('⚡ Server Request!')
    await delay(1500)
    console.log('⚡⚡ Server Return!')
}


const flowCash = addKeyword('cash').addAnswer('Traeme los billetes! 😎')

const flowOnline = addKeyword('paypal')
.addAnswer('Voy generar un link de paypal', null, async (_,{flowDynamic}) => {
    await fakeHTTP()
    await flowDynamic('Esperate.... estoy generando esto toma su tiempo')

})
.addAnswer('Aqui lo tienes 😎😎', null, async (_,{flowDynamic}) => {
    await fakeHTTP()
    await flowDynamic('http://paypal.com')

})
.addAnswer('Apurate!')

const flujoPrincipal = addKeyword('hola')
.addAnswer('¿Como estas todo bien?')
.addAnswer('Espero que si')
.addAnswer('¿Cual es tu email?', {capture:true}, async (ctx,{fallBack}) => {

    if(!ctx.body.includes('@')){
        return fallBack('Veo que no es um mail *bien*')
    }

})
.addAnswer('Voy a validar tu email...', null, async (ctx,{flowDynamic}) => {
    await fakeHTTP()
    return flowDynamic('Email validado correctamten!')

})
.addAnswer('¿Como vas a pagar *paypal* o *cash*?', {capture:true}, async (ctx,{flowDynamic}) => {


},[flowCash, flowOnline])


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)


    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
`;
