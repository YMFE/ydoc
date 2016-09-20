


var PopSelect = require('../../scripts/popselect/index.js');
var $kami = require('../../scripts/util/index.js');

document.addEventListener('DOMContentLoaded', function () {
    // var 
    $kami('.showDefault').on('tap', function() {

        var popSelect = new PopSelect({
            // element: '<div class="yo-popselect"></div>',
            infinite: true,
            displayCount: 5,
            title: '选择测试数据',
            effect: true,
            resizable: true,
            onok: function (close) {
                console.log('ok and curvalue=');
                console.debug(this.getValue());
                close();
            },
            oncancel: function (close) {
                console.log('close and curvalue=');
                console.debug(this.getValue());
                close();
            },
            datasource: [
                {
                    key: 'lixuan',
                    datasource : [
                        {text: '测试数据0', value: 0},
                        {text: '测试数据1', value: 1},
                        {text: '测试数据2', value: 2},
                        {text: '测试数据3', value: 3},
                        {text: '测试数据4', value: 4},
                        {text: '测试数据5', value: 5},
                        {text: '测试数据6', value: 6},
                        {text: '测试数据7', value: 7},
                        {text: '测试数据8', value: 8},
                        {text: '测试数据9', value: 9}
                    ],
                    value: 9,
                    
                    tag: '单位'
                },
                {
                    key: 'day',
                    datasource : [
                        // {text: '实验0', value: 0},
                        {text: '实验1', value: 1},
                        {text: '实验2', value: 2}
                    ],
                    value: 1,
                    infinite: false,
                    tag: '单位'
                }
            ],
            onchangevalue : function (key, value, pvalue) {
                if (key === 'lixuan') {
                    if (value.value > 4) {
                        this.setValue('day', 0);
                    }
                    else {
                        this.setValue('day', 2);
                    }
                }
                // console.log('onchangevalue:', key, value.text, pvalue.text);
            }
        });
        popSelect.show();
        window.popSelect = popSelect;
        setTimeout(function () {
            console.log('5s 自动回收');
            // popSelect.destroy();
        }, 5000);
    });
    
});


