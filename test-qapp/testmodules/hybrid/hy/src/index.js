(function() {
    var QApp = window.QApp,
        _ = QApp.util,
        localStorage = window.localStorage,
        checkDefer = new _.Deferred();

    // Cookie
    var Cookie = {
        originalString: document.cookie,
        read: function() {
            this.originalString = document.cookie;
        },
        _getCookieHash: function() {
            var cookieArr = this.originalString.split(";");
            var cookieHash = {};
            for (var i = 0; i < cookieArr.length; i++) {
                if (cookieArr[i].indexOf("=") != -1) {
                    cookieHash[cookieArr[i].split("=")[0].replace(/(^\s*)/g, "").replace(/(\s*$)/g, "")] = unescape(cookieArr[i].split("=")[1]).replace(/(^\s*)/g, "").replace(/(\s*$)/g, "");
                }
            }
            return cookieHash;
        },
        setCookie: function(sName, sValue, dExpire, sDomain, sPath) {
            var _cookieString = sName + "=" + escape(sValue);
            if (dExpire) {
                _cookieString += "; expires=" + dExpire.toGMTString();
            }
            if (sDomain) {
                _cookieString += "; domain=" + sDomain;
            }
            if (sPath) {
                _cookieString += "; path=" + sPath;
            }
            document.cookie = _cookieString;
            this.originalString = document.cookie;
            this.values = this._getCookieHash();
        },
        deleteCookie: function(sName, sDomain, sPath) {
            this.setCookie(sName, '', new Date(1), sDomain, sPath);
        },
        refresh: function() {
            this.read();
            Cookie.values = Cookie._getCookieHash();
        }
    };
    Cookie.refresh();

    function getDeviceInfo() {
        var info = {},
            qn241 = Cookie.values['QN241'];
        try {
            info = JSON.parse(qn241);
        } catch (e) {
            try {
                info = JSON.parse(decodeURIComponent(qn241));
            } catch (err) {}
        }
        return info;
    }

    function getLoginInfo() {
        return {
            nickName: Cookie.values['QN42'],
            userName: Cookie.values['_q']
        };
    }

    // Core
    var HyAdapter = QApp.hy = (function() {
        var em = function() {};
        _.extend(em.prototype, _.CustEvent);
        return new em();
    })();

    var navBtns = ['left', 'title', 'right'],
        openCallbacks = {},
        prefixHy = 'hy',
        historyList = false,
        loginBridgeKey = 'login.start',
        jsonpExtraStamp = 0,
        openFilterLocked = false;

    // Config
    var Config = {
        indexView: 'index',
        hybridId: 'hy',
        schemaProtocols: ['qunartraveliphone', 'qunartravelaphone'],
        barHeight: 20,
        hdHeight: 44,
        webViewType: 'navibar-normal',
        loadViewType: 'auto',
        jsonParam: false,
        refreshH5Header: false,
        buildNavHTML: buildNavHTML,
        viewOptions: {},
        bindEvents: {},
        ready: null,
        useAppHeader: true,
        useTransfer: true,
        buttons: {
            left: 'header .regret',
            title: 'header .title',
            right: 'header .affirm'
        },
        loginUrl: 'http://user.qunar.com/mobile/login.jsp',
        logoutUrl: 'http://user.qunar.com/passport/logout.jsp',
        checkLoginUrl: 'https://user.qunar.com/webApi/getLoginState.jsp?format=js'
    };

    var href = location.href,
        match = href.match(/hybridid=([^\#^\&]*)/);

    if (match) {
        Config.hybridId = match[1];
    }

    var schemaProtocols = ['qunarhyiphone', 'qunariphonepro', 'qunariphonelife', 'qunariphone', 'qunarhyaphone', 'qunaraphonelife', 'qunaraphone']

    // Sniff
    var sniff,
        ua = navigator.userAgent.toLowerCase(),
        curProtocol = null,
        isQunarApp = (schemaProtocols.concat(Config.schemaProtocols) || []).some(function(protocol) {
            if (ua.indexOf(protocol) > -1) {
                curProtocol = protocol;
                return true;
            }
        }),
        deviceInfo = getDeviceInfo();

    HyAdapter.deviceInfo = deviceInfo;
    HyAdapter.getLoginInfo = getLoginInfo;

    HyAdapter.sniff = sniff = {
        app: isQunarApp,
        qunarApp: isQunarApp,
        hyApp: false,
        independent: ua.indexOf('independent') > -1 || ua.indexOf('qunarhy') > -1, //判断独立客户端
        touch: !isQunarApp && !QApp.sniff.pc,
        pc: QApp.sniff.pc
    };

    // Hy
    var opt = {
            timeout: 5000,
            bridgeDelay: 600
        },
        HyBridge = null,
        Hy = HyAdapter.bridge = {};

    function initHy() {
        //DEBUG '初始化 Hy 桥'
        Hy = {
            exists: sniff.hyApp || sniff.pc,
            config: function(options) {
                _.extend(opt, options);
            },
            invoke: function(key, callback, param, timeout) {
                //DEBUG '调用桥', key, '参数为', param
                var fired = false;
                if (Hy.exists) {
                    HyBridge.invoke(key, function(data) {
                        if (!fired) {
                            fired = true;
                            callback(data);
                        }
                    }, param);
                    if (timeout !== 0) {
                        _.delay(function() {
                            if (!fired) {
                                fired = true;
                                callback({
                                    ret: false,
                                    errcode: -1
                                });
                            }
                        }, timeout || opt.bridgeDelay);
                    }
                } else {
                    callback({
                        ret: false,
                        errmsg: 'Not Found Hy',
                        errcode: -1
                    });
                }
            },
            on: function(key, callback) {
                HyBridge.on(key, callback || _.noop);
            },
            once: function(key, callback) {
                HyBridge.once(key, callback || _.noop);
            },
            register: function(name, key, timeout) {
                if (name.indexOf('once') === 0) {
                    Hy[name] = function(callback) {
                        Hy.once(key, callback || _noop);
                    };
                } else if (name.indexOf('on') === 0) {
                    Hy[name] = function(callback) {
                        Hy.on(key, callback || _noop);
                    };
                } else {
                    Hy[name] = function(param, callback) {
                        if (_.isFunction(param)) {
                            callback = param;
                            param = {};
                        }
                        Hy.invoke(key, callback || _.noop, param, timeout);
                    };
                }
            }
        };

        Hy.register('back', 'webview.back', 0);
        Hy.register('navRefresh', 'navigation.refresh', 0);
        Hy.register('open', 'webview.open', 0);
        Hy.register('setWebViewAttribute', 'webview.attribute');
        Hy.register('getHistory', 'view.list');
        Hy.register('checkApi', 'checkJsApi');
        Hy.register('login', loginBridgeKey, 0);
        Hy.register('enableGesture', 'qunarnative.gesturesView');
        Hy.register('hideLoading', 'webview.hideLoadView');

        Hy.register('onNavClick', 'navigation.click');
        Hy.register('onReceiveData', 'webview.onReceiveData');
        Hy.register('onShow', 'webview.onShow');
        Hy.register('onceShow', 'webview.onShow');
        Hy.register('onHide', 'webview.onHide');
        Hy.register('onBack', 'webview.targetClosed');
        Hy.register('onResize', 'webview.resize');
        Hy.register('onLoadingClose', 'loadingview.close');

        // 兼容老版本
        if (HyBridge && QApp.sniff.ios) {
            //DEBUG '进入兼容iOS老版本逻辑'
            var hackVersion = 80011092,
                lsKey = 'Hy_back_param',
                virtualBridge = (function() {
                    var em = function() {};
                    _.extend(em.prototype, _.CustEvent);
                    return new em();
                })();

            function readBackData() {
                var data = null;
                try {
                    data = JSON.parse(localStorage.getItem(lsKey))
                } catch (e) {}
                localStorage.removeItem(lsKey);
                return data;
            }

            function writeBackData(data) {
                try {
                    localStorage.setItem(lsKey, JSON.stringify(data));
                } catch (e) {}
            }

            if (schemaProtocols.indexOf(curProtocol) > -1 && deviceInfo && deviceInfo.vid && parseInt(deviceInfo.vid) < hackVersion) {
                var _open = Hy.open,
                    _back = Hy.back;
                Hy.onReceiveData = function(fn) {
                    virtualBridge.on('receiveData', fn);
                };
                Hy.onShow = function(fn) {
                    virtualBridge.on('show', fn);
                };
                Hy.onHide = function(fn) {
                    virtualBridge.on('hide', fn);
                };
                Hy.onBack(function() {
                    var data = readBackData();
                    if (data) {
                        virtualBridge.trigger('receiveData', data);
                    }
                    virtualBridge.trigger('show');
                });
                Hy.back = function(data) {
                    if (data.data) {
                        writeBackData(data.data);
                    }
                    _back(data);
                };
                Hy.open = function(data) {
                    var url = data.url,
                        hash = url.split('#')[1],
                        hashId = '_hy_param_' + Date.now();
                    if (hash) {
                        localStorage.setItem(hashId, hash);
                        data.url = url.split('#')[0] + '#' + hashId;
                    }
                    virtualBridge.trigger('hide');
                    _open(data);
                };
            }

            var hashId = location.hash.substring(1),
                hash;
            if (hashId.indexOf('_hy_param_') === 0) {
                hash = localStorage.getItem(hashId);
                localStorage.removeItem(hashId);
                location.hash = hash;
            }
        }
    }

    function setCurView(viewName) {
        //DBUG '设置当前 View 名称', viewName
        localStorage.setItem('perViewName', localStorage.getItem('curViewName'));
        localStorage.setItem('curViewName', viewName);
    }


    function buildNavHTML(opt) {
        var html;
        switch (opt.style) {
            case 'icon':
                html = '<i class="yo-ico">&#x' + escape(opt.icon).toLowerCase().replace('%u', '') + ';</i>';
                break;
            case 'location':
                html = '<h2>' + (opt.location || opt.text) + '</h2><i class="yo-ico">&#xf033;</i>';
                break;
            default:
                html = opt.text;
        }
        return html;
    }

    // Refresh H5 Header
    function refreshH5Header(root, navOpt) {
        if (root) {
            var nodes = {
                left: root.querySelector(Config.buttons.left),
                title: root.querySelector(Config.buttons.title),
                right: root.querySelector(Config.buttons.right)
            };
            navBtns.forEach(function(btn) {
                if (nodes[btn]) {
                    if (navOpt[btn]) {
                        nodes[btn].innerHTML = Config.buildNavHTML(navOpt[btn]);
                    } else if (btn === 'left') {
                        nodes[btn].innerHTML = Config.buildNavHTML({
                            style: 'icon',
                            icon: 'f07d'
                        });
                    }
                }
            });
        }
    }

    // Refresh Native Header
    function refreshNativeHeader(navOpt) {
        if (sniff.hyApp) {
            //DEBUG '设置 Native Header 展现形式, 参数为', navOpt
            Hy.navRefresh(navOpt);
        }
    }

    // Listener Native Header Click
    var navClickTimer = null;

    function doTap(el) {
        _.dispatchEvent(el, 'tap');
    }

    function listenerNavClick(root) {
        Hy.onNavClick(function(data, responseCallback) {
            //DEBUG '监听到 Native Header 点击事件', '按钮类型为', data.type
            var el,
                responseData = {};
            if (HyAdapter.trigger('nav:' + data.button) === false) {
                responseData.data = true;
            }
            if (Config.buttons[data.button]) {
                el = root.querySelector(Config.buttons[data.button]);
                if (el && el.hasAttribute('preventNative')) {
                    responseData.data = true;
                }
                if (el && !navClickTimer) {
                    if ((data.button == 'left' || data.button == 'back') && !responseData.data) {
                        var _back = Hy.back;
                        Hy.back = _.noop;
                        doTap(el);
                        Hy.back = _back;
                    } else {
                        doTap(el);
                    }
                }
            }
            _.blur();
            if (!navClickTimer) {
                navClickTimer = setTimeout(function() {
                    clearTimeout(navClickTimer);
                    navClickTimer = null;
                }, 1000);
            }
            //DEBUG responseData.data ? '阻止 Native 默认行为' : '不阻止 Native 默认行为'
            responseCallback(responseData);
        })
    }

    // fixed NavOpt
    function fixedNavOpt(navOpt, param) {
        var nOpt = {};
        if (navOpt) {
            if (_.isFunction(navOpt)) {
                nOpt = navOpt(param) || {};
            } else {
                nOpt = _.extend(true, {}, navOpt);
            }

            navBtns.forEach(function(btn) {
                if (nOpt[btn]) {
                    if (!nOpt[btn].style) {
                        nOpt[btn].style = 'text';
                    } else if (nOpt[btn].style === 'icon') {
                        nOpt[btn].icon = unescape('%u' + nOpt[btn].icon);
                    }
                }
            });
        }

        if (!nOpt.left) {
            nOpt.left = {
                style: 'icon',
                icon: '\uf07d'
            };
        }

        return nOpt;
    }

    // 初始化 Filter
    function initFilter() {
        QApp.router.on('willForward', function(data) {
            QApp.open(data.view, {
                param: data.query
            });
            return false;
        });

        QApp.router.addOpenFilter(function(args) {
            if (args.length && args[0]) {
                var originName = args[0],
                    viewName = originName.split(':')[0],
                    opt = args[1] || {},
                    param = opt.param || {},
                    viewOptions = Config.viewOptions[viewName] || {},
                    navOpt = viewOptions.nav || {},
                    viewType = viewOptions.type || navOpt.type || Config.webViewType,
                    loadView = viewOptions.loadViewType || navOpt.loadViewType || Config.loadViewType || 'auto',
                    url, schema;

                //DEBUG '打开的 View Name 为:', viewName, '参数为:', param, 'WebView 类型为:', viewType, 'Loading 设置为', loadView

                if (originName.indexOf(':new') > -1) {
                    originName = originName.replace(':new', ':' + _.getUniqueID());
                }

                if (viewOptions.schema) {
                    setCurView(originName);
                    schema = viewOptions.schema;
                    if (schema.indexOf('//') === 0) {
                        schema = curProtocol + ':' + schema;
                    }
                    //DEBUG '打开 Schema:', schema
                    location.href = schema;
                } else {
                    if (viewOptions.url) {
                        url = viewOptions.url;
                    } else {
                        url = QApp.router.buildUrl({
                            view: originName,
                            query: param
                        });
                    }

                    openCallbacks[originName] = {
                        complete: opt.onComplete,
                        hide: opt.onHide
                    };

                    navOpt = fixedNavOpt(navOpt, param);
                    Hy.open({
                        name: prefixHy + '-' + Config.hybridId + '-' + originName,
                        loadview: loadView,
                        url: url,
                        type: viewType,
                        navigation: navOpt
                    });
                }

                // open 新 webview 后，阻止 手势 1s，以免发生问题
                // 解决点击两次的问题
                if (QApp.gesture) {
                    QApp.gesture.disable();
                    setTimeout(function() {
                        QApp.gesture.enable();
                    }, 1000);
                }
            }

            return false;
        });

        HyAdapter.trigger('initFilter');
    }

    // View add refreshHeader Function

    QApp.addPlugin('hy', Config, function(view, options) {
        view.refreshHeader = function(navOpt) {
            navOpt = fixedNavOpt(navOpt);
            if (options.refreshH5Header) {
                refreshH5Header(view.root, navOpt);
            }
            refreshNativeHeader(navOpt);
        };
    });

    QApp.setGlobalPlugins('hy');


    // Qunar Client Bridge
    function connectQunarBridge(callback) {
        if (window.QunarJSBridge) {
            callback(window.QunarJSBridge);
        } else {
            document.addEventListener("QunarJSBridgeReady_v1", function() {
                callback(window.QunarJSBridge);
            }, false);
        }
    }

    // Virtual View
    function defineVirtualView(key, opt) {
        QApp.defineView(key, {
            html: '<i></i>',
            styles: {
                backgroundColor: 'transparent'
            },
            bindEvents: {
                show: function() {
                    var view = this,
                        hided = false;

                    opt.render.call(view, view.param, function() {
                        if (sniff.hyApp) {
                            initFilter();
                        }
                    }, function(data) {
                        if (!hided && view.hide) {
                            hided = true;
                            view.complete(data);
                            view.hide();
                        }
                    });
                }
            },
            extra: {
                moveEnter: {
                    duration: 0
                }
            }
        });
    }

    // Transfer View
    QApp.defineView('__login_transfer', {
        html: '',
        ready: function() {
            if (sniff.hyApp) {
                Hy.back();
            } else {
                history.go(-3);
            }
        }
    });

    function doJsonp(options, listener) {

        var trans = {},
            isCanceled = false, // 是否被取消
            callbackName = '', // 回调函数名
            overwritten, // 用户回调函数寄存
            hasSetCallbackName = false, // 用户是否设置回调函数名
            scriptElem = document.createElement('script'),
            timer;

        function backingOut() {
            if (hasSetCallbackName) {
                window[callbackName] = overwritten;
            } else {
                delete window[callbackName];
            }
            _.removeNode(scriptElem);
        }
        scriptElem.src = options.url;

        var URL = _.parseURL(scriptElem.src);

        URL.query = _.extend(URL.query, options.data);


        if (options.jsonpCallback) {
            hasSetCallbackName = true;
            overwritten = window[options.jsonpCallback];
        } else {
            options.jsonpCallback = 'QApp_' + (+new Date()) + (jsonpExtraStamp++);
        }
        callbackName = options.jsonpCallback;
        URL.query[options.jsonp] = callbackName;

        if (options.cache === false) {
            URL.query.__rnd = (+new Date()) + (jsonpExtraStamp++);
        }
        trans.abort = function() {
            isCanceled = true;
            listener(null, {
                error: true,
                type: 'Abort'
            });
            backingOut();
        }

        window[callbackName] = function(data) {
            if (timer) {
                clearTimeout(timer);
            }
            if (isCanceled) {
                return;
            }
            listener(data);
            backingOut();
        };

        timer = _.delay(function() {
            listener(null, {
                error: true,
                type: 'Timeout'
            });
            backingOut();
        }, options.timeout);


        /**
         * 插入 script 元素
         */
        // 创建 script 元素
        scriptElem.async = true;
        scriptElem.charset = options.charset;
        scriptElem.src = URL.toUrl();
        // script 元素事件绑定
        scriptElem.onerror = function() {
            if (timer) {
                clearTimeout(timer);
            }

            listener(null, {
                error: true,
                type: 'Fail'
            });
            backingOut();
        }

        // 强势插入
        document.head.appendChild(scriptElem);

        return trans;
    }

    function doLogin(callback) {
        var transferUrl = location.href.split('#')[0] + '#__login_transfer';
        if (sniff.hyApp) {
            Hy.checkApi({
                jsApiList: [loginBridgeKey]
            }, function(ret) {
                if (ret && ret.data && ret.data[loginBridgeKey]) {
                    Hy.login({
                        shouldOpenLogin: true
                    }, function() {
                        if (_.isFunction(callback)) {
                            callback(getLoginInfo());
                        }
                    });
                } else {
                    Hy.open({
                        type: 'navibar-normal',
                        navigation: {
                            title: {
                                style: 'text',
                                text: '登录'
                            }
                        },
                        url: Config.loginUrl + '?ret=' + encodeURIComponent(transferUrl) + '&showHeader=false&showFooter=false'
                    });
                    Hy.onceShow(function() {
                        if (_.isFunction(callback)) {
                            callback(getLoginInfo());
                        }
                    });
                }
            });
        } else {
            location.href = Config.loginUrl + '?ret=' + encodeURIComponent(transferUrl) + '&goback=1'
        }
    }

    HyAdapter.checkLogin = function(callback) {
        doJsonp({
            url: Config.checkLoginUrl,
            jsonp: 'callback',
            timeout: 5000
        }, function(data, err) {
            if (_.isFunction(callback)) {
                callback(err ? {
                    ret: false
                } : {
                    ret: true,
                    login: data.ret && data.data && data.data.loginState == 2,
                    state: (data.data && data.data.loginState) || 0
                });
            }
        });
    };

    HyAdapter.login = function(callback, doCheck) {
        if (doCheck) {
            HyAdapter.checkLogin(function(data) {
                if (data.ret && data.login) {
                    if (_.isFunction(callback)) {
                        callback(getLoginInfo());
                    }
                } else {
                    doLogin(callback);
                }
            });
        } else {
            doLogin(callback);
        }
    };

    HyAdapter.logout = function() {
        location.href = Config.logoutUrl + '?ret=' + encodeURIComponent(location.href);
    };

    checkDefer.done(function() {
        // Main Logic

        if (_.isFunction(Config.ready)) {
            Config.ready();
        }

        _.each(Config.viewOptions, function(key, opt) {
            if (opt.render) {
                defineVirtualView(key, opt);
            }
        });

        // Hy
        if (sniff.hyApp) {

            var info = QApp.hash.analyzeHash(),
                originName = info.view,
                viewName = info.view.split(':')[0],
                param = info.query || {},
                viewOptions = Config.viewOptions[viewName] || {},
                navOpt = viewOptions.nav || {},
                viewType = viewOptions.type || navOpt.type || Config.webViewType,
                loadView = viewOptions.loadViewType || navOpt.loadViewType || Config.loadViewType,
                fixParam = viewOptions.fixParam || _.noop;

            Hy.getHistory(function(data) {
                if (data.ret && data.data.list) {
                    var len = data.data.list.length;
                    historyList = data.data.list.map(function(item, index) {
                        if (index == len - 1) {
                            return prefixHy + '-' + Config.hybridId + '-' + originName;
                        }
                        if (_.isString(item)) {
                            return item;
                        } else {
                            return item.name;
                        }
                    });
                    //DEBUG '获取到的 History List 为:', historyList
                }
            });

            QApp.config({
                type: 'mobile',
                hashRouter: true,
                autoInit: false,
                root: {
                    top: viewType == 'navibar-normal' ? (function() {
                        if (_.isNumber(Config.hdHeight)) {
                            var dpr = parseInt(window.dpr) || 1;
                            return -dpr * Config.hdHeight;
                        } else if (_.isFunction(Config.hdHeight)) {
                            return -Config.hdHeight();
                        } else {
                            return 0;
                        }
                    })() : viewType == 'navibar-none' ? QApp.sniff.ios ? (function() {
                        var dpr = parseInt(window.dpr) || 1;
                        return dpr * parseInt(Config.barHeight);
                    })() : 0 : 0
                }
            });

            if (loadView == 'hold') {
                Hy.onLoadingClose(function(data, callback) {
                    callback({
                        data: true
                    });
                });
            }

            QApp.ready(function() {
                function notify(event, view) {
                    var callback = viewOptions['on' + event.replace(/\w/, function($1) {
                        return $1.toUpperCase();
                    })];
                    HyAdapter.trigger(event, view);
                    if (_.isFunction(callback)) {
                        callback.call(view);
                    }
                }

                fixParam(param);
                navOpt = fixedNavOpt(navOpt, param);

                //DEBUG '刷新 Native Header'
                Hy.navRefresh(navOpt);
                //DEBUG '设置 WebView 属性'
                Hy.setWebViewAttribute({
                    name: prefixHy + '-' + Config.hybridId + '-' + originName
                });
                if (viewOptions.disableBackGestrue) {
                    //DEBUG '禁用 ios 回退手势'
                    Hy.enableGesture({
                        enable: false
                    })
                }

                setCurView(originName);

                QApp.router.getCurViewName = function() {
                    return localStorage.getItem('curViewName');
                };

                QApp.router.getPreViewName = function() {
                    return localStorage.getItem('perViewName');
                };

                QApp.router.home = function(data) {
                    var toName;
                    if (historyList && historyList.length) {
                        for (var i = historyList.length - 1; i > -1; i--) {
                            if (historyList[i - 1] && historyList[i - 1].indexOf(prefixHy + '-' + Config.hybridId) !== 0) {
                                toName = historyList[i];
                                break;
                            }
                        }
                        if (!toName) {
                            toName = historyList[0];
                        }
                    } else {
                        toName = Config.indexView;
                    }
                    Hy.back({
                        name: toName,
                        data: {
                            name: originName,
                            view: viewName,
                            hybridId: Config.hybridId,
                            data: data
                        }
                    });
                };

                QApp.exit = QApp.router.exit = function(data) {
                    var toName;
                    if (historyList && historyList.length) {
                        for (var i = historyList.length - 2; i > -1; i--) {
                            if (historyList[i] && historyList[i].indexOf(prefixHy + '-' + Config.hybridId) !== 0) {
                                if (QApp.sniff.ios) {
                                    toName = historyList[i];
                                } else {
                                    toName = historyList[i + 1];
                                }
                                break;
                            }
                        }
                        if (!toName) {
                            toName = historyList[0];
                        }
                    }
                    Hy.back({
                        name: toName,
                        data: {
                            name: originName,
                            view: viewName,
                            hybridId: Config.hybridId,
                            data: data
                        }
                    });
                    if (!QApp.sniff.ios) {
                        Hy.back();
                    }
                };

                QApp.router.back = function(num, data) {
                    var toName,
                        param = {
                            data: {
                                name: originName,
                                view: viewName,
                                hybridId: Config.hybridId,
                                data: data
                            }
                        };
                    num = num || 1;
                    if (num != 1) {
                        if (historyList && historyList.length) {
                            if (historyList.length > num) {
                                toName = historyList[historyList.length - num - 1];
                            } else {
                                toName = historyList[0];
                            }
                        }
                    }
                    if (toName) {
                        param.name = toName;
                    }
                    Hy.back(param);
                };

                QApp.router.goto = function(name, options, data, allMatch) {
                    if (QApp.router.backTo(name, data, allMatch) === false) {
                        QApp.router.open(name, options);
                    }
                };

                QApp.router.backTo = function(name, data, allMatch, outProject) {
                    var toName, i;
                    if (!outProject && name.indexOf(prefixHy + '-' + Config.hybridId) !== 0) {
                        name = prefixHy + '-' + Config.hybridId + '-' + name;
                    }
                    if (!allMatch) {
                        allMatch = name.indexOf(':') > -1;
                    }
                    if (allMatch) {
                        name = name.replace(/\:0$/, '');
                    }

                    if (historyList && historyList.length) {
                        if (!allMatch) {
                            for (i = historyList.length - 1; i > -1; i--) {
                                if (historyList[i] && new RegExp(name + '$').test(historyList[i])) {
                                    toName = historyList[i];
                                    break;
                                }
                            }
                        } else {
                            for (i = historyList.length - 1; i > -1; i--) {
                                if (historyList[i] && historyList[i] == name) {
                                    toName = name;
                                    break;
                                }
                            }
                        }
                    } else {
                        toName = name;
                    }
                    if (toName) {
                        Hy.back({
                            name: toName,
                            data: {
                                name: originName,
                                view: viewName,
                                hybridId: Config.hybridId,
                                data: data
                            }
                        });
                        return true;
                    } else {
                        return false;
                    }
                };

                //DEBUG '开始打开视图', viewName
                QApp.open(viewName, {
                    param: param,
                    atBottom: true
                }, function(view) {
                    //DEBUG '已打开视图', view.name
                    if (view) {
                        var _complete = view.complete,
                            completeData,
                            actived = true,
                            bindShow = false,
                            bindEvents = viewOptions.bindEvents || {};

                        _.each(bindEvents, function(key, fn) {
                            if (_.isFunction(fn)) {
                                if (/^nav:/.test(key)) {
                                    HyAdapter.on(key, fn)
                                } else {
                                    view.on(key, fn);
                                }
                            }
                        });

                        notify('show', view);
                        if (_.isFunction(bindEvents.show)) {
                            bindEvents.show.call(view);
                        }
                        notify('actived', view);
                        if (_.isFunction(bindEvents.actived)) {
                            bindEvents.actived.call(view);
                        }

                        view.hide = function(data) {
                            Hy.back({
                                data: {
                                    view: viewName,
                                    name: originName,
                                    data: data || completeData
                                }
                            });
                        };
                        view.complete = function(data) {
                            completeData = data;
                            if (_.isFunction(_complete)) {
                                _complete.call(view, data);
                            }
                        };

                        view.hideLoading = function() {
                            Hy.hideLoading();
                        };

                        Hy.onReceiveData(function(data) {
                            view.trigger('receiveData', data);
                            // 兼容老逻辑
                            if (data && data.view && openCallbacks[data.view]) {
                                if (_.isFunction(openCallbacks[data.view].complete)) {
                                    openCallbacks[data.view].complete(data.data);
                                }
                                if (_.isFunction(openCallbacks[data.view].hide)) {
                                    openCallbacks[data.view].hide();
                                }
                            }
                        });
                        Hy.onHide(function() {
                            //DEBUG 'Hide -> Deactived'
                            if (!bindShow) {
                                bindShow = true;
                                Hy.onShow(function() {
                                    //DEBUG 'Show -> Actived'
                                    Cookie.refresh();
                                    notify('actived', view);
                                    if (!actived) {
                                        actived = true;
                                        setCurView(originName);
                                        view.trigger('actived');
                                        QApp.router.trigger('back', view);
                                    }
                                });
                            }
                            notify('deactived', view);
                            if (actived) {
                                actived = false;
                                view.trigger('deactived');
                            }
                        });

                        if (viewName == Config.indexView) {
                            QApp.router.trigger('init', view);
                        } else {
                            QApp.router.trigger('forward', view);
                        }
                    }
                    listenerNavClick(view.root);
                    initFilter();
                });

            });

            if (QApp.sniff.android && QApp.checkResize) {
                hy.onResize(function() {
                    _.delay(QApp.checkResize, 10);
                });
            }

        } else if (sniff.qunarApp) {
            //DEBUG '执行 Qunar 客户端非 Hy 环境逻辑'
            QApp.config({
                indexView: Config.indexView
            });

            QApp.router.on('init', function() {
                connectQunarBridge(function(bridge) {
                    //DEBUG '隐藏 Native Header'
                    bridge.call("hideNativeBar");
                });
            });

            QApp.on('close', function() {
                connectQunarBridge(function(bridge) {
                    //DEBUG '关闭 WebView'
                    bridge.call("closeWeb", {}, function(e) {});
                });
            });

        } else {
            //DEBUG '执行 Touch 环境逻辑'
            QApp.config({
                indexView: Config.indexView
            });

            if (!QApp.sniff.pc && !QApp.sniff.webApp) {
                sniff.mobileApp = true;

                var bindShow = false;

                if (QApp.sniff.browsers.wechat || QApp.sniff.browsers.weibo) {
                    QApp.config({
                        type: 'mobile',
                        root: {
                            top: Config.useAppHeader ? (function() {
                                if (_.isNumber(Config.hdHeight)) {
                                    var dpr = parseInt(window.dpr) || 1;
                                    return -dpr * Config.hdHeight;
                                } else if (_.isFunction(Config.hdHeight)) {
                                    return -Config.hdHeight();
                                } else {
                                    return 0;
                                }
                            })() : 0
                        }
                    });
                }

                if (Config.useTransfer) {
                    QApp.router.on('willForward', function(data) {
                        QApp.router.transfer(data.view, data.query);
                        if (!bindShow) {
                            window.addEventListener('pageshow', function() {
                                QApp.router.resetHistory();
                            }, true);
                            bindShow = true;
                        }
                        return false;
                    });
                }
            } else if (QApp.sniff.webApp) {
                sniff.webApp = true;

                QApp.config({
                    type: 'app'
                });
            }

        }
    });

    HyAdapter.config = function(options) {
        if (options) {
            options.indexView = options.indexView || QApp.config().indexView;
            _.extend(true, Config, options);
            _.each(Config.bindEvents, function(key, fn) {
                if (_.isFunction(fn)) {
                    HyAdapter.on(key, fn);
                }
            });
            QApp.config({
                indexView: Config.indexView,
                jsonParam: Config.jsonParam
            });
        }

        if (QApp.sniff.browsers.wechat) {
            var view = (QApp.router.getCurInfo() || {}).view.split(':')[0];
            if (view && Config.viewOptions[view]) {
                var nav = Config.viewOptions[view].nav;
                if (nav && nav.title) {
                    document.title = nav.title.text;
                }
            }
        }

        return Config;
    };

    // init 如果是 qunarApp 则再判断是否是 Hy

    QApp.addReadyDependencies(checkDefer);

    //DEBUG '初始化 QApp-Hy'
    if (sniff.qunarApp) {
        //DEBUG '判断为 Qunar 客户端环境'
        //DEBUG '开始监听 WebViewJavascriptBridgeReady 事件'
        document.addEventListener('WebViewJavascriptBridgeReady', function(event) {
            //DEBUG checkDefer.state() == 'pending' ? '桥注入成功' : ''
            HyBridge = event.bridge;
            sniff.qunarApp = false;
            sniff.hyApp = true;
            initHy();
            _.delay(function() {
                checkDefer.resolve();
            }, 1);
        });

        _.ready(function() {
            _.delay(function() {
                //DEBUG checkDefer.state() == 'pending' ? '桥注入超时。Dom Ready 后 ' + opt.bridgeDelay + 'ms' : ''
                checkDefer.resolve();
            }, opt.bridgeDelay);
        });
    } else {
        //DEBUG '判断为 非Qunar 客户端环境'
        _.ready(function() {
            checkDefer.resolve();
        });
    }
})();
