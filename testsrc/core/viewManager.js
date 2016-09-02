define('viewM', function() {

    var View = r('view'),
        $taskQueue = r('taskQ');

    var optionsMap = QApp._viewOptionsMap = {},
        viewMap = QApp._viewMap = {};

    function throwNoViewError(name) {
        //WARN '没有找到相应视图', name
    }

    function getRealName(name) {
        return name.split(':')[0];
    }

    function getView(name, index, callback) {
        var view;
        if (viewMap[name] && viewMap[name][index]) {
            callback(viewMap[name][index]);
        } else if (optionsMap[name]) {
            view = viewMap[name][index] = new View(_extend({
                name: name + ':' + index
            }, optionsMap[name]));
            view.on('destroy', function () {
                viewMap[name][index] = NULL;
            });
            callback(view);
        } else {
            throwNoViewError(name);
        }
    }

    function getViewSync(name, index) {
        var view = NULL;
        if (viewMap[name] && viewMap[name][index]) {
            view = viewMap[name][index];
        } else if (optionsMap[name]) {
            view = viewMap[name][index] = new View(_extend({
                name: name + ':' + index
            },optionsMap[name]));
            view.on('destroy', function () {
                viewMap[name][index] = NULL;
            });
        } else {
            throwNoViewError(name);
        }
        return view;
    }

    function getNameAndIndex(key) {
        var values = key.split(':');
        return {
            name: values[0],
            index: values[1] || 0
        };
    }

    function bindEvents(view, options) {
        _each(options, function(key, value) {
            if (key.indexOf('on') === 0 && _isFunction(value) && key != 'onComplete') {
                view.on(key.substring(2).replace(/\w/, function (a) {
                    return a.toLowerCase();
                }), value);
            }
        });
    }

    function getOptions(args) {
        return _extend.apply(NULL, [TRUE, {}].concat(_makeArray(args).map(function (item) {
            return _isString(item) ? optionsMap[item] || {} : item;
        })));
    }

    var Manager = {
        /**
         * 定义视图
         *
         * @method QApp.view.define
         * @category View
         * @core
         * @alias QApp.defineView
         * @param {String} name 视图名
         * @param {Object} options 配置
         * @example
         *     QApp.defineView('view', {
         *        // 模板
         *        html: '',
         *        // 给视图根节点添加的样式
         *        classNames: ['class1', 'class2'],
         *        // 给视图根节点添加的属性
         *        attrs: {
         *            'data-some': 'qapp'
         *        },
         *        // 给视图根节点添加的样式
         *        styles: {
         *            'background-color': 'red'
         *        },
         *        // 给视图实例添加属性和方法
         *        init: {
         *            someValue: null,
         *            doSomething: function() {
         *            }
         *        },
         *        // 插件配置
         *        plugins: ['plugin1', {
         *            name: 'plugin2',
         *            options: {
         *            }
         *        }],
         *        // 视图生命周期事件绑定
         *        bindEvents: {
         *            'show': function() {
         *                // this 指向视图实例
         *            }
         *        },
         *        // 视图创建完成的回调
         *        ready: function() {
         *            // this 指向视图实例
         *        }
         *     });
         *
         */
        define: function (name) {
            if (_isString(name)) {
                optionsMap[name] = getOptions(arguments);
                viewMap[name] = [];
            }
        },
        /**
         * 取消定义视图
         *
         * @method QApp.view.undefine
         * @category View
         * @param {String} name 视图名
         */
        undefine: function (name) {
            if (_isString(name)) {
                optionsMap[name] = NULL;
            }
        },
        /**
         * 获取视图定义的配置
         *
         * @method QApp.view.getOptions
         * @category View
         * @param {String} name 视图名
         * @return {Object} options 配置
         */
        getOptions: function(name) {
            return optionsMap[name];
        },
        /**
         * 创建视图实例
         *
         * @method QApp.view.create
         * @category View
         * @param {Object} options 视图配置
         * @return {View} view 视图实例
         */
        create: function () {
            var entity = new View(getOptions(arguments)),
                name = entity.name;
            if (name) {
                var opt = getNameAndIndex(name);
                viewMap[opt.name][opt.index] = entity;
                entity.on('destroy', function() {
                    viewMap[opt.name][opt.index] = NULL;
                });
            }
            return entity;
        },
        structure: function(viewName, options) {
            options = options || {};
            options.ani = _isString(options.ani) ? {name : options.ani} : options.ani || {};

            var opt = _extend(TRUE, {}, Manager.getOptions(viewName.split(":")[0])),
                type = options.ani.name || Config.defaultAnimate;

            opt.name = viewName;

            opt.init = opt.init || {};
            opt.init.param = options.param || {};
            opt.styles = _extend(opt.styles || {}, options.styles);
            opt.classNames = (opt.classNames || []).concat(options.classNames);
            if (type) {
                opt.plugins = (opt.plugins || []).concat([{
                    name: type,
                    options: _extend({}, Manager.getExtraOption(viewName, type), options.ani)
                }]);
            }

            var entity = Manager.create(opt);

            entity.param = _extend({}, options.param);

            bindEvents(entity, options);

            entity.complete = function(data) {
                if (_isFunction(options.onComplete)) {
                    options.onComplete.call(entity, data);
                }
            };

            // 兼容原形式
            entity.on('callback', entity.complete);

            return entity;
        },
        build: function(root) {
            var options = getOptions(_makeArray(arguments).slice(1)),
                view;
            if (root && _isElement(root)) {
                options.name = _attr(root, 'qapp-name');
                view = new View(options);
                view.staticBuild(root);
            }
            return view;
        },
        /**
         * 显示视图
         *
         * @method QApp.view.show
         * @category View
         * @core
         * @alias QApp.show
         * @param {String} name 视图名
         * @param {Object} [options] 配置
         * @param {Object} [options.param] 传入参数
         * @param {String|Object} [options.ani] 动画参数
         * @param {Function} [callback] 回调
         * @example
         * QApp.show('view', {
         *     param: {
         *         x: 1,
         *         y: 2
         *     },
         *     ani: 'actionSheet',
         *     onComplete: function(data) {
         *     }
         * });
         * @explain
         * *show* 主要用于视图内的组件类的内容展示，类似于PC端的弹层。
         * 关于动画，请参看 [QApp-plugin-basic](plugins.html#QApp-plugin-basic)
         */
        show: function(viewName, options) {
            var args = _makeArray(arguments);
            //DEBUG 'Show Arguments: ', args
            var view = Manager.structure(viewName, options);
            $taskQueue.pushTask(function(that) {
                view.once('show', function() {
                    that.resolve();
                });
                // 隐藏即销毁
                view.once('hide', function() {
                    _delay(function() {
                        if (_isFunction(view.destroy)) {
                            view.destroy();
                        }
                    });
                });
                view.show.apply(view, args.slice(2));
            });
            return view;
        },
        /**
         * 查看视图是否定义
         *
         * @method QApp.view.exists
         * @category View
         * @alias QApp.existsView
         * @param {String} name 视图名
         * @return {Boolean} flag 是否存在
         */
        exists: function (name) {
            return !!optionsMap[name];
        },
        /**
         * 获取视图实例（异步）
         *
         * @method QApp.view.get
         * @category View
         * @alias QApp.getView
         * @param {String} name 视图名
         * @param {Function} callback 回调
         * @example
         * QApp.getView('someView', function(view) {
         *      // view
         * });
         */
        get: function (key, callback) {
            var opt = {}, that;
            if (_isString(key)) {
                opt = getNameAndIndex(key);
            }
            if (_isFunction(callback)) {
                getView(opt.name, opt.index, function (view) {
                    callback(view);
                });
            } else {
                that = {
                    invoke: function () {
                        var args = _makeArray(arguments),
                            funcName = args.shift();
                        getView(opt.name, opt.index, function (view) {
                            _apply(view[funcName], view, args);
                        });
                        return that;
                    },
                    pushMessage: function (type, message) {
                        var view = viewMap[opt.name] && viewMap[opt.name][opt.index];
                        if (view) {
                            view.trigger(type, message);
                        }
                        return that;
                    }
                };

                return that;
            }
        },
        /**
         * 获取视图实例（同步）
         *
         * @method QApp.view.getSync
         * @category View
         * @alias QApp.getViewSync
         * @param {String} name 视图名
         * @return {View} view 视图实例
         */
        getSync: function(key) {
            var opt = {}, values;
            if (_isString(key)) {
                values = key.split(':');
                opt = {
                    name: values[0],
                    index: values[1] || 0
                };
            }
            return getViewSync(opt.name, opt.index);
        },
        getExtraOption: function (name, key) {
            var extra,
                options = optionsMap[getRealName(name)];
            if (options) {
                extra = (options.extra && options.extra[Config.type]) || options.extra || {};
                return extra[key];
            }
        },
        getHashParams: function(name) {
            var options = optionsMap[getRealName(name)];
            return options ? options.hashParams || [] : [];
        },
        getRealName: getRealName
    };

    return Manager;

});
