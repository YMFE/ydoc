/**
 * 弹层组件
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Dialog
 * @constructor
 * @extends Overlay
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/dialog/index.html
 */
var Overlay = require('../../../overlay/1.0.0/index.js');
var DialogTpl = require('./dialog.string');
var Template = require('../../../template/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');


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
