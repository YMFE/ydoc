

var Overlay = require('../../../overlay/0.0.1/index.js');

var TipsTpl = require('./tips.string');
var Template = require('../../../template/0.0.1/index.js');
var $ = require('../../../util/0.0.1/index.js');

var Tips = Overlay.extend({
    options: {
        posObj: {
            self: ['center', 'center'],
            base: ['50%', '50%']
        },
        usePin: false,
        hasMask: false,
        type: 'tip',
        autoHide: true,
        content: '我是tips',
        template: TipsTpl,
        effect: true,
        onhide: function () {

        },
        autoHideTime: 2//默认为秒
    },
    
    setContent: function(content) {
        this.widgetEl[0].innerHTML = content;
        // this.resize();
    },
    parseTemplate: function (template) {
        
        this.content = this.get('content') || '';
        // debugger
        return Template(this.get('template') || TipsTpl, {
            uiClass: this.getClassName(),
            content: this.content
        });    
        
    },

    show: function (content) {
        var widget = this;
        Tips.superClass.show.call(this);
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
        // this.resize();
    },
    hide: function() {
        Tips.superClass.hide.call(this);
        this.trigger('hide');
        var widget = this;
        setTimeout(function() {
            widget.destroy();
        }, 200);
        // this.destroy();
    },
    destroy: function () {
        this.timer && window.clearTimeout(this.timer);
        Tips.superClass.destroy.call(this);
    },
    initUi: function () {
        Tips.superClass.initUi.call(this);

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
    init: function () {
        this.autoHide = !!this.get('autoHide');
        this.autoHideTime = parseInt(this.get('autoHideTime')|| 0, 10) || 2;
        Tips.superClass.init.call(this);

    }
    
});




var tips = null;
var DEFAULT_OPT = {
    content: '提示',
    autoHide: true,
    autoHideTime: 3, 
    effect: null,
    force: false
};
var KamiTips = {
    show: function(opt) {
        if (tips == null || !tips._isInit) {

            var _opt = {};
            $.extend(_opt, DEFAULT_OPT, opt);
            if (opt.template) {
                _opt.template = opt.template;
            }
            _opt.ohhide = function () {
                if (opt && opt.onhide) {
                    opt.onhide.call(KamiTips);
                }
            };
            tips = new Tips(_opt);
            tips.show();
        }
        else if (tips.visiable) {
            if (!!opt.force) {
                tips.destroy();
                KamiTips.show(opt);
            }
            else {
                return;    
            }
        }
        else {
            tips.show();    
        }
        
        
    },
    hide: function() {
        if (!!tips) {
            tips.hide();
            tips = null;
        } 
    }
}
module.exports = KamiTips;  
