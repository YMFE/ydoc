/** -*- mode: web; -*-
 * @providesModule CookieManager
 **/

/*
 * cookie property
 *
 *  var CookiePropType = {
 *      // 以下字段由native返回
 *      key: PropTypes.string.isRequired,     // cookie key
 *      domain: PropTypes.string.isRequired,  // cookie domain
 *      value: PropTypes.string.isRequired,   // cookie value
 *      // 以下字段native不会提供，js可以在设置cookie时加入这些选项
 *      path: PropTypes.string,               // cookie path
 *      expires: PropTypes.instanceOf(Date),  // 过期时间，可传入Date对象(推荐)或GMT String(不推荐)
 *      secure: PropTypes.bool,               // 仅用于HTTPS
 *      httpOnly: PropTypes.bool,             // http only
 *  };
 */
'use strict';

import {CookieManager} from 'NativeModules';

module.exports = {
    /*
    @unimplemented
    getCookiesForURL: function(url, callback) {
        CookieManager.getCookiesForURL(url, callback);
    },
    */

    getCookieForKey: function(key, url, onSuccess, onError) {
        CookieManager.getCookieForKey(key, url, onSuccess, onError);
    },

    setCookie: function(cookie, callback) {
        if (cookie.key && cookie.domain && cookie.value) {
            let _cookie = Object.assign({}, cookie);
            if (cookie.expires && cookie.expires instanceof Date) {
                _cookie.expires = cookie.expires.toGMTString();
            }
            CookieManager.setCookie(cookie, callback);
            return;
        }

        throw 'cookie must have fields: key, domain, value';
    },

    removeCookie: function(cookie, callback) {
        CookieManager.removeCookie(Object.assign({}, cookie, {value:''}), callback);
    },

    removeCookieForKey: function(key, url, callback) {
        CookieManager.removeCookieForKey(key, url, callback);
    }
};
