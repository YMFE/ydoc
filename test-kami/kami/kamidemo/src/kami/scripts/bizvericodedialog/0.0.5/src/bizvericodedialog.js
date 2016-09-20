/**
 * 用于选择已有验证码重新发送和验证码输入功能
 * 是为corp团队开发的业务组件，
 * 
 * author: sharon<xuan.li@qunar.com>
 */

var Widget = require('../../../core/0.0.1/index.js');
var Template = require('../../../template/0.0.1/index.js');
var $ = require('../../../util/0.0.1/index.js');

var BizVericodeDialogTpl = require('./bizvericodedialog.string');
/**
 * [BizVericodeDialog description]
 * @type {[type]}
 */

var BizVericodeDialog = Widget.extend({
    options: {

        hasMask: false,
        type: 'bizvericodedialog',
        title: {
            text: '请输入手机验证码',
            icon: 'x'
        },
        debug: false,
        content: {
            mobile: 'xxxxxxxxxx',
            amount: '000'
        },
        failText: '获取手机号失败',
        top: '10px',
        count: 60,
        resizable: true,
        template: BizVericodeDialogTpl,
        onretry: function () {},
        onclose: function () {},
        onerror: function () {},
        onsuccess: function () {},
        events : {
            'input .js-input-validcode': '_validCodeInputHandler',
            'tap .js-getcode': '_getCodeTapHandler',
            'tap .js-close': '_closeTapHandler'
        }
        
    },
    
    _validCodeInputHandler: function (ev, el) {
        
        var widget = this;
        // var preValue = widget.preValue;
        var value = el.value;
        
        var label = widget.varifyLabel.length ? widget.varifyLabel[0] : null;
        if (!label) {
            return;
        }

        if (!/^\d*$/.test(value)) {
            value = widget.preValue;
            widget.varifyInput.val(widget.preValue);
            label.textContent = value;
        }
        else {
            label.textContent = value;    
            widget.preValue = value;
            widget.varifyInput.val(value);
        }
        
        value = widget.preValue;
        
        if (value.length >= 6 && !widget.completeInputFlag) {
            //大于6的截断
            value = value.substr(0,6);
            widget.varifyInput.val(value);

            if (/^\d+$/.test(value)) {
                widget.completeInputFlag = true;
                el.blur();
                widget.trigger('success');
            }
            else {
                widget.trigger('error', {
                    errorCode: 1
                });
            }
        }
        else {

        }
        
        
        // console.log(widget.getValue());
    },
    setRetryState: function () {
        var widget = this;
        widget.clearTimer();
        widget.toggleEl('.js-state-valid', false);
        widget.toggleEl('.js-state-error', true);

        widget.toggleEl('.js-getcode', true);
        widget.toggleEl('.js-gettime', false);

        widget.completeInputFlag = false;
    },
    setMobile: function (mobile) {
        this.mobile = mobile;
        this.content.mobile = this.mobile;

        this.widgetEl.find('.js-mobile').html(this.mobile);
        
    },
    setFailedText: function (failText) {
        this.set('failText', failText);
        this.failText = failText;
        this.widgetEl.find('.js-state-error').html(this.failText);
    },
    getValue: function () {
        return this.varifyInput.val();
    },
    _getCodeTapHandler: function (ev, el) {
        
        var widget = this;
        widget.trigger('retry');
        return false;
    },
    _closeTapHandler: function () {
        var widget = this;
        widget.trigger('close');
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
                this.reset();
                
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
        this.clearTimer();
    },
    
    init: function () {
        this.title = this.get('title');
        this.content = this.get('content') || {};
        this.timestamp = this.get('timestamp');
        this.count = this.get('count');
        this.mobile = this.content.mobile;
        this.failText = this.get('failText') || '获取手机号失败';
        this.preValue = '';
        this.top = this.get('top') || 0;
        this._isInit = true;
        this.completeInputFlag = false;
    },
    render: function () {
        BizVericodeDialog.superClass.render.call(this);
        this.initProp();
        this.initUi();
        
        // this.bindEvent();
        this.widgetElInitDisplay = this.widgetEl.css('display');
        this.initDebugger();
        return this;
    },
    updateTimeNum: function (num) {
        var timeNum = this.widgetEl.find('.js-time');
        timeNum && (timeNum.html(num));
    },
    initTimer: function () {
        var widget = this;
        var count = widget.count;
        this.timer = setInterval(function () {
            
            if (count <= 0) {
                //重新获取验证码
                widget.toggleEl('.js-getcode', true);
                widget.toggleEl('.js-gettime', false);
                clearInterval(widget.timer);
            }
            else {
                count --;
                widget.toggleEl('.js-gettime', true);
                widget.toggleEl('.js-getcode', false);
                widget.updateTimeNum(count);
            }

        }, 1000);
    },
    clearTimer: function () {
        this.timer && clearInterval(this.timer);
    },
    clearInput: function () {
        var widget = this;
        var label = widget.varifyLabel.length ? widget.varifyLabel[0] : null;
        if (!label) {
            return;
        }
        label.textContent = '';
        this.varifyInput.val('');
        this.completeInputFlag = false;
    },
    reset: function () {
        // debugger
        this.clearTimer();
        // this.initProp();
        this.initUi();
        // this.initTimer();
        // debugger
        this.clearInput();
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
    _getInputId: function () {
        return 'jsVarifyCode_' + this.cid;
    },
    parseTemplate: function (template) {
        
        // debugger
        var data = {
            title: this.title,
            content: this.content,
            id: this._getInputId(),
            failText: this.failText || '获取手机号失败'
        };
        return Template(template || BizVericodeDialogTpl, data);    
        
    },
    initUi: function () {
        // debugger
        // console.log('initUi');
        this.toggleEl('.js-send-code', true);
        this.toggleEl('.js-retry-code', false);
        this.timeNum.html(this.count);
        if (this.mobile) {
            this.initTimer();
            this.widgetEl.find('.js-state-error').addClass('hide');
            this.widgetEl.find('.js-state-valid').removeClass('hide');

            this.widgetEl.find('.js-getcode').addClass('hide');
            this.widgetEl.find('.js-gettime').removeClass('hide');
            
        }
        else {
            this.widgetEl.find('.js-state-error').removeClass('hide');
            this.widgetEl.find('.js-state-valid').addClass('hide');

            this.widgetEl.find('.js-getcode').removeClass('hide');
            this.widgetEl.find('.js-gettime').addClass('hide');
        }
        
        this.widgetEl.find('.js-mobile').html(this.mobile);
        this.widgetEl.find('.js-state-error').html(this.failText);

        
        //hack ios to hide cursor
        if ((-1 !== window.navigator.userAgent.indexOf('iPhone')) && this.varifyInput) {

            this.varifyInput.css('textIndent', '-999px');
        }

        this.resize();
    },
    resize: function () {
        var widget = this;
        var vpOffsetWidth = Math.min(
                document.body.offsetWidth,
                document.documentElement.offsetWidth
        );
        var vpOffsetHeight = Math.min(
                document.body.offsetHeight,
                document.documentElement.offsetHeight
        );
        var offset = this.widgetEl.offset();
        this.widgetEl.css({
            'left': (vpOffsetWidth - offset.width) / 2 + 'px',
            'top': widget.top || '0'
        });
        // this.widgetEl.style.top = (vpOffsetHeight - offset.height) / 2 + 'px';
    },
    initProp: function () {
        this.varifyWrap = this.widgetEl.find('.js-verification-wrap');
        this.varifyInput = this.widgetEl.find('.js-input-validcode');
        this.varifyLabel = this.widgetEl.find('.js-label-validcode');
        this.timeNum = this.widgetEl.find('.js-time');
        
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
        this.clearTimer();
        // this.unbindEvent();
        BizVericodeDialog.superClass.destroy.call(this);
    }
});
module.exports = BizVericodeDialog;
