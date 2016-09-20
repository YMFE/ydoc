var Dialog = require('../../scripts/dialog/index.js');
var $kami = require('../../scripts/util/index.js');
$kami('#fromTpl').on('tap', function() {
    var dialog = new Dialog({
        align: 'top',
        header: {
            title: 'fdsfas',
            okBtn: {
                text: '确定'
            }
        },
        resizable: true,
        content: 'sdfdsf',
        onok: function() {
            var widget = this;
            setTimeout(function() {
                // alert('隐藏啦');
                widget.hide();
                widget.destroy();
                console.log('1s消失');
                
            }, 1000);
            // console.log(1)
        }
    });
    dialog.show();
    window.dialogFromTpl = dialog;
});
$kami('#fromHtml').on('tap', function () {
    var dialog = new Dialog({
        element: '.yo-dialog',
        resizable: true,
        onok: function () {
            var widget = this;
            widget.destroy();
            console.log('消失啦'); 
            
        }
    });
    dialog.show();
    window.dialogFromHtml = dialog;
});