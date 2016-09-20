/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/15
 */
var Searchlist = require('../../scripts/searchlist/index.js');

var datasource = [
    {text: '澳门', py: 'am'},
    {text: '北海', py: 'bh'},
    {text: '北京', py: 'bj'},
    {text: '包头', py: 'bt'},
    {text: '长春', py: 'cc'},
    {text: '成都', py: 'cd'},
    {text: '大理', py: 'dl'},
    {text: '福州', py: 'fz'},
    {text: '广州', py: 'gz'},
    {text: '杭州', py: 'hz'},
    {text: '海口', py: 'hk'},
    {text: '兰州', py: 'lz'},
    {text: '泉州', py: 'qz'},
    {text: '上海', py: 'sh'},
    {text: '深圳', py: 'sz'},
    {text: '武汉', py: 'wh'},
    {text: '厦门', py: 'xm'}
];

var searchlist = new Searchlist({
    // common
    container: '#container',
    datasource: datasource,
    skin: 'yo',
    //suggest
    ignorecase: true,
    filterBy: ['text', 'id', 'py'],
    modal: false,
    async: true,
    lazyload: false,
    onSelectFilterItem: function(data) {
        console.log(data);
    },
    onChangeValue: function(newVal, oldVal) {
        console.log('newVal: ' + newVal + ', oldVal: ' + oldVal);
    },
    // scrollgroup
    groupBy: 'py',
    activeClass: 'item-active',
    notgroupData: [
        {value: 'jd', text: '热门酒店'},
        {value: 'kz', text: '热门客栈'},
        {value: 'hb', text: '热门航班'}
    ],
    previousData: [
        {value: 'szj', text: '北京市海淀区苏州街', py: 'dqwz', indexText: '&#xf04a;', indexCls: 'yo-ico', flag: 'item1', title: '当前位置'},
        {value: 'bj', text: '北京市', py: 'dqcs', indexText: ' ', title: '当前城市'},
        {value: 'bj', text: '北京', py: 'ls', indexText: '历史', title: '历史数据'},
        {value: 'sh', text: '上海', py: 'ls', indexText: '历史', title: '历史数据'},
        {value: 'sz', text: '深圳', py: 'ls', indexText: '历史', title: '历史数据'},
        {value: 'xm', text: '厦门', py: 'rm', indexText: '热门', title: '热门城市'},
        {value: 'lj', text: '丽江', py: 'rm', indexText: '热门', title: '热门城市'},
        {value: 'sy', text: '三亚', py: 'rm', indexText: '热门', title: '热门城市'},
        {value: 'hz', text: '杭州', py: 'rm', indexText: '热门', title: '热门城市'},
        {value: 'cd', text: '程度', py: 'rm', indexText: '热门', title: '热门城市'}
    ],
    onSelectItem: function(data){
        console.log(data);
    },
    onChangeValue: function(newVal, oldVal) {
        console.log('newVal: ' + newVal + ', oldVal: ' + oldVal);
        if(!newVal) {
            //this.filterData([]);
            return;
        }
        var self = this;
        setTimeout(function() {
            self.filterData(datasource);
        }, 500);
    }
}).render();
searchlist.on('focus', function() {
    var widget = this;
    console.log('focus');
    setTimeout(function() {
        widget.getSuggestInputEl().blur();
        alert('我去别的地方了')
    }, 2000);

    return false;
});
// 模拟加载当前位置
searchlist.getItemByFlag('item1').html('<span style="color: red;">loading...</span>');
setTimeout(function() {
    searchlist.getItemByFlag('item1').html('<span style="color: red;">加载失败</span>');
}, 1000);