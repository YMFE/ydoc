require('./base.js');

var QApp = window.QApp,
    Switch = QApp.Kami.Switch = require('../../../scripts/switch/index.js');

QApp.addWidget('switch', function(element, opt, view) {
    
    var switchW = new Switch(QApp.util.extend({}, {
        container : element,
        containerClass:  opt.containerClass,
        state : opt.state,
        value : opt.value,
        form : opt.form,
        name : opt.name,
        template : opt.template,
        onchangevalue: function (value, preValue) {
            
            if (view[opt.onchangevalue]) {
                view[opt.onchangevalue].apply(this, arguments);
            }
        }
    }));

    switchW.render();

    if (view) {
        view.on('destroy', function() {
            if (switchW) {
                switchW.destroy();
                switchW = null;
            }
        });
    }

    return switchW;
});

module.exports = {
    setOption: function(opt) {
        _.extend(DEFAULT_OPT, opt);
    }
};
