/*
 * @providesModule Linking
 */
var Promise = require('ReactPromise'),
    urlReg = /^(http[s]?:)?\/\//g

/**
 * Linking接口
 *
 * @component Linking
 * @version >=v1.4.0
 * @description  提供了一个通用的接口来与传入和传出的App链接进行交互
 *
 */
var Linking = module.exports = {
    __initialURL: window.document.referrer || null,
    /**
     * @method getInitialURL
     * @description 如果应用是被一个链接调起的，则会返回相应的链接地址。否则它会返回null 返回promise
     * 注：web总是返回null
     */
    getInitialURL: function () {
        return new Promise(function(rs) {
            rs(Linking.__initialURL)
        })
    },
    /**
     * @method openURL
     * @param {string} [value] url
     * @description 打开url 返回promise
     * 注：在web下，如果是一个正确的url，会以window.open的形式打开。
     */
    openURL: function (url) {
        return new Promise(function(rs, rj) {
            if (!String(url).match(urlReg)) return rj('illegal url')
            try {
                window.open(url)
                rs()
            } catch(e) {
                rj(e)
            }
        })
    },
    /**
     * @method canOpenURL
     * @param {string} [value] url
     * @param {function} [callback] 回调
     * @description 是否可以打开链接。返回promise。
     * 注：在web上其实没什么用处，似乎直接window.open就可以。
     */
    canOpenURL: function (url, callback) {
        var supported = !String(url).match(urlReg)
        callback && callback(supported)
        return new Promise(function(rs) {
            rs(supported)
        })
    },
    /**
     * @method addEventListener
     * @param {string} [type] type参数应该填'url'
     * @param {function} [handler] 处理函数
     * @description 添加一个监听Linking变化的事件
     * 注：web尚未实现
     */
    addEventListener: function (type, handler) {

    },
    /**
     * @property removeEventListener
     * @type function
     * @param {string} [type] type参数应该填'url'
     * @param {function} [handler] 处理函数
     * @description 移除一个监听Linking变化的事件
     * 注：web尚未实现
     */
    removeEventListener: function (type, handler) {

    }
}
