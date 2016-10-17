const load = require('../util/load');
const extend = require('../util/extend');

module.exports = (config, wechatApis, listener) => {
    load.jsonp(config.wechatSignatureUrl, {}, (data, err) => {
        if (err || data.errcode) {
            console.error(`WeChat Signature 获取失败. msg: ${err.type || data.errmsg}`);
            listener();
            return;
        }
        let signData = data.data;
        load.script(location.protocol + '//' + config.wechatScriptUrl, (error) => {
            if (error || !wx) {
                console.error(`加载 JSSDK 失败. url: ${location.protocol + '//' + config.wechatScriptUrl}`);
                bridge();
                return;
            }
            let isError = false;
            wx.config(extend({
                debug: config.debug,
                jsApiList: wechatApis
            }, signData));
            wx.ready(() => {
                if (!isError) {
                    listener(wx);
                }
            });
            wx.error((res) => {
                isError = true;
                listener();
            });
        });
    });
};
