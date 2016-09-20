require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Calendar = QApp.Kami.Calendar = require('../../../scripts/calendar/index.js');

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
    dialogTemplate: template,
    router: false,
    popAni: 'actionSheet',
    barClass: '',
    title: '选择日期',
    leftBtn: '取消',
    rightBtn: '确定',
    distance: 190,
    height: 190
};

QApp.addWidget('calendar', function(element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var calender = new Calendar(_.extend({}, DEFAULT_OPT, opt, {
        container: element,
        dateRange: (opt.startDay && opt.endDay) ? [opt.startDay, opt.endDay] : (opt.dateRange || []),
        now: opt.now || (new Date())
    }));

    calender.render();

    if (view) {
        view.on('destroy', function () {
            if (calender) {
                calender.destroy();
                calender = null;
            }
        });
    }

    return {
        getValue: function() {
            return calender.getValue();
        },
        destroy: function() {
            calender.destroy();
        }
    };
});

QApp.addWidget('popcalendar', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-calender';
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('RIGHT', options.rightBtn).replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, {backgroundColor: 'white'}, options.styles),
        ready: function() {
            var me = this;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            var calender = new Calendar(_.extend({}, options, {
                container: me.root.querySelector('.content'),
                dateRange: (opt.startDay && opt.endDay) ? [opt.startDay, opt.endDay] : (options.dateRange || []),
                now: opt.now || (new Date())
            }));

            calender.render();

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            _.addEvent(me.root.querySelector('.ar'), 'tap', function() {
                me.trigger('callback', calender.getValue());
                me.hide();
            });

            me.on('destroy', function() {
                if (calender) {
                    calender.destroy();
                    calender = null;
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
