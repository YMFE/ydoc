/**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Confirm
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/confirm/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var Dialog = require('../../../dialog/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');

var Confirm = Widget.extend({

    /**
     * @property {HTMLElement| String} container 组件的容器
     * @property {String| HTMLElement} content 弹窗的内容
     * @property {String}  extraClass 会额外添加到组件根节点的样式
     * @property {Boolean} align 组件的对齐方式，center、bottom、top，默认为center
     * @property {Boolean} resizable 是否会根据窗口大小重新调整位置，默认为true
     * @property {String| HTMLElement} okText 确定按钮的文案
     * @property {String| HTMLElement} cancelText 取消按钮的文案
     * @memberOf Confirm
     */
    
   
    options: {
        type: 'confirm',
        content: 'content',
        extraClass: '',
        align: 'center',
        hasMask: true,
        resizable: true,
        okText: 'ok',
        cancelText: 'cancel',
        /**
         * 右侧确定按钮点击时触发的事件
         * @event ok
         * @memberOf Confirm
         */
        onok: function() {},
        /**
         * 左侧取消按钮点击时触发的事件
         * @event cancel
         * @memberOf Confirm
         */
        oncancel: function() {}
    },
    /**
     * 处理组件数据
     * @function init
     * @memberOf Confirm
     * @private
     */
    init: function() {
        var widget = this;
        Confirm.superClass.init.call(this);
        this._opt = {
            content: this.get('content'),
            extraClass: this.get('extraClass'),
            align: this.get('align'),
            hasMask: this.get('hasMask'),
            resizable: this.get('resizable'),
            stylesObj: this.get('stylesObj'),
            footer: {
                cancelBtn: {
                    text: this.get('cancelText')
                },
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
     * @memberOf Confirm
     */
    render: function() {
        var widget = this;
        var dialog;
        dialog = new Dialog(this._opt);
        dialog.on('ok', function(event) {
            var res = widget.trigger('ok', event);
            if (res === false) {
                return false;
            }
        });
        dialog.on('cancel', function(event) {
            var res = widget.trigger('cancel', event);
            if (res === false) {
                return false;
            }
        });
        dialog.on('hide', function(event) {
            var res = widget.trigger('hide', event);
            widget._isShow = false;
            if (res === false) {
                return false;
            }
        });

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
     * @memberOf Confirm
     */
    show: function() {
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
     * @memberOf Confirm
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
     * @memberOf Confirm
     */

    setContent: function(newContent){
        this.set('content', newContent);
        this._widgetMap['dialog'].setContent(newContent);
    },

    /**
     * 获取dialog组件的内容节点
     * @function getContent
     * @memberOf Confirm
     * @return {HTMLElement} 组件的内容节点
     */
    getContent: function() {
        return this._widgetMap['dialog'].getContent();
    },
    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Dialog
     */
    resize: function() {
        this._widgetMap['dialog'].resize();
    }
});

var confirm = null;
var DEFAULT = {
    force: true
};

/**
 * Confirm的静态方法显示组件的单例，此方法内部实现单例
 * @function Confirm.show
 * @static
 * @param  {Object} opt 单例属性与属性一致
 * @paramDetails {String| HTMLElement} opt.force  是否强制销毁后再重建
 * @paramDetails {String| HTMLElement} opt.content 弹窗的内容
 * @paramDetails {String}  opt.extraClass 会额外添加到组件根节点的样式
 * @paramDetails {Boolean} opt.align 组件的对齐方式，center、bottom、top，默认为center
 * @paramDetails {Boolean} opt.resizable 是否会根据窗口大小重新调整位置，默认为true
 * @paramDetails {String| HTMLElement} opt.okText 确定按钮的文案
 * @paramDetails {String| HTMLElement} opt.cancelText 取消按钮的文案
 * @memberOf Confirm
 * @example
 * Confirm.show({
 *     content: 'aaa',
 * });
 */
Confirm.show = function (opt) {
    var _opt = $.extend({}, DEFAULT, opt);
    if (!confirm) {
        confirm = new Confirm(_opt);
        confirm.show();
    } else if (_opt && _opt.force) {
        Confirm.hide();
        Confirm.show(_opt);
    }
};
/**
 * Confirm的静态方法隐藏组件的单例
 * @function Confirm.hide
 * @static
 * @memberOf Confirm
 */
Confirm.hide = function () {
    if (!!confirm) {
        confirm.hide();
        confirm.destroy();
        confirm = null;
    }
};
/**
 * Confirm的静态方法销毁组件的单例
 * @function Confirm.destroy
 * @static
 * @memberOf Confirm
 */
Confirm.destroy = function () {
    if (!!confirm) {
        confirm.destroy();
        confirm = null;
    }
};
module.exports = Confirm;