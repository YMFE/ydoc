var KamiLoading = require('../../scripts/loading/index.js');



var $kami = require('../../scripts/util/index.js');

var customTpl = '<div class="yo-loading testClass">' +
    '<i class="inner" data-role="content">loading</i>' +
'</div>';


$kami('#fromDefault').on('tap', function() {
    KamiLoading.show({
        maskOffset: [30, 30],
        content: '加载中'
    });
    window.KamiLoading = KamiLoading;
    // setTimeout(function() {
    //     KamiLoading.destroy();
    // }, 2000);
});
$kami('#fromCustom').on('tap', function() {
    KamiLoading.show({
        template: customTpl
    });
    window.KamiLoading = KamiLoading;
    // setTimeout(function () {
    //     KamiLoading.destroy();
    // }, 2000);
    
});