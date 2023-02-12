const { ProviderClass } = require('@bot-whatsapp/bot')

class MockProvider extends ProviderClass {
    bridgeEvents
    constructor() {
        super()
        if (typeof window !== 'undefined') this.init()
    }

    init = () => {
        window.WSBOT.delaySendMessage = (miliseconds, eventName, payload) => {
            return new Promise((res) =>
                setTimeout(() => {
                    this.emit(eventName, payload)
                    console.log({ eventName })
                    console.log({ payload })
                    res
                }, miliseconds)
            )
        }

    }

    sendMessage = async (userId, message) => {
        console.log(`Enviando... ${userId}, ${message}`)
        window.WSBOT.bridgeEvents.postMessage({ userId, message });
        return Promise.resolve({ userId, message })
    }

}

module.exports = MockProvider