const eventFns = ['on', 'off', 'once'];
const isFunction = (fn) => typeof fn === 'function';

const initCommonFns = (sdk) => {
    eventFns.forEach((name) => {
        sdk[name] = (key, fn, context) => {
            let process = () => {
                if (sdk[sdk.env][name]) {
                    return sdk[sdk.env][name](key, fn, context);
                }
            };
            return sdk.isReady ? process() : sdk.ready(process);
        }
    });
};

const initHyFns = (sdk, events, debug) => {
    eventFns.forEach((name) => {
        sdk.hy[name] = (key, fn, context) => {
            if (events[key] && events[key].hy) {
                let eventName = events[key].hy.key || key,
                    process = () => {
                        if (sdk.env == 'hy') {
                            debug && console.info(`[HySDK] Hy bind event，name: ${eventName}`);
                            return sdk.bridge[name](eventName, fn, context);
                        }
                    };
                return sdk.isReady ? process() : sdk.ready(process);
            }
        };
    });
};

const initWechatFns = (sdk, events, debug) => {
    eventFns.forEach((name) => {
        // Wechat 现在并没有事件逻辑，预留接口
        sdk.wechat[name] = () => {};
    });
};

const initH5Fns = (sdk, events, debug) => {
    eventFns.forEach((name) => {
        // H5 暂不提供事件逻辑，预留接口
        sdk.h5[name] = () => {};
    });
};

const initNameSpaceFns = (sdk, name, conf) => {
    const { namespace, bridge } = conf;
    eventFns.forEach((e) => {
        sdk[namespace][e] = (key, fn, context) => {
            if (name && bridge) {
                let eventName = bridge,
                    process = () => {
                        if (sdk.env == 'hy') {
                            return sdk.bridge[e](eventName, fn, context);
                        }
                    };
                return sdk.isReady ? process() : sdk.ready(process);
            }
        };
    });
};

const initEventFns = (sdk, key, env) => {
    let name = key.replace(/\w/, (a) => a.toUpperCase()),
        obj = env ? sdk[env] : sdk;
    eventFns.forEach((eventFn) => {
        obj[eventFn + name] = (opt, context) => {
            let callback = opt.success || opt;
            if (isFunction(callback)) {
                obj[eventFn](key, callback, context);
            }
        };
    });
};

module.exports = {
    initCommonFns,
    initHyFns,
    initWechatFns,
    initH5Fns,
    initNameSpaceFns,
    initEventFns
};
