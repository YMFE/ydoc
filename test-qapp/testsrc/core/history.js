define('history', function() {

    var $viewM = r('viewM');

    var location = win.location,
        history = win.history,
        sessionStorage = win.sessionStorage,
        sessionSupport = !!sessionStorage, // 支持sessionStorage情况
        historyStorage = sessionSupport ? win.sessionStorage : win.localStorage, // 历史纪录存储
        useHash = TRUE, // 是否开启 Hash
        hashSupport = NULL, // Hash 支持情况情况
        usePath = NULL, // Hash 支持情况情况
        h5Mode = !!(history.pushState), // h5 模式
        hashChangeEvent = h5Mode ? 'popstate' : 'hashchange', // 监听的事件
        localKeyPrefix = 'QAPP_HISTORY_', // 存储的前缀
        localKeyId = 0, // 本地存储的id
        localKey = '', // 本地历史存储的 key = localKeyPrefix + localKeyId
        historyHashId = '_history',
        localHistory = [], // 本地历史
        backLocalHistory = [],
        historyIndex = 0, // 历史索引
        backHistoryIndex = 0,
        virtualHistory = [], // 虚拟历史
        eventManager = _createEventManager(), // 事件管理
        getRealName = $viewM.getRealName, // 获取 realname
        paramList = [], // Param List
        basePath = (function() {
            var obj = _parseURL(location.href);
            obj.hash = {};
            delete obj.query._qtid;
            return obj.toUrl();
        })(), // 页面基础 Url
        curHash, // 当前的Hash
        infoCache; // info 缓存

    // fix Name
    function fixName(name) {
        if (name.length > 2 && name.lastIndexOf(':0') == name.length - 2) {
            return name.substring(0, name.length - 2);
        }
        return name;
    }

    // 是否支持hash
    function supportHash(view) {
        view = getRealName(view);
        var viewOpt = $viewM.getOptions(view);
        // 视图配置不支持hash
        if (!viewOpt || viewOpt.supportHash === FALSE) {
            return FALSE;
        }
        // all时排定排除
        if (hashSupport.all && hashSupport.except.indexOf(view) > -1) {
            return FALSE;
        }
        // 非all时判定存在
        if (!hashSupport.all && hashSupport.exist.indexOf(view) === -1) {
            return FALSE;
        }
        return TRUE;
    }

    // 获取数组最后一个元素
    function getLast(list) {
        return list[list.length - 1];
    }

    // 触发事件
    function pushMessage(type, data) {
        return eventManager.trigger('change', {
            type: type,
            data: _extend(TRUE, {}, data)
        });
    }


    // 初始化 本地历史
    function initLocalHistory() {
        var data = {},
            curInfo = analyzeHash();

        // 开头为 __ 为特殊的跳转视图，不做历史纪录的判定
        if (curInfo.view && curInfo.view.indexOf('__')) {

            if (sessionSupport) {
                //INFO '[History] 使用 sessionStorage 存储历史记录'
                localKey = historyHashId;
            } else {
                //INFO '[History] 使用 Hash 储存历史纪录'
                if (curInfo.query[historyHashId]) {
                    localKeyId = curInfo.query[historyHashId];
                    localKey = localKeyPrefix + localKeyId;
                } else {
                    do {
                        localKeyId = _getUniqueID();
                        localKey = localKeyPrefix + localKeyId;
                    } while (historyStorage[localKey]);
                    setInfo(curInfo, TRUE);
                }
                //INFO '[History] Hash 历史 ID:', localKeyId
            }

            try {
                data = JSON.parse(historyStorage.getItem(localKey)) || {};
            } catch (e) {}

            if (data.basePath == basePath) {
                localHistory = _makeArray(data.history);
                historyIndex = data.index;
                // 判断历史是否和页面显示一直，如果不一致，清空
                if (localHistory[historyIndex] !== curInfo.view) {
                    localHistory = [];
                    historyIndex = 0;
                    historyStorage.removeItem(localKey);
                }
            }

            if (!localHistory.length) {
                localHistory.push(curInfo.view);
            }

            backLocalHistory = localHistory.slice(0);
            backHistoryIndex = historyIndex;

            //INFO '[History] 当前历史纪录', JSON.stringify(localHistory)

        }
    }


    // 存储历史
    function saveHistory() {
        //INFO '[History] 存储历史: ', JSON.stringify(localHistory), '索引位置', historyIndex
        try {
            historyStorage.setItem(localKey, JSON.stringify({
                basePath: basePath,
                history: localHistory,
                index: historyIndex
            }));
        } catch (e) {}
    }

    // 更改历史
    function setHistory(view, replace) {
        if (replace) {
            localHistory[historyIndex] = view;
        } else {
            historyIndex++;
            localHistory = localHistory.slice(0, historyIndex);
            localHistory.push(view);
        }
        saveHistory();
    }

    // 获取 Hash
    // 以 # 开头，以 # 结尾
    function getHash() {
        var path = location.hash,
            index = path.indexOf('#'),
            endIndex;
        if (usePath) {
            path = location.pathname.replace(usePath.basePath, '').replace(usePath.ext, '');
        } else {
            path = index > -1 ? path.slice(index + 1) : '';
            endIndex = path.indexOf('#');
            if (endIndex > -1) {
                path = path.slice(0, endIndex);
            }
        }
        return path;
    }

    // 设置 hash
    function setHash(hash, replace) {
        var path = basePath + '#' + hash;
        curHash = hash;
        if (h5Mode) {
            if (usePath) {
                var kv = hash.split('?');
                path = basePath + kv[0] + usePath.ext + (kv.length > 1 ? '?' + kv.slice(1).join('?') : '');
            }
            history[(replace ? 'replace' : 'push') + 'State']({
                path: path
            }, doc.title, path);
        } else {
            if (replace) {
                location.replace(path);
            } else {
                location.href = path;
            }
        }
    }

    // 获取 路由信息
    function analyzeHash(hash) {
        hash = hash || getHash();
        var vq = hash.split('?'),
            view = fixName(vq[0]) || Config.indexView,
            query = _queryToJson(vq[1] || '', TRUE);

        if (Config.jsonParam && query._param) {
            try {
                query = _extend(TRUE, query, JSON.parse(query._param));
                delete query._param;
            } catch (e) {}
        }

        return {
            view: view,
            query: query
        };
    }

    // 获取 路由信息
    function getInfo() {
        if (infoCache) {
            return infoCache;
        }
        infoCache = useHash ? (function() {
            var info = analyzeHash();
            info[historyHashId] = UNDEFINED;
            return info;
        })() : getLast(virtualHistory);
        return infoCache;
    }

    // 设置 路由信息
    function setInfo(info, replace) {
        info = info || {};

        var view = info.view || Config.indexView,
            query = info.query || {},
            curInfo = getInfo(),
            queryString;

        replace = replace || view == curInfo.view;

        infoCache = NULL;

        if (useHash) {
            if (!sessionSupport) {
                // 增加 History ID
                query[historyHashId] = localKeyId;
            }

            setHistory(view, replace);
            if (pushMessage('willForward', {
                    view: view,
                    query: query
                }) !== FALSE) {
                queryString = _jsonToQuery(Config.jsonParam ? {
                    _param: JSON.stringify(query)
                } : query, TRUE);
                setHash(view + (queryString ? '?' + queryString : ''), replace);
            } else {
                return FALSE;
            }
        } else {
            var newInfo = {
                view: view,
                query: query
            };
            if (replace) {
                virtualHistory[virtualHistory.length - 1] = newInfo;
            } else {
                virtualHistory.push(newInfo);
            }
        }
        return TRUE;
    }

    // 处理事件
    function execHash(hash) {
        var info = hash ? analyzeHash(hash) : getInfo(),
            curView = info.view,
            index = localHistory.indexOf(curView),
            num;

        // 如果在本地找不到相应的，则是做新开视图
        if (index === -1) {
            setHistory(curView);
            pushMessage('forward', {
                info: info
            });
        } else {
            num = index - historyIndex;
            historyIndex = index;

            if (num < 0) {
                // 回退
                if (!supportHash(info.view)) {
                    history.back();
                } else {
                    pushMessage('back', {
                        info: info,
                        param: paramList.shift()
                    });
                }
            } else if (num === 0) {
                // 刷新
                pushMessage('refresh', {
                    info: info
                });
            } else if (num === 1) {
                // 前进一级
                if (!supportHash(info.view)) {
                    history.go(historyIndex < localHistory.length - 1 ? 1 : -1);
                } else {
                    pushMessage('forward', {
                        info: info
                    });
                }
            } else {
                // 前进多级，直接刷新
                _delay(function() {
                    location.reload();
                });
            }
            saveHistory();
        }
    }

    // 开始监听
    function startListen() {
        win.addEventListener(hashChangeEvent, function() {
            if (curHash !== getHash()) {
                curHash = getHash();
                infoCache = NULL;
                execHash();
            }
        });
    }

    var History = {
        basePath: basePath,
        start: function() {
            var info;
            //INFO '[History] 开始初始化History模块, 使用Hash:', useHash, '当前Hash：', curHash
            if (useHash) {
                hashSupport = Config.hashSupport;
                usePath = h5Mode ? hashSupport.usePath : FALSE;
                if (usePath) {
                    history.basePath = basePath = location.origin + usePath.basePath;
                }
                curHash = getHash();
                info = getInfo();
                initLocalHistory();
                //INFO '[History] 初始化，视图: ', info.view, '参数: ', info.query
                if (!supportHash(info.view)) {
                    //INFO '[History] 此视图不支持Hash', info.view
                    if (historyIndex > 0) {
                        //INFO '[History] 回退一级'
                        historyIndex--;
                        infoCache = NULL;
                        history.back();
                        saveHistory();
                        _delay(function() {
                            History.start(flag);
                        }, 100);
                        return;
                    } else {
                        //INFO '[History] 显示主页'
                        info = {
                            view: Config.indexView,
                            query: {}
                        };
                        setInfo(info, TRUE);
                    }
                }

                pushMessage('init', {
                    info: getInfo()
                });
                startListen();
            } else {
                info = {
                    view: Config.indexView,
                    query: analyzeHash().query
                };
                virtualHistory.push(info);
                pushMessage('init', {
                    info: info
                });
            }
        },
        analyzeHash: analyzeHash,
        setHashInfo: setInfo,
        getHashInfo: getInfo,
        refreshParam: function(obj) {
            var info = getInfo();
            //INFO '[History] 刷新Hash参数, 视图:', info.view, '当前参数', info.query, '新参数', obj
            info.query = _extend(info.query, obj);
            setInfo(info, TRUE);
        },
        back: function(num, param) {
            //INFO '[History] 历史回退, 回退级数', num, '参数', param
            if (!_isNumber(num)) {
                num = 1;
                param = num;
            }
            var name = getInfo().view,
                backData = {
                    view: getRealName(name),
                    name: name,
                    data: param
                };
            num = num || 1;
            if (useHash) {
                paramList.push(backData);
                if (historyIndex > num - 1) {
                    history.go(-num);
                } else {
                    var indexView = Config.indexView;
                    if (historyIndex === 0 && indexView === name) {
                        QApp.trigger('close');
                        history.go(-1);
                    } else {
                        if (historyIndex > 0) {
                            history.go(-historyIndex);
                        }
                        setInfo({
                            view: indexView
                        }, TRUE);
                        pushMessage('home', {
                            info: getInfo()
                        });
                    }
                }
            } else {
                var backToIndex = virtualHistory.length - num;
                if (backToIndex < 1) {
                    backToIndex = 1;
                }
                virtualHistory = virtualHistory.slice(0, backToIndex);
                infoCache = NULL;
                pushMessage('back', {
                    info: getLast(virtualHistory),
                    param: backData
                });
            }
        },
        backTo: function(view, param, allMatch) {
            var historyList = useHash ? localHistory : virtualHistory.map(function(item) {
                    return item.view;
                }),
                l = useHash ? historyIndex : (historyList.length - 1),
                i;
            //INFO '[History] 回退到视图', view, '参数', param, '是否全匹配', allMatch
            for (i = l; i > -1; i--) {
                if ((!allMatch && getRealName(historyList[i]) === view) || historyList[i] === view) {

                    if (i === l) {
                        // 刷新
                        pushMessage('refresh', {
                            info: getInfo(),
                            param: param
                        });
                    } else {
                        History.back(l - i, param);
                    }
                    return TRUE;
                }
            }
            return FALSE;
        },
        home: function(param) {
            //INFO '[History] 回退到首页'
            History.back(useHash ? historyIndex : (virtualHistory.length - 1), param);
        },
        exit: function() {
            //INFO '[History] 退出应用'
            QApp.trigger('close');
            if (useHash) {
                history.go(-historyIndex - 1);
            } else {
                history.back();
            }
        },
        onChange: function(fn) {
            eventManager.on('change', fn);
        },
        buildHash: function(info, excludeBase) {
            var view = info.view,
                query = info.query,
                queryString = _jsonToQuery(Config.jsonParam ? {
                    _param: JSON.stringify(query)
                } : query, TRUE);
            return (excludeBase ? '' : basePath) + '#' + view + (queryString ? '?' + queryString : '');
        },
        buildPath: function(info) {
            var view = info.view,
                query = info.query,
                queryString = _jsonToQuery(Config.jsonParam ? {
                    _param: JSON.stringify(query)
                } : query, TRUE);
            return basePath + view + usePath.ext + (queryString ? '?' + queryString : '');
        },
        reset: function() {
            localHistory = backLocalHistory.slice(0);
            historyIndex = backHistoryIndex;
        },
        getAll: function() {
            return {
                index: historyIndex,
                list: useHash ? localHistory : virtualHistory
            }
        },
        setOptions: function(hashRouter, support) {
            useHash = !!hashRouter;
            hashSupport = support;
            usePath = h5Mode && hashSupport ? hashSupport.usePath : FALSE;
        },
        usePath: function() {
            return usePath;
        }
    };

    return History;

});
