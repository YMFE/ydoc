var BizVericodeDialog = require('../../scripts/bizvericodedialog/index.js');

document.addEventListener('DOMContentLoaded', function () {
    

    var bizvericodedialog = new BizVericodeDialog({
        container: '#canlendarWrap',
        content: {
            mobile: '',
            amount: '45.00'
        },
        //默认为获取手机号失败， 需要修改时，传入即可
        failText: '获取手机号失败',

        count: 15
    });


    bizvericodedialog.render();



    bizvericodedialog.on('error', function (result) {
        console.log('error');
    });
    bizvericodedialog.on('success', function (result) {
        console.log('success');
    });
    bizvericodedialog.on('retry', function () {
        console.log('retry');
        var widget = this;
        //如果mobile不对，需要手动调用一下,setMobile(\'\')
        //如果正常，就不用传了
        // this.setMobile('');
        widget.reset();
    });
    bizvericodedialog.on('close', function () {
        console.log('close');

    });
    window.bizvericodedialog = bizvericodedialog;
});