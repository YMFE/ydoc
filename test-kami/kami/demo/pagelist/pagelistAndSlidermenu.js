/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var Pagelist = require('../../scripts/pagelist/index.js');
var ItemTpl = require('./pagelistAndSlidermenu-item.string');
var NodataTpl = require('./pagelist-nodata.string');
var SliderMenu = require('../../scripts/slidermenu/index.js');

var constant = {
    FAIL: 0,
    EMPTY: 1
};
var status = constant.FAIL;

document.addEventListener('DOMContentLoaded', function () {
    var datasource = [];
    var index = 1, max = index + 15;
   window.pagelist = new Pagelist({
        container: '#container',
        datasource: datasource,
        pagesize: 15,
        refreshResultDelay: 300,
        tapInterval: 1000,
        canLockY: true,
        itemTpl: ItemTpl,
        nodataTpl: NodataTpl,
        nodataViewData: {
            status: constant.FAIL
        },
        activeClass: 'item-active',
        selectedClass: 'item-active',
        nodataViewData: {data: 1},
        onSelectItem: function(data) {
            console.log(data);
        },
        onReady: function() {
            var sm = new SliderMenu({
                container: '[data-role=itemwrap]',
                direction: -1,
                width: 80,
                ontap: function (item) {
                    console.log(item);
                }
            });
            sm.render();
        },
        onRefresh: function(pageNum) {
            var self = this;
            // 模拟异步请求
            setTimeout(function() {
                if(index < 300) {
                    var data = [], max = index + 15;
                    for(; index < max; index++) {
                        data.push({id: index, text: 'row' + index});
                    }
                    self.refresh(data);
                } else {
                    self.refresh(null, true);
                }

            }, 1000);
        },
        onLoadMore: function (pageNum) {
            console.log('pageNum: ' + pageNum);
            var self = this;
            // 模拟异步请求
            setTimeout(function() {
                if(index < 50000) {
                    var data = [], max = index + 15;
                    for(; index < max; index++) {
                        data.push({id: index, text: 'row' + index});
                    }
                    self.loadMore(data);
                } else {
                    self.loadMore(null, true);
                }
            }, 300);
        }
    });
    window.pagelist.render();
    


    //setTimeout(function() {
    //    pagelist.updateListItem({id: 111, text: '<span style="color: red;">row' + 111 + '</span>'}, 0);
    //    pagelist.simulateRefresh();
    //}, 2000);

    //setTimeout(function() {
    //    //pagelist.reloadNodataView({data: 'nodata'});
    //    pagelist.reloadData();
    //}, 5000);

    document.body.addEventListener('touchstart', function(e) {
        if(e.target.id == 'btnRefresh') {
            if(status == constant.FAIL) {
                status = constant.EMPTY;
                pagelist.reloadNodataView({status: constant.EMPTY});
            } else {
                for(; index < max; index++) {
                    datasource.push({id: index, text: 'row' + index});
                }
                pagelist.reloadData(datasource);
            }
        }
    }, false);
});