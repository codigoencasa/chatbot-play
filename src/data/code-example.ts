export const SAMPLE_CODE = `const { createBot, createFlow, addKeyword } = require("@bot-whatsapp/bot");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flujoPrincipal = addKeyword("hola").addAnswer("Buenas!");

const main = async () => {
const adapterDB = new MockAdapter();
const adapterFlow = createFlow([flujoPrincipal]);

    createBot({
        provider: provider,
        database: adapterDB,
        flow: adapterFlow,
    });

};

main();
`