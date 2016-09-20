require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    BizPayDialog = QApp.Kami.BizPayDialog = require('../../../scripts/bizpaydialog/index.js');

var DEFAULT_OPT = {

};

QApp.addWidget('bizpaydialog', function (element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var bizpaydialog = null;

    if (view) {
        view.on('destroy', function () {
            if (bizpaydialog) {
                bizpaydialog.destroy();
                bizpaydialog = null;
            }
        });
    }

    return {
        init: function (opt) {
            
            bizpaydialog = new BizPayDialog(_.extend({}, DEFAULT_OPT, opt)).render();
            return bizpaydialog;
        },
        destroy: function () {
            bizpaydialog.destroy();
        }
    };
});