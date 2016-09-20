// var Tips = require('../scripts/widget/Tips/Tips.js');
// var tips = new Tips({
//     // autoHide: false,
//     autoHideTime:3,//默认为2
//     content: '<i class="yo-ico g-error">&#xf06a;&#xf06a;</i&#xf06a;</i>&#xf06a;</i><span class="text">请填写商户电话</span>',
//     onhide: function() {
//         alert('我是hide后执行的方法')
//     }
// });
// window.tips = tips;
// tips.show();

// setTimeout(function(){
//     tips.setContent('dsfsd');
//     tips.show();
// }, 3000)

var KamiTips = require('../../scripts/tip/index.js');

var $kami = require('../../scripts/util/index.js');
window.KamiTips = KamiTips;



var customTpl = '<div class="yo-tip testClass">' +
    '<i>我是自定义模板</i>' +
'</div>';


$kami('#fromDefault').on('tap', function() {
    KamiTips.show({
        content: '<i>提示...</i>',
        autoHide: false,
        autoHideTime: 5,
        effect: {
            duration: 0.5,
            easing: 'linear',
            delay: 0
        },
        onhide: function () {
            // alert(1);
            console.log(1);
            // KamiTips.hide();
        }

    });
    window.KamiTipsDefault = KamiTips;
});
$kami('#fromCustom').on('tap', function () {
    KamiTips.show({
        template: customTpl,
        autoHide: true,
        autoHideTime: 3,
        force: true,
        effect: {
            duration: 0.5,
            easing: 'linear',
            delay: 0
        },
        onhide: function () {
            // alert(1);
            console.log(2);
            // KamiTips.hide();
        }

    });
    window.KamiTipsCustom = KamiTips;
    
});