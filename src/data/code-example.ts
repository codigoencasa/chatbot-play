export const SAMPLE_CODE = `const { createBot, createProvider, createFlow, addKeyword } = require("@bot-whatsapp/bot");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flujoPrincipal = addKeyword("hola").addAnswer("Buenas!");

const main = async () => {
const adapterDB = new MockAdapter();
const adapterFlow = createFlow([flujoPrincipal]);
const provider = createProvider(PlaygroundProvider);

createBot({
    provider: provider,
    database: adapterDB,
    flow: adapterFlow,
});

provider.delaySendMessage(100, "message", {
    from: "000",
    body: "hola",
});
};

main();
`