/**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Loading
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/loading/index.html
 */

var Overlay = require('../../../overlay/1.0.0/index.js');
var LoadingTpl = require('./loading.string');
var Widget = require('../../../core/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');

//【TODO】init里的posObj不需要了
//【TODO】参考alert改一下
var Loading = Widget.extend({

    /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {Boolean} hasMask 是否有遮罩，默认为true
     * @property {String} width 宽度字符串，如：36px，默认不传
     * @property {String} height 高度字符串，如：36px，默认不传
     * @property {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
     * @property {String | HTMLElement} content 组件的内容
     * @property {String} unit 单位
     * @property {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
     * @memberOf Loading
     */
    options: {
        type: 'loading',
        hasMask: false,
        width: null,
        height: null,
        zIndex: 3001,
        content: '',
        unit: 'px',
        maskOffset: [0, 0],
        template: LoadingTpl,
        /**
         * 显示时触发的事件
         * @event show
         * @memberOf Loading
         */
        onshow: function () {},
        /**
         * 隐藏时触发的事件
         * @event hide
         * @memberOf Loading
         */
        onhide: function () {}
    },


    /**
     * 处理组件数据
     * @function init
     * @memberOf Loading
     * @private
     */
    init: function () {
        this._opt = {
            hasMask: this.get('hasMask') || false,
            width: this.get('width') || null,
            height: this.get('height') || null,
            zIndex: this.get('zIndex') || null,
            content: this.get('content') || '',
            unit: this.get('unit') || 'px',
            maskOffset: this.get('maskOffset') || [0,0],
            template: this.get('template'),
            posObj: this.get('posObj')
        };
        this._isRender = false;
        this._isShow = false;
        Loading.superClass.init.call(this);
    },

    /**
     * 处理组件样式
     * @function initUi
     * @memberOf Loading
     * @private
     */
    initUi: function(){
        $(this.widgetEl).css('top', this.get('maskOffset')[0]+ this.get('unit'));
        $(this.widgetEl).css('bottom', this.get('maskOffset')[1]+ this.get('unit'));
        $(this.widgetEl).css('position', 'absolute');
    },

    /**
     * 显示组件
     * @function show
     * @memberOf Loading
     */
    show: function(){
        if(!this._isRender){
            this.render();
        }else if(!this._isShow){
            this._isShow = true;
            this._widgetMap['overlay'].show();
        }
    },

    /**
     * 显示组件
     * @function hide
     * @memberOf Loading
     */
    hide: function(){
        this._isShow = false;
        this._widgetMap['overlay'].hide();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @private
     * @memberOf Loading
     */
    render: function(){
        var loading = this;
        var dialog;
        dialog = new Overlay(this._opt);
        dialog.on('hide', function(){
            var defaultAct = loading.trigger('hide');
            if(defaultAct === false){
                this.container.off('touchmove', stopMove);
            }
        });
        dialog.on('show', function(){
            var defaultAct = loading.trigger('show');
            if(defaultAct === false){
                this.container.on('touchmove', stopMove);
            }
        });
        dialog.render();
        this.widgetEl = dialog.widgetEl;
        this._widgetMap['overlay'] = dialog;
        this.initUi();
        this._isRender = true;
        this._isShow = true;
        this.trigger('show');
    }
});

// this deal with singleton
var loading = null;
var stopMove = function () {
    return false;
};

var DEFAULT_OPT = {
    hasMask: false,
    content: '',
    force: false,
    type: 'loading',
    template: LoadingTpl,
    maskOffset: [0, 0]
};
/**
 * Loading的静态方法显示组件的单例
 * @function Loading.show
 * @static
 * @param  {Object} opt 单例属性与属性一致
 * @paramDetails {Boolean} hasMask 是否有遮罩，默认为true
 * @paramDetails {String} width 宽度字符串，如：36px，默认不传
 * @paramDetails {String} height 高度字符串，如：36px，默认不传
 * @paramDetails {Number} zIndex 组件默认的z-index，如果有mask, mask的z-index为zIndex-1
 * @paramDetails {String | HTMLElement} content 组件的内容
 * @paramDetails {String} unit 单位
 * @paramDetails {Array} maskOffset 遮罩的上下偏移,默认为[0, 0]
 * @memberOf Loading
 */
Loading.show = function (opt) {
    var _opt = {};
    $.extend(_opt, DEFAULT_OPT, opt);
    if (loading == null) {
        loading = new Loading(_opt);
        loading.show();
    }
    else if (!!_opt.force) {
        Loading.destroy();
        Loading.show(_opt);
    }
    else {
        loading.show();
    }
};
/**
 * Loading的静态方法隐藏组件的单例
 * @function Loading.hide
 * @static
 * @memberOf Loading
 */
Loading.hide = function(){
    if(!!loading){
        loading.hide();
    }
}
/**
 * Loading的静态方法销毁组件的单例
 * @function Loading.destroy
 * @static
 * @memberOf Loading
 */
Loading.destroy = function(){
    if(!!loading){
        loading.destroy();
        loading = null;
    }
}
module.exports = Loading;
