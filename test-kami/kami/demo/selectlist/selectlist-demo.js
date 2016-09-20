/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/17
 */
var Selectlist = require('../../scripts/selectlist/index.js');

document.addEventListener('DOMContentLoaded', function () {
    var datasource = [];
    for(var i = 1; i <= 8; i++) {
        datasource.push({id: i + "", text: 'row' + i});
    }
    var selectlist = new Selectlist({
        container: '#container',
        multi: true,
        key: 'id',
        datasource: datasource,
        activeClass: 'item-active',
        defaultSelected: ['1','5'],
        onSelectItem: function(data) {
            console.log(selectlist.getValue());
        }
    }).render();
});