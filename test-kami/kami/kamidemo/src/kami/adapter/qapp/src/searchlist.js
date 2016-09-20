require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Searchlist = QApp.Kami.Searchlist = require('../../../scripts/searchlist/index.js');

var template = [
    '<div class="yo-header">',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="yo-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {
    router: true,
    popAni: 'moveEnter',
    barClass: '',
    title: '',
    leftBtn: '取消',
    activeClass: 'item-light',
    distance: 400,
    height: 400,
    sync: true
};

QApp.addWidget('popsearchlist', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-searchlist';
    var kamiData = window.kamiData || {};
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, options.styles, {
            backgroundColor: 'white'
        }),
        ready: function() {
            var me = this,
                searchlist;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.yo-header'), options.barClass);
            }

            if (options.sync) {
                searchlist = new Searchlist(_.extend({}, options, {
                    container: me.root.querySelector('.content'),
                    datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || [],
                    previousData: (_.isString(options.previousData) ? kamiData[options.previousData] : options.previousData) || []
                }));

                searchlist.render();
            } else {
                me.initSearchlist = function(opt) {
                    opt = opt || {};

                    searchlist = new Searchlist(_.extend({}, options, opt, {
                        container: me.root.querySelector('.content'),
                        datasource: opt.datasource,
                        previousData: opt.previousData
                    }));

                    searchlist.render();

                    if (_.isFunction(options.onRender)) {
                        options.onRender();
                    }
                };
            }

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            me.on('destroy', function () {
                if (searchlist) {
                    searchlist.destroy();
                    searchlist = null;
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
