var BizPayDialog = require('../../scripts/bizpaydialog/index.js');

document.addEventListener('DOMContentLoaded', function () {
    var ds = [];
    var len = 3;
    for (var i = 0; i < len; i++) {
        ds.push({
            bankName: 'backName' + i,
            cardNo: '111111' + i,
            icon: ''
        });
    }
    var bizpaydialog = new BizPayDialog({
        container: '#canlendarWrap',
        title: {
            icon: '&#xf047;'
        },
        extraClass: 'test',
        datasource: ds,
        key: 'cardNo',
        defaultSelected: ['1111110']
    });


    bizpaydialog.render();



    bizpaydialog.on('selectitem', function (result) {
        console.log('selectitem');
        console.log(arguments);
    });

    bizpaydialog.on('selectextra', function (result) {
        console.log('selectextra');
        console.log(arguments);
    });
    
    bizpaydialog.on('close', function (result) {
        this.hide();
    });

    // setTimeout(function () {
    //     bizpaydialog.show();
    //     setTimeout(function () {
    //         bizpaydialog.destroy();
    //     }, 2000);
    // }, 5000);


});