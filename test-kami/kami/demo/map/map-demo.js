var Map = require('../../scripts/map/index.js');

var $ = require('../../scripts/util/index.js');
// var now = new Date();
// now.setFullYear(1995);
// now.setMonth(0);
// now.setDate(1);

// var end = new Date();
// end.setFullYear(2035);
// end.setMonth(11);
// end.setDate(31);
document.addEventListener('DOMContentLoaded', function () {

    var map = null;
    var address = '苏州街维亚大厦';
    var city = '北京';
    var time = 5;

    var fromDefault = document.querySelector('#fromDefault');
    fromDefault.addEventListener('click', function() {

        if (map == null || !map._isInit) {
            map = new Map({
                container: '#calendarWrap',
                'onready': function() {
                    console.log('ready');
                    map.addZoomControl();
                    // map.on('select', function (point) {
                        
                    //     map.addMaker(point);
                    // });
                    setTimeout(function () {
                        console.log(time + 's 后 定位到维亚大厦');
                        map.getPointByAddress(address, city, function (point) {
                            map.panTo(point);
                            map.addMaker(point);
                        });
                    }, time * 1000);
                }
            });
            map.render();
            console.log('render');
            
        }
        else {
            map.destroy();
            map = null;
        }
            


            
            
    });
    
});
// window['widget_haha_q'] = function (data) {
//     console.log('dd');
//     console.log(data);
//     var map = new BMap.Map("allmap");            // 创建Map实例
//     var point = new BMap.Point(116.404, 39.915); // 创建点坐标
//     map.centerAndZoom(point,15);                 // 初始化地图,设置中心点坐标和地图级别。
//     map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
// };
// var el = document.createElement('SCRIPT');
// el.type = 'text/javascript';
// el.src = 'http://api.map.baidu.com/api?type=quick&ak=CA4de4f8d8e3c3891eb39a78f8343cd4&v=1.0&callback=widget_haha_q';
// document.getElementsByTagName('HEAD')[0].appendChild(el);
// 百度地图API功能
// window.setTimeout(function(){
//         window.location.reload();
//     }, 5000); 
