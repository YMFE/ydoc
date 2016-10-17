/*
 * @providesModule NativeModules
 */

var aHref = document.createElement('a');
aHref.href = scriptUrl;
var scriptUrl = aHref.href;

 /**
 * NativeModules
 *
 * @component NativeModules
 * @version >=v1.4.0
 * @example ./CookieManager.js[1-120]
 * @description
 * 
 * ![NativeModules.CookieManager](./images/api/CookieManager.gif)
 *
 */
var NativeModules = module.exports = {
    SourceCode: {
        get ScriptURL() { return scriptUrl; },
        get PlatformScriptScriptURL() { return scriptUrl; }
    },

    /**
    * @property UIManager
    * @type object
    * @description 挂靠在NativeModules上的UIManager类，详情请戳NativeModules.UIManager。
    */ 
    UIManager: require('UIManager'),
    
    /**
    * @property CookieManager
    * @type object
    * @description 挂靠在NativeModules上的CookieManager类,可用NativeModules.CookieManager调用相关方法
    *
    * 注：CookieManager同时挂靠在了React上，所以您也可以直接用React.CookieManager使用。
    */ 
    CookieManager: require('CookieManager')
}
