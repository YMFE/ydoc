require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    Panel = QApp.Kami.Panel = require('../../../scripts/panel/index.js');

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




QApp.addWidget('panel', function (element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var panel = null;

    if (view) {
        view.on('destroy', function () {
            if (panel) {
                panel.destroy();
                panel = null;
            }
        });
    }

    return {
        init: function (opt) {
            panel = new Panel(_.extend({}, DEFAULT_OPT, opt)).render();
            return panel;
        }
        
    };
});

module.exports = {
    setOption: function (opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
