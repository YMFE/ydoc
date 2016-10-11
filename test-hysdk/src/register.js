const origin = (o) => o;
const noop = () => {};
const isFunction = (fn) => typeof fn === 'function';
const callbackNames = ['success', 'fail', 'complete'];
const nameSpaces = ['hy', 'wechat', 'h5'];
const wechatMsgReg = /\:(ok|cancel)$/;

const getCallback = (options, debug) => {
    options = options || {};
    let successCb = options.success,
        failCb = options.fail,
        completeCb = options.complete;
    delete options.success;
    delete options.fail;
    delete options.complete;
    return (data) => {
        debug && console.info(`[HySDK] Hy Callback Data:`, data);
        if (!data || typeof data.ret === 'undefined') {
            isFunction(successCb) && successCb(data);
        } else if (data.ret) {
            isFunction(successCb) && successCb(data.data);
        } else {
            isFunction(failCb) && failCb(data);
        }
        isFunction(completeCb) && completeCb(data);
    };
};

const handleCb = (options, conf, debug) => {
    options = options || {};
    callbackNames.forEach((name) => {
        if (options[name]) {
            let fn = options[name],
                handle = conf[`${name}Handle`] || origin;
            options[name] = (data) => {
                debug && console.info(`[HySDK] Wechat ${name} Data:`, data);
                if (!wechatMsgReg.test(data.errMsg)) {
                    data.message = data.errMsg;
                }
                delete data.errMsg;
                return fn(handle(data));
            };
        }
    });
};

const fixOptionsCallback = (options) => {
    options = options || {};
    let successCb = options.success || noop,
        failCb = options.fail || noop,
        completeCb = options.complete || noop;

    options.success = (data) => {
        successCb(data);
        completeCb(data);
    };
    options.fail = (data) => {
        failCb(data);
        completeCb(data);
    };
    return options;
};

const setUpFunction = (sdk, key, conf, debug) => {
    let obj = fns[key] = fns[key] || {};
    if (conf.hy) {
        let cf = conf.hy,
            bridgeName = cf.key || key,
            optHandle = cf.optHandle || origin,
            resHandle = cf.resHandle || origin;
        obj.hy = (options) => {
            let callback = getCallback.call(sdk, options),
                opt = optHandle.call(sdk, options);
            debug && console.log(`[HySDK] ENV => hy, Key => ${key}, BridgeName => ${bridgeName}, options => `, opt);
            return sdk.bridge.invoke(bridgeName, (data) => callback(resHandle(data)), opt);
        };
    }
    if (conf.wechat) {
        let cf = conf.wechat,
            bridgeName = cf.key || key,
            optHandle = cf.optHandle || origin,
            handle = cf.handle || null;
        obj.wechat = (options) => {
            if(handle) return handle(fixOptionsCallback(options), sdk);
            let opt = optHandle.call(sdk, options);
            handleCb(options, cf);
            debug && console.log(`[HySDK] ENV => wechat, Key => ${key}, BridgeName => ${bridgeName}, options => `, opt);
            return sdk.bridge[bridgeName](opt);
        };
    }
    if (conf.h5) {
        let cf = conf.h5,
            handle = cf.handle;
        obj.h5 = (options) => {
            debug && console.log(`[HySDK] ENV => h5, Key => ${key}`, options);
            return handle(fixOptionsCallback(options), sdk);
        };
    }
    if (conf.namespace && nameSpaces.indexOf(conf.namespace) === -1) {
        let namespace = conf.namespace,
            bridgeName = conf.bridge || key,
            optHandle = conf.optHandle || origin,
            resHandle = conf.resHandle || origin;
        obj[namespace] = (options) => {
            let callback = getCallback.call(sdk, options),
                opt = optHandle.call(sdk, options);
            return sdk.bridge.invoke(bridgeName, (data) => callback(resHandle(data)), opt);
        };
    }
};

const bind = (sdk, key, env) => {
    let process = (options) => {
        let fn = fns[key][env];
        return fn.call(sdk, options);
    };
    if (nameSpaces.indexOf(env) === -1) {
        return (options) => {
            return sdk.isReady ?
                sdk.env == 'hy' && process(options) :
                sdk.ready(() => sdk.env == 'hy' && process(options));
        };
    }
    return (options) => {
        return sdk.isReady ?
            sdk.env == env && process(options) :
            sdk.ready(() => sdk.env == env && process(options));
    };
};

const common = (sdk, key, debug) => {
    let process = (options) => {
        let fn = fns[key][sdk.env];
        if (fn) {
            return fn.call(sdk, options);
        } else {
            //TODO 考虑是否应该报 warn
            debug && console.warn(`[HySDK] ${sdk.env} not support "${key}"!`);
        }
    };

    return (options) => {
        return sdk.isReady ? process(options) : sdk.ready(() => process(options));
    };
};

let fns = {};

module.exports = {
    setUpFunction,
    bind,
    common
};
