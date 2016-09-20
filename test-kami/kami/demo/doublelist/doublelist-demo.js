/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var Doublelist = require('../../scripts/doublelist/index.js');
var MainItemTpl = require('./list-main-item.string');

document.addEventListener('DOMContentLoaded', function () {
    var categoryDS = [
        {id: 1, text: '销量排行', cate: 'xl'},
        {id: 2, text: '特色炸鸡类', cate: 'zj'},
        {id: 3, text: '套餐类(中薯+中可)', cate: 'tc'},
        {id: 4, text: '汉堡类', cate: 'hb'},
        {id: 5, text: '米饭类', cate: 'mf'},
        {id: 6, text: '汤品类', cate: 'tp'}
    ];

    var mainDS = {
        'xl': [
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15}
        ],
        'zj': [
            {id: 1, text: '香辣鸡翅zj', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15},
            {id: 1, text: '香辣鸡翅', saleNum: 437, zan: 32, price: 10},
            {id: 2, text: '吮指原味鸡', saleNum: 333, zan: 22, price: 10.5},
            {id: 3, text: '新奥良烤翅', saleNum: 123, zan: 18, price: 11},
            {id: 4, text: '香辣鸡腿堡', saleNum: 243, zan: 15, price: 16.5},
            {id: 5, text: '老北京鸡肉卷', saleNum: 111, zan: 0, price: 15}
        ]
    };

    var doubleList = new Doublelist({
        container: '#container',
        datasource: mainDS,
        category: categoryDS,
        mainItemTpl: MainItemTpl,
        key: 'cate',
        activeClass: 'item-active',
        selectFirst: true,
        infinite: false,
        categoryListSelectedClass: 'item-active',
        onSelectCategory: function(data) {
            var cate = data[this.get('key')];
            var ds = this.get('datasource')[cate];
            this.reloadMainList(ds);
        },
        onSelectMain: function(data) {
            console.log(data);
        }
    });
    doubleList.render();
});