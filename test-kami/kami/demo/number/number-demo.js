var Numbers = require('../../scripts/number/index.js');
var $kami = require('../../scripts/util/index.js');
setTimeout(function () {
    // num.destroy()
}, 2000);


$kami('#fromDefault').on('tap', function() {
    var num = new Numbers({
        container: '#numberWrap',
        max: 10,
        min: -2,
        step: 1,
        value: 0,
        disable: true
    });
    num.render();
    window.KamiNumDefault = num;
});

var customTpl = '<div class=" testClass yo-number">\
    <span class="minus " data-role="minus">-</span>\
    <input class="input" type="text" value="" />\
    <span class="plus" data-role="plus">+</span>\
</div>';

$kami('#fromCustom').on('tap', function() {
    var num = new Numbers({
        container: '#numberWrap',
        template: customTpl,
        max: 10,
        min: -2,
        step: 1,
        value: 10
        // disable: true
    });
    num.render();
    window.KamiNumCustom = num;
});