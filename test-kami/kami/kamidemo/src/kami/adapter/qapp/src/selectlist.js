require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    SelectList = QApp.Kami.SelectList = require('../../../scripts/selectlist/index.js');

var templateSingle = [
    '<div>',
    '<div class="yo-content content" style="top:0">',
    '</div>',
    '<div>'
].join('');

var templateMulti = [
    '<div class="yo-header">',
    '<div class="btn ar">RIGHT</div>',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="yo-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {
    // template: {
    //     single: templateSingle,
    //     multi: templateMulti
    // },
    router: true,
    popAni: 'actionSheet',
    barClass: '',
    title: '',
    leftBtn: '取消',
    rightBtn: '确定',
    activeClass: 'item-light',
    distance: 190,
    height: 190,
    delay: 300
};

QApp.addWidget('selectlist', function (element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var selectlist = new SelectList(_.extend({}, DEFAULT_OPT, opt, {
        container: element,
        datasource: (_.isString(opt.datasource) ? kamiData[opt.datasource] : opt.datasource) || []
    }));

    selectlist.render();

    if (view) {
        view.on('destroy', function() {
            if (selectlist) {
                selectlist.destroy();
                selectlist = null;
            }
        });
    }

    return {
        getValue: function () {
            return selectlist.getValue();
        },
        destroy: function() {
            selectlist.destroy();
        }
    };
});

QApp.addWidget('popselectlist', function (element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-selectlist';

    var template = options.dialogTemplate ? options.dialogTemplate : (options.multi ? templateMulti : templateSingle);

    QApp.defineView(viewName, {
        html: template.replace('RIGHT', options.rightBtn).replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, {backgroundColor: 'white'}, options.styles),
        ready: function() {
            var me = this;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.yo-header'), options.barClass);
            }

            var selectlist = new SelectList(_.extend({}, DEFAULT_OPT, opt, {
                container: me.root.querySelector('.content'),
                datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || [],
                onSelectItem: function (data) {
                    if (!options.multi) {
                        me.trigger('callback', data);
                        _.delay(function () {
                            me.hide();
                        }, options.delay);
                    }
                }
            }));

            selectlist.render();

            

            if (options.multi) {
                _.addEvent(me.root.querySelector('.ar'), 'tap', function () {
                    me.trigger('callback', selectlist.getValue());
                    me.hide();
                });
                _.addEvent(me.root.querySelector('.al'), 'tap', function () {
                    me.hide();
                });
            }

            me.on('show', function() {
                selectlist && selectlist.resize();
            });

            me.on('destroy', function () {
                if (selectlist) {
                    selectlist.destroy();
                    selectlist = null;
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
    setOption: function(opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
