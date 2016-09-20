var List = require('../src/list.js');


// 默认版本，只支持text属性
var datasource = function(){
    var arr = [
        {text: 1},
        {text: 2}
    ];
    for(var i= 3, j = 20; i<=j;i++){
        arr.push({
            text: i
        })
    }
    return arr;
}();

var options = {
    container: '#container',
    datasource: datasource,
    isTransition: false,
    preventDefault: true,
    activeClass: 'item-active'
}

var list = new List( options );
    list.on('tap', function(e){
        Demo.log(e.target.innerHTML);
    });

    list.render();

