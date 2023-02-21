const { ProviderClass } = require("@bot-whatsapp/bot");

class MockProvider extends ProviderClass {
  constructor() {
    super();
    if (typeof window !== "undefined") this.init();
  }

  init = () => {
    window.delaySendMessage = (miliseconds, eventName, payload) => {
      return new Promise((res) =>
        setTimeout(() => {
          this.emit(eventName, payload);
          res;
        }, miliseconds)
      );
    };
  };

  /**
   * @alpha
   * @param {string} number
   * @param {string} message
   * @example await sendMessage('+XXXXXXXXXXX', 'https://dominio.com/imagen.jpg' | 'img/imagen.jpg')
   */

  sendMedia = async (from, file, message) => {
    const parseMessage = {
      from,
      message,
      file,
      templateButtons : [],
      direction: "out",
    };
    window.bc(() => parseMessage);
    return Promise.resolve(parseMessage);
  };

  /**
   * Mock buttons
   * @param {*} from
   * @param {*} text
   * @param {*} buttons
   * @returns
   */
  sendButtons = async (from, _, buttons) => {
    const templateButtons = buttons.map((btn, i) => ({
      buttonId: `id-btn-${i}`,
      buttonText: { displayText: btn.body },
      type: 1,
    }));

    const parseMessage = {
      from,
      message:'',
      file: null,
      templateButtons,
      direction: "out",
    };
    window.bc(() => parseMessage);
    return Promise.resolve(parseMessage);
  };

  /**
   *
   * @param {*} from
   * @param {*} message
   * @returns
   */

  sendText = async (from, message) => {
    const parseMessage = {
      from,
      message,
      file: null,
      templateButtons: [],
      direction: "out",
    };
    window.bc(() => parseMessage);
    return Promise.resolve(parseMessage);
  };

  /**
   *
   * @param {*} from
   * @param {*} message
   * @param {*} param2
   * @returns
   */
  sendMessage = async (from, message, { options }) => {
    if (options?.buttons?.length)
      return this.sendButtons(from, message, options.buttons);
    if (options?.media) return this.sendMedia(from, options.media, message);
    return this.sendText(from, message);
  };
}

module.exports = MockProvider;
