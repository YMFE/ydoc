var KamiAlert = require('../../scripts/alert/index.js');
var $kami = require('../../scripts/util/index.js');

$kami('#fromDefault').on('tap', function () {
    KamiAlert.show({
        content: '提示',
        title : '标题',
        okText: '确定',
        extraClass: 'bbb',
        onok: function () {
            
            console.log('ok');
            this.hide();
        }
    });
    window.KamiAlertDefault = KamiAlert;
});
$kami('#fromCustom').on('tap', function () {
    KamiAlert.show({
        template: '<div class="yo-dialog ui-alert">' + 
                    '<div class="hd">header</div>' +
                    '<div class="bd">content</div>' + 
                    '<div class="ft"><a href="javascript:void(0)" class="yo-btn yo-btn-dialog yo-btn-l js-dialog-btn-ok" data-role="ok">Ok</a></div>' +
                '</div>',
        onok: function () {
            // debugger
            // alert('确定了');
            // 
            console.log('ok');
            this.hide();
        }
    });
    window.KamiAlertCustom = KamiAlert;
});