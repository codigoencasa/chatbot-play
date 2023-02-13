/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0 = require('crypto');
var require$$4 = require('console');
var require$$5 = require('fs');
var require$$0$1 = require('node:events');

const flatObject$2 = (listArray = []) => {
    const cbNestedList = Array.isArray(listArray) ? listArray : [];

    if (!listArray.length) return {}

    const cbNestedObj = cbNestedList.map(({ ctx }) => ctx?.callbacks).filter((i) => !!i);
    const queueCb = cbNestedObj.reduce((acc, current) => {
        const getKeys = Object.keys(current);
        const parse = getKeys.map((icb, i) => ({
            [icb]: Object.values(current)[i],
        }));
        return [...acc, ...parse]
    }, []);

    const flatObj = {};
    for (const iteration of queueCb) {
        const [keyCb] = Object.keys(iteration);
        flatObj[keyCb] = iteration[keyCb];
    }
    return flatObj
};

var flattener = { flatObject: flatObject$2 };

const crypto = require$$0;

/**
 * Generamos un UUID unico con posibilidad de tener un prefijo
 * @param {*} prefix
 * @returns
 */
const generateRef$3 = (prefix = false) => {
    const id = crypto.randomUUID();
    return prefix ? `${prefix}_${id}` : id
};

/**
 * Genera un HASH MD5
 * @param {*} param0
 * @returns
 */
const generateRefSerialize$2 = ({ index, answer, keyword }) =>
    crypto.createHash('md5').update(JSON.stringify({ index, answer, keyword })).digest('hex');

var hash = { generateRef: generateRef$3, generateRefSerialize: generateRefSerialize$2 };

const { generateRefSerialize: generateRefSerialize$1 } = hash;

/**
 * Crear referencia serializada
 * @param {*} flowJson
 * @returns array[]
 */
const toSerialize$4 = (flowJson) => {
    if (!Array.isArray(flowJson)) throw new Error('Esto debe ser un ARRAY')

    const jsonToSerialize = flowJson.map((row, index) => ({
        ...row,
        refSerialize: `${generateRefSerialize$1({
            index,
            keyword: row.keyword,
            answer: row.answer,
        })}`,
    }));

    return jsonToSerialize
};

var toSerialize_1 = { toSerialize: toSerialize$4 };

const { toSerialize: toSerialize$3 } = toSerialize_1;
/**
 * @deprecate
 * @param answer string
 * @param options {media:string, buttons:[], capture:true default false}
 * @returns
 */
const addChild$3 = (flowIn = null) => {
    if (!flowIn?.toJson) {
        throw new Error('DEBE SER UN FLOW CON toJSON()')
    }
    return toSerialize$3(flowIn.toJson())
};

var addChild_1 = { addChild: addChild$3 };

const toJson$3 = (inCtx) => () => {
    const lastCtx = inCtx.hasOwnProperty('ctx') ? inCtx.ctx : inCtx;
    return lastCtx.json
};

var toJson_1 = { toJson: toJson$3 };

const { flatObject: flatObject$1 } = flattener;
const { generateRef: generateRef$2 } = hash;
const { addChild: addChild$2 } = addChild_1;
const { toJson: toJson$2 } = toJson_1;
/**
 *
 * @param answer string
 * @param options {media:string, buttons:[{"body":"😎 Cursos"}], delay:ms, capture:true default false}
 * @returns
 */
const addAnswer$3 =
    (inCtx) =>
    (answer, options, cb = null, nested = []) => {
        answer = Array.isArray(answer) ? answer.join('\n') : answer;
        /**
         * Todas las opciones referentes a el mensaje en concreto options:{}
         * @returns
         */
        const getAnswerOptions = () => ({
            media: typeof options?.media === 'string' ? `${options?.media}` : null,
            buttons: Array.isArray(options?.buttons) ? options.buttons : [],
            capture: typeof options?.capture === 'boolean' ? options?.capture : false,
            child: typeof options?.child === 'string' ? `${options?.child}` : null,
            delay: typeof options?.delay === 'number' ? options?.delay : 0,
        });

        const getNested = () => {
            let flatNested = [];
            if (Array.isArray(nested)) {
                for (const iterator of nested) {
                    flatNested = [...flatNested, ...addChild$2(iterator)];
                }

                return {
                    nested: flatNested,
                }
            }
            return {
                nested: addChild$2(nested),
            }
        };

        /**
         * Esta funcion aplana y busca los callback anidados de los hijos
         * @returns
         */
        const getCbFromNested = () => flatObject$1(Array.isArray(nested) ? nested : [nested]);

        const callback = typeof cb === 'function' ? cb : () => null;

        const lastCtx = inCtx.hasOwnProperty('ctx') ? inCtx.ctx : inCtx;

        /**
         * Esta funcion se encarga de mapear y transformar todo antes
         * de retornar
         * @returns
         */
        const ctxAnswer = () => {
            const ref = `ans_${generateRef$2()}`;

            const options = {
                ...getAnswerOptions(),
                ...getNested(),
                keyword: {},
                callback: !!cb,
            };

            const json = [].concat(inCtx.json).concat([
                {
                    ref,
                    keyword: lastCtx.ref,
                    answer,
                    options,
                },
            ]);

            getCbFromNested();
            const callbacks = {
                ...inCtx.callbacks,
                ...getCbFromNested(),
                [ref]: callback,
            };

            return {
                ...lastCtx,
                ref,
                answer,
                json,
                options,
                callbacks,
            }
        };

        /// Retornar contexto no colocar nada más abajo de esto
        const ctx = ctxAnswer();

        return {
            ctx,
            ref: ctx.ref,
            addAnswer: addAnswer$3(ctx),
            toJson: toJson$2(ctx),
        }
    };

var addAnswer_1 = { addAnswer: addAnswer$3 };

const { generateRef: generateRef$1 } = hash;
const { addAnswer: addAnswer$2 } = addAnswer_1;
const { toJson: toJson$1 } = toJson_1;

/**
 *
 * @param {*} message `string | string[]`
 * @param {*} options {sensitive:boolean} default false
 */
const addKeyword$2 = (keyword, options) => {
    if (typeof keyword !== 'string' && !Array.isArray(keyword)) {
        throw new Error('DEBE_SER_STRING_ARRAY_REGEX')
    }

    const parseOptions = () => {
        const defaultProperties = {
            sensitive: typeof options?.sensitive === 'boolean' ? options?.sensitive : false,
            regex: typeof options?.regex === 'boolean' ? options?.regex : false,
        };

        return defaultProperties
    };

    const ctxAddKeyword = () => {
        const ref = `key_${generateRef$1()}`;
        const options = parseOptions();
        const json = [
            {
                ref,
                keyword,
                options,
            },
        ];
        /**
         * Se guarda en db
         */

        return { ref, keyword, options, json }
    };

    const ctx = ctxAddKeyword();

    return {
        ctx,
        ref: ctx.ref,
        addAnswer: addAnswer$2(ctx),
        toJson: toJson$1(ctx),
    }
};

var addKeyword_1 = { addKeyword: addKeyword$2 };

const { generateRef, generateRefSerialize } = hash;
/**
 * @deprecate
 * @param answer string
 * @param options {media:string, buttons:[], capture:true default false}
 * @returns
 */
const toCtx$2 = ({ body, from, prevRef, options = {}, index }) => {
    return {
        ref: generateRef(),
        keyword: prevRef,
        answer: body,
        options: options ?? {},
        from,
        refSerialize: generateRefSerialize({ index, answer: body }),
    }
};

var toCtx_1 = { toCtx: toCtx$2 };

const { addAnswer: addAnswer$1 } = addAnswer_1;
const { addKeyword: addKeyword$1 } = addKeyword_1;
const { addChild: addChild$1 } = addChild_1;
const { toSerialize: toSerialize$2 } = toSerialize_1;
const { toCtx: toCtx$1 } = toCtx_1;
const { toJson } = toJson_1;

var methods = { addAnswer: addAnswer$1, addKeyword: addKeyword$1, addChild: addChild$1, toCtx: toCtx$1, toJson, toSerialize: toSerialize$2 };

let FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY=true;
if (typeof process !== 'undefined') {
	({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
	isTTY = process.stdout && process.stdout.isTTY;
}

const $ = {
	enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== 'dumb' && (
		FORCE_COLOR != null && FORCE_COLOR !== '0' || isTTY
	),

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (!!~str.indexOf(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			!!~this.has.indexOf(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

var kleur = $;

const { yellow, bgRed } = kleur;
const NODE_ENV$1 = process.env.NODE_ENV || 'dev';
const printer$1 = (message, title) => {
    if (NODE_ENV$1 !== 'test') {
        // console.clear()
        if (title) console.log(bgRed(`${title}`));
        console.log(yellow(Array.isArray(message) ? message.join('\n') : message));
        console.log(``);
    }
};

var interactive = { printer: printer$1 };

const delay$1 = (miliseconds) => new Promise((res) => setTimeout(res, miliseconds));

var delay_1 = { delay: delay$1 };

let Queue$1 = class Queue {
    queue = []
    pendingPromise = false

    enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        })
    }

    dequeue() {
        if (this.workingOnPromise) {
            return false
        }
        const item = this.queue.shift();
        if (!item) {
            return false
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                    this.workingOnPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch((err) => {
                    this.workingOnPromise = false;
                    item.reject(err);
                    this.dequeue();
                });
        } catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true
    }
};

var queue_1 = Queue$1;

const { toCtx } = methods;
const { printer } = interactive;
const { delay } = delay_1;
const Queue = queue_1;
const { Console } = require$$4;
const { createWriteStream } = require$$5;

const logger = new Console({
    stdout: createWriteStream(`${process.cwd()}/core.class.log`),
});

const QueuePrincipal = new Queue();

/**
 * [ ] Escuchar eventos del provider asegurarte que los provider emitan eventos
 * [ ] Guardar historial en db
 * [ ] Buscar mensaje en flow
 *
 */
let CoreClass$1 = class CoreClass {
    flowClass
    databaseClass
    providerClass
    generalArgs = { blackList: [] }
    constructor(_flow, _database, _provider, _args) {
        this.flowClass = _flow;
        this.databaseClass = _database;
        this.providerClass = _provider;
        this.generalArgs = { ...this.generalArgs, ..._args };

        for (const { event, func } of this.listenerBusEvents()) {
            this.providerClass.on(event, func);
        }
    }

    /**
     * Manejador de eventos
     */
    listenerBusEvents = () => [
        {
            event: 'preinit',
            func: () => printer('Iniciando proveedor, espere...'),
        },
        {
            event: 'require_action',
            func: ({ instructions, title = '⚡⚡ ACCIÓN REQUERIDA ⚡⚡' }) => printer(instructions, title),
        },
        {
            event: 'ready',
            func: () => printer('Proveedor conectado y listo'),
        },
        {
            event: 'auth_failure',
            func: ({ instructions }) => printer(instructions, '⚡⚡ ERROR AUTH ⚡⚡'),
        },

        {
            event: 'message',
            func: (msg) => this.handleMsg(msg),
        },
    ]

    /**
     * GLOSSARY.md
     * @param {*} messageCtxInComming
     * @returns
     */
    handleMsg = async (messageCtxInComming) => {
        logger.log(`[handleMsg]: `, messageCtxInComming);
        const { body, from } = messageCtxInComming;
        let msgToSend = [];
        let endFlowFlag = false;
        let fallBackFlag = false;
        if (this.generalArgs.blackList.includes(from)) return
        if (!body) return
        if (!body.length) return

        let prevMsg = await this.databaseClass.getPrevByNumber(from);
        const refToContinue = this.flowClass.findBySerialize(prevMsg?.refSerialize);
        console.log('🚩🚩🚩🚩🚩🚩🚩🚩',this.databaseClass)
        if (prevMsg?.ref) {
            const ctxByNumber = toCtx({
                body,
                from,
                prevRef: prevMsg.refSerialize,
            });
            await this.databaseClass.save(ctxByNumber);
        }

        // 📄 Crar CTX de mensaje (uso private)
        const createCtxMessage = (payload = {}, index = 0) => {
            const body = typeof payload === 'string' ? payload : payload?.body ?? payload?.answer;
            const media = payload?.media ?? null;
            const buttons = payload?.buttons ?? [];
            const capture = payload?.capture ?? false;

            return toCtx({
                body,
                from,
                keyword: null,
                index,
                options: { media, buttons, capture },
            })
        };

        // 📄 Limpiar cola de procesos
        const clearQueue = () => {
            QueuePrincipal.pendingPromise = false;
            QueuePrincipal.queue = [];
        };

        // 📄 Finalizar flujo
        const endFlow =
            (flag) =>
            async (message = null) => {
                flag.endFlow = true;
                endFlowFlag = true;
                if (message) this.sendProviderAndSave(from, createCtxMessage(message));
                clearQueue();
                sendFlow([]);
                return
            };

        // 📄 Esta funcion se encarga de enviar un array de mensajes dentro de este ctx
        const sendFlow = async (messageToSend, numberOrId, options = { prev: prevMsg }) => {
            if (options.prev?.options?.capture) await cbEveryCtx(options.prev?.ref);

            const queue = [];
            for (const ctxMessage of messageToSend) {
                if (endFlowFlag) return
                const delayMs = ctxMessage?.options?.delay || 0;
                if (delayMs) await delay(delayMs);
                await QueuePrincipal.enqueue(() =>
                    this.sendProviderAndSave(numberOrId, ctxMessage).then(() => resolveCbEveryCtx(ctxMessage))
                );
            }
            return Promise.all(queue)
        };

        const continueFlow = async () => {
            const currentPrev = await this.databaseClass.getPrevByNumber(from);
            const nextFlow = (await this.flowClass.find(refToContinue?.ref, true)) ?? [];
            const filterNextFlow = nextFlow.filter((msg) => msg.refSerialize !== currentPrev?.refSerialize);
            const isContinueFlow = filterNextFlow.map((i) => i.keyword).includes(currentPrev?.ref);

            if (!isContinueFlow) {
                const refToContinueChild = this.flowClass.getRefToContinueChild(currentPrev?.keyword);
                const flowStandaloneChild = this.flowClass.getFlowsChild();
                const nextChildMessages =
                    (await this.flowClass.find(refToContinueChild?.ref, true, flowStandaloneChild)) || [];
                if (nextChildMessages?.length) return await sendFlow(nextChildMessages, from, { prev: undefined })
            }

            if (!isContinueFlow) {
                await sendFlow(filterNextFlow, from, { prev: undefined });
                return
            }
        };
        // 📄 [options: fallBack]: esta funcion se encarga de repetir el ultimo mensaje
        const fallBack =
            (flag) =>
            async (message = null) => {
                QueuePrincipal.queue = [];
                flag.fallBack = true;
                console.log('😎😎😎😎 FALLBACK ME EXECUTE')
                await this.sendProviderAndSave(from, {
                    ...prevMsg,
                    answer: typeof message === 'string' ? message : message?.body ?? prevMsg.answer,
                    options: {
                        ...prevMsg.options,
                        buttons: prevMsg.options?.buttons,
                    },
                });
                return
            };

        // 📄 [options: flowDynamic]: esta funcion se encarga de responder un array de respuesta esta limitado a 5 mensajes
        // para evitar bloque de whatsapp

        const flowDynamic =
            (flag) =>
            async (listMsg = []) => {
                flag.flowDynamic = true;
                if (!Array.isArray(listMsg)) listMsg = [listMsg];

                const parseListMsg = listMsg.map((opt, index) => createCtxMessage(opt, index));

                if (endFlowFlag) return
                for (const msg of parseListMsg) {
                    await this.sendProviderAndSave(from, msg);
                }
                await continueFlow();
                return
            };

        // 📄 Se encarga de revisar si el contexto del mensaje tiene callback o fallback
        const resolveCbEveryCtx = async (ctxMessage) => {
            if (!ctxMessage?.options?.capture) return await cbEveryCtx(ctxMessage?.ref)
        };

        // 📄 Se encarga de revisar si el contexto del mensaje tiene callback y ejecutarlo
        const cbEveryCtx = async (inRef) => {
            let flags = {
                endFlow: false,
                fallBack: false,
                flowDynamic: false,
                wait: true,
            };

            const provider = this.providerClass;

            if (!this.flowClass.allCallbacks[inRef]) return Promise.resolve()

            const argsCb = {
                provider,
                fallBack: fallBack(flags),
                flowDynamic: flowDynamic(flags),
                endFlow: endFlow(flags),
            };

            await this.flowClass.allCallbacks[inRef](messageCtxInComming, argsCb);
            const wait = !(!flags.endFlow && !flags.fallBack && !flags.flowDynamic);
            if (!wait) await continueFlow();

            return
        };

        // 📄🤘(tiene return) [options: nested(array)]: Si se tiene flujos hijos los implementa
        if (!endFlowFlag && prevMsg?.options?.nested?.length) {
            const nestedRef = prevMsg.options.nested;
            const flowStandalone = nestedRef.map((f) => ({
                ...nestedRef.find((r) => r.refSerialize === f.refSerialize),
            }));

            msgToSend = this.flowClass.find(body, false, flowStandalone) || [];

            await sendFlow(msgToSend, from);
            return
        }

        // 📄🤘(tiene return) Si el mensaje previo implementa capture
        if (!endFlowFlag && !prevMsg?.options?.nested?.length) {
            const typeCapture = typeof prevMsg?.options?.capture;

            if (typeCapture === 'boolean' && fallBackFlag) {
                msgToSend = this.flowClass.find(refToContinue?.ref, true) || [];
                await sendFlow(msgToSend, from);
                return
            }
        }

        msgToSend = this.flowClass.find(body) || [];
        sendFlow(msgToSend, from);
    }

    /**
     * Enviar mensaje con contexto atraves del proveedor de whatsapp
     * @param {*} numberOrId
     * @param {*} ctxMessage ver más en GLOSSARY.md
     * @returns
     */
    sendProviderAndSave = async (numberOrId, ctxMessage) => {
        const { answer } = ctxMessage;
        await this.providerClass.sendMessage(numberOrId, answer, ctxMessage);
        console.log('🫰🫰🫰_',{ ...ctxMessage, from: numberOrId })
        await this.databaseClass.save({ ...ctxMessage, from: numberOrId });
        return
    }

    /**
     * @deprecated
     * @private
     * @param {*} message
     * @param {*} ref
     */
    continue = (message, ref = false) => {
        const responde = this.flowClass.find(message, ref);
        if (responde) {
            this.providerClass.sendMessage(responde.answer);
            this.databaseClass.saveLog(responde.answer);
            this.continue(null, responde.ref);
        }
    }

    /**
     * Funcion dedicada a enviar el mensaje sin pasar por el flow
     * (dialogflow)
     * @param {*} messageToSend
     * @param {*} numberOrId
     * @returns
     */
    sendFlowSimple = async (messageToSend, numberOrId) => {
        const queue = [];
        for (const ctxMessage of messageToSend) {
            const delayMs = ctxMessage?.options?.delay || 0;
            if (delayMs) await delay(delayMs);
            QueuePrincipal.enqueue(() => this.sendProviderAndSave(numberOrId, ctxMessage));
        }
        return Promise.all(queue)
    }
};
var core_class = CoreClass$1;

const { EventEmitter } = require$$0$1;
/**
 * Esta clase debe siempre proporcionar los siguietes metodos
 * sendMessage = Para enviar un mensaje
 *
 * @important
 * Esta clase extiende de la clase del provider OJO
 * Eventos
 *  - message
 *  - ready
 *  - error
 *  - require_action
 */

const NODE_ENV = process.env.NODE_ENV || 'dev';
let ProviderClass$1 = class ProviderClass extends EventEmitter {
    /**
     * events: message | auth | auth_error | ...
     *
     */

    sendMessage = async (userId, message) => {
        if (NODE_ENV !== 'production') console.log('[sendMessage]', { userId, message });
        return message
    }

    getInstance = () => this.vendor
};

var provider_class = ProviderClass$1;

const { toSerialize: toSerialize$1 } = toSerialize_1;
const { flatObject } = flattener;

let FlowClass$1 = class FlowClass {
    allCallbacks = []
    flowSerialize = []
    flowRaw = []
    constructor(_flow) {
        if (!Array.isArray(_flow)) throw new Error('Esto debe ser un ARRAY')
        this.flowRaw = _flow;

        this.allCallbacks = flatObject(_flow);

        const mergeToJsonSerialize = Object.keys(_flow)
            .map((indexObjectFlow) => _flow[indexObjectFlow].toJson())
            .flat(2);

        this.flowSerialize = toSerialize$1(mergeToJsonSerialize);
    }

    find = (keyOrWord, symbol = false, overFlow = null) => {
        keyOrWord = `${keyOrWord}`;
        let capture = false;
        let messages = [];
        let refSymbol = null;
        overFlow = overFlow ?? this.flowSerialize;

        const mapSensitive = (str, mapOptions = { sensitive: false, regex: false }) => {
            if (mapOptions.regex) return new RegExp(str)
            const regexSensitive = mapOptions.sensitive ? 'g' : 'i';
            if (Array.isArray(str)) {
                return new RegExp(str.join('|'), regexSensitive)
            }
            return new RegExp(str, regexSensitive)
        };

        const findIn = (keyOrWord, symbol = false, flow = overFlow) => {
            capture = refSymbol?.options?.capture || false;
            if (capture) return messages

            if (symbol) {
                refSymbol = flow.find((c) => c.keyword === keyOrWord);
                if (refSymbol?.answer) messages.push(refSymbol);
                if (refSymbol?.ref) findIn(refSymbol.ref, true);
            } else {
                refSymbol = flow.find((c) => {
                    const sensitive = c?.options?.sensitive || false;
                    const regex = c?.options?.regex || false;
                    return mapSensitive(c.keyword, { sensitive, regex }).test(keyOrWord)
                });
                if (refSymbol?.ref) findIn(refSymbol.ref, true);
                return messages
            }
        };
        findIn(keyOrWord, symbol);
        return messages
    }

    findBySerialize = (refSerialize) => this.flowSerialize.find((r) => r.refSerialize === refSerialize)

    findIndexByRef = (ref) => this.flowSerialize.findIndex((r) => r.ref === ref)

    getRefToContinueChild = (keyword) => {
        try {
            const flowChilds = this.flowSerialize
                .reduce((acc, cur) => {
                    const merge = [...acc, cur?.options?.nested].flat(2);
                    return merge
                }, [])
                .filter((i) => !!i && i?.refSerialize === keyword)
                .shift();

            return flowChilds
        } catch (e) {
            return undefined
        }
    }

    getFlowsChild = () => {
        try {
            const flowChilds = this.flowSerialize
                .reduce((acc, cur) => {
                    const merge = [...acc, cur?.options?.nested].flat(2);
                    return merge
                }, [])
                .filter((i) => !!i);

            return flowChilds
        } catch (e) {
            return []
        }
    }
};

var flow_class = FlowClass$1;

const CoreClass = core_class;
const ProviderClass = provider_class;
const FlowClass = flow_class;
const { addKeyword, addAnswer, addChild, toSerialize } = methods;

/**
 * Crear instancia de clase Bot
 * @param {*} args
 * @returns
 */
const createBot = async ({ flow, database, provider }, args = {}) => new CoreClass(flow, database, provider, args);

/**
 * Crear instancia de clase Io (Flow)
 * @param {*} args
 * @returns
 */
const createFlow = (args) => {
    return new FlowClass(args)
};

/**
 * Crear instancia de clase Provider
 * Depdendiendo del Provider puedes pasar argumentos
 * Ver Documentacion
 * @param {*} args
 * @returns
 */
const createProvider = (providerClass = class {}, args = null) => {
    const providerInstance = new providerClass(args);
    if (!providerClass.prototype instanceof ProviderClass) throw new Error('El provider no implementa ProviderClass')
    return providerInstance
};

var bot = {
    createBot,
    createFlow,
    createProvider,
    addKeyword,
    addAnswer,
    addChild,
    toSerialize,
    ProviderClass,
    CoreClass,
};

module.exports = bot;
