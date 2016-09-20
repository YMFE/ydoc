var Pagelist = require('../../../scripts/pagelist/index.js');


// 默认版本，只支持text属性
var datasource = [
    {text: 1},
    {text: 2}
];

for(var i= 3, j = 20; i<=j;i++){
    datasource.push({
        text: i
    })
}

// 基础版本，只展示列表
var options = {
    container: '#container',
    datasource: datasource,
    pagesize: 20,
    useRefresh: false,
    useLoadmore: false
}

var pagelist = new Pagelist( options );

pagelist.render();