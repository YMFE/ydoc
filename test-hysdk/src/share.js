const noop = () => {};
const isFunction = (fn) => typeof fn === 'function';

const apis = {
    onMenuShareTimeline: true,
    onMenuShareAppMessage: true,
    onMenuShareWeibo: {
        wechat: true,
        hy: 'onMenuShareWeiboApp'
    },
    onMenuShareQQ: {
        wechat: true
    },
    onMenuShareQZone: {
        wechat: true
    },
    onMenuShareSMS: {
        hy: true
    },
    onMenuShareEmail: {
        hy: true
    },
    onMenuShareQunarIM: {
        hy: true
    },
    onMenuShare: {
        hy: true
    }
};

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

let wechatApis = [];

module.exports = {
    init: (sdk, debug) => {
        for (let key in apis) {
            let conf = apis[key];
            sdk[key] = (opt) => sdk.ready((env) => {
                if (sdk[env][key]) {
                    sdk[env][key](opt);
                } else {
                    //TODO 考虑是否应该报 warn
                    debug && console.warn(`[HySDK] ${env} not support "${key}"!`);
                }
            });
            if (conf === true || conf.wechat) {
                wechatApis.push(key);
                sdk.wechat[key] = (opt) => sdk.ready((env) => env === 'wechat' && sdk.bridge[key](opt));
            }
            if (conf === true || conf.hy) {
                let bridgeName = typeof conf.hy === 'string' ? conf.hy : key;
                sdk.hy[key] = (opt) => sdk.ready((env) => {
                    if (env === 'hy') {
                        sdk.bridge.invoke(key, getCallback(opt), opt);
                        // 每次页面 show 时，重新设置一次
                        sdk.hy.on('show', () => sdk.bridge.invoke(key, noop, opt));
                    }
                });
            }
        }

        sdk.wechat.onMenuShare = (opt) => {
            wechatApis.forEach((key) => sdk.wechat[key](opt));
        };
    },
    wechatApis
};
