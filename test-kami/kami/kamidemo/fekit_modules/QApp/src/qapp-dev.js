(function(){

    "use strict";

	//=======================================================================
	//             _________       _          _________    __________
	//           / ________ /    /   \       |  _____  |  |  _____  |
	//          / /      / /    / / \ \      | |     | |  | |     | |
	//         / /  Q   / /    / / A \ \     | |  P  | |  | |  P  | |
	//        / /  __  / /    / /_____\ \    | |_____| |  | |_____| |
	//       / /___\ \/ /    /  _______  \   |  _______|  |  _______|
	//      /________  /    / /         \ \  | |          | |
	//               \_\   /_/           \_\ |_|          |_|
	//
	// QApp Mobile Framework
	// Copyright (c) 2014-2015 Edwon Lim and other contributors in Qunar Hotel FE Mobile Team.
	// WebSite: http://ued.qunar.com/mobile/qapp/
	//
	// 去哪儿酒店移动组荣誉出品，Created By 林洋
	//
	// qapp.js 0.4.3 build at 2015-09-18 By Edwon.lim (adwon.lin@qunar.com)
	//======================================================================
	
	/**
	 * QApp 版本
	 *
	 * @category Base
	 * @property QApp.version
	 * @type {String}
	 * @value "0.4.3"
	 */
	var QApp = {
	        version: '0.4.3'
	    },
	    _packages = QApp._packages = {}; // 存放 package
	
	// 预赋值，利于压缩
	var win = window,
	    doc = document,
	    TRUE = true,
	    FALSE = false,
	    NULL = null,
	    UNDEFINED = void 0;
	
	// 定义包
	function define(space, factory) {
	    _packages[space] = factory();
	}
	
	// 引用包 require
	// 为了避免和 fekit 冲突，所以不用 require
	function r(space) {
	    return _packages[space];
	}
	
	// 标签列表
	var Tags = {
	    app: 'qapp-app',
	    view: 'qapp-view',
	    widget: 'qapp-widget',
	    role: 'qapp-role'
	};
	
	

	/* ================================== 全局配置 ================================== */
	var Config = {
	    type: 'app',          // 类型
	    indexView: 'index',   // 默认的首屏 View
	    animate: TRUE,        // 是否动画
	    defaultAnimate: 'moveEnter',   // 默认的动画
	    autoInit: TRUE,       // 是否自动初始化视图
	    hashRouter: TRUE,     // 是否开启 hash router
	    hashSupport: {
	        all: TRUE,        // 是否默认全部
	        exist: [],        // 白名单
	        except: []        // 黑名单
	    },
	    customRoot: TRUE,     // 是否使用自定义的 Root
	    appRoot: NULL,        // Root 节点
	    screen: {
	        rotate: FALSE,    // 是否支持屏幕旋转
	        largeChange: TRUE // 检测屏幕变大
	    },
	    gesture: {
	        ctrl: TRUE,       // 是否开启手势控制 (在 View 切换时，禁用手势)
	        longTap: TRUE ,   // 长按是否触发 Tap 事件
	        autoBlur: TRUE    // 自动控制元素失去焦点
	    },
	    root: {               // Root 节点位置和大小配置
	        top: 0,
	        right: 0,
	        bottom: 0,
	        left: 0
	    },
	    logLevel: 1          // 日志等级
	};
	
	

	/**
	 * 环境嗅探
	 *
	 * @property QApp.sniff
	 * @type {Object}
	 * @category Sniff
	 * @value {os: 'ios', ios: true, android: false, iphone: true, ipad: false, ipod: false, imobile: true, osVersion: '8.1.2', osVersionN: 8, pixelRatio: 2, retina: true, pc: false}
	 */
	var _sniff = (function() {
	    var sniff = {}; // 结果
	
	    var ua = navigator.userAgent,
	        platform = navigator.platform,
	        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),  // 匹配 android
	        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),            // 匹配 ipad
	        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),         // 匹配 ipod
	        iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);        // 匹配 iphone
	
	    sniff.ios = sniff.android = sniff.iphone = sniff.ipad = sniff.ipod = FALSE;
	
	    /**
	     * Android 设备嗅探
	     *
	     * @property QApp.sniff.android
	     * @type {Boolean}
	     * @category Sniff
	     */
	    if (android) {
	        sniff.os = 'android';
	        sniff.osVersion = android[2];
	        sniff.android = TRUE;
	    }
	
	    /**
	     * iOS 设备嗅探
	     *
	     * @property QApp.sniff.ios
	     * @type {Boolean}
	     * @category Sniff
	     */
	    if (ipad || iphone || ipod) {
	        sniff.os = 'ios';
	        sniff.ios = TRUE;
	    }
	
	    /**
	     * iPhone 设备嗅探
	     *
	     * @property QApp.sniff.iphone
	     * @type {Boolean}
	     * @category Sniff
	     */
	    if (iphone) {
	        sniff.osVersion = iphone[2].replace(/_/g, '.');
	        sniff.iphone = TRUE;
	        sniff.imobile = TRUE;
	    }
	
	    /**
	     * iPad 设备嗅探
	     *
	     * @property QApp.sniff.ipad
	     * @type {Boolean}
	     * @category Sniff
	     */
	    if (ipad) {
	        sniff.osVersion = ipad[2].replace(/_/g, '.');
	        sniff.ipad = TRUE;
	    }
	
	    /**
	     * iPod 设备嗅探
	     *
	     * @property QApp.sniff.ipod
	     * @type {Boolean}
	     * @category Sniff
	     */
	    if (ipod) {
	        sniff.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : NULL;
	        sniff.ipod = TRUE;
	        sniff.imobile = TRUE;
	    }
	
	    /**
	     * imobile 设备嗅探
	     *
	     * @property QApp.sniff.imobile
	     * @type {Boolean}
	     * @category Sniff
	     */
	
	    /**
	     * ios 设备嗅探
	     *
	     * @property QApp.sniff.ios
	     * @type {Boolean}
	     * @category Sniff
	     */
	
	    // iOS 8+ changed UA
	    if (sniff.ios && sniff.osVersion && ua.indexOf('Version/') >= 0) {
	        if (sniff.osVersion.split('.')[0] === '10') {
	            sniff.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	        }
	    }
	
	    /**
	     * osVersion 设备版本
	     *
	     * @property QApp.sniff.osVersion
	     * @type {String}
	     * @category Sniff
	     * @value '8.1.2'
	     */
	
	    /**
	     * osVersionN 设备版本
	     *
	     * @property QApp.sniff.osVersionN
	     * @type {Number}
	     * @category Sniff
	     * @value 8
	     */
	
	    if (sniff.osVersion) {
	        sniff.osVersionN = parseInt(sniff.osVersion.match(/\d+\.?\d*/)[0]);
	    }
	
	    /**
	     * 像素比率
	     *
	     * @property QApp.sniff.pixelRatio
	     * @type {Number}
	     * @category Sniff
	     * @value 2
	     */
	    sniff.pixelRatio = win.devicePixelRatio || 1;
	
	    /**
	     * 高清屏判断
	     *
	     * @property QApp.sniff.retina
	     * @type {Boolean}
	     * @category Sniff
	     */
	    sniff.retina = sniff.pixelRatio >= 2;
	
	    /**
	     * 判断是否在pc上模拟
	     *
	     * @property QApp.sniff.pc
	     * @type {Boolean}
	     * @category Sniff
	     */
	    sniff.pc = platform.indexOf('Mac') === 0 || platform.indexOf('Win') === 0 || (platform.indexOf('linux') === 0 && !sniff.android);
	
	    return sniff;
	})();
	

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
	 *    function fn(obj, key, item){};
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
	        element.setSelectionRange(length, length);
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
	
	

	/**
	 * 轻触事件
	 *
	 * @event Gesture:tap
	 * @category Gesture
	 * @core
	 * @explain
	 * 对于每个事件，事件对象里都有以下属性：`screenX`， `screenY`， `clientX`， `clientY`， `pageX`， `pageY`。
	 *
	 * * 轻触 ：`tap`
	 * * 双轻触 ：`doubletap`
	 * * 长按 ：`press`、`pressend`
	 * * 触摸 ：`feel`
	 *
	 * tap / doubletap / press / feel 触按事件
	 *
	 * * 用户触碰屏幕，并且位移距离小于 **10**，则会判定为触按事件。
	 * * 用户开始触碰屏幕和结束触碰直接时差小于 **200ms** ，则会被判定为tap事件，反之被判定为press事件。
	 * * tap和press事件 *不会被同时触发* 。
	 * * 如果两次tap事件的时间差小于 **500ms**，则会被判定为doubletap事件。
	 * * doubletap事件和tap事件 *会同时触发*，doubletap会在第二次tap事件 *之前* 触发。
	 * * feel即触即触发，和tap、press并行。
	 */
	
	/**
	 * 双轻触事件
	 *
	 * @event Gesture:doubletap
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:tap说明](#Gesture-tap)
	 */
	
	/**
	 * 长按事件
	 *
	 * @event Gesture:press
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:tap说明](#Gesture-tap)
	 */
	
	/**
	 * 长按结束事件
	 *
	 * @event Gesture:pressend
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:tap说明](#Gesture-tap)
	 */
	
	/**
	 * 触摸事件
	 *
	 * @event Gesture:feel
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:tap说明](#Gesture-tap)
	 */
	
	/**
	 * 滑动事件
	 *
	 * @event Gesture:pan
	 * @category Gesture
	 * @explain
	 * 对于每个事件，事件对象里都有以下属性：`screenX`， `screenY`， `clientX`， `clientY`， `pageX`， `pageY`。
	 *
	 * * 轻滑 ：`flick`  | 拓展属性：`offsetX`、`offsetY`、`speedX`、`speedY`、`duration`、`degree`、`directions`
	 * * 滑动 ：`pan`、`panend` | 扩展属性：`offsetX`、`offsetY`、`degree`、`directions` | `panend` 包含扩展属性： `speedX`、`speedY`、`duration`
	 *
	 * flick / pan 滑动事件
	 *
	 * * 用户点击屏幕，并且位移距离大于 **10**，则会判定为滑动事件。
	 * * 用户开始触碰屏幕和结束触碰直接时差小于 **300ms** ，则会被判定为flick事件。
	 * * flick和press事件 *会被同时触发* 。
	 * * flick会在pressend事件 *之后* 触发。
	 * * degree属性基准为水平向右坐标轴，顺时针方向，单位是 **角度**。
	 * * directions为滑动方向，为一个 *数组*：
	 * * 元素值为：`up`、`down`、`left`、`right`；
	 * * 第一个元素为 **主方向**，第二个元素是 **副方向**；
	 * * 当实际方向与主方向的夹角小于 **15度** 时，不存在副方向。
	 */
	
	/**
	 * 滑动结束事件
	 *
	 * @event Gesture:panend
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:pan说明](#Gesture-pan)
	 */
	
	/**
	 * 轻滑事件
	 *
	 * @event Gesture:flick
	 * @category Gesture
	 * @explain
	 * 说明详见 [Gesture:pan说明](#Gesture-pan)
	 */
	
	var Gesture = (function () {
	
	    var TOUCHKEYS = [
	            'screenX', 'screenY', 'clientX', 'clientY', 'pageX', 'pageY'
	        ],
	        TAP_TIMEOUT = 200, // tap 判定时间
	        ALLOW_LONG_TAP = FALSE, // 允许长按
	        PAN_DISTANCE = 10, // 判定 pan 的位移偏移量
	        DIRECTION_DEG = 15, // 判断方向的角度
	        FLICK_TIMEOUT = 300, // 判断 flick 的延时
	        FLICK_DIS = 100, // flick 距离
	        ABS_TIME = 3; // 抱死次数判定
	
	    var gesture,
	        curElement,
	        curId,
	        lastId,
	        lastTime = 0,
	        trackingClick,
	        clickElement,
	        overTouchTime = 0,
	        cancelNextClick = FALSE,
	        running = TRUE;
	
	    // 重置
	    function reset() {
	        gesture = NULL;
	        curElement = NULL;
	        curId = NULL;
	    }
	
	    // 复制 touch 对象上的有用属性到固定对象上
	    function mixTouchAttr(target, source) {
	        if (source) {
	            TOUCHKEYS.forEach(function (key) {
	                target[key] = source[key];
	            });
	        }
	        return target;
	    }
	
	    // 查找对应id的touch
	    function findTouch(touches) {
	        return _makeArray(touches).filter(function (touch) {
	            return touch.identifier === curId;
	        })[0];
	    }
	
	    // 计算距离
	    function computeDistance(offsetX, offsetY) {
	        return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
	    }
	
	    // 计算角度
	    function computeDegree(offsetX, offsetY) {
	        var degree = Math.atan2(offsetY, offsetX) / Math.PI * 180;
	        return degree < 0 ? degree + 360 : degree;
	    }
	
	    // 获取方向
	    function getDirection(offsetX, offsetY) {
	        var ret = [],
	            absX = Math.abs(offsetX),
	            absY = Math.abs(offsetY),
	            proportion = Math.tan(DIRECTION_DEG / 180 * Math.PI),
	            transverse = absX > absY;
	
	        if (absX > 0 || absY > 0) {
	            ret.push(transverse ? offsetX > 0 ? 'right' : 'left' : offsetY > 0 ? 'down' : 'up');
	            if (transverse && absY / absX > proportion) {
	                ret.push(offsetY > 0 ? 'down' : 'up');
	            } else if (!transverse && absX / absY > proportion) {
	                ret.push(offsetX > 0 ? 'right' : 'left');
	            }
	        }
	
	        return ret;
	    }
	
	    // 检测是否需要原生 click
	    function needsClick(target) {
	        switch (target.nodeName.toLowerCase()) {
	            case 'button':
	            case 'select':
	            case 'textarea':
	                if (target.disabled) {
	                    return TRUE;
	                }
	                break;
	            case 'input':
	                // IOS6 pad 上选择文件，如果不是原生的click，弹出的选择界面尺寸错误
	                if ((_sniff.ipad && _sniff.osVersionN === 6 && target.type === 'file') || target.disabled) {
	                    return TRUE;
	                }
	                break;
	            case 'label':
	            case 'iframe':
	            case 'video':
	                return TRUE;
	        }
	
	        return (/\bneedsclick\b/).test(target.className);
	    }
	
	    // 检测是否需要 focus
	    function needsFocus(target) {
	        switch (target.nodeName.toLowerCase()) {
	            case 'textarea':
	                return TRUE;
	            case 'select':
	                return !_sniff.android;
	            case 'input':
	                switch (target.type) {
	                    case 'button':
	                    case 'checkbox':
	                    case 'file':
	                    case 'image':
	                    case 'radio':
	                    case 'submit':
	                        return FALSE;
	                }
	                return !target.disabled && !target.readOnly;
	            default:
	                return (/\bneedsfocus\b/).test(target.className);
	        }
	    }
	
	    // 选择触发的事件
	    function determineEventType(target) {
	        // 安卓chrome浏览器上，模拟的 click 事件不能让 select 打开，故使用 mousedown 事件
	        if (_sniff.android && target.nodeName.toLowerCase() === 'select') {
	            return 'mousedown';
	        }
	
	        return 'click';
	    }
	
	    // 发送 click 事件
	    function sendClick(target, touch) {
	        var clickEvent;
	
	        // 某些安卓设备必须先移除焦点，之后模拟的click事件才能让新元素获取焦点
	        if (doc.activeElement && doc.activeElement !== target) {
	            doc.activeElement.blur();
	        }
	
	        clickEvent = doc.createEvent('MouseEvents');
	        clickEvent.initMouseEvent(determineEventType(target), TRUE, TRUE, win, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, FALSE, FALSE, FALSE, FALSE, 0, NULL);
	        clickEvent.forwardedTouchEvent = TRUE;
	        if (running) {
	            target.dispatchEvent(clickEvent);
	        }
	    }
	
	    //  寻找 label 对应的元素
	    function findControl(labelElement) {
	
	        // HTML5 新属性
	        if (labelElement.control !== UNDEFINED) {
	            return labelElement.control;
	        }
	
	        // 通过 htmlFor
	        if (labelElement.htmlFor) {
	            return doc.getElementById(labelElement.htmlFor);
	        }
	
	        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	    }
	
	    // 创建事件
	    function createEvent(type) {
	        var event = doc.createEvent("HTMLEvents");
	        event.initEvent(type, TRUE, TRUE);
	        return event;
	    }
	
	    // 构造 pan / flick / panend 事件
	    function createPanEvent(type, offsetX, offsetY, touch, duration) {
	        var ev = createEvent(type);
	        ev.offsetX = offsetX;
	        ev.offsetY = offsetY;
	        ev.degree = computeDegree(offsetX, offsetY);
	        ev.directions = getDirection(offsetX, offsetY);
	        if (duration) {
	            ev.duration = duration;
	            ev.speedX = ev.offsetX / duration;
	            ev.speedY = ev.offsetY / duration;
	        }
	        return mixTouchAttr(ev, touch);
	    }
	
	    // 分析 Move
	    function analysisMove(event, touch) {
	        var startTouch = gesture.origin,
	            offsetX = touch.clientX - startTouch.clientX,
	            offsetY = touch.clientY - startTouch.clientY;
	
	        if (gesture.status === 'tapping' || gesture.status === 'pressing') {
	            if (computeDistance(offsetX, offsetY) > PAN_DISTANCE) {
	                gesture.status = 'panning'; // 更改状态
	                trackingClick = FALSE; // 取消跟踪 click
	                clickElement = NULL;
	                gesture.startMoveTime = event.timeStamp; // 记录移动开始的时间
	                clearTimeout(gesture.handler);
	                gesture.handler = NULL;
	                trigger(createPanEvent('pan', offsetX, offsetY, touch));
	            }
	        } else if (gesture.status === 'panning') {
	            trigger(createPanEvent('pan', offsetX, offsetY, touch));
	        }
	    }
	
	    // 分析 End
	    function analysisEnd(event, touch) {
	        if (gesture.handler) {
	            clearTimeout(gesture.handler);
	            gesture.handler = NULL;
	        }
	        if (gesture.status === 'panning') {
	            var startTouch = gesture.origin,
	                offsetX = touch.clientX - startTouch.clientX,
	                offsetY = touch.clientY - startTouch.clientY,
	                duration = event.timeStamp - gesture.startMoveTime;
	            trigger(createPanEvent('panend', offsetX, offsetY, touch, duration));
	            // 判断是否是快速移动
	            if (duration < FLICK_TIMEOUT && computeDistance(offsetX, offsetY) > FLICK_DIS) {
	                trigger(createPanEvent('flick', offsetX, offsetY, touch, duration));
	            }
	        } else {
	            if (gesture.status === 'tapping') {
	                trigger(mixTouchAttr(createEvent('tap'), touch));
	            } else if (gesture.status === 'pressing') {
	                trigger(mixTouchAttr(createEvent('pressend'), touch));
	                if (ALLOW_LONG_TAP) {
	                    trigger(mixTouchAttr(createEvent('tap'), touch));
	                }
	            }
	        }
	    }
	
	
	    // 触发事件
	    function trigger(event) {
	        if (running && curElement) {
	            curElement.dispatchEvent(event);
	        }
	    }
	
	    function onTouchStart(event) {
	
	        var touch, selection,
	            changedTouches = event.changedTouches,
	            timestamp = event.timeStamp;
	
	        // 如果两次 touch 事件过快，则，直接阻止默认行为
	        if (timestamp - lastTime < TAP_TIMEOUT) {
	            event.preventDefault();
	            return FALSE;
	        }
	
	        // 忽略多指操作
	        if (changedTouches.length > 1) {
	            return TRUE;
	        } else if (curId) {
	            // 防抱死，由于快速点击时，有时touchend事件没有触发，造成手势库卡死
	            overTouchTime++;
	            if (overTouchTime > ABS_TIME) {
	                reset();
	            }
	            return TRUE;
	        }
	
	        touch = changedTouches[0];
	
	        if (touch) {
	            curElement = event.target;
	            curId = touch.identifier;
	            gesture = {
	                origin: mixTouchAttr({}, touch),
	                timestamp: timestamp,
	                status: 'tapping',
	                handler: setTimeout(function () {
	                    gesture.status = 'pressing';
	                    trigger(mixTouchAttr(createEvent('press'), gesture.origin));
	                    clearTimeout(gesture.handler);
	                    gesture.handler = NULL;
	                }, TAP_TIMEOUT)
	            };
	
	            if (!_sniff.pc) {
	                // Fast Click 判定部分
	                // 排除 ios 上的一些特殊情况
	                if (_sniff.ios) {
	                    // 判断是否是点击文字，进行选择等操作，如果是，不需要模拟click
	                    selection = win.getSelection();
	                    if (selection.rangeCount && !selection.isCollapsed) {
	                        return TRUE;
	                    }
	
	                    // 当 alert 或 confirm 时，点击其他地方，会触发touch事件，id相同，此事件应该被忽略
	                    if (curId === lastId) {
	                        event.preventDefault();
	                        return FALSE;
	                    }
	
	                    lastId = curId;
	
	                    //TODO updateScrollParent
	
	                }
	
	                // 开始跟踪 click
	                trackingClick = TRUE;
	                clickElement = curElement;
	            }
	
	        }
	
	        overTouchTime = 0;
	
	        return TRUE;
	
	    }
	
	    function onTouchMove(event) {
	        var touch = findTouch(event.changedTouches);
	
	        if (touch && gesture) {
	            analysisMove(event, touch);
	        }
	
	        return TRUE;
	    }
	
	    function onTouchEnd(event) {
	        var touch = findTouch(event.changedTouches),
	            timestamp = event.timeStamp,
	            tagName, forElement, startTime;
	
	        if (touch && gesture) {
	            analysisEnd(event, touch);
	
	            startTime = gesture.timestamp;
	
	            reset();
	
	            // if (!_sniff.pc) { // 支持pc模拟器，和手机一致
	
	                if (trackingClick) {
	
	                    // 触击过快，阻止下一次 click
	                    if (timestamp - lastTime < TAP_TIMEOUT) {
	                        cancelNextClick = TRUE;
	                        return TRUE;
	                    }
	
	                    if (timestamp - startTime > TAP_TIMEOUT) {
	                        return TRUE;
	                    }
	
	                    cancelNextClick = FALSE;
	                    lastTime = timestamp;
	
	                    tagName = clickElement.nodeName.toLowerCase();
	                    // 如果是 label， 则模拟 focus 其相关的元素
	                    if (tagName === 'label') {
	                        forElement = findControl(clickElement);
	                        if (forElement) {
	                            _focus(forElement);
	
	                            if (_sniff.android) {
	                                return FALSE;
	                            }
	
	                            clickElement = forElement;
	                        }
	                    } else if (needsFocus(clickElement)) {
	                        if (timestamp - startTime > 100 || (_sniff.ios && win.top !== win && tagName === 'input')) {
	                            clickElement = NULL;
	                            return FALSE;
	                        }
	
	                        _focus(clickElement);
	                        sendClick(clickElement, touch);
	
	                        if (!_sniff.ios || tagName !== 'select') {
	                            clickElement = NULL;
	                            event.preventDefault();
	                        }
	
	                        return FALSE;
	                    }
	
	                    if (!needsClick(clickElement)) {
	                        event.preventDefault();
	                        sendClick(clickElement, touch);
	                    }
	
	                    return FALSE;
	                }
	            // }
	        }
	
	        return TRUE;
	    }
	
	    function onTouchCancel(event) {
	        var touch = findTouch(event.changedTouches);
	
	        if (touch && gesture) {
	            clickElement = NULL;
	            analysisEnd(event, touch);
	            reset();
	        }
	
	        return TRUE;
	    }
	
	    function onMouse(event) {
	        if (!clickElement) {
	            return TRUE;
	        }
	
	        if (event.forwardedTouchEvent) {
	            return TRUE;
	        }
	
	        if (!event.cancelable) {
	            return TRUE;
	        }
	
	        if (!needsClick(clickElement) || cancelNextClick) {
	            if (event.stopImmediatePropagation) {
	                event.stopImmediatePropagation();
	            } else {
	                event.propagationStopped = TRUE;
	            }
	            event.stopPropagation();
	            event.preventDefault();
	            return FALSE;
	        }
	
	        return TRUE;
	    }
	
	    function onClick(event) {
	        var permitted;
	
	        if (trackingClick) {
	            clickElement = NULL;
	            trackingClick = FALSE;
	            return TRUE;
	        }
	
	        if (event.target.type === 'submit' && event.detail === 0) {
	            return TRUE;
	        }
	
	        permitted = onMouse(event);
	
	        if (!permitted) {
	            clickElement = NULL;
	        }
	
	        return permitted;
	    }
	
	    _ready(function () {
	        var body = doc.body;
	
	        if (!_sniff.pc) {
	
	            if (_sniff.android) {
	                _addEvent(body, 'moveover', onMouse, TRUE);
	                _addEvent(body, 'mousedown', onMouse, TRUE);
	                _addEvent(body, 'mouseup', onMouse, TRUE);
	            }
	
	            _addEvent(body, 'click', onClick, TRUE);
	        }
	
	        _addEvent(body, 'touchstart', onTouchStart, TRUE);
	        _addEvent(body, 'touchmove', onTouchMove, TRUE);
	        _addEvent(body, 'touchend', onTouchEnd, TRUE);
	        _addEvent(body, 'touchcancel', onTouchCancel, TRUE);
	    });
	
	    return {
	        allowLongTap: function () {
	            ALLOW_LONG_TAP = TRUE;
	        },
	        on: function() {
	            running = TRUE;
	        },
	        off: function() {
	            running = FALSE;
	        }
	    };
	
	})();

	/**
	 * 动画
	 *
	 * @method QApp.util.animate
	 * @category Util-Fn
	 * @param {Element} el 执行动画的元素
	 * @param {Object} props 更改的属性
	 * @param {Number} [duration] 持续时间
	 * @param {String} [ease] 动画曲线
	 * @param {Number} [delay] 延迟时间
	 * @return {Deferred} Deferred对象
	 * @example
	 *     // 修改 ele 的 transform 属性，实现动画（推荐）
	 *     var ele_transform = document.createElement("div");
	 *     QApp.util.animate(ele_transform, {transform: "translate(50%, 0)"}, 500);
	 *
	 *     // 修改 ele 的 left，实现动画
	 *     var ele_left = document.createElement("div");
	 *     QApp.util.animate(ele_left, {left: "50%", position: "absolute"}, 500);
	 */
	var _animate = (function () {
	    var DURATION = 200,
	        TIMEOUT_DELAY = 25,
	        EASE = 'linear';
	
	    var transitionProperty, transitionDuration, transitionTiming, transitionDelay;
	
	    transitionProperty = prefix + 'transition-property';
	    transitionDuration = prefix + 'transition-duration';
	    transitionDelay = prefix + 'transition-delay';
	    transitionTiming = prefix + 'transition-timing-function';
	
	    function setParentStyle(el) {
	        var parentNode = el.parentNode;
	        if (parentNode) {
	            _css(parentNode, {
	                'transform-style': 'preserve-3d',
	                'backface-visibility': 'hidden'
	            });
	        }
	    }
	
	    function resetParentStyle(el) {
	        var parentNode = el.parentNode;
	        _removeStyle(parentNode, ['transform-style', 'backface-visibility']);
	    }
	
	    return function (el, props, duration, ease, delay) {
	        var argsLength = arguments.length,
	            endEvent = eventPrefix + 'TransitionEnd',
	            cssValues = {},
	            cssProperties = [],
	            transforms = '';
	
	        if (argsLength < 3) {
	            duration = DURATION;
	        }
	
	        if (argsLength < 4) {
	            ease = EASE;
	        }
	
	        if (argsLength < 5) {
	            delay = 0;
	        }
	
	        _each(props, function (key, value) {
	            if (supportedTransforms.test(key)) {
	                transforms += key + '(' + value + ') ';
	            } else {
	                cssValues[key] = value;
	            }
	            cssProperties.push(_dasherize(key));
	        });
	
	        if (transforms) {
	            cssValues[transformAttr] = transforms;
	            cssProperties.push(transformAttr);
	        }
	
	        if (duration > 0) {
	            cssValues[transitionProperty] = cssProperties.join(', ');
	            cssValues[transitionDuration] = duration / 1000 + 's';
	            cssValues[transitionDelay] = delay / 1000 + 's';
	            cssValues[transitionTiming] = ease;
	        }
	
	        var that = new Deferred();
	        var fired = FALSE;
	
	        function callback(event) {
	            if (event) {
	                if (event.target !== el) {
	                    return;
	                }
	            }
	            _removeEvent(el, endEvent, callback);
	            fired = TRUE;
	            _delay(function () {
	                if (transforms) {
	                    resetParentStyle(el);
	                }
	                _removeStyle(el, 'transition');
	                that.resolve();
	            });
	        }
	
	        if (duration > 0) {
	            _addEvent(el, endEvent, callback, FALSE);
	
	            // 兼容不支持的情况
	            _delay(function () {
	                if (!fired) {
	                    callback();
	                }
	            }, duration + delay + TIMEOUT_DELAY * 2);
	        }
	
	        _delay(function () {
	            if (transforms) {
	                setParentStyle(el);
	            }
	
	            _css(el, cssValues);
	
	            that.notify('start');
	        }, TIMEOUT_DELAY);
	
	        if (duration <= 0) {
	            _delay(callback);
	        }
	
	        return that;
	    };
	})();
	

	var checkContains = function (list, el) {
	    for (var i = 0, len = list.length; i < len; i += 1) {
	        if (_contains(list[i], el)) {
	            return TRUE;
	        }
	    }
	    return FALSE;
	};
	
	function _delegatedEvent(actEl, expEls, tag) {
	    if (!expEls) {
	        expEls = [];
	    }
	    expEls = [].concat(expEls);
	    var evtList = {},
	        bindEvent = function (evt) {
	            var el = evt.target,
	                type = evt.type;
	            doDelegated(el, type, evt);
	        },
	        actionTag = tag || 'action-type';
	
	    function doDelegated(el, type, evt) {
	        var actionType = NULL;
	
	        function checkBuble() {
	            var tg = el,
	                data = _dataSet(tg);
	            if (evtList[type] && evtList[type][actionType]) {
	                return evtList[type][actionType]({
	                    'evt': evt,
	                    'el': tg,
	                    'box': actEl,
	                    'data': data
	                }, data);
	            } else {
	                return TRUE;
	            }
	        }
	
	        if (checkContains(expEls, el)) {
	            return FALSE;
	        } else if (!_contains(actEl, el)) {
	            return FALSE;
	        } else {
	            while (el && el !== actEl) {
	                if (el.nodeType === 1) {
	                    actionType = el.getAttribute(actionTag);
	                    if (actionType && checkBuble() === FALSE) {
	                        break;
	                    }
	                }
	                el = el.parentNode;
	            }
	
	        }
	    }
	
	    var that = {};
	
	    that.add = function (funcName, evtType, process, useCapture) {
	        if (!evtList[evtType]) {
	            evtList[evtType] = {};
	            _addEvent(actEl, evtType, bindEvent, !!useCapture);
	        }
	        var ns = evtList[evtType];
	        ns[funcName] = process;
	    };
	
	    that.remove = function (funcName, evtType) {
	        if (evtList[evtType]) {
	            delete evtList[evtType][funcName];
	            if (_isEmptyObject(evtList[evtType])) {
	                delete evtList[evtType];
	                _removeEvent(actEl, evtType, bindEvent);
	            }
	        }
	    };
	
	    that.pushExcept = function (el) {
	        expEls.push(el);
	    };
	
	    that.removeExcept = function (el) {
	        if (!el) {
	            expEls = [];
	        } else {
	            for (var i = 0, len = expEls.length; i < len; i += 1) {
	                if (expEls[i] === el) {
	                    expEls.splice(i, 1);
	                }
	            }
	        }
	
	    };
	
	    that.clearExcept = function () {
	        expEls = [];
	    };
	
	    that.fireAction = function (actionType, evtType, evt, params) {
	        var data = {};
	        if (params && params.data) {
	            data = params.data;
	        }
	        if (evtList[evtType] && evtList[evtType][actionType]) {
	            evtList[evtType][actionType]({
	                'evt': evt,
	                'el': NULL,
	                'box': actEl,
	                'data': data,
	                'fireFrom': 'fireAction'
	            }, data);
	        }
	    };
	
	    that.fireInject = function (dom, evtType, evt) {
	        var actionType = dom.getAttribute(actionTag),
	            dataSet = _dataSet(dom);
	        if (actionType && evtList[evtType] && evtList[evtType][actionType]) {
	            evtList[evtType][actionType]({
	                'evt': evt,
	                'el': dom,
	                'box': actEl,
	                'data': dataSet,
	                'fireFrom': 'fireInject'
	            }, dataSet);
	        }
	    };
	
	
	    that.fireDom = function (dom, evtType, evt) {
	        doDelegated(dom, evtType, evt || {});
	    };
	
	    that.destroy = function () {
	        for (var k in evtList) {
	            for (var l in evtList[k]) {
	                delete evtList[k][l];
	            }
	            delete evtList[k];
	            _removeEvent(actEl, k, bindEvent);
	        }
	    };
	
	    return that;
	}

	var URL_REG = /(\w+):\/\/\/?([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(\?[^#]*)?(#.*)?/i,
	    URL_MAP = ['url', 'protocol', 'hostname', 'port', 'path', 'name', 'query', 'hash'];
	
	function _parseURL(str, decode) {
	    var scope = _associate(URL_REG.exec(str) || [], URL_MAP);
	
	    scope.query = scope.query ? _queryToJson(scope.query.substring(1), decode) : {};
	
	    scope.hash = scope.hash ? _queryToJson(scope.hash.substring(1), decode) : {};
	
	    scope.getQuery = function(key) {
	        return scope.query[key];
	    };
	
	    scope.getHash = function(key) {
	        return scope.hash[key];
	    };
	
	    scope.setQuery = function(key, value) {
	        if (value === UNDEFINED) {
	            scope.query[key] = NULL;
	        } else {
	            scope.query[key] = value;
	        }
	        return scope;
	    };
	
	    scope.setHash = function(key, value) {
	        if (value === UNDEFINED) {
	            scope.hash[key] = NULL;
	        } else {
	            scope.hash[key] = value;
	        }
	        return scope;
	    };
	
	    scope.toUrl = function(encode) {
	        var url = scope.protocol + '://',
	            query = _jsonToQuery(scope.query, encode),
	            hash = _jsonToQuery(scope.hash, encode);
	        if (scope.protocol && scope.protocol.toLowerCase() === 'file') {
	            url += '/';
	        }
	        return url +
	            scope.hostname +
	            (scope.port || '') +
	            scope.path +
	            (scope.name || '') +
	            (query ? '?' + query : '') +
	            (hash ? '#' + hash : '');
	    };
	
	    return scope;
	}
	
	/// Loader
	var LOADER_OPT = {
	    charset: 'UTF-8',
	    timeout: 30 * 1000,
	    onComplete: NULL,
	    onTimeout: NULL,
	    onFail: NULL
	};
	
	var headEL = doc.getElementsByTagName('head')[0];
	
	function bindEvent(el, deferred, timeout) {
	    var requestTimeout;
	
	    headEL.insertBefore(el, headEL.firstChild);
	
	    if (timeout) {
	        requestTimeout = _delay(function() {
	            el.onload = NULL;
	            _removeNode(el);
	            deferred.reject({type : 'Timeout'});
	        }, timeout);
	    }
	
	    el.onload = function() {
	        if (requestTimeout) {
	            clearTimeout(requestTimeout);
	        }
	        el.onload = NULL;
	        el.onerror = NULL;
	        deferred.resolve();
	    };
	
	    el.onerror = function() {
	        if (requestTimeout) {
	            clearTimeout(requestTimeout);
	        }
	        _removeNode(el);
	        el.onload = NULL;
	        el.onerror = NULL;
	        deferred.reject({type : 'Error'});
	    };
	}
	
	var Manager = {
	    script : function(url, options) {
	        var deferred = new Deferred(),
	            charset = options.charset,
	            timeout = options.timeout,
	            el = doc.createElement('script');
	        el.type = 'text/javascript';
	        el.charset = charset;
	        return deferred.startWith(function() {
	            deferred.notify('element', el);
	            bindEvent(el, deferred, timeout);
	            el.src = url;
	        });
	    },
	    style : function(url, options) {
	        var deferred = new Deferred(),
	            charset = options.charset,
	            timeout = options.timeout,
	            el = doc.createElement('link');
	        el.type = 'text/css';
	        el.charset = charset;
	        el.rel = 'stylesheet';
	        return deferred.startWith(function() {
	            bindEvent(el, deferred, timeout);
	            el.href = url;
	        });
	    },
	    image : function(url, options) {
	        var deferred = new Deferred(),
	            img = new Image(),
	            timeout = options.timeout,
	            timer = NULL;
	        img.onload = function() {
	            img.onload = NULL;
	            img.onerror = NULL;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            deferred.resolve(img);
	        };
	        img.onerror = function() {
	            img.onload = NULL;
	            img.onerror = NULL;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            deferred.reject({type : 'Error'});
	        };
	        if (timeout) {
	            timer = _delay(function() {
	                img.onload = NULL;
	                img.onerror = NULL;
	                if (timer) {
	                    clearTimeout(timer);
	                }
	                deferred.reject({type : 'Timeout'});
	            }, timeout);
	        }
	        return deferred.startWith(function() {
	            img.src = url;
	        });
	    }
	};
	
	function _loader(type, url, options) {
	    var opt = _extend({}, LOADER_OPT, options),
	        deferred = Manager[type] && Manager[type](url, opt);
	
	    if (deferred && (opt.onComplete || opt.onFail || opt.onTimeout)) {
	        deferred.then(opt.onComplete, function(reason) {
	            if (reason.type === 'Timeout' && _isFunction(opt.onTimeout)) {
	                opt.onTimeout(reason);
	            }
	            if (reason.type === 'Error' && _isFunction(opt.onFail)) {
	                opt.onFail(reason);
	            }
	        });
	    }
	
	    return deferred;
	}

	var supportsOrientationChange = "onorientationchange" in win,
	    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
	    _orientation = _createEventManager(),
	    getOrientation = function(size) {
	        return size.width > size.height ? 'landscape' : 'portrait';
	    };
	
	_orientation.get = function() {
	    return getOrientation(_size(win));
	};
	
	_ready(function() {
	    var curSize = _size(win);
	    win.addEventListener(orientationEvent, function() {
	        var size = _size(win);
	        if (curSize.width !== size.width || curSize.height !== size.height) {
	            curSize = size;
	            _orientation.trigger('change', {
	                type: orientationEvent,
	                width: size.width,
	                height: size.height,
	                orientation: getOrientation(size)
	            });
	        }
	    });
	});

	var LOGGER_TYPES = ['info', 'debug', 'warn', 'error'];
	
	function _logger(type, args) {
	    console[type].apply(console, ['[' + type.toUpperCase() + ']'].concat(_makeArray(args)));
	}
	
	LOGGER_TYPES.forEach(function(type, index) {
	   _logger[type] = function() {
	       if (index >= Config.logLevel) {
	           _logger(type, arguments);
	       }
	   };
	});
	
	// query 配置
	
	var logLevel = _parseURL(location.href).query.logLevel;
	
	if (logLevel) {
	    Config.logLevel = parseInt(logLevel);
	}
	

	define('fetchNode', function () {
	
	    function resolveNode(deferred) {
	        deferred.resolve();
	    }
	
	    return function (view) {
	        var options = view.options;
	
	        return new Deferred().startWith(function (that) {
	            if (options.html || _isFunction(options.fetch)) {
	                if (options.html) {
	                    resolveNode(that);
	                } else if (options.fetch.length) { // function(resolve) {}
	                    options.fetch.call(view, function (node) {
	                        options.html = node || '';
	                        resolveNode(that);
	                    });
	                } else {
	                    options.html = options.fetch.call(view) || '';
	                    resolveNode(that);
	                }
	            } else {
	                options.html = '';
	                resolveNode(that);
	            }
	        });
	    };
	});
	

	define('display', function() {
	    return {
	        show: function (container, startCss, endCss, duration) {
	            var me = this;
	            if (me.isShow) {
	                _css(me.root, _extend({
	                    width: '100%',
	                    height: '100%',
	                    zIndex: _getZIndex()
	                }, endCss || startCss));
	                me.trigger('refresh');
	            } else {
	                me.once('completed', function () {
	                    _css(me.root, _extend({
	                        width: '100%',
	                        height: '100%',
	                        zIndex: _getZIndex()
	                    }, startCss));
	                    me.trigger('beforeShow');
	                    if (Config.animate && endCss) {
	                        _animate(me.root, endCss, duration).done(function () {
	                            me.trigger('show');
	                        });
	                    } else {
	                        _css(me.root, endCss || {});
	                        me.trigger('show');
	                    }
	                });
	                me.renderTo(_isElement(container) ? container : Config.appRoot);
	            }
	            return me;
	        },
	        hide: function () {
	            var me = this;
	            if (me.isShow) {
	                me.trigger('beforeHide');
	                me.trigger('hide');
	            }
	            return me;
	        }
	    };
	});

	define('pluginM', function () {
	
	    var plugins = QApp._plugins = {},
	        globalPlugins = [];
	
	    return {
	        /**
	         * 增加插件
	         *
	         * @method QApp.plugin.add
	         * @category Plugin
	         * @alias QApp.addPlugin
	         * @core
	         * @param {String|Array<String>} name 插件名
	         * @param {Object} options 默认配置
	         * @param {Function} [adapter] 适配器
	         * @example
	         * QApp.addPlugin('some', someOpt, function(view, opt) {
	         *      view.someAttr = someValue;
	         *      return SomeObject;
	         * });
	         * @explain
	         * `plugin` 可以通过监听生命周期事件来进行相关行为，也可以复写或增加视图的方法。
	         */
	        add: function (key, options, adapter) {
	            var names = [].concat(key);
	            names.forEach(function (name) {
	                if (!plugins[name]) {
	                    plugins[name] = {
	                        options: options,
	                        adapter: adapter
	                    };
	                } else {
	                    _logger.warn( 'Plugin "' + name + '" already exist.');
	                }
	            });
	        },
	        /**
	         * 检测插件是否存在
	         *
	         * @method QApp.plugin.exists
	         * @category Plugin
	         * @param {String} name 插件名
	         * @return {Boolean} flag 是否存在
	         */
	        exists: function (name) {
	            return !!plugins[name];
	        },
	        /**
	         * 获取插件当前配置
	         *
	         * @method QApp.plugin.get
	         * @category Plugin
	         * @param {String} name 插件名
	         * @return {Object} options 当前配置
	         */
	        get: function (name) {
	            return plugins[name];
	        },
	        /**
	         * 设置插件当前配置
	         *
	         * @method QApp.plugin.setOpt
	         * @category Plugin
	         * @param {String} name 插件名
	         * @param {Object} options 配置
	         * @explain
	         * 以 `extend` 的方式
	         */
	        setOpt: function (name, options) {
	            if (plugins[name]) {
	                _extend(TRUE, plugins[name].options, options);
	            }
	        },
	        /**
	         * 获取全局插件列表
	         *
	         * @method QApp.plugin.getGlobal
	         * @category Plugin
	         * @alias QApp.configPlugin
	         * @return {Array} plugins 全局插件列表
	         */
	        getGlobal: function () {
	            return globalPlugins;
	        },
	        /**
	         * 设置全局插件
	         *
	         * @method QApp.plugin.setGlobal
	         * @category Plugin
	         * @alias QApp.setGlobalPlugins
	         * @param {String|Array<String>} gPlugins 插件或列表
	         * @explain
	         * 内部逻辑是 `concat` 操作
	         */
	        setGlobal: function (gPlugins) {
	            globalPlugins = globalPlugins.concat(gPlugins);
	        }
	    };
	});
	

	define('widgetM', function () {
	
	    var widgets = QApp._widgets = {};
	
	    return {
	        /**
	         * 添加组件
	         *
	         * @method QApp.widget.add
	         * @category Widget
	         * @alias QApp.addWidget
	         * @core
	         * @param {String} name 组件名
	         * @param {Function} adapter 适配器
	         * @param {Boolean|String} [isEvent] 是否由事件触发
	         * @example
	         * QApp.addWidget('some', function(element, opt, view) {
	         *      todoSomething();
	         * })
	         * @explain
	         * `isEvent` 是 `true` 或者是 事件名 (`tap`) 时为触发式组件，反之为渲染式组件
	         */
	        add: function (name, adapter, isEvent) {
	            widgets[name] = {
	                eventName: isEvent && (_isString(isEvent) ? isEvent : 'tap'),
	                adapter: adapter
	            };
	        },
	        /**
	         * 检查组件是否存在
	         *
	         * @method QApp.widget.exists
	         * @category Widget
	         * @param {String} name 组件名
	         * @return {Boolean} flag 是否存在
	         */
	        exists: function (name) {
	            return !!widgets[name];
	        },
	        isEvent: function (name) {
	            return !!widgets[name].eventName;
	        },
	        /**
	         * 获取组件当前配置
	         *
	         * @method QApp.widget.get
	         * @category Widget
	         * @param {String} name 组件名
	         * @return {Object} options 当前组件配置
	         */
	        get: function (name) {
	            return widgets[name];
	        },
	        /**
	         * 显示组件
	         *
	         * @method QApp.widget.show
	         * @category Widget
	         * @alias QApp.showWidget
	         * @core
	         * @param {String} name 组件名
	         * @param {Element} [el] 节点
	         * @param {Object} options 配置
	         * @param {View} [view] 关联的视图
	         * @return {Any} obj 组件返回的对象
	         * @example
	         * var widget = QApp.showWidget('searchlist', {
	         *    onComplete: function() {
	         *          todoSomething();
	         *    }
	         * });
	         * @explain
	         * 所需参数和返回的对象由组件的适配器决定
	         */
	        show: function (name, el, options, view) {
	            if (widgets[name]) {
	                if (_isElement(el)) {
	                    return widgets[name].adapter(el, options, view);
	                } else {
	                    return widgets[name].adapter(NULL, el, options);
	                }
	            }
	        }
	    };
	
	});
	

	define('module', function () {
	
	    var $pluginM = r('pluginM'),
	        $viewM;
	
	    // 默认配置
	    var DEFAULT_OPT = {
	        name: NULL,         // 名称
	        defaultTag: NULL,   // 默认 tag
	        container: NULL,    // 渲染的位置
	        renderAll: FALSE,   // 是否都渲染
	        ready: NULL,        // ready 回调
	        views: [],          // 包含的 views
	        plugins: [],        // 插件配置
	        renderEvent: TRUE
	    };
	
	    // 渲染 View
	    function renderView(name, param, module, isShow) {
	
	        return new Deferred().startWith(function (that) {
	            $viewM.get(name, function (view) {
	                if (that.enabled) {
	                    if (view) {
	                        var cb = function (type) {
	                            if (type === 'destroy') {
	                                view.destroy();
	                                view = NULL;
	                                that.reject();
	                            }
	                        };
	
	                        view.parentModule = module;
	                        view.parentView = module.parentView;
	                        view.on('loadStart', function () {
	                            view.mergeParam(param);
	                            view.initialShow = !!isShow;
	                        });
	                        view.on('completed', function () {
	                            that.resolve(view);
	                        });
	                        view.renderTo(module.container);
	                        view.on('destroy', function () {
	                            view = NULL;
	                        });
	
	                        that.progress(cb);
	                        that.all(function () {
	                            that.unProgress(cb);
	                        });
	                    } else {
	                        that.resolve(NULL);
	                    }
	                }
	            });
	        });
	    }
	
	    // 处理 View
	    function handleView(module, parentViewIndex) {
	        var views = module.options.views;
	        views.forEach(function (view, index) {
	            if (_isString(view)) {
	                views[index] = view = {
	                    tag: view,
	                    name: view,
	                    param: {}
	                };
	            }
	            if (view.name.indexOf(':') === -1 && parentViewIndex) {
	                view.name += ':' + parentViewIndex;
	            }
	            module.addView(view.tag, view.name, view.param);
	        });
	    }
	
	    // 处理 Plugin
	    function handlePlugin(module) {
	        module.options.plugins.forEach(function (plugin) {
	            var name = typeof plugin === 'string' ? plugin : plugin.name,
	                options = plugin.options || {};
	            if ($pluginM.exists(name)) {
	                module.plugins[name] = ($pluginM.get(name))(module, options, Config);
	            }
	        });
	    }
	
	    // 充值 View 样式
	    function resetViewStyle(view) {
	        if (view && view.options && view.options.styles) {
	            _css(view.root, view.options.styles);
	        }
	    }
	
	    // Module 对象
	    function Module(options, parentViewIndex) {
	        var me = this;
	
	        me.options = _extend(TRUE, {}, DEFAULT_OPT, options);
	        me.param = {};
	        me.isReady = FALSE;
	        me.container = NULL;
	        me.curTag = me.options.defaultTag || NULL;
	        me.tagList = [];
	        me.parentView = NULL;
	        me.views = {};
	        me.plugins = {};
	
	        me.renderAll = me.options.renderAll;
	        me.renderDefers = [];
	
	        me.renderAllDefer = NULL;
	        me.renderOneDefer = NULL;
	
	        me.pushMessageTimer = NULL;
	
	        _logger.info( '[Module] 新建模块', me.name, '标签列表', me.tagList);
	        handleView(me, parentViewIndex);
	        handlePlugin(me);
	    }
	
	    _extend(Module.prototype, {
	        renderTo: function (container) {
	            var me = this,
	                renderEvent = me.options.renderEvent,
	                curView;
	            me.container = container;
	            if (me.renderAll) {
	                me.renderAllDefers = _queue(me.renderDefers, me.tagList).done(function () {
	                    me.trigger('loaded');
	                }).progress(function (tag, view) {
	                    if (view) {
	                        if (renderEvent) {
	                            view.trigger('beforeShow');
	                        }
	                        me.views[tag].entity = view;
	                        if (renderEvent) {
	                            view.trigger('show');
	                        }
	                    }
	                });
	            } else if (me.curTag) {
	                curView = me.views[me.curTag];
	                if (curView) {
	                    me.renderOneDefer = renderView(curView.name, curView.param, me, TRUE).done(function (view) {
	                        if (renderEvent) {
	                            view.trigger('beforeShow');
	                        }
	                        curView.entity = view;
	                        if (renderEvent) {
	                            view.trigger('show');
	                        }
	                        me.trigger('loaded');
	                    });
	                }
	            } else {
	                me.trigger('loaded');
	            }
	            if (!me.isReady) {
	                me.isReady = TRUE;
	                me.trigger('ready');
	                _apply(me.options.ready, me);
	            }
	        },
	        mergeParam: function (newParam) {
	            var me = this,
	                viewOpt;
	            _extend(TRUE, me.param, newParam);
	            if (me.curTag && me.views[me.curTag]) {
	                viewOpt = me.views[me.curTag];
	                $viewM.get(viewOpt.name, viewOpt.param).invoke('mergeParam', me.param);
	            }
	        },
	        addView: function (tag, name, param) {
	            var me = this;
	            tag = tag || name;
	            if (me.renderAll && !me.curTag) {
	                me.curTag = tag;
	            }
	            me.views[tag] = {
	                name: name,
	                param: param
	            };
	            me.tagList.push(tag);
	            if (me.renderAll) {
	                me.renderDefers.push(renderView(name, param, me, me.curTag === tag));
	            }
	        },
	        /**
	         * 切换视图
	         *
	         * @prototype Module.prototype.launch
	         * @category Class:Module
	         * @type {Function}
	         * @param {String} tag 视图标签
	         * @param {Object} param 参数
	         */
	        launch: function (tag, param) {
	            var me = this,
	                curView = me.views[me.curTag],
	                nextView = me.views[tag],
	                curEntity, nextEntity;
	
	            _logger.info( '[Module] 切换标签', tag);
	            if (me.renderOneDefer) {
	                me.renderOneDefer.destroy();
	                me.renderOneDefer = NULL;
	            }
	
	            if (nextView) {
	                curEntity = curView && curView.entity;
	                nextEntity = nextView.entity;
	                if (me.curTag === tag && curEntity) {
	                    curEntity.mergeParam(_extend({}, me.param, param));
	                    curEntity.trigger('refresh');
	                } else {
	                    if (me.renderAll) {
	                        nextEntity.mergeParam(_extend({}, me.param, param));
	                        if (curEntity) {
	                            curEntity.trigger('beforeHide');
	                            _css(curEntity.root, 'display', 'none');
	                        }
	                        nextEntity.trigger('beforeShow');
	                        _removeStyle(nextEntity.root, ['visibility', 'display']);
	                        resetViewStyle(nextEntity);
	                        nextEntity.trigger('show');
	                        nextEntity.notify('actived');
	                        if (curEntity) {
	                            curEntity.trigger('hide');
	                            curEntity.notify('deactived');
	                        }
	                        me.curTag = tag;
	                        me.trigger('launch', tag, param);
	                    } else {
	                        if (curEntity) {
	                            curEntity.trigger('beforeHide');
	                        }
	                        nextEntity = nextView.entity = NULL;
	                        me.renderOneDefer = renderView(nextView.name, _extend({}, nextView.param, me.param, param), me).done(function (view) {
	                            if (view) {
	                                nextEntity = nextView.entity = view;
	                                nextEntity.mergeParam(_extend({}, me.param, param));
	                                nextEntity.trigger('beforeShow');
	                                if (curEntity) {
	                                    _css(curEntity.root, 'display', 'none');
	                                }
	                                _removeStyle(nextEntity.root, ['visibility', 'display']);
	                                resetViewStyle(nextEntity);
	                                if (curEntity) {
	                                    curEntity.trigger('hide');
	                                }
	                                nextEntity.trigger('show');
	                                if (curEntity) {
	                                    curEntity.destroy();
	                                    curView.entity = NULL;
	                                }
	                                me.trigger('launch', tag, param);
	                            }
	                        }).fail(function () {
	                            if (curEntity) {
	                                curEntity.destroy();
	                                curView.entity = NULL;
	                            }
	                        });
	                    }
	                    me.curTag = tag;
	                }
	            }
	        },
	        getCurViewOpt: function () {
	            return this.views[this.curTag];
	        },
	        getCurView: function () {
	            var me = this,
	                tag = me.curTag,
	                views = me.views;
	            return tag && views[tag] ? views[tag].entity : NULL;
	        },
	        pushMessage: function (type, message) {
	            var me = this;
	            if (me.curTag) {
	                if (me.views[me.curTag].entity) {
	                    me.views[me.curTag].entity.trigger(type, message);
	                } else {
	                    (me.renderOneDefer || me.renderAllDefer).done(function () {
	                        if (me.views[me.curTag].entity) {
	                            me.views[me.curTag].entity.trigger(type, message);
	                        }
	                    });
	                }
	            }
	        },
	        destroy: function () {
	            var me = this;
	
	            _each(me.views, function (tag, viewOpt) {
	                if (viewOpt.entity && viewOpt.entity.destroy) {
	                    viewOpt.entity.destroy();
	                }
	                viewOpt.entity = NULL;
	            });
	
	            me.tagList.length = 0;
	
	            me.renderDefers.forEach(function (deferred) {
	                deferred.destroy();
	            });
	
	            me.renderDefers.length = 0;
	
	            if (me.renderAllDefer) {
	                me.renderAllDefer.destroy();
	            }
	
	            if (me.renderOneDefer) {
	                me.renderOneDefer.destroy();
	            }
	
	            clearTimeout(me.pushMessageTimer);
	
	            _each(me.plugins, function(key, plugin) {
	                if (plugin && _isFunction(plugin.destroy)) {
	                    plugin.destroy();
	                }
	            });
	
	            _empty(me);
	
	            me.destroyed = TRUE;
	        }
	    }, CustEvent);
	
	    // 注入 ViewManager
	    Module.inject = function (Manager) {
	        $viewM = Manager;
	    };
	
	    return Module;
	
	});
	
	/**
	 * 切换事件
	 *
	 * @event Module:launch
	 * @category Class:Module
	 */
	

	/* ================================== View ================================== */
	define('view', function () {
	
	    var Module = r('module'),
	        $fetchNode = r('fetchNode'),
	        $pluginM = r('pluginM'),
	        $widgetM = r('widgetM'),
	        $display = r('display');
	
	    var RENDER_TIMEOUT = 10;
	
	    var DEFAULT_OPT = {
	        init: {},
	        isContainer: FALSE,
	        html: NULL,
	        fetch: NULL,
	        classNames: [],
	        attrs: {},
	        styles: {},
	        destroyDom: TRUE,
	        supportHash: TRUE,
	        ready: NULL,
	        modules: [],
	        subViews: [],
	        plugins: [],
	        bindEvents: {},
	        extra: {}
	    };
	
	    function createRoot(isContainer) {
	        return doc.createElement(
	            isContainer ? Tags.container : Tags.view
	        );
	    }
	
	    function initialize(view) {
	        var init = view.options.init;
	        _each(init, function (key, value) {
	            _logger.info( '[View] 初始化', key, '在视图', view.name, '上, 值为', value);
	            view[key] = _isFunction(value) ? value.bind(view) : value;
	        });
	    }
	
	    function bindEvents(view) {
	        _each(view.options.bindEvents, function(eventName, process) {
	            if (_isFunction(process)) {
	                _logger.info( '[View] 绑定事件', eventName, '在视图', view.name, '上, 回调为', process);
	                view.on(eventName, process.bind(view));
	            }
	        });
	    }
	
	    function handleModule(view, viewIndex) {
	        var options = view.options,
	            module;
	        options.subViews.forEach(function (item) {
	            options.modules.unshift({
	                name: item.name + '-module',
	                defaultTag: 'index',
	                container: item.container,
	                ready: NULL,
	                views: [{
	                    tag: 'index',
	                    name: item.name,
	                    param: item.param
	                }],
	                plugins: [],
	                renderEvent: item.renderEvent
	            });
	        });
	        options.modules.forEach(function (moduleOpt) {
	            view.hasModule = TRUE;
	            module = new Module(moduleOpt, viewIndex);
	            module.parentView = view;
	            view.modules[moduleOpt.name] = module;
	        });
	    }
	
	    function handlePlugin(view) {
	        var addPlugins = view.options.isContainer ? [] : $pluginM.getGlobal();
	
	        addPlugins.concat(view.options.plugins).forEach(function (plugin) {
	            var name = _isString(plugin) ? plugin : plugin.name,
	                options = plugin.options || view.options[_camelCase(name) + 'Options'] || {},
	                pluginOpt = $pluginM.get(name),
	                opt;
	            if (pluginOpt && _isFunction(pluginOpt.adapter)) {
	                _logger.info( '[View] 添加插件', name, '配置', options, '在视图', view.name);
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
	        _logger.info( '[View] 创建视图', me.name);
	        me.isContainer = me.options.isContainer;
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
	        me.locked = FALSE;
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
	         * 父模块
	         *
	         * @property View.parentModule
	         * @category Class:View
	         * @type {Module}
	         */
	        me.parentModule = NULL;
	        /**
	         * 父视图
	         *
	         * @property View.parentView
	         * @category Class:View
	         * @type {View}
	         */
	        me.parentView = NULL;
	        /**
	         * 是否存在模块
	         *
	         * @property View.hasModule
	         * @category Class:View
	         * @type {Boolean}
	         */
	        me.hasModule = FALSE;
	        /**
	         * 模块映射
	         *
	         * @property View.modules
	         * @category Class:View
	         * @type {Object<String, Module>}
	         */
	        me.modules = {};
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
	
	        me.renderEventTimer = NULL;
	        me.renderDeferred = new Deferred();
	
	        me.moduleDeferreds = [];
	        me.modulParallelDeferred = NULL;
	
	        _logger.info( '[View] 开始初始化视图', me.name);
	        initialize(me);
	        _logger.info( '[View] 开始绑定事件', me.name);
	        bindEvents(me);
	        _logger.info( '[View] 开始处理模块', me.name);
	        handleModule(me, getViewIndex(me.name));
	        _logger.info( '[View] 开始处理插件', me.name);
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
	            _logger.info( '[View] 渲染视图', me.name, '容器', container);
	            if (!me.locked) {
	                me.locked = TRUE;
	                me.container = container;
	                if (!me.isReady) {
	                    me.root = createRoot(me.isContainer);
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
	                            if (me.hasModule) {
	                                _each(me.modules, function (key, module) {
	                                    me.moduleDeferreds.push(new Deferred().startWith(function (that) {
	                                        module.once('loaded', function () {
	                                            that.resolve();
	                                        });
	                                        module.renderTo(
	                                            (module.options.container && me.root.querySelector(module.options.container)) || me.root
	                                        );
	                                    }));
	                                });
	                                me.modulParallelDeferred = _parallel(me.moduleDeferreds).done(function () {
	                                    me.trigger('loaded');
	                                    me.locked = FALSE;
	                                    doReady(me);
	                                });
	                            } else {
	                                me.trigger('loaded');
	                                me.locked = FALSE;
	                                doReady(me);
	                            }
	                        });
	                    });
	                } else {
	                    me.trigger('rendered');
	                    me.container.appendChild(me.root);
	                    me.trigger('loaded');
	                    me.locked = FALSE;
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
	                deferred = me.renderDeferred,
	                cb = function (e) {
	                    if (me.renderEventTimer) {
	                        clearTimeout(me.renderEventTimer);
	                        me.renderEventTimer = NULL;
	                    }
	                    me.renderEventTimer = _delay(function () {
	                        if (me.root) {
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
	                me.renderEventTimer = _delay(function () {
	                    if (me.root) {
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
	            _logger.info( '[View] 静态构建', me.name);
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
	            _logger.info( '[View] Merge 参数在视图', me.name, '上，新参数为', newParam);
	            _extend(TRUE, me.param, newParam);
	            _each(me.modules, function (key, module) {
	                module.mergeParam(me.param);
	            });
	            return me;
	        },
	        /**
	         * 获取子视图
	         *
	         * @prototype View.prototype.getInnerView
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 视图名
	         * @return {View} view 子视图实例
	         */
	        getInnerView: function (name) {
	            var me = this,
	                key, viewOpt;
	            if (name) {
	                for (key in me.modules) {
	                    viewOpt = me.modules[key].getCurViewOpt();
	                    if (viewOpt.entity && viewOpt.name === name) {
	                        return viewOpt.entity;
	                    }
	                }
	            }
	            return NULL;
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
	         * 派发事件
	         *
	         * @prototype View.prototype.dispatch
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Object} data 数据
	         * @explain
	         * 其父祖级视图也会接收到此事件（向外冒泡）
	         */
	        dispatch: function () {
	            var me = this,
	                parentView = me.parentView,
	                args = _makeArray(arguments);
	            _logger.info( '[View] 视图', me.name, '事件派发', args);
	            if (me.trigger.apply(me, args) && parentView) {
	                if (parentView.isReady && !parentView.locked) {
	                    parentView.trigger.apply(parentView, args);
	                } else {
	                    parentView.on('completed', function () {
	                        parentView.trigger.apply(parentView, args);
	                    });
	                }
	            }
	        },
	        /**
	         * 通知事件
	         *
	         * @prototype View.prototype.notify
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Object} data 数据
	         * @explain
	         * 其子孙级视图也会接收到此事件（向内冒泡）
	         */
	        notify: function () {
	            var me = this,
	                args = _makeArray(arguments),
	                subView;
	            _logger.info( '[View] 视图', me.name, '事件通知', args);
	            if (me.trigger.apply(me, args) && me.hasModule) {
	                _each(me.modules, function (key, module) {
	                    subView = module.getCurView();
	                    if (subView) {
	                        subView.notify.apply(subView, args);
	                    }
	                });
	            }
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
	            _logger.info( '[View] 销毁视图:', this.name);
	            var me = this;
	            if (me.options.destroyDom) {
	                _removeNode(me.root);
	            }
	
	            clearTimeout(me.renderEventTimer);
	
	            if (me.renderDeferred) {
	                me.renderDeferred.destroy();
	            }
	
	            if (me.hasModule) {
	                me.moduleDeferreds.forEach(function (deferred) {
	                    deferred.destroy();
	                });
	                me.moduleDeferreds.length = 0;
	                if (me.modulParallelDeferred) {
	                    me.modulParallelDeferred.destroy();
	                }
	            }
	
	            _each(me.modules, function (key, module) {
	                module.destroy();
	            });
	
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
	

	define('taskQ', function () {
	
	    var messageCenter = _createEventManager(),
	        curTasks = NULL,
	        timeout = 500;
	
	    function createQueue(tasks) {
	        QApp.trigger('running', TRUE);
	        _queue(tasks, [], TRUE).done(function() {
	            curTasks.forEach(function(task) {
	                if (task && _isFunction(task.destroy)) {
	                    task.destroy();
	                }
	            });
	            curTasks = NULL;
	            QApp.trigger('running', FALSE);
	        }).progress(function() {
	            messageCenter.trigger('ev');
	        });
	    }
	
	    var taskQueue = {
	        push: function(defer) {
	            if (curTasks) {
	                curTasks.push(defer);
	            } else {
	                curTasks = [defer];
	                createQueue(curTasks);
	            }
	        },
	        pushTask: function(task) {
	            taskQueue.push(new Deferred().startWith(function(that) {
	                try {
	                    task(that);
	                } catch(e) {}
	                _delay(function() {
	                    if (that && _isFunction(that.resolve)) {
	                        that.resolve();
	                    }
	                }, timeout);
	            }));
	        },
	        addListener: function(fn) {
	            messageCenter.on('ev', fn);
	        }
	    };
	
	    return taskQueue;
	});

	define('viewM', function() {
	
	    var View = r('view'),
	        Module = r('module'),
	        $taskQueue = r('taskQ');
	
	    var optionsMap = QApp._viewOptionsMap = {},
	        viewMap = QApp._viewMap = {};
	
	    function throwNoViewError(name) {
	        _logger.warn( '没有找到相应视图', name);
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
	         *            'data-some': 'qunar'
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
	         *        // 嵌套配置
	         *        modules: [{
	         *            // 名称
	         *            name: 'module',
	         *            // 默认 tag
	         *            defaultTag: 'someView',
	         *            // 渲染的位置
	         *            container: '.module-container',
	         *            // 包含视图配置，如果是 {string} 则，tag = view = 此 string
	         *            views: ['someView1', {
	         *                 tag: 'someName2',
	         *                 view: 'someView2'
	         *            }],
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
	         * @param {Object} options 视图配置
	         * @return {View} view 视图实例
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
	         */
	        show: function(viewName, options) {
	            var args = _makeArray(arguments);
	            _logger.debug( 'Show Arguments: ', args);
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
	
	    Module.inject(Manager);
	
	    return Manager;
	
	});
	

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
	            activedEvents = dec._events.actived = dec._events.actived || [];
	
	        // 在业务前绑定，事件
	        activedEvents.unshift({
	            callback: function() {
	                viewQueue.preView = viewQueue.curView;
	                viewQueue.curView = dec.name;
	            },
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
	        add: function(name, options, atBottom, callback) {
	            pushTask(function(that) {
	                _logger.info( '[ViewQueue] 增加视图', name, '配置', options, '是否从底部渲染', !!atBottom);
	                name = fixName(name);
	                var _callback = _isFunction(callback) ? callback : _noop;
	                if (name) {
	                    if ($viewM.exists(getRealName(name))) {
	                        viewQueue[atBottom ? 'unshift' : 'push']($viewM.structure(name, options), _callback);
	                        that.resolve();
	                    } else {
	                        _logger.warn( 'Do Not Found View');
	                        that.resolve().done(_callback);
	                    }
	                } else {
	                    _logger.warn( 'Do Not Show Same View.');
	                    that.resolve().done(_callback);
	                }
	            });
	        },
	        push: function(dec, callback) {
	            execute(dec);
	            dec.once('show', function() {
	                var lastDec = getLast();
	                if (lastDec) {
	                    lastDec.notify('deactived');
	                }
	                dec.notify('actived');
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
	                    dec.notify('actived');
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
	                                prevDec.notify('actived');
	                                if (data && data.data) {
	                                    prevDec.notify('receiveData', data);
	                                }
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
	            _logger.info( '[ViewQueue] 回退到视图:', name, '参数', param, 'Hash参数', query);
	            pushTask(function(that) {
	                var index = findByName(name),
	                    len = decStack.length;
	                _logger.info( '[ViewQueue] 视图索引', index);
	                if (index === -1) {
	                    _logger.info( '[ViewQueue] 渲染视图', getRealName(name));
	                    viewQueue.add(getRealName(name), {
	                        param: query
	                    }, TRUE, function(view) {
	                        $router._reset(view);
	                        _logger.info( '[ViewQueue] 渲染完成，回退');
	                        viewQueue.pop(len, param, callback);
	                    });
	                } else {
	                    _logger.info( '[ViewQueue] 直接回退');
	                    len = decStack.length - index - 1;
	                    viewQueue.pop(len, param, callback);
	                }
	                that.resolve();
	            });
	        },
	        refresh: function(data) {
	            var dec = getLast();
	            if (dec) {
	                dec.notify('receiveData', data);
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
	

	define('history', function () {
	
	    var $viewM = r('viewM');
	
	    var location = win.location,
	        history = win.history,
	        sessionStorage = win.sessionStorage,
	        sessionSupport = !!sessionStorage, // 支持sessionStorage情况
	        historyStorage = sessionSupport ? win.sessionStorage : win.localStorage, // 历史纪录存储
	        useHash = TRUE,   // 是否开启 Hash
	        hashSupport = NULL,   // Hash 支持情况情况
	        h5Mode = !!(history.pushState),  // h5 模式
	        hashChangeEvent = h5Mode ? 'popstate' : 'hashchange', // 监听的事件
	        localKeyPrefix = 'QAPP_HISTORY_', // 存储的前缀
	        localKeyId = 0, // 本地存储的id
	        localKey = '', // 本地历史存储的 key = localKeyPrefix + localKeyId
	        historyHashId = '_history',
	        localHistory = [], // 本地历史
	        historyIndex = 0, // 历史索引
	        virtualHistory = [], // 虚拟历史
	        eventManager = _createEventManager(), // 事件管理
	        getRealName = $viewM.getRealName, // 获取 realname
	        paramList = [],// Param List
	        basePath = (function () {
	            var path = location.href,
	                index = path.indexOf('#');
	            if (index > -1) {
	                path = path.slice(0, index);
	            }
	            return path;
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
	        eventManager.trigger('change', {
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
	                _logger.info( '[History] 使用 sessionStorage 存储历史记录');
	                localKey = historyHashId;
	            } else {
	                _logger.info( '[History] 使用 Hash 储存历史纪录');
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
	                _logger.info( '[History] Hash 历史 ID:', localKeyId);
	            }
	
	            try {
	                data = JSON.parse(historyStorage.getItem(localKey)) || {};
	            } catch (e) {
	            }
	
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
	
	            _logger.info( '[History] 当前历史纪录', JSON.stringify(localHistory));
	
	        }
	    }
	
	
	    // 存储历史
	    function saveHistory() {
	        _logger.info( '[History] 存储历史: ', JSON.stringify(localHistory), '索引位置', historyIndex);
	        try {
	            historyStorage.setItem(localKey, JSON.stringify({
	                basePath: basePath,
	                history: localHistory,
	                index: historyIndex
	            }));
	        } catch (e) {
	        }
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
	        path = index > -1 ? path.slice(index + 1) : '';
	        endIndex = path.indexOf('#');
	        if (endIndex > -1) {
	            path = path.slice(0, endIndex);
	        }
	        return path;
	    }
	
	    // 设置 hash
	    function setHash(hash, replace) {
	        var path = basePath + '#' + hash + '#';
	        curHash = hash;
	        if (h5Mode) {
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
	        infoCache = useHash ? (function () {
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
	
	            queryString = _jsonToQuery(query, TRUE);
	
	            setHash(view + (queryString ? '?' + queryString : ''), replace);
	            setHistory(view, replace);
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
	        win.addEventListener(hashChangeEvent, function () {
	            if (curHash !== getHash()) {
	                curHash = getHash();
	                infoCache = NULL;
	                execHash();
	            }
	        });
	    }
	
	    var History = {
	        basePath: basePath,
	        start: function (flag) {
	            var info;
	            useHash = !!flag;
	            curHash = getHash();
	            _logger.info( '[History] 开始初始化History模块, 使用Hash:', useHash, '当前Hash：', curHash);
	            if (useHash) {
	                hashSupport = Config.hashSupport;
	                info = getInfo();
	                initLocalHistory();
	                _logger.info( '[History] 初始化，视图: ', info.view, '参数: ', info.query);
	                if (!supportHash(info.view)) {
	                    _logger.info( '[History] 此视图不支持Hash', info.view);
	                    if (historyIndex > 0) {
	                        _logger.info( '[History] 回退一级');
	                        historyIndex--;
	                        infoCache = NULL;
	                        history.back();
	                        saveHistory();
	                        _delay(function () {
	                            History.start(flag);
	                        }, 100);
	                        return;
	                    } else {
	                        _logger.info( '[History] 显示主页');
	                        info = {
	                            view : Config.indexView,
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
	            _logger.info( '[History] 刷新Hash参数, 视图:', info.view, '当前参数', info.query, '新参数', obj);
	            info.query = _extend(info.query, obj);
	            setInfo(info, TRUE);
	        },
	        back: function (num, param) {
	            _logger.info( '[History] 历史回退, 回退级数', num, '参数', param);
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
	            _logger.info( '[History] 回退到视图', view, '参数', param, '是否全匹配', allMatch);
	            for (i = l; i > -1; i --) {
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
	            _logger.info( '[History] 回退到首页');
	            History.back(useHash ? historyIndex : (virtualHistory.length - 1), param);
	        },
	        exit: function() {
	            _logger.info( '[History] 退出应用');
	            QApp.trigger('close');
	            if (useHash) {
	                history.go(- historyIndex - 1);
	            } else {
	                history.back();
	            }
	        },
	        onChange: function (fn) {
	            eventManager.on('change', fn);
	        },
	        buildHash: function(info) {
	            var view = info.view,
	                query = info.query,
	                queryString = _jsonToQuery(query, TRUE);
	
	            return basePath + '#' + view + (queryString ? '?' + queryString : '') + '#';
	        }
	    };
	
	    return History;
	
	});

	/* ================================== Router ================================== */
	define('router', function () {
	
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
	            view.hide = function (data) {
	                Router.back(1, data || completeData);
	            };
	            view.complete = function (data) {
	                _logger.warn( '使用路由打开，不建议用 complete/onComplete 方式，建议用 receiveData 事件，和 native 贴近');
	                completeData = data;
	                _apply(_complete, view, [data]);
	            };
	        }
	    }
	
	    // 开始历史纪录处理
	    function startHistory(useHash) {
	        $history.onChange(function (data) {
	            var d = data.data,
	                info = d.info,
	                param = d.param,
	                type = data.type;
	            _logger.info( '[Router] 历史纪录事件，类型为：', data.type);
	            switch (type) {
	                case 'init':
	                    if (Config.autoInit) {
	                        _logger.info( '[Router] 初始化视图：', info.view);
	                        $viewQueue.add(info.view, {
	                            param: info.query
	                        }, TRUE, function (view) {
	                            reset(view);
	                            eventManager.trigger(type, view);
	                        });
	                    }
	                    break;
	                case 'forward':
	                    _logger.info( '[Router] 打开视图：', info.view);
	                    _delay(function () {
	                        $viewQueue.add(info.view, {
	                            param: info.query
	                        }, FALSE, function(view) {
	                            reset(view);
	                            eventManager.trigger(type, view);
	                        });
	                    }, 100);
	                    break;
	                case 'refresh':
	                    _logger.info( '[Router] 刷新视图：', info.view);
	                    $viewQueue.refresh({
	                        view: $viewM.getRealName(info.view),
	                        name: info.view,
	                        data: param
	                    });
	                    eventManager.trigger(type);
	                    break;
	                case 'back':
	                case 'home':
	                    _logger.info( '[Router] 回退到视图', info.view);
	                    _delay(function () {
	                        $viewQueue.backTo(info.view, param, info.query, function () {
	                            eventManager.trigger(type);
	                        });
	                    }, 100);
	                    break;
	            }
	        });
	        $history.start(useHash);
	    }
	
	    // 绑定自定义锚点
	    function bindAnchor() {
	        routerDelegated.add('router', 'tap', function (e) {
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
	            if ((args[1] && args[1].skipFilter) || backFilters.reduce(function (ret, filter) {
	                    return ret && (filter(args) !== FALSE);
	                }, TRUE)) {
	                return _apply($history[type], $history, args);
	            }
	        };
	    }
	
	    var Router = _extend(eventManager, {
	        start: function (useHash) {
	            if (!started) {
	                started = TRUE;
	                startHistory(useHash);
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
	         */
	        open: function (name, options, callback) {
	            var args = _makeArray(arguments);
	            if ((args[1] && args[1].skipFilter) || openFilters.reduce(function (ret, filter) {
	                    return ret && (filter(args) !== FALSE);
	                }, TRUE)) {
	                options = options || {};
	                var param = options.param || {};
	                $viewQueue.add(name, options, !!options.atBottom, function (view) {
	                    if (view) {
	                        reset(view);
	                        $history.setHashInfo({
	                            view: view.name,
	                            query: param
	                        });
	                        _apply(callback, view, [view]);
	                    } else {
	                        _apply(callback);
	                    }
	                });
	            }
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
	            _logger.info( '[Router] Goto', view);
	            if ($history.backTo(view, param, allMath) === FALSE) {
	                _logger.info( '[Router] 未返回，新打开视图');
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
	        addOpenFilter: function (filter) {
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
	        removeOpenFilter: function (filter) {
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
	        addBackFilter: function (filter) {
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
	        removeBackFilter: function (filter) {
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
	        _newSite: function () {
	            win.open($history.basePath);
	        },
	        _reset: reset
	    });
	
	    $viewQueue.inject(Router);
	
	    return Router;
	});

	var $viewM = r('viewM'),
	    $history = r('history'),
	    $router = r('router'),
	    $pluginM = r('pluginM'),
	    $widgetM = r('widgetM');
	
	var origin = {},
	    openFilters = [],
	    readyDefer = new Deferred(),
	    readyDependenceDefers = [];
	
	function coreReady(fn) {
	    readyDefer.done(fn);
	}
	
	coreReady(function () {
	    // 设置并记录 Root 的位置和大小
	    var de = doc.documentElement,
	        winWidth = de.clientWidth,
	        winHeight = de.clientHeight,
	        appRoot = doc.createElement(Tags.app);
	
	    QApp.root = Config.appRoot = appRoot;
	
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
	
	    function checkKeyboard() {
	        var curHeight = de.clientHeight;
	        if (curHeight >= winHeight) {
	            if (curHeight > winHeight) {
	                refreshSize();
	            }
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
	
	    $router.start(!!Config.hashRouter);
	
	    if (Config.screen) {
	        if (Config.screen.largeChange) {
	            win.addEventListener('resize', checkKeyboard);
	        }
	        if (Config.screen.rotate) {
	            _orientation.on('change', refreshSize);
	        }
	    }
	
	    if (Config.gesture) {
	        if (Config.gesture.ctrl) {
	            QApp.on('running', function(ret) {
	                Gesture[ret ? 'off' : 'on']();
	            });
	        }
	        if (Config.gesture.longTap) {
	            QApp.gesture.allowLongTap();
	        }
	        if (Config.gesture.autoBlur) {
	            var focusTags = ['INPUT', 'TEXTAREA'];
	            _addEvent(doc.body, 'touchstart', function(e) {
	                if (focusTags.indexOf(e.target.tagName.toUpperCase()) === -1) {
	                    _blur();
	                }
	            });
	        }
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
	     *       except: []
	     *   },
	     *   screen: {
	     *       // 是否支持屏幕旋转
	     *       rotate: false,
	     *       // 检测屏幕变大
	     *       largeChange: true
	     *   },
	     *   gesture: {
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
	util.removeEvent = _removeClass;
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
	
	util.gesture = QApp.gesture = Gesture;
	
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
	

	(function () {
	
	    var display = 'display',
	        visibility = 'visibility';
	
	    // 0 => 无动画
	    // 1 => translate3d
	    // 2 => translate + translateZ
	    // 3 => 使用 left/top 形式
	    var transType = (function() {
	
	        var ua = navigator.userAgent.toLowerCase();
	
	        // ios 和 安卓上的微信 使用 translate3d
	        if (_sniff.ios || (_sniff.android && ua.indexOf('micromessenger') > -1)) {
	            return 1;
	        }
	
	        // 其他安卓设备 使用 translate + translateZ
	        return 2;
	
	        // 无动画
	        //return 0;
	
	    })();
	
	    function resetDisplay(node) {
	        _removeStyle(node, display);
	    }
	
	    function resetVisibility(node) {
	        _css(node, visibility, '');
	        _removeStyle(node, visibility);
	    }
	
	    function getSizeValue(size) {
	        return (~(size + '').indexOf('%') || ~(size + '').indexOf('px')) ? size : (size + 'px');
	    }
	
	    var getTranslate3dStyle = transType == 1 ? function (x, y, z) {
	        return {
	            translate3d: x + 'px, ' + y + 'px, ' + z + 'px'
	        };
	    } : function (x, y, z) {
	        return {
	            translate: x + 'px, ' + y + 'px',
	            translateZ: z + 'px'
	        };
	    };
	
	    // 统一逻辑
	    function commonHandle(name, view, opt) {
	        view.on('loadEnd', function () {
	            _attr(view.root, 'qapp-ani', name);
	            _css(view.root, visibility, 'hidden');
	        });
	
	        view.on('beforeHide', function () {
	            _blur(view.root);
	        });
	
	        view.on('destroy', function () {
	            view.show = NULL;
	            view.hide = NULL;
	        });
	    }
	
	    /* ================================== MoveEnter 插件 ================================== */
	
	    var MIN_GAP = 10;
	
	    var DEFAULT_OPT = {
	        position: 'right',
	        distance: 0,
	        duration: 200,
	        zIndex: 0
	    };
	
	    var queue = {},
	        moving = FALSE;
	
	    function findViewIndex(curQueue, view) {
	        var curIndex = -1,
	            i, len;
	        for (i = 0, len = curQueue.length; i < len; i++) {
	            if (curQueue[i].view === view) {
	                curIndex = i;
	                break;
	            }
	        }
	        return curIndex;
	    }
	
	    function animateQueue(curQueue, curIndex, duration, horizontal, root) {
	        var dis = 0;
	        return _parallel(curQueue.map(function (item, index) {
	            if (index < curIndex) {
	                item.view.trigger('beforeHide');
	                return _animate(item.view.root, horizontal ? getTranslate3dStyle(item.translate, 0, 0) : getTranslate3dStyle(0, item.translate, 0), duration);
	            } else {
	                dis += item.distance;
	                return _animate(item.view.root, horizontal ? getTranslate3dStyle(dis, 0, 0) : getTranslate3dStyle(0, dis, 0), duration);
	            }
	        }));
	    }
	
	    QApp.addPlugin('moveEnter', DEFAULT_OPT, function (view, opt, config) {
	
	        var startCss = {
	                position: 'absolute',
	                top: 0,
	                zIndex: opt.zIndex || _getZIndex()
	            },
	            simpleShow = config.type.indexOf && config.type.indexOf('pad') === -1,
	            horizontal = opt.position === 'right' || opt.position === 'left',
	            orientationNum = (opt.position === 'right' || opt.position === 'bottom') ? -1 : 1,
	            realDistance,
	            simpleMoving = FALSE,
	            curQueue,
	            panStart = FALSE,
	            panMove = FALSE;
	
	        if (opt.panBack === UNDEFINED) {
	            opt.panBack = config.type === 'app';
	        }
	
	        if (simpleShow) {
	            opt.distance = horizontal ? origin.rootWidth : origin.rootHeight;
	        }
	        realDistance = orientationNum * opt.distance;
	
	        if (!config.animate) {
	            opt.duration = 0;
	        }
	
	        if (simpleShow) {
	            curQueue = [];
	            startCss.width = '100%';
	            startCss.height = '100%';
	        } else {
	            if (!queue[opt.position]) {
	                queue[opt.position] = [];
	            }
	            curQueue = queue[opt.position];
	            startCss[horizontal ? 'height' : 'width'] = '100%';
	        }
	
	        if (opt.panBack && simpleShow && (opt.position === 'right' || opt.position === 'left')) {
	
	            var checkMove = function (e) {
	                if (~e.directions.indexOf(opt.position)) {
	                    return (e.clientX - e.offsetX < MIN_GAP);
	                }
	                return FALSE;
	            };
	
	            var executePan = function(e) {
	                if (panMove) {
	                    _css(view.root, getTranslate3dStyle(e.offsetX, 0, 0));
	                } else if (!panStart) {
	                    panStart = TRUE;
	                    panMove = checkMove(e);
	                }
	            };
	
	            var executePanEnd = function (e) {
	                if (panMove) {
	                    panMove = FALSE;
	                    if (Math.abs(e.offsetX) > Math.abs(opt.distance) / 2) {
	                        view.hide();
	                    } else {
	                        _animate(view.root, getTranslate3dStyle(0, 0, 0), opt.duration / 2).done();
	                    }
	                }
	                panStart = FALSE;
	            };
	
	            view.on('show', function () {
	                _addEvent(view.root, 'pan', executePan);
	                _addEvent(view.root, 'panend', executePanEnd);
	            });
	
	            view.on('hide', function () {
	                _removeEvent(view.root, 'pan', executePan);
	                _removeEvent(view.root, 'panend', executePanEnd);
	            });
	
	            view.on('rendered', function () {
	                var div = doc.createElement('div');
	                div.className = "touch-opacity";
	                _css(div, {
	                    position: 'absolute',
	                    zIndex: '9999',
	                    width: getSizeValue(MIN_GAP),
	                    height: '100%',
	                    backgroundColor: 'rgba(255, 255, 255, 0)'
	                });
	
	                _css(div, opt.position === 'right' ? 'left' : 'right', '0');
	
	                _addClass(view.root, 'shadow');
	                view.root.appendChild(div);
	            });
	        }
	
	        view.on('loaded', function () {
	            if (!opt.distance) {
	                opt.distance = _size(view.root)[horizontal ? 'width' : 'height'];
	            }
	            if (simpleShow) {
	                if (transType === 3) {
	                    if (opt.position === 'bottom') {
	                        startCss.top = getSizeValue(origin.rootHeight);
	                    } else {
	                        startCss[opt.position] = getSizeValue(-opt.distance);
	                    }
	                } else {
	                    if (opt.position === 'bottom') {
	                        startCss.top = getSizeValue(origin.rootHeight - opt.distance);
	                    } else {
	                        startCss[opt.position] = getSizeValue(0);
	                    }
	                    _extend(startCss, horizontal ? getTranslate3dStyle(-orientationNum * opt.distance, 0, 0) : getTranslate3dStyle(0, -orientationNum * opt.distance, 0));
	                }
	            } else {
	                if (opt.position !== 'bottom') {
	                    startCss[opt.position] = getSizeValue(-opt.distance);
	                } else {
	                    startCss.top = getSizeValue(origin.rootHeight);
	                }
	            }
	            _css(view.root, startCss);
	        });
	
	        commonHandle('moveEnter', view, opt);
	
	        view.show = function (preventAnimate) {
	            _blur();
	            if (!moving) {
	                moving = TRUE;
	                simpleMoving = TRUE;
	                var curIndex = findViewIndex(curQueue, view);
	                if (~curIndex) {
	                    animateQueue(curQueue, curIndex, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
	                        curQueue.splice(0, curIndex).forEach(function (item) {
	                            item.view.trigger('hide');
	                        });
	                        moving = FALSE;
	                        simpleMoving = FALSE;
	                        view.trigger('refresh');
	                    });
	                } else {
	                    view.once('completed', function () {
	                        resetDisplay(view.root);
	                        resetVisibility(view.root);
	                        view.trigger('beforeShow');
	                        curQueue.unshift({
	                            view: view,
	                            distance: simpleShow ? 0 : realDistance,
	                            translate: simpleShow ? -realDistance : 0
	                        });
	                        _delay(function() {
	                            animateQueue(curQueue, 0, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal, view.root).done(function () {
	                                moving = FALSE;
	                                simpleMoving = FALSE;
	                                _removeStyle(view.root, 'transform');
	                                view.trigger('show');
	                            });
	                        });
	                    });
	                    view.renderTo(QApp.root);
	                }
	            }
	            return view;
	        };
	
	        view.hide = function (preventAnimate) {
	            if ((!moving || (simpleShow && !simpleMoving)) && view.isShow) {
	                moving = TRUE;
	                var curIndex = findViewIndex(curQueue, view);
	                animateQueue(curQueue, curIndex + 1, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
	                    curQueue.splice(0, curIndex + 1).forEach(function (item) {
	                        item.view.trigger('hide');
	                    });
	                    moving = FALSE;
	                });
	            }
	            return view;
	        };
	
	        view.on('destroy', function () {
	            startCss = NULL;
	            curQueue = NULL;
	            view = NULL;
	        });
	
	        return {
	            setOption: function (newOpt) {
	                opt = _extend({}, DEFAULT_OPT, newOpt);
	            }
	        };
	    });
	})();

})();