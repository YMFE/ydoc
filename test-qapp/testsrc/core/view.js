/* ================================== View ================================== */
define('view', function () {

    var $fetchNode = r('fetchNode'),
        $pluginM = r('pluginM'),
        $widgetM = r('widgetM'),
        $display = r('display');

    var RENDER_TIMEOUT = 10;

    var DEFAULT_OPT = {
        init: {},
        html: NULL,
        fetch: NULL,
        classNames: [],
        attrs: {},
        styles: {},
        destroyDom: TRUE,
        supportHash: TRUE,
        ready: NULL,
        subViews: [],
        plugins: [],
        bindEvents: {},
        extra: {}
    };

    function createRoot() {
        return doc.createElement(Tags.view);
    }

    function initialize(view) {
        var init = view.options.init;
        _each(init, function (key, value) {
            //INFO '[View] 初始化', key, '在视图', view.name, '上, 值为', value
            view[key] = _isFunction(value) ? value.bind(view) : value;
        });
    }

    function bindEvents(view) {
        _each(view.options.bindEvents, function(eventName, process) {
            if (_isFunction(process)) {
                //INFO '[View] 绑定事件', eventName, '在视图', view.name, '上, 回调为', process
                view.on(eventName, process.bind(view));
            }
        });
    }

    function handlePlugin(view) {
        var addPlugins = $pluginM.getGlobal();

        addPlugins.concat(view.options.plugins).forEach(function (plugin) {
            var name = _isString(plugin) ? plugin : plugin.name,
                options = plugin.options || view.options[_camelCase(name) + 'Options'] || {},
                pluginOpt = $pluginM.get(name),
                opt;
            if (pluginOpt && _isFunction(pluginOpt.adapter)) {
                //INFO '[View] 添加插件', name, '配置', options, '在视图', view.name
                opt = _isFunction(options) ? options : _extend(TRUE, {}, pluginOpt.options, options);
                view.plugins[name] = (pluginOpt.adapter)(view, opt, Config);
            }
        });
    }

    function getParam(el, name) {
        var options = {
            param: {}
        };

        _each(_dataSet(el), function (key, value) {
            if (!key.indexOf(name)) {
                var attrName = key.substring(name.length).replace(/\w/i, function (letter) {
                    return letter.toLowerCase();
                });
                if (!attrName.indexOf('param')) {
                    options.param[
                        attrName.substring(5).replace(/\w/i, function (letter) {
                            return letter.toLowerCase();
                        })
                        ] = value;
                } else {
                    options[attrName] = value;
                }
            }
        });
        return options;
    }

    function handleWidget(view, container) {
        container =  (_isString(container) ? view.root.querySelector(container) : container) || view.root;
        _makeArray(
            container.querySelectorAll('[' + Tags.widget + ']')
        ).forEach(function (el) {
                var name = _attr(el, Tags.widget),
                    widget, eventName, bindFunc, adapter, options;
                if ($widgetM.exists(name)) {
                    eventName = $widgetM.get(name).eventName;
                    adapter = $widgetM.get(name).adapter;

                    bindFunc = function () {
                        options = getParam(el, name);
                        widget = adapter(el, options, view);
                        if (options.id) {
                            view.widgets[options.id] = widget;
                        }
                    };

                    if ($widgetM.isEvent(name)) {
                        options = getParam(el, name);
                        eventName = options.eventType || eventName;

                        _addEvent(el, eventName, bindFunc, FALSE);
                        view.on('destroy', function () {
                            _removeEvent(el, eventName, bindFunc);
                        });
                    } else {
                        if (view.isReady) {
                            bindFunc();
                        } else {
                            view.on('ready', function () {
                                bindFunc();
                            });
                        }
                    }

                    view.on('destroy', function () {
                        if (widget && _isFunction(widget.destroy)) {
                            widget.destroy();
                        }
                        widget = NULL;
                        adapter = NULL;
                        options = NULL;
                        bindFunc = NULL;
                    });
                }
            });
    }

    function doReady(view) {
        view.isReady = TRUE;
        view.trigger('ready');
        _apply(view.options.ready, view);
        view.trigger('completed');
    }

    function getViewIndex(name) {
        return name.split('-')[0].split(':')[1];
    }

    function View(options) {
        var me = this;

        me.options = _extend(TRUE, {}, DEFAULT_OPT, options);
        me.name = me.options.name || ('view-' + _getUniqueID());
        //INFO '[View] 创建视图', me.name
        /**
         * 容器
         *
         * @property View.container
         * @category Class:View
         * @type {Element}
         */
        me.container = NULL;
        /**
         * 是否已经ready
         *
         * @property View.isReady
         * @category Class:View
         * @type {Boolean}
         */
        me.isReady = FALSE;
        /**
         * 是否显示
         *
         * @property View.isShow
         * @category Class:View
         * @type {Boolean}
         */
        me.isShow = FALSE;
        /**
         * 根节点
         *
         * @property View.root
         * @category Class:View
         * @type {Element}
         */
        me.root = NULL;
        me.nodes = NULL;
        /**
         * 参数
         *
         * @property View.param
         * @category Class:View
         * @type {Element}
         */
        me.param = {};
        /**
         * 插件映射
         *
         * @property View.plugins
         * @category Class:View
         * @type {Object<String, Plugin>}
         */
        me.plugins = {};
        /**
         * 组件映射
         *
         * @property View.widgets
         * @category Class:View
         * @type {Object<String, Widget>}
         */
        me.widgets = {};
        /**
         * 扩展配置
         *
         * @property View.extra
         * @category Class:View
         * @type {Object}
         */
        me.extra = _extend({}, me.options.extra);

        me._locked = FALSE;
        me._renderEventTimer = NULL;
        me._renderDeferred = new Deferred();

        //INFO '[View] 开始初始化视图', me.name
        initialize(me);
        //INFO '[View] 开始绑定事件', me.name
        bindEvents(me);
        //INFO '[View] 开始处理插件', me.name
        handlePlugin(me);

        me.on('show', function() {
           me.isShow = TRUE;
        });

        me.on('hide', function() {
            me.isShow = FALSE;
        });
    }

    _extend(View.prototype, CustEvent, {
        /**
         * 渲染到容器中
         *
         * @prototype View.prototype.renderTo
         * @category Class:View
         * @private
         * @type {Function}
         * @param {Element} container 渲染到的容器
         * @return {View} view 视图实例
         */
        renderTo: function (container) {
            var me = this;
            //INFO '[View] 渲染视图', me.name, '容器', container
            if (!me._locked) {
                me._locked = TRUE;
                me.container = container;
                if (!me.isReady) {
                    me.root = createRoot();
                    _attr(me.root, 'qapp-name', me.name);
                    _addClass(me.root, me.options.classNames.join(' '));
                    _attr(me.root, me.options.attrs);
                    _css(me.root, me.options.styles);
                    me.trigger('loadStart');
                    $fetchNode(me).done(function () {
                        me.html = me.options.html;
                        me.trigger('loadEnd');
                        me.container.appendChild(me.root);
                        me.renderHTML().done(function () {
                            me.trigger('rendered');
                            me.trigger('loaded');
                            me._locked = FALSE;
                            doReady(me);
                        });
                    });
                } else {
                    me.trigger('rendered');
                    me.container.appendChild(me.root);
                    me.trigger('loaded');
                    me._locked = FALSE;
                    me.trigger('completed');
                }
            }
            return me;
        },
        /**
         * 渲染HTML
         *
         * @prototype View.prototype.renderHTML
         * @category Class:View
         * @private
         * @type {Function}
         * @param {String} html html模板
         * @return {Deferred} deferred 异步对象
         */
        renderHTML: function (html) {
            var me = this,
                deferred = me._renderDeferred,
                cb = function (e) {
                    if (me._renderEventTimer) {
                        clearTimeout(me._renderEventTimer);
                        me._renderEventTimer = NULL;
                    }
                    me._renderEventTimer = _delay(function () {
                        if (me.root) {
                            me._renderEventTimer = NULL;
                            deferred.resolve();
                        }
                    }, RENDER_TIMEOUT);
                };

            me.html = html || me.html;
            me.nodes = _builder(me.html).children;

            if (me.nodes.length) {
                _addEvent(me.root, 'DOMNodeInserted', cb, FALSE);
                _appendNodes(me.root, me.nodes);
                deferred.done(function () {
                    _removeEvent(me.root, 'DOMNodeInserted', cb);
                    handleWidget(me);
                });
                me._renderEventTimer = _delay(function () {
                    if (me.root) {
                        me._renderEventTimer = NULL;
                        deferred.resolve();
                    }
                }, RENDER_TIMEOUT);
            } else {
                if (me.root) {
                    handleWidget(me);
                    deferred.resolve();
                }
            }
            return deferred;
        },
        staticBuild: function(root) {
            var me = this;
            //INFO '[View] 静态构建', me.name
            if (root && _isElement(root)) {
                me.trigger('loadStart');
                me.html = root.innerHTML || '';
                me.trigger('loadEnd');
                me.container = root.parentNode || root;
                me.root = root;
                _attr(me.root, 'qapp-name', me.name);
                _addClass(me.root, me.options.classNames.join(' '));
                _attr(me.root, me.options.attrs);
                _css(me.root, me.options.styles);
                me.nodes = _makeArray(root.children) || [];
                handleWidget(me);
                me.trigger('rendered');
                me.trigger('loaded');
                doReady(me);
                me.trigger('completed');
                me.trigger('beforeShow');
                me.trigger('show');
                me.trigger('actived');
            }
            return me;
        },
        /**
         * 显示
         *
         * @prototype View.prototype.show
         * @category Class:View
         * @type {Function}
         * @param {Element} container 渲染到的节点
         * @param {Object} [startCss] 开始的样式
         * @param {Object} [endCss] 结束的样式
         * @param {Number} [duration] 持续时间，默认 200
         * @return {View} view 当前视图实例
         * @explain
         * * 动画插件会复写此方法。
         * * *QApp.open* 和 *QApp.show* 会自动调用此方法
         */
        show: $display.show,
        /**
         * 隐藏
         *
         * @prototype View.prototype.hide
         * @category Class:View
         * @type {Function}
         * @return {View} view 当前视图实例
         * @explain
         * * 动画插件会复写此方法
         * * *QApp.open* 和 *QApp.show* 会复写此方法
         */
        hide: $display.hide,
        /**
         * 关闭
         *
         * @prototype View.prototype.close
         * @category Class:View
         * @type {Function}
         * @return {View} view 当前视图实例
         * @explain
         * * 动画插件会复写此方法
         * * *QApp.open* 和 *QApp.show* 会复写此方法
         */
        close: $display.hide,
        /**
         * Merge 参数
         *
         * @prototype View.prototype.mergeParam
         * @category Class:View
         * @private
         * @type {Function}
         * @param {Object} newParam 新参数
         * @return {View} view 当前视图实例
         */
        mergeParam: function (newParam) {
            var me = this;
            //INFO '[View] Merge 参数在视图', me.name, '上，新参数为', newParam
            _extend(TRUE, me.param, newParam);
            return me;
        },
        fn: function (name) {
            var me = this;
            return function () {
                return _isFunction(me[name]) ?
                    me[name].apply(this, _makeArray(arguments)) :
                    NULL;
            };
        },

        /**
         * 绑定事件
         *
         * @prototype View.prototype.on
         * @category Class:View
         * @type {Function}
         * @param {String} name 事件名
         * @param {Function} listener 监听的回调
         * @return {View} view 当前视图实例
         */

        /**
         * 绑定事件（只监听一次）
         *
         * @prototype View.prototype.once
         * @category Class:View
         * @type {Function}
         * @param {String} name 事件名
         * @param {Function} listener 监听的回调
         * @return {View} view 当前视图实例
         */

        /**
         * 取消绑定事件
         *
         * @prototype View.prototype.off
         * @category Class:View
         * @type {Function}
         * @param {String} [name] 事件名
         * @param {Function} [listener] 监听的回调
         * @return {View} view 当前视图实例
         * @explain
         * listener 不给出，则取消绑定此次事件名所有绑定的回调
         * name 不给出，则取消所有绑定的事件
         */

        /**
         * 触发事件
         *
         * @prototype View.prototype.trigger
         * @category Class:View
         * @type {Function}
         * @param {String} name 事件名
         * @param {Object} data 数据
         * @return {View} view 当前视图实例
         */

        /**
         * 绑定事件
         *
         * @prototype View.prototype.frontOn
         * @category Class:View
         * @type {Function}
         * @param {String} name 事件名
         * @param {Function} listener 监听的回调
         * @return {View} view 当前视图实例
         */
        frontOn: function(name, listener) {
            var me = this,
                events = me._events[name] = me._events[name] || [];
            events.unshift({
                callback: listener,
                ctx: me
            });
            return me;
        },
        /**
         * 扫描并渲染组件
         *
         * @prototype View.prototype.scanWidget
         * @category Class:View
         * @type {Function}
         * @param {Element} container 节点
         */
        scanWidget: function(container) {
            handleWidget(this, container);
        },
        /**
         * 显示组件
         *
         * @method View.prototype.showWidget
         * @category Class:View
         * @core
         * @param {String} name 组件名
         * @param {Element} [el] 节点
         * @param {Object} options 配置
         * @return {Any} obj 组件返回的对象
         * @example
         * var widget = View.showWidget('searchlist', {
         *    onComplete: function() {
         *          todoSomething();
         *    }
         * });
         * @explain
         * 所需参数和返回的对象由组件的适配器决定
         */
        showWidget: function (name, el, options) {
            var widgets = QApp._widgets;
            if (widgets[name]) {
                if (_isElement(el)) {
                    return widgets[name].adapter(el, options, this);
                } else {
                    return widgets[name].adapter(NULL, el, options, this);
                }
            }
        },
        /**
         * 销毁视图
         *
         * @prototype View.prototype.destroy
         * @category Class:View
         * @private
         * @type {Function}
         * @explain
         * 一般不需用户调用
         */
        destroy: function () {
            //INFO '[View] 销毁视图:', this.name
            var me = this;
            if (me.options.destroyDom) {
                _removeNode(me.root);
            }

            clearTimeout(me._renderEventTimer);

            if (me._renderDeferred) {
                me._renderDeferred.destroy();
            }

            _each(me.plugins, function(key, plugin) {
                if (plugin && _isFunction(plugin.destroy)) {
                    plugin.destroy();
                }
            });

            _each(me.widgets, function(key, widget) {
                if (widget && _isFunction(widget.destroy)) {
                    widget.destroy();
                }
            });

            me.trigger('destroy');
            me.off();

            _empty(me);

            me.destroyed = TRUE;

            return me;
        }
    });

    return View;
});

/**
 * 将要开始显示
 *
 * @event View:beforeShow
 * @category Event:View
 */

/**
 * 显示
 *
 * @event View:show
 * @category Event:View
 * @core
 * @explain
 * 业务逻辑推荐在这里开始执行，类似ajax的逻辑，会影响动画效率。
 * 只有视图第一次显示时，才触发此事件。
 */

/**
 * 将要开始隐藏
 *
 * @event View:beforeHide
 * @category Event:View
 */

/**
 * 隐藏
 *
 * @event View:hide
 * @category Event:View
 */

/**
 * 接收到数据
 *
 * @event View:receiveData
 * @category Event:View
 * @core
 * @param {String} view 来源的视图名，例 view
 * @param {String} name 带索引的视图名, 例 view:1
 * @param {Object} [data] 携带的数据
 * @example
 * view.bind('receiveData', function(data) {
 *     execute(data); //TODO 处理data
 * });
 * @explain
 * 使用 [QApp.open](#QApp-router-open) 时，数据回溯，建议使用此事件接收。
 */

/**
 * 被激活
 *
 * @event View:actived
 * @category Event:View
 * @core
 * @explain
 * 视图每次展现都会触发此事件
 */

/**
 * 被取消激活
 *
 * @event View:deactived
 * @category Event:View
 */

/**
 * 销毁
 *
 * @event View:destroy
 * @category Event:View
 * @explain
 * 一般用于销毁时，自动销毁用户创建的一些对象或者终止正在进行中的逻辑
 */
