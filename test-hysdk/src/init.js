const sniff = require('./lib/ySniff.js');
const ready = require('./util/ready');
const extend = require('./util/extend');
const hyEnv = require('./env/hy');
const wechatEnv = require('./env/wechat');

const apis = require('./apis');
const events = require('./events');
const register = require('./register');
const bind = require('./bind');
const share = require('./share');

const getUrl = () => location.href.split('#')[0];
const envs = ['hy', 'wechat', 'h5'];

let cacheUrl;

module.exports = function(config, readyListenersCache) {

    const doReady = () => {
        this.isReady = true;
        readyListenersCache.forEach((fn) => fn(this.env));
        readyListenersCache = [];
    };

    let wechatApis = [];

    this._apis = apis;

    // Init APIS
    for (let key in apis) {
        register.setUpFunction(this, key, apis[key], config.debug);
        this[key] = register.common(this, key, config.debug);
        envs.forEach((env) => {
            if (apis[key][env]) {
                if (env == 'wechat') {
                    wechatApis.push(apis[key][env].key || key);
                }
                this[env][key] = register.bind(this, key, env);
            }
        });
    }

    // Bind Events
    bind.initCommonFns(this);
    envs.forEach((env) => {
        bind[`init${env.replace(/\w/, (a) => a.toUpperCase())}Fns`](this, events, config.debug);
    });
    for (let key in events) {
        bind.initEventFns(this, key);
        envs.forEach((env) => bind.initEventFns(this, key, env));
    }

    // Init Share Logic
    share.init(this, config.debug);

    wechatApis = wechatApis.concat(share.wechatApis);

    ready(() => {
        if (config.wechatSupport && sniff.browsers.wechat) {
            wechatEnv(config, wechatApis, (bridge) => {
                if (bridge) {
                    this.bridge = bridge;
                    this.env = 'wechat';
                    if (sniff.android) {
                        cacheUrl = getUrl();
                        window.addEventListener('popstate', () => {
                            let curUrl = getUrl();
                            if (cacheUrl !== curUrl) {
                                cacheUrl = curUrl;
                                this.isReady = false;
                                wechatEnv(config, wechatApis, doReady);
                            }
                        }, false);
                    }
                }
                doReady();
            });
        } else if (!config.hytiveReg || sniff.hy) {
            hyEnv(config, (bridge) => {
                if (bridge) {
                    sniff.hy = true;
                    this.bridge = bridge;
                    this.env = 'hy';
                }
                doReady();
            });
        } else {
            doReady();
        }
    });
};
