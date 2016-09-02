/* ================================== 工具部分 ================================== */
var __object__ = Object.prototype,
    __array__ = Array.prototype,
    toString = __object__.toString,
    slice = __array__.slice,
    readyReg = /complete|loaded|interactive/,  // 页面 ready 时的状态
    elementReg = /Element$/,                   // 节点类型正则
    svgReg = /^\[object SVG\w*Element\]$/,     // SVG判定
    whiteSpace = ' ',                          // className 分隔符
    curId = 1,                                 // id 初始值
    curZIndex = 1000;                          // zIndex 初始值

// 元素 Bool 属性
var bools = "autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,defer,defaultChecked,defaultSelected,contentEditable,isMap,loop,multiple,noHref,noResize,noShade,open,readOnly,selected",
    boolMap = {};

bools.replace(/\w+/g, function (name) {
    boolMap[name.toLowerCase()] = name;
});

// 检测 css 支持
var vendors = ['Webkit', '', 'Moz', 'O'],
    testEl = doc.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transformAttr = '',
    prefix = '', eventPrefix;

vendors.every(function (vendor) {
    if (testEl.style[vendor + 'TransitionProperty'] !== UNDEFINED) {
        if (vendor) {
            prefix = '-' + vendor.toLowerCase() + '-';
        }
        eventPrefix = vendor.toLowerCase();
        return FALSE;
    }
});

testEl = NULL;

transformAttr = prefix + 'transform';

function _noop() {} // 空方法

// 获取 obj 的 key 列表
function keys(obj) {
    var ret = [],
        key;
    for (key in obj) {
        ret.push(key);
    }
    return ret;
}

// 类型判断
var class2type = {
    '[object HTMLDocument]': 'Document',
    '[object HTMLCollection]': 'NodeList',
    '[object StaticNodeList]': 'NodeList',
    '[object IXMLDOMNodeList]': 'NodeList',
    '[object DOMWindow]': 'Window',
    '[object global]': 'Window',
    'null': 'Null',
    'NaN': 'NaN',
    'undefined': 'Undefined'
};

'Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,Null,Undefined'
    .replace(/\w+/ig, function (value) {
        class2type['[object ' + value + ']'] = value;
    });


/**
 * 类型判断
 *
 * @method QApp.util.is
 * @category Util-Fn
 * @param {Any} obj 要判断的对象
 * @param {String=} match 匹配的类型
 * @return {String|Boolean} 如果match参数存在，则返回是否匹配，如果不存在，则返回类型
 */
function getType(obj, match) {
    var rs = class2type[(obj === NULL || obj !== obj) ? obj :
            toString.call(obj)] ||
        (obj && obj.nodeName) || '#';
    if (obj === UNDEFINED) {
        rs = 'Undefined';
    } else if (rs.charAt(0) === '#') {
        if (obj == obj.document && obj.document != obj) {
            rs = 'Window';
        } else if (obj.nodeType === 9) {
            rs = 'Document';
        } else if (obj.callee) {
            rs = 'Arguments';
        } else if (isFinite(obj.length) && obj.item) {
            rs = 'NodeList';
        } else {
            rs = toString.call(obj).slice(8, -1);
        }
    }
    if (match) {
        return match === rs;
    }
    return rs;
}

function _isObject(source) {
    return getType(source, 'Object');
}

function _isArray(source) {
    return getType(source, 'Array');
}

function _isString(source) {
    return getType(source, 'String');
}

function _isFunction(source) {
    return getType(source, 'Function');
}

function _isElement(obj) {
    if (obj && obj.nodeType === 1) {       //先过滤最简单的
        if (obj instanceof Node){          //如果是IE9,则判定其是否Node的实例
            return TRUE;                   //由于obj可能是来自另一个文档对象，因此不能轻易返回false
        }
        return elementReg.test(toString.call(obj));
    }
    return FALSE;
}

function _isNumber(source) {
    return getType(source, 'Number');
}

function _isPlainObject(source) {
    return getType(source, 'Object') && Object.getPrototypeOf(source) === __object__;
}

function _isEmptyObject(source) {
    try {
        return  JSON.stringify(source) === "{}";
    } catch (e) {
        return FLASE;
    }
}

/**
 * 扩展
 *
 * @method QApp.util.extend
 * @category Util-Fn
 * @param {boolen} deep true表示深拷贝，false表示浅拷贝，默认没有此参数
 * @param {Any} target 需要扩展的对象
 * @return {Object} 扩展后的对象
 * @example
 *    var obj1, obj2, obj3, //定义变量
 *        deep; //定义一个布尔值
 *    QApp.util.extend(true, {}, obj1, obj2, obj3); //深拷贝，obj1, obj2, obj3的属性重新生成后放到{}上
 *
 *    var obj1, obj2, obj3,//定义变量
 *        deep;//定义一个布尔值
 *    QApp.util.extend(obj1, obj2, obj3); //浅拷贝，obj2，obj3的属性被复制到obj1上
 */
// extend
function extend(target, source, deep) {
    var key;
    for (key in source) {
        if (deep && (_isPlainObject(source[key]) || _isArray(source[key]))) {
            if (_isPlainObject(source[key]) && !_isPlainObject(target[key])) {
                target[key] = {};
            }
            if (_isArray(source[key]) && !_isArray(target[key])) {
                target[key] = [];
            }
            extend(target[key], source[key], deep);
        } else if (source[key] !== UNDEFINED) {
            target[key] = source[key];
        }
    }
}

function _extend(target) {
    var deep,
        args = slice.call(arguments, 1);
    if (typeof target == 'boolean') {
        deep = target;
        target = args.shift();
    }
    args.forEach(function (arg) {
        extend(target, arg, deep);
    });
    return target;
}

/**
 * 遍历对象
 *
 * @method QApp.util.each
 * @category Util-Fn
 * @param {Object} obj 遍历的对象
 * @param {Function} fn 回调
 * @example
 *    var people = {name: 'xiaoming'};
 *    function fn(key, item){};
 *    QApp.util.each(obj, fn); //遍历对象，执行函数fn
 */
// each
function _each(obj, fn) {
    var key;
    for (key in obj) {
        fn.call(obj, key, obj[key]);
    }
}

/**
 * 数组化
 *
 * @method QApp.util.makeArray
 * @category Util-Fn
 * @param {Any} iteration 需要转换的变量
 * @return {Array|Boolean} 结果数组，如果转化不成功，则返回 false
 * @example
 *    //定义一个类数组对象
 *    var likeArray = {
 *        0: param1,
 *        1: param2,
 *        2: param3,
 *        length: 3
 *    };
 *
 *    QApp.util.makeArray(likeArray); //返回一个数组，值为(length-1)下标逆序下标数组
 */
// MakeArray
function _makeArray(iterable) {
    if (!iterable)
        return FALSE;
    var n = iterable.length;
    if (n === (n >>> 0)) {
        try {
            return slice.call(iterable);
        } catch (e) {
        }
    }
    return FALSE;
}

/**
 * 延时封装
 *
 * @method QApp.util.delay
 * @category Util-Fn
 * @param {Function} func 方法
 * @param {Number} [delay] 延时时间，默认值为0
 * @return {Number} Timeout的ID
 * @example
 *    var time = 1000;
 *    function fn(){}
 *    QApp.util.delay(fn, time); // 延迟1s执行函数
 */
// Delay
function _delay(func, delay) {
    return win.setTimeout(func, delay || 0);
}

/**
 * 数组映射对象
 *
 * @method QApp.util.associate
 * @category Util-Fn
 * @param {Array} arrVal 数组数
 * @param {Array} arrKey key数组
 * @return {Object} 对象数据
 * @example
 *    //对象属性值数组
 *    var arrValues = [val1, val2, val3];
 *    //对象属性名数组
 *    var arrKeys = [key1, key2, key3];
 *
 *    QApp.util.associate(arrValues, arrKeys); // {key1: val1, key2: val2, key3: val3}
 */
// Associate
function _associate(arrVal, arrKey) {
    var obj = {}, i = 0;
    for (; i < arrKey.length; i++) {
        obj[arrKey[i]] = arrVal[i];
    }
    return obj;
}

/**
 * 对象映射数组
 *
 * @method QApp.util.mapping
 * @category Util-Fn
 * @param {Object} obj 对象数据
 * @param {Array} arrKey key数组
 * @return {Array}  数组数据
 * @example
 *    var obj = {
 *        key1: value1,
 *        key2: value2,
 *        key3: value3
 *    };
 *    //想要输出对象值的属性数组
 *    var arrKeys = [key1, key3];
 *
 *    QApp.util.mapping(obj, arrKeys);//返回[value1, value3]
 */
// Mapping
function _mapping(obj, arrKey) {
    var arrVal = [], i = 0;
    for (; i < arrKey.length; i++) {
        arrVal[i] = obj[arrKey[i]];
    }
    return arrVal;
}

/**
 * 获取唯一id
 *
 * @method QApp.util.getUniqueID
 * @category Util-Fn
 * @return {Number} 唯一的id
 * @example
 *    var variable = QApp.util.getUniqueID; //获取到唯一id
 */
// UniqueID
function _getUniqueID() {
    return curId ++;
}

/**
 * 获取自增 z-index
 *
 * @method QApp.util.getZIndex
 * @category Util-Fn
 * @return {Number} 获取的 z-index
 * @example
 *    QApp.util.getZIndex();//获取自增z-index，最小值是1001
 */
// zIndex
function _getZIndex() {
    return curZIndex++;
}

/**
 * 驼峰化
 *
 * @method QApp.util.camelCase
 * @category Util-Fn
 * @param {String} str 需要转化的字符串
 * @return {String} 转化后的字符串
 * @example
 *    var str = "div-element"; // 定义一个通过 "-" 或 "/" 分割的变量
 *    QApp.util.camelCase(str);   // 返回divElement
 */
// parseString
function _camelCase(str) {
    return str.replace(/[-_][^-_]/g, function (match) {
        return match.charAt(1).toUpperCase();
    });
}

/**
 * 连接化
 *
 * @method QApp.util.dasherize
 * @category Util-Fn
 * @param {String} str 需要转化的字符串
 * @return {String} 转化后的字符串
 * @example
 *    // 声明一个值为驼峰形式的字符串
 *    var str = "divElement";
 *    QApp.util.dasherize(str);  // 返回以 "-" 连接的字符串，div-element
 */
// dasherize
function _dasherize(str) {
    return str.replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .replace(/\_/g, '-').toLowerCase();
}

/**
 * 清空对象
 *
 * @method QApp.util.empty
 * @category Util-Fn
 * @param {Object} obj 要清空的对象
 * @example
 *    //定义一个对象
 *    var programmer = {
 *        name: "missy",
 *        age: 22
 *    };
 *    QApp.util.empty(programmer);//无返回值，对象属性值将被清空。programmer {name:null, age:null}
 */
// empty
function _empty(obj) {
    var key;
    for (key in obj) {
        obj[key] = NULL;
    }
}

/**
 * 对象判空
 *
 * @method QApp.util.isNull
 * @category Util-Fn
 * @param {Object} obj 要判空的对象
 * @return {Boolean} 判空结果
 */
// isNull
function _isNull(obj) {
    return obj === UNDEFINED || obj === NULL;
}

/**
 * json数据转换成查询字符串
 *
 * @method QApp.util.jsonToQuery
 * @category Util-Fn
 * @param {JSON} json 数据
 * @param {Any} [isEncode] 是否被编码
 * @return {String} 结果字符串
 */
// jsonToQuery
function encodeFormat(data, isEncode) {
    data = (data === NULL ? '' : data).toString().trim();
    return isEncode ? encodeURIComponent(data) : data;
}

function _jsonToQuery(json, isEncode){
    var qs = [], k, i, len;
    for (k in json) {
        if (_isNull(json[k])) {
            qs = qs.concat(k);
        } else if (_isArray(json[k])) {
            for (i = 0, len = json[k].length; i < len; i++) {
                if (!_isFunction(json[k][i])) {
                    qs.push(k + "=" + encodeFormat(json[k][i], isEncode));
                }
            }
        } else if(!_isFunction(json[k]) && (json[k] !== NULL && json[k] !== UNDEFINED)){
            qs.push(k + "=" + encodeFormat(json[k], isEncode));
        }
    }
    return qs.join('&');
}

/**
 * 查询字符串转换成json数据
 *
 * @method QApp.util.queryToJson
 * @category Util-Fn
 * @param {String} data 数据
 * @param {Any} [isDecode] 是否被编码
 * @return {Object} 结果对象
 */
// queryToJson

function decodeFormat(data, isDecode){
    return _isNull(data) ? data : isDecode ? decodeURIComponent(data) : data;
}

function _queryToJson(qs, isDecode){
    var qList = qs.trim().split("&"),
        json = {},
        i = 0,
        len = qList.length;

    for (; i < len; i++) {
        if (qList[i]) {
            var hash = qList[i].split("="),
                key = hash[0],
                value = hash[1];
            if (!(key in json)) {
                // 如果缓存堆栈中没有这个数据，则直接存储
                json[key] = decodeFormat(value, isDecode);
            } else {
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                json[key] = [].concat(json[key], decodeFormat(value, isDecode));
            }
        }
    }
    return json;
}

// custEvent
function _once(func) {
    var ran = FALSE,
        memo;
    return function () {
        if (ran) return memo;
        ran = TRUE;
        memo = func.apply(this, arguments);
        func = NULL;
        return memo;
    };
}

var triggerEvents = function (events, args) {
    var ev,
        i = -1,
        l = events.length,
        ret = 1;
    while (++i < l && ret) {
        ev = events[i];
        ret &= (ev.callback.apply(ev.ctx, args) !== false);
    }
    return !!ret;
};

var CustEvent = {
    on: function (name, callback, context) {
        this._events = this._events || {};
        this._events[name] = this._events[name] || [];
        var events = this._events[name];
        events.push({
            callback: callback,
            context: context,
            ctx: context || this
        });
        return this;
    },
    once: function (name, callback, context) {
        var self = this;
        var once = _once(function () {
            self.off(name, once);
            callback.apply(this, arguments);
        });
        once._callback = callback;
        return this.on(name, once, context);
    },
    off: function (name, callback, context) {
        if (!this._events) return this;
        var retain, ev, events, names, i, l, j, k;
        if (!name && !callback && !context) {
            this._events = UNDEFINED;
            return this;
        }
        names = name ? [name] : keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
            name = names[i];
            events = this._events[name];
            if (events) {
                this._events[name] = retain = [];
                if (callback || context) {
                    for (j = 0, k = events.length; j < k; j++) {
                        ev = events[j];
                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                            (context && context !== ev.context)) {
                            retain.push(ev);
                        }
                    }
                }
                if (!retain.length) delete this._events[name];
            }
        }
        return this;
    },
    trigger: function (name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1),
            events = this._events[name],
            allEvents = this._events.all,
            ret = 1;
        if (events) {
            ret &= triggerEvents(events, args);
        }
        if (allEvents && ret) {
            ret &= triggerEvents(allEvents, args);
        }
        return !!ret;
    }
};

function _createEventManager() {
    var EM = function () {
    };
    _extend(EM.prototype, CustEvent);
    return new EM();
}

// Deferred
function Deferred() {

    var status = 'pending',
        ret,
        isStart = FALSE,
        startFn,
        that = {},
        events = (function () {
            var binds = {
                resolve: [],
                reject: [],
                notify: []
            };
            return {
                add: function (type, fn) {
                    binds[type].push(fn);
                },
                remove: function (type, fn) {
                    var index = binds[type].indexOf(fn);
                    if (index > -1) {
                        binds[type].splice(index, 1);
                    }
                },
                clear: function(type) {
                    binds[type].length = 0;
                },
                fire: function (type, args) {
                    binds[type].forEach(function (fn) {
                        fn.apply(NULL, args);
                    });
                },
                destroy: function () {
                    binds.resolve.length = 0;
                    binds.reject.length = 0;
                    binds.notify.length = 0;
                }
            };
        })();

    function bind(onResolved, onRejected, onProgressed) {
        if (_isFunction(startFn) && !isStart) {
            isStart = TRUE;
            startFn(that);
        }
        if (_isFunction(onResolved)) {
            if (status === 'resolved') {
                onResolved.apply(NULL, ret);
            } else if (status === 'pending') {
                events.add('resolve', onResolved);
            }
        }
        if (_isFunction(onRejected)) {
            if (status === 'rejected') {
                onRejected.apply(NULL, ret);
            } else if (status === 'pending') {
                events.add('reject', onRejected);
            }
        }
        if (_isFunction(onProgressed)) {
            events.add('notify', onProgressed);
        }
    }

    that.enabled = TRUE;

    that.all = function (onResolvedOrRejected) {
        bind(onResolvedOrRejected, onResolvedOrRejected);
        return that;
    };

    that.done = function (onResolved) {
        bind(onResolved);
        return that;
    };

    that.fail = function (onRejected) {
        bind(NULL, onRejected);
        return that;
    };

    that.progress = function (onProgressed) {
        bind(NULL, NULL, onProgressed);
        return that;
    };

    that.unProgress = function (onProgressed) {
        events.remove('notify', onProgressed);
        return that;
    };

    that.then = function (onResolved, onRejected, onProgressed) {
        bind(onResolved, onRejected, onProgressed);
        return that;
    };

    that.resolve = function () {
        if (status === 'pending') {
            status = 'resolved';
            ret = slice.call(arguments);
            events.fire('resolve', ret);
        }
        return that;
    };

    that.reject = function () {
        if (status === 'pending') {
            status = 'rejected';
            ret = slice.call(arguments);
            events.fire('reject', ret);
        }
        return that;
    };

    that.notify = function () {
        events.fire('notify', slice.call(arguments));
        return that;
    };

    that.state = function () {
        return status;
    };

    that.startWith = function (fn) {
        startFn = fn;
        return that;
    };

    that.destroy = function () {
        that.enabled = FALSE;
        that.notify('destroy');
        status = NULL;
        ret = NULL;
        isStart = NULL;
        startFn = NULL;
        that.destroy = function(){};
        that = NULL;
        events.destroy();
        events = NULL;
    };

    return that;
}

/**
 * 异步串行
 *
 * @method QApp.util.queue
 * @category Util-Fn
 * @param {Array<Deferred>} list Deferred 列表
 * @param {Array<String>} keys 结果映射
 * @param {Boolean} dynamic 是否支持动态添加
 * @return {Deferred} 异步对象
 */
// Queue
function _queue(list, keys, dynamic) {
    var deferred = new Deferred(),
        queue = dynamic ? list : list.slice(0),
        ret = [],
        index = -1,
        getKey = function (index) {
            getKey = (keys && keys.length) ? function (index) {
                return keys[index];
            } : function (index) {
                return index;
            };
            return getKey(index);
        },
        next = function () {
            index++;
            var pro = queue.shift();
            if (pro && _isFunction(pro.all)) {
                pro.all(function (data) {
                    deferred.notify(getKey(index), data, list);
                    ret[index] = data;
                    next();
                });
            } else if (pro) {
                if (_isFunction(pro)) {
                    var p = pro(ret[index - 1], ret);
                    if (p && _isFunction(p.all)) {
                        p.all(function (data) {
                            deferred.notify(getKey(index), data, list);
                            ret[index] = data;
                            next();
                        });
                    } else {
                        deferred.notify(getKey(index), p, list);
                        ret[index] = p;
                        next();
                    }
                } else {
                    deferred.notify(getKey(index), pro, list);
                    ret[index] = pro;
                    next();
                }
            } else {
                if (keys && keys.length) {
                    ret = _associate(ret, keys);
                }
                deferred.resolve.call(NULL, ret);
            }
        };

    return deferred.startWith(next);
}

/**
 * 异步并行
 *
 * @method QApp.util.parallel
 * @category Util-Fn
 * @param {Array<Deferred>} list Deferred 列表
 * @param {Array<String>} [keys] 结果映射
 * @return {Deferred} 异步对象
 */
// Parallel
function _parallel(list, keys) {
    var deferred = new Deferred(),
        queue = list.slice(0),
        ret = [],
        num = 0,
        check = function () {
            if (num === queue.length) {
                if (keys && keys.length) {
                    ret = _associate(ret, keys);
                }
                deferred.resolve.call(NULL, ret);
            }
        },
        start = function () {
            queue.forEach(function (pro, index) {
                if (pro && _isFunction(pro.all)) {
                    ret[index] = UNDEFINED;
                    pro.all(function (data) {
                        ret[index] = data;
                        num++;
                        check();
                    });
                } else {
                    ret[index] = pro;
                    num++;
                }
            });
            check();
        };

    return deferred.startWith(start);
}

// Dom

/**
 * Ready
 *
 * @method QApp.util.ready
 * @category Util-Dom
 * @param {Function} callback 回调函数
 * @example
 *    QApp.util.ready(function(){});
 */
// ready
function _ready(callback) {
    if (readyReg.test(doc.readyState) && doc.body) {
        callback();
    } else {
        _addEvent(doc, 'DOMContentLoaded', function () {
            callback();
        }, FALSE);
    }
}

/**
 * 节点构造
 *
 * @method QApp.util.builder
 * @category Util-Dom
 * @param {String} html html片段
 */
function _builder(html) {

    var frame, children,
        toCreate = 'div';

    [['li', 'ul'], ['tr', 'tbody'], ['td', 'tr'], ['th', 'tr'], ['tbody', 'table'], ['option', 'select']].some(function (item) {
        if (html.indexOf('<' + item[0]) === 0) {
            toCreate = item[1];
            return TRUE;
        }
    });

    frame = doc.createElement(toCreate);
    frame.innerHTML = html;
    children = _makeArray(frame.children);
    frame = doc.createDocumentFragment();

    children.forEach(function (node) {
        frame.appendChild(node);
    });

    return {
        box: frame,
        children: children
    };
}

/**
 * 节点添加
 *
 * @method QApp.util.appendNodes
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @param {Element|Array<Element>} elements 节点或节点数组
 * @example
 *    // 为 el 添加子节点
 *    var el = document.getElementById('demo'),
 *        nodes = [document.createTextNode("1"), document.createTextNode("2")];
 *    QApp.util.appendNodes(el, nodes);
 *    QApp.util.appendNodes(el, nodes);
 */
function _appendNodes(node, elements) {
    elements = [].concat(elements);
    elements.forEach(function (element) {
        node.appendChild(element);
    });
}

/**
 * 节点插入
 *
 * @method QApp.util.insertElement
 * @category Util-Dom
 * @param {Element} node 节点
 * @param {Element} element 新节点
 * @param {String} [where] 插入位置
 * @return {Element} 新节点
 * @example
 *    var node = document.getElementById('demo'),
 *        el = document.createElement('p');
 *    el.innerHTML = 'text';
 *    QApp.util.insertElement(node, el, 'beforebegin'); // 将node开始前插入el
 *    QApp.util.insertElement(node, el, 'afterbegin'); // 将node开始后插入el
 *    QApp.util.insertElement(node, el, 'beforeend'); // 将node结束前插入el
 *    QApp.util.insertElement(node, el, 'afterend'); // 将node结束后插入el
 *    QApp.util.insertElement(node, el); // 缺省默认为'beforeend'
 */
function _insertElement(node, element, where) {
    where = where ? where.toLowerCase() : "beforeend";
    switch (where) {
        case "beforebegin":
            node.parentNode.insertBefore(element, node);
            break;
        case "afterbegin":
            node.insertBefore(element, node.firstChild);
            break;
        case "beforeend":
            node.appendChild(element);
            break;
        case "afterend":
            if (node.nextSibling) {
                node.parentNode.insertBefore(element, node.nextSibling);
            } else {
                node.parentNode.appendChild(element);
            }
            break;
    }
    return element;
}

/**
 * 删除节点
 *
 * @method QApp.util.removeNode
 * @category Util-Dom
 * @param {Element} node 被删除的节点
 * @example
 *    var el = document.getElementById('demo');
 *    QApp.util.removeNode(el);
 */
function _removeNode(node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

/**
 * 获取或设置节点属性值
 *
 * @method QApp.util.attr
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @param {{String|Object}} attrName 类型为String时，当两个参数时获取节点属性，当三个参数时修改节点属性；类型为Object时，按照健值对修改节点属性
 * @return {String} 节点的属性值
 * @example
 *    var el = document.getElementById('demo'),
 *        attrKey = 'id', // 属性名
 *        attrVal1 = 'new-value', // 属性值
 *        attrVal2 = 'other-value',
 *        attr = { // 属性对象
 *           'id': 'new-value'
 *        };
 *    QApp.util.attr(el, attrKey, attrVal1); // 增加属性
 *    QApp.util.attr(el, attrKey, attrVal2); // 修改属性
 *    QApp.util.attr(el, attrKey, null);     // 删除属性
 *    QApp.util.attr(el, attr);              // 利用object方式修改属性
 */
function setAttr(node, attrName, value) {
    var toRemove = (value === FALSE) || (value === null) || (value === void 0);
    var bool = boolMap[attrName];
    if (typeof node[bool] === "boolean") {
        node[bool] = !!value;     //布尔属性必须使用el.xxx = true|false方式设值
        if (!value) {            //如果为false, IE全系列下相当于setAttribute(xxx,''),会影响到样式,需要进一步处理
            toRemove = TRUE;
        }
    }
    if (toRemove) {
        return node.removeAttribute(attrName);
    }
    // SVG只能使用setAttribute(xxx, yyy), VML只能使用elem.xxx = yyy ,HTML的固有属性必须elem.xxx = yyy
    var isInnate = svgReg.test(node) ? FALSE : attrName in node.cloneNode(FALSE);
    if (isInnate) {
        node[attrName] = value;
    } else {
        node.setAttribute(attrName, value);
    }
}

function _attr(node, attrName) {
    if (_isString(attrName)) {
        if (arguments.length > 2) {
            setAttr(node, attrName, arguments[2]);
        } else {
            return node.getAttribute(attrName);
        }
    } else {
        _each(attrName, function (key, value) {
            setAttr(node, key, value);
        });
    }
}

/**
 * 获取或设置节点样式
 *
 * @method QApp.util.css
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @param {{String|Object}} property 类型为String时，当两个参数时获取节点样式，当三个参数时修改节点样式；类型为Object时，按照健值对修改样式
 * @param {String} [value] 设定的值
 * @return {String} 节点的样式值
 * @example
 *    var el = document.getElementById('demo'),
 *        attr1 = 'background-color',
 *        value1 = 'red',
 *        attr2 = 'borderColor',
 *        value2 = 'blue',
 *        attr3 = 'translateY',
 *        value3 = '20px',
 *        obj = {
 *            "translateX": "20px",
 *            "scaleX": 2
 *        };
 *    QApp.util.css(el, attr1, value1); // 增加行内样式属性
 *    QApp.util.css(el, attr2, value2); // 增加行内样式属性
 *    QApp.util.css(el, attr2, value2); // 增加行内样式属性
 *    QApp.util.css(el, attr3, value3); // 增加行内样式属性
 *    QApp.util.css(el, obj); // 增加行内样式属性
 *    QApp.util.css(el, attr2, null); // 删除行内样式属性
 *    QApp.util.css(el, attr1, value2); // 更改行内样式属性
 *    QApp.util.css(el, attr1); // 查找行内样式属性
 */
function _css(node, property) {
    if (node && node.style) {
        if (_isString(property)) {
            if (arguments.length > 2) {
                var value = arguments[2];
                if (supportedTransforms.test(property)) {
                    node.style[transformAttr] = property + '(' + value + ')';
                } else {
                    property = _camelCase(property);
                    if (value || value === 0) {
                        node.style[property] = value;
                    } else {
                        node.style.removeProperty(property);
                    }
                }
            } else {
                var styles = win.getComputedStyle(node, NULL),
                    ret;
                if (styles) {
                    ret = styles[_camelCase(property)];
                }
                return ret;
            }
        } else {
            var styleList = [],
                transforms = '';
            _each(property, function (key, value) {
                if (supportedTransforms.test(key)) {
                    transforms += key + '(' + value + ') ';
                } else {
                    styleList.push(_dasherize(key) + ':' + value);
                }
            });
            if (transforms.length) {
                styleList.push(_dasherize(transformAttr) + ':' + transforms);
            }
            node.style.cssText += ';' + styleList.join(';') + ';';
        }
    }
}

/**
 * 删除样式
 *
 * @method QApp.util.removeStyle
 * @category Util-Dom
 * @param {Element} node 节点
 * @param {String|Array} names 样式名称
 * @example
 *     var el = document.getElementById('demo');
 *     el.style.display = 'none';
 *     QApp.util.removeStyle(el, 'display');
 */
function _removeStyle(node, names) {
    if (node && node.style) {
        [].concat(names).forEach(function (name) {
            node.style.removeProperty(name);
            node.style.removeProperty(prefix + name);
        });
    }
}

/**
 * 事件修复
 *
 * @method QApp.util.fixEvent
 * @category Util-Dom
 * @param {Event} event 事件
 * @return {Event} 修复后的事件
 * @example
 *    var el = document.getElementById('demo'),
 *        type = 'click',//事件类型
 *        useCapture = false;//是否冒泡
 *    QApp.util.addEvent(el, type, function(e){
 *       var event = QApp.util.fixEvent(e);//事件修复
 *    }, useCapture);
 */
function _fixEvent(event) {

    if(!event.target){
        event.target = event.srcElement || document;
    }

    // Safari
    if (event.target.nodeType == 3) {
        event.target = event.target.parentNode;
    }

    //fix pageX & pageY
    if(event.pageX === NULL && event.clientX !== NULL){
        var html = doc.documentElement,
            body = doc.body;

        event.pageX = event.clientX + (html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (html.scrollTop  || body && body.scrollTop  || 0) - (html.clientTop  || body && body.clientTop  || 0);
    }

    return event;
}

/**
 * 事件绑定
 *
 * @method QApp.util.addEvent
 * @category Util-Dom
 * @param {Element} node 节点
 * @param {String} type 事件名
 * @param {Function} listener 事件处理函数
 * @param {Any} [useCapture] 事件处理阶段，默认是 false
 * @example
 *    // 监听 el 的 click 事件
 *    var el = document.getElementById('demo'),
 *        type = 'click', //事件类型
 *        fn = function(){}, //回调函数
 *        useCapture = false; //是否冒泡
 *    QApp.util.addEvent(el, type, fn, useCapture);
 */
function _addEvent(node, type, listener, useCapture) {
    node.addEventListener(type, listener, !!useCapture);
}

/**
 * 解除绑定事件
 *
 * @method QApp.util.removeEvent
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @param {String} type 事件名
 * @param {Function} listener 事件处理函数
 * @example
 *    var el = document.getElementById('demo'),
 *        type = 'click',
 *        fn = function(){},
 *        useCapture = false;
 *    QApp.util.addEvent(el, type, fn, useCapture);
 *    QApp.util.removeEvent(el, type, fn);
 */
function _removeEvent(node, type, listener) {
    node.removeEventListener(type, listener);
}

/**
 * 事件触发
 *
 * @method QApp.util.dispatchEvent
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @param {String} type 事件名
 * @param {Any} args 附加参数
 */
// dispatchEvent
function _dispatchEvent(node, type, args) {
    var event = doc.createEvent("Events");
    event.initEvent(type, true, true);
    _extend(event, args);
    node.dispatchEvent(event);
}

/**
 * 添加类名
 *
 * @method QApp.util.addClass
 * @category Util-Dom
 * @param {Element} node 节点
 * @param {String} className 类名
 * @example
 *    // 为 el 新增一个 className 为 new-class
 *    var el = document.getElementById('demo');
 *    QApp.util.addClass(el, 'new-class');
 */
// addClass
function _addClass(node, className) {
    node.className = (node.className + whiteSpace + className).split(/\s+/).filter(function (item, index, source) {
        return source.lastIndexOf(item) === index;
    }).join(whiteSpace);
}

/**
 * 移除元素指定类名
 *
 * @method QApp.util.removeClass
 * @category Util-Dom
 * @param {Element} node 节点
 * @param {String} className 类名
 * @example
 *    var el = document.getElementById('demo');
 *    QApp.util.removeClass(el, 'color');
 */
// removeClass
function _removeClass(node, className) {
    className = whiteSpace + className.replace(/\s+/g, whiteSpace) + whiteSpace;

    node.className = node.className.split(/\s+/).filter(function (originClassName) {
        return className.indexOf(whiteSpace + originClassName + whiteSpace) === -1;
    }).join(whiteSpace);
}

/**
 * 动态创建样式
 *
 * @method QApp.util.createStyle
 * @category Util-Dom
 * @param {String} cssText 样式字符串
 */
// createStyle
function _createStyle(cssText) {
    var style = doc.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssText;
    doc.querySelector('head').appendChild(style);
}

/**
 * 包含判定
 *
 * @method QApp.util.contains
 * @category Util-Dom
 * @param {Element} a 节点
 * @param {Element} b 节点
 * @return {Boolean} true表示a包含b；false表示a不包含b
 */
// contains
var _contains = doc.compareDocumentPosition ? function (a, b) {
    return !!(a.compareDocumentPosition(b) & 16);
} : function (a, b) {
    return a !== b && (a.contains ? a.contains(b) : TRUE);
};

/**
 * 节点聚焦
 *
 * @method QApp.util.focus
 * @category Util-Dom
 * @param {Element} element 节点
 */
// focus
function _focus(element) {
    var length;

    // 兼容 ios7 问题
    if (_sniff.ios && element.setSelectionRange && element.type.indexOf('date') !== 0 && element.type !== 'time' && element.type !== 'month') {
        length = element.value.length;
        try {
            element.setSelectionRange(length, length);
        } catch(e) {
            element.focus();
        }
    } else {
        element.focus();
    }
}

/**
 * 指定节点内的焦点元素失焦
 *
 * @method QApp.util.blur
 * @category Util-Dom
 * @param {Element} [container] 容器节点
 */
// blur
function _blur(container) {
    var el = doc.activeElement;
    container = container || doc.body;
    if (el && _contains(container, el) && _isFunction(el.blur)) {
        el.blur();
    }
}

/**
 * 获取元素的尺寸
 *
 * @method QApp.util.size
 * @category Util-Dom
 * @param {Any} any 要获取尺寸的对象
 */
// size
function docSize(doc) {
    function getWidthOrHeight(clientProp) {
        var docEl = doc.documentElement,
            body = doc.body;
        return Math.max(
            body["scroll" + clientProp],
            docEl["scroll" + clientProp],
            body["offset" + clientProp],
            docEl["offset" + clientProp],
            docEl["client" + clientProp]
        );
    }

    return {
        width: getWidthOrHeight('Width'),
        height: getWidthOrHeight('Height')
    };
}

function winSize(win) {
    function getWidthOrHeight(clientProp) {
        return win.document.documentElement["client" + clientProp];
    }

    return {
        width: getWidthOrHeight('Width'),
        height: getWidthOrHeight('Height')
    };
}

function _size(any) {
    var type = getType(any),
        ret;
    switch (type) {
        case 'Document':
            ret = docSize(any);
            break;
        case 'Window':
            ret = winSize(any);
            break;
        default:
            ret = {
                width: parseInt(_css(any, 'width'), 10),
                height: parseInt(_css(any, 'height'), 10)
            };
    }

    return ret;
}

/**
 * 获取位置
 *
 * @method QApp.util.position
 * @category Util-Dom
 * @param {Element} el 获取位置的节点
 * @return {Object} 包括 top 和 left 两个数值
 */
// position
function generalPosition(el) {
    var box = el.getBoundingClientRect(),
        body = el.ownerDocument.body,
        docEl = el.ownerDocument.documentElement,
        scrollTop = Math.max(win.pageYOffset || 0, docEl.scrollTop, body.scrollTop),
        scrollLeft = Math.max(win.pageXOffset || 0, docEl.scrollLeft, body.scrollLeft),
        clientTop = docEl.clientTop || body.clientTop || 0,
        clientLeft = docEl.clientLeft || body.clientLeft || 0;

    return {
        left: box.left + scrollLeft - clientLeft,
        top: box.top + scrollTop - clientTop
    };
}

function diff(pos, bPos) {
    return {
        left: pos.left - bPos.left,
        top: pos.top - bPos.top
    };
}

function _position(el) {
    if (!_contains(el.ownerDocument.body, el)) {
        return {
            top: NaN,
            left: NaN
        };
    }

    return arguments.length > 1 ?
        diff(generalPosition(el), generalPosition(arguments[1])) :
        generalPosition(el);
}

/**
 * 获取节点自定义数据
 *
 * @method QApp.util.dataSet
 * @category Util-Dom
 * @param {Element} node 目标节点
 * @return {Object} 包含自定义数据的对象
 */
// dataSet
function _dataSet(node) {
    var ret = {};
    if (node) {
        if (node.dataset) {
            _extend(ret, node.dataset);
        } else {
            var attrs = node.attributes;
            for (var i = 0, l = attrs.length; i < l; i ++) {
                var name = attrs[i].name,
                    value = attrs[i].value;
                if (name.indexOf('data-') === 0) {
                    name = _camelCase(name.substring(5));
                    ret[name] = value;
                }
            }
        }
    }
    return ret;
}

// 其他

/**
 * 将函数应用于view
 *
 * @method QApp.util.apply
 * @category Util-Fn
 * @param {Function} callback 方法
 * @param {Object} view 视图
 * @param {Any} args 参数
 * @return {Any} 函数执行结果
 */
// apply
function _apply(callback, view, args) {
    if (_isFunction(callback)) {
        return callback.apply(view, _makeArray(args) || []);
    }
}


/**
 * 获取回调函数
 *
 * @method QApp.util.getCallback
 * @category Util-Fn
 * @param {Any} args 回调函数
 * @return {Function} 回调函数
 */
// getCallback
function _getCallback(args) {
    var fn = _noop;
    args = _makeArray(args);
    if (args) {
        args.some(function(arg) {
           if (_isFunction(arg)) {
               fn = arg;
               return TRUE;
           }
        });
    }
    return fn;
}
