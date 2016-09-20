/**
 * Created by eva on 15/10/8.
 */
/**
 * 弹层组件
 * @author  eva.li <eva.li@qunar.com>
 * @class Alert
 * @extends Widget
 * @constructor
 * @demo http://www.baidu.com
 * @category primary
 * @example
 * var widget = View.showWidget('searchlist', { //问君能有几多愁，恰似一江春水向东流
 *    onComplete: function() {
 *          todoSomething();
 *    }
 * });
 */

$ = require('../../util/index.js');
var Dialog = require('../../dialog/index.js');
var Widget = require('./widget.js');


var Alert = Widget.extend({

    /**
     *
     * @memberOf Alert
     * @template alertTemplate
     * alert默认模板 可根据需求替换alert默认模板 需求替换alert默认模板 可根据需求替换alert默认模板 可根据需求替换
     */
    /**
     * @property {String| HTMLElement} content 弹窗的内容 require
     * @property {String}  extraClass 会额外添加到组件根节点的样式 require
     * @property {Boolean} align 组件的对齐方式，center、bottom、top，默认为center
     * @property {Boolean} resizable 是否会根据窗口大小重新调整位置，默认为true
     * @property {String| HTMLElement} okText 确定按钮的文案
     * @memberOf Alert
     */
    /**
     * @event ok
     * @param {String | HTMLElement} newContent 将要设置的内容
     * @example
     * var widget = View.showWidget('searchlist', {
     *    onComplete: function() {
     *          todoSomething();
     *    }
     * });
     * @memberOf Alert
     */
    options: {
        type: 'alert',
        content: '内容',
        align: 'center',
        hasMask: true,
        resizable: true,
        okText: '确定',
        onok: function () {}
    },
    
    /**
     * @memberOf alert
     * @template xxxalertTemplate
     * zgekeyugfdgfjhsgdhfgsdjfhgsdjhfgsdjhfgsjhdfgsjhfg
     * @path './alert.string'
     */

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
            },
            //addHeader
            header: {
                title: this.get('title')
            }
        };
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
     * var widget = View.showWidget('searchlist', {
     *    onComplete: function() {//你猜猜看
     *          todoSomething('等发到');
     *    }
     * });//欣悦是一个好孩子
     */
    render: function() {
        var widget = this;
        this._widgetMap['dialog'] = new Dialog(this._opt);
        this._widgetMap['dialog'].on('ok', function(event) {
            var ret = widget.trigger('ok', event);
            if (ret === false) {
                return false;
            }
        });
        this._widgetMap['dialog'].render();
        this._widgetMap['dialog'].resize();
        this.widgetEl = this._widgetMap['dialog'].widgetEl;
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
    }

});


var alert = null;

var DEFAULT = {
    force: true
};


/**
 * ALert单例调用方法
 * @function show
 * @static
 * @param  {Object} opt 与实例化参数一致
 * @paramDetails  {String| HTMLElement} opt.content 弹窗的内容
 * @paramDetails {String}  opt.extraClass 会额外添加到组件根节点的样式
 * @paramDetails {Boolean} opt.align 组件的对齐方式，center、bottom、top，默认为center
 * @paramDetails {Boolean} opt.resizable 是否会根据窗口大小重新调整位置，默认为true
 * @paramDetails {String| HTMLElement} opt.okText 确定按钮的文案
 * @demo www.baidu2.com
 * @memberOf Alert
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
 * ALert单例调用方法-隐藏
 * @function hide
 * @static
 * @memberOf Alert
 */
Alert.hide = function() {
    if (!!alert) {
        alert.hide();
        alert.destroy();
        alert = null;
    }
};
/**
 * ALert单例调用方法-销毁
 * @function destory
 * @static
 * @memberOf Alert
 */
Alert.destroy = function() {
    if (!!alert) {
        alert.destroy();
        alert = null;
    }
}
module.exports = Alert;
