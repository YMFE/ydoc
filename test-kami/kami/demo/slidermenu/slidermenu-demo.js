/**
 * @description 模块描述
 */
var SliderMenu = require('../../scripts/slidermenu/index.js');

document.addEventListener('DOMContentLoaded', function () {
    

    //通过data-role="slideMenuItem" 指定可以菜单项
    //通过data-role="slideMenuCnt" 指定可以拖动的内容
    //通过data-role="slideMenuAction" 指定可以操作项的容器，删除或者修改可以放在这里
    
    var tpl = '<div class="yo-slidermenu item" data-role="slideMenuItem">' + 
                    '<div class="front" data-role="slideMenuCnt">{{content}}</div>' +
                    '<div class="action" data-role="slideMenuAction"><div action="detail">查看详情</div><div action="del">删除</div></div>' +
                '</div>';
    
    var length = 2;
    
    window['sliderCache'] = {};
    for (var j = 0; j < 2; j++) {
        var html = [];
        for (var i = 0; i < length; i++) {
            html.push(tpl.replace('{{content}}', '这是默认的slidermenu内容' + j * i + i));
        }
        (function (index) {
            
            var container = document.querySelector('#container' + index);
            container.insertAdjacentHTML('afterbegin', html.join(''));

            //初始化slidermenu组件，指定容器和方向
            window['sliderCache']['sm' + index] = new SliderMenu({
                container: '#container' + index,
                direction: (j === 0) ? - 1 : 1,
                //可操作区域的点击事件
                ontap: function (item) {
                    alert(item.innerHTML);
                },
                onopen: function(el, isOpen) {
                    console.log(el, isOpen);
                }
            });
            window['sliderCache']['sm' + j].render();
        }(j));
        
    }

    setTimeout(function() {
        alert('2s后设置第一个slidermenu的第2个item为打开状态');
        var el = document.querySelectorAll('[data-role="slideMenuCnt"]');
        window['sliderCache']['sm' + 0].setOpen(el[1], true);
    }, 2000);

});