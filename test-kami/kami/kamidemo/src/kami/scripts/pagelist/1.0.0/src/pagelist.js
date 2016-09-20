/**
 * 分页列表
 * 
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Pagelist
 * @constructor
 * @extends List
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/pagelist/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var List = require('../../../list/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var ListTpl = require('./tpl/pagelist.string');
var ItemTpl = require('./tpl/pagelist-item.string');
var NodataTpl = require('./tpl/pagelist-nodata.string');
var RefreshTpl = require('./tpl/pagelist-refresh.string');
var LoadmoreTpl = require('./tpl/pagelist-loadmore.string');

var Pagelist = List.extend({
    /**
     * @property {Number} pagesize 每页加载的数据量，默认15条
     * @property {Boolean} useRefresh 是否启用刷新功能，默认为true，开启下来刷新组件
     * @property {Boolean} useLoadmore 是否启用加载更多功能，默认为true，开启上拉加载更多
     * @property {Boolean} infinite 是否加载大量数据，默认为false，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据
     * @property {String} selectedClass 选中后的样式
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为false，true使用css的transition，false使用js动画
     * @memberOf Pagelist
     */
    
    
    options: {
        // 每页加载的数据量
        pagesize: 15,
        // 刷新激活高度，一般等于刷新容器的高度
        refreshActiveY: 40,
        // 加载更多激活高度，设置成负数可以提前刷新，正数往下拉更多才刷新
        loadmoreActiveY: 0,
        // 加载更多容器高度，如果自定义了加载更多模板并且改变了高度，需要配置此参数
        loadmoreContY: 40,
        // 刷新结果显示时间，0为不显示刷新结果直接弹回，不等于0会显示刷新成功或刷新失败提示后再弹回
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: true,
        // 是否启用加载更多功能
        useLoadmore: true,
        // 是否加载大量数据，false是append节点，true会有固定个数的节点，滚动的时候移动节点和更新数据（不支持节点高度不一致的情况）
        infinite: false,
        // 列表项高度是否不一致，默认为true，如果列表高度一致，建议设置成false，可以提高性能
        // differentHeight: true,
        // 选中后的样式
        selectedClass: null,
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: false,
        // 没有数据页面默认的数据（如果你传递的nodataTpl需要数据）
        nodataViewData: null,
        // 模板引擎
        compiler: null,

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        // 没有数据的提示模板
        nodataTpl: NodataTpl,
        // 刷新数据提示模板
        refreshTpl: RefreshTpl,
        // 加载更多提示提示模板
        loadmoreTpl: LoadmoreTpl,

        // 刷新中，该接口必须调用Pagelist.refresh()方法通知Pagelist数据已加载
        /**
         * 用户下拉列表满足刷新条件时触发的事件
         * @event refresh
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onRefresh: function (pageNum) {},
        // 加载更多中，该接口必须调用Pagelist.loadMore()方法通知Pagelist数据已加载
        /**
         * 用户上拉列表满足加载更多条件时触发的事件
         * @event loadmore
         * @memberOf Pagelist
         * @param  {Number} pageNum 当前的页码
         */
        onLoadMore: function (pageNum) {},
        // 渲染完成后
        /**
         * 渲染完成后触发的事件
         * @event ready
         * @memberOf Pagelist
         */
        onReady: function() {},

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Pagelist
         */
        //onselectitem: function() {}

        // 选项点击事件
        onTap: function(e) {},

        // 切换下拉刷新图标
        onAfterMove: function(translateY) {},

        // 下拉刷新触发判断
        onBeforeEnd: function(e) {},

        // 加载更多触发判断
        onScroll: function(translateY) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Pagelist
     * @private
     */
    init: function() {
        this.initProp();
        this.bindEvents();
    },


    /**
     * 处理组件的内部事件绑定
     * @function bindEvents
     * @memberOf Pagelist
     * @private
     */
    bindEvents: function() {
        // 选项点击事件
        this.on('tap', function(e){
            if(this._tapTimer) {
                return;
            }

            var targetEl = $(e.target);
            var itemEl = $(e.currentTarget);
            var index = itemEl.data('index');
            var selectedClass = this.get('selectedClass');
            if(selectedClass) {
                this._itemWrap.find('.' + selectedClass).removeClass(selectedClass);
                itemEl.addClass(selectedClass);
            }
            this.trigger('selectitem', this.get('datasource')[index], itemEl, targetEl);

            var self = this;
            var interval = this.get('tapInterval') || 0;
            if(interval) {
                this._tapTimer = setTimeout(function() {
                    clearTimeout(self._tapTimer);
                    self._tapTimer = null;
                }, interval);
            }
        });

        // 切换下拉刷新图标
        this.on('aftermove', function(translateY) {
            translateY > 0 && this.get('useRefresh') && !this._refreshing && this._changeRefreshStatus(translateY);
            this._moveWhenLoad = this._refreshing || this._loadmoreing;
        });

        // 下拉刷新触发判断
        this.on('beforeend', function(e) {
            if(this.get('useRefresh') && !this._loadmoreing && this._translateY >= this.get('refreshActiveY')) {
                if(this._refreshing) {
                    this.scrollTo(this.get('refreshActiveY'), 300);
                } else {
                    this._refreshInit();
                }
                return false;
            }

            return true;
        });

        // 加载更多触发判断
        this.on('scroll', function(translateY) {
            if(this._refreshing || this._loadmoreing) return;

            if(this.get('useLoadmore') && this._canLoadmore) {
                // 激活加载更多的translateY，负数
                var activeY = this._maxY - this.get('loadmoreActiveY');
                translateY < 0 && translateY < activeY && this._loadMoreInit();
            }
        });
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Pagelist
     * @private
     */
    render: function() {
        if(!this._isRender){
            this._nodataEl = this.widgetEl.find('[data-role="nodata"]');
            this._nodataEl.on('touchmove', function() {return false;});
            this._nodataRender = this._compiler(this.get('nodataTpl')) || function() {return ''};
            this.reloadNodataView(this.get('nodataViewData'));

            Pagelist.superClass.render.call(this);
            // fix bug: infinite模式下滚动白屏了
            this.scrollTo(0);
            this._infiniteHandler();
            this._createDragIcon();
            this.trigger('ready');
        }
        return this;
    },
    /**
     * 销毁组件
     * @function destroy
     * @memberOf Pagelist
     */
    destroy: function() {
        if(this._tapTimer) {
            clearTimeout(this._tapTimer);
            this._tapTimer = null;
        }
        Pagelist.superClass.destroy.call(this);
    },

    /**
     * 初始化私有属性
     * @function initProp
     * @memberOf Pagelist
     * @private
     */
    initProp: function() {
        Pagelist.superClass.initProp.call(this);
        this._refreshing = false; // 刷新中
        this._loadmoreing = false; // 加载更多中
        this._pageNum = 1; // 当前页码
        // 支持定义itemRender，来自定义模板引擎
        this._itemRender = this.itemRender || null;
        this._extraHeight = 0;// 滚动容器里，除了列表外其他的元素高度

        this._nodataEl = null;
        this._dragEl = null; // 下拉刷新
        this._endEl = null; // 释放更新
        this._loadEl = null; // 加载中
        this._successEl = null; // 加载成功
        this._failEl = null; // 加载失败
        this._loadmoreEl = null; // 加载更多
        this._endmoreEl = null; // 没有更多

        // 是否可以加载更多，下面条件成立时，_canLoadmore都等于false
        // useLoadmore == false || 加载不到更多数据 || datasource.length < pagesize
        this._canLoadmore = this.get('useLoadmore');

        // 刷新或加载更多时，是否发生了滑动。如果没有滑动，会有默认滚动动作
        this._moveWhenLoad = false;

        // tap事件的定时器
        this._tapTimer = null;

        // 设置模板引擎
        this._compiler = this.get('compiler') || Template;
    },

    /**
     * 生成列表选项Html，覆盖父类方法
     * @function createListItem
     * @memberOf Pagelist
     * @private
     */
    createListItem: function() {
        var self = this;
        var itemHtml = '';
        var ds = this.get('datasource');

        !this._itemRender && (this._itemRender = this._compiler(this.get('itemTpl')));

        ds.length > this.get('pagesize') && console.warn('The length of the data is larger than pagesize.');
        ds && ds.length && ds.forEach(function(item, index) {
            var data = $.extend(true, {}, item);
            data.dataIndex = index;
            itemHtml += self._itemRender(data);
        });
        return itemHtml;
    },

    /**
     * 覆盖父类方法
     * @function initUI
     * @memberOf Pagelist
     * @private
     */
    initUI: function() {
        var ds = this.get('datasource');
        if(!ds || !ds.length) {
            this._nodataEl.show();
            this._scroller.hide();
        } else {
            this._nodataEl.hide();
            this._scroller.show();
        }

        Pagelist.superClass.initUI.call(this);
        this._setLoadmore();
    },

    /**
     * 获得当前组件的是第几页
     * @function getPageNum
     * @memberOf Pagelist
     * @return {Number} 获得当前组件的是第几页
     */
    getPageNum: function() {
        return this._pageNum;
    },

    /**
     * 设置页码
     * @function setPageNum
     * @memberOf Pagelist
     * @param {Number | String} pageNum 设置pagelist的页码
     * @version 0.1.11
     */
    setPageNum: function (pageNum) {
        var _pageNum = parseInt(pageNum, 10);
        if (!isNaN(_pageNum)) {

            this._pageNum = pageNum;
        }
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Pagelist
     */
    resize: function () {
        if(this._isRender){
            // 额外的元素，约定的data-role="extra"
            var extra = this._scroller.find('[data-role="extra"]');
            if(extra.length && this._infiniteElements) {
                var top = 0;
                extra.forEach(function(item) {
                    top += item.offsetHeight;
                });

                if(top != this._extraHeight) {
                    this._extraHeight = top;
                    this._infiniteElements.forEach(function(item) {
                        $(item).css({top: top});
                    });
                }
            }

            var scrollerHeight = null;
            if(this.get('infinite') && this._infiniteElementHeight) {
                scrollerHeight = this._infiniteElementHeight * this.get('datasource').length + this._extraHeight;
            }

            Pagelist.superClass.resize.call(this, scrollerHeight);
        }
    },

    /**
     * 更新列表数据
     * @function updateListItem
     * @memberOf Pagelist
     * @private
     */
    updateListItem: function (data, index) {
        var itemData = $.extend(true, {}, data);
        itemData.dataIndex = index;
        var newItem = $(this._itemRender(itemData));
        var item = this._itemWrap.find('[data-index="' + index + '"]');
        item.html(newItem.html());
    },

    /**
     * 重新渲染没有数据的模板
     * @function reloadNodataView
     * @memberOf Pagelist
     */
    reloadNodataView: function(data) {
        this._nodataEl.html(this._nodataRender(data));
    },

    /**
     * 刷新组件的数据
     * @function refresh
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载是否成功，如果加载数据碰到异常才设置成true
     */
    refresh: function(data, isFail) {
        this._loadEl.hide();
        if(!isFail) {
            this._pageNum = 1;
            this.reload(data);
            this._setLoadmore();
            this._infiniteHandler();
        }
        this._endmoreEl && this._endmoreEl.hide();

        var self = this, delay = this.get('refreshResultDelay');
        var resultEl = isFail ? self._failEl : self._successEl;

        delay && resultEl.show();

        setTimeout(function() {
            delay && resultEl.hide();

            var time = 0;
            // 滑动到原点
            if(!self._moveWhenLoad || (self._moveWhenLoad && self._translateY > 0)) {
                time = 300;
                self.scrollTo(0, time);
            }

            setTimeout(function() {
                self._dragEl.show();
                self._refreshing = false;
                self._moveWhenLoad = false;
            }, time);

        }, delay);
    },

    /**
     * 组件加载更多数据
     * @function loadMore
     * @memberOf Pagelist
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载失败，如果加载数据碰到异常才设置成true
     */
    loadMore: function(data, isFail) {
        var isMoreData = data && data.length;
        this._maxY += this.get('loadmoreContY');
        this._loadmoreEl.hide();
        if(!isFail) {
            if(isMoreData) {
                this._pageNum++;
                var ds = this.get('datasource');
                this.set('datasource', ds.concat(data));
                this.updateData(data);
            }

            // 加载不到更多数据或加载到的数据不足一页
            if(!isMoreData || (isMoreData && data.length < this.get('pagesize'))) {
                this._endmoreEl.show();
                if(isMoreData && this.get('infinite')) {
                    var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
                    var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
                    // var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1);
                    // 校正添加_extra height，修复由此可能造成的样式问题
                    var moreContY = bottomElem[0]._top + this._infiniteElementHeight * (data.length + 1) + (this._extraHeight || 0);
                    this._setTransform(this._moreCont[0], moreContY);
                }
            }
        }

        var self = this,
            delay = isMoreData ? 100 : 500,
            dist = isMoreData ? self._translateY - 20 : self._maxY;

        this.stopAnimate();

        setTimeout(function() {
            if(isMoreData) {
                !self._moveWhenLoad && self.scrollTo(dist, 300);
            } else {
                self.scrollTo(dist, 300);
            }
            setTimeout(function() {
                self._loadmoreing = false;
                self._canLoadmore = (isMoreData && data.length >= self.get('pagesize')) || isFail;
                self._moveWhenLoad = false;
            }, 300);
        }, delay);
    },

    /**
     * 手动模拟刷新列表操作，组件滚动到头部
     * @function simulateRefresh
     * @memberOf Pagelist
     */
    simulateRefresh: function () {
        var self = this;
        var refreshActiveY = this.get('refreshActiveY');
        this.scrollTo(refreshActiveY, 300);
        this._changeRefreshStatus(refreshActiveY);
        setTimeout(function() {
            self._refreshInit();
        }, 300);
    },

    /**
     * 重新加载数据
     * @function reloadData
     * @memberOf Pagelist
     * @param {Array} data 重新加载的数据
     */
    reloadData: function(data) {
        var self = this;
        var handler = function() {
            self._pageNum = 1;
            self.reload(data);
            self._setLoadmore();
            self.scrollTo(0);
            self._resetDragIcon();
            self._infiniteHandler();
        }

        if(this.stopAnimate()) {
            setTimeout(function() {
                handler();
            }, 200)
        } else {
            handler();
        }
    },

    /**
     * 根据数据更新组件item内容，对于infinite和非infinite进行不同的处理
     * @function updateData
     * @memberOf Pagelist
     * @private
     * @param {Array} data 需要更新的数据
     */
    updateData: function (data) {
        if (this.get('infinite')) {
            var update = [], eles = this._infiniteElements;
            var bottomIndex = this.get('pagesize') * (this._pageNum - 1) - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            // fix bug: 加载更多时用户进行了滚动操作，可能无法取到bottomElem
            if(bottomElem.length) {
                var firstTop = bottomElem[0]._top;
                for(var i = 0 ; i < eles.length; i++) {
                    if(eles[i]._top >= firstTop) {
                        update.push(this._infiniteElements[i]);
                    }
                }
                this._updateContent(update);
            }
        } else {
            var self = this;
            var ds = this.get('datasource');
            var leng = ds.length;
            var dataLength = 0;
            var html = '';
            data && (dataLength = data.length) && data.forEach(function(item, index) {
                var data = $.extend(true, {}, item);
                data.dataIndex = index + (leng - dataLength);
                html += self._itemRender(data);
            });
            self._itemWrap.append(html);
        }
        this.resize();
    },

    /**
     * 覆盖父类方法,超出刷新激活高度后回弹到激活高度,而不是0
     * @function resetPosition
     * @memberOf Pagelist
     * @private
     */
    resetPosition: function () {
        if(this._refreshing && this._translateY == this.get('refreshActiveY')) {
            return false;
        } else if(this._loadmoreing && this._translateY == this._maxY - this.get('loadmoreContY')) {
            return false;
        }

        var isReset = Pagelist.superClass.resetPosition.call(this);
        isReset && (this._moveWhenLoad = true);
        return isReset;
    },

    /**
     * 无限循环处理
     * @function _infiniteHandler
     * @memberOf Pagelist
     * @private
     */
    _infiniteHandler: function() {
        if(!this.get('infinite')) return;

        this._infiniteElements = this._itemWrap.find('[data-role="list-item"]');
        if(!this._infiniteElements.length) return;

        var top = this._extraHeight;
        this._infiniteElements.forEach(function(item) {
            $(item).css({
                position: 'absolute',
                top: top,
                left: 0,
                width: '100%'
            });
        });

        this._infiniteElementHeight = this._infiniteElements.first().height();
        var elementsPerPage = Math.ceil(this._listHeight / this._infiniteElementHeight);
        // 列表项个数由容器高度决定,而不是pagesize
        this._infiniteLength = elementsPerPage + 3;
        var itemLeng = this.get('datasource').length;
        // 数据量小的情况下，列表项个数由数据决定（不满一屏）
        itemLeng < this._infiniteLength && (this._infiniteLength = itemLeng);

        for(var i = this._infiniteLength; i < this._infiniteElements.length; i++) {
            this._itemWrap[0].removeChild(this._infiniteElements[i]);
        }

        this._infiniteHeight = this._infiniteLength * this._infiniteElementHeight;
        // 2147483645 数组长度限制  Math.pow(2, 32) - 1
        this._infiniteLimit = Math.floor(2147483645 / this._infiniteElementHeight);
        this._infiniteUpperBufferSize = Math.max(Math.floor((this._infiniteLength - elementsPerPage) / 2), 0);

        this.resize();

        this._reorderInfinite();

        this.on('scroll', function(translateY) {
            translateY < 0 && translateY > this._maxY && this._reorderInfinite();
        });
    },

    /**
     * 处理无限循环计算节点位置的逻辑
     * @function _reorderInfinite
     * @memberOf Pagelist
     * @private
     */
    _reorderInfinite: function() {
        // 小相位 当前要展示的item，所在所有波段中的位置，第n个
        // 大相位 当前展示的波段属于整体波段中的第n个，即第n屏
        // 相位   当前item，所在当前波段中的位置
        var minorPhase = Math.max(Math.floor((-this._translateY - this._extraHeight) / this._infiniteElementHeight) - this._infiniteUpperBufferSize, 0),
            majorPhase = Math.floor(minorPhase / this._infiniteLength),
            phase = minorPhase - majorPhase * this._infiniteLength;

        var top = 0;
        var i = 0;
        var update = [];

        //用this._infiniteElements[i]先临时hack主从scroll事件来的调用
        //之后会统一梳理所有的属性和变量
        while ( i < this._infiniteLength  && this._infiniteElements[i]) {
            top = i * this._infiniteElementHeight + majorPhase * this._infiniteHeight;

            if ( phase > i ) {
                top += this._infiniteElementHeight * this._infiniteLength;
            }

            if ( this._infiniteElements[i]._top !== top ) {
                this._infiniteElements[i]._phase = top / this._infiniteElementHeight;

                if ( this._infiniteElements[i]._phase < this._infiniteLimit ) {
                    this._infiniteElements[i]._top = top;
                    update.push(this._infiniteElements[i]);
                }
            }

            i++;
        }

        update.length && this._updateContent(update);
    },

    /**
     * 根据节点上的相位信息和data信息更新组件的属性和内容
     * @function _updateContent
     * @memberOf Pagelist
     * @param {HTMLElement} els 需要更新的节点
     * @private
     */
    _updateContent: function(els) {
        // TODO 缓存节点，一次批量更新多个节点测试性能
        var self = this, ds = this.get('datasource');
        var exclude = ['data-role', 'data-index', 'style'];
        els.forEach(function(elem) {
            var index = elem._phase, data = ds[index];
            if(data) {
                self._setTransform(elem, elem._top);
                var itemData = $.extend(true, {}, data);
                itemData.dataIndex = index;
                elem.setAttribute('data-index', index);
                var itemHtml = self._itemRender(itemData);

                // 更新dom属性
                for(var key in elem.attributes) {
                    if(elem.attributes.hasOwnProperty(key)) {
                        var name = elem.attributes[key].name;
                        if(exclude.indexOf(name) == -1) {
                            var val = elem.attributes[key].value;
                            var res = itemHtml.match(getAttrRegexp(name));
                            if(res && res.length == 2 && res[1] != val) {
                                elem.attributes[key].value = res[1];
                            }
                        }
                    }
                }

                // 去除item节点自己
                elem.innerHTML = itemHtml.substring(itemHtml.indexOf('>') + 1, itemHtml.lastIndexOf('</')).trim();
            }
        });
    },

    /**
     * 设置节点的translateY值
     * @function _setTransform
     * @private
     * @memberOf Pagesize
     * @param {HTMLElement} el 需要设置的节点
     * @param {Number} y  需要设置的translateY值
     */
    _setTransform: function(el, y) {
        el.style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0)';
        el.style.transform = 'translate(0px, ' + y + 'px) translateZ(0)';
    },

    /**
     * 是否允许加载更多功能
     * @function _setLoadmore
     * @memberOf Pagelist
     * @private
     */
    _setLoadmore: function() {
        var ds = this.get('datasource');
        if(ds && ds.length) {
            if(ds.length >= this.get('pagesize')) {
                this._canLoadmore = true;
            } else {
                this._canLoadmore = false;
            }
        }
    },

    /**
     * 创建刷新和加载更多的操作图标
     * @function _createDragIcon
     * @memberOf Pagelist
     * @private
     */
    _createDragIcon: function() {
        if(this.get('useRefresh')) {
            var rh = this.get('refreshActiveY');
            var refreshContainer = $(this.get('refreshTpl'));
            refreshContainer.css({height: rh + 'px', lineHeight: rh + 'px', top: -rh}).appendTo(this._scroller);

            var child = refreshContainer.children();
            this._dragEl = child[0] && $(child[0]).show();
            this._endEl = child[1] && $(child[1]).hide();
            this._loadEl = child[2] && $(child[2]).hide();
            this._successEl = child[3] && $(child[3]).hide();
            this._failEl = child[4] && $(child[4]).hide();

            this._dragIcon = $(this._dragEl.children()[0]);
            this._endIcon = $(this._endEl.children()[0]);
            this._changeRefreshAnimate('down');
        }
        if(this.get('useLoadmore')) {
            var mh = this.get('loadmoreContY');
            var moreContainer = this._moreCont = $(this.get('loadmoreTpl'));
            // fix bug: infinite模式下，moreContainer的位置需要调整，否则会遮住item项
            if(this.get('infinite')) {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', top: -mh, bottom: 0}).appendTo(this._scroller);
            } else {
                moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', bottom: -mh}).appendTo(this._scroller);
            }

            var child = moreContainer.children();
            this._loadmoreEl = child[0] && $(child[0]).hide();
            this._endmoreEl = child[1] && $(child[1]).hide();
        }
    },

    /**
     * 重置拖拽显示的icon
     * @function _resetDragIcon
     * @memberOf Pagelist
     * @private
     */
    _resetDragIcon: function() {
        if (this.get('useRefresh')) {
            this._dragEl.show();
            this._endEl.hide();
            this._loadEl.hide();
            if(this.get('refreshResultDelay')) {
                this._successEl.hide();
                this._failEl.hide();
            }
        }
        if(this.get('useLoadmore')) {
            this._loadmoreEl.hide();
            this._endmoreEl.hide();
        }
    },

    /**
     * 根据translateY改变刷新的显示状态（下拉刷新or释放更新）
     * @function _changeRefreshStatus
     * @memberOf Pagelist
     * @param {Number} translateY translateY的偏移
     * @private
     */
    _changeRefreshStatus: function (translateY) {
        var activeY = this.get('refreshActiveY');

        if (translateY >= activeY) {
            if(this._dragEl[0].style.display != "none") {
                this._dragEl.hide();
                this._endEl.show();
                this._changeRefreshAnimate('up');
            }
        } else if(translateY < activeY && translateY > 0) {
            if(this._dragEl[0].style.display == "none") {
                this._dragEl.show();
                this._endEl.hide();
                this._changeRefreshAnimate('down');
            }
        }
    },

    /**
     * 根据direction改变icon的样式
     * @function _changeRefreshAnimate
     * @memberOf Pagelist
     * @param {String} direction 方向，上为up下位down
     * @private
     */
    _changeRefreshAnimate: function (direction) {
        if(direction == 'up') {
            iconAnimate(this._dragIcon, 'addClass', true);
            iconAnimate(this._endIcon, 'removeClass');
        } else {
            iconAnimate(this._dragIcon, 'removeClass');
            iconAnimate(this._endIcon, 'addClass', false);
        }
    },

    /**
     * refresh状态初始化
     * @function _refreshInit
     * @memberOf Pagelist
     * @private
     */
    _refreshInit: function() {
        this._refreshing = true;
        this._dragEl.hide();
        this._endEl.hide();
        this._loadEl.show();
        this._changeRefreshAnimate('down');
        this.scrollTo(this.get('refreshActiveY'), 200);

        var self = this;
        setTimeout(function() {
            self.trigger('refresh', this._pageNum);
        }, 300);
    },

    /**
     * loadMore状态初始化
     * @function _loadMoreInit
     * @memberOf Pagelist
     * @private
     */
    _loadMoreInit: function() {
        this._loadmoreing = true;
        if (this.get('infinite')) {
            this._moreCont.css({top: 0, buttom: 0});
            var bottomIndex = this.get('pagesize') * this._pageNum - 1;
            var bottomElem = this._itemWrap.find('[data-index="'+bottomIndex+'"]');
            var _top = bottomElem.length ? bottomElem[0]._top : 0;
            var moreContY = _top + this._infiniteElementHeight + this._extraHeight;
            this._setTransform(this._moreCont[0], moreContY);
        }
        this._loadmoreEl.show();
        this._endmoreEl.hide();
        this._maxY -= this.get('loadmoreContY');
        this.trigger('loadmore', this._pageNum);
    }
});

/**
 * 添加下拉刷新和释放更新的动画
 *
 * @param elem 元素
 * @param action 操作，add || remove
 * @param positive 正负
 */
function iconAnimate(elem, action, positive) {
    var style = action == 'addClass' ? (positive ? 'rotate(180deg)' : 'rotate(-180deg)') : '';
    elem[0].style.webkitTransform = style;
    elem[0].style.transform = style;
}

function getAttrRegexp(key) {
    return new RegExp( key + '="(.+?)"')
}

module.exports = Pagelist;