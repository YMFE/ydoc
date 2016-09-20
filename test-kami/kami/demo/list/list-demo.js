/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var List = require('../../scripts/list/index.js');

document.addEventListener('DOMContentLoaded', function () {
    var datasource = [];
    for(var i = 1; i <= 50; i++) {
        datasource.push({id: i, text: 'row' + i});
    }
    var list = new List({
        container: '#container',
        datasource: datasource,
        preventDefault: true,
        activeClass: 'item-active',
        onTap: function(e) {
            console.log(e.target);
        }
    });
    list.render();
});