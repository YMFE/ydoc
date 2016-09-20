/**
 * 用于选择已有银行卡和输入银行卡的业务组件
 * 是为corp团队开发的业务组件，
 * 
 * author: sharon<xuan.li@qunar.com>
 */


var Widget = require('../../../core/0.0.1/index.js');
var Template = require('../../../template/0.0.1/index.js');
var $ = require('../../../util/0.0.1/index.js');
var Selectlist = require('../../../selectlist/0.0.5/index.js');
var BizPayDialogTpl = require('./tpl/bizpaydialog.string');
var BizPayDialogSelectListItemTpl = require('./tpl/bizpaydialogitemtpl.string');

var BizPayDialogSelectListTpl = require('./tpl/bizpaydialogcontainer.string');

/**
 * [BizPayDialog description]
 * @type {[type]}
 */

var BizPayDialog = Widget.extend({
    options: {

        hasMask: false,
        type: 'bizpaydialog',
        template: BizPayDialogTpl,
        title: {
            text: '选择支付方式',
            icon: 'x'
        },
        selectlistTpl: BizPayDialogSelectListTpl,
        selectlistItemTpl: BizPayDialogSelectListItemTpl,
        defaultSelected: [],
        datasource: [],
        resizable: true,
        debug: false,
        top: '20px',
        onclose: function () {},
        onselectitem: function () {},
        onselectextra: function () {},
        events : {
            
            'tap [data-role="close"]': '_closeTapHandler',
            'tap [data-role="footer"]': '_footerTapHandler'
           
        }
        
    },
    
    _closeTapHandler: function (ev, el) {
        var widget = this;
        widget.trigger('close');
        // widget.hide();
        return false;
    },
    _footerTapHandler: function (ev, el) {
        var widget = this;

        widget.trigger('selectextra', el, ev.target);
        // widget.hide();
        return false;
    },
    show: function () {

        if (this.isDestroy) {
            return;
        }
        if (this._isInit) {
            if (this._isRender) {
                this.widgetEl.css('display', this.widgetElInitDisplay);
                // this.reset();
                
            }
            else {
                return this.render();
            }
        }
        else {
            this.init();
            return this.render();
        }
    },
    hide: function () {
        this.widgetEl.css('display', 'none');
        
    },
    
    init: function () {
        
        this.title = this.get('title');
        this.datasource = this.get('datasource') || [];
        this.defaultSelected = this.get('defaultSelected') || [];
        this.selectlistTpl = this.get('selectlistTpl');
        this.selectlistItemTpl = this.get('selectlistItemTpl');
        this.top = this.get('top') || '0';

        // this.hook = {};
        // $.extend(this.hook, DEFAULT_HOOK, this.get('hook'));
        // this.content = this.get('content');
        this._isInit = true;
    },
    render: function () {
        BizPayDialog.superClass.render.call(this);
        this.initProp();
        this.initUi();
        
        
        this.widgetElInitDisplay = this.widgetEl.css('display');
        this.initDebugger();
        return this;
    },
    
    toggleEl: function (el, show, hideClassName) {
        hideClassName = hideClassName || 'hide';
        if (!el) {
            return;
        }

        el = typeof el === 'string' ? this.widgetEl.find(el) : el;

        if (!!show) {
            if (el.hasClass(hideClassName)) {
                el.removeClass(hideClassName);
            }

        }
        else {
            if (!el.hasClass(hideClassName)) {
                el.addClass(hideClassName);   
            }
        }
        
    },
    parseTemplate: function (template) {
        
        
        var data = {
            title: this.title
            // content: this.content,
            // id: this._getInputId()
        };
        
        return Template(template || BizPayDialogTpl, data);    
        
    },
    initUi: function () {
        
        var widget = this;
        
        var container = this.widgetEl.find('[data-role="selectlist"]');
        var selectlist = null;
        if (this.datasource && this.datasource.length) {

            this.selectlistwrap.css({
                display: 'block'
            });

            selectlist = widget._widgetMap['selectlist'] = new Selectlist({
                template: widget.selectlistTpl,
                multi: false,
                resizable: false,
                key: this.get('key') || 'id',
                activeClass: 'item-on',
                itemTpl: widget.selectlistItemTpl,
                container: container,
                datasource: widget.datasource,
                defaultSelected: widget.defaultSelected,
                onSelectItem: function () {
                    widget.trigger('selectitem', arguments);
                }
            });
            selectlist.render();
        }
        else {
            this.selectlistwrap.css({
                display: 'none'
            });
        }
        
        
        widget.trigger('ready');
        this.resize();
        
    },
    resize: function () {
        var widget = this;
        var vpOffsetWidth = Math.min(
                document.body.offsetWidth,
                document.documentElement.offsetWidth
        );
        var vpOffsetHeight = Math.min(
                document.body.offsetHeigth,
                document.documentElement.offsetHeigth
        );
        var offset = this.widgetEl.offset();
        this.widgetEl.css({
            'left': (vpOffsetWidth - offset.width) / 2 + 'px',
            'top': widget.top || '0'
        });
        var selectlist = widget._widgetMap['selectlist'];
        selectlist && selectlist.resize();
        // this.widgetEl.style.top = (vpOffsetHeight - offset.height) / 2 + 'px';
    },
    initProp: function () {
        this.selectlistwrap = this.widgetEl.find('[data-role="selectlist"]');
        
    },
    initDebugger: function () {
        if (!!this.get('debug')) {
            var div = document.createElement('div');
            div.style.background = '#ff0';
            div.style.width = '200px';
            div.style.height = '200px';
            div.style.position = 'absolute';
            div.style.bottom =  '0';
            div.style.zIndex = 90000;
            this.dbDiv = div;
            document.body.appendChild(div);
        }
        
    },
    log: function (html) {
        if (!!this.get('debug') && this.dbDiv) {
            this.dbDiv.innerHTML = this.dbDiv.innerHTML + '<br/>' + html;    
        }
        
    },
    destroy: function () {
        
        
        BizPayDialog.superClass.destroy.call(this);
    }
});
module.exports = BizPayDialog;
