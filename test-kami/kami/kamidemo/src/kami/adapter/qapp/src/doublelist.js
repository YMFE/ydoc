require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Doublelist = QApp.Kami.Doublelist = require('../../../scripts/doublelist/index.js');

var template = [
    '<div class="kami-header">',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="kami-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {
    // template: template,
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

QApp.addWidget('popdoublelist', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-doublelist';
    var kamiData = window.kamiData || {};
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, options.styles, {
            backgroundColor: 'white'
        }),
        ready: function() {
            var me = this,
                doublelist;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            if (options.async) {
                me.initdoublelist = function(opt) {
                    opt = opt || {};

                    doublelist = new Doublelist(_.extend({}, options, opt, {
                        container: me.root.querySelector('.content'),
                        datasource: opt.datasource,
                        refreshActiveY: opt.refreshActiveY,
                        loadmoreActiveY: opt.loadmoreActiveY,
                        dragContent: opt.dragContent,
                        endContent: opt.endContent,
                        loadContent: opt.loadContent,
                        successContent: opt.successContent,
                        failContent: opt.failContent,
                        loadmoreContent: opt.loadmoreContent,
                        endmoreContent: opt.endmoreContent,
                        activeClass: opt.activeClass,

                        onSelectItem: function (data) {
                            me.trigger('callback', {
                                type: 'main',
                                data: data
                            });
                        }
                    }));

                    doublelist.render();

                    if (_.isFunction(options.onRender)) {
                        options.onRender();
                    }
                };
            } else {
                doublelist = new Doublelist(_.extend({}, options, {
                    container: me.root.querySelector('.content'),
                    datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || [],
                    onSelectItem: function(data) {
                        me.trigger('callback', {
                            type: 'main',
                            data: data
                        });
                    }
                }));

                doublelist.render();
            }

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            me.on('destroy', function () {
                if (doublelist) {
                    doublelist.destroy();
                    doublelist = null;
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

QApp.addWidget('doublelist', function(element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var doublelist = null;

    if (view) {
        view.on('destroy', function () {
            if (doublelist) {
                doublelist.destroy();
                doublelist = null;
            }
        });
    }

    return {
        init: function(opt) {
            doublelist = new Doublelist(_.extend({}, opt)).render();
            return doublelist;
        },
        destroy: function() {
            doublelist.destroy();
        }
    };
});

module.exports = {
    setOption: function(opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
