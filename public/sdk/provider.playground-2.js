const { ProviderClass } = require('@bot-whatsapp/bot')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
class MockProvider extends ProviderClass {
    constructor() {
        super()
        if (typeof window !== 'undefined') this.init()
    }

    init = () => {
        window.WSBOT.delaySendMessage = (miliseconds, eventName, payload) => {
            return new Promise((res) =>
                setTimeout(() => {
                    this.emit(eventName, payload)
                    res
                }, miliseconds)
            )
        }

    }

    sendMessage = async (userId, message) => {
        await delay(1500)
        window.WSBOT.bridgeEvents.postMessage({ userId, message });
        return Promise.resolve({ userId, message })
    }

}

module.exports = MockProvider