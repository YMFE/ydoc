var Template = require('../../scripts/template/index.js');
// Template.config('escape', true);
document.addEventListener('DOMContentLoaded', function () {
    var student = {
        name: 'lixuan',
        tag : true,
        courses: [
            { 'name': 'kami', 'duration': '4' },
            { 'name': 'QApp', 'duration': '4' },
            { 'name': 'Other', 'duration': '2' }
        ]
    };
    var data = '{"list":[{"img":"http://gw.alicdn.com/tps/i1/TB12_iHHXXXXXaCXVXXdIns_XXX-1125-352.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://img02.taobaocdn.com/imgextra/i2/420567757/TB2isO1bFXXXXXUXpXXXXXXXXXX-420567757.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://i.mmcdn.cn/simba/img/TB1v8hQGXXXXXX1XXXXSutbFXXX.jpg_q502a.jpg","href":"www.baidu.com"},{"img":"http://i.mmcdn.cn/simba/img/TB10J9OHXXXXXbUXFXXSutbFXXX.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://gw.alicdn.com/tps/i1/TB12_iHHXXXXXaCXVXXdIns_XXX-1125-352.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://img02.taobaocdn.com/imgextra/i2/420567757/TB2isO1bFXXXXXUXpXXXXXXXXXX-420567757.jpg_q50.jpg","href":"www.baidu.com"}],"dots":true,"originData":[{"img":"http://img02.taobaocdn.com/imgextra/i2/420567757/TB2isO1bFXXXXXUXpXXXXXXXXXX-420567757.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://i.mmcdn.cn/simba/img/TB1v8hQGXXXXXX1XXXXSutbFXXX.jpg_q502a.jpg","href":"www.baidu.com"},{"img":"http://i.mmcdn.cn/simba/img/TB10J9OHXXXXXbUXFXXSutbFXXX.jpg_q50.jpg","href":"www.baidu.com"},{"img":"http://gw.alicdn.com/tps/i1/TB12_iHHXXXXXaCXVXXdIns_XXX-1125-352.jpg_q50.jpg","href":"www.baidu.com"}],"button":true}';
    data = JSON.parse(data);
    var tpl = require('./template-demo.string');
    var html = Template(tpl, data);
    var wrap = document.querySelector('.js-wrap');
    wrap.innerHTML = html;

});
