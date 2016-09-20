
require('./base.js');
var QApp = window.QApp,
    _ = QApp.util,
    KamiLoading = QApp.Kami.loading = require('../../../scripts/loading/index.js');


QApp.addWidget('loading', function (element, opt) {

    KamiLoading.show(opt);

    return {
        hide: function () {
            KamiLoading.hide();
        }
    };

}, true);
