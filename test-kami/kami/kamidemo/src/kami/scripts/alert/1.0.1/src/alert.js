/**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Alert
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/alert/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var Dialog = require('../../../dialog/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');


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