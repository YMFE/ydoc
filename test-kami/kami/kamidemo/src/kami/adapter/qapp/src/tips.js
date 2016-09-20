require('./base.js');
var QApp = window.QApp,
_ = QApp.util,
KamiTips = QApp.Kami.tips = require('../../../scripts/tips/index.js');

QApp.addWidget('tips', function(element, opt) {

    // KamiTips.show(opt);

    KamiTips.show(opt);

    return {
        hide: function() {
            KamiTips.hide();
        }
    };

}, true);
