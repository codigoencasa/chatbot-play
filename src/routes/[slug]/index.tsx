import {
  component$,
  useClientEffect$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { MessageCTX } from "~/contexts/message";
import { io } from "socket.io-client";
import Device from "~/components/device/device";

declare global {
  let RunKit: any;
}

export default component$(() => {
  const state = useSignal(false);
  const location = useLocation();
  const stateMessage = useContext(MessageCTX);

  //   const listEvents = useSignal([])

  useClientEffect$(() => {
    const slug = location.params?.slug ?? null;
    const connectToSocket = () => {
      const socket = io("http://localhost:3000", {
        reconnectionDelayMax: 10000,
      });
      console.log("Her!");
      socket.emit("join", { slug: slug });
      socket.on("pong", (arg) => {
        const currentMsg = stateMessage.messages;
        stateMessage.messages = [...currentMsg, arg.message];
        console.log("Pong componente...", arg);
      });
    };

    connectToSocket();

    console.log(slug);
    // socket.emit("join", {slug});
    // socket.on("pong", (args) => console.log('pong...',args))

    const script = document.createElement("script");
    const body = document.getElementsByTagName("body")[0];
    script.src = "//embed.runkit.com";
    body.appendChild(script);

    script.addEventListener("load", async () => {
      const notebook = RunKit.createNotebook({
        element: document.getElementById("runkit-id"),
        minHeight: "400px",
        nodeVersion: "16.18.0",
        preamble: `
        function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
        function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
        function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
        const {
          ProviderClass
        } = require('@bot-whatsapp/bot');
        const {
          io
        } = require('socket.io-client');
        const WORKSPACE_SOCKET_URL = 'https://2846-92-58-33-153.ngrok.io'
        const WORKSPACE_SLUG = '${slug}';
        class PlaygroundProvider extends ProviderClass {
          constructor() {
            super();
            _defineProperty(this, "socket", void 0);
            _defineProperty(this, "connect", url => {
              const _socket = io(url, {
                reconnectionDelayMax: 10000
              });
              console.log(url)
              this.socket = _socket;
              this.socket.emit('join', {
                slug: WORKSPACE_SLUG
              });
              this.socket.on('pong', arg => console.log('Pong...', arg));
            });
            _defineProperty(this, "delaySendMessage", (miliseconds, eventName, payload) => new Promise(res => setTimeout(() => {
              this.emit(eventName, payload);
              res;
            }, miliseconds)));
            _defineProperty(this, "sendMessage", async (userId, message) => {
              const payload = {
                userId,
                message
              };
              this.socket.emit('ping', {
                ...payload,
                slug: WORKSPACE_SLUG
              });
              return Promise.resolve(payload);
            });
            this.connect(WORKSPACE_SOCKET_URL);
          }
        }
        module.exports = PlaygroundProvider;
        `,
        hidesActionButton: true,
        source: `
        const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
        const MockAdapter = require('@bot-whatsapp/database/mock')
        
        const flujoPrincipal = addKeyword('hola').addAnswer('Buenas!')
        
        const main = async () => {
            const adapterDB = new MockAdapter()
            const adapterFlow = createFlow([flujoPrincipal])
            const provider = createProvider(PlaygroundProvider)
        
            createBot({
                provider: provider,
                database: adapterDB,
                flow: adapterFlow,
            })
        
            provider.delaySendMessage(100, 'message', {
                from: '000',
                body: 'hola',
            })
        
        }
        
        main()

        `,
      });

      notebook.onEvaluate = () => {
        stateMessage.messages = []
      }
      //   notebook.onLoad = () =>
      //     console.log(notebook.getEndpointURL().then((u: any) => connectToSocket(u)));
      state.value = true;
    });
  });

  return (
    <div>
      <div>
        <Device messages={stateMessage.messages} />
      </div>
      <div id="runkit-id"></div>
    </div>
  );
});
