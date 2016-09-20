require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Suggest = QApp.Kami.Suggest = require('../../../scripts/suggest/index.js');

var template = [
    '<div class="kami-header">',
    '<div class="title">TITLE</div>',
    '<div class="btn al">CANCEL</div>',
    '</div>',
    '<div class="kami-content content">',
    '</div>'
].join('');

var DEFAULT_OPT = {
    template: template,
    router: true,
    popAni: 'moveEnter',
    barClass: '',
    title: '',
    leftBtn: '取消',
    activeClass: 'item-light',
    distance: 400,
    height: 400
};

QApp.addWidget('popsuggest', function(element, opt) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var options = _.extend({}, DEFAULT_OPT, opt),
        open = (options.router && options.router !== 'false') ? QApp.router.open : QApp.showView,
        viewName = 'pop-suggest';
    var tpl = options.dialogTemplate || template;
    QApp.defineView(viewName, {
        html: tpl.replace('CANCEL', options.leftBtn).replace('TITLE', options.title),
        styles: _.extend({}, {backgroundColor: 'white'}, options.styles),
        ready: function() {
            var me = this;
            if (options.barClass) {
                _.addClass(me.root.querySelector('.kami-header'), options.barClass);
            }

            var suggest = new Suggest(_.extend({}, options, {
                container: me.root.querySelector('.content'),
                datasource: (_.isString(options.datasource) ? kamiData[options.datasource] : options.datasource) || [],
                previousData: (_.isString(options.previousData) ? kamiData[options.previousData] : options.previousData) || [],
                onSelectFilterItem: function(data) {
                    me.trigger('callback', {
                        type: 'filter',
                        data: data
                    });
                    me.hide();
                },
                onChangeValue: function(val) {
                    if (_.isFunction(options.onChangeValue)) {
                        options.onChangeValue.apply(this, val);
                    }
                }
            }));

            suggest.render();

            _.addEvent(me.root.querySelector('.al'), 'tap', function() {
                me.hide();
            });

            me.on('destroy', function () {
                if (suggest) {
                    suggest.destroy();
                    suggest = null;
                }
            });
        }
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
