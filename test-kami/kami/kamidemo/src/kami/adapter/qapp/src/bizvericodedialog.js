require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    BizVericodeDialog = QApp.Kami.BizVericodeDialog = require('../../../scripts/bizvericodedialog/index.js');

var DEFAULT_OPT = {

};

QApp.addWidget('bizvericodedialog', function (element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var bizvericodedialog = null;

    if (view) {
        view.on('destroy', function () {
            if (bizvericodedialog) {
                bizvericodedialog.destroy();
                bizvericodedialog = null;
            }
        });
    }

    return {
        init: function (opt) {
            
            bizvericodedialog = new BizVericodeDialog(_.extend({}, DEFAULT_OPT, opt)).render();
            return bizvericodedialog;
        },
        destroy: function () {
            bizvericodedialog.destroy();
        }
    };
});