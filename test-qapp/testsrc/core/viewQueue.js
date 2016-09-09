define('viewQ', function () {

    var $display = r('display'),
        $taskQueue = r('taskQ'),
        $viewM = r('viewM'),
        $router;

    var decStack = [],
        pushTask = $taskQueue.pushTask,
        getRealName = $viewM.getRealName;

    function getMinZIndex() {
        var dec = decStack[0],
            zIndex;
        if (dec && dec.root) {
            zIndex = parseInt(_css(dec.root, 'z-index'));
        }
        return (zIndex || _getZIndex()) - 1;
    }

    function getLast() {
        if (decStack.length) {
            return decStack[decStack.length - 1];
        }
    }

    function findByName(name) {
        var l = decStack.length,
            i;
        for (i = l - 1; i > -1; i --) {
            if (decStack[i].name == name) {
                return i;
            }
        }
        return -1;
    }

    function fixName(name) {
        if (name.indexOf(':new') > -1) {
            return name.replace(':new', ':' + _getUniqueID());
        } else {
            for (var i = 0, l = decStack.length; i< l; i ++) {
                if (name == decStack[i].name.split(':')[0]) {
                    return false;
                }
            }
            return name;
        }
    }

    function run(dec, type, launch, arg, callback) {
        type = type || 'show';
        pushTask(function(that) {
            dec.on(type.replace('_', ''), function() {
                _delay(function() {
                    that.resolve().done(callback);
                });
            });
            if (_isFunction(launch)) {
                launch();
            } else {
                dec[type](arg);
                if (type.indexOf('hide') > -1 && !arg) {
                    that.resolve();
                }
            }
        });
    }

    function hideRun(dec) {
        run(dec, '_hide', function () {
            $display.hide.call(dec);
        });
    }

    function execute(dec) {
        var _hide = dec.hide,
            _close = dec.close,
            showEvents = dec._events.show = dec._events.show || [],
            activedEvents = dec._events.actived = dec._events.actived || [];

        function refresh() {
            viewQueue.preView = viewQueue.curView;
            viewQueue.curView = dec.name;
        }

        showEvents.unshift({
            callback: refresh,
            ctx: dec
        });

        activedEvents.unshift({
            callback: refresh,
            ctx: dec
        });

        dec.once('hide', function() {
            var index = decStack.indexOf(dec);
            if (index > -1) {
                decStack.splice(index, 1);
                _delay(function() {
                    if (_isFunction(dec.destroy)) {
                        dec.destroy();
                    }
                });
            }
        });

        dec.hide = dec._hide = function(immediately) {
            if (immediately === TRUE) {
                _hide.call(dec);
            } else {
                pushTask(function (that) {
                    dec.once('hide', function () {
                        _delay(that.resolve);
                    });
                    _hide.call(dec);
                });
            }
        };

        dec.close = dec._close = function(immediately) {
            if (immediately === FALSE) {
                _close.call(dec);
            } else {
                pushTask(function (that) {
                    dec.once('hide', function () {
                        _delay(that.resolve);
                    });
                    _close.call(dec);
                });
            }
        };
    }

    var viewQueue = {
        curView: NULL,
        preView: NULL,
        add: function(name, options, atBottom, callback, startCallback) {
            pushTask(function(that) {
                //INFO '[ViewQueue] 增加视图', name, '配置', options, '是否从底部渲染', !!atBottom
                name = fixName(name);
                if (_isFunction(startCallback)) {
                    if (startCallback(name) === FALSE) {
                        that.resolve().done(_callback);
                        return;
                    }
                }
                var _callback = _isFunction(callback) ? callback : _noop;
                if (name) {
                    if ($viewM.exists(getRealName(name))) {
                        viewQueue[atBottom ? 'unshift' : 'push']($viewM.structure(name, options), _callback);
                        that.resolve();
                    } else {
                        //WARN 'Do Not Found View'
                        that.resolve().done(_callback);
                    }
                } else {
                    //WARN 'Do Not Show Same View.'
                    that.resolve().done(_callback);
                }
            });
        },
        push: function(dec, callback) {
            execute(dec);
            dec.once('show', function() {
                var lastDec = getLast();
                _delay(function() {
                    dec.trigger('actived');
                    if (lastDec) {
                        lastDec.trigger('deactived');
                    }
                });
                decStack.push(dec);
            });
            run(dec, 'show', NULL, FALSE, function() {
                callback(dec);
            });
        },
        unshift: function(dec, callback) {
            execute(dec);
            dec.once('show', function() {
                decStack.unshift(dec);
                if (decStack.length === 1) {
                    _delay(function() {
                        dec.trigger('actived');
                    });
                }
            });
            dec.on('beforeShow', function() {
                dec.initialShow = FALSE;
                _css(dec.root, 'z-index', getMinZIndex() - 1);
            });
            run(dec, 'show', function() {
                dec.show(TRUE);
            }, FALSE,  function() {
                callback(dec);
            });
        },
        pop: function(num, data, callback) {
            var dec = getLast();
            if (num === UNDEFINED) {
                num = 1;
            }
            if (dec && num > 0) {
                var process = function(immediately) {
                    var l = decStack.length,
                        begin = l - num,
                        i;
                    if (begin >= 0) {
                        for (i = begin; i < l - 1; i++) {
                            hideRun(decStack[i]);
                        }
                    }
                    if (begin > 0 && num > 0) {
                        dec.once('hide', function () {
                            var prevDec = decStack[begin - 1];
                            if (prevDec) {
                                if (data && data.data) {
                                    prevDec.trigger('receiveData', data);
                                }
                                prevDec.trigger('actived');
                            }
                        });
                    }
                    run(dec, '_hide', NULL, immediately, callback);
                };

                pushTask(function (that) {
                    if (num < decStack.length) {
                        process(TRUE);
                    } else if (num == decStack.length) {
                        if (getRealName(decStack[0].name) !== Config.indexView) {
                            viewQueue.add(Config.indexView, {}, TRUE);
                            pushTask(function (that) {
                                process(FALSE);
                                that.resolve();
                            });
                        } else if (decStack.length > 1) {
                            num = decStack.length - 1;
                            process(TRUE);
                        }
                    }
                    that.resolve();
                });
            }
        },
        remove: function(name, param, callback) {
            pushTask(function(that) {
                var index = findByName(name);
                if (index > -1) {
                    viewQueue.pop(decStack.length - index, param, callback);
                }
                that.resolve();
            });
        },
        backTo: function(name, param, query, callback) {
            //INFO '[ViewQueue] 回退到视图:', name, '参数', param, 'Hash参数', query
            pushTask(function(that) {
                var index = findByName(name),
                    len = decStack.length;
                //INFO '[ViewQueue] 视图索引', index
                if (index === -1) {
                    //INFO '[ViewQueue] 渲染视图', getRealName(name)
                    viewQueue.add(getRealName(name), {
                        param: query
                    }, TRUE, function(view) {
                        $router._reset(view);
                        //INFO '[ViewQueue] 渲染完成，回退'
                        viewQueue.pop(len, param, callback);
                    });
                } else {
                    //INFO '[ViewQueue] 直接回退'
                    len = decStack.length - index - 1;
                    viewQueue.pop(len, param, callback);
                }
                that.resolve();
            });
        },
        refresh: function(data) {
            var dec = getLast();
            if (dec) {
                dec.trigger('receiveData', data);
            }
        },
        clear: function(param, callback) {
            pushTask(function(that) {
                viewQueue.pop(decStack.length, param, callback);
                that.resolve();
            });
        },
        inject: function(router) {
            $router = router;
        }
    };

    return viewQueue;

});
