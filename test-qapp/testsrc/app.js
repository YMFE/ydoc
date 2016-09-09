var $viewM = r('viewM'),
    $history = r('history'),
    $router = r('router'),
    $pluginM = r('pluginM'),
    $widgetM = r('widgetM');

var origin = {},
    openFilters = [],
    readyDefer = new Deferred(),
    readyDependenceDefers = [];

var VIRTUAL_HEIGHT = 100; // 处理虚拟按键等一类高度变化问题的 Magic Number

function coreReady(fn) {
    readyDefer.done(fn);
}

coreReady(function () {
    // 设置并记录 Root 的位置和大小
    var de = doc.documentElement,
        winWidth = de.clientWidth,
        winHeight = de.clientHeight,
        appRoot = doc.createElement(Tags.app);

    function refreshSize() {
        winWidth = de.clientWidth;
        winHeight = de.clientHeight;
        _extend(origin , {
            width: winWidth,
            height: winHeight,
            rootWidth: winWidth - Config.root.left - Config.root.right,
            rootHeight: winHeight - Config.root.top - Config.root.bottom
        });

        _css(doc.body, 'height', winHeight + 'px');

        _css(appRoot, {
            height: origin.rootHeight + 'px',
            width: origin.rootWidth + 'px'
        });
    }

    function checkResize() {
        var curHeight = de.clientHeight;
        if ((_sniff.ios ||  curHeight > winHeight - VIRTUAL_HEIGHT) && curHeight != winHeight) {
            refreshSize();
        }
    }

    _extend(origin , {
        width: winWidth,
        height: winHeight,
        rootTop: Config.root.top,
        rootLeft: Config.root.left
    });

    _css(doc.body, 'height', winHeight + 'px');

    if (Config.customRoot) {

        origin.rootWidth = winWidth - Config.root.left - Config.root.right;
        origin.rootHeight = winHeight - Config.root.top - Config.root.bottom;

        _css(appRoot, {
            top: origin.rootTop + 'px',
            left: origin.rootLeft + 'px',
            height: origin.rootHeight + 'px',
            width: origin.rootWidth + 'px'
        });

        _appendNodes(doc.body, appRoot);
    } else {
        origin.rootWidth = winWidth;
        origin.rootHeight = winHeight;

        appRoot = doc.body;
    }

    QApp.root = Config.appRoot = appRoot;

    QApp.checkResize = checkResize;

    $router.start();

    if (Config.screen) {
        if (Config.screen.autoResize) {
            win.addEventListener('resize', checkResize);
        }
        if (Config.screen.rotate) {
            _orientation.on('change', refreshSize);
        }
    }

    if (Config.preventMove) {
        _addEvent(doc, 'touchmove', function(e) {
            e.preventDefault();
        });
    }

});

QApp = _extend(QApp, _createEventManager());

// 暴露接口
_extend(QApp, {
    /**
     * 配置
     *
     * @method QApp.config
     * @category Base
     * @core
     * @param {Object} conf 配置
     * @return {Object} config 当前配置
     * @example
     * QApp.config({
     *   // 默认的首屏 View
     *   indexView: 'index',
     *   // 默认的动画
     *   defaultAnimate: 'moveEnter',
     *   // 是否自动初始化视图
     *   autoInit: true,
     *   // 是否开启 hash router
     *   hashRouter: true,
     *   hashSupport: {
     *       // 是否默认全部
     *       all: true,
     *       // 白名单
     *       exist: [],
     *       // 黑名单
     *       except: [],
     *       // 是否使用 path 变换（需要服务端支持）
     *       usePath: false
     *   },
     *   // 是否使用 json 形式参数
     *   jsonParam: false,
     *   screen: {
     *       // 是否支持屏幕旋转
     *       rotate: false,
     *       // 检测屏幕大小变换
     *       autoResize: true
     *   },
     *   gesture: {
     *       // 是否开启手势
     *       open: true,
     *       // 是否开启手势控制 (在 View 切换时，禁用手势)
     *       ctrl: true,
     *       // 长按是否触发 Tap 事件
     *       longTap: true,
     *       // 自动控制元素失去焦点
     *       autoBlur: true
     *   },
     *   // 日志等级
     *   logLevel: 1
     * });
     *
     */
    config: function (conf) {
        var newConf =  _extend(TRUE, Config, conf),
            plugins = newConf.plugins,
            globalPlugins = newConf.globalPlugins;
        if (_isArray(globalPlugins)) {
            $pluginM.setGlobal(globalPlugins);
        }
        if (_isArray(plugins)) {
            plugins.forEach(function(plugin) {
                if (plugin && plugins.name) {
                    $pluginM.setOpt(plugin.name, plugin.options);
                }
            });
        } else if (plugins) {
            _each(plugins, function(name, options) {
                if (name) {
                    $pluginM.setOpt(name, options);
                }
            });
        }
        $history.setOptions(newConf.hashRouter, newConf.hashSupport);
        return newConf;
    },

    root: doc.body,

    origin: origin,

    defineView: $viewM.define,

    undefineView: $viewM.undefine,

    createView: $viewM.create,

    buildView: $viewM.build,

    existsView: $viewM.exists,

    getView: $viewM.get,

    getViewSync: $viewM.getSync,

    addPlugin: $pluginM.add,

    configPlugin: $pluginM.setOpt,

    setGlobalPlugins: $pluginM.setGlobal,

    addWidget: $widgetM.add,

    showWidget: $widgetM.show,

    router: $router,

    open: $router.open,

    exit: $router.exit,

    view: $viewM,

    show: $viewM.show,

    showView: $viewM.show,
    // 兼容老API
    hash: {
        getInfo: $history.getHashInfo,
        setInfo: $history.setHashInfo,
        analyzeHash: $history.analyzeHash,
        setParam: $history.refreshParam,
        build: $history.buildHash
    },

    sniff: _sniff
});

// 添加 util

var util = QApp.util = {};

util.ready = _ready;

/**
 *
 * 准备完毕回调
 *
 * @method QApp.ready
 * @category Base
 * @core
 * @param {Function} listener 回调函数
 * @example
 * QApp.ready(function() {
 *      todoSomething();
 * })
 * @explain
 * `QApp.ready` 不等同于 `Dom Ready`, 但依赖于 `Dom Ready`, 可以通过 [QApp.addReadyDependencies](#QApp-addReadyDependencies) 添加依赖
 *
 */
QApp.ready = coreReady;

/**
 * 添加准备完毕依赖
 *
 * @method QApp.addReadyDependencies
 * @category Base
 * @param {Deferred} defer 依赖对象
 *
 */

QApp.addReadyDependencies = function(defer) {
    readyDependenceDefers.push(defer);
};

util.query = function(selector) {
    return doc.querySelector(selector);
};

util.queryAll = function(selector) {
    return doc.querySelectorAll(selector);
};

util.is = getType;
util.isObject = _isObject;
util.isString = _isString;
util.isArray = _isArray;
util.isFunction = _isFunction;
util.isNumber = _isNumber;
util.isElement = _isElement;
util.isPlainObject = _isPlainObject;
util.isEmptyObject = _isEmptyObject;

util.extend = _extend;
util.each = _each;
util.makeArray = _makeArray;
util.delay = _delay;
util.associate = _associate;
util.mapping = _mapping;
util.camelCase = _camelCase;
util.dasherize = _dasherize;
util.empty = _empty;
util.noop = _noop;
util.getUniqueID = _getUniqueID;
util.getZIndex = _getZIndex;
util.jsonToQuery = _jsonToQuery;
util.queryToJson = _queryToJson;
util.parseURL = _parseURL;
util.loader = _loader;

util.builder = _builder;
util.appendNodes = _appendNodes;
util.insertElement = _insertElement;
util.removeNode = _removeNode;
util.attr = _attr;
util.css = _css;
util.removeStyle = _removeStyle;
util.addClass = _addClass;
util.removeClass = _removeClass;
util.fixEvent = _fixEvent;
util.addEvent = _addEvent;
util.removeEvent = _removeEvent;
util.dispatchEvent = _dispatchEvent;
util.createStyle = _createStyle;
util.size = _size;
util.position = _position;
util.contains = _contains;
util.focus = _focus;
util.blur = _blur;
util.animate = _animate;
util.dataSet = _dataSet;
util.delegatedEvent = _delegatedEvent;

util.CustEvent = util.custEvent = CustEvent;

util.Deferred = util.deferred = Deferred;
util.queue = _queue;
util.parallel = _parallel;

QApp.logger = util.logger = _logger;

win.QApp = QApp;

// init
_ready(function() {
    if (readyDependenceDefers.length) {
        _parallel(readyDependenceDefers).done(function() {
            readyDefer.resolve();
        });
    } else {
        readyDefer.resolve();
    }
});
