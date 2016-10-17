const init = require('./init');
const sniff = require('./lib/ySniff');
const extend = require('./util/extend');
const register = require('./register');
const bind = require('./bind');
const isFunction = (fn) => typeof fn === 'function';

let config = extend(true, {}, require('./config')),
    options = {
        apis: require('./apis'),
        events: require('./events')
    },
    plugins = [],
    readyListenersCache = [];

let HySDK = global.hysdk = module.exports = {
    isReady: false, /* 是否已经 Ready */
    isInit: false, /* 是否已经初始化 */
    env: 'h5', /* 环境类型，可能为：hy, wechat, h5 */
    sniff: sniff, /* 环境嗅探 */
    bridge: null, /* 桥对象 */
    hy: {}, /* Hy Space */
    wechat: {}, /* Wechat Space */
    h5: {}, /* H5 Space */
    plugin: (plugin) => isFunction(plugin) && plugins.push(plugin), /* 添加 plugin */
    /* 配置方法 */
    config: (conf) => {
        config = extend(true, {}, config, conf);
        // 执行插件逻辑
        plugins.forEach((plugin) => plugin(HySDK, config, options));
        if (!HySDK.isInit) {
            HySDK.isInit = true;
            if (config.hytiveReg) {
                HySDK.sniff.hy = new RegExp(config.hytiveReg).test(navigator.userAgent.toLowerCase());
            }
            // 进行初始化逻辑
            init.call(HySDK, config, readyListenersCache);
        }
    },
    /* Ready 监听&回调 */
    ready: (listener) => {
        if (isFunction(listener)) {
            if (HySDK.isReady) {
                listener(HySDK.env);
            } else {
                readyListenersCache.push(listener);
            }
        }
    },
    /* 拓展接口 */
    register: (name, key, namespace, isEvent) => {
        const conf = { namespace, bridge: key };
        HySDK[namespace] = HySDK[namespace] || {};
        if (isEvent) {
            bind.initNameSpaceFns(HySDK, name, conf);
            bind.initEventFns(HySDK, name, namespace);
            return;
        }
        register.setUpFunction(HySDK, name, conf);
        HySDK[namespace][name] = register.bind(HySDK, name, namespace);
    },
    /* 工具 */
    util: {
        extend: extend,
        jsonp: require('./util/load').jsonp
    }
};
