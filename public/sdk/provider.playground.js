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

  sendMessage = async (from, message) => {
    window.bc(() => ({ from, message, direction: 'out' }));
    return Promise.resolve({  from, message, direction: 'out' });
  };
}

module.exports = MockProvider;
