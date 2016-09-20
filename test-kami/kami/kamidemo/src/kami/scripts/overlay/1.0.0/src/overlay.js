
/**
 * 浮层的基类
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Overlay
 * @constructor
 * @extends Widget
 * @category primary
 */

var Widget = require('../../../core/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');
var OverlayTpl = require('./overlay.string');


var MaskTpl = require('./mask.string');
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
