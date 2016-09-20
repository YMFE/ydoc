require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Select = QApp.Kami.Select = require('../../../scripts/select/index.js');

var template = [
    '<div class="kami-header">',
    '<div class="btn ar">RIGHT</div>',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="kami-content content">',
    '</div>'
].join('');


var DEFAULT_OPT = {
    // template: template,
    router: false,
    popAni: 'actionSheet',
    barClass: '',
    title: '',
    leftBtn: '取消',
    rightBtn: '确定',
    distance: 190,
    height: 190
};


QApp.addWidget('select', function(element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var kamiData = window.kamiData || {};

    var select = new Select(_.extend({}, opt, {
        container: element,
        datasource: _.isString(opt.datasource) ? kamiData[opt.datasource] : [],
        value: opt.value || {}
    }));

    select.render();

    if (view) {
        view.on('destroy', function() {
            if (caleselectnder) {
                select.destroy();
                select = null;
            }
        });
    }

    return {
        getValue: function() {
            return select.getValue();
        },
        destroy: function() {
            select.destroy();
        }
    };
});

QApp.addWidget('popselect', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var kamiData = window.kamiData || {};

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-select';


    var tpl = options.dialogTemplate || template;

    QApp.defineView(viewName, {
        html: tpl.replace('RIGHT', options.rightBtn).replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, {backgroundColor: 'white'}, options.styles),
        ready: function() {
            var me = this;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            var select = new Select(_.extend({}, options, {
                container: me.root.querySelector('.content'),
                datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || [],
                value: (_.isString(options.value) ? kamiData[options.value] : options.value) || {}
            }));

            select.render();

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            _.addEvent(me.root.querySelector('.ar'), 'tap', function() {
                me.trigger('callback', select.getValue());
                me.hide();
            });

            me.on('destroy', function() {
                if (select) {
                    select.destroy();
                    select = null;
                }
            });
        },
    });

    return open(viewName, _.extend({}, options, {
        param: options.param,
        ani: _.extend({}, options, {
            name: options.popAni
        }),
        onComplete: function(value) {
            if (_.isFunction(options.onComplete)) {
                options.onComplete(value);
            }
            if (element) {
                _.dispatchEvent(element, options.callbackEvent || 'callback', value);
            }
        }
    }), element);
}, 'tap');

module.exports = {
    setOption: function(opt) {
        
        _.extend(DEFAULT_OPT, opt);
    }
};
