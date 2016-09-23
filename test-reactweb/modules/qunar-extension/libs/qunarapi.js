/**
 * @providesModule QunarAPI
 * @author qianjun.yang
 */
/**
 * @author: jiuhu
 * @date: 15/5/6
 */

(function(global, factory) {
    if ( typeof define === "function") { // AMD || CMD
        if(define.amd) {
            define(function() {
                return factory();
            });
        } else if(define.cmd) {
            define(function(require, exports, module) {
                module.exports = factory();
            });
        }
    } else if( typeof module === "object" && typeof module.exports === "object" ) { // commonJS
        module.exports = factory();
    } else { // global
        global.QunarAPI = factory();
    }
}(typeof window !== "undefined" ? window : this, function() {

    'use strict';

    var QunarAPI = {};
    var win = window;
    var doc = win.document;
    var ua = win.navigator.userAgent;
    // config的配置信息
    var configOptions = {};
    // 在bridge还没ready时，调用API时会先被缓存起来，等ready后再触发
    var cache = [];
    // 缓冲错误回调方法
    var errorCallbackCache = [];
    // 默认配置
    var defaultOptions = {
        wechatApiUrl: 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js'
    };
    var name2KeyMap = {};
    var key2NameMap = {};
    // sniffer
    var browser = (function() {
        if(/MicroMessenger/i.test(ua)) {
            return {wechat: true, version: ''};
        } else if(/Qunar/i.test(ua)) {
            return {qunar: true, version: ''};
        } else {
            return {h5: true, version: ''};
        }
    })();

    var hooks = {
        'api':{
            'openWebView':function(){
                isFunction(this.onViewBack) && QunarAPI.hy.onceReceiveData({success:this.onViewBack});
            }
        },
        'bridge':{
            'method':function(key){
                return API.share.wechat[key] || API.share.hy[key] ? 'invoke' : '';
            }
        }
    };

    // 参数过滤，适配器
    var paramHandler = {
        checkJsApi: function(param){
            var map = name2KeyMap;
            var successCb = param.success;

            // 记录QunarAPI对于的key值
            var listClone = param.jsApiList.slice(0);

            // 根据map,生成新的list
            param.jsApiList = listClone.map(function(key){
                return map[key] || key;
            });

            param.success = function(res){
                var obj = {};
                // 根据初始jsApiList，生成对应的对象
                listClone.forEach(function(key){
                    // 获取map有记录的name，否则认为不支持
                    var name = map[key] || key;
                    obj[key] = res[name] || false;
                });
                isFunction(successCb) && successCb.call(null, obj)
            }
            return param;
        },
        log: function( msg ){
            if( isString(msg) ){
                var param = {
                    message: msg
                }
                return param;
            }
            return msg;

        }
    };

    function isFunction (obj) {
        return typeof obj === 'function';
    };

    function isString (string) {
        return Object.prototype.toString.call(string) === "[object String]";
    };

    function domReady( callback ){
        var readyRep = /complete|loaded|interactive/;

        if (readyRep.test(document.readyState) && document.body) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                callback();
            }, false);
        }
    };

    // 注册接口
    function batchRegisterAPI(api, namespace) {
        for(var key in api) {
            QunarAPI.register(key, api[key], namespace);
        }
    };

    function callbackQueue(){
        if(cache.length > 0){
            cache.forEach(function(item) {
                QunarAPI.invoke(item.key, item.callback, item.param);
            });
            cache = [];
        }
    }

    function errorHandler(res){
        if(errorCallbackCache.length > 0){
            errorCallbackCache.forEach(function(callback) {
                callback(res);
            });
        }
    }

    // 宿主环境适配
    function adapter() {
        // load wechat api
        if(browser.wechat) {
            var head = doc.getElementsByTagName('head')[0];
            var script = doc.createElement('script');
            script.setAttribute('src', defaultOptions.wechatApiUrl);
            head.appendChild(script);
            script.onload = function() {
                for(var key in wx) {
                    QunarAPI[key] = wx[key];
                }
                //添加通用分享方法
                QunarAPI['onMenuShare'] = function(param){
                    for(var key in API.share.wechat) {
                        QunarAPI[key](param);
                    }
                }
                QunarAPI.isReady = true;
                cache.forEach(function(item) {
                    QunarAPI[item.key](item.param);
                });
                cache = [];
            };
        } else if(browser.qunar) {
            // 添加onInitData
            QunarAPI.hy.onInitData = function(param) {
                QunarAPI.hy.getInitData({
                    success: function(data) {
                        isFunction(param.success) && param.success(data);
                    }
                });
            };

            // 添加bridge判断
            window.addEventListener('load', function(){
                // 600ms 后，还没有ready，说明bridge注入失败
                setTimeout(function(){
                    if(!QunarAPI.bridge){
                        // 触发错误
                        errorHandler( {
                            ret: false,
                            errcode: -1,
                            errmsg: "bridge注入失败"
                        } );
                    }
                }, 600)
            });
        }
    };

    function doResult(key, param, name){
        if(!param) {
            console.error('Parameters are not allowed to be empty!');
            return;
        }

        // 处理param
        if(paramHandler[name]){
            param = paramHandler[name](param);
        }

        var successCb = param.success,
            failCb = param.fail,
            completeCb = param.complete;

        var callback = function(data) {
            configOptions.debug && console.log(data);
            var args = Array.prototype.slice.call(arguments, 0);

            // data有两种数据，一种是带状态的数据，一种是无状态的数据
            // { ret: true, data: {} }
            // {  }

            if(!data || typeof data.ret === 'undefined') {
                // response不存在或者ret未定义，认为成功
                // success
                isFunction(successCb) && successCb.apply(null, args);
                hooks.api[name] && hooks.api[name].call(param, data || {});
            }else if(data.ret){
                // response不为空，且ret为true，认为成功，真正的数据为data.data
                args[0] = data.data;
                isFunction(successCb) && successCb.apply(null, args);
                hooks.api[name] && hooks.api[name].call(param, data.data || {});
            }else {
                isFunction(failCb) && failCb.apply(null, args);
            }
            isFunction(completeCb) && completeCb.apply(null, args);

            /*
             * 针对invoke分享接口，只能监听一次问题
             * 回调发起后，重新监听
             */

            if(browser.qunar && data && data.errcode != -1 && hooks.bridge.method(name)){
                QunarAPI.invoke(key, callback, param, name);
            }
        };

        return QunarAPI.invoke(key, callback, param, name);
    };

    var API = {
        // 通用API
        common: {
            /** 图像接口 */
            chooseImage: 'chooseImage', // 拍照或从手机相册中选图
            previewImage: 'previewImage', // 预览图片
            uploadImage: 'uploadImage', // 上传图片
            uploadImage_v1: 'uploadImage.v1', // 上传图片新接口
            downloadImage: 'downloadImage', // 下载图片

            /** 设备信息接口 */
            getNetworkType: 'network.getType', // 获取网络状态
            openLocation: 'openLocation', // 使用微信内置地图查看位置
            getLocation: 'geolocation.getCurrentPosition', // 获取地理位置

            /** 界面操作接口 */
            closeWindow: 'webview.back', // 关闭当前网页窗口
            hideOptionMenu: 'hideOptionMenu', // 隐藏右上角菜单
            showOptionMenu: 'showOptionMenu', // 显示右上角菜单
            hideMenuItems: 'hideMenuItems', // 批量隐藏功能按钮
            showMenuItems: 'showMenuItems', // 批量显示功能按钮
            hideAllNonBaseMenuItem: 'hideAllNonBaseMenuItem', // 隐藏所有非基础按钮
            showAllNonBaseMenuItem: 'showAllNonBaseMenuItem', // 显示所有功能按钮
            hideLoadView: 'webview.hideLoadView', // 隐藏loading

            /** loading事件 */
            onLoadingClose: 'loadingview.close', // 监听loading关闭事件

            /** 扫一扫接口 */
            scanQRCode: 'scanQRCode', // 调起扫一扫

            /** AB测试 */
            abTest: 'abTest',

            /** 其他接口 */
            checkJsApi: 'checkJsApi' // 判断当前客户端版本是否支持指定JS
        },

        share: {
            wechat: {
                onMenuShareTimeline: 'onMenuShareTimeline',
                onMenuShareAppMessage: 'onMenuShareAppMessage'
                //onMenuShareQQ: 'onMenuShareQQ'  // QQ需要签入SDK目前大客户端不支持
            },
            hy: {
                onMenuShareWeiboApp: 'onMenuShareWeiboApp',
                onMenuShareSMS: 'onMenuShareSMS',
                onMenuShareEmail: 'onMenuShareEmail',
                onMenuShare: 'onMenuShare',
                onMenuShareQunarIM: 'onMenuShareQunarIM'
            }
        },

        // HYAPI
        hy: {
            /**独有API**/
            // webView接口
            openWebView: 'webview.open', // 打开新的webview
            closeWebView: 'webview.back', // 关闭webview
            setWebViewAttr: 'webview.attribute', // 设置webview属性
            getInitData: 'webview.getInitData',
            enableBackGesture: 'qunarnative.gesturesView', // 是否支持后退手势(仅针对IOS)
            schemeForResult: 'schemeForResult', // 通过schema跳转

            // webView事件
            onShow: 'webview.onShow',
            onHide: 'webview.onHide',
            onReceiveData: 'webview.onReceiveData',
            onceReceiveData: 'webview.onReceiveData',
            onCloseWebView: 'webview.targetClosed', // 监听WebView关闭事件
            onceCloseWebView: 'webview.targetClosed', // 监听WebView关闭事件

            // 以下三个接口不推荐使用，后续会删除
            onBeforeShow: 'webview.onBeforeShow',
            onBeforeHide: 'webview.onBeforeHide',
            onDestroy: 'webview.onDestroy',

            // 导航接口
            navRefresh: 'navigation.refresh', // 刷新导航条,
            getNavDisplayStatus: 'navigation.displayStatus', // 获取导航栏显示状态
            setNavDisplayStatus: 'navigation.display', // 设置导航栏显示状态

            // 导航事件
            onNavClick: 'navigation.click', // 监听导航条点击事件

            // 状态栏
            setStatus: 'qunarnative.status', // 设置状态栏颜色 default（黑）和light（白）

            /*主动分享*/
            shareTimeline: 'shareTimeline',
            shareAppMessage: 'sendAppMessage',
            shareWeiboApp: 'shareWeiboApp',
            shareSMS: 'shareSMS',
            shareEmail: 'shareEmail',
            shareQunarIM: 'shareQunarIM',

            /* 分享图片到朋友圈 */
            shareImageToTimeline: 'shareImageToTimeline',

            // 唤起share dialog框
            showShareItems: "doShare",

            // 设备信息
            getDeviceInfo: 'native.getDeviceInfo', // 获取设备信息

            login: 'login.start', // 登录
            syncLoginFromTouch: 'syncLoginFromTouch', // 从touch端同步登陆信息

            log: 'debug.log', // debug
            uelog: 'hy.uelog', // uelog
            qaf: 'qaf'
        },

        // H5API
        h5: {
            getLocation: function(cb, param) {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(param.success, param.fail, {
                        enableHighAccuracy: param.enableHighAccuracy || true,
                        timeout: param.timeout || 5000
                    });
                } else {
                    cb({
                        ret: false,
                        errcode: -1,
                        errmsg: 'Geolocation is not supported!'
                    });
                }
            },

            login: function(cb, param){
                var data, loginUrl, p, str = "";
                loginUrl = "http://user.qunar.com/mobile/login.jsp";
                data = {
                    ret: param.ret || encodeURIComponent(location.href),
                    goback: param.goback || "",
                    backUrl: param.backUrl || ""
                };
                for(p in data){
                    if(data.hasOwnProperty(p) && data[p] !== ""){
                        str += p + "=" + data[p]
                    }
                }
                location.href = loginUrl + "?" + str;
            },

            checkJsApi: function(cb, param){
                var jsApiList = param.jsApiList || [];
                var obj = {}, name;
                jsApiList.forEach(function(key){
                    name = key2NameMap[key];
                    obj[key] = !!API.h5[name];
                })
                cb( obj );
            },

            notSupport: function(cb, param, key, name) {
                if(!isFunction(cb)) return;
                cb({
                    ret: false,
                    errcode: -1,
                    errmsg: '浏览器环境下不支持"' + name+ '"接口调用'
                });
            }
        }
    };

    QunarAPI = {
        version: '1.1.3',
        isReady: false,
        bridge: null,
        sniff: browser,
        ready: function(callback) {
            var self = this;
            if(browser.qunar) {
                doc.addEventListener('WebViewJavascriptBridgeReady', function(e) {
                    self.isReady = true;
                    self.bridge = e.bridge;
                    isFunction(callback) && callback.call(self);
                    // 执行队列里的api方法
                    callbackQueue();
                });
            } else if(browser.h5) {
                self.isReady = true;
                isFunction(callback) && callback.call(self);
            } else if(browser.wechat) {
                isFunction(callback) && callback.call(self);
            }
        },
        // 通过config接口注入权限验证配置
        config: function(opt) {
            doResult('config', configOptions = opt);
        },
        error: function(callback){
            if( isFunction(callback) ){
                errorCallbackCache.push(callback);
            }
        },
        invoke: function (key, callback, param, name) {
            if(!isFunction(callback)) return;

            if(QunarAPI.isReady) {
                if (browser.qunar) {
                    name = name || key;
                    var method = 'invoke';
                    if(name.indexOf('once') === 0) {
                        method = 'once';
                    } else if(name.indexOf('on') === 0) {
                        method = 'on';
                    }
                    this.bridge[ hooks.bridge.method(name) || method](key, callback, param);

                    if(method == 'on'){
                        return callback;
                    }
                } else if(browser.wechat) {
                    this[key] && this[key](param);
                } else if(browser.h5){
                    API.h5[API.h5[name] ? name : 'notSupport'](callback, param, key, name);
                }
            } else {
                cache.push({key: key, callback: callback, param: param});
            }
        },
        off: function(name, callback) {
            if (!isFunction(callback)) return;

            var key = name2KeyMap[name];
            if (!key) return;

            this.bridge.off(key, callback);
            callback = null;
        },
        /**
         * 自定义接口
         * @param  {String} name      接口名称
         * @param  {String} key       bridge
         * @param  {String} namespace 命名空间，业务方建议使用自己的命名空间
         */
        register: function (name, key, namespace) {
            var self = this, ns = this;
            namespace && (self[namespace] ? (ns = self[namespace]) : (ns = self[namespace] = {}));

            // 记录被注册的name
            name2KeyMap[name] = key;
            key2NameMap[key] = name;

            // self[name] = // 所有方法注册到QunarAPI，减少差异记录
            ns[name] = function(param){
                if(!param){
                    param = {};
                }
                return doResult(key, param, name);
            };
        }
    };

    batchRegisterAPI(API.share.wechat);
    batchRegisterAPI(API.share.hy);
    batchRegisterAPI(API.common);
    batchRegisterAPI(API.hy, 'hy');
    adapter();
    return QunarAPI;
}));
