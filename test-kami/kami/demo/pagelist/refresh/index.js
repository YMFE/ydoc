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

var options = {
    container: '#container',
    datasource: datasource,
    pagesize: 20,
    // 使用下拉刷新列表
    useRefresh: true,
    useLoadmore: false,
    // 刷新触发事件，必须
    onRefresh: function(){
        var data = datasource.sort(function(){
            return Math.random() - 0.5;
        });
        // 刷新数据，并且关闭刷新提示
        this.refresh( data );
    }
}

var pagelist = new Pagelist( options );

pagelist.render();