require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Select = require('../../../scripts/select/index.js');

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

    router: true,
    popAni: 'actionSheet',
    barClass: '',
    title: '选择时间',
    leftBtn: '取消',
    rightBtn: '确定',
    distance: 190,
    height: 190,
    value: {}
};

function range(num) {
    var ret = [];
    for (var i = 0; i < num; i++) {
        ret.push({
            text: i,
            value: i
        });
    }
    return ret;
}


QApp.addWidget('poptime', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var kamiData = window.kamiData || {};

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-time';
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('RIGHT', options.rightBtn).replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, {backgroundColor: 'white'}, options.styles),
        ready: function() {
            var me = this;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            var select = new Select(QApp.util.extend({}, DEFAULT_OPT, {
                container: me.root.querySelector('.content'),
                datasource: [{
                    key: 'hour',
                    datasource: range(24),
                    value: parseInt(options.hours) || 0,
                    infinite: false,
                    displayCount: 5
                }, {
                    key: 'minute',
                    datasource: range(60),
                    value: parseInt(options.minutes) || 0,
                    infinite: false,
                    displayCount: 5
                }, {
                    key: 'second',
                    datasource: range(60),
                    value: parseInt(options.seconds) || 0,
                    infinite: false,
                    displayCount: 5
                }],
                value: options.value || {}
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
