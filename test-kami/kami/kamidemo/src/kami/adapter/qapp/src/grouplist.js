require('./base.js');

var QApp = window.QApp,
    _ = QApp.util,
    GroupList = QApp.Kami.GroupList = require('../../../scripts/grouplist/index.js');


var DEFAULT_OPT = {

};
QApp.addWidget('grouplist', function (element, opt, view) {

    opt = opt || {};

    if (opt.popAni === 'popup' && opt.router === void 0) {
        opt.router = false;
    }

    var grouplist = null;

    if (view) {
        view.on('destroy', function () {
            if (grouplist) {
                grouplist.destroy();
                grouplist = null;
            }
        });
    }

    return {
        init: function (opt) {
            grouplist = new GroupList(_.extend({}, DEFAULT_OPT, opt)).render();
            return grouplist;
        },
        getValue: function () {
            return grouplist.getValue();
        },
        destroy: function () {
            grouplist.destroy();
        },
        reloadData: function (data) {
            grouplist.reloadData(data);
        },
        scrollTo: function (y, time) {
            grouplist.scrollTo(y, time);
        }
    };
});

module.exports = {
    setOption: function (opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};