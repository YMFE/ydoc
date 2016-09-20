
;(function(__context){
    var module = {
        id : "5fce9db6abe7bcb2229ca3415163c973" ,
        filename : "qapp.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

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
	                    //WARN 'Plugin "' + name + '" already exist.'
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
	
	        //INFO '[Module] 新建模块', me.name, '标签列表', me.tagList
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
	
	            //INFO '[Module] 切换标签', tag
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
	
	        //INFO '[View] 开始初始化视图', me.name
	        initialize(me);
	        //INFO '[View] 开始绑定事件', me.name
	        bindEvents(me);
	        //INFO '[View] 开始处理模块', me.name
	        handleModule(me, getViewIndex(me.name));
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
	            //INFO '[View] 视图', me.name, '事件派发', args
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
	            //INFO '[View] 视图', me.name, '事件通知', args
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
	            //INFO '[View] 销毁视图:', this.name
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
	                //INFO '[ViewQueue] 增加视图', name, '配置', options, '是否从底部渲染', !!atBottom
	                name = fixName(name);
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
	            //INFO '[History] 开始初始化History模块, 使用Hash:', useHash, '当前Hash：', curHash
	            if (useHash) {
	                hashSupport = Config.hashSupport;
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
	                        _delay(function () {
	                            History.start(flag);
	                        }, 100);
	                        return;
	                    } else {
	                        //INFO '[History] 显示主页'
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
	            //INFO '[History] 刷新Hash参数, 视图:', info.view, '当前参数', info.query, '新参数', obj
	            info.query = _extend(info.query, obj);
	            setInfo(info, TRUE);
	        },
	        back: function (num, param) {
	            //INFO '[History] 历史回退, 回退级数', num, '参数', param
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
	            //INFO '[History] 回退到首页'
	            History.back(useHash ? historyIndex : (virtualHistory.length - 1), param);
	        },
	        exit: function() {
	            //INFO '[History] 退出应用'
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
	                //WARN '使用路由打开，不建议用 complete/onComplete 方式，建议用 receiveData 事件，和 native 贴近'
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
	            //INFO '[Router] 历史纪录事件，类型为：', data.type
	            switch (type) {
	                case 'init':
	                    if (Config.autoInit) {
	                        //INFO '[Router] 初始化视图：', info.view
	                        $viewQueue.add(info.view, {
	                            param: info.query
	                        }, TRUE, function (view) {
	                            reset(view);
	                            eventManager.trigger(type, view);
	                        });
	                    }
	                    break;
	                case 'forward':
	                    //INFO '[Router] 打开视图：', info.view
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

    })( module.exports , module , __context );
    __context.____MODULES[ "5fce9db6abe7bcb2229ca3415163c973" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "bd2141162d398feaa2ba14dc245d2bba" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    (function() {
    var _ = QApp.util;

    var DEFAULT_OPT = {
        tag: 'action-type',
        eventType: 'tap'
    };

    QApp.addPlugin('delegated', DEFAULT_OPT, function (view, options, config) {

        view.on('loaded', function () {
            var delegatedEvent = view.delegatedEvent = _.delegatedEvent(view.root, [], options.tag);

            if (view.options.bindActions) {
                _.each(view.options.bindActions, function(key, process) {
                    var ae = key.split(':'),
                        action = ae[0],
                        eventType = ae[1] || options.eventType;

                    if (typeof process === 'string') process = view[process];

                    if (_.isFunction(process)) {
                        delegatedEvent.add(action, eventType, function (e, data) {
                            return process.call(view, e, data);
                        });
                    }
                });
            }

            view.bind = function (action, eventType, process) {
                if (_.isFunction(eventType)) {
                    process = eventType;
                    eventType = options.eventType;
                }
                if (_.isFunction(process)) {
                    delegatedEvent.add(action, eventType, function (e, data) {
                        return process.call(view, e, data);
                    });
                }
            };

            view.fireAction = delegatedEvent.fireAction;

        });

        view.on('destroy', function () {
            if (view.delegatedEvent && _.isFunction(view.delegatedEvent.destroy)) {
                view.delegatedEvent.destroy();
            }
            view.delegatedEvent = null;
            view.bind = null;
        });

    });
})();


    })( module.exports , module , __context );
    __context.____MODULES[ "bd2141162d398feaa2ba14dc245d2bba" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "26b98c1301d1984de2f2518d5205693f" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * @author sharon.li<xuan.li@qunar.com>
 */

window.Kami = window.Kami || {};
window.QApp.Kami = window.Kami;
window.kamiData = window.kamiData || {};
var QApp = window.QApp,
    _ = QApp.util;

var KamiAdapterFactory = _.KamiAdapterFactory = (function () {

    var defaultOptionsList = {};

    function setDefaultOptions(name, defaultOptions) {

        if (null == name) {
            return;
        } else {
            defaultOptionsList[name] = defaultOptions;
        }
    }


    function register(name, Clazz, defaultOptions) {
        if (!name && !_.isString(name)) {
            console.error('invalid param: name is must be parse and!!!');
            return;
        }
        //alert and confirm tips is singleton, so is plainObject;
        if (!Clazz && (!_.isFunction(Clazz) || !_.isPlainObject(Clazz))) {
            console.error('invalid param: name is must be parse and!!!');
            return;
        }

        if (!defaultOptionsList[name]) {
            defaultOptionsList[name] = {};
        }

        if (_.isPlainObject(defaultOptions)) {

            _.extend(defaultOptionsList[name], defaultOptions);
        }

        //是否是单例组件
        var isSingletonComponent = ['alert','confirm','tips','loading'].indexOf(name) > -1;


        //normal kami widget like select and so on
        if (!isSingletonComponent) {

            QApp.addWidget(name, function (element, opt, view) {
                //处理opt
                opt = opt || {};

                var widgetInstance = null;

                var defaultOpt = defaultOptionsList[name] || {};

                //当前view里的参数
                var viewOptions = {};

                //全局kamiData里的参数
                var kamiDataOptions = {};

                //特殊处理一下window.kamiData中的传参
                //为了兼容老版本的adapter里有通过kamiData传参处理
                var kamiData = window.kamiData;

                for (var key in opt) {
                    if (opt.hasOwnProperty(key)) {
                        var optValue = opt[key];
                        if (!kamiData.hasOwnProperty(optValue)) {
                            continue;
                        }
                        var kamiDataProperty = kamiData[optValue];
                        if (_.isFunction(kamiDataProperty)) {

                            kamiDataOptions[key] = (function () {
                                return function () {
                                    kamiDataProperty.apply(this, arguments);
                                };
                            }());
                        } else if (_.isPlainObject(kamiDataProperty)) {
                            kamiDataOptions[key] = _.extend(true, {}, kamiDataProperty);
                        } else if (_.isArrray(kamiDataProperty)) {
                            kamiDataOptions[key] = kamiDataProperty.slice(0);
                        } else {
                            //do Nothing
                            continue;
                        }
                    }
                }



                //老本版的QApp里面只有是html的节点才有可能有view
                //showWidget的时候是不会有view的
                //所以viewOptions只在有view的情况下才会去获取view的options
                //默认viewOptions是空数组
                if (view) {

                    //如果是从view的节点中创建的，并且存在element
                    //那么将element作为组件的容器
                    element && (viewOptions['container'] = element);

                    //需要在show里面可能会需要使用组件，所以在beforeShow的时候将组件初始化
                    //组件的选项在ready里面写
                    view.on('beforeShow', function () {
                        //特殊处理一下view的传参
                        //处理view的options，当通过html节点创建一个组件时,例如:
                        //<div class="" qapp-widget="switch" data-switch-id="isInvoice"
                        //  data-switch-value="0" data-switch-onchangevalue="onInvoiceChange">
                        //</div>
                        for (var key in opt) {

                            //过滤param, opt和view都默认带param
                            if ('param' !== key && opt.hasOwnProperty(key)) {

                                var optValue =  opt[key];


                                if (!view.hasOwnProperty(optValue)) {
                                    continue;
                                }

                                var viewProperty = view[optValue];
                                if (_.isFunction(viewProperty)) {

                                    viewOptions[key] = (function () {
                                        return function () {
                                            viewProperty.apply(this, arguments);
                                        };
                                    }());
                                } else if (_.isPlainObject(viewProperty)) {
                                    viewOptions[key] = _.extend(true, {}, viewProperty);
                                } else if (_.isArray(viewProperty)) {
                                    viewOptions[key] = viewProperty.slice(0);
                                } else {
                                    //do Nothing
                                    continue;
                                }
                            }
                        }
                        widgetInstance = _createInstance();
                        var widgetId = opt.id || 'widgets_' + setTimeout(1);
                        view.widgets[widgetId] = widgetInstance;

                    });
                    view.on('destroy', function () {
                        if (widgetInstance && widgetInstance.destroy) {
                            widgetInstance.destroy();
                            widgetInstance = null;
                        }
                    });
                }
                else {
                    widgetInstance = _createInstance();
                    return widgetInstance;
                }

                /**
                 * 创建私有的实例
                 * @return {Kami} 返回Kami实例
                 */
                function _createInstance() {

                    //get instance of clazz
                    //options的传质的优先级是
                    //1.view的options优先级最高
                    //2.window的kamiData
                    //3.节点上的options
                    //4.default默认的options
                    //
                    var _widgetInstance = new Clazz(
                        _.extend(
                            {},
                            defaultOpt,
                            opt,
                            kamiDataOptions,
                            viewOptions
                        )
                    );
                    //在QApp的Kami全局变量中，保存一份变量
                    QApp.Kami[name] = Clazz;
                    switch (name) {
                        case 'dialog':
                        case 'overlay':
                            _widgetInstance.show();
                            break;
                        default:
                            _widgetInstance.render();
                    }

                    return _widgetInstance;
                }

            });
        } else {
            //Kami 对 tip / alert / confirm / loading 提供了单例模式
            //使用 Alert.show
            var instance = QApp.Kami[name] = Clazz;
            QApp.addWidget(name, function (element, opt, view) {

                instance.show(opt);

                if (view) {
                    view.on('destroy', function () {
                        if (instance && instance.destroy) {
                            instance.destroy();
                            instance = null;
                        }
                    });
                }

                //showWidget的返回值
                return instance;
            });
        }

    }
    return {
        register: register,
        setDefaultOptions: setDefaultOptions
    };
}());
module.exports = KamiAdapterFactory;

    })( module.exports , module , __context );
    __context.____MODULES[ "26b98c1301d1984de2f2518d5205693f" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "08ea436ba00b2c3de0c3bcb11912e372" ,
        filename : "util.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /* Zepto v1.1.3-27-gb9328f1 - zepto event touch - zeptojs.com/license */
/**
 * kami定制化的zepto，对于事件
 * 
 * @type {[type]}
 */
var global = global || window;
window.Kami = window.Kami || {};
var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = []
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0], computedStyle = getComputedStyle(element, '')
        if(!element) return
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(isArray(property) ? property: [property], function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = document.documentElement.contains(parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()



;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // items in the collection might not be DOM elements
      if('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          if (touch && touch.el) {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
          }
          
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            if (touch && touch.el) {
              touch.el.trigger('swipe');
              touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            }
            // touch.el.trigger('swipe')
            // touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              
              if (!!!global.Kami.disableTapEvent) {

                var event = $.Event('tap')
                event.cancelTouch = cancelAll
                touch.el.trigger(event)
              }

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  // ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
  //   'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
  //   $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  // })
  ;['tap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)

;(function($){
  function detect(ua, platform){
    var os = this.os = {}, browser = this.browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
      browser.safari = true
      if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
    (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent, navigator.platform)
  // make available to unit tests
  $.__detect = detect

})(Zepto)

module.exports = Zepto;

    })( module.exports , module , __context );
    __context.____MODULES[ "08ea436ba00b2c3de0c3bcb11912e372" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "897499f6c44f901ecc6fd2b84da5b878" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['08ea436ba00b2c3de0c3bcb11912e372']

    })( module.exports , module , __context );
    __context.____MODULES[ "897499f6c44f901ecc6fd2b84da5b878" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d2b65d2151464ba0c57479ffffee2ea9" ,
        filename : "class.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * [Kami description]
 * 所以由Kami.create 或者由 Kami.extend创建的类要想用到父类的方法,需要通过
 * xxxClass.superClass.xxxmethod.apply| call(this, options)
 * 来调用
 * @category core
 */

(function () {

    'use strict';

    var utils = {};

    function Kami(options) {
        
        //由于this可能为superClass.call而来，所以this对象未必是Kami类型
        //
        if (!(this instanceof Kami) && 
            utils.isFunction(options)) {
            return utils.classify(options);
        }
        
    }

    
    /**
     * create a new Class, the base for Kami.extend and you can
     * var Dialog = Kami.create({
     *     Extends: 'Popup',
     *     Mixins: 'Position',
     *     initialize: function() {
     *         Dialog.superClass.initialize.apply(this, arguments);
     *     }
     * })
     * Kami.create(Object)
     * Kami.create(Object, options)
     * Kami.create(Function, Object)
     * @param  {Function| Object}   superClass  the parent of the created class
     * @param  {Object}             options     the options to overide or extend to 
     * @return {Class}              
     */
    Kami.create = function (superClass, options) {
        

        if (utils.isObject(superClass) && 
            superClass != null) {

            if (options && utils.isObject(options)) {
                utils.extend(superClass, options);
            }
            options = superClass;
            superClass = null;
        }
        else if (utils.isFunction(superClass)) {
            options = options || {};
            options.Extends = superClass;
        }
        else {
            throw ('invalid type of superClass to create class');
        }

        superClass = superClass || options.Extends || Kami;

        function subClass() {
            var arg = [].slice.call(arguments);
            // debugger
            superClass.apply(this, arg);
            // debugger
            if (this.constructor === subClass && utils.isFunction(this.initialize)) {
                this.initialize.apply(this, arg);
            }
        }
        if (subClass !== Kami) {
            utils.extend(subClass, superClass);
        }
        // debugger
        utils.implement.call(subClass, options);

        // subClass.superClass = superClass.prototype;
        // subClass.prototype.constructor = subClass;

        return utils.classify(subClass);
    };

    /**
     * 使用Extend的方式来拓展对象
     * 
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    Kami.extend = function (options) {
        
        // debugger
        options || (options = {});
        options.Extends = this;

        return Kami.create(options);
    };
    

    var TYPES = ['Function', 'Object', 'Array'];
    TYPES.forEach(function (type, i) {

        utils['is' + type] = function (o)  {
            return utils.toString.call(o) === '[object ' + type + ']';
        };
    });
    Array.prototype.forEach = [].forEach ? [].forEach:
    function (fn, scope) {
        for (var i = 0; i < this.length; i++) {
            fn.call(scope, this[i], i);
        }
    };

    /**
     * 除了Extend和Mixin方法以外，其他的options里的选项都拷贝到
     * subClass.prototype上
     * @param  {Object} options 选项
     */
    utils.implement = function (options) {
        var StaticMethods = Kami.StaticMethods;

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (StaticMethods.hasOwnProperty(key)) {
                    StaticMethods[key].call(this, options[key]);
                }
                else {
                    this.prototype[key] = options[key];
                }
            }
        }
    };
    /**
     * 为fun添加必要的方法extend和mixin
     * 
     * @param  {[type]} fun [description]
     * @return {[type]}     [description]
     */
    utils.classify = function (fun) {
        fun.extend = Kami.extend;
        // fun.implement = utils.implement;
        return fun;
    };
    


    utils.createObject = function (proto) {
        if (Object.create) {
            return Object.create(proto);//es5
        }
        else if (Object.__proto__) {//firefox
            return {
                __proto__: proto
            };
        }
        else {
            var Ctor = function () {};
            Ctor.prototype = proto;
            return new Ctor();
        }
    };
    /**
     * 深度复制source的属性和值到target中，如果deep则递归复制
     * @param  {[type]} target [description]
     * @param  {[type]} source [description]
     * @param  {[type]} deep   [description]
     * @return {[type]}        [description]
     */
    utils.extend = function (target, source, deep) {

        for (var key in source) {
            if (source.hasOwnProperty(key) && 
                key !== 'utils') 
            { //skip Kami.utils
                if (deep && utils.isObject(source[key])) {
                    utils.extend(target[key], source[key], deep);
                }
                else {
                    if (key  !== 'prototype') {
                        target[key] = source[key];
                    }
                    
                }
            }
        }
    };
    utils.toString = Object.prototype.toString;

    /**
     * Kami static methods t
     */

    
    Kami.StaticMethods = {
        /**
         * 需要mixin的对象，数组或者单个对象，由于采用extend的方式
         * 来实现多个对象的混入，所以如果mixin的对象本身有重复的key那么
         * 遵循相同属性后边的object覆盖前边对象
         * @param  {Array | Object} superClass 父类
         */
        'Mixins': function (superClass) {

            if (!utils.isArray(superClass)) {
                superClass = [superClass];
            }
            for (var i = 0; i < superClass.length; i++) {
                var sp = superClass[i];
                //普通对象没有prototype 所以只能赋值sp本身
                utils.extend(this.prototype, sp.prototype || sp);
            }
        },
        /**
         * 通过原型链的形式来实现集成
         * 只能是唯一的，不能实现多重继承
         * @param  {Function} superClass 父类
         */
        'Extends':  function (superClass) {
            // debugger
            var superClassInstance = utils.createObject(superClass.prototype);
            utils.extend(superClassInstance, this.prototype);
            this.prototype = superClassInstance;
            this.prototype.constructor = this;
            this.superClass = superClass.prototype;
        }
        // ,
        // 'Statics': function (superClass) {
        //     for (var key in superClass) {
        //         if (superClass.hasOwnProperty(key)) {
        //             this[key] = superClass[key];
        //         }
        //     }
        // }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Kami;
    }


}());







    })( module.exports , module , __context );
    __context.____MODULES[ "d2b65d2151464ba0c57479ffffee2ea9" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2aa616cd8537012234a4f75239bbb891" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['d2b65d2151464ba0c57479ffffee2ea9'];


    })( module.exports , module , __context );
    __context.____MODULES[ "2aa616cd8537012234a4f75239bbb891" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ff21b565e1a890a59a1ce1bf37e9a6de" ,
        filename : "event.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    // Events
// -----------------
// 参考
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js

'use strict';

var eventSplitter = /\s+/;


//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
function Events() {
}



Events.prototype.on = function (events, callback, context) {
    var cache, event, list;
    if (!callback) {
        return this;
    }

    cache = this._events || (this._events = {});
    events = events.split(eventSplitter);//多个事件同时挂载，用空格分开'change test'

    while (event = events.shift()) {
        list = cache[event] || (cache[event] = []);
        var tmp = {
            handler: callback,
            context: context
        };
        list.push(tmp);
    }

    return this;
};

Events.prototype.once = function (events, callback, context) {
    var me = this;
    var cb = function () {
        me.off(events, cb);
        callback.apply(context || me, arguments);
    };
    return this.on(events, cb, context);
};


Events.prototype.off = function (events, callback, context) {
    var cache, event, list, i;

    // No events, or removing *all* events.
    if (!(cache = this._events)) {
        return this;
    }
    if (!(events || callback || context)) {
        delete this._events;
        return this;
    }

    events = events ? events.split(eventSplitter) : keys(cache);

  // Loop through the callback list, splicing where appropriate.
    while (event = events.shift()) {
        list = cache[event];
        if (!list) {
            continue;
        }

        if (!(callback || context)) {
            delete cache[event];
            continue;
        }

    
        for (i = list.length - 1 ; i >= 0; i--) {
            var tmp = list[i];
            if (!(callback && tmp.handler !== callback ||
                context && tmp.context !== context)) {
                list.splice(i, 1);
            }
        }
    }

    return this;
};

Events.prototype.trigger = function (events) {
    var cache, event, all, list, i, len, rest = [], args, returned = true;
    if (!(cache = this._events)) return this;

    events = events.split(eventSplitter);

  
    rest = Array.prototype.splice.call(arguments, 1);



    while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (all = cache.all) {
            all = all.slice();
        }
        if (list = cache[event]) {
            list = list.slice();
        }

        // Execute event callbacks
        if (event !== 'all') {
            returned = triggerEvents(list, rest, this) && returned;
        }

    
    }

    return returned;
};

// Helpers
// get Enumberable property of Object

var keys = Object.keys;

if (!keys) {
    keys = function (o) {
        var result = [];

        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                result.push(name);
            }
        }
        return result;
    };
}


// Execute callbacks
function triggerEvents(list, args, context) {
    var pass = true;

    if (list) {
        var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2];
    
    // http://blog.csdn.net/zhengyinhui100/article/details/7837127
        

        switch (args.length) {
            case 0: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context || context) !== false && pass;
                }
                break;
            case 1: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context  || context, a1) !== false && pass;
                }
                break;
            case 2: for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context  || context, a1, a2) !== false && pass;
                }
                break;
            case 3: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.call(tmp.context || context, a1, a2, a3) !== false && pass;
                } 
                break;
            default: 
                for (; i < l; i ++) {
                    var tmp = list[i];
                    pass = tmp.handler.apply(tmp.context  || context, args) !== false && pass;
                } 
                break;
        }
    }
    // trigger will return false if one of the callbacks return false
    return pass;
}
module.exports = Events;

    })( module.exports , module , __context );
    __context.____MODULES[ "ff21b565e1a890a59a1ce1bf37e9a6de" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "4120380dba6629de1d4e31134cbbd9e4" ,
        filename : "attribute.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * @namespace Attribute
 * kami中属性的处理对象mixin到base中
 * @name {Object} Attribute
 * @private
 */
;(function () {
    'use strict';
    var Attribute = {
        /**
         * 合并和解析参数
         * 
         * @function initAttrs
         * @memberOf  Attribute
         * @private
         * @param  {Object} config 配置项
         */
        initAttrs : function (config) {
            
            var options = this.options = {};

            mergeInheritedOptions(options, this);

            if (config) {
                
                merge(options, config);
                
            }
            
            parseEventsFromOptions(this, options);

        },
        /**
         * 获取options中的参数
         * @function get
         * @memberOf  Attribute
         * @version  0.0.1
         * @param  {String} key key的名字
         * @return {Object}     对应的key的值
         * 
         */
        get: function (key) {
            var options = this.options;
            
            var value = null;
            if (options.hasOwnProperty(key)) {
                value = options[key];
            }
            
            return value;

        },
        /**
         * 设置options中的参数
         * @function set
         * @memberOf  Attribute
         * @param  {String} key key的名字
         * @param {Object}  value   对应的key的值
         */
        set: function (key, value) {
            //【TODO setter和getter】
            var options = this.options;
            if (options.hasOwnProperty(key)) {
                options[key] = value;
            }
        }
        
    };

    /**
     * 暴露当前接口
     */
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Attribute;
    } 

    var toString = Object.prototype.toString;
    


    var isArray = Array.isArray || function (val) {
        return toString.call(val) === '[object Array]';
    };

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    function isWindow(o) {
        return o != null && o == o.window;
    }

    function isPlainObject(o) {

        if (!o || toString.call(o) !== '[object Object]' ||
            o.nodeType || isWindow(o)) {
            return false;
        }
        else {
            return true;
        }

    }

    function isEmptyObject(o) {
        if (!o || toString.call(o) !== '[object Object]' ||
          o.nodeType || isWindow(o) || !o.hasOwnProperty) {
            return false;
        }

        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    

    function merge(receiver, supplier) {
        var key, value;
        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                value = supplier[key];
                // 只 clone 数组和 plain object，其他的保持不变
                if (isArray(value)) {
                    value = value.slice();
                } else if (isPlainObject(value)) {
                    var prev = receiver[key];
                    isPlainObject(prev) || (prev = {});
                    value = merge(prev, value);
                }
                receiver[key] = value;
            }
        }
        return receiver;
    }

    function mergeInheritedOptions(options, instance) {
        // debugger
        var inherited = [];
        // debugger
        var proto = instance.constructor.prototype;
        //在类的创建时，已经将options拷贝到subClass.prototype上
        //
        while (proto) {
            // 不要拿到 prototype 上的
            if (!proto.hasOwnProperty('options')) {
                proto.options = {};
            }
            // 为空时不添加
            if (!isEmptyObject(proto.options)) {
                inherited.unshift(proto.options);
            }

            // 向上回溯一级
            proto = proto.constructor.superClass;

            
        }

        // Merge and clone default values to instance.
        while (inherited.length) {
            var item = inherited.shift();
            merge(options, item);
        }
 
    }



    var EVENT_PATTERN = /^(on)([a-zA-Z]*)$/;
    var EVENT_NAME_PATTERN = /^([cC]hange)?([a-zA-Z]*)/;

    function parseEventsFromOptions(host, options) {
        // debugger
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var value, m;
                if (options[key] != null) {
                    value = options[key].value || options[key];
                }
                
                // debugger
                if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    // this.on('show', value)
                    //this.on('change:title', value);
                    host[m[1]](getEventName(m[2]), value);
                    delete options[key];
                }
            }
        }
    }

    // Converts `Show` to `show` and `changeTitle` to `change:title`
    function getEventName(name) {
        //[TODO] 优化暴露事件
        // debugger
        // var m = name.match(EVENT_NAME_PATTERN);
        // var ret = m[1] ? 'change:' : '';
        // ret += m[2].toLowerCase();
        // return ret;
        name = name || '';
        return name.toLowerCase();
    }

    return Attribute;
    
}());

    })( module.exports , module , __context );
    __context.____MODULES[ "4120380dba6629de1d4e31134cbbd9e4" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "abd579a8b2b24e29a951c5f179d83f8d" ,
        filename : "base.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * @class Base
 * 工具类组件的基类
 * @constructor
 * @mixin Attribute,Event
 * @category core
 */

;(function () {
    'use strict';

    var Kami =__context.____MODULES['2aa616cd8537012234a4f75239bbb891'];
    var Event =__context.____MODULES['ff21b565e1a890a59a1ce1bf37e9a6de'];
    
    var Attribute =__context.____MODULES['4120380dba6629de1d4e31134cbbd9e4'];
    
    var Base = Kami.create({
        Mixins: [Event, Attribute],

        /**
         * 初始化Kami组件
         * @param  {Object} config 用户传进来的选项
         * @memberOf  Base
         * @function initialize
         */
        initialize: function (config) {
           
            this.initAttrs(config);
        },
        /**
         * 销毁组件
         * @memberOf  Base
         * @function destroy
         */
        destroy: function () {
            this.off();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            this.destroy = function () {};
            this.isDestroy = true;
        }

    });
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Base;
    }
    
}());





    })( module.exports , module , __context );
    __context.____MODULES[ "abd579a8b2b24e29a951c5f179d83f8d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ba335bae023b1e48c033d17d911cf60a" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['abd579a8b2b24e29a951c5f179d83f8d'];


    })( module.exports , module , __context );
    __context.____MODULES[ "ba335bae023b1e48c033d17d911cf60a" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "55edef3ca75bcd9fc263a892f982352f" ,
        filename : "widget.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Kami非工具类组件的基类，提供了组件的生命周期，初始化，渲染，销毁等
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Widget
 * @constructor
 * @extends Base
 * @category core
 * @required yo-base, yo-ddd
 * 
 */
/**
 * @quote
 * 关于resize的处理，当窗口resize后
 * 需要重新计算与节点属性相关的属性，默认调用组件的resize方法
 * 继承与widget或者widget子类的组件，需要实现自己的resize方法
 * 
 * 关于组合组件，例如组件A由 A1, A2组成，为了避免A1 A2的resize和
 * A出现问题，推荐在A中实现resize，而A1,A2的实例将resizable
 * 设置为false
 * @return {[type]} [description]
 */

(function () {

    'use strict';
    

    var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
    
    var Base =__context.____MODULES['ba335bae023b1e48c033d17d911cf60a'];
    
    
    window.Kami = window.Kami || {};
    window.Kami._widgetCache = {};

    
    var EVENT_PREFIX = 'delegate-event-{cid}:';
    var DATA_WIDGET_CID = 'data-widget-cid';
    var DELEGATE_EVENT_NS = '.delegate-events-';
    var $PARENT_NODE = document.body;
    var Widget = Base.extend({
        /**
         * @property {HTMLElement| String} container @require组件的容器
         * @property {HTMLElement} parentNode 父容器，默认为body
         * @property {String} template 模板字符串
         * @property {String} skin 默认的皮肤
         * @property {String} extraClass 组件根节点添加的额外样式
         * @property {Boolean} resizable 组件是否会根据响应窗口变化事件，默认为true
         * @memberOf Widget
         */
        options: {
            //当前组件的类型
            type: 'widget',

            container: null,

            // // 默认数据模型
            // datasource: null,

            // 组件的默认父节点
            parentNode: document.body,

            template: null,

            //组件界别的主题
            skin: 'ui',

            //组件提供的额外样式选项
            extraClass: '',

            // attr: {},
            // yo: false,

            events: {
                // 'eventName selector' : function() {}
            },
            resizable: true //是否允许监听窗口resize
        },
        /**
         * 获取组件样式命名空间的前缀
         * @function  getClassNamePrefix
         * @memberOf  Widget
         * @private
         * @return {String} 返回组件命名空间前缀
         */
        getClassNamePrefix : function () {
            

            var uiPrefix = window.Kami.theme || this.get('skin');
            uiPrefix += '-';


            if (!this.classNamePrefix) {
                var options = this.options;
                if (!this.get('className')) {
                    var type = options.type || 'widget';
                    this.classNamePrefix =  uiPrefix + type.toLowerCase();
                }
                else {
                    this.classNamePrefix = this.get('className').toString();
                }
            }
            return this.classNamePrefix;
        },
        /**
         * 获得组件的样式命名空间
         * @function  getClassName
         * @memberOf  Widget
         * @param  {String} name 样式名称
         * @return {String}   组件的样式命名空间
         */
        getClassName: function (name) {
            /**
             * @type {[type]}
             */
            if (!this.classNamePrefix) {
                this.getClassNamePrefix();
            }
            if (name) {
                name = '-' + name;
            }
            else {
                name = '';
            }
            return this.classNamePrefix + name;
        },

        /**
         * 获得组件根节点
         * 获得组件的样式命名空间
         * @function  _getMainElement
         * @memberOf  Widget
         * @private
         * @param  {Object} config 配置项
         */
        _getMainElement: function (config) {
            this.widgetEl = null;
            var container = this.get('container');

            if (this.get('template')) {
                this.fromTemplate = true;
                try {
                    this.widgetEl = $(this.parseTemplate(this.get('template')));
                    //获得组件的容器
                    container = container || $PARENT_NODE;
                    container = $(container);
                }
                catch (e) {
                    throw new Error('template is not valid');
                }
            }
            else {
                //没传模板，只有容器，仅仅兼容在页面上自己写组件HTML的形式
                container = container || $PARENT_NODE;
                container = $(container);

                if (!container.length) { 
                    console.log('type of widget is ' + this.options.type);
                    throw new Error('container is not valid');
                } else {
                    //获得组件的容器
                    this.widgetEl = $(container[0].firstElementChild);
                }
            }
            
            this.container = $(container);
        },
        
        /**
         * 子类可以覆盖如何处理tpl
         * @function parseTemplate
         * @memberOf  Widget
         * @param  {String} tpl 模板字符串
         * @return {String}     解析后的模板字符串
         */
        parseTemplate : function (tpl) {
            return tpl || '';
        },
        
        /**
         * 组件初始化方法,initialize是new组件时调用的，而init是给子组件暴露的方法
         * 可以在该方法中绑定事件或者处理其他逻辑
         * @function init
         * @private
         * @memberOf  Widget
         */
        init : function () {

        },
        /**
         * 对参数进行初始化，内部调用Base的initialize方法来
         * 进行参数初始化
         * @function initialize
         * @private
         * @memberOf  Widget
         * @param  {Object} config  配置项
         * @return {Kami}        返回当前组件的实例
         */
        initialize: function (config) {
            if (!this._isInit) {
               
                

                this.cid = uniqueCid();

                this._widgetMap = this.get('_widgetMap') || {};


                // debugger
                Widget.superClass.initialize.call(this, config);

                //初始化样式和样式名称前缀
                this.getClassNamePrefix();

                

                //启动UI
                //init方法是对子类开发的接口，如果需要在new的时候进行初始化，那么可以覆盖这个方法
                //
                this.init();
                

                //初始化this.container 和 .this.widgetEl 对象
                //
            
                this._getMainElement(config);

                this.delegateEvents();
                
                //缓存UI
                this._cacheWidget();

                this._isInit = true;

                return this;

            }
            else {
                return this;
            }
            
        },
        /**
         * 缓存当前组件
         * 进行参数初始化
         * @memberOf  Widget
         * @function _cacheWidget
         * @private
         */
        _cacheWidget: function () {
            var cid = this.cid;
            Kami._widgetCache[this.cid] = this;
            this.widgetEl.attr(DATA_WIDGET_CID, cid);
            // debugger

        },
        /**
         * 渲染组件到页面中
         * 并且出发事件，方便用户处理在组件渲染后的行为
         * @function render
         * @memberOf  Widget
         * @return {Kami} 返回当前组件实例
         */
        render: function () {
            
            if (!this._isRender) {
                
                 
                // 插入到文档流中
                if (this.fromTemplate) {
                    this.widgetEl.appendTo(this.container);
                }
                this._isRender = true;
                
                this.widgetEl.addClass(this.getClassName());
                var extraClass = this.get('extraClass') || '';
                if (extraClass) {
                    this.widgetEl.addClass(extraClass);
                }
                // this.__renderEvent();
            }
            
            return this;

        },
        /**
         * 空方法，需要子类自己去实现
         * @function resize
         * @memberOf  Widget
         */
        resize: function () {},
        /**
         * 不需要在代理到container的事件，解绑方法
         * 例如resize
         * @function __renderEvent
         * @memberOf  Widget
         * @private
         */
        __renderEvent: function () {

            var widget = this;
            
            
            widget.__resizeFun = function () {
            // debugger
                if (widget.__resizeTimer) {
                    clearTimeout(widget.__resizeTimer);
                }
                widget.__resizeTimer = setTimeout(function () {
                    // console.log('resize');
                    widget.resize();
                }, 200);
                
            };

            var resizable = !!this.get('resizable');
            if (resizable) {
                window.addEventListener('resize', widget.__resizeFun);
            }
        },
        /**
         * 不需要在代理到container的事件，解绑方法
         * 例如resize
         * @function __unrenderEvent
         * @memberOf  Widget
         * @private
         */
        __unrenderEvent: function () {

            var widget = this;
            var resizable = !!this.get('resizable');
            if (resizable) {
                window.removeEventListener('resize', widget.__resizeFun);
            }
        },
        
        /**
         * 注册事件代理
         * @function delegateEvents
         * @memberOf  Widget
         * @param  {HTMLElement} element 代理事件的节点
         * @param  {Object} events  事件对象
         * @param  {Function} handler 事件的处理方法
         * @return {Kami}        返回Kami组件
         */
        delegateEvents: function (element, events, handler) {
            // debugger
            if (arguments.length === 0) {
                events = this.get('events');
                element = this.widgetEl;
            }
            else if (arguments.length === 1) {
                events = element;
                element = this.widgetEl;
            }
            else if (arguments.length === 2) {
                handler = events;
                events = element;
                element = this.widgetEl;
            }
            else {
                element = element || this.widgetEl;
                this._delegateEvent = this._delegateEvent || [];
                this._delegateEvent.push(element);
            }
            
            // debugger
            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) {
                    continue;
                }
                //args:{type, selector}
                //type: tap.delegateeventtype{cid}
                var args = parseEventKey(key, this);
                var eventType = args.type;
                // console.log('widget:eventType=' + eventType);
                var selector = args.selector;

                
                (function (handler, widget) {
                    
                    //事件如果为字符串而非function则默认在this中查找
                    var callback = function (ev) {

                        if ($.isFunction(handler)) {
                            return handler.call(widget, ev, this);
                        } else {
                            
                            return widget[handler](ev, this);
                        }
                    };

                    if (selector) {
                        // console.log(element[0])
                        $(element).on(eventType, selector, callback);
                    } else {
                        $(element).on(eventType, callback);
                    }
                }(events[key], this));
            }

            // 绑定window resize handler
            this.__renderEvent();

            return this;
        },

        
        /**
         * 卸载事件代理
         * @function undelegateEvents
         * @memberOf  Widget
         * @param  {HTMLElement} element  需要卸载事件的节点
         * @param  {String} eventKey 需要卸载的事件名称
         * @return {Kami}        返回Kami组件
         */
        undelegateEvents: function (element, eventKey) {
            

            if (!eventKey) {
                eventKey = element;
                element = null;
            }
            // 卸载所有
            if (arguments.length === 0) {
                var type = DELEGATE_EVENT_NS + this.cid;
                
                this.widgetEl && this.widgetEl.off(type);
                // 卸载所有外部传入的 element
                if (this._delegateElements) {
                    for (var de in this._delegateEvent) {
                        if (!this._delegateEvent.hasOwnProperty(de)) continue;
                        this._delegateEvent[de].off(type);
                    }
                }
            } else {
                var args = parseEventKey(eventKey, this);
                // 卸载 this.widgetEl
                // .undelegateEvents(events)
                if (!element) {
                    this.widgetEl && this.widgetEl.off(args.type, args.selector);
                } else {
                    $(element).off(args.type, args.selector);
                }
            }

            // 绑定window resize handler
            this.__unrenderEvent();

            return this;
        },
        
        /**
         * 销毁组件
         * @function destroy
         * @memberOf  Widget
         */
        destroy: function () {
            this.undelegateEvents();
            delete Kami._widgetCache[this.cid];

            var widgetMap = this._widgetMap || {};
            for (var key in widgetMap) {
                if (widgetMap.hasOwnProperty(key)) {
                    var _widget = widgetMap[key];
                    if (_widget && _widget instanceof Widget) {
                        _widget.destroy && _widget.destroy();
                    }
                }
            }
            
            if (this.fromTemplate) {
                
                this.widgetEl.remove();
            }
            
            

            Widget.superClass.destroy.call(this);
            

            this.container = null;
            this.widgetEl = null;
            
        }


    });

    
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Widget;
    }

    $.isEmptyObject = function(obj) {
        return $.isPlainObject(obj) && (Object.keys(obj) === 0);
    };
    /**
     * 是否已经在document中
     * @param  {[type]}  el [description]
     * @return {Boolean}    [description]
     */
    function isInDocument (el) {
        if (el && !el.nodeName) {
            el = el[0];
        }
        return $.contains(document, el);
    }
    /**
     * handler is not function then skip it
     * @param  {[type]} events [description]
     * @return {[type]}        [description]
     */
    function parseEvent(events, widget) {
        var newEvent = [];
        for (var key in events) {
            if (!events.hasOwnProperty(key)) {
                continue;
            }
            var value = events[key];
            if ($.isFunction(value)) {
                var o  = {};
                var keyArr = key.split(/\s+/);
                o.type = EVENT_PREFIX.replace('{cid}', widget.cid) +  keyArr[0];
                o.selector = keyArr.length > 1 ? keyArr[1] : null;
                o.handler = value;
                newEvent.push(o);
            }

        }
        return newEvent;
    }
    function uniqueCid() {
        return 'widget-' + setTimeout('1');
    }
    //默认dom 绑定事件格式为'tap selector': function() {}
    //
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var INVALID_SELECTOR = 'INVALID_SELECTOR';

    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);
        //tap.delegateeventtype{cid}
        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;

        // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
        var selector = match[2] || undefined;

        return {
            type: eventType,
            selector: selector
        };
    }

    window.addEventListener('unload', function () {
        
        for (var key in Kami._widgetCache) {
            if (Kami._widgetCache.hasOwnProperty(key)) {
                var widget = Kami._widgetCache[key];
                widget && widget.destroy && widget.destroy();
                
            }
        }
    });

}());




    })( module.exports , module , __context );
    __context.____MODULES[ "55edef3ca75bcd9fc263a892f982352f" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "727699dca154f9ef72d5e879dadfb5a5" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['55edef3ca75bcd9fc263a892f982352f']

    })( module.exports , module , __context );
    __context.____MODULES[ "727699dca154f9ef72d5e879dadfb5a5" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "541bfb7b549627999e3defd0404b76bf" ,
        filename : "arttemplate.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */
 
!(function () {


/**
 * 模板引擎
 * @name    template
 * @param   {String}            模板名
 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
 */
var template = function (filename, content) {
    return typeof content === 'string'
    ?   compile(content, {
            filename: filename
        })
    :   renderFile(filename, content);
};


template.version = '3.0.0';


/**
 * 设置全局配置
 * @name    template.config
 * @param   {String}    名称
 * @param   {Any}       值
 */
template.config = function (name, value) {
    defaults[name] = value;
};



var defaults = template.defaults = {
    openTag: '{{#',    // 逻辑语法开始标签
    closeTag: '}}',   // 逻辑语法结束标签
    escape: true,     // 是否编码输出变量的 HTML 字符
    cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false,  // 是否压缩输出
    parser: null      // 自定义语法格式器 @see: template-syntax.js
};


var cacheStore = template.cache = {};


/**
 * 渲染模板
 * @name    template.render
 * @param   {String}    模板
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
template.render = function (source, options) {
    return compile(source, options);
};


/**
 * 渲染模板(根据模板名)
 * @name    template.render
 * @param   {String}    模板名
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
var renderFile = template.renderFile = function (filename, data) {
    var fn = template.get(filename) || showDebugInfo({
        filename: filename,
        name: 'Render Error',
        message: 'Template not found'
    });
    return data ? fn(data) : fn;
};


/**
 * 获取编译缓存（可由外部重写此方法）
 * @param   {String}    模板名
 * @param   {Function}  编译好的函数
 */
template.get = function (filename) {

    var cache;
    
    if (cacheStore[filename]) {
        // 使用内存缓存
        cache = cacheStore[filename];
    } else if (typeof document === 'object') {
        // 加载模板并编译
        var elem = document.getElementById(filename);
        
        if (elem) {
            var source = (elem.value || elem.innerHTML)
            .replace(/^\s*|\s*$/g, '');
            cache = compile(source, {
                filename: filename
            });
        }
        else {
            var source = filename
            .replace(/^\s*|\s*$/g, '').replace(/<!--[\s\S]*?-->/g, '');
            cache = compile(source, {
                templateStr: filename
            });
        }
    }

    return cache;
};


var toString = function (value, type) {

    if (typeof value !== 'string') {

        type = typeof value;
        if (type === 'number') {
            value += '';
        } else if (type === 'function') {
            value = toString(value.call(value));
        } else {
            value = '';
        }
    }

    return value;

};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


var each = function (data, callback) {
    var i, len;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};


var utils = template.utils = {

    $helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each
    
};/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
template.helper = function (name, helper) {
    helpers[name] = helper;
};

var helpers = template.helpers = utils.$helpers;




/**
 * 模板错误事件（可由外部重写此方法）
 * @name    template.onerror
 * @event
 */
template.onerror = function (e) {
    var message = 'Template Error\n\n';
    for (var name in e) {
        message += '<' + name + '>\n' + e[name] + '\n\n';
    }
    
    if (typeof console === 'object') {
        console.error(message);
    }
};


// 模板调试器
var showDebugInfo = function (e) {

    template.onerror(e);
    
    return function () {
        return '{Template Error}';
    };
};


/**
 * 编译模板
 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
 * @name    template.compile
 * @param   {String}    模板字符串
 * @param   {Object}    编译选项
 *
 *      - openTag       {String}
 *      - closeTag      {String}
 *      - filename      {String}
 *      - escape        {Boolean}
 *      - compress      {Boolean}
 *      - debug         {Boolean}
 *      - cache         {Boolean}
 *      - parser        {Function}
 *
 * @return  {Function}  渲染方法
 */
var compile = template.compile = function (source, options) {
    // 合并默认配置
    options = options || {};
    for (var name in defaults) {
        if (options[name] === undefined) {
            options[name] = defaults[name];
        }
    }


    var filename = options.filename;


    try {
        var Render = compiler(source, options);
        
    } catch (e) {
    
        e.filename = filename || 'anonymous';
        e.name = 'Syntax Error';

        return showDebugInfo(e);
        
    }
    
    
    // 对编译结果进行一次包装

    function render (data) {
        
        try {
            
            return new Render(data, filename) + '';
            
        } catch (e) {
            
            // 运行时出错后自动开启调试模式重新编译
            if (!options.debug) {
                options.debug = true;
                return compile(source, options)(data);
            }
            
            return showDebugInfo(e)();
            
        }
        
    }
    

    render.prototype = Render.prototype;
    render.toString = function () {
        return Render.toString();
    };


    if (filename && options.cache) {
        cacheStore[filename] = render;
    }

    
    return render;

};




// 数组迭代
var forEach = utils.$each;


// 静态分析模板变量
var KEYWORDS =
    // 关键字
    'break,case,catch,continue,debugger,default,delete,do,else,false'
    + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
    + ',throw,true,try,typeof,var,void,while,with'

    // 保留字
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
    + ',final,float,goto,implements,import,int,interface,long,native'
    + ',package,private,protected,public,short,static,super,synchronized'
    + ',throws,transient,volatile'

    // ECMA 5 - use strict
    + ',arguments,let,yield'

    + ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
var SPLIT_RE = /[^\w$]+/g;
var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
var BOUNDARY_RE = /^,+|,+$/g;
var SPLIT2_RE = /^$|,+/;


// 获取变量
function getVariable (code) {
    return code
    .replace(REMOVE_RE, '')
    .replace(SPLIT_RE, ',')
    .replace(KEYWORDS_RE, '')
    .replace(NUMBER_RE, '')
    .replace(BOUNDARY_RE, '')
    .split(SPLIT2_RE);
};


// 字符串转义
function stringify (code) {
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}


function compiler (source, options) {
    
    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape;
    

    
    var line = 1;
    var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};
    


    var isNewEngine = ''.trim;// '__proto__' in {}
    var replaces = isNewEngine
    ? ["$out='';", "$out+=", ";", "$out"]
    : ["$out=[];", "$out.push(", ");", "$out.join('')"];

    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";
          
    var print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var include = "function(filename,data){"
    +      "data=data||$data;"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    var headerCode = "'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");
    
    var mainCode = replaces[0];

    var footerCode = "return new String(" + replaces[3] + ");"
    
    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
        code = code.split(closeTag);
        
        var $0 = code[0];
        var $1 = code[1];
        
        // code: [html]
        if (code.length === 1) {
            
            mainCode += html($0);
         
        // code: [logic, html]
        } else {
            
            mainCode += logic($0);
            
            if ($1) {
                mainCode += html($1);
            }
        }
        

    });
    
    var code = headerCode + mainCode + footerCode;
    
    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){"
        +       "throw {"
        +           "filename:$filename,"
        +           "name:'Render Error',"
        +           "message:e.message,"
        +           "line:$line,"
        +           "source:" + stringify(source)
        +           ".split(/\\n/)[$line-1].replace(/^\\s+/,'')"
        +       "};"
        + "}";
    }
    
    
    
    try {
        
        
        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils;

        return Render;
        
    } catch (e) {
        e.temp = "function anonymous($data,$filename) {" + code + "}";
        throw e;
    }



    
    // 处理 HTML 语句
    function html (code) {
        
        // 记录行号
        line += code.split(/\n/).length - 1;

        // 压缩多余空白与注释
        if (compress) {
            code = code
            .replace(/\s+/g, ' ')
            .replace(/<!--[\w\W]*?-->/g, '');
        }
        
        if (code) {
            code = replaces[1] + stringify(code) + replaces[2] + "\n";
        }

        return code;
    }
    
    
    // 处理逻辑语句
    function logic (code) {

        var thisLine = line;
       
        if (parser) {
        
             // 语法转换插件钩子
            code = parser(code, options);
            
        } else if (debug) {
        
            // 记录行号
            code = code.replace(/\n/g, function () {
                line ++;
                return "$line=" + line +  ";";
            });
            
        }
        
        
        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {
            var codeEscape = /^=[=#]/.test(code);
            var escapeSyntax = null;
            if (escape) {
                if (codeEscape) {
                    escapeSyntax = false;
                }
                else {
                    escapeSyntax = true;
                }
            }
            else {
                if (!codeEscape) {
                    escapeSyntax = false;
                }
                else {
                    escapeSyntax = true;
                }
            }
            
            // var escapeSyntax = escape ^ !/^=[=#]/.test(code);

            code = code.replace(/^=[=#]?|[\s;]*$/g, '');

            // 对内容编码
            if (escapeSyntax) {

                var name = code.replace(/\s*\([^\)]+\)/, '');

                // 排除 utils.* | include | print
                
                if (!utils[name] && !/^(include|print)$/.test(name)) {
                    code = "$escape(" + code + ")";
                }

            // 不编码
            } else {
                code = "$string(" + code + ")";
            }
            

            code = replaces[1] + code + replaces[2];

        }
        
        if (debug) {
            code = "$line=" + thisLine + ";" + code;
        }
        
        // 提取模板中的变量名
        forEach(getVariable(code), function (name) {
            
            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) {
                return;
            }

            var value;

            // 声明模板变量
            // 赋值优先级:
            // [include, print] > utils > helpers > data
            if (name === 'print') {

                value = print;

            } else if (name === 'include') {
                
                value = include;
                
            } else if (utils[name]) {

                value = "$utils." + name;

            } else if (helpers[name]) {

                value = "$helpers." + name;

            } else {

                value = "$data." + name;
            }
            
            headerCode += name + "=" + value + ",";
            uniq[name] = true;
            
            
        });
        
        return code + "\n";
    }
    
    
};



// 定义模板引擎的语法


defaults.openTag = '{{';
defaults.closeTag = '}}';


var filtered = function (js, filter) {
    var parts = filter.split(':');
    var name = parts.shift();
    var args = parts.join(':') || '';

    if (args) {
        args = ', ' + args;
    }

    return '$helpers.' + name + '(' + js + args + ')';
}


defaults.parser = function (code, options) {

    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '');

    var split = code.split(' ');
    var key = split.shift();
    var args = split.join(' ');

    

    switch (key) {

        case 'if':

            code = 'if(' + args + '){';
            break;

        case 'else':
            
            if (split.shift() === 'if') {
                split = ' if(' + split.join(' ') + ')';
            } else {
                split = '';
            }

            code = '}else' + split + '{';
            break;

        case '/if':

            code = '}';
            break;

        case 'each':
            
            var object = split[0] || '$data';
            var as     = split[1] || 'as';
            var value  = split[2] || '$value';
            var index  = split[3] || '$index';
            
            var param   = value + ',' + index;
            
            if (as !== 'as') {
                object = '[]';
            }
            
            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

            code = '});';
            break;

        case 'echo':

            code = 'print(' + args + ');';
            break;

        case 'print':
        case 'include':

            code = key + '(' + split.join(',') + ');';
            break;

        default:

            // 过滤器（辅助方法）
            // {{value | filterA:'abcd' | filterB}}
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^\s*\|\s*[\w\$]/.test(args)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {
                
                code = '=#' + key + '(' + split.join(',') + ');';
            
            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }
    
    
    return code;
};



// RequireJS && SeaJS
if (typeof define === 'function') {
    define(function() {
        return template;
    });

// NodeJS
} else if (typeof exports !== 'undefined') {
    module.exports = template;
} else {
    this.template = template;
}

})();

    })( module.exports , module , __context );
    __context.____MODULES[ "541bfb7b549627999e3defd0404b76bf" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "a7b332e3aae389b1d4ef919d43d23251" ,
        filename : "template.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var template =__context.____MODULES['541bfb7b549627999e3defd0404b76bf'];
template.config('parser', parser);
template.config('escape', false);
function parser(code, options) {

    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '');

    var split = code.split(/\s+/);
    var key = split.shift();
    var args = split.join(' ');

    

    switch (key) {

        case 'if':
        case '#if':

            code = 'if(' + args + '){';
            break;

        case 'else':
        case '#else':
            if (split.shift() === 'if') {
                split = ' if(' + split.join(' ') + ')';
            } else {
                split = '';
            }

            code = '}else' + split + '{';
            break;

        case '/if':

            code = '}';
            break;

        case 'each':
        case '#each':    
            var object = split[0] || '$data';
            var as     = split[1] || 'as';
            var value  = split[2] || '$value';
            var index  = split[3] || '$index';
            
            var param   = value + ',' + index;
            
            if (as !== 'as') {
                object = '[]';
            }
            
            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

            code = '});';
            break;

        case 'echo':
        case '#echo':
            code = 'print(' + args + ');';
            break;

        case 'print':
        case 'include':
        case '#print':
        case '#include':
        

            code = key + '(' + split.join(',') + ');';
            break;

        default:

            // 过滤器（辅助方法）
            // {{value | filterA:'abcd' | filterB}}
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^\s*\|\s*[\w\$]/.test(args)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {
                
                code = '=#' + key + '(' + split.join(',') + ');';
            
            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }
    
    
    return code;
};
module.exports = template;


    })( module.exports , module , __context );
    __context.____MODULES[ "a7b332e3aae389b1d4ef919d43d23251" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "9e11d69af7743de93f8c257f13101434" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['a7b332e3aae389b1d4ef919d43d23251'];


    })( module.exports , module , __context );
    __context.____MODULES[ "9e11d69af7743de93f8c257f13101434" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "c601f16c271e293c5ea6b6108617f2c5" ,
        filename : "panel.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["panel"] = "<div>\n    <div data-role=\"scroller\">\n        <div data-role=\"body\"></div>\n    </div>\n</div>\n";
if (typeof module !== "undefined") module.exports = window.QTMPL["panel"];

    })( module.exports , module , __context );
    __context.____MODULES[ "c601f16c271e293c5ea6b6108617f2c5" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "04529342a29eaf1d7d058615384474c1" ,
        filename : "panel-refresh.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["panel-refresh"] = "<div style=\"position: absolute; text-align: center; width: 100%; height: 40px; line-height: 40px; top: -40px;\">\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico\">&#xf07b;</i>\n        <div class=\"text\">下拉可以刷新</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico\">&#xf079;</i>\n        <div class=\"text\">释放立即更新</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-loading\">&#xf089;</i>\n        <div class=\"text\">努力加载中...</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-succ\">&#xf078;</i>\n        <div class=\"text\">加载成功</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-fail\">&#xf077;</i>\n        <div class=\"text\">加载失败</div>\n    </div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["panel-refresh"];

    })( module.exports , module , __context );
    __context.____MODULES[ "04529342a29eaf1d7d058615384474c1" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2e3673ff7223e51f34f27d5f080bf748" ,
        filename : "panel-loadmore.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["panel-loadmore"] = "<div style=\"position: absolute; text-align: center; height: 40px; line-height: 40px; width: 100%; bottom: -40px;\">\n    <div class=\"yo-loadtip\">\n        <i class=\"yo-ico yo-ico-loading\">&#xf089;</i>\n        <div class=\"text\">正在加载...</div>\n    </div>\n    <div class=\"yo-loadtip\">\n        <div class=\"text\">没有更多了...</div>\n    </div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["panel-loadmore"];

    })( module.exports , module , __context );
    __context.____MODULES[ "2e3673ff7223e51f34f27d5f080bf748" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "9d270c798513024c710e4cada0181802" ,
        filename : "panel.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 面板组件，支持横向纵向滑动，以及下拉刷新和加载更多
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Panel
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/panel/index.html
 */
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var PanelTpl =__context.____MODULES['c601f16c271e293c5ea6b6108617f2c5'];
var RefreshTpl =__context.____MODULES['04529342a29eaf1d7d058615384474c1'];
var LoadmoreTpl =__context.____MODULES['2e3673ff7223e51f34f27d5f080bf748'];

// 动画定时器
var rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

// 默认不阻止浏览器默认行为的控件
var Reg = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;

var Panel = Widget.extend({
    /**
     * @property {Boolean} scrollX X轴是否滚动，默认为false
     * @property {Boolean} scrollY Y轴是否滚动，默认为true
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为true，true使用css的transition，false使用js动画
     * @property {Boolean} scrollLock 当容器内的内容的高度小于容器高度时，是否允许滚动，默认为false
     * @property {Boolean} preventDefault 阻止浏览器默认事件，默认为true
     * @property {Boolean} stopPropagation 阻止touch事件冒泡，默认为false
     * @property {Boolean}  canLockY 是否支持锁定Y轴滚动，默认为false， 在与slidermenu的配合使用时，需要设置为true
     * @property {Boolean} resizable 当浏览器窗口改变时是否可调整大小，默认为true
     * @property {Boolean} useRefresh 是否启用刷新功能，默认为false，开启下来刷新组件
     * @property {Boolean} useLoadmore 是否启用加载更多功能，默认为false，开启上拉加载更多
     * @property {String} template 组件的模板，需要自定义时修改
     * @property {String} refreshTpl 刷新数据提示模板，需要自定义时修改
     * @property {String} loadmoreTpl 家在更多时提示模板，需要自定义时修改
     * @memberOf Panel
     */
    
     /**
     * @event {function} tap 
     * @memberOf Panel
     */
    options: {
        type: 'panel',
        // X轴是否滚动，默认为false
        scrollX: false,
        // Y轴是否滚动，默认为true
        scrollY: true,
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: true,
        // 当容器内的内容的高度小于容器高度时，是否允许滚动，默认为false
        scrollLock: false,
        // 阻止浏览器默认事件
        preventDefault: true,
        // 阻止touch事件冒泡
        stopPropagation: false,
        // 是否支持锁定Y轴滚动
        canLockY: false,
        // 可调整大小
        resizable: true,
        // 刷新激活高度，一般等于刷新容器的高度
        refreshActiveY: 40,
        // 加载更多激活高度，设置成负数可以提前刷新，正数往下拉更多才刷新
        loadmoreActiveY: 0,
        // 加载更多容器高度，如果自定义了加载更多模板并且改变了高度，需要配置此参数
        loadmoreContY: 40,
        // 刷新结果显示时间，0为不显示刷新结果直接弹回，不等于0会显示刷新成功或刷新失败提示后再弹回
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: false,
        // 是否启用加载更多功能
        useLoadmore: false,

        // 组件模板
        template: PanelTpl,
        // 刷新数据提示模板
        refreshTpl: RefreshTpl,
        // 加载更多提示提示模板
        loadmoreTpl: LoadmoreTpl,

        // 刷新事件，该接口必须调用Panel.refresh()方法通知Panel数据已加载
        /**
         * 用户下拉列表满足刷新条件时触发的事件
         * @event refresh
         * @memberOf Panel
         * @param  {Number} pageNum 当前的页码
         */
        onRefresh: function(pageNum) {},
        // 加载更多中，该接口必须调用Panel.loadMore()方法通知Panel数据已加载
        /**
         * 用户上拉列表满足加载更多条件时触发的事件
         * @event loadmore
         * @memberOf Panel
         * @param  {Number} pageNum 当前的页码
         */
        onLoadMore: function(pageNum) {},
        /**
         * 渲染完成后触发的事件
         * @event ready
         * @memberOf Panel
         */
        onReady: function() {},

        // panel点击事件
        /**
         * 用户点击某项数据时触发的事件
         * @event tap
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onTap: function (e) {},
        /**
         * touchstart事件开始前触发的事件
         * @event beforestart
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeStart: function (e) {},
        /**
         * touchmove事件开始前触发的事件
         * @event beforemove
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeMove: function(e) {},
        
        // onScroll: function (translateX, translateY, stopAnimate) {},

        /**
         * touchmove事件结束后触发的事件,切换下拉刷新图标
         * @event aftermove
         * @param  {Number} translateY 滚动偏移的translateY
         * @memberOf Panel
         */
        onAfterMove: function(translateY) {
            translateY > 0 && this.get('useRefresh') && !this._refreshing && this._changeRefreshStatus(translateY);
            this._moveWhenLoad = this._refreshing || this._loadmoreing;
        },

        /**
         * touchend事件开始前触发的事件
         * @event beforeend
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeEnd: function(e) {
            if(this.get('useRefresh') && !this._loadmoreing && this._translateY >= this.get('refreshActiveY')) {
                if(this._refreshing) {
                    this.scrollTo(0, this.get('refreshActiveY'), 300);
                } else {
                    this._refreshInit();
                }
                return false;
            }

            return true;
        },

        /**
         * 列表滚动时触发的事件
         * @event 
         * @param  {Number} translateX 滚动偏移的translateX
         * @param  {Number} translateY 滚动偏移的translateY
         * @param  {Boolean} stopAnimate 是否停止动画
         * @memberOf Panel
         */
        onScroll: function (translateX, translateY) {
            if(this._refreshing || this._loadmoreing) return;

            if(this.get('useLoadmore') && this._canLoadmore) {
                // 激活加载更多的translateY，负数
                var activeY = this._maxY - this.get('loadmoreActiveY');
                translateY < 0 && translateY < activeY && this._loadMoreInit();
            }
        },

        events: {
            'touchstart': '_touchStart',
            'touchmove': '_touchMove',
            'touchend': '_touchEnd',
            'touchcancel': '_touchEnd',
            'webkitTransitionEnd [data-role=scroller]': '_transitionEnd',
            'transitionEnd [data-role=scroller]': '_transitionEnd'
        }
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Panel
     * @private
     */
    init: function() {
        this._initPrivate();
    },

    /**
     * 判断是否需要使用fromHTML属性，即从节点创建
     * @function _isFromHTML
     * @memberOf Panel
     * @private
     */
    _isFromHTML: function(){
        var container = this.get('container');
        container = container || $PARENT_NODE;
        container = $(container);
        // 容器内部获取第一个对象节点
        var firstElement = container[0].firstElementChild;
        // 如果存在对象节点
        if(firstElement){
            // 获取滚动容器
            var scroller = container.find('[data-role="scroller"]');
            // 获取内容容器
            var body = container.find('[data-role="body"]');
            // 如果容器没有添加标示
            if(scroller.length === 0 || body.length === 0){
                // 容器第一个节点默认为是滚动容器
                $(firstElement).data('role', 'scroller');
                // 滚动容器内第一个节点默认未是内容容器
                $(firstElement.firstElementChild).data('role', 'body');
            }
            return true;
        }

        return false;
    },

    /**
     * 根据配置获取组件根节点
     * @function _getMainElement
     * @memberOf Panel
     * @private
     * @param  {Object} config 组件的配置项
     */
    _getMainElement: function(config){
        var isFromHTML = this._isFromHTML();
        if(isFromHTML){
            var container = this.get('container');
            container = container || $PARENT_NODE;
            container = $(container);
            this.widgetEl = container;
            this.container = container;
            this.on('ready', function(){
                this.resize();
            })
        }else{
            Panel.superClass._getMainElement.call(this, config);
        }
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Panel
     */
    render: function() {
        if(!this._isRender){
            Panel.superClass.render.call(this);
            this._scroller = this.widgetEl.find('[data-role="scroller"]');
            this._body = this.widgetEl.find('[data-role="body"]');
            this._createDragIcon();

            var self = this;
            this.widgetEl.on('tap', function(e) {
                !self._stopAnimate && !self._lockScrollY && self.trigger('tap', e);
                self._stopAnimate = false;
            });

            this.trigger('ready');
        }
        return this;
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf Panel
     */
    destroy: function () {
        Panel.superClass.destroy.call(this);
    },

    /**
     * 重新计算滚动区域，容器高度发生变化后调用
     * @function resize
     * @memberOf Panel
     */

    resize: function() {
        if(!this._isRender){return false;}
        if(this.get('scrollX')) {
            this._panelWidth = +this.widgetEl[0].clientWidth;
            var scrollerWidth = this._scroller[0].scrollWidth;
            this._maxX = this._panelWidth - scrollerWidth;
            // 滑动容器宽度不满外层容器宽度时，是否需要滑动
            if(this._maxX >= 0) {
                if(this.get('scrollLock')) {
                    this._canScroll = false;
                } else {
                    this._canScroll = true;
                    this._maxX = 0;
                }
            } else {
                this._canScroll = true;
            }
        } else if(this.get('scrollY')) {
            this._panelHeight = +this.widgetEl[0].clientHeight;
            var otherHeight = 0;// 其他容器高度
            // 容器里如果有其他非滚动元素，计算最大滑动高度时去掉这些元素的高度
            var child = this.widgetEl.children();
            if(child.length > 1) {
                child.forEach(function(item){
                    item.getAttribute('data-role') != 'scroller' && (otherHeight += (+item.offsetHeight));
                });
            }
            var scrollerHeight = this._scroller[0].clientHeight;
            this._maxY = this._panelHeight - scrollerHeight - otherHeight;
            // 滑动容器高度不满外层容器高度时，是否需要滑动
            if(this._maxY >= 0) {
                if(this.get('scrollLock')) {
                    this._canScroll = false;
                } else {
                    this._canScroll = true;
                    this._maxY = 0;
                }
            } else {
                this._canScroll = true;
            }
        }
    },

    /**
     * 渲染panel
     *
     * @param html panel的内容
     */
    html: function(html) {
        this._body.html(html);
        this.resize();
    },

    /**
     * 添加panel
     *
     * @param html panel的内容
     */
    append: function(html) {
        this._body.append(html);
        this.resize();
    },

    /**
     * 是否允许加载更多
     *
     * @param result
     */
    setCanLoadmore: function(result) {
        this._canLoadmore = result;
    },

    /**
     * 滚动函数
     * @function scrollTo
     * @memberOf Panel
     * @param {Number} translateX 需要滚动的translateX值
     * @param {Number} translateY 需要滚动的translateY值
     * @param {Array} time  是transition-duration表示过渡效果需要多少毫秒
     * @param {String | Function} effect transition-timing-function过渡效果的速度曲线
     * @private
     */
    scrollTo: function(translateX, translateY, time, effect) {
        if(this.get('isTransition')) {
            effect = effect || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
            setTransitionTimingFunc(this._scroller, effect);
            setTransitionTime(this._scroller, time);
            this._translate(translateX, translateY);
        } else {
            effect || (effect = function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            });
            if(time) {
                this._animate(translateX, translateY, time, effect);
            } else {
                this._translate(translateX, translateY);
            }
        }
        this._translateX = translateX;
        this._translateY = translateY;
    },

    /**
     * 停止动画
     * @function stopAnimate
     * @memberOf Panel
     * @private
     */
    stopAnimate: function() {
        var result = this._isAnimating;
        if(this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimate = true;
            if(this.get('scrollX')) {
                this._translateX = getTranslateX(this._scroller);
                this.scrollTo(this._translateX, 0, 0);
            } else if(this.get('scrollY')) {
                this._translateY = getTranslateY(this._scroller);
                this.scrollTo(0, this._translateY, 0);
            }
        }
        return result;
    },

    /**
     * 手动模拟刷新列表操作，组件滚动到头部
     * @function simulateRefresh
     * @memberOf Panel
     */
    simulateRefresh: function() {
        var self = this;
        var refreshActiveY = this.get('refreshActiveY');
        this.scrollTo(0, refreshActiveY, 300);
        this._changeRefreshStatus(refreshActiveY);
        setTimeout(function() {
            self._refreshInit();
        }, 300);
    },

 
    /**
     * 刷新组件的HTML
     * @function refresh
     * @memberOf Panel
     * @param {String} html 需要更新的html字符串
     * @param {Boolean} isFail 加载是否成功，如果加载数据碰到异常才设置成false，否则默认都为true
     */
    refresh: function(html, isFail) {
        this._loadEl.hide();
        if(!isFail) {
            this._pageNum = 1;
            this.html(html);
        }
        this._endmoreEl && this._endmoreEl.hide();

        var self = this, delay = this.get('refreshResultDelay');
        var resultEl = isFail ? self._failEl : self._successEl;

        delay && resultEl.show();

        setTimeout(function() {
            delay && resultEl.hide();

            var time = 0;
            // 滑动到原点
            if(!self._moveWhenLoad || (self._moveWhenLoad && self._translateY > 0)) {
                time = 300;
                self.scrollTo(0, 0, time);
            }

            setTimeout(function() {
                self._dragEl.show();
                self._refreshing = false;
                self._moveWhenLoad = false;
            }, time);

        }, delay);
    },

    /**
     * 组件加载更多数据
     * @function loadMore
     * @memberOf Panel
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载失败，如果加载数据碰到异常才设置成true
     */
    loadMore: function(html, isFail) {
        var isMoreData = html && html.length;
        this._maxY += this.get('loadmoreContY');
        this._loadmoreEl.hide();
        if(!isFail) {
            if(isMoreData) {
                this._pageNum++;
                this.append(html);
            } else {// 加载不到更多数据
                this._endmoreEl.show();
            }
        }

        var self = this,
            delay = isMoreData ? 0 : 500,
            dist = isMoreData ? self._translateY - 20 : self._maxY;
        setTimeout(function() {
            if(isMoreData) {
                !self._moveWhenLoad && self.scrollTo(0, dist, 300);
            } else {
                self.scrollTo(0, dist, 300);
            }
            setTimeout(function() {
                self._loadmoreing = false;
                self._canLoadmore = isMoreData || isFail;
                self._moveWhenLoad = false;
            }, 300);
        }, delay);
    },

    /**
     * 获取滚动方向
     */
    getOrientation: function() {
        return this._orientation;
    },

   
    /**
     * 获得当前组件的是第几页
     * @function getPageNum
     * @memberOf Panel
     * @return {Number} 获得当前组件的是第几页
     */
    getPageNum: function() {
        return this._pageNum;
    },

    /**
     * 滑动超出最大范围，回弹到终点
     * @function _resetPosition
     * @private
     * @memberOf Panel
     */
    _resetPosition: function () {
        // 超出刷新激活高度后回弹到激活高度,而不是0
        if(this._refreshing && this._translateY == this.get('refreshActiveY')) {
            return false;
        } else if(this._loadmoreing && this._translateY == this._maxY - this.get('loadmoreContY')) {
            return false;
        }

        if(this.get('scrollX')) {
            var translateX = this._translateX;
            if(this._canScroll) {
                translateX = translateX > 0 ? 0 : translateX < this._maxX ? this._maxX : translateX;
            }
            if(translateX == this._translateX) {
                return false;
            }
            this._orientation = translateX < 0 ? 'left': 'right';
            this.scrollTo(translateX, 0, 600);
        } else if(this.get('scrollY')){
            var translateY = this._translateY;
            if(this._canScroll) {
                translateY = translateY > 0 ? 0 : translateY < this._maxY ? this._maxY : translateY;
            }
            if(translateY == this._translateY) {
                return false;
            }
            this._orientation = translateY < 0 ? 'up': 'down';
            this.scrollTo(0, translateY, 600);
        }

        return this._moveWhenLoad = true;
    },


    /**
     * 初始化私有属性
     * @function _initPrivate
     * @private
     * @memberOf Panel
     */
    _initPrivate: function() {
        this._scroller = null; // 滑动容器
        this._body = null; // panel容器
        this._panelWidth = 0; // 列表宽度
        this._panelHeight = 0; // 列表高度

        this._startY = 0; // 开始滑动时的pageY
        this._lastY = 0; // 上一次滑动事件的pageY
        this._distY = 0; // 一次滑动事件的总距离
        this._translateY = 0; // 当前纵向滑动的总距离
        this._maxY = 0; // 最大纵向滑动距离
        this._lockScrollY = false; // 是否锁定Y轴滚动

        this._startX = 0; // 开始滑动时的pageX
        this._lastX = 0; // 上一次滑动事件的pagex
        this._distX = 0; // 一次横向滑动事件的总距离
        this._translateX = 0; // 当前横向滑动的总距离
        this._maxX = 0; // 最大横向滑动距离

        this._orientation = ''; // 列表滑动方向（与手势滑动方向相反） up || down
        this._startTime = 0; // 开始滑动时间
        this._endTime = 0; // 结束滑动时间
        this._isMoving = false; // 是否滑动中
        this._isAnimating = false; // 是否动画中
        this._canScroll = true; //是否可以滑动
        this._stopAnimate = false; // 本次点击是否阻止了动画效果（transition || requrestAnimationFrame）

        this._cancelMove = false; // 取消滑动，目前只有一种情况，当pageY小于0
        // TODO 增加支持两个手指滑动的功能
        this._initiated = false; // 是否初始化（touchstart是否正常执行了，主要用来解决多点触发滑动的判断）

        this._refreshing = false; // 刷新中
        this._loadmoreing = false; // 加载更多中
        this._pageNum = 1; // 当前页码

        this._dragEl = null; // 下拉刷新
        this._endEl = null; // 释放更新
        this._loadEl = null; // 加载中
        this._successEl = null; // 加载成功
        this._failEl = null; // 加载失败
        this._loadmoreEl = null; // 加载更多
        this._endmoreEl = null; // 没有更多

        // 是否可以加载更多，下面条件成立时，_canLoadmore都等于false
        // useLoadmore == false || 加载不到更多数据
        this._canLoadmore = this.get('useLoadmore');

        // 刷新或加载更多时，是否发生了滑动。如果没有滑动，会有默认滚动动作
        this._moveWhenLoad = false;
    },

    /**
     * touchstart事件的处理函数，初始化参数，停止正在进行的动画
     * @function _touchStart
     * @private
     * @param  {HTMLDOMEvent} e touchstart事件的事件对象
     * @memberOf Panel
     */
    _touchStart: function(e) {

        var target = e.target;
        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._initiated) return;

        this.trigger('beforestart', e);

        setTransitionTime(this._scroller);
        this._isMoving = false;
        this._startTime = +new Date();
        this._stopAnimate = false;
        this.stopAnimate();

        // 目前只允许滚动一个方向
        if(this.get('scrollY')) {
            this._startY = this._translateY;
            this._distY = 0;
            this._lastY = e.touches[0].pageY;

            this._lastX = e.touches[0].pageX;
            this._lockScrollY = false;
            this._cancelMove = false;
            this._initiated = true;
        } else if(this.get('scrollX')) {
            this._startX = this._translateX;
            this._distX = 0;
            this._lastX = e.touches[0].pageX;

            this._lockScrollY = true;
            this._cancelMove = false;
            this._initiated = true;
        } else {
            this._initiated = false;
        }
    },

    /**
     * touchmove事件的处理函数，处理位移偏移，处理canLockY
     * @function _touchMove
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf Panel
     */
    _touchMove: function(e) {
        this.get('preventDefault') && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(!this._initiated) return;

        if(!this.trigger('beforemove', e)) {
            this._initiated = false;
            return;
        };

        if(this.get('scrollY')) {
            var translateY,
                timestamp = +new Date(),
                currY = e.touches[0].pageY,
                offsetY = currY - this._lastY;

            this._distY += offsetY;

            // 当滑动超出屏幕，自动触发touchend事件
            if(currY < 0) {
                this._initiated = false;
                if(this._cancelMove) {
                    return;
                }
                this._cancelMove = true;
                this._touchEnd(e);
                return;
            }

            if(this.get('canLockY')) {
                // 横向滚动超过比例，锁定纵向滚动
                if(this._lockScrollY) {
                    this._initiated = false;
                    return;
                }
                var currX = e.touches[0].pageX;
                var offsetX = currX - this._lastX;
                if(Math.abs(this._distY) < 30 && Math.abs(offsetX) / 3 > Math.abs(this._distY)) {
                    this._lockScrollY = true;
                    this._initiated = false;
                    return;
                }
            }

            // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
            // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
            if ( timestamp - this._endTime > 300 && Math.abs(this._distY) < 10 ) {
                return;
            }

            this._orientation = offsetY > 0 ? 'up': 'down';
            !this._canScroll && (offsetY = 0);
            translateY = this._translateY + offsetY;
            // 超出滑动容器范围，减少滑动高度
            if ( translateY > 0 || translateY < this._maxY) {
                translateY = this._translateY + offsetY / 3;
            }

            this._isMoving = true;
            this._translate(0, translateY);
            this._translateY = translateY;
            this._lastY = currY;
            if(timestamp - this._startTime > 300) {
                this._startTime = timestamp;
                this._startY = this._translateY;
            }
            this.trigger('aftermove', translateY);
        } else if(this.get('scrollX')) {
            var translateX,
                timestamp = +new Date(),
                currX = e.touches[0].pageX,
                offsetX = currX - this._lastX;

            this._distX += offsetX;

            // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
            // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
            if ( timestamp - this._endTime > 300 && Math.abs(this._distX) < 10 ) {
                return;
            }

            this._orientation = offsetX > 0 ? 'left': 'right';
            !this._canScroll && (offsetX = 0);
            translateX = this._translateX + offsetX;
            // 超出滑动容器范围，减少滑动高度
            if ( translateX > 0 || translateX < this._maxX) {
                translateX = this._translateX + offsetX / 3;
            }

            this._isMoving = true;
            this._translate(translateX, 0);
            this._translateX = translateX;
            this._lastX = currX;
            if(timestamp - this._startTime > 300) {
                this._startTime = timestamp;
                this._startX = this._translateX;
            }
            this.trigger('aftermove', translateX);
        }
    },

    /**
     * touchend事件的处理函数，添加active样式，处理组件的回弹，滚动到目标位置
     * @function _touchEnd
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf Panel
     */
    _touchEnd: function(e) {
        var target = e.target;

        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        this._initiated = false;
        this._endTime = +new Date();
        var duration = this._endTime - this._startTime;

        if(!this.trigger('beforeend', e)) {
            return;
        };

        // 1. 判断是否滑动回弹，回弹则return
        if(this._resetPosition()) {
            return;
        }

        // 2. 滑动到目标位置
        this.scrollTo(this._translateX, this._translateY);

        // 3. 没有滚动，并且没有还在惯性滑动中，才触发点击事件
        if(!this._isMoving ) {
            return;
        }

        // 4. 是否有惯性滑动，有则滑动到计算后的位置
        this._isMoving = false;
        if (duration < 300 && this._canScroll) {
            var result;
            if(this.get('scrollX')) {
                result = momentum(this._translateX, this._startX, duration, this._maxX, this._panelWidth);
                var newX = result.destination;
                if (newX != this._translateX ) {
                    var effect = null;
                    if(newX > 0 || newX < this._maxX) {
                        // 惯性滑动中超出边界回弹回来，切换动画效果函数
                        if(this.get('isTransition')) {
                            effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        } else {
                            effect = function (k) {
                                return k * ( 2 - k );
                            };
                        }
                    }
                    this.scrollTo(newX, 0, result.duration, effect);
                }
            } else if(this.get('scrollY')){
                result = momentum(this._translateY, this._startY, duration, this._maxY, this._panelHeight);
                var newY = result.destination;
                if (newY != this._translateY ) {
                    var effect = null;
                    if(newY > 0 || newY < this._maxY) {
                        // 惯性滑动中超出边界回弹回来，切换动画效果函数
                        if(this.get('isTransition')) {
                            effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        } else {
                            effect = function (k) {
                                return k * ( 2 - k );
                            };
                        }
                    }
                    this.scrollTo(0, newY, result.duration, effect);
                }
            }
            this._isAnimating = true;
        }
    },

    /**
     * transition动画结束后的处理函数
     * @function _transitionEnd
     * @memberOf Panel
     * @param  {HTMLDOMEvent} e transitionEnd结束时事件对象
     * @private
     */
    _transitionEnd: function(e) {
        if ( e.target != this._scroller[0] ) {
            return;
        }
        setTransitionTime(this._scroller);
        this._isAnimating = false;
        this._resetPosition();
    },

    /**
     * 不适用transition时的惯性动画函数
     * @function _animate
     * @memberOf Panel
     * @private
     * @param  {Number} translateX scroller要滚动的目标translateX
     * @param  {Number} translateY scroller要滚动的目标translateY
     * @param  {Number} time       scorller要滚动到
     * @param  {Function} effect     滚动的效果函数
     */
    _animate: function(translateX, translateY, time, effect) {
        var self = this,
            startX = this._translateX,
            startY = this._translateY,
            startTime = +new Date(),
            destTime = startTime + time;

        function step () {
            var now = +new Date(),
                newX, newY,
                easing;

            if ( now >= destTime ) {
                self._isAnimating = false;
                self._translate(translateX, translateY);
                self._translateX = translateX;
                self._translateY = translateY;
                self._resetPosition();
                return;
            }

            now = ( now - startTime ) / time;
            easing = effect(now);
            if(self.get('scrollX')) {
                newX = ( translateX - startX ) * easing + startX;
                self._translateX = newX;
                self._translate(newX, 0);
            } else if(self.get('scrollY')) {
                newY = ( translateY - startY ) * easing + startY;
                self._translateY = newY;
                self._translate(0, newY);
            }

            if ( self._isAnimating ) {
                rAF(step);
            }
        }
        this._isAnimating = true;
        step();
    },

     /**
     * 设置scroller的translateX和translateY值
     * @function _translate
     * @private
     * @param  {Number} translateX 要给scroller设置的translateX值
     * @param  {Number} translateY 要给scroller设置的translateY值
     * @memberOf Panel
     */
    _translate: function(translateX, translateY) {
        this._scroller[0].style.webkitTransform = 'translate(' + translateX + 'px, ' + translateY + 'px) translateZ(0)';
        this._scroller[0].style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) translateZ(0)';
        this.trigger('scroll', translateX, translateY, this._stopAnimate);
    },

    /**
     * 创建刷新和加载更多的操作图标
     * @function _createDragIcon
     * @memberOf Panel
     * @private
     */
    _createDragIcon: function() {
        if(this.get('useRefresh')) {
            var rh = this.get('refreshActiveY');
            var refreshContainer = $(this.get('refreshTpl'));
            refreshContainer.css({height: rh + 'px', lineHeight: rh + 'px', top: -rh}).appendTo(this._scroller);

            var child = refreshContainer.children();
            this._dragEl = child[0] && $(child[0]).show();
            this._endEl = child[1] && $(child[1]).hide();
            this._loadEl = child[2] && $(child[2]).hide();
            this._successEl = child[3] && $(child[3]).hide();
            this._failEl = child[4] && $(child[4]).hide();

            this._dragIcon = $(this._dragEl.children()[0]);
            this._endIcon = $(this._endEl.children()[0]);
            this._changeRefreshAnimate('down');
        }
        if(this.get('useLoadmore')) {
            var mh = this.get('loadmoreContY');
            var moreContainer = this._moreCont = $(this.get('loadmoreTpl'));
            moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', bottom: -mh}).appendTo(this._scroller);

            var child = moreContainer.children();
            this._loadmoreEl = child[0] && $(child[0]).hide();
            this._endmoreEl = child[1] && $(child[1]).hide();
        }
    },


    /**
     * 根据translateY改变刷新的显示状态（下拉刷新or释放更新）
     * @function _changeRefreshStatus
     * @memberOf Panel
     * @param {Number} translateY translateY的偏移
     * @private
     */
    _changeRefreshStatus: function(translateY) {
        var activeY = this.get('refreshActiveY');

        if(translateY >= activeY) {
            if(this._dragEl[0].style.display != "none") {
                this._dragEl.hide();
                this._endEl.show();
                this._changeRefreshAnimate('up');
            }
        } else if(translateY < activeY && translateY > 0) {
            if(this._dragEl[0].style.display == "none") {
                this._dragEl.show();
                this._endEl.hide();
                this._changeRefreshAnimate('down');
            }
        }
    },

    /**
     * 根据direction改变icon的样式
     * @function _changeRefreshAnimate
     * @memberOf Panel
     * @param {String} direction 方向，上为up下位down
     * @private
     */
    _changeRefreshAnimate: function(direction) {
        if(direction == 'up') {
            iconAnimate(this._dragIcon, 'addClass', true);
            iconAnimate(this._endIcon, 'removeClass');
        } else {
            iconAnimate(this._dragIcon, 'removeClass');
            iconAnimate(this._endIcon, 'addClass', false);
        }
    },

    /**
     * refresh状态初始化
     * @function _refreshInit
     * @memberOf Panel
     * @private
     */
    _refreshInit: function() {
        this._refreshing = true;
        this._dragEl.hide();
        this._endEl.hide();
        this._loadEl.show();
        this._changeRefreshAnimate('down');
        this.scrollTo(0, this.get('refreshActiveY'), 200);

        var self = this;
        setTimeout(function() {
            self.trigger('refresh', this._pageNum);
        }, 300);
    },

    /**
     * loadMore状态初始化
     * @function _loadMoreInit
     * @memberOf Panel
     * @private
     */
    _loadMoreInit: function() {
        this._loadmoreing = true;
        this._loadmoreEl.show();
        this._endmoreEl.hide();
        this._maxY -= this.get('loadmoreContY');
        this.trigger('loadmore', this._pageNum);
    },

    /**
     * 隐藏刷新和家在更多的状态
     * @function _reset
     * @memberOf Panel
     * @private
     */
    _reset: function() {
        if(this.get('useRefresh')) {
            this._dragEl.show();
            this._endEl.hide();
            this._loadEl.hide();
            if(this.get('refreshResultDelay')) {
                this._successEl.hide();
                this._failEl.hide();
            }
        }
        if(this.get('useLoadmore')) {
            this._loadmoreEl.hide();
            this._endmoreEl.hide();
        }
    }
});

// 滑动惯性计算
function momentum(current, start, time, lowerMargin, wrapperSize, deceleration) {
    var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration;

    // 低版本安卓，降低惯性滑动速度
    var defaultDeceleration = 0.0006;
    $.os.android && $.os.version < '4.4' && (defaultDeceleration = 0.006);

    deceleration = deceleration === undefined ? defaultDeceleration : deceleration;

    destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
    duration = speed / deceleration;

    if ( destination < lowerMargin ) {
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
    } else if ( destination > 0 ) {
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        duration: duration
    };
};

function setTransitionTime(elem, time) {
    time = time || 0;
    elem[0].style.webkitTransitionDuration = time + 'ms';
    elem[0].style.transitionDuration = time + 'ms';
}
function setTransitionTimingFunc(elem, effect) {
    elem[0].style.webkitTransitionTimingFunction = effect;
    elem[0].style.transitionTimingFunction = effect;
}

// 获取元素的translateX
function getTranslateX(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[12] || split[4]));
}

// 获取元素的translateY
function getTranslateY(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[13] || split[5]));
}

/**
 * 添加下拉刷新和释放更新的动画
 *
 * @param elem 元素
 * @param action 操作，add || remove
 * @param positive 正负
 */
function iconAnimate(elem, action, positive) {
    var style = action == 'addClass' ? (positive ? 'rotate(180deg)' : 'rotate(-180deg)') : '';
    elem[0].style.webkitTransform = style;
    elem[0].style.transform = style;
}

module.exports = Panel;

    })( module.exports , module , __context );
    __context.____MODULES[ "9d270c798513024c710e4cada0181802" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "b4be5b794797bf26c48616b528b60831" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['9d270c798513024c710e4cada0181802']

    })( module.exports , module , __context );
    __context.____MODULES[ "b4be5b794797bf26c48616b528b60831" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "36a01c3f62e270e54ffe308f8ff2a892" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["panel"] = __context.____MODULES['b4be5b794797bf26c48616b528b60831'];
module.exports = obj["panel"];

    })( module.exports , module , __context );
    __context.____MODULES[ "36a01c3f62e270e54ffe308f8ff2a892" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "49c8adec3ed3f1e8122094f2eedec8d2" ,
        filename : "list.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["list"] = "<div class=\"yo-group\">\n    <div class=\"scroll-wrap\" data-role=\"scroller\">\n        <ul class=\"yo-list\" data-role=\"itemwrap\"></ul>\n    </div>\n</div>\n";
if (typeof module !== "undefined") module.exports = window.QTMPL["list"];

    })( module.exports , module , __context );
    __context.____MODULES[ "49c8adec3ed3f1e8122094f2eedec8d2" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d75b37b3e7a283d8c15c32d58210b6ac" ,
        filename : "list-item.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["list-item"] = "<li class=\"item\" data-role=\"list-item\">{{text}}</li>";
if (typeof module !== "undefined") module.exports = window.QTMPL["list-item"];

    })( module.exports , module , __context );
    __context.____MODULES[ "d75b37b3e7a283d8c15c32d58210b6ac" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "29aa7a3eccfc48ce987c07fcc1d67442" ,
        filename : "list.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 列表基类，只支持纵向滑动
 * 
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class List
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/list/index.html
 */

var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var ListTpl =__context.____MODULES['49c8adec3ed3f1e8122094f2eedec8d2'];
var ItemTpl =__context.____MODULES['d75b37b3e7a283d8c15c32d58210b6ac'];

var rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) { return window.setTimeout(callback, 1000 / 60); };

var clearRAF = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    function (name){ window.clearTimeout(name)}

var Reg = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;

var List = Widget.extend({

    /**
     * @property {Boolean} isTransition 动画的效果，默认为true使用transition, false使用js动画
     * @property {Boolean} scrollLock 当数据项少于一屏时，是否锁定不允许滚动，默认为false
     * @property {String}  activeClass 激活状态的样式
     * @property {Boolean}  preventDefault 阻止浏览器默认事件，默认为true
     * @property {Boolean}  stopPropagation 阻止touch事件冒泡，默认为false
     * @property {Boolean}  resizable 可调整大小，默认为true
     * @property {Boolean}  canLockY 是否支持锁定Y轴滚动，默认为false， 在与slidermenu的配合使用时，需要设置为true
     * @property {String}  template 模板文件，自定义模板时需要传
     * @property {String}  itemTpl 列表项的模板，自定义模板时需要传
     * @property {Array} datasource @require组件的数据源，数组类型，每个数组项为object
     * @memberOf List
     */
    
   
    options: {
        type: 'list',
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: true,
        // 当数据项少于一屏时，是否锁定不允许滚动，默认为false
        scrollLock: false,
        // 激活状态的样式
        activeClass: '',
        // 阻止浏览器默认事件
        preventDefault: true,
        // 阻止touch事件冒泡
        stopPropagation: false,
        // 可调整大小
        resizable: true,
        // 是否支持锁定Y轴滚动
        canLockY: false,
        // tap事件点击间隔时间
        tapInterval: 0,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        
        datasource: [],

        // TODO 提供doubleTap、longTap等事件
        // 选项点击事件
        /**
         * 用户点击某项数据时触发的事件
         * @event tap
         * @memberOf List
         * @param  {HTMLEvent} e touch事件的事件对象
         */
        onTap: function (e) {},
        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf List
         */
        onSelectItem: function (data, itemEl, targetEl) {},

        /**
         * touchstart事件开始前触发的事件
         * @event beforestart
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeStart: function (e) {},
        /**
         * touchmove事件开始前触发的事件
         * @event beforemove
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeMove: function (e) {},
        /**
         * touchend事件开始前触发的事件
         * @event beforeend
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf List
         */
        onBeforeEnd: function (e) {},

        /**
         * touchmove事件结束后触发的事件
         * @event aftermove
         * @param  {Number} translateY 滚动偏移的translateY
         * @memberOf List
         */
        onAfterMove: function (translateY) {},

        /**
         * 列表滚动时触发的事件
         * @event 
         * @param  {Number} translateY 滚动偏移的translateY
         * @param  {Boolean} stopAnimate 是否停止动画
         * @memberOf List
         */
        onScroll: function (translateY, stopAnimate) {},

        events: {
            'touchstart': '_touchStart',
            'touchmove': '_touchMove',
            'touchend': '_touchEnd',
            'touchcancel': '_touchEnd',
            'webkitTransitionEnd [data-role=scroller]': '_transitionEnd',
            'transitionEnd [data-role=scroller]': '_transitionEnd'
        }
    },
    /**
     * 处理组件数据
     * @function init
     * @memberOf List
     * @private
     */
    init: function () {
        this.initProp();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf List
     */
    render: function () {
        List.superClass.render.call(this);
        this._scroller = this.widgetEl.find('[data-role="scroller"]');
        this._itemWrap = this._scroller.find('[data-role="itemwrap"]');
        this.initUI();
        var self = this;
        this.widgetEl.on('tap', '[data-role="list-item"]', function(e) {
            !self._stopAnimate && !self._lockScrollY && self.trigger('tap', e);
            self._stopAnimate = false;
        });
        return this;
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf  List
     */
    destroy: function() {
        this.animateTimer && clearRAF(this.animateTimer);
        this._cancelActive();
        List.superClass.destroy.call(this);
    },

    /**
     * 初始化私有属性
     * @function initProp
     * @private
     * @memberOf List
     */
    initProp: function() {
        this._scroller = null; // 列表滑动容器
        this._itemWrap = null; // 列表选项父容器
        this._listHeight = 0; // 列表高度

        this._startY = 0; // 开始滑动时的pageY
        this._lastY = 0; // 上一次滑动事件的pageY
        this._distY = 0; // 一次滑动事件的总距离
        this._translateY = 0; // 当前纵向滑动的总距离
        this._maxY = 0; // 最大滑动距离

        this._lastX = 0;
        this._lockScrollY = false; // 是否锁定Y轴滚动

        this._orientation = ''; // 列表滑动方向（与手势滑动方向相反） up || down
        this._startTime = 0; // 开始滑动时间
        this._endTime = 0; // 结束滑动时间
        this._isMoving = false; // 是否滑动中
        this._isAnimating = false; // 是否动画中
        this._canScroll = true; //是否可以滑动
        this._stopAnimate = false; // 本次点击是否阻止了动画效果（transition || requrestAnimationFrame）
        this._activeTimer = null; // 激活效果定时器
        this._actived = false;

        this._cancelMove = false; // 取消滑动，目前只有一种情况，当pageY小于0
        // TODO 增加支持两个手指滑动的功能
        this._initiated = false; // 是否初始化（touchstart是否正常执行了，主要用来解决多点触发滑动的判断）
    },

    /**
     * 处理组件样式
     * @function initUI
     * @private
     * @memberOf List
     */
    initUI: function () {
        this._renderListItem();
        this.resize();
    },

    /**
     * 容器高度发生变化后的处理
     * @function resize
     * @memberOf List
     */
    resize: function(scrollerHeight) {
        var otherHeight = 0;// 其他容器高度
        this._listHeight = +this.widgetEl[0].clientHeight;

        // 容器里如果有其他非滚动元素，计算最大滑动高度时去掉这些元素的高度
        var child = this.widgetEl.children();
        if(child.length > 1) {
            child.forEach(function(item){
                item.getAttribute('data-role') != 'scroller' && (otherHeight += (+item.offsetHeight));
            });
        }

        scrollerHeight = scrollerHeight || +this._scroller[0].clientHeight;
        this._maxY = this._listHeight - scrollerHeight - otherHeight;
        // 滑动容器高度不满外层容器高度时，是否需要滑动
        if(this._maxY >= 0) {
            if(this.get('scrollLock')) {
                this._canScroll = false;
            } else {
                this._canScroll = true;
                this._maxY = 0;
            }
        } else {
            this._canScroll = true;
        }
    },

    /**
     * 重新加载列表数据
     * @function reload
     * @param {Array} ds 重新加载的数据
     * @memberOf List
     */
    reload: function (ds) {
        ds && ds.length ? this.set('datasource', ds) : this.set('datasource', []);
        this.initUI();
    },

    /**
     * 滚动函数
     * @function scrollTo
     * @memberOf List
     * @param {Number} translateY 需要滚动的translateY值
     * @param {Array} time  是transition-duration表示过渡效果需要多少毫秒
     * @param {String | Function} effect transition-timing-function过渡效果的速度曲线
     * @private
     */
    scrollTo: function(translateY, time, effect) {
        if(this.get('isTransition')) {
            effect = effect || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
            setTransitionTimingFunc(this._scroller, effect);
            setTransitionTime(this._scroller, time);
            this._translate(translateY);
        } else {
            effect || (effect = function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            });
            if(time) {
                this._animate(translateY, time, effect);
            } else {
                this._translate(translateY);
            }
        }
        this._translateY = translateY;
    },

    /**
     * 生成列表选项Html
     * @function createListItem
     * @memberOf List
     * @private
     */
    createListItem: function() {
        var itemHtml = '';
        var ds = this.get('datasource');
        var render = Template(this.get('itemTpl'));
        ds && ds.length && ds.forEach(function(item) {
            itemHtml += render(item);
        });
        return itemHtml;
    },

    /**
     * 停止动画
     * @function stopAnimate
     * @memberOf List
     * @private
     */
    stopAnimate: function() {
        var result = this._isAnimating;
        if(this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimate = true;
            this.get('isTransition') && (this._translateY = getTranslateY(this._scroller));
            this.scrollTo(this._translateY, 0);
        }
        return result;
    },

    /**
     * 获取列表项节点
     * @function getItemNode
     * @memberOf List
     * @private
     */
    getItemNode: function(elem) {
        while(elem.length) {
            if(elem.data('role') == 'list-item') {
                return elem;
            } else {
                elem = elem.parent();
                continue;
            }
        }
        return null;
    },

    /**
     * 获取滚动方向
     * @function getOrientation
     * @memberOf List
     */
    getOrientation: function() {
        return this._orientation;
    },

    /**
     * 创建列表选项
     * @function _renderListItem
     * @private
     * @memberOf List
     */
    _renderListItem: function() {
        this._itemWrap.html(this.createListItem());
    },

    /**
     * 设置scroller的translateY值
     * @function _translate
     * @private
     * @param  {Number} translateY 要给scroller设置的translateY值
     * @memberOf List
     */
    _translate: function (translateY) {
        this._scroller[0].style.webkitTransform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this._scroller[0].style.transform = 'translate(0px, ' + translateY + 'px) translateZ(0)';
        this.trigger('scroll', translateY, this._stopAnimate);
    },

 
    /**
     * touchstart事件的处理函数，初始化参数，停止正在进行的动画
     * @function _touchStart
     * @private
     * @param  {HTMLDOMEvent} e touchstart事件的事件对象
     * @memberOf List
     */
    _touchStart: function(e) {

        var target = e.target;
        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._initiated) return;

        if(this.get('activeClass')) {
            var self = this;
            var itemNode = this.getItemNode($(target));
            if(itemNode) {
                self._activeTimer = setTimeout(function() {
                    itemNode.addClass(self.get('activeClass'));
                }, 150);
                this._actived = true;
            }
        }

        this.trigger('beforestart', e);

        setTransitionTime(this._scroller);
        this._isMoving = false;
        this._startTime = +new Date();
        this._stopAnimate = false;
        this.stopAnimate();

        this._startY = this._translateY;
        this._distY = 0;
        this._lastY = e.touches[0].pageY;

        this._lastX = e.touches[0].pageX;
        this._lockScrollY = false;
        this._cancelMove = false;
        this._initiated = true;
    },

    /**
     * touchmove事件的处理函数，处理位移偏移，处理canLockY
     * @function _touchMove
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf List
     */
    _touchMove: function(e) {
        this.get('preventDefault') && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(!this._initiated) return;

        if(this._actived && this.get('activeClass')) {
            this._cancelActive();
            var itemNode = this.getItemNode($(e.target));
            itemNode && itemNode.removeClass(this.get('activeClass'));
            this._actived = false;
        }

        if (!this.trigger('beforemove', e)) {
            this._initiated = false;
            return;
        };

        var translateY,
            timestamp = +new Date(),
            currY = e.touches[0].pageY,
            offsetY = currY - this._lastY;

        this._distY += offsetY;

        // 当滑动超出屏幕，自动触发touchend事件
        if (currY < 0) {
            this._initiated = false;
            if (this._cancelMove) {
                return;
            }
            this._cancelMove = true;
            this._touchEnd(e);
            return;
        }

        if (this.get('canLockY')) {
            // 横向滚动超过比例，锁定纵向滚动
            if (this._lockScrollY) {
                this._initiated = false;
                return;
            }
            var currX = e.touches[0].pageX;
            var offsetX = currX - this._lastX;
            if(Math.abs(this._distY) < 30 && Math.abs(offsetX) / 3 > Math.abs(this._distY)) {
                this._lockScrollY = true;
                this._initiated = false;
                return;
            }
        }

        // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
        // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
        if (timestamp - this._endTime > 300 && Math.abs(this._distY) < 10 ) {
            return;
        }

        this._orientation = offsetY > 0 ? 'up': 'down';
        !this._canScroll && (offsetY = 0);
        translateY = this._translateY + offsetY;
        // 超出滑动容器范围，减少滑动高度
        if (translateY > 0 || translateY < this._maxY) {
            translateY = this._translateY + offsetY / 3;
        }

        this._isMoving = true;
        this._translate(translateY);
        this._translateY = translateY;
        this._lastY = currY;
        if(timestamp - this._startTime > 300) {
            this._startTime = timestamp;
            this._startY = this._translateY;
        }
        this.trigger('aftermove', translateY);
    },

    /**
     * touchend事件的处理函数，添加active样式，处理组件的回弹，滚动到目标位置
     * @function _touchEnd
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf List
     */
    _touchEnd: function(e) {
        var target = e.target;

        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._actived && this.get('activeClass')) {
            this._cancelActive();
            var itemNode = this.getItemNode($(e.target));
            itemNode && itemNode.removeClass(this.get('activeClass'));
            this._actived = false;
        }

        this._initiated = false;
        this._endTime = +new Date();
        var duration = this._endTime - this._startTime;

        if(!this.trigger('beforeend', e)) {
            return;
        };

        // 1. 判断是否滑动回弹，回弹则return
        if(this.resetPosition()) {
            return;
        }

        // 2. 没有滚动
        if(!this._isMoving ) {
            return;
        }

        // 3. 滑动到目标位置
        this.scrollTo(this._translateY);

        // 4. 是否有惯性滑动，有则滑动到计算后的位置
        this._isMoving = false;
        if (duration < 300 && this._canScroll) {
            var momentumY = momentum(this._translateY, this._startY, duration, this._maxY, this._listHeight);
            var newY = momentumY.destination;
            if (newY != this._translateY ) {
                var effect = null;
                if(newY > 0 || newY < this._maxY) {
                    // 惯性滑动中超出边界回弹回来，切换动画效果函数
                    if(this.get('isTransition')) {
                        effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    } else {
                        effect = function (k) {
                            return k * ( 2 - k );
                        };
                    }
                }
                this.scrollTo(newY, momentumY.duration, effect);
            }
            this._isAnimating = true;
        }
    },
    /**
     * 滑动超出最大范围，回弹到终点
     * @function resetPosition
     * @memberOf List
     */
    resetPosition: function () {
        var translateY = this._translateY;
        if(this._canScroll) {
            translateY = translateY> 0 ? 0 : translateY < this._maxY ? this._maxY : translateY;
        }
        if(translateY == this._translateY) {
            return false;
        }
        this._orientation = translateY < 0 ? 'up': 'down';
        this.scrollTo(translateY, 600);
        this._isAnimating = true;
        return true;
    },

    /**
     * transition动画结束后的处理函数
     * @function _transitionEnd
     * @memberOf List
     * @param  {HTMLDOMEvent} e transitionEnd结束时事件对象
     * @private
     */
    _transitionEnd: function(e) {
        if (e.target != this._scroller[0]) {
            return;
        }
        setTransitionTime(this._scroller);
        this._isAnimating = false;
        this.resetPosition();
    },

    /**
     * 不适用transition时的惯性动画函数
     * @function _animate
     * @memberOf List
     * @private
     * @param  {Number} translateY scroller要滚动的目标translateY
     * @param  {Number} time       scorller要滚动到
     * @param  {Function} effect     滚动的效果函数
     */
    _animate: function(translateY, time, effect) {
        var self = this,
            startY = this._translateY,
            startTime = +new Date(),
            destTime = startTime + time;

        function step () {
            var now = +new Date(),
                newY,
                easing;

            if ( now >= destTime ) {
                self._isAnimating = false;
                self._translate(translateY);
                self._translateY = translateY;
                self.resetPosition();
                return;
            }

            now = ( now - startTime ) / time;
            easing = effect(now);
            newY = ( translateY - startY ) * easing + startY;
            self._translateY = newY;
            self._translate(newY);

            if ( self._isAnimating ) {
                self.animateTimer = rAF(step);
            }
        }
        this._isAnimating = true;
        step();
    },

    /**
     * 取消active的timer，用来防止多次点击
     * @function _cancelActive
     * @memberOf List
     * @private
     */
    _cancelActive: function() {
        this._activeTimer && clearTimeout(this._activeTimer);
        this._activeTimer = null;
    }
});

// 滑动惯性计算
function momentum(current, start, time, lowerMargin, wrapperSize, deceleration) {
    var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration;

    // 低版本安卓，降低惯性滑动速度
    var defaultDeceleration = 0.0006;
    $.os.android && $.os.version < '4.4' && (defaultDeceleration = 0.006);

    deceleration = deceleration === undefined ? defaultDeceleration : deceleration;

    destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
    duration = speed / deceleration;

    if ( destination < lowerMargin ) {
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
    } else if ( destination > 0 ) {
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        duration: duration
    };
};

function setTransitionTime(elem, time) {
    time = time || 0;
    elem[0].style.webkitTransitionDuration = time + 'ms';
    elem[0].style.transitionDuration = time + 'ms';
}
function setTransitionTimingFunc(elem, effect) {
    elem[0].style.webkitTransitionTimingFunction = effect;
    elem[0].style.transitionTimingFunction = effect;
}

// 获取元素的translateY
function getTranslateY(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[13] || split[5]));
}

module.exports = List;

    })( module.exports , module , __context );
    __context.____MODULES[ "29aa7a3eccfc48ce987c07fcc1d67442" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "829e23a50a002055e2f4f456e935e485" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['29aa7a3eccfc48ce987c07fcc1d67442']

    })( module.exports , module , __context );
    __context.____MODULES[ "829e23a50a002055e2f4f456e935e485" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "5ab87e2332d7fe98f9a21829e848aacb" ,
        filename : "pagelist.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist"] = "<div class=\"yo-group\">\n    <div class=\"scroll-wrap\" data-role=\"scroller\">\n        <ul class=\"yo-list\" data-role=\"itemwrap\"></ul>\n    </div>\n    <div class=\"no-data\" data-role=\"nodata\"></div>\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist"];

    })( module.exports , module , __context );
    __context.____MODULES[ "5ab87e2332d7fe98f9a21829e848aacb" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "c04eae08a3563bb88610c5af16fe812b" ,
        filename : "pagelist-item.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-item"] = "<li class=\"item\" data-role=\"list-item\" data-index={{dataIndex}}>{{text}}</li>";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-item"];

    })( module.exports , module , __context );
    __context.____MODULES[ "c04eae08a3563bb88610c5af16fe812b" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "e8cd2912133c33b8a443527bd6f96f83" ,
        filename : "pagelist-nodata.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["pagelist-nodata"] = "没有数据,点击刷新";
if (typeof module !== "undefined") module.exports = window.QTMPL["pagelist-nodata"];

    })( module.exports , module , __context );
    __context.____MODULES[ "e8cd2912133c33b8a443527bd6f96f83" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "ea88dfe1e5ef9205361dc10ee9c004ae" ,
        filename : "pagelist.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 分页列表
 * 
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Pagelist
 * @constructor
 * @extends List
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/pagelist/index.html
 */
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var List =__context.____MODULES['829e23a50a002055e2f4f456e935e485'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var ListTpl =__context.____MODULES['5ab87e2332d7fe98f9a21829e848aacb'];
var ItemTpl =__context.____MODULES['c04eae08a3563bb88610c5af16fe812b'];
var NodataTpl =__context.____MODULES['e8cd2912133c33b8a443527bd6f96f83'];
var RefreshTpl =__context.____MODULES['04529342a29eaf1d7d058615384474c1'];
var LoadmoreTpl =__context.____MODULES['2e3673ff7223e51f34f27d5f080bf748'];

var Pagelist = List.extend({
    /**
     * @property {Number} pagesize 每页加载的数据量，默认15条
     * @property {Boolean} useRefresh 是否启用刷新功能，默认为true，开启下来刷新组件
     * @property {Boolean} useLoadmore 是否启用加载更多功能，默认为true，开启上拉加载更多
     * @property {Boolean} infinite 是否加载大量数据，默认为false，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据
     * @property {String} selectedClass 选中后的样式
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为false，true使用css的transition，false使用js动画
     * @property {Object}  nodataViewData  没有数据时默认的数据（如果你传递的nodataTpl需要数据）
     * @property {String} nodataTpl 没有数据的提示模板
     * @property {String} refreshTpl 下拉刷新提示模板
     * @property {String} loadmoreTpl 加载更多提示提示模板
     * @property {Function} compiler 模板引擎，默认为内置的模板引擎，若传值，如要compiler含有config和render方法
     * @memberOf Pagelist
     */
    

    /**
     *
     * @template template
     * 组件的外层模板
     * 必须含有 data-role属性，其中
     * data-role="scroller" 指组件的滚动容器,
     * data-role="itemWrap" 指组件的列表容器,itemTpl解析后会放到这里
     * data-role="nodata" 指组件没有数据时的容器，nodataTpl解析后会放到这里
     * 
     * @memberOf Pagelist
     * @path ./tpl/pagelist.string
     * 
     */
    
    /**
     *
     * @template itemTpl
     * 列表选项的模板，该模板自定义时，itemTpl的模板
     * 必须含有data-role="list-item" 和 data-index={{dataIndex}}两个属性
     * @memberOf Pagelist
     * @path ./tpl/pagelist-item.string
     * 
     */
    
    /**
     *
     * @template refreshTpl
     * 刷新数据时的提示模板
     * @memberOf Pagelist
     * @path ./tpl/pagelist-refresh.string
     */
    
    /**
     *
     * @template loadmoreTpl
     * 加载更多提示提示模板
     * @memberOf Pagelist
     * @path ./tpl/pagelist-loadmore.string
     */
    
    /**
     *
     * @template nodataTpl
     * 没有数据的提示模板
     * @memberOf Pagelist
     * @path ./tpl/pagelist-nodata.string
     */
    

    options: {
        // 每页加载的数据量
        pagesize: 15,
        // 刷新激活高度，一般等于刷新容器的高度
        refreshActiveY: 40,
        // 加载更多激活高度，设置成负数可以提前刷新，正数往下拉更多才刷新
        loadmoreActiveY: 0,
        // 加载更多容器高度，如果自定义了加载更多模板并且改变了高度，需要配置此参数
        loadmoreContY: 40,
        // 刷新结果显示时间，0为不显示刷新结果直接弹回，不等于0会显示刷新成功或刷新失败提示后再弹回
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: true,
        // 是否启用加载更多功能
        useLoadmore: true,
        // 是否加载大量数据，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据（不支持节点高度不一致的情况）
        infinite: false,
        // 列表项高度是否不一致，默认为true，如果列表高度一致，建议设置成false，可以提高性能
        // differentHeight: true,
        // 选中后的样式
        selectedClass: null,
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: false,
        // 没有数据页面默认的数据（如果你传递的nodataTpl需要数据）
        nodataViewData: null,
        // 模板引擎
        compiler: null,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        // 没有数据的提示模板
        nodataTpl: NodataTpl,
        // 刷新数据提示模板
        refreshTpl: RefreshTpl,
        // 加载更多提示提示模板
        loadmoreTpl: LoadmoreTpl,

        // 刷新中，该接口必须调用Pagelist.refresh()方法通知Pagelist数据已加载
        /**
         * 用户下拉列表满足刷新条件时触发的事件
         * @event refresh
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onRefresh: function (pageNum) {},
        // 加载更多中，该接口必须调用Pagelist.loadMore()方法通知Pagelist数据已加载
        /**
         * 用户上拉列表满足加载更多条件时触发的事件
         * @event loadmore
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onLoadMore: function (pageNum) {},
        // 渲染完成后
        /**
         * 渲染完成后触发的事件
         * @event ready
         * @memberOf Pagelist
         */
        onReady: function() {},

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Pagelist
         */
        //onselectitem: function() {}

        // 选项点击事件
        onTap: function(e) {},

        // 切换下拉刷新图标
        onAfterMove: function(translateY) {},

        // 下拉刷新触发判断
        onBeforeEnd: function(e) {},

        // 加载更多触发判断
        onScroll: function(translateY) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Pagelist
     * @private
     */
    init: function() {
        this.initProp();
        this.bindEvents();
    },


    /**
     * 处理组件的内部事件绑定
     * @function bindEvents
     * @memberOf Pagelist
     * @private
     */
    bindEvents: function() {
        // 选项点击事件
        this.on('tap', function(e){
            if(this._tapTimer) {
                return;
            }

            var targetEl = $(e.target);
            var itemEl = $(e.currentTarget);
            var index = itemEl.data('index');
            var selectedClass = this.get('selectedClass');
            if(selectedClass) {
                this._itemWrap.find('.' + selectedClass).removeClass(selectedClass);
                itemEl.addClass(selectedClass);
            }
            this.trigger('selectitem', this.get('datasource')[index], itemEl, targetEl);

            var self = this;
            var interval = this.get('tapInterval') || 0;
            if(interval) {
                this._tapTimer = setTimeout(function() {
                    clearTimeout(self._tapTimer);
                    self._tapTimer = null;
                }, interval);
            }
        });

        // 切换下拉刷新图标
        this.on('aftermove', function(translateY) {
            translateY > 0 && this.get('useRefresh') && !this._refreshing && this._changeRefreshStatus(translateY);
            this._moveWhenLoad = this._refreshing || this._loadmoreing;
        });

        // 下拉刷新触发判断
        this.on('beforeend', function(e) {
            if(this.get('useRefresh') && !this._loadmoreing && this._translateY >= this.get('refreshActiveY')) {
                if(this._refreshing) {
                    this.scrollTo(this.get('refreshActiveY'), 300);
                } else {
                    this._refreshInit();
                }
                return false;
            }

            return true;
        });

        // 加载更多触发判断
        this.on('scroll', function(translateY) {
            if(this._refreshing || this._loadmoreing) return;

            if(this.get('useLoadmore') && this._canLoadmore) {
                // 激活加载更多的translateY，负数
                var activeY = this._maxY - this.get('loadmoreActiveY');
                translateY < 0 && translateY < activeY && this._loadMoreInit();
            }
        });
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Pagelist
     * @private
     */
    render: function() {
        if(!this._isRender){
            this._nodataEl = this.widgetEl.find('[data-role="nodata"]');
            this._nodataEl.on('touchmove', function() {return false;});
            this._nodataRender = this._compiler(this.get('nodataTpl')) || function() {return ''};
            this.reloadNodataView(this.get('nodataViewData'));

            Pagelist.superClass.render.call(this);
            // fix bug: infinite模式下滚动白屏了
            this.scrollTo(0);
            this._infiniteHandler();
            this._createDragIcon();
            this.trigger('ready');
        }
        return this;
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf Pagelist
     */
    destroy: function() {
        if(this._tapTimer) {
            clearTimeout(this._tapTimer);
            this._tapTimer = null;
        }
        Pagelist.superClass.destroy.call(this);
    },

    /**
     * 初始化私有属性
     * @function initProp
     * @memberOf Pagelist
     * @private
     */
    initProp: function() {
        Pagelist.superClass.initProp.call(this);
        this._refreshing = false; // 刷新中
        this._loadmoreing = false; // 加载更多中
        this._pageNum = 1; // 当前页码
        // 支持定义itemRender，来自定义模板引擎
        this._itemRender = this.itemRender || null;
        this._extraHeight = 0;// 滚动容器里，除了列表外其他的元素高度

        this._nodataEl = null;
        this._dragEl = null; // 下拉刷新
        this._endEl = null; // 释放更新
        this._loadEl = null; // 加载中
        this._successEl = null; // 加载成功
        this._failEl = null; // 加载失败
        this._loadmoreEl = null; // 加载更多
        this._endmoreEl = null; // 没有更多

        // 是否可以加载更多，下面条件成立时，_canLoadmore都等于false
        // useLoadmore == false || 加载不到更多数据 || datasource.length < pagesize
        this._canLoadmore = this.get('useLoadmore');

        // 刷新或加载更多时，是否发生了滑动。如果没有滑动，会有默认滚动动作
        this._moveWhenLoad = false;

        // tap事件的定时器
        this._tapTimer = null;

        // 设置模板引擎
        this._compiler = this.get('compiler') || Template;

        // loadmore 最后一次数据
        this._lastMoreData = [];
    },

    /**
     * 生成列表选项Html，覆盖父类方法
     * @function createListItem
     * @memberOf Pagelist
     * @private
     */
    createListItem: function() {
        var self = this;
        var itemHtml = '';
        var ds = this.get('datasource');

        !this._itemRender && (this._itemRender = this._compiler(this.get('itemTpl')));

        ds.length > this.get('pagesize') && console.warn('The length of the data is larger than pagesize.');
        ds && ds.length && ds.forEach(function(item, index) {
            var data = $.extend(true, {}, item);
            data.dataIndex = index;
            itemHtml += self._itemRender(data);
        });
        return itemHtml;
    },

    /**
     * 覆盖父类方法
     * @function initUI
     * @memberOf Pagelist
     * @private
     */
    initUI: function() {
        var ds = this.get('datasource');
        if(!ds || !ds.length) {
            this._nodataEl.show();
            this._scroller.hide();
        } else {
            this._nodataEl.hide();
            this._scroller.show();
        }

        Pagelist.superClass.initUI.call(this);
        this._setLoadmore();
    },

    /**
     * 获得当前组件的是第几页
     * @function getPageNum
     * @memberOf Pagelist
     * @return {Number} 获得当前组件的是第几页
     */
    getPageNum: function() {
        return this._pageNum;
    },

    /**
     * 设置页码
     * @function setPageNum
     * @memberOf Pagelist
     * @param {Number | String} pageNum 设置pagelist的页码
     * @version 0.1.11
     */
    setPageNum: function (pageNum) {
        var _pageNum = parseInt(pageNum, 10);
        if (!isNaN(_pageNum)) {

            this._pageNum = pageNum;
        }
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Pagelist
     */
    resize: function () {
        if(this._isRender){
            // 额外的元素，约定的data-role="extra"
            var extra = this._scroller.find('[data-role="extra"]');
            if(extra.length && this._infiniteElements) {
                var top = 0;
                extra.forEach(function(item) {
                    top += item.offsetHeight;
                });

                if(top != this._extraHeight) {
                    this._extraHeight = top;
                    this._infiniteElements.forEach(function(item) {
                        $(item).css({top: top});
                    });
                }
            }

            var scrollerHeight = null;
            if(this.get('infinite') && this._infiniteElementHeight) {
                scrollerHeight = this._infiniteElementHeight * this.get('datasource').length + this._extraHeight;
            }

            Pagelist.superClass.resize.call(this, scrollerHeight);
        }
    },

    /**
     * 更新列表数据
     * @function updateListItem
     * @memberOf Pagelist
     * @private
     */
    updateListItem: function (data, index) {
        var itemData = $.extend(true, {}, data);
        itemData.dataIndex = index;
        var newItem = $(this._itemRender(itemData));
        var item = this._itemWrap.find('[data-index="' + index + '"]');
        item.html(newItem.html());
    },

    /**
     * 重新渲染没有数据的模板
     * @function reloadNodataView
     * @memberOf Pagelist
     */
    reloadNodataView: function(data) {
        this._nodataEl.html(this._nodataRender(data));
    },

    /**
     * 刷新组件的数据
     * @function refresh
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载是否成功，如果加载数据碰到异常才设置成true
     */
    refresh: function(data, isFail) {
        this._loadEl.hide();
        if(!isFail) {
            this._pageNum = 1;
            this.reload(data);
            this._setLoadmore();
            this._infiniteHandler();
        }
        this._endmoreEl && this._endmoreEl.hide();

        var self = this, delay = this.get('refreshResultDelay');
        var resultEl = isFail ? self._failEl : self._successEl;

        delay && resultEl.show();

        setTimeout(function() {
            delay && resultEl.hide();

            var time = 0;
            // 滑动到原点
            if(!self._moveWhenLoad || (self._moveWhenLoad && self._translateY > 0)) {
                time = 300;
                self.scrollTo(0, time);
            }

            setTimeout(function() {
                self._dragEl.show();
                self._refreshing = false;
                self._moveWhenLoad = false;
            }, time);

        }, delay);
    },

    /**
     * 组件加载更多数据
     * @function loadMore
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载失败，如果加载数据碰到异常才设置成true
     */
    loadMore: function(data, isFail) {
        var isMoreData = data && data.length;
        this._lastMoreData = data;
        this._maxY += this.get('loadmoreContY');
        this._loadmoreEl.hide();
        if(!isFail) {
            if(isMoreData) {
                this._pageNum++;
                var ds = this.get('datasource');
                this.set('datasource', ds.concat(data));
                this.updateData(data);
            }

            // 加载不到更多数据或加载到的数据不足一页
            if(!isMoreData || (isMoreData && data.length < this.get('pagesize'))) {
                this._endmoreEl.show();
                if(isMoreData && this.get('infinite')) {
                    // var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
                    var bottomIndex = this.get('datasource').length - this._lastMoreData.length - 1;
                    var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
                    // var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1);
                    // 校正添加_extra height，修复由此可能造成的样式问题
                    var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1) + (this._extraHeight || 0);
                    this._setTransform(this._moreCont[0], moreContY);
                }
            }
        }

        var self = this,
            delay = isMoreData ? 100 : 500,
            dist = isMoreData ? self._translateY - 20 : self._maxY;

        this.stopAnimate();

        setTimeout(function() {
            if(isMoreData) {
                !self._moveWhenLoad && self.scrollTo(dist, 300);
            } else {
                self.scrollTo(dist, 300);
            }
            setTimeout(function() {
                self._loadmoreing = false;
                self._canLoadmore = (isMoreData && data.length >= self.get('pagesize')) || isFail;
                self._moveWhenLoad = false;
            }, 300);
        }, delay);
    },

    /**
     * 手动模拟刷新列表操作，组件滚动到头部
     * @function simulateRefresh
     * @memberOf Pagelist
     */
    simulateRefresh: function () {
        var self = this;
        var refreshActiveY = this.get('refreshActiveY');
        this.scrollTo(refreshActiveY, 300);
        this._changeRefreshStatus(refreshActiveY);
        setTimeout(function() {
            self._refreshInit();
        }, 300);
    },

    /**
     * 重新加载数据
     * @function reloadData
     * @memberOf Pagelist
     * @param {Array} data 重新加载的数据
     */
    reloadData: function(data) {
        var self = this;
        var handler = function() {
            self._pageNum = 1;
            self.reload(data);
            self._setLoadmore();
            self.scrollTo(0);
            self._resetDragIcon();
            self._infiniteHandler();
        }

        if(this.stopAnimate()) {
            setTimeout(function() {
                handler();
            }, 200)
        } else {
            handler();
        }
    },

    /**
     * 根据数据更新组件item内容，对于infinite和非infinite进行不同的处理
     * @function updateData
     * @memberOf Pagelist
     * @private
     * @param {Array} data 需要更新的数据
     */
    updateData: function (data) {
        if (this.get('infinite')) {
            var update = [], eles = this._infiniteElements;
            // var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
            var bottomIndex = this.get('datasource').length - this._lastMoreData.length - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            // fix bug: 加载更多时用户进行了滚动操作，可能无法取到bottomElem
            if(bottomElem.length) {
                var firstTop = bottomElem[0]._top;
                for(var i = 0 ; i < eles.length; i++) {
                    if(eles[i]._top >= firstTop) {
                        update.push(this._infiniteElements[i]);
                    }
                }
                this._updateContent(update);
            }
        } else {
            var self = this;
            var ds = this.get('datasource');
            var leng = ds.length;
            var dataLength = 0;
            var html = '';
            data && (dataLength = data.length) && data.forEach(function(item, index) {
                var data = $.extend(true, {}, item);
                data.dataIndex = index + (leng - dataLength);
                html += self._itemRender(data);
            });
            self._itemWrap.append(html);
        }
        this.resize();
    },

    /**
     * 覆盖父类方法,超出刷新激活高度后回弹到激活高度,而不是0
     * @function resetPosition
     * @memberOf Pagelist
     * @private
     */
    resetPosition: function () {
        if(this._refreshing && this._translateY == this.get('refreshActiveY')) {
            return false;
        } else if(this._loadmoreing && this._translateY == this._maxY - this.get('loadmoreContY')) {
            return false;
        }

        var isReset = Pagelist.superClass.resetPosition.call(this);
        isReset && (this._moveWhenLoad = true);
        return isReset;
    },

    /**
     * 无限循环处理
     * @function _infiniteHandler
     * @memberOf Pagelist
     * @private
     */
    _infiniteHandler: function() {
        if(!this.get('infinite')) return;

        this._infiniteElements = this._itemWrap.find('[data-role="list-item"]');
        if(!this._infiniteElements.length) return;

        var top = this._extraHeight;
        this._infiniteElements.forEach(function(item) {
            $(item).css({
                position: 'absolute',
                top: top,
                left: 0,
                width: '100%'
            });
        });

        this._infiniteElementHeight = this._infiniteElements.first().height();
        var elementsPerPage = Math.ceil(this._listHeight / this._infiniteElementHeight);
        // 列表项个数由容器高度决定,而不是pagesize
        this._infiniteLength = elementsPerPage + 3;
        var itemLeng = this.get('datasource').length;
        // 数据量小的情况下，列表项个数由数据决定（不满一屏）
        itemLeng < this._infiniteLength && (this._infiniteLength = itemLeng);

        for(var i = this._infiniteLength; i < this._infiniteElements.length; i++) {
            this._itemWrap[0].removeChild(this._infiniteElements[i]);
        }

        this._infiniteHeight = this._infiniteLength * this._infiniteElementHeight;
        // 2147483645 数组长度限制  Math.pow(2, 32) - 1
        this._infiniteLimit = Math.floor(2147483645 / this._infiniteElementHeight);
        this._infiniteUpperBufferSize = Math.max(Math.floor((this._infiniteLength - elementsPerPage) / 2), 0);

        this.resize();

        this._reorderInfinite();

        this.on('scroll', function(translateY) {
            translateY < 0 && translateY > this._maxY && this._reorderInfinite();
        });
    },

    /**
     * 处理无限循环计算节点位置的逻辑
     * @function _reorderInfinite
     * @memberOf Pagelist
     * @private
     */
    _reorderInfinite: function() {
        // 小相位 当前要展示的item，所在所有波段中的位置，第n个
        // 大相位 当前展示的波段属于整体波段中的第n个，即第n屏
        // 相位   当前item，所在当前波段中的位置
        var minorPhase = Math.max(Math.floor((-this._translateY - this._extraHeight) / this._infiniteElementHeight) - this._infiniteUpperBufferSize, 0),
            majorPhase = Math.floor(minorPhase / this._infiniteLength),
            phase = minorPhase - majorPhase * this._infiniteLength;

        var top = 0;
        var i = 0;
        var update = [];

        //用this._infiniteElements[i]先临时hack主从scroll事件来的调用
        //之后会统一梳理所有的属性和变量
        while ( i < this._infiniteLength  && this._infiniteElements[i]) {
            top = i * this._infiniteElementHeight + majorPhase * this._infiniteHeight;

            if ( phase > i ) {
                top += this._infiniteElementHeight * this._infiniteLength;
            }

            if ( this._infiniteElements[i]._top !== top ) {
                this._infiniteElements[i]._phase = top / this._infiniteElementHeight;

                if ( this._infiniteElements[i]._phase < this._infiniteLimit ) {
                    this._infiniteElements[i]._top = top;
                    update.push(this._infiniteElements[i]);
                }
            }

            i++;
        }

        update.length && this._updateContent(update);
    },

    /**
     * 根据节点上的相位信息和data信息更新组件的属性和内容
     * @function _updateContent
     * @memberOf Pagelist
     * @param {HTMLElement} els 需要更新的节点
     * @private
     */
    _updateContent: function(els) {
        // TODO 缓存节点，一次批量更新多个节点测试性能
        var self = this, ds = this.get('datasource');
        var exclude = ['data-role', 'data-index', 'style'];
        els.forEach(function(elem) {
            var index = elem._phase, data = ds[index];
            if(data) {
                self._setTransform(elem, elem._top);
                var itemData = $.extend(true, {}, data);
                itemData.dataIndex = index;
                elem.setAttribute('data-index', index);
                var itemHtml = self._itemRender(itemData);

                // 更新dom属性
                for(var key in elem.attributes) {
                    if(elem.attributes.hasOwnProperty(key)) {
                        var name = elem.attributes[key].name;
                        if(exclude.indexOf(name) == -1) {
                            var val = elem.attributes[key].value;
                            var res = itemHtml.match(getAttrRegexp(name));
                            if(res && res.length == 2 && res[1] != val) {
                                elem.attributes[key].value = res[1];
                            }
                        }
                    }
                }

                // 去除item节点自己
                elem.innerHTML = itemHtml.substring(itemHtml.indexOf('>') + 1, itemHtml.lastIndexOf('</')).trim();
            }
        });
    },

    /**
     * 设置节点的translateY值
     * @function _setTransform
     * @private
     * @memberOf Pagesize
     * @param {HTMLElement} el 需要设置的节点
     * @param {Number} y  需要设置的translateY值
     */
    _setTransform: function(el, y) {
        el.style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0)';
        el.style.transform = 'translate(0px, ' + y + 'px) translateZ(0)';
    },

    /**
     * 是否允许加载更多功能
     * @function _setLoadmore
     * @memberOf Pagelist
     * @private
     */
    _setLoadmore: function() {
        var ds = this.get('datasource');
        if(ds && ds.length) {
            if(ds.length >= this.get('pagesize')) {
                this._canLoadmore = true;
            } else {
                this._canLoadmore = false;
            }
        }
    },

    /**
     * 创建刷新和加载更多的操作图标
     * @function _createDragIcon
     * @memberOf Pagelist
     * @private
     */
    _createDragIcon: function() {
        if(this.get('useRefresh')) {
            var rh = this.get('refreshActiveY');
            var refreshContainer = $(this.get('refreshTpl'));
            refreshContainer.css({height: rh + 'px', lineHeight: rh + 'px', top: -rh}).appendTo(this._scroller);

            var child = refreshContainer.children();
            this._dragEl = child[0] && $(child[0]).show();
            this._endEl = child[1] && $(child[1]).hide();
            this._loadEl = child[2] && $(child[2]).hide();
            this._successEl = child[3] && $(child[3]).hide();
            this._failEl = child[4] && $(child[4]).hide();

            this._dragIcon = $(this._dragEl.children()[0]);
            this._endIcon = $(this._endEl.children()[0]);
            this._changeRefreshAnimate('down');
        }
        if(this.get('useLoadmore')) {
            var mh = this.get('loadmoreContY');
            var moreContainer = this._moreCont = $(this.get('loadmoreTpl'));
            // fix bug: infinite模式下，moreContainer的位置需要调整，否则会遮住item项
            if(this.get('infinite')) {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', top: -mh, bottom: 0}).appendTo(this._scroller);
            } else {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', bottom: -mh}).appendTo(this._scroller);
            }

            var child = moreContainer.children();
            this._loadmoreEl = child[0] && $(child[0]).hide();
            this._endmoreEl = child[1] && $(child[1]).hide();
        }
    },

    /**
     * 重置拖拽显示的icon
     * @function _resetDragIcon
     * @memberOf Pagelist
     * @private
     */
    _resetDragIcon: function() {
        if (this.get('useRefresh')) {
            this._dragEl.show();
            this._endEl.hide();
            this._loadEl.hide();
            if(this.get('refreshResultDelay')) {
                this._successEl.hide();
                this._failEl.hide();
            }
        }
        if(this.get('useLoadmore')) {
            this._loadmoreEl.hide();
            this._endmoreEl.hide();
        }
    },

    /**
     * 根据translateY改变刷新的显示状态（下拉刷新or释放更新）
     * @function _changeRefreshStatus
     * @memberOf Pagelist
     * @param {Number} translateY translateY的偏移
     * @private
     */
    _changeRefreshStatus: function (translateY) {
        var activeY = this.get('refreshActiveY');

        if (translateY >= activeY) {
            if(this._dragEl[0].style.display != "none") {
                this._dragEl.hide();
                this._endEl.show();
                this._changeRefreshAnimate('up');
            }
        } else if(translateY < activeY && translateY > 0) {
            if(this._dragEl[0].style.display == "none") {
                this._dragEl.show();
                this._endEl.hide();
                this._changeRefreshAnimate('down');
            }
        }
    },

    /**
     * 根据direction改变icon的样式
     * @function _changeRefreshAnimate
     * @memberOf Pagelist
     * @param {String} direction 方向，上为up下位down
     * @private
     */
    _changeRefreshAnimate: function (direction) {
        if(direction == 'up') {
            iconAnimate(this._dragIcon, 'addClass', true);
            iconAnimate(this._endIcon, 'removeClass');
        } else {
            iconAnimate(this._dragIcon, 'removeClass');
            iconAnimate(this._endIcon, 'addClass', false);
        }
    },

    /**
     * refresh状态初始化
     * @function _refreshInit
     * @memberOf Pagelist
     * @private
     */
    _refreshInit: function() {
        this._refreshing = true;
        this._dragEl.hide();
        this._endEl.hide();
        this._loadEl.show();
        this._changeRefreshAnimate('down');
        this.scrollTo(this.get('refreshActiveY'), 200);

        var self = this;
        setTimeout(function() {
            self.trigger('refresh', this._pageNum);
        }, 300);
    },

    /**
     * loadMore状态初始化
     * @function _loadMoreInit
     * @memberOf Pagelist
     * @private
     */
    _loadMoreInit: function() {
        this._loadmoreing = true;
        if (this.get('infinite')) {
            this._moreCont.css({top: 0, buttom: 0});
            // var bottomIndex = this.get('pagesize') * this._pageNum - 1;
            var bottomIndex = this.get('datasource').length - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            var _top = bottomElem.length ? bottomElem[0]._top : 0;
            var moreContY = _top + this._infiniteElementHeight + this._extraHeight;
            this._setTransform(this._moreCont[0], moreContY);
        }
        this._loadmoreEl.show();
        this._endmoreEl.hide();
        this._maxY -= this.get('loadmoreContY');
        this.trigger('loadmore', this._pageNum);
    }
});

/**
 * 添加下拉刷新和释放更新的动画
 *
 * @param elem 元素
 * @param action 操作，add || remove
 * @param positive 正负
 */
function iconAnimate(elem, action, positive) {
    var style = action == 'addClass' ? (positive ? 'rotate(180deg)' : 'rotate(-180deg)') : '';
    elem[0].style.webkitTransform = style;
    elem[0].style.transform = style;
}

function getAttrRegexp(key) {
    return new RegExp( key + '="(.+?)"')
}

module.exports = Pagelist;

    })( module.exports , module , __context );
    __context.____MODULES[ "ea88dfe1e5ef9205361dc10ee9c004ae" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "3fd23ba05c908b38c2dbf8905bcf8380" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['ea88dfe1e5ef9205361dc10ee9c004ae']

    })( module.exports , module , __context );
    __context.____MODULES[ "3fd23ba05c908b38c2dbf8905bcf8380" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "56f9249b795cc5503b74d2d73077ad14" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["pagelist"] = __context.____MODULES['3fd23ba05c908b38c2dbf8905bcf8380'];
module.exports = obj["pagelist"];

    })( module.exports , module , __context );
    __context.____MODULES[ "56f9249b795cc5503b74d2d73077ad14" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "e043f2686c14ccae31ca6c2e64b3df50" ,
        filename : "overlay.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["overlay"] = "<div class=\"{{uiClass}}\">{{content}}</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["overlay"];

    })( module.exports , module , __context );
    __context.____MODULES[ "e043f2686c14ccae31ca6c2e64b3df50" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "2d3c12a5f27393892fff6130acff491d" ,
        filename : "mask.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["mask"] = "<div class=\"yo-mask \"></div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["mask"];

    })( module.exports , module , __context );
    __context.____MODULES[ "2d3c12a5f27393892fff6130acff491d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "556430f1dec546d081eee313fcb44e95" ,
        filename : "overlay.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    
/**
 * 浮层的基类
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Overlay
 * @constructor
 * @extends Widget
 * @category primary
 */

var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var OverlayTpl =__context.____MODULES['e043f2686c14ccae31ca6c2e64b3df50'];


var MaskTpl =__context.____MODULES['2d3c12a5f27393892fff6130acff491d'];
var Overlay = Widget.extend({

    /**
     * @property {String} width 宽度字符串，如：36px，默认不传
     * @property {String} height 高度字符串，如：36px，默认不传
     * @property {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
     * @property {Boolean} hasMask 是否有遮罩，默认为true
     * @property {Boolean} effect 当前组件是否有动画效果，默认为false
     * @property {String} maskTpl 遮罩的模板字符串
     * @property {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
     * @memberOf Overlay
     */
    
    /**
     * @event {function} show 组件显示时触发的事件
     * @event {function} hide 组件隐藏时触发的事件
     * @memberOf Overlay
     */
    
    /**
     * 右侧确定按钮点击时触发的事件
     * @event ok
     * @memberOf Overlay
     */
    
    /**
     * 左侧取消按钮点击时触发的事件
     * @event cancel
     * @memberOf Overlay
     */
    options: {
        width: null,
        height: null,
        zIndex: 3001,//mask 99
        hasMask: true,
        template: OverlayTpl,
        visiable: false,
        type: 'overlay',
        effect: null,
        maskTpl: null,
        maskOffset: [0, 0]
    },

    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Overlay
     * @private
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function (tpl) {
    
        
        this.content = this.get('content') || '';
        // debugger
        return Template(tpl || OverlayTpl, {
            uiClass: this.getClassName(),
            content: this.content
        });
        
        
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Overlay
     */
    resize: function () {
    },


    /**
     * 组件当前是否有遮罩
     * @function _hasMask
     * @memberOf Overlay
     * @private
     * @return {Boolean} 当前组件是否有mask
     */
    
    _hasMask : function () {
        return this.hasMask && this.mask && this.mask.length;
    },


    /**
     * 显示组件
     * @function show
     * @memberOf Overlay
     */
    show: function () {
        if (!this._isRender) {
            this.render();
            if (this._hasMask()) {
                
                this.mask.css('display', 'block'); 
            }
        }
        
        
        

        this.visiable = true;
        if (this._hasMask()) {
            this.mask.css('display', 'block');
        }
        
        
        this.widgetEl.css('display', this.displayStyle);
        var effect = this.get('effect');
        if (effect) {
            this.widgetEl.addClass('ani fade-in');
        }
        this.trigger('show');
        this.resize();
        
    },

    /**
     * 隐藏组件
     * @function hide
     * @memberOf Overlay
     */
    hide: function () {
        this.visiable = false;
        
        
        var effect = this.get('effect');
        if (effect) {
            
            this.widgetEl.addClass('fade-out');
        }
        else {
            this.widgetEl.css('display', 'none');    
        }
        if (this._hasMask()) {
            this.mask.css('display', 'none');
            
        }

        
        this.trigger('hide');
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Overlay
     * @private
     */
    init: function () {
        
        this.hasMask = this.get('hasMask');
        this.zIndex = this.get('zIndex') || 3001;
        this.useYo = !!this.get('yo');

        // this.parentNode = this.get('parentNode');

    },
   

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Overlay
     */
    render: function () {
        Overlay.superClass.render.call(this);
        

        this.initProp();

        this.initUi();
        
    },

    /**
     * 处理组件样式
     * @function initUi
     * @memberOf Overlay
     * @private
     */
    initUi: function () {

        if (!this._hasMask()) {

            this.mask = this.get('maskTpl') || MaskTpl;
            this.mask = $(this.mask);

        }

        this.maskOffset = this.get('maskOffset') || [0, 0];
        this.widgetEl.css('z-index', this.zIndex);
        if (this._hasMask()) {
            var maskHeight = Math.max($(document.documentElement).height(), $(document.body).height(), window.innerHeight);
            this.mask.css({
                'z-index': (this.zIndex - 1),
                'position': 'absolute',
                'display': 'none',
                'top': (0 + this.maskOffset[0]),
                'bottom': (0 + this.maskOffset[1]),
                'left': 0,
                'right': 0,
                'height': maskHeight + 'px'
            });
            

            var maskClass = this.useYo ? 'yo-' : 'ui-';
            maskClass += 'mask';
            this.mask.addClass(maskClass);
            // debugger
            this.mask.insertBefore(this.widgetEl);
        }
        var width = this.get('width');
        if (width) {
            this.widgetEl.css('width', width);
        }
        var height = this.get('height');
        if (height) {
            this.widgetEl.css('height', height);
        }
        // debugger
        
        
        this.displayStyle = this.widgetEl.css('display');
        // debugger
    },

    /**
     * 初始化组件与ui相关的属性
     * @function initProp
     * @memberOf Overlay
     * @private
     */
    initProp: function () {
        
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf  Overlay
     */
    destroy : function () {

        if (this.hasMask && this.mask) {
            
            this.mask.remove();
        }
        
        Overlay.superClass.destroy.call(this);
    }

});


module.exports = Overlay;


    })( module.exports , module , __context );
    __context.____MODULES[ "556430f1dec546d081eee313fcb44e95" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "d79271f5e1db960ae5a5827a5ebf276d" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['556430f1dec546d081eee313fcb44e95'];


    })( module.exports , module , __context );
    __context.____MODULES[ "d79271f5e1db960ae5a5827a5ebf276d" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "5af0d735d928064b6db94e75d2b9d406" ,
        filename : "dialog.string" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    if (typeof window.QTMPL === "undefined") window.QTMPL = {};
window.QTMPL["dialog"] = "<div class=\"{{uiClass}} yo-dialog\">\n    {{#if header}}\n    <header class=\"hd\">\n        {{#if header.title}}\n        <h2 class=\"title \">{{header.title}}</h2>\n        {{/if}}\n        {{#if header.cancelBtn}}\n        <span class=\"regret \" data-role=\"close\" >{{header.cancelBtn.text}}</span>\n        {{/if}}\n        {{#if header.okBtn}}\n        <span class=\"affirm \" data-role=\"ok\" >{{header.okBtn.text}}</span>\n        {{/if}}\n    </header>\n    {{/if}}\n    {{#if content}}\n    <div class=\"bd \" data-role=\"content\">\n        {{content}}\n    </div>\n    {{/if}}\n    {{#if footer}}\n    <footer class=\"ft\">\n        {{#if footer.cancelBtn}}\n        <a href=\"javascript:void(0)\" class=\"yo-btn yo-btn-dialog yo-btn-l \" data-role=\"close\" >{{footer.cancelBtn.text}}</a>\n        {{/if}}\n        {{#if footer.okBtn}}\n        <a href=\"javascript:void(0)\" class=\"yo-btn yo-btn-dialog yo-btn-l \" data-role=\"ok\">{{footer.okBtn.text}}</a>\n        {{/if}}\n    </footer>\n    {{/if}}\n</div>";
if (typeof module !== "undefined") module.exports = window.QTMPL["dialog"];

    })( module.exports , module , __context );
    __context.____MODULES[ "5af0d735d928064b6db94e75d2b9d406" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "56151ba88114b8fee7274db4afb0b15a" ,
        filename : "dialog.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 弹层组件
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Dialog
 * @constructor
 * @extends Overlay
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/dialog/index.html
 */
var Overlay =__context.____MODULES['d79271f5e1db960ae5a5827a5ebf276d'];
var DialogTpl =__context.____MODULES['5af0d735d928064b6db94e75d2b9d406'];
var Template =__context.____MODULES['9e11d69af7743de93f8c257f13101434'];
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];


var CONTENT_CLASSNAME = 'js-dialog-content';
var TITLE_CLASSNAME = 'js-dialog-title';

var Dialog = Overlay.extend({

    /**
     * @property {Obejct} styleObj 样式对象，默认为空，不为空将添加到组件根节点上
     * @property {String} align 排列方式，默认为center，center，bottom，top
     * @property {Boolean} hasMask 是否有模板，默认为true
     * @property {String | HTMLElement} content 模板的内容字符串或者html片段
     * @property {String} title 标题
     * @memberOf Dialog
     */
    
  
    options: {
        type: 'dialog',
        stylesObj: {},
        align: 'center',
        hasMask: true,
        content: '',
        title: '',
        template: DialogTpl,
        // header: {
        //     cancelBtn: {
        //         text: '取消'
        //     },
            
        //     okBtn: {
        //         text: '保存'
        //     }
        // },
        // footer: {
        //     cancelBtn: {
        //         text: '取消'
        //     },
        //     okBtn: {
        //         text: '保存'
        //     }
        // },
        events : {
            'tap [data-role=close]' : function (event) {
                var btn = event.target;
                var status = this.trigger('cancel', btn);
                if(status !== false){
                    this.onCancelHandler();
                }
            },
            'tap [data-role=ok]': function (event) {
                var btn = event.target;
                var btn = event.target;
                var status = this.trigger('ok', btn);
                if(status !== false){
                    this.onOkHandler();
                }
            }
        },
        /**
         * 右侧确定按钮点击时触发的事件
         * @event ok
         * @memberOf Dialog
         */
        onok: function () {
            
        },
        /**
         * 左侧确定按钮点击时触发的事件
         * @event cancel
         * @memberOf Dialog
         */
        oncancel: function () {
            
        }
        
    },
    
    /**
     * 点击确定按钮事件处理函数
     * @function onOkHandler
     * @memberOf Dialog
     */
    onOkHandler: function () {
        
        this.hide();
        // btn.disabled = false;
        
    },

    /**
     * 点击取消按钮事件处理函数
     * @function onOkHandler
     * @memberOf Dialog
     */
    onCancelHandler: function () {
        
        this.hide();
        // btn.disabled = false;

    },
    
    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Dialog
     * @private
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function (tpl) {


        
        this.title = this.get('title');
        this.content = this.get('content') || '';

        this.header = this.get('header');// || {};

        if (this.header ||  this.title) { //有header或者有title那么设置headder对象
            this.header = this.header || {};
            this.header.title = this.header.title || this.title;
        }
        
        this.footer = this.get('footer') || {};
        
        return Template(tpl || DialogTpl, {
            uiClass: this.getClassName(),
            content: this.content,
            
            header: this.header,
            footer: this.footer
        });
        
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Dialog
     */
    resize: function () {
        this.initUi();
        if (this._hasMask()) {
            this.mask.css('display', 'block');
        }
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Dialog
     * @private
     */
    init: function () {
        Dialog.superClass.init.call(this);
        // this.btnState = [];
    },


    /**
     * 获取dialog组件的内容节点
     * @function getContent
     * @memberOf Dialog
     * @return {HTMLElement} 组件的内容节点
     */
    getContent: function () {
        return this.widgetEl.find('[data-role="content"]');
    },

    /**
     * 设置组件的content
     * @function setContent
     * @param {String | HTMLElement} newContent 将要设置的内容
     * @memberOf Dialog
     */
    setContent: function (newContent) {
        this.set('content', newContent);
        
        this.widgetEl.find('[data-role="content"]').html(newContent);
    },
    /**
     * 初始化组件的ui样式
     * @function initUi
     * @memberOf Dialog
     */
    initUi: function () {
        
        
        Dialog.superClass.initUi.call(this);
        this._init = true;
        
        
        
        var align = this.get('align') || 'center';

        var dialogOffset = this.widgetEl.offset();
        var viewportOffset = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        
        this.widgetEl.css('position', 'fixed');
        
        var left = (viewportOffset.width - dialogOffset.width) / 2;

        switch (align) {
        case 'center': 
            this.widgetEl.css({
                'left': left + 'px',
                'top': (viewportOffset.height - dialogOffset.height) / 2 + 'px'
            });
            
            break;
        case 'top':
            this.widgetEl.css({
                'left': left + 'px',
                'top': 0
            });
            break;
        case 'bottom':
            var top = 0;
            if (dialogOffset.height < viewportOffset.height) {
                top = viewportOffset.height - dialogOffset.height;
            }
            this.widgetEl.css({
                'left': left + 'px',
                'top': top
            });
            break;
        default:
            break;
        }
        var stylesObj = this.get('stylesObj');
        if (stylesObj) {
            this.widgetEl.css(stylesObj);
        }
    }
    
});
module.exports = Dialog;


    })( module.exports , module , __context );
    __context.____MODULES[ "56151ba88114b8fee7274db4afb0b15a" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "1940106703ae84aadcf797b941220e74" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports = __context.____MODULES['56151ba88114b8fee7274db4afb0b15a'];


    })( module.exports , module , __context );
    __context.____MODULES[ "1940106703ae84aadcf797b941220e74" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "8e76da5bbe510846ae22eb7319bad5fd" ,
        filename : "alert.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Alert
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/alert/index.html
 */
var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Dialog =__context.____MODULES['1940106703ae84aadcf797b941220e74'];
var Widget =__context.____MODULES['727699dca154f9ef72d5e879dadfb5a5'];


var Alert = Widget.extend({

    /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {String| HTMLElement} content 弹窗的内容
     * @property {String}  extraClass 会额外添加到组件根节点的样式
     * @property {Boolean} align 组件的对齐方式，center、bottom、top，默认为center
     * @property {Boolean} resizable 是否会根据窗口大小重新调整位置，默认为true
     * @property {String| HTMLElement} okText 确定按钮的文案
     * @memberOf Alert
     */
    
   
    options: {
        type: 'alert',
        content: '内容',
        align: 'center',
        hasMask: true,
        resizable: true,
        okText: '确定',
        /**
         * 按钮点击触发的事件
         * @event ok
         * @memberOf Alert
         */
        onok: function () {}
    },
    
    /**
     * 处理组件数据
     * @function init
     * @memberOf Alert
     * @private
     */
    init: function() {
        var widget = this;
        Alert.superClass.init.call(this);
        
        this._opt = {
            content: this.get('content'),
            extraClass: this.get('extraClass') || '',
            align: this.get('align'),
            hasMask: this.get('hasMask'),
            resizable: this.get('resizable'),
            stylesObj: this.get('stylesObj'),
            footer: {
                okBtn: {
                    text: this.get('okText')
                }
            }
        };
        if (this.get('title')) {
            this._opt.header = {};
            this._opt.header.title = this.get('title');
        }

        if (this.get('template')) {
            this._opt.template = this.get('template');
        }
        this._isShow = false;
        this._isRender = false;
    },
    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Alert
     * @example
     * var widget = new Alert({
     *     content: 'i am Alert'
     * });
     * widget.on('ok', function() {
     *     console.log('ok')
     * });
     * widget.render();
     * 
     */
    render: function() {
        var widget = this;
        var dialog;
        dialog = new Dialog(this._opt);
        dialog.on('ok', function(event) {
            var ret = widget.trigger('ok', event);
            if (ret === false) {
                return false;
            }
        });
        dialog.on('hide', function(event){
            widget.trigger('hide', event);
            widget._isShow = false;
        })
        dialog.render();
        dialog.resize();
        this.widgetEl = dialog.widgetEl;
        this._widgetMap['dialog'] = dialog;
        this._isShow = true;
        this._isRender = true;
    },
    /**
     * 显示组件
     * @function show
     * @memberOf Alert
     */
    show: function() {
        //【TODO】 判断组件是否已经销毁
        if (!this._isRender) {
            this.render();
        } else if (!this._isShow) {
            this._isShow = true;
            this._widgetMap['dialog'].show();
        }
    },

    /**
     * 显示组件
     * @function hide
     * @memberOf Alert
     */
    hide: function() {
        if (this._isShow) {
            this._isShow = false;
            this._widgetMap['dialog'].hide();
        }
    },
    /**
     * 设置组件的content
     * @function setContent
     * @param {String | HTMLElement} newContent 将要设置的内容
     * @memberOf Alert
     */
    setContent: function(newContent) {
        this.set('content', newContent);
        this._widgetMap['dialog'].setContent(newContent);
    },
    
    /**
     * 获取dialog组件的内容节点
     * @function getContent
     * @memberOf Alert
     * @return {HTMLElement} 组件的内容节点
     */
    getContent: function() {
        return this._widgetMap['dialog'].getContent();
    },
    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Alert
     */
    resize: function() {
        this._widgetMap['dialog'].resize();
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf Alert
     */
    destroy: function(){
        this._isShow = false;
        this._widgetMap['dialog'].destroy();
    }

});


var alert = null;

var DEFAULT = {
    force: true
};
/**
 * Alert的静态方法显示组件的单例，此方法内部实现单例
 * @function Alert.show
 * @static
 * @param  {Object} opt 单例属性与属性一致
 * @paramDetails {String| HTMLElement} opt.force  是否强制销毁后再重建
 * @paramDetails {String| HTMLElement} opt.content 弹窗的内容
 * @paramDetails {String}  opt.extraClass 会额外添加到组件根节点的样式
 * @paramDetails {Boolean} opt.align 组件的对齐方式，center、bottom、top，默认为center
 * @paramDetails {Boolean} opt.resizable 是否会根据窗口大小重新调整位置，默认为true
 * @paramDetails {String| HTMLElement} opt.okText 确定按钮的文案
 * @memberOf Alert
 * @example
 * Alert.show({
 *     content: 'aaa',
 * });
 */
Alert.show = function(opt) {
    //初始化单例配置
    var _opt = $.extend({}, DEFAULT, opt);
    if (alert == null) {
        alert = new Alert(_opt);
        
        alert.show();
    } else if (_opt && _opt.force) {
        
        Alert.hide();
        Alert.show(_opt);
    }
};
/**
 * Alert的静态方法隐藏组件的单例
 * @function Alert.hide
 * @static
 * @memberOf Alert
 */
Alert.hide = function () {
    if (!!alert) {
        alert.hide();
        alert.destroy();
        alert = null;
    }
};
/**
 * Alert的静态方法销毁组件的单例
 * @function Alert.destroy
 * @static
 * @memberOf Alert
 */
Alert.destroy = function () {
    if (!!alert) {
        alert.destroy();
        alert = null;
    }
}
module.exports = Alert;

    })( module.exports , module , __context );
    __context.____MODULES[ "8e76da5bbe510846ae22eb7319bad5fd" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "a3457ccc2a71118d5547c6c33e7e4b04" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['8e76da5bbe510846ae22eb7319bad5fd']

    })( module.exports , module , __context );
    __context.____MODULES[ "a3457ccc2a71118d5547c6c33e7e4b04" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "0646ed2e65ff8ef98f2fa447d60a1bfb" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["alert"] = __context.____MODULES['a3457ccc2a71118d5547c6c33e7e4b04'];
module.exports = obj["alert"];

    })( module.exports , module , __context );
    __context.____MODULES[ "0646ed2e65ff8ef98f2fa447d60a1bfb" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "61953748002700d86543eecb43af5cea" ,
        filename : "slidermenu.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * 
 * @author  sharon.li<xuan.li@qunar.com>
 */
/**
 * 左右滑动菜单项，可做列表的删除等操作
 * 组件的模板，用户自定义模板时data-role属性是必须的，
 * data-role="slideMenuItem"是整个item节点，
 * data-role="slideMenuCnt"是指可被滑动的节点，
 * data-role="slideMenuAction"是提供操作的区域，比如删除，查看详情等
 * @author  sharon.li <xuan.li@qunar.com>
 * @class SliderMenu
 * @constructor
 * @extends Base
 * @category tool
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/slidermenu/index.html
 */

var $ =__context.____MODULES['897499f6c44f901ecc6fd2b84da5b878'];
var Base =__context.____MODULES['ba335bae023b1e48c033d17d911cf60a'];

var DIRECTION = {
    LEFT: -1,
    RIGHT: 1 
};

var SliderMenu = Base.extend({

    /**
     * @property {HTMLElement} container @require组件作用的节点，节点内的列表才能左右滑动，默认body
     * @property {String} menuItemTag 默认滑动条目的data-role类型，默认slideMenuItem
     * @property {String} menuActionTag 默认滑动后出现的可操作的节点的data-role类型，默认为slideMenuAction
     * @property {String} menuContentTag 默认可滑动的节点的data-role类型，默认为slideMenuCnt
     * @property {String} unit 滑动单位
     * @property {Boolean} use3d 是否开启GPU加速，默认为true
     * @property {Boolean} cancelTapBubble 是否组织tap事件冒泡，默认为false
     * @property {Number} allowance 改变组件状态的滑动距离，默认为50
     * @property {Boolean} exclusive 是否开启同一容器内所有条目滑动互斥，默认为true
     * @property {Boolean} lockY 是否在横向滑动的时候讲禁止纵向滑动，与pagelist组合使用时，默认为false,需要设置为true
     *  
     * @memberOf SliderMenu
     */
    


    options: {
        container: document.body,
        menuItemTag: 'slideMenuItem',
        menuActionTag: 'slideMenuAction',
        menuContentTag: 'slideMenuCnt',
        direction: DIRECTION.LEFT,
        unit: 'px',//默认transform的单位
        /**
         * 用户点击组件可操作区域时触发的事件
         * @event tap
         * @param  {HTMLElement} targetEl 点击的target
         * @memberOf SliderMenu
         */
        ontap: function (targetEl) {},
        use3d: true,
        cancleTapBubble: false,
        allowance: 50,
        disabled: false,
        exclusive: true,//是否全局open互斥，默认为false不互斥
        lockY: false,
        width: null//允许滑动的宽度，如果不传则为ation节点的宽
    },
    _setX: function (el, x) {
        

        var str = 'translateX(' + x + 'px )';
        if (this.get('use3d')) {
            str += this.translatez;
        }
        el.style['-webkit-transform'] = str;
        // console.log('str=' + str);
        el.x = x;
      
    },
    
    _getX: function (el) {
        
        // debugger
        var transform = el.style['transform'] || el.style['-webkit-transform'];
        
        var match = transform.match(/translateX\(([\-\.0-9]+)px\)/);
        var y = 0;
        if (match && match.length > 1) {
            y = match[1];
        }
        y = parseInt(y, 10);
        return y;
    },
    _renderEvent: function () {
        
        var widget = this;

        this.container.on('tap', this._getTag(this.menuActionTag), function (e) {


            
            if (!!widget.cancleTapBubble) {
                e.stopPropagation();
            }
            widget.trigger('tap', e.target);

            return false;
        });
        
        this.container.on(
            'tap',
            this._getTag(this.menuContentTag),
            function (e) {
                // console.log('widget.waitingTap=' + widget.waitingTap);
                var el = this;
                if (el.isOpen || widget.waitingTap) {
                    e.stopPropagation();

                    return false;
                }
                

                
            }
        );
        

        var tag = this._getTag(this.menuContentTag);

        var start = function (e) {
            

            e.preventDefault();

            if (widget.disabled) {
                return;
            }
            
            //如果是exclusive的设置，那么先关闭其他节点
            if (widget.exclusive && widget.curEl != null) {
                widget.waitingTap = true;
                widget.closeAll();
                return;
            }
            widget.waitingTap = false;

            // e.stopPropagation();
            if (widget._isInProcess) {
                return;
            }

            // console.log('slidermenu start');


            var el = this;//e.target;

            el.countPoint = 0;
            var point = e.touches ? e.touches[0] : e;

            el.startX    = point.pageX;
            el.startY    = point.pageY;

            el.pointX = el.startX;
            el.pointY = el.startY;

            el.distX      = 0;
            el.distY      = 0;

            el.x = widget._getX(el);
            
            el.lockY = false;
            // console.log('el.x=' + el.x);

            el.endTime = el.startTime = new Date().getTime();
            el.classList.remove('transition');
            widget._isInProcess  = true;

            // console.log('start');
        };
        
 

        var move = function (e) {

            e.preventDefault();

            if (widget.disabled) {
                return;
            }
            if (!widget._isInProcess) {
                return;
            }
            // e.stopPropagation();
            // console.log('slidermenu move');

            var el = this;//e.target;
            var point = e.touches ? e.touches[0] : e;
            var deltaX = point.pageX - el.pointX;
            var deltaY = point.pageY - el.pointY;
            // console.log('deltaY=' + deltaY, 'deltaX=' + deltaX);
            el.deltaX = deltaX;            
            el.deltaY = deltaY;

            var newX = el.x + deltaX;

            el.distX += deltaX;
            el.distY += deltaY;


            var absDistX        = Math.abs(el.distX);
            var absDistY        = Math.abs(el.distY);

            //由于可能和pagelist合作时，节点没了，所以默认给initX一个初始值
            //
            //
            
            //根据最初的5像素来判断方向，如果是y方向，那么直接return不做滚动处理
            //
            if (absDistX < 30) { 
                if (absDistY > absDistX / 3) {
                
                    el.lockY = true;//是Y方向 
                }
            }
            else {
                //
            }
            //pagelist在滚动的时候如果将slidermenu设置为falseslidermenu也就不触发了
            //
            if (el.lockY || widget.lockY) {
                return;
            }
            
            // debugger
            
            
           

            var initX = el.initX === undefined ? 0 : el.initX;
            // console.log('deltaX=' + deltaX,
            //     'newX=' + newX,
            //     'el.x=' + el.x,
            //     'maxStep' + widget.direction * widget.maxSlideWidth
            // );
            if (widget.direction === DIRECTION.LEFT) {
                


                if (newX < initX && 
                    newX > initX + widget.direction * widget.maxSlideWidth) {
                    
                    widget._setX(el, newX);
                }
                else {
                    //do nothing
                }
            }
            else {
                if (newX > initX &&
                    newX < initX + widget.direction * widget.maxSlideWidth) {

                    
                    widget._setX(el, newX);
                }
                else {
                    //do nothing
                }
            }
            el.pointX = point.pageX;
            el.pointY = point.pageY;
            
        };


        var end = function (e) {
            if (widget.disabled) {
                return;
            }
            // debugger
            var el = this;//e.target;
            // if (el.lockY) {
            //     el.lockY = false;
            //     return;
            // }
            var point = e.changedTouches ? e.changedTouches[0] : e;

            el.endTime = new Date().getTime();
            //finalX是节点上的最终偏移记录和initX相对应
            el.finalX = widget._getX(el);
            el.endX = point.pageX;
            el.endY = point.pageY;

            
            

            var initX = el.initX === undefined ? widget.defaultInitX : el.initX;
            var distanceX = el.finalX - initX;
            //总的滑动方向
            var slideDirection = distanceX > 0 ? 1 : -1;
            var instanceSliderDirection = el.endX - el.startX;
            // console.log('slideDirection=%s, distanceX=%s', slideDirection, distanceX);

            // console.log('Math.abs(distanceX)=' + Math.abs(distanceX));
            // if (el.lockY) {
            //     el.lockY = false;
            //     // return;
            // }


            if (widget.direction == DIRECTION.LEFT) {//向左边滑动触发

                //如果滑动方向与允许触发的滑动方向相反，那么只要有便宜就恢复最初状态
                //方向相同根据allowance来判断设置open状态
                //
                
                if (instanceSliderDirection * widget.direction < 0) {
                    widget.setOpen(el, false);
                }
                else {
                    if (Math.abs(distanceX) > widget.allowance) {//最后做判断是否需要移动
                
                        if (slideDirection < 0) {
                            
                            widget.setOpen(el, true);
                        }
                        else {
                            widget.setOpen(el, false);
                        }
                        
                    }
                    else {//不需要动
                        
                        widget.setOpen(el, false);
                    }
                }

                
            }
            else {
                if (instanceSliderDirection * widget.direction < 0) {
                    widget.setOpen(el, false);
                }
                else {
                    if (Math.abs(distanceX) > widget.allowance) {
                        if (slideDirection < 0) {
                            widget.setOpen(el, false);
                            
                        }
                        else {
                            widget.setOpen(el, true);
                        }

                    }
                    else {
                        
                        widget.setOpen(el, false);
                    }
                }
                
            }
            el.lockY = false;
            widget._isInProcess = false;
            

        };

        this._itemTouchStart = start;
        this._itemTouchMove = move;
        this._itemTouchEnd = end;

        this.container.on('touchstart', tag, this._itemTouchStart);
        this.container.on('touchmove',  tag, this._itemTouchMove);
        this.container.on('touchend',  tag, this._itemTouchEnd);
        this.container.on('touchcancel',  tag, this._itemTouchEnd);
    },
    setLockY: function (lockY) {
        this.lockY = !!lockY;
    },
    /**
     * 设置组件的disabled状态
     * @param {Boolean} disabled 是否为disabled状态
     * @memberOf SliderMenu
     * @function setDisabled
     */
    setDisabled: function (disabled) {
        this.disabled = !!disabled;
    },
    /**
     * 返回组件是否为disabled状态
     * @function getDisabled
     * @memberOf SliderMenu
     * @return {Boolean} 组件的是否为disabled状态
     */
    getDisabled: function () {
        return this.disabled;
    },
    /**
     * 获取组件的item是否打开
     * @function getOpen
     * @memberOf SliderMenu
     * @param  {HTMLElement} el 需要判断的节点，节点需具有data-role的属性
     * @return {Boolean}    获取节点或者组件的open状态
     * @version  1.0.1
     */
    getOpen: function (el) {
        var widget = this;
        if (el === undefined) {
            
            el = widget.itemCntList[0];
        }
        var dataRole = el.getAttribute('data-role');
        if (dataRole.indexOf(widget.menuContentTag) === -1) {
            console.warn('invalid el, el data-role attribute must contain' + widget.menuContentTag);
            return;
        }
        var initX = el.initX === undefined ? widget.defaultInitX : el.initX;

        var curX = widget._getX(el);

        
        if (widget.direction === DIRECTION.LEFT) {
            if (curX <= initX + widget.direction * widget.maxSlideWidth) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (curX >= initX + widget.direction * widget.maxSlideWidth) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    /**
     * 关闭所有打开的节点
     * @memberOf SliderMenu
     * @function closeAll
     */
    closeAll: function () {
        var widget = this;
        var _itemCntList = this.container.find(this._getTag(this.menuContentTag));
        for (var i = 0; i < _itemCntList.length; i++) {
            var itemCnt = _itemCntList[i];
            
            (function (el, open) {
                widget.setOpen(el, open, true);
            } (itemCnt, false));

        }
            
    },
    /**
     * 设置当前el状态是否是打开关闭状态
     * @param {Boolean} open 是否关闭状态
     * @param {Boolean} silence 是否不触发open事件，默认为false，触发open事件
     * @memberOf SliderMenu
     * @function setOpen
     */
    setOpen: function (el, open, silence) {
        var widget = this;

        //disable state can not be set open or close;
        if (widget.disabled) {
            return;
        }
        //
        if (typeof el === 'Boolean') {
            open = el;
            el = widget.itemCntList[0];
        }

        //invalid el
        var dataRole = el.getAttribute('data-role');
        if (dataRole.indexOf(widget.menuContentTag) === -1) {
            console.log('invalid el, el data-role attribute must contain' + widget.menuContentTag);
            return;
        }
        open = !!open;
        
        var initX = el.initX === undefined ? widget.defaultInitX : el.initX;
        // var distanceX = el.finalX - el.initX;
        //总的滑动方向
        // var slideDirection = distanceX > 0 ? 1 : -1;
        var slideDirection = null;

        if (open) {

            if (widget.direction === DIRECTION.LEFT) {
                slideDirection = -1;
            }
            else {
                slideDirection = 1;
            }
            var newX = initX + slideDirection * widget.maxSlideWidth;
            el.classList.add('transition');
            widget._setX(el, newX);

            // alert(el.style.border);
            //hack 让他强制去画
            // el.style.border = '1px solid #fff';
            var a = el && el.offsetHeight;
            el.isOpen = true;

            if (widget.exclusive) {
                widget.curEl = el;    
            }
            
            // alert(newX + '|' + widget._getX(el));
        }
        else {
            
            var newX = initX;
            el.classList.add('transition');
            widget._setX(el, newX);
            // el.style.border = 'none';
            el.isOpen = false;
            if (widget.exclusive) {
                widget.curEl = null;
            }
            
        }
        if (!silence) {

            widget.trigger('open', el, open);
        }
        el.lockY = false;
    },
    _getTag: function (tag) {
        
        return '[data-role=' + tag + ']';
    },
    
    _translate : function (x, y) {
        x = (x !== undefined ? x : 0);
        y = (y !== undefined ? y : 0);
        this.x = x;
        this.y = y;
        var style = '';
        style += 'translate(' + x + this.unit + ',' + y + ')';
        if (this.use3d) {
            style += ' translateZ(0)';
        }
        return style;
    },
    
    initialize: function (config) {
        SliderMenu.superClass.initialize.call(this, config);
        this.init();
    },
    
    _destroyEvent: function () {
        this.container.off();
    },

    init: function () {
        
        if (!this._init) {
            this.container = $(this.get('container') || document.body);
            this.menuItemTag = this.get('menuItemTag') || 'slideMenuItem';
            this.menuActionTag = this.get('menuActionTag') || 'slideMenuAction';
            this.menuContentTag = this.get('menuContentTag') || 'menuContentTag';
            this.use3d = !!this.get('use3d');
            this.unit = this.get('unit') || 'px';
            this.direction = this.get('direction');
            this.translatez = 'translateZ(0px)';
            this.cancleTapBubble = !!this.get('cancleTapBubble');

            var _allowance = parseInt(this.get('allowance'), 10);
            this.allowance = _allowance.toString() == 'NaN' ? 50 : Math.abs(_allowance);
            
            this.exclusive = !!this.get('exclusive');
            this.disabled = !!this.get('disabled');
            this.lockY = !!this.get('lockY');
            this._init = true;
            this.curOpenElList = [];
        }
        
    },
    /**
     * 渲染组件，组件使用的入口
     * @function render
     * @memberOf SliderMenu
     */
    render: function () {
        
        this._initProp();
        

        this._renderEvent();
        this.trigger('ready');
    },
    _initProp: function () {
        var widget = this;
        var width = this.get('width') || null;
        this.itemActionList = this.container.find(this._getTag(this.menuActionTag));
        this.itemCntList = this.container.find(this._getTag(this.menuContentTag));
        //默认就去第一个itemList的宽度
        //所以如果当前sliderMenu的宽度不统一，那么用户可以创建多个slideMenu
        
        this.maxSlideWidth = (width == null) ? this.itemActionList.offset().width : width;
        this.itemCntList.forEach(function (item, i) {
            item.initX = widget._getX(item);
            item.setAttribute('initX', item.initX);
        });
        //取默认第一个item的translatex为默认的initX，如果传入的HTML结构中
        //每个dom节点的translateX不一样，那么要么初始化多个sliderMenu要么
        //统一所有节点的translateX
        if (this.itemCntList.length) {
            widget.defaultInitX = widget._getX(this.itemCntList[0]);
            
        }
        else {
            widget.defaultInitX = 0;
        }
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf SliderMenu
     */
    destroy: function () {
        this._destroyEvent();
        SliderMenu.superClass.destroy.call(this);
    }
});


module.exports = SliderMenu;

    })( module.exports , module , __context );
    __context.____MODULES[ "61953748002700d86543eecb43af5cea" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "dcf35076387fa842ad1b70f4d38ffeca" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    module.exports =__context.____MODULES['61953748002700d86543eecb43af5cea'];


    })( module.exports , module , __context );
    __context.____MODULES[ "dcf35076387fa842ad1b70f4d38ffeca" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "a9b9de34153d8c62088f82bab4eca2e8" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var obj = {};
obj["slidermenu"] = __context.____MODULES['dcf35076387fa842ad1b70f4d38ffeca'];
module.exports = obj["slidermenu"];

    })( module.exports , module , __context );
    __context.____MODULES[ "a9b9de34153d8c62088f82bab4eca2e8" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "6f21d69946204545485582ad9add9504" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    __context.____MODULES['5fce9db6abe7bcb2229ca3415163c973'];
__context.____MODULES['bd2141162d398feaa2ba14dc245d2bba'];
__context.____MODULES['26b98c1301d1984de2f2518d5205693f'];

// Config
window.Kami = window.Kami || {};
window.Kami.disableTapEvent = true;
window.Kami.theme = 'yo';

// tap冲突，关闭QApp手势
QApp.gesture.off();
// tap冲突，关闭QApp手势
QApp.config({
    gesture: {
        // open: false, // 下个版本提供
        ctrl: false 
    }
});


Kami.Panel =__context.____MODULES['36a01c3f62e270e54ffe308f8ff2a892'];
Kami.PageList =__context.____MODULES['56f9249b795cc5503b74d2d73077ad14'];
Kami.Alert =__context.____MODULES['0646ed2e65ff8ef98f2fa447d60a1bfb'];
Kami.SliderMenu =__context.____MODULES['a9b9de34153d8c62088f82bab4eca2e8'];


    })( module.exports , module , __context );
    __context.____MODULES[ "6f21d69946204545485582ad9add9504" ] = module.exports;
})(this);
