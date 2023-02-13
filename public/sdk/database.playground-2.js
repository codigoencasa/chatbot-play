const dbFs = require('idb-managed')

class JsonFileAdapter {
    db
    pathFile
    listHistory = []
    options = { filename: 'db.json' }

    constructor(options = {}) {
        this.options = { ...this.options, ...options }
        this.pathFile = 'CHATBOT_DB'
        this.init().then()
    }

    /**
     * Revisamos si existe o no el json file
     * @returns
     */
    init = async () => {
        this.db = new dbFs.CustomDB({
            dbName: this.pathFile,
            dbVersion: 1,
            itemDuration: 5000 * 3600,
            tables: {
                HISTORY: {},
            }
        });
    }

    validateJson = (raw) => {
        try {
            return JSON.parse(raw)
        } catch (e) {
            return {}
        }
    }

    /**
     * Buscamos el ultimo mensaje por numero
     * @param {*} from
     * @returns
     */
    getPrevByNumber = async (from) => {
        console.log(`📄📄📄📄📄📄📄📄📄📄📄📄`)
        const history = await this.db.getItemsInRange({
            tableName: 'HISTORY',
        });
        
        if (!history.length) {
            return []
        }
        
        const result = history
        .slice()
        .reverse()
        .filter((i) => !!i.keyword)
        
        const lastMessage = result.find((a) => a.from === from)
        console.log(`****OBTENER_ULTIMO*****`, lastMessage)
        return lastMessage
    }

    /**
     * Guardar dato
     * @param {*} ctx
     */
    save = async (ctx) => {
        console.log(`🚀🚀🚀🚀 GUARDANDO...`,ctx)
        this.listHistory.push(ctx)
        await this.db.addItems([
            {
                tableName: 'HISTORY',
                item: ctx
            }
        ])
    }
}

module.exports = JsonFileAdapter
