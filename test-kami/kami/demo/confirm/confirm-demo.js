var KamiConfirm = require('../../scripts/confirm/index.js');
var $kami = require('../../scripts/util/index.js');


var customTpl = '<div class="yo-dialog customClass">' +
    '<header class="hd">' +
        '<h2 class="title ">我是标题</h2>' +
    '</header>' +
    '<div class="bd " data-role="content">' +
        '我是内容' +
    '</div>' +
    '<footer class="ft">' +
        '<a href="javascript:void(0)" class="yo-btn yo-btn-dialog yo-btn-l " data-role="close" >取消按钮</a>' +
        '<a href="javascript:void(0)" class="yo-btn yo-btn-dialog yo-btn-l " data-role="ok">确定按钮</a>' +
    '</footer>' +
'</div>';


$kami('#fromDefault').on('tap', function() {
    KamiConfirm.show({
        content: '提示',
        title : 'title',
        okText: '确定',

        extraClass:'bah',
        resizable: true,
        cancelText: '取消',
        onok: function() {
            alert('确定了');
            this.hide();
            
        },
        oncancel: function() {
            alert('取消了');
            this.hide();
        }
    });
    window.KamiConfirmDefault = KamiConfirm;
});
$kami('#fromCustom').on('tap', function() {
    KamiConfirm.show({
        template: customTpl,
        onok: function() {
            alert('确定了');
            this.hide();
            
        },
        oncancel: function() {
            alert('取消了');
            this.hide();
        }
    });
    window.KamiConfirmCustom = KamiConfirm;
    
});