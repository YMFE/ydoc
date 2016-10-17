/*
 * @providesModule CookieManager
 */
var pluses = /\+/g;

function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
}

function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
        // This is a quoted cookie as according to RFC2068, unescape...
        s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
        // Replace server-side written pluses with spaces.
        // If we can't decode the cookie, ignore it, it's unusable.
        // If we can't parse the cookie, ignore it, it's unusable.
        s = decodeURIComponent(s.replace(pluses, ' '));
        return config.json ? JSON.parse(s) : s;
    } catch (e) {
    }
}

function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return typeof converter == 'function' ? converter(value) : value;
}

var config = function (key, value, options) {

    // Write

    if (arguments.length > 1 && typeof value != 'function') {
        options = {...config.defaults, ...options};

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
        }

        return (document.cookie = [
            encode(key), '=', stringifyCookieValue(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // Read

    var result = key ? undefined : {},
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        cookies = document.cookie ? document.cookie.split('; ') : [],
        i = 0,
        l = cookies.length;

    for (; i < l; i++) {
        var parts = cookies[i].split('='),
            name = decode(parts.shift()),
            cookie = parts.join('=');

        if (key === name) {
            // If second argument (value) is a function it's a converter...
            result = read(cookie, value);
            break;
        }

        // Prevent storing a cookie that we couldn't decode.
        if (!key && (cookie = read(cookie)) !== undefined) {
            result[name] = cookie;
        }
    }

    return result;
};

config.defaults = {};


/**
 * CookieManager
 *
 * @component CookieManager
 * @version >=v1.4
 * @example ./CookieManager.js
 * @description 提供了用于操作 Cookie 的API, 简化了 Cookie 的操作。
 *
 * ![CookieManager](./images/api/CookieManager.gif)
 *
 */


module.exports = {
    /**
     * @property setCookie
     * @type function
     * @param {object} cookie 需要设置的 Cookie, 这是一个对象, 形如: {key:'name',value:'hanmeimei'}。
     * @param {function} [callback] 回调函数
     * @description 设置Cookie, cookie 中可以包含下列字段:
     * - expires: 过期时间
     * - path: 路径
     * - domain: 域名
     * - secure: 是否仅在 https 下传输
     */
    setCookie: function (cookie, callback) {
        var {key, value} = cookie,
            options = {}
        for (var i in cookie) {
            if (i != 'key' || i != 'value') options[i] = cookie[i]
        }
        config(key, value, options)
        callback && callback()
    },
    /**
     * @property getCookieForKey
     * @type function
     * @param {string} key cookie的值
     * @param {string} url
     * @param {function} onSuccess 获取成功的回调函数
     * @param {function} [onError] 获取失败的回调函数
     * @description  根据key值获取Cookie，获取成功则调用onSuccess,失败则调用onError。
     */
    getCookieForKey: function (key, url, onSuccess, onError) {
        onSuccess && onSuccess(config(key))
    },

    /**
     * @property getCookiesForURL
     * @type function
     * @param {string} url url值
     * @param {function} onSuccess 获取成功的回调函数
     * @param {function} [onError] 获取失败的回调函数
     * @description  根据url值获取Cookie，获取成功则调用onSuccess,失败则调用onError。
     */
    getCookiesForURL: function (url, callback) {
        callback && callback(config())
    },

    /**
     * @function removeCookieForKey
     * @type function
     * @param {string} key cookie的值
     * @param {string} url url的值
     * @param {function} callback 移除完成的回调函数
     * @description  根据key和url移除cookie，移除完成后调用callback函数。
     */
    removeCookieForKey: function (key, url, callback) {
        this.removeCookie(key)
        callback && callback()
    },


    /**
     * @property removeCookie
     * @type function
     * @param {string} key cookie的值，如‘name’ 或 {key:'name'}。
     * @param {function} callback 回调函数
     * @description  移除指定cookie值，移除完成后调用callback。
     */
    removeCookie: function (cookie, callback) {
        var key = cookie && cookie.key || cookie
        this.setCookie({
            key: key,
            value: '',
            expires: -1
        });
        callback && callback()
    }
}
