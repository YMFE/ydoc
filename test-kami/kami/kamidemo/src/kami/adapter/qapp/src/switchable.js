require('./base.js');

var QApp = window.QApp,
    Switchable = QApp.Kami.Switchable = require('../../../scripts/switchable/index.js');

var DEFAULT_OPT = {
    speed: '.3',
	delay: 1500,
	auto: true,
	loop: true,
	button: true
};

QApp.addWidget('switchable', function(element, opt, view) {
    var switchable = new Switchable(QApp.util.extend({}, DEFAULT_OPT,{
        container: element
    }, opt));

    switchable.render();
 
    if (view) {
        view.on('destroy', function() {
            if (switchable) {
                switchable.destroy();
                switchable = null;
            }
        });
    }

    return {
        destroy: function() {
            switchable.destroy();
        }
    };
});
