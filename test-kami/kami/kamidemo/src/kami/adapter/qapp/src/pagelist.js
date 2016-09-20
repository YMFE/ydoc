require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Pagelist = QApp.Kami.Pagelist = require('../../../scripts/pagelist/index.js');

var template = [
    '<div class="kami-header">',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="kami-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {

};

var DEFAULT_POP_OPT = {
    router: true,
    popAni: 'moveEnter',
    barClass: '',
    title: '',
    leftBtn: '取消',
    activeClass: 'item-light',
    distance: 400,
    height: 400,
    async: false
};

QApp.addWidget('poppagelist', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_POP_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-pagelist';
    var kamiData = window.kamiData || {};
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, options.styles, {
            backgroundColor: 'white'
        }),
        ready: function() {
            var me = this,
                pagelist;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            if (options.async) {
                me.initpagelist = function(opt) {
                    opt = opt || {};

                    pagelist = new Pagelist(_.extend({}, options, opt, {
                        container: me.root.querySelector('.content')
                    }));

                    pagelist.render();

                    if (_.isFunction(options.onRender)) {
                        options.onRender();
                    }
                };
            } else {
                pagelist = new Pagelist(_.extend({}, options, {
                    container: me.root.querySelector('.content'),
                    datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || []
                }));

                pagelist.render();
            }

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            me.on('destroy', function () {
                if (pagelist) {
                    pagelist.destroy();
                    pagelist = null;
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

QApp.addWidget('pagelist', function(element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var pagelist = null;

    if (view) {
        view.on('destroy', function () {
            if (pagelist) {
                pagelist.destroy();
                pagelist = null;
            }
        });
    }

    return {
        init: function(opt) {
            pagelist = new Pagelist(_.extend({}, DEFAULT_OPT, opt)).render();
            return pagelist;
        },
        getValue: function() {
            return pagelist.getValue();
        },
        destroy: function() {
            pagelist.destroy();
        },
        reloadData: function(data) {
            pagelist.reloadData(data);
        },
        scrollTo: function(y, time) {
            pagelist.scrollTo(y, time);
        }
    };
});

module.exports = {
    setOption: function(opt) {
        _.extend(DEFAULT_OPT, opt);
    },
    setPopOption: function(opt) {
        _.extend(DEFAULT_POP_OPT, opt);
    }
};
