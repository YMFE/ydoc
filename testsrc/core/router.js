/* ================================== Router ================================== */
define('router', function() {

    var $history = r('history'),
        $viewQueue = r('viewQ'),
        $viewM = r('viewM');

    var started = FALSE,
        backReg = /back(\((\d+)\))?/,
        routerDelegated = _delegatedEvent(doc, [], Tags.role),
        eventManager = _createEventManager(),
        openFilters = [],
        backFilters = [];

    function reset(view) {
        if (view) {
            var _complete = view.complete,
                completeData;
            view.hide = function(data) {
                Router.back(1, data || completeData);
            };
            view.complete = function(data) {
                //WARN '使用路由打开，不建议用 complete/onComplete 方式，建议用 receiveData 事件，和 native 贴近'
                completeData = data;
                _apply(_complete, view, [data]);
            };
        }
    }

    // 开始历史纪录处理
    function startHistory(useHash) {
        $history.onChange(function(data) {
            var d = data.data,
                info = d.info,
                param = d.param,
                type = data.type;

            //INFO '[Router] 历史纪录事件，类型为：', data.type
            switch (type) {
                case 'init':
                    if (Config.autoInit) {
                        //INFO '[Router] 初始化视图：', info.view
                        $viewQueue.add(info.view, {
                            param: info.query
                        }, TRUE, function(view) {
                            reset(view);
                            eventManager.trigger(type, view);
                        });
                    }
                    break;
                case 'forward':
                    //INFO '[Router] 打开视图：', info.view
                    _delay(function() {
                        if (eventManager.trigger('willForward', info) === false) {
                            history.back();
                        } else {
                            $viewQueue.add(info.view, {
                                param: info.query
                            }, FALSE, function(view) {
                                reset(view);
                                eventManager.trigger(type, view);
                            });
                        }
                    }, 100);
                    break;
                case 'refresh':
                    //INFO '[Router] 刷新视图：', info.view
                    $viewQueue.refresh({
                        view: $viewM.getRealName(info.view),
                        name: info.view,
                        data: param
                    });
                    eventManager.trigger(type);
                    break;
                case 'back':
                case 'home':
                    //INFO '[Router] 回退到视图', info.view
                    _delay(function() {
                        $viewQueue.backTo(info.view, param, info.query, function() {
                            eventManager.trigger(type);
                        });
                    }, 100);
                    break;
                case 'willForward':
                    return eventManager.trigger(type, d);
            }
        });
        $history.start(useHash);
    }

    // 绑定自定义锚点
    function bindAnchor() {
        routerDelegated.add('router', 'tap', function(e) {
            var el = e.el,
                href = _attr(el, 'href'),
                target = _attr(el, 'target'),
                param = _queryToJson(_attr(el, 'param') || '', TRUE),
                info, allMatch,
                match, vq;

            if (!href.indexOf('#!')) {
                if (href.indexOf('home') == 2) {
                    Router.home(param);
                } else {
                    href = href.slice(2);
                    match = href.match(backReg);
                    if (match) {
                        Router.back(match[2] || 1, param);
                    }
                }
            } else if (!href.indexOf('#')) {
                href = href.slice(1);
                info = $history.analyzeHash(href);
                if (target === '_blank') {
                    Router.open(info.view + ':new', {
                        param: _extend(info.query, param)
                    });
                } else {
                    vq = info.view.split(':');
                    allMatch = vq.length > 0;
                    if (vq[1] == '0') {
                        info.view = vq[0];
                    }
                    if (Router.backTo(info.view, param, allMatch) === FALSE) {
                        Router.open(info.view, {
                            param: _extend(info.query, param)
                        });
                    }
                }
            }
        });
    }

    function doBackFilter(type) {
        return function() {
            var args = _makeArray(arguments);
            if ((args[1] && args[1].skipFilter) || backFilters.reduce(function(ret, filter) {
                    return ret && (filter(args) !== FALSE);
                }, TRUE)) {
                return _apply($history[type], $history, args);
            }
        };
    }

    var Router = _extend(eventManager, {
        start: function() {
            if (!started) {
                started = TRUE;
                startHistory();
                bindAnchor();
                $history.onChange(function(data) {
                    eventManager.trigger('history', data);
                });
            }
        },
        /**
         * 打开视图
         *
         * @method QApp.router.open
         * @alias QApp.open
         * @category Router
         * @core
         * @param {String} name 视图名
         * @param {Object} [options] 配置
         * @param {Object} [options.param] 传入参数
         * @param {String|Object} [options.ani] 动画参数
         * @param {Function} [callback] 回调
         * @example
         * QApp.open('view', {
         *     param: {
         *         x: 1,
         *         y: 2
         *     },
         *     ani: 'moveEnter',
         * });
         * @explain
         * *open* 主要用于切换视图，类似于PC端的跳转，近似于App上的切换视图操作。
         *
         * 建议使用 [View:receiveData](#View-receiveData) 事件做监听。
         *
         * 关于动画，请参看 [QApp-plugin-basic](plugins.html#QApp-plugin-basic)
         * 由于需要和客户端相同，一般采用 moveEnter
         */
        open: function(name, options, callback) {
            var args = _makeArray(arguments);
            if ((args[1] && args[1].skipFilter) || openFilters.reduce(function(ret, filter) {
                    return ret && (filter(args) !== FALSE);
                }, TRUE)) {
                options = options || {};
                var param = options.param || {};
                $viewQueue.add(name, options, !!options.atBottom, function(view) {
                    if (view) {
                        reset(view);
                        _apply(callback, view, [view]);
                        if (!options.atBottom) { // 当router.open时触发forward事件，如果是indexView，则不触发（indexView会触发init事件）
                            eventManager.trigger('forward', view);
                        }
                    } else {
                        _apply(callback);
                    }
                }, function(name) {
                    return $history.setHashInfo({
                        view: name,
                        query: param
                    });
                });
            }
        },
        transfer: function(name, param) {
            _delay(function() {
                if ($history.usePath()) {
                    location.href = $history.buildPath({
                        view: name,
                        query: param
                    });
                } else {
                    var urlObj = _parseURL($history.basePath);
                    urlObj.setQuery('_qtid', Date.now());

                    location.href = urlObj.toUrl() + $history.buildHash({
                        view: name,
                        query: param
                    }, true);
                }
            });
        },
        /**
         * 回退
         *
         * @method QApp.router.back
         * @category Router
         * @core
         * @param {Number} [num] 回退的级数，默认是 1
         * @param {Object} [param] 参数
         */
        back: doBackFilter('back'),
        /**
         * 回退到
         *
         * @method QApp.router.backTo
         * @category Router
         * @core
         * @param {String} name 视图名
         * @param {Object} [param] 参数
         * @return {Boolean} flag 是否回退到
         */
        backTo: doBackFilter('backTo'),
        /**
         * 回退到首页
         *
         * @method QApp.router.home
         * @category Router
         * @param {Object} [param] 参数
         */
        home: doBackFilter('home'),
        /**
         * 跳转到（如果已存在，则回退到，否则新打开）
         *
         * @method QApp.router.goto
         * @category Router
         * @param {String} name 视图名
         * @param {Object} [options] 打开视图需要的参数，同 open
         * @param {Object} [param] 参数
         */
        goto: function(view, options, param, allMath) {
            //INFO '[Router] Goto', view
            if ($history.backTo(view, param, allMath) === FALSE) {
                //INFO '[Router] 未返回，新打开视图'
                Router.open(view, options);
            }
        },
        /**
         * 退出
         *
         * @method QApp.router.exit
         * @category Router
         */
        exit: $history.exit,
        /**
         * 刷新参数
         *
         * @method QApp.router.refreshParam
         * @category Router
         * @param {Object} param 新参数
         */
        refreshParam: $history.refreshParam,
        /**
         * 添加open过滤器
         *
         * @method QApp.router.addOpenFilter
         * @category Router
         * @param {Function} filter 新参数
         */
        addOpenFilter: function(filter) {
            if (_isFunction(filter)) {
                openFilters = openFilters.concat(filter);
            }
        },
        /**
         * 移除open过滤器
         *
         * @method QApp.router.removeOpenFilter
         * @category Router
         * @param {Function} filter 新参数
         */
        removeOpenFilter: function(filter) {
            var index = openFilters.indexOf(filter);
            if (index > -1) {
                openFilters.splice(index, 1);
            }
        },
        /**
         * 添加back过滤器
         *
         * @method QApp.router.addBackFilter
         * @category Router
         * @param {Function} filter 新参数
         */
        addBackFilter: function(filter) {
            if (_isFunction(filter)) {
                backFilters = backFilters.concat(filter);
            }
        },
        /**
         * 移除back过滤器
         *
         * @method QApp.router.removeBackFilter
         * @category Router
         * @param {Function} filter 新参数
         */
        removeBackFilter: function(filter) {
            var index = backFilters.indexOf(filter);
            if (index > -1) {
                backFilters.splice(index, 1);
            }
        },
        /**
         * 获取当前视图名称
         *
         * @method QApp.router.getCurViewName
         * @category Router
         * @return {String}
         */
        getCurViewName: function(whole) {
            return $viewQueue.curView && (whole ? $viewQueue.curView : $viewM.getRealName($viewQueue.curView));
        },
        /**
         * 获取前一个视图名称
         *
         * @method QApp.router.getPreViewName
         * @category Router
         * @return {String}
         */
        getPreViewName: function(whole) {
            return $viewQueue.preView && (whole ? $viewQueue.preView : $viewM.getRealName($viewQueue.preView));
        },
        buildUrl: function(info) {
            return $history.usePath() ? $history.buildPath(info) : $history.buildHash(info)
        },
        getCurInfo: $history.getHashInfo,
        resetHistory: $history.reset,
        _getHistory: function() {
            return $history.getAll();
        },
        _newSite: function() {
            win.open($history.basePath);
        },
        _reset: reset
    });

    $viewQueue.inject(Router);

    return Router;
});
