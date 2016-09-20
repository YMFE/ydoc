require('./base.js');

var QApp = window.QApp,
    Numbers = QApp.Kami.Numbers = require('../../../scripts/numbers/index.js');

var DEFAULT_OPT = {
    max: 10,
    min: -2,
    step: 1,
    value: 0
};

QApp.addWidget('numbers', function(element, opt, view) {
    
    var num = new Numbers(QApp.util.extend({}, DEFAULT_OPT, opt, {
        container: element,
        max: parseInt(opt.max || '100'),
        min: parseInt(opt.min || '0'),
        step: parseInt(opt.step || '1'),
        value: parseInt(opt.value || '0'),
        onchangevalue: opt && opt.onchangevalue
    }));

    num.render();

    if (view) {
        view.on('destroy', function() {
            if (num) {
                num.destroy();
                num = null;
            }
        });
    }

    return {
        getValue: function () {
            return num.getValue();
        },
        destroy: function () {
            if (num) {
                num.destroy();    
            }
            
        }
    };
});

module.exports = {
    setOption: function(opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
