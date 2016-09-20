require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Datepicker = QApp.Kami.Datepicker = require('../../../scripts/datepicker/index.js');

var template = [
    '<div class="yo-header yo-header-positive">',
    '<div class="title">',
    '<h2>TITLE</h2>',
    '</div>',
    '<span class="regret btn al">',
    '<i class="yo-ico">&#xf07d;</i>',
    '</span>',
    '</div>',
    '<div class="yo-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {
    router: true,
    popAni: 'moveEnter',
    barClass: '',
    title: '选择入住离店日期',
    leftBtn: '取消',
    activeClass: 'item-light',
    distance: 400,
    height: 400,
    sync: true
};
QApp.addWidget('datepicker', function(element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var datepicker = new Datepicker(_.extend({}, DEFAULT_OPT, opt, {
        container: element,
        today: opt.today,
        offsetCheckIn: opt.offsetCheckIn,
        offsetBegin: opt.offsetBegin,
        beginDate: opt.beginDate,
        endDate: opt.endDate,
        checkIn: opt.checkIn,
        checkOut: opt.checkOut
    }));

    datepicker.render();

    if (view) {
        view.on('destroy', function () {
            if (datepicker) {
                datepicker.destroy();
                datepicker = null;
            }
        });
    }

    return {
        getValue: function() {
            return datepicker.getValue();
        },
        destroy: function() {
            datepicker.destroy();
        }
    };
});

QApp.addWidget('popdatepicker', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-datepicker';
    var kamiData = window.kamiData || {};
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, options.styles, {
            backgroundColor: 'white'
        }),
        ready: function() {
            var me = this,
                datepicker;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.yo-header'), options.barClass);
            }

            if (options.sync) {
                datepicker = new Datepicker(_.extend({}, options, {
                    container: me.root.querySelector('.content'),
                    today: _.isString(options.today) ? kamiData[options.today] : options.today,
                    offsetCheckIn: _.isNumber(options.offsetCheckIn) ? kamiData[options.offsetCheckIn] : options.offsetCheckIn,
                    offsetBegin: _.isNumber(options.offsetBegin) ? kamiData[options.offsetBegin] : options.offsetBegin,
                    beginDate: _.isString(options.beginDate) ? kamiData[options.beginDate] : options.beginDate,
                    endDate: _.isString(options.endDate) ? kamiData[options.endDate] : options.endDate,
                    checkIn: _.isString(options.checkIn) ? kamiData[options.checkIn] : options.checkIn,
                    checkOut: _.isString(options.checkOut) ? kamiData[options.checkOut] : options.checkOut
                }));

                datepicker.render();
            } else {
                me.initDatepicker = function(opt) {
                    opt = opt || {};

                    datepicker = new Datepicker(_.extend({}, options, opt, {
                        container: me.root.querySelector('.content'),
                        today: options.today,
                        offsetCheckIn: options.offsetCheckIn,
                        offsetBegin: options.offsetBegin,
                        beginDate: options.beginDate,
                        endDate: options.endDate,
                        checkIn: options.checkIn,
                        checkOut: options.checkOut

                    }));

                    datepicker.render();

                    if (_.isFunction(options.onRender)) {
                        options.onRender();
                    }
                };
            }

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            me.on('destroy', function () {
                if (datepicker) {
                    datepicker.destroy();
                    datepicker = null;
                }
            });
        }
    });

    return open(viewName, _.extend({}, options, {
        param: options.param,
        ani: _.extend({}, options, {
            name: options.popAni
        }),
        onComplete: function (value) {
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
    setOption: function (opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
