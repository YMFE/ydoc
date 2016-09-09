// -*- mode: web; -*-

/**
 * @providesModule Hytive
 */

'use strict';

var HytiveModule = require('react-native').NativeModules.Hytive;
var Platform = require('react-native').Platform;

// NativeModule自带方法对参数数量有严格限定，封装一层
var Hytive = {
    /*
       end up current RN context and back to last page
     */
    back: function(data, callback) {
        if (!HytiveModule) {
            console.warn('Hytive is not available. Check you react js environment.');
            return;
        }

        var _data = data || {};
        var cb = callback || (()=>{});
        
        HytiveModule.back(_data, cb);
    },

    /*
    close currentActivity
    */
    close:function(){
        HytiveModule.close();
    },

    /*
       open hytive page

       @param webviewParam
       see http://hy.qunar.com/docs/qunarapi-api.html#WebView接口-QunarAPI-hy-openWebView

       @param callback
       ^
     */
    open: function(webviewParam, callback) {
        if (!HytiveModule) {
            console.warn('Hytive is not available. Check you react js environment.');
            return;
        }
        
        var cb = callback;
        if (!cb) {
            cb = ()=>{};
        }
        
        HytiveModule.open(webviewParam, cb);
    },

    /*
       back to named hytive page

       @param backParam
       see http://hy.qunar.com/docs/qunarapi-api.html#WebView接口-QunarAPI-hy-closeWebView

       @param callback
       ^
     */
    backTo: function(backParam, callback) {
        var cb = callback;
        if (!cb) {
            cb = ()=>{};
        }
        
        HytiveModule.backTo(backParam, cb);
    },

    /*
       @param enabled: bool
       whether hytive-controlled right-swipe back is enabled. defaults to `true`

       @param callback: function(bool)
       whether the call is succeeded
     */
    setSwipeBackEnabled: function(enabled, callback) {
        if(Platform.OS === 'android'){
            return;
        }
        var _enabled = enabled;
        if (enabled === undefined) {
            _enabled = true;
        };

        var cb = callback;
        if (!cb) {
            cb = ()=>{};
        }
        
        HytiveModule && HytiveModule.setSwipeBackEnabled(_enabled, cb);
    }
};

module.exports = Hytive;
