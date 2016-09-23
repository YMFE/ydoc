/**
 * @providesModule QHotDogNetWork
 */

const querystring = require('qs');

// 用来存放 xhr 对象, 用于调用 cancelNetWorkTask 取消网络请求
const xhrs = {};


/**
 * QHotDogNetWork 模块
 *
 * @component QHotDogNetWork
 * @example ./QHotDogNetWork.js
 * @description 这里的 QHotDogNetWork 是 QRN 中 QHotDogNetWork 的弱化版， 由于在 web 上存在诸多限制，且脱离了客户端的环境,
 *  这里的 QHotDogNetWork 已经不算是 HotDog 了。具体差异存在在以下几点:
 *
 *  - 仅仅封装了 XMLHttpRequest 用来简化 GET 请求。
 *  - 数据没有加密传输。
 *  - 只能请求同域或者允许跨域的资源。
 *  - 不能使用 serviceType 配置，因此必须提供 url。
 *  - 由于在 web 上存在跨域的限制，在 web 上 QHotDogNetWork 只能进行同域或者允许跨域的资源。
 *
 *  总的来说，在 web 上它仅仅能帮助你简化 GET 请求，因此你或许可以用 fetch 来实现更加灵活的 HTTP 请求。
 */
let QHotDogNetWork = {
    /**
     * @property postRequest
     * @type function
     * @param {object} options 网络请求的配置项
     * @return {number} id 返回一个网络请求的 id，用于 cancelNetWorkTask 来取消网络请求
     * @description 该方法用来发起请求，请求时需要传入一个配置对象， 该配置对象用来设定请求的 url， 以及成功或失败的回调等等。
     * 该方法使用 GET 方法发起请求， 另外目前不支持 useCache 选项， 同样也就不支持 cacheCallback。
     *
     * #### options 的配置项
     * - url：网络请求的 url
     * - param：网络请求的参数
     * - successCallback：网络请求成功的回调
     * - failCallback：网络请求失败的回调
     */
    postRequest: function(options = {param: {}}){
        let param = {...options.param};
        // if(!options.useCache) {
        //     param.__t = new Date() + Math.random();
        // }
        let query = querystring.stringify(param);
        let url = options.url;
        if (query){
            url += '?' + query;
        }
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = function(){
            if ((xhr.status >= 200 && xhr.status <= 299) || xhr.status === 304){
                options.successCallback && options.successCallback(xhr.response);
            } else {
                options.failCallback && options.failCallback(new Error('请求失败，错误码：' + xhr.status));
            }
        };
        xhr.onerror = function(){
            options.failCallback && options.failCallback(new Error('请求失败：网络错误'));
        };
        xhr.onabort = function(){
            options.failCallback && options.failCallback(new Error('请求失败：请求被取消'));
        };
        xhr.send();
        let id = (new Date()).valueOf();
        xhrs[id] = xhr;
        return id;
    },
    /**
     * @property cancelNetWorkTask
     * @type function
     * @param {number} id postRequest 返回的网络请求 id
     * @description 该方法用来取消网络请求
     */
    cancelNetWorkTask: function(id){
        let xhr = xhrs[id];
        if (xhr) {
            xhr.abort();
            delete xhrs[id];
        }
    }
};

module.exports = QHotDogNetWork;
