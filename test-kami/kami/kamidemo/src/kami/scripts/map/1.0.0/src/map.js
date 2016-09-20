/*global BMap*/
/**
 * @author  sharon<xuan.li@qunar.com, ixuan.lee@gmail.com>
 * kami的地图组件，对百度地图极速版本进行简单封装
 */
/**
 * 对百度地图进行封装的地图组件
 * @author  sharon.li <sharon.li@qunar.com>
 * @class Map
 * @constructor
 * @extends Widget
 * @category business
 * 
 */
var Widget = require('../../../core/1.0.0/index.js');
var BAIDU_MAP_JS_API_URL = 'http://api.map.baidu.com/api';
var Map = Widget.extend({
    /**
     * @property {String} token 地图API的token，API需要修改时修改，默认不需要修改
     * @property {String} type 当前API的类型，默认为quick
     * @property {String} version 当前组件使用的API版本，默认为1.0
     * @property {Array} curPosition  当前的位置信息，经纬度数组，如[116.404, 39.915]
     * @property {String} apiUrl 组件使用的API url
     * @property {Boolean} asyn 地图API的加载方式，默认为异步加载
     * @memberOf Map
     */
    

   
    options: {
        token: '3ncthkxdXtrzhxvSy4aPmbvd',//private token
        type: 'quick',
        version: '1.0',
        curPosition: [116.404, 39.915],//[经度, 纬度]
        apiUrl: BAIDU_MAP_JS_API_URL,//默认使用极速的方式
        asyn: true, //默认用异步，可以设置时同步，这是需要用户确保api script已经在文档中
        /**
         * 用户在地图上点击某个点时触发的事件
         * @event select
         * @memberOf Map
         * @param  {BMPoint} e 地图上对应的点
         */
        onselect: function (e) {},

        /**
         * 地图渲染到document上以后触发的事件
         * @event ready
         * @memberOf Map
         */
        onready: function () {},

        /**
         * 地图API加载失败后触发的事件
         * @event error
         * @memberOf Map
         */
        onerror: function () {}
    },

    /**
     * 获取百度地图API
     * @function _getAPI
     * @memberOf Map
     * @private
     */
    _getAPI: function () {
        var widget = this;
        var el = document.createElement('SCRIPT');
        var src = this.get('apiUrl') || BAIDU_MAP_JS_API_URL;
        src += '?type={{type}}&ak={{token}}&v={{version}}';
        src += '&callback={{callback}}';
        src += '&timstamp={{timestamp}}';

        src = src.replace('{{type}}', this.get('type'))
                .replace('{{version}}', this.get('version'))
                .replace('{{token}}', this.get('token'))
                .replace('{{callback}}', this.scriptCbName)
                .replace('{{timestamp}}',  new Date().getTime());

        el.type = 'text/javascript';
        el.src = src;
        el.setAttribute('data-role', 'map-api');
        var head = document.querySelector('HEAD');
        if (!head) {
            head = document.querySelector('BODY');
            if (!head) {
                throw new Error('head and body element is absent in you html document');
            }
        }

        
        el.addEventListener('error', function () {
            alert('script loaded error');
            widget.trigger('error');
            throw new Error('script loaded error');

        });
        this.scriptEl = el;
        head.appendChild(el);
        
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Map
     * @private
     */
    init: function () {
        
        var container = this.get('container');
        if (typeof container === 'string') {
            container = container.replace(/^#(.*)/, '$1');
        }
        else if (container.length) {
            container = container[0];
        }
        else {
            //do nothing
        }

        this.container = container;

        this.scriptCbName = ('baiduMapCb_' + this.cid).replace(/-/g, '_');
        
        this.instance = null;
        this.asyn = !!this.get('asyn');
        this.curPosition = this.get('curPosition');
        if (this.curPosition &&
            this.curPosition instanceof Array &&
            this.curPosition.length > 1) {
            this.curPosition = this.curPosition.slice(0, 2);
        }

        
    },

    /**
     * 返回地图实例
     * @function getInstance
     * @memberOf Map
     * @return {BMap} 百度地图实例
     */
    getInstance: function () {
        return this.instance;
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Map
     */
    render: function () {
        
        var widget = this;
        // var container = this.get('container');
        this.styleCss = widget.container[0].style ? widget.container[0].style.cssText : '';
        if (this.asyn) {
            window[this.scriptCbName] = function () {
                
                if (window.BMap === undefined) {
                    throw new Error('unknow error occured!!');
                }
                else {
                    widget.instance = new BMap.Map(widget.container[0]);
                    // 创建点坐标
                    var lng = widget.curPosition[0];
                    var lat = widget.curPosition[1];
                    var point = new BMap.Point(lng, lat);
                    // 初始化地图,设置中心点坐标和地图级别。
                    widget.instance.centerAndZoom(point, 15);
                    widget.trigger('ready');
                    //添加地图缩放控件
                    // widget.instance.addControl(new BMap.ZoomControl());
                }
                
            };
            this._getAPI();
        }
        else {
            widget.instance = new BMap.Map(widget.container[0]);
        }

    },

    /**
     * 渲染组件内部事件
     * @function _renderEvent
     * @memberOf Map
     * @private
     */
    _renderEvent: function () {
        var widget = this;
        if (null !== this.instance) {

            this.instance.addEventListener('click', function(e) {
                widget.trigger('select', e.point);
            });
        }
    },

    /**
     * 将地图的中心切换到指定的坐标点
     * @function panTo
     * @memberOf Map
     * @param  {BMap.Map | Array | Object} point 要指定的坐标
     */
    panTo: function (point) {
        var _point = this._getPoint(point);
        if (null !== _point) {
            this.instance.panTo(_point);
        }
    },

    /**
     * 根据地址信息返回当前地址所对应的点
     * @function getPointByAddress
     * @memberOf Map
     * @param  {String}   address  地址信息
     * @param  {Function} callback 获得地址信息后的回调，callback中返回获得的位置信息
     * @param  {String}   city     城市名称
     */
    getPointByAddress: function (address, city,  callback) {
        var myGeo = new BMap.Geocoder();
        var widget = this;
        myGeo.getPoint(address, function (point) {
            if (point) {
                callback && callback.call(widget, point);
            }
        }, city);
    },

    /**
     * 获得位置点信息
     * @function _getPoint
     * @memberOf Map
     * @private
     * @param  {BMap.Map | Array | Object} point 需要转换为坐标点得信息
     * @return {BMap.Map}       返回坐标点
     */
    _getPoint: function (point) {
        var _point = null;
        if (this.instance !== null && window.BMap && window.BMap.Map) {
            if (point instanceof BMap.Map) {
                _point = point;
            }
            else if (Object.prototype.toString.call(point) == '[object Array]') {
                _point = new BMap.Point(point[0], point[1]);
                
            }
            else if (arguments.length >= 2) {
                var lng = parseFloat(arguments[0], 10) || 116.404;
                var lat = parseFloat(arguments[1], 10) || 39.915;
                _point = new BMap.Point(lng, lat);
                
            }
            else if (Object.prototype.toString.call(point) == '[object Object]'){
                var lng = point.lng;
                var lat = point.lat;
                _point = new BMap.Point(lng, lat);
            }
            else {
                console.log('invalid longitute and lagitue, pan to Tiananmen automatically!');
                _point = new BMap.Point(116.404, 39.915);
            }
        }
        return _point;
    },
    /**
     * 添加放大缩小控件
     * @function addZoomControl
     * @memberOf Map
     */
    addZoomControl: function () {
        
        if (this.instance !== null && 
            window.BMap && 
            window.BMap.ZoomControl) {
            this.instance.addControl(new BMap.ZoomControl());    
        }
        else {
            //
        }
    },
    /**
     * 添加标注
     * @function addMaker
     * @memberOf Map
     */
    addMaker: function (point) {
        var _point = this._getPoint(point);
        
        if (null !== _point) {
            var maker = new BMap.Marker(_point);
            this.instance.addOverlay(maker);
        }
        
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf Map
     */
    destroy: function () {
        console.log('map destroy');
        
        //还原之前容器的cssText
        if (this.styleCss) {
            this.container[0].style.cssText = this.styleCss;
        }

        /**
         * 注销异步获取api时，增加的额外方法和节点
         * 
         */
        if (this.asyn) {
            window[this.scriptCbName] = null;
            delete window[this.scriptCbName];
            this.scriptEl.parentNode.removeChild(this.scriptEl);
        
        }

        this.container[0].innerHTML = '';
                    
        Map.superClass.destroy.call(this);


    }

});
module.exports = Map;

