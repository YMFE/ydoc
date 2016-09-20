/**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Tip
 * @constructor
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/tip/index.html
 * @extends Widget
 */

var Overlay = require('../../../overlay/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var TipTpl = require('./tip.string');
var Template = require('../../../template/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');
//【TODO】用内聚overlay的方式重新实现tips
var Tip = Widget.extend({
    /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {Boolean} hasMask 是否有遮罩，默认为false
     * @property {Boolean} autoHide 是否自动隐藏， 默认为true
     * @property {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
     * @property {Number} autoHideTime 自动消失的时间，当autoHide为true时，该属性有效，默认为2秒
     * @property {String | HTMLElement} content tip的内容
     * @property {Boolean} effect 是否开启动画效果，默认为true
     * @property {Array} maskOffset 遮罩的上下偏移，默认为[0,0]
     * @property {Boolean} resizeable 当屏幕大小发生变化时，是否切换位置
     * @memberOf Tip
     */
    
    
    options: {
        type: 'tip',
        hasMask: false,
        zIndex: 3001,
        maskOffset: [0, 0],
        autoHide: true,
        content: '我是tips',
        template: TipTpl,
        effect: true,
        resizable: true,
        autoHideTime: 2,//默认为秒  
        /**
         * 组件隐藏时触发的事件
         * @event hide
         * @memberOf Tip
         */
        onhide: function () {}
    },
    /**
     * 内置函数初始化组件内置Overlay组件
     * @function _createOverlay
     * @private
     * @memberOf Tip
     */
    _createOverlay: function () {
        this._opt = {
            hasMask: this.get('hasMask'),
            zIndex: this.get('zIndex'),
            maskOffset: this.get('maskOffset'),
            effect: this.get('effect')
        }
        this.overlay = this._widgetMap['overlay'] = new Overlay(this._opt);
        this.overlay.render();
    },
     /**
     * 设置组件的数据
     * @function init
     * @memberOf Tip
     */
    init: function () {
        this.autoHide = !!this.get('autoHide');
        this.autoHideTime = parseInt(this.get('autoHideTime')|| 0, 10) || 2;
        Tip.superClass.init.call(this);
    },
    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Tip
     */
    render: function(){
        this.get('hasMask') && this._createOverlay();
        Tip.superClass.render.call(this);
        this.initUi();
        this._isShow = true;
        this.show();
    },
    /**
     * 重设组件位置
     * @function resize
     * @memberOf Tip
     */
    resize: function(){
        this.overlay && this.overlay.resize();
        Tip.superClass.resize.call(this);
        this.initUi();
    },

    /**
     * 设置组件内容
     * @function setContent
     * @param {String | HTMLElement} content 组件要显示的新内容
     * @memberOf Tip
     */
    setContent: function(content) {
        this.widgetEl[0].innerHTML = content;
    },
    /**
     * 获取组件内容
     * @function getContent
     * @param {String | HTMLElement} content 组件要正在现实的内容
     * @memberOf Tip
     */
    getContent: function(content) {
        return $(this.widgetEl[0]).html();
    },
    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Tip
     * @private
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function (template) { 
        this.content = this.get('content') || '';
        return Template(this.get('template') || TipTpl, {
            uiClass: this.getClassName(),
            content: this.content
        });      
    },

    /**
     * 显示组件
     * @function show
     * @memberOf Tip
     */
    show: function () {
        var widget = this;
        // Tip.superClass.show.call(this);
        this.overlay && this.overlay.show();
        this.widgetEl.show();
        if (this.autoHide) {
            // window.clearTimeout(this.timer);
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            this.timer = setTimeout(function() {
                widget.hide();
                widget.timer = null;

            }, this.autoHideTime * 1000);
        }
        this._isShow = true;
        // this.resize();
    },

    /**
     * 显示组件
     * @function hide
     * @memberOf Tip
     */
    hide: function() {
        this.widgetEl.hide();
        this.overlay && this.overlay.hide();
        this.trigger('hide', this);
        // var widget = this;
        // setTimeout(function() {
        //     widget.destroy();
        // }, 200);
        this._isShow = false;
        // this.destroy();
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf Tip
     */
    destroy: function () {
        this.timer && window.clearTimeout(this.timer);
        this.off();
        this._isShow = false;
        Tip.superClass.destroy.call(this);
    },

    /**
     * 设置组件的样式
     * @function initUi
     * @memberOf Tip
     */
    initUi: function () {
        var dialogOffset = this.widgetEl.offset();
        var viewportOffset = {
            height: window.innerHeight,
            width: window.innerWidth
        };
        var left = (viewportOffset.width - dialogOffset.width) / 2;
        var top = (viewportOffset.height - dialogOffset.height) / 2;
        this.widgetEl.css({
            'position': 'fixed',
            'left': left + 'px',
            'top': top + 'px'

        });
       
    },
   /**
    * 判断当前组件时候否显示
    * @private
    * @function isShow
    * @return Bollean 是否显示
    */
   isShow: function(){
        return this._isShow;
   }
});
// this deal with singleton
var tips = null;
var DEFAULT_OPT = {
    force: true
};
/**
 * 单例Tip的show方法,当不传force的时候默认为true
 * @static
 * @function Tip.show 
 * @param {Object} opt 单例Tip参数设置
 * @paramDetails {Boolean} opt.hasMask 是否有遮罩，默认为false
 * @paramDetails {Boolean} opt.autoHide 是否自动隐藏， 默认为true
 * @paramDetails {Number} opt.zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
 * @paramDetails {Number} opt.autoHideTime 自动消失的时间，当autoHide为true时，该属性有效，默认为2秒
 * @paramDetails {String | HTMLElement} opt.content tip的内容
 * @paramDetails {Boolean} opt.effect 是否开启动画效果，默认为true
 * @paramDetails {Array} opt.maskOffset 遮罩的上下偏移，默认为[0,0]
 * @paramDetails {Boolean} opt.resizeable 当屏幕大小发生变化时，是否切换位置
 * @paramDetails {Boolean} opt.force 是否强制重新创建内容
 * @return {Object} 单例tip对象
 * @memberOf Tip
 */
Tip.show = function (opt) {
    
    var _opt = {};
    $.extend(_opt, DEFAULT_OPT, opt);
    if (opt.template) {
        _opt.template = opt.template;
    }
    if (tips == null) {
        tips = new Tip(_opt);
        tips.render();
        _opt.onhide && tips.on('hide', _opt.onhide);
    }
    else if (!!_opt.force) {
        Tip.destroy();
        Tip.show(opt);
    } 
    else if (!tips.isShow()){
        tips.show();
    }
    return tips; 
};
/**
 * 单例Tip的hide方法
 * @static
 * @function Tip.hide
 * @memberOf Tip
 */
Tip.hide = function () {
    if (!!tips) {
        tips.hide();
    } 
};
/**
 * 单例Tip的destory方法
 * @static
 * @function Tip.destroy
 * @memberOf Tip
 */
Tip.destroy = function () {
    tips && tips.destroy();
    tips = null;
};
module.exports = Tip;  