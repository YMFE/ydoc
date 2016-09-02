(function () {

    var _ = QApp.util,
        Deferred = _.Deferred;

    var bizOptions = {},
        mockData = {},
        reqFilters = [],
        respFilters = [],
        jsonpExtraStamp = 0;

    var DEFAULT_OPT = {
        'url': '',
        'bizType': false,
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'data': {},
        'argsType': 'query',
        'method': 'get',
        'headers': {},
        'isEncode': false,
        'dataType': 'json',
        'cache': false,
        'withCredentials': false,
        'jsonp': 'callback',
        'jsonpCallback': '',
        'success': _.noop,
        'error': _.noop,
        'onTimeout': _.noop,
        'onAbort': _.noop
    };

    function notNull(v) {
        return !(v === null || v === void 0);
    }

    function format(data, isEncode) {
        data = (data === null ? '' : data).toString().trim();
        return isEncode ? encodeURIComponent(data) : data;
    }

    function jsonToQuery(json, isEncode){
        var qs = [], k, i, len;
        for (k in json) {
            if(k === '$nullName'){
                qs = qs.concat(json[k]);
            } else if (_.isArray(json[k])) {
                for (i = 0, len = json[k].length; i < len; i++) {
                    if (!_.isFunction(json[k][i])) {
                        qs.push(k + "=" + format(json[k][i], isEncode));
                    }
                }
            } else if(!_.isFunction(json[k]) && notNull(json[k])){
                qs.push(k + "=" + format(json[k], isEncode));
            }
        }
        return qs.join('&');
    }

    function getXMLHttpRequest() {
        var xhr = false;
        try {
            xhr = new XMLHttpRequest();
        } catch (try_MS) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (other_MS) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    xhr = false;
                }
            }
        }
        return xhr;
    }

    function setRequestHeader(trans, headers) {
        try {
            for (var key in headers) {
                trans.setRequestHeader(key, headers[key]);
            }
        } catch (e) {
        }
    }

    /**
     * 一般 ajax 请求处理函数（除 jsonp）
     * @param  {[type]} options  合并后的配置项
     * @param  {[type]} listener [description]
     * @return {[type]} trans    [description]
     */
    function doRequest(options, listener) {
        var trans = getXMLHttpRequest(),
            timeout,
            argsString = '',
            method = options.method.toLocaleLowerCase();

        if (options.withCredentials) {
            trans.withCredentials = true;
        }

        if (options.timeout) {
            timeout = _.delay(function () {
                try {
                    listener(null, {error: true, type: 'Timeout'});
                    trans.abort();
                } catch (exp) {
                }
            }, options.timeout);
        }

        /**
         * 重写 abort 方法
         * 原 abort 方法无法与无网络状态区分
         */
        var isAborted = false,
            _abort = trans.abort;

        trans.abort = function() {
            isAborted = true;
            _abort.call(trans);

            listener(null, {error: true, type: 'Abort'});
        }

        trans.onreadystatechange = function () {


            if (trans.readyState == 4) {
                clearTimeout(timeout);
                var data = {};
                if (options.dataType === 'xml') {
                    data = trans.responseXML;
                } else if (options.dataType === 'text') {
                    data = trans.responseText;
                } else {
                    try {
                        data = (trans.responseText && typeof trans.responseText === 'string') ? JSON.parse(trans.responseText) : {};
                    } catch (exp) {
                    }
                }
                if (trans.status === 200) {
                    listener(data);
                } else if (trans.status === 0) {
                    // 如果不是手动 abort 的
                    if (!isAborted) {
                        // 无网络
                        listener(null, {error: true, type: 'Fail'});
                    }
                } else {
                    listener(null, {error: true, type: 'Fail'});
                }
            }
        };

        /**
         * cache 处理
         * 默认为 false
         * 当为 get 请求时添加时间戳
         */
        if (method === 'get') {
            if (options.cache === false) {
                options.data.__rnd = new Date().getTime();
            }
        }

        if (options.argsType === 'query') {
            argsString = jsonToQuery(options.data, options.isEncode);
        } else if (options.argsType === 'json') {
            argsString = JSON.stringify(options.data);
            if (options.isEncode) {
                argsString = encodeURIComponent(argsString);
            }
        }

        // 设置 Content-Type
        if (!options.headers['Content-Type']) {
            // 如果用户未定义
            if (options.argsType === 'json') {
                // 如果用户设置请求数据格式为 json
                options.headers['Content-Type'] = 'application/json;charset=' + options.charset;
            } else {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=' + options.charset;
            }
        }
        // 设置 X-Requested-With
        if (!options.headers['X-Requested-With']) {
            options.headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        if (method === 'get') {
            var url
            if (argsString) {
                url = options.url + (!~options.url.indexOf('?') ? '?' : '&') + argsString
            } else {
                url = options.url
            }
            trans.open('get', url, true);
            setRequestHeader(trans, options.headers);
            trans.send('');
        } else {
            trans.open('post', options.url, true);
            setRequestHeader(trans, options.headers);
            trans.send(argsString);
        }

        return trans;
    }

    /**
     * jsonp 请求处理函数
     * @return {[type]} [description]
     */
    function doJsonp(options, listener) {

        var trans = {},
            isCanceled = false,         // 是否被取消
            callbackName = '',          // 回调函数名
            overwritten,                // 用户回调函数寄存
            hasSetCallbackName = false, // 用户是否设置回调函数名
            scriptElem = document.createElement('script'),
            timer;

        /**
         * url 处理
         */
        // 相对路径转绝对路径
        // 参考 http://blog.wangdagen.com/coding/2015/01/29/get-url-ie.html
        scriptElem.src = options.url;

        // ie7- 下需要再赋值一次，qapp 目前不需要支持 ie
        // scriptElem.src ＝ scriptElem.src

        var URL = _.parseURL(scriptElem.src);

        URL.query = _.extend(URL.query, options.data);

        /**
         * 回调函数名
         */
        if (options.jsonpCallback) {
            // 如果用户设置了回调函数名
            hasSetCallbackName = true;
            // 寄存回调函数
            overwritten = window[options.jsonpCallback];
        } else {
            // 如果用户没有设置回调函数名，生成随机函数名
            options.jsonpCallback = 'QApp_' + (+ new Date()) + (jsonpExtraStamp ++);
        }
        callbackName = options.jsonpCallback;
        URL.query[options.jsonp] = callbackName;

        /**
         * cache 处理
         * 默认为 false
         */
        if (options.cache === false) {
            // 唯一数字戳
            URL.query.__rnd = (+ new Date()) + (jsonpExtraStamp ++);
        }

        /**
         * abort 方法
         */
        trans.abort = function() {
            isCanceled = true

            listener(null, {error: true, type: 'Abort'});
            backingOut();
        }

        window[callbackName] = function(data) {

            if (timer) {
                clearTimeout(timer);
            }

            if (isCanceled) {
                return
            }

            listener(data);
            backingOut();
        };

        timer = _.delay(function() {
            listener(null, {error: true, type: 'Timeout'});
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

            listener(null, {error: true, type: 'Fail'});
            backingOut();
        }

        // 强势插入
        document.head.appendChild(scriptElem);

        return trans;

        /**
         * 各种回调结束后的现场恢复函数
         */
        function backingOut() {
            // 回调函数处理
            if (hasSetCallbackName) {
                // 如果回调函数是用户设置，恢复
                window[callbackName] = overwritten;
            } else {
                // 如果回调函数不是用户设置，销毁
                delete window[callbackName];
            }
            // script 元素删除
            scriptElem.remove();
        }
    }

    function mockAjax(opt, deferred) {
        var mockObj = mockData[opt.mockKey || ''],
            data = null;
        _.delay(function () {
            if (mockObj) {
                if (_.isFunction(mockObj)) {
                    data = mockObj(opt);
                } else {
                    data = mockObj;
                }
            }
            var flag = true;
            respFilters.forEach(function(filter) {
                if (filter(data, null, opt, deferred) === false) {
                    flag = false;
                }
            });
            if (flag) {
                deferred.resolve(data);
                opt.success(data, null);
            }
        }, opt.mockTime || 1000);
    }

    var ajax = QApp.ajax = _.ajax = function (options) {
        if (_.isString(options)) {
            options = {url: options};
        }

        if (options.bizType && bizOptions[options.bizType]) {
            options = _.extend(true, {}, bizOptions[options.bizType], options);
        }



        var deferred = new Deferred(),
            opt = _.extend(true, {}, DEFAULT_OPT, options),
            trans = {},
            flag = true;

        reqFilters.forEach(function(filer) {
            if (filer(opt, deferred) === false) {
                flag = false;
            }
        });

        if (flag) {
            if (opt.mock) {
                trans.abort = function () {
                    deferred.reject({
                        error: true,
                        type: 'Abort'
                    });
                    opt.onAbort(null, trans);
                };
                mockAjax(opt, deferred);
            } else if (options.dataType === 'jsonp') {
                /**
                 * ------------- jsonp code here -------------
                 */
                trans = doJsonp(opt, listener);
            } else {
                /**
                 * ------------- common ajax code here -------------
                 */
                trans = doRequest(opt, listener);
            }
        }

        deferred.trans = trans;

        return deferred;


        function listener(data, err) {
            var flag = true;
            respFilters.forEach(function (filter) {
                if (filter(data, err, opt, deferred) === false) {
                    flag = false;
                }
            });
            if (flag) {
                if (err) {
                    deferred.reject(err);
                    if (err.type === 'Timeout') {
                        opt.onTimeout(data, trans);
                    } else if (err.type === 'Abort') {
                        opt.onAbort(data, trans);
                    } else {
                        opt.error(data, trans);
                    }
                } else {
                    deferred.resolve(data);
                    opt.success(data, trans);
                }
            }
        }
    };

    QApp.ajax.setBizOptions = function(key, opt) {
        if (_.isString(key)) {
            bizOptions[key] = opt;
        } else {
            _.extend(true, bizOptions, key);
        }
    };

    QApp.ajax.addMock = function(key, mock) {
        if (_.isString(key)) {
            mockData[key] = mock;
        } else {
            mockData = key;
        }
    };

    QApp.ajax.addReqFilter = function(filter) {
        reqFilters = reqFilters.concat(filter);
    };

    QApp.ajax.removeReqFilter = function(filter) {
        var index = reqFilters.indexOf(filter);
        if (index > -1) {
            reqFilters.splice(index, 1);
        }
    };

    QApp.ajax.addRespFilter = function(filter) {
        respFilters = respFilters.concat(filter);
    };

    QApp.ajax.removeRespFilter = function(filter) {
        var index = respFilters.indexOf(filter);
        if (index > -1) {
            respFilters.splice(index, 1);
        }
    };

    QApp.addPlugin('ajax', {
        bizType: '',
        mock: false
    }, function(view, opt) {

        var list = [];

        view.ajax = function(options) {
            var opts = _.extend(true, {}, opt, options);
            opts.__view = view;
            var _ajax = ajax(opts);
            list.push(_ajax);
            _ajax.all(function() {
                list.splice(list.indexOf(_ajax), 1);
            });
            return _ajax;
        };

        view.on('destroy', function() {
            list.forEach(function(_ajax) {
                _ajax.destroy();
                _ajax.trans && _ajax.trans.abort();
            });
            list.length = 0;
            list = null;
        });

    });

})();
