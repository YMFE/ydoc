/**
 * @description 模块描述
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/9
 */
var Pagelist = require('../../scripts/pagelist/index.js');
var ItemTpl = require('./pagelist-item.string');
var NodataTpl = require('./pagelist-nodata.string');
var ImageLazyLoad = require('../../scripts/imagelazyload/index.js');
var $ = require('../../scripts/util/index.js');


var SliderMenu = require('../../scripts/slidermenu/index.js');

var constant = {
    FAIL: 0,
    EMPTY: 1
};
var status = constant.FAIL;

var imgSrc = "http://misc.360buyimg.com/lib/img/e/logo-201305.png";

document.addEventListener('DOMContentLoaded', function () {
    var pagesize = 15;
    var datasource = [], refreshCount = 0;
    var index = 1, max = index + pagesize -1;
    for(; index < max; index++) {
        datasource.push({id: index, text: 'row' + index, src: imgSrc});
    }
    console.log(datasource.length);
    var pagelist = new Pagelist({
        container: '#container',
        datasource: datasource,
        pagesize: pagesize,
        refreshResultDelay: 300,
        tapInterval: 1000,
        loadmoreActiveY: -150,
        canLockY: true,
        infinite: true,
        itemTpl: ItemTpl,
        nodataTpl: '',
        nodataViewData: {
            status: constant.FAIL
        },
        activeClass: 'item-active',
        selectedClass: 'item-active',
        nodataViewData: {data: 1},
        onSelectItem: function(data, itemEl, target) {
            console.log(data);
        },
        onReady: function() {
            var sm = new SliderMenu({
                container: '[data-role=itemwrap]',
                direction: -1,
                width: 100,
                ontap: function (item) {
                    console.log(item);
                    return false;
                }
            });
            sm.render();

            this.imgLazyLoad = new ImageLazyLoad({
                container: '[data-role="itemwrap"]'
            });
        },
        onRefresh: function(pageNum) {
            // this.imgLazyLoad.scan();
            // var self = this;
            // // 模拟异步请求
            // setTimeout(function() {
            //     if(refreshCount < 10) {
            //         var data = [];
            //         index = 1, max = index + pagesize;
            //         for(; index < max; index++) {
            //             data.push({id: index, text: 'row' + index, src: imgSrc});
            //         }
            //         self.refresh(data);
            //     } else {
            //         self.refresh(null, true);
            //     }

            // }, 1000);
        },
        onLoadMore: function (pageNum) {
            this.imgLazyLoad.scan();
            console.log('pageNum: ' + pageNum);
            // var self = this;
            // // 模拟异步请求
            // setTimeout(function() {
            //     if(index < 50) {
            //         var data = [];
            //         max = index + pagesize;
            //         for(; index < max; index++) {
            //             data.push({id: index, text: 'row' + index, src: imgSrc});
            //         }
            //         self.loadMore(data);
            //     } else {
            //         self.loadMore(null);
            //     }
            // }, 200);
        }
    });
    pagelist.render();
    
    pagelist.on('scroll', function(y) {
        this.imgLazyLoad.lazyload(y);
    });

    //setTimeout(function() {
    //    pagelist.updateListItem({id: 111, text: '<span style="color: red;">row' + 111 + '</span>'}, 0);
    //    pagelist.simulateRefresh();
    //}, 2000);

    //setTimeout(function() {
    //   //pagelist.reloadNodataView({data: 'nodata'});
    //   pagelist.reloadData();
    //}, 5000);

    document.body.addEventListener('touchstart', function(e) {
        if(e.target.id == 'btnRefresh') {
            if(status == constant.FAIL) {
                status = constant.EMPTY;
                pagelist.reloadNodataView({status: constant.EMPTY});
            } else {
                for(; index < max; index++) {
                    datasource.push({id: index, text: 'row' + index, src: imgSrc});
                }
                pagelist.reloadData(datasource);
                pagelist.imgLazyLoad.scan();
            }
        }
    }, false);
});