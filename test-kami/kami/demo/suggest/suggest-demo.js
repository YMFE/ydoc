/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/15
 */
var Suggest = require('../../scripts/suggest/index.js');

document.addEventListener('DOMContentLoaded', function () {
    var datasource = [
        {id: '1', text: '阿里', py: 'al'},
        {id: '1', text: '鞍山', py: 'as'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '北京', py: 'bj'},
        {id: '1', text: '包头', py: 'bt'},
        {id: '1', text: '北海', py: 'bh'},
        {id: '1', text: '成都', py: 'cd'},
        {id: '1', text: '大同', py: 'dt'},
        {id: '1', text: '大同', py: 'ee'},
        {id: '1', text: '大同', py: 'ee'},
        {id: '1', text: '福州', py: 'fz'},
        {id: '1', text: '广州', py: 'gz'},
        {id: '1', text: '杭州', py: 'hz'},
        {id: '1', text: '海口', py: 'hk'},
        {id: '1', text: '北京', py: 'ij'},
        {id: '1', text: '北京', py: 'jj'},
        {id: '1', text: '北京', py: 'kj'},
        {id: '1', text: '兰州', py: 'lz'},
        {id: '1', text: '兰州2', py: 'lz'},
        {id: '1', text: '兰州3', py: 'lz'},
        {id: '1', text: '北京', py: 'mj'},
        {id: '1', text: '北京', py: 'nj'},
        {id: '1', text: '北京', py: 'oj'},
        {id: '1', text: '北京', py: 'pj'},
        {id: '1', text: '泉州', py: 'qz'},
        {id: '1', text: '北京', py: 'rj'},
        {id: '1', text: '上海', py: 'sh'},
        {id: '1', text: '深圳', py: 'sz'},
        {id: '1', text: '北京', py: 'tj'},
        {id: '1', text: '北京', py: 'uj'},
        {id: '1', text: '北京', py: 'vj'},
        {id: '1', text: '武汉', py: 'wh'},
        {id: '1', text: '厦门', py: 'xm'},
        {id: '1', text: '北京', py: 'yj'},
        {id: '5', text: '漳州', py: 'zz'}
    ];

    var datasource1 = [
        {id: '1', text: '阿里1', py: 'al'},
        {id: '1', text: '鞍山1', py: 'as'},
        {id: '1', text: '北京1', py: 'bj'},
        {id: '1', text: '包头1', py: 'bt'},
        {id: '1', text: '北海1', py: 'bh'},
        {id: '1', text: '成都1', py: 'cd'},
        {id: '1', text: '大同1', py: 'dt'},
        {id: '1', text: '福州1', py: 'fz'},
        {id: '1', text: '广州1', py: 'gz'},
        {id: '1', text: '杭州1', py: 'hz'},
        {id: '1', text: '海口1', py: 'hk'},
        {id: '1', text: '兰州1', py: 'lz'},
        {id: '1', text: '泉州1', py: 'qz'},
        {id: '1', text: '上海1', py: 'sh'},
        {id: '1', text: '深圳1', py: 'sz'},
        {id: '1', text: '武汉1', py: 'wh'},
        {id: '1', text: '厦门1', py: 'xm'},
        {id: '1', text: '北京1', py: 'yj'},
        {id: '5', text: '漳州1', py: 'zz'}
    ];
    var suggest = new Suggest({
        // common
        container: document.body,
        datasource: datasource,
        // 忽略大小写
        ignorecase: true,
        // 是否启用独占的模态框模式
        modal: true,
        // 是否异步加载数据
        async: true,
        skin: 'yo',
        //suggest
        filterBy: ['text', 'id', 'py'],
        filter: function(ds) {
            if(ds && ds.length) {
                return [{id: '5', text: '漳州1', py: 'zz'}]
            }
            return [];
        },
        onSelectFilterItem: function(data) {
            console.log(data);
        },
        onChangeValue: function(newVal, oldVal) {
            console.log('newVal: ' + newVal + ', oldVal: ' + oldVal);
            if(!newVal) {
                suggest.filterData([]);
                return;
            }
            setTimeout(function() {
                suggest.filterData(datasource1);
            }, 500);
        }
    });
    suggest.on('changevalue', function() {
        console.log(arguments);
    });
    suggest.render();
});