var $ = require('../../scripts/util/index.js'),
	Imagelazyload = require('../../scripts/imagelazyload/index.js'),
	ItemTpl = require('./pagelist-item.string'),
	NodataTpl = require('./pagelist-nodata.string'),
	Pagelist = require('../../scripts/pagelist/index.js'),
	jsonData = require('./data.js'),
	list = jsonData.listItem;


document.addEventListener('DOMContentLoaded', function () {
    window.pagelist = new Pagelist({
        container: '#container',
        datasource: list,
        pagesize: 20,
        refreshResultDelay: 30,
        itemTpl: ItemTpl,
        nodataTpl: NodataTpl,
        activeClass: 'item-active',
        selectedClass: 'item-active',
        useLoadmore: true,
        onReady: function(){
        	var self = this;
			window.imglazyLoad = new Imagelazyload({
				container: '#container',
				autoStoreSrc: false
			});
			index = 20;
            // window.setTimeout(function(){
            //     $('.yo-list')[0].insertAdjacentHTML('afterbegin', '<li class="item" id="add" data-role="list-item" data-index="0">  <img src="//gw3.alicdn.com/bao/uploaded/i2/TB1jc4GHFXXXXaRapXXXXXXXXXX_!!0-item_pic.jpg" width="100" height="100" draggable="false" data-src="//gw3.alicdn.com/bao/uploaded/i2/TB1jc4GHFXXXXaRapXXXXXXXXXX_!!0-item_pic.jpg">  <div class="text">  <p class="tit">西子相约蕾丝连衣裙2015夏装刺绣欧美显瘦气质绣花打底短裙连衣裙</p>  <span class="price">￥265.00</span>  <div class="yo-flex flex-coloum details">  <p class="flex">已省3元</p>  <p class="flex">无线专享价</p>  </div>  </div> </li>');
            // }, 3000);
        },
        onselectitem: function(data){
            console.log(data);
        },
        onrefresh: function(){
            var self = this;
            // 模拟异步请求
            setTimeout(function() {
                if(index < 100) {
                    index += 20;
                    self.refresh(list);
                    window.imglazyLoad.scan().lazyload(0);
                } else {
                    self.refresh([],false);
                }
            }, 1000);
        },
        onloadmore: function(){
            var self = this;
            // 模拟异步请求
            setTimeout(function() {
                if(index < 80) {
                    index += 20;
                    self.loadMore(list);
                    window.imglazyLoad.scan().lazyload(0);
                } else {
                    self.loadMore([],false);
                }
            }, 1000);
        }
    });
    window.pagelist.render();
    window.pagelist.on('scroll', function(y) {
    	window.imglazyLoad && window.imglazyLoad.lazyload(y);
    });
});