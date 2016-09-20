/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var Grouplist = require('../../scripts/grouplist/index.js');

document.addEventListener('DOMContentLoaded', function () {
    var datasource = [
        {value: '1', text: '阿里', py: 'al'},
        {value: '1', text: '鞍山', py: 'as'},
        {value: '1', text: '北京', py: 'bj'},
        {value: '1', text: '包头', py: 'bt'},
        {value: '1', text: '北海', py: 'bh'},
        {value: '1', text: '成都', py: 'cd'},
        {value: '1', text: '大同', py: 'dt'},
        {value: '1', text: '大同', py: 'ee'},
        {value: '1', text: '大同', py: 'ee'},
        {value: '1', text: '福州', py: 'fz'},
        {value: '1', text: '广州', py: 'gz'},
        {value: '1', text: '杭州', py: 'hz'},
        {value: '1', text: '海口', py: 'hk'},
        {value: '1', text: '北京', py: 'ij'},
        {value: '1', text: '北京', py: 'jj'},
        {value: '1', text: '北京', py: 'kj'},
        {value: '1', text: '兰州', py: 'lz'},
        {value: '1', text: '兰州2', py: 'lz'},
        {value: '1', text: '兰州3', py: 'lz'},
        {value: '1', text: '北京', py: 'mj'},
        {value: '1', text: '北京', py: 'nj'},
        {value: '1', text: '北京', py: 'oj'},
        {value: '1', text: '北京', py: 'pj'},
        {value: '1', text: '泉州', py: 'qz'},
        {value: '1', text: '北京', py: 'rj'},
        {value: '1', text: '上海', py: 'sh'},
        {value: '1', text: '深圳', py: 'sz'},
        {value: '1', text: '北京', py: 'tj'},
        {value: '1', text: '北京', py: 'uj'},
        {value: '1', text: '北京', py: 'vj'},
        {value: '1', text: '武汉', py: 'wh'},
        {value: '1', text: '厦门', py: 'xm'},
        {value: '1', text: '北京', py: 'yj'},
        {value: '1', text: '漳州', py: 'zz'},
        {value: '1', text: '漳州', py: 'zz'},
        {value: '1', text: '漳州', py: 'zz'},
        {value: '1', text: '漳州', py: 'zz'}
    ];

    var grouplist = new Grouplist ({
        container: '#container',
        datasource: datasource,
        groupBy: 'py',
        activeClass: 'item-active',
        notgroupData: [
            {value: '1', text: '热门客栈'},
            {value: '2', text: '热门酒店'},
            {value: '3', text: '测试航班'}
        ],
        previousData: [
            {value: '4', text: '武汉', py: 'wh', indexText: '&#xf04a;', indexCls: 'yo-ico', flag: 'item1', title: '当前位置'},
            {value: '5', text: '厦门', py: 'xm', indexText: '历史', title: '历史城市1'},
            {value: '6', text: '杭州', py: 'hz', indexText: ' ', title: '历史城市2'},
            {value: '7', text: '漳州', py: 'zh', indexText: '热门', title: '热门城市'}
        ],
        onSelectItem: function(data) {
            console.log(data);
        }
    }).render();

    grouplist.getItemByFlag('item1').html('<span style="color: red;">loading...</span>');
    setTimeout(function() {
        grouplist.getItemByFlag('item1').html('<span style="color: red;">加载失败</span>');
    }, 2000);
});