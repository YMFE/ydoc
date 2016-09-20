/**
 * 面板组件，支持横向纵向滑动，以及下拉刷新和加载更多
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Panel
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/panel/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var PanelTpl = require('./tpl/panel.string');
var RefreshTpl = require('./tpl/panel-refresh.string');
var LoadmoreTpl = require('./tpl/panel-loadmore.string');

// 动画定时器
var rAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

// 默认不阻止浏览器默认行为的控件
var Reg = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/;

var Panel = Widget.extend({
    /**
     * @property {Boolean} scrollX X轴是否滚动，默认为false
     * @property {Boolean} scrollY Y轴是否滚动，默认为true
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为true，true使用css的transition，false使用js动画
     * @property {Boolean} scrollLock 当容器内的内容的高度小于容器高度时，是否允许滚动，默认为false
     * @property {Boolean} preventDefault 阻止浏览器默认事件，默认为true
     * @property {Boolean} stopPropagation 阻止touch事件冒泡，默认为false
     * @property {Boolean}  canLockY 是否支持锁定Y轴滚动，默认为false， 在与slidermenu的配合使用时，需要设置为true
     * @property {Boolean} resizable 当浏览器窗口改变时是否可调整大小，默认为true
     * @property {Boolean} useRefresh 是否启用刷新功能，默认为false，开启下来刷新组件
     * @property {Boolean} useLoadmore 是否启用加载更多功能，默认为false，开启上拉加载更多
     * @property {String} template 组件的模板，需要自定义时修改
     * @property {String} refreshTpl 刷新数据提示模板，需要自定义时修改
     * @property {String} loadmoreTpl 家在更多时提示模板，需要自定义时修改
     * @memberOf Panel
     */
    
     /**
     * @event {function} tap 
     * @memberOf Panel
     */
    options: {
        type: 'panel',
        // X轴是否滚动，默认为false
        scrollX: false,
        // Y轴是否滚动，默认为true
        scrollY: true,
        // 动画的效果，默认为true使用transition, false使用js动画
        isTransition: true,
        // 当容器内的内容的高度小于容器高度时，是否允许滚动，默认为false
        scrollLock: false,
        // 阻止浏览器默认事件
        preventDefault: true,
        // 阻止touch事件冒泡
        stopPropagation: false,
        // 是否支持锁定Y轴滚动
        canLockY: false,
        // 可调整大小
        resizable: true,
        // 刷新激活高度，一般等于刷新容器的高度
        refreshActiveY: 40,
        // 加载更多激活高度，设置成负数可以提前刷新，正数往下拉更多才刷新
        loadmoreActiveY: 0,
        // 加载更多容器高度，如果自定义了加载更多模板并且改变了高度，需要配置此参数
        loadmoreContY: 40,
        // 刷新结果显示时间，0为不显示刷新结果直接弹回，不等于0会显示刷新成功或刷新失败提示后再弹回
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: false,
        // 是否启用加载更多功能
        useLoadmore: false,

        // 组件模板
        template: PanelTpl,
        // 刷新数据提示模板
        refreshTpl: RefreshTpl,
        // 加载更多提示提示模板
        loadmoreTpl: LoadmoreTpl,

        // 刷新事件，该接口必须调用Panel.refresh()方法通知Panel数据已加载
        /**
         * 用户下拉列表满足刷新条件时触发的事件
         * @event refresh
         * @memberOf Panel
         * @param  {Number} pageNum 当前的页码
         */
        onRefresh: function(pageNum) {},
        // 加载更多中，该接口必须调用Panel.loadMore()方法通知Panel数据已加载
        /**
         * 用户上拉列表满足加载更多条件时触发的事件
         * @event loadmore
         * @memberOf Panel
         * @param  {Number} pageNum 当前的页码
         */
        onLoadMore: function(pageNum) {},
        /**
         * 渲染完成后触发的事件
         * @event ready
         * @memberOf Panel
         */
        onReady: function() {},

        // panel点击事件
        /**
         * 用户点击某项数据时触发的事件
         * @event tap
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onTap: function (e) {},
        /**
         * touchstart事件开始前触发的事件
         * @event beforestart
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeStart: function (e) {},
        /**
         * touchmove事件开始前触发的事件
         * @event beforemove
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeMove: function(e) {},
        
        // onScroll: function (translateX, translateY, stopAnimate) {},

        /**
         * touchmove事件结束后触发的事件,切换下拉刷新图标
         * @event aftermove
         * @param  {Number} translateY 滚动偏移的translateY
         * @memberOf Panel
         */
        onAfterMove: function(translateY) {
            translateY > 0 && this.get('useRefresh') && !this._refreshing && this._changeRefreshStatus(translateY);
            this._moveWhenLoad = this._refreshing || this._loadmoreing;
        },

        /**
         * touchend事件开始前触发的事件
         * @event beforeend
         * @param  {HTMLEvent} e touch事件的事件对象
         * @memberOf Panel
         */
        onBeforeEnd: function(e) {
            if(this.get('useRefresh') && !this._loadmoreing && this._translateY >= this.get('refreshActiveY')) {
                if(this._refreshing) {
                    this.scrollTo(0, this.get('refreshActiveY'), 300);
                } else {
                    this._refreshInit();
                }
                return false;
            }

            return true;
        },

        /**
         * 列表滚动时触发的事件
         * @event 
         * @param  {Number} translateX 滚动偏移的translateX
         * @param  {Number} translateY 滚动偏移的translateY
         * @param  {Boolean} stopAnimate 是否停止动画
         * @memberOf Panel
         */
        onScroll: function (translateX, translateY) {
            if(this._refreshing || this._loadmoreing) return;

            if(this.get('useLoadmore') && this._canLoadmore) {
                // 激活加载更多的translateY，负数
                var activeY = this._maxY - this.get('loadmoreActiveY');
                translateY < 0 && translateY < activeY && this._loadMoreInit();
            }
        },

        events: {
            'touchstart': '_touchStart',
            'touchmove': '_touchMove',
            'touchend': '_touchEnd',
            'touchcancel': '_touchEnd',
            'webkitTransitionEnd [data-role=scroller]': '_transitionEnd',
            'transitionEnd [data-role=scroller]': '_transitionEnd'
        }
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Panel
     * @private
     */
    init: function() {
        this._initPrivate();
    },

    /**
     * 判断是否需要使用fromHTML属性，即从节点创建
     * @function _isFromHTML
     * @memberOf Panel
     * @private
     */
    _isFromHTML: function(){
        var container = this.get('container');
        container = container || $PARENT_NODE;
        container = $(container);
        // 容器内部获取第一个对象节点
        var firstElement = container[0].firstElementChild;
        // 如果存在对象节点
        if(firstElement){
            // 获取滚动容器
            var scroller = container.find('[data-role="scroller"]');
            // 获取内容容器
            var body = container.find('[data-role="body"]');
            // 如果容器没有添加标示
            if(scroller.length === 0 || body.length === 0){
                // 容器第一个节点默认为是滚动容器
                $(firstElement).data('role', 'scroller');
                // 滚动容器内第一个节点默认未是内容容器
                $(firstElement.firstElementChild).data('role', 'body');
            }
            return true;
        }

        return false;
    },

    /**
     * 根据配置获取组件根节点
     * @function _getMainElement
     * @memberOf Panel
     * @private
     * @param  {Object} config 组件的配置项
     */
    _getMainElement: function(config){
        var isFromHTML = this._isFromHTML();
        if(isFromHTML){
            var container = this.get('container');
            container = container || $PARENT_NODE;
            container = $(container);
            this.widgetEl = container;
            this.container = container;
            this.on('ready', function(){
                this.resize();
            })
        }else{
            Panel.superClass._getMainElement.call(this, config);
        }
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Panel
     */
    render: function() {
        if(!this._isRender){
            Panel.superClass.render.call(this);
            this._scroller = this.widgetEl.find('[data-role="scroller"]');
            this._body = this.widgetEl.find('[data-role="body"]');
            this._createDragIcon();

            var self = this;
            this.widgetEl.on('tap', function(e) {
                !self._stopAnimate && !self._lockScrollY && self.trigger('tap', e);
                self._stopAnimate = false;
            });

            this.trigger('ready');
        }
        return this;
    },

    /**
     * 销毁组件
     * @function destroy
     * @memberOf Panel
     */
    destroy: function () {
        Panel.superClass.destroy.call(this);
    },

    /**
     * 重新计算滚动区域，容器高度发生变化后调用
     * @function resize
     * @memberOf Panel
     */

    resize: function() {
        if(!this._isRender){return false;}
        if(this.get('scrollX')) {
            this._panelWidth = +this.widgetEl[0].clientWidth;
            var scrollerWidth = this._scroller[0].scrollWidth;
            this._maxX = this._panelWidth - scrollerWidth;
            // 滑动容器宽度不满外层容器宽度时，是否需要滑动
            if(this._maxX >= 0) {
                if(this.get('scrollLock')) {
                    this._canScroll = false;
                } else {
                    this._canScroll = true;
                    this._maxX = 0;
                }
            } else {
                this._canScroll = true;
            }
        } else if(this.get('scrollY')) {
            this._panelHeight = +this.widgetEl[0].clientHeight;
            var otherHeight = 0;// 其他容器高度
            // 容器里如果有其他非滚动元素，计算最大滑动高度时去掉这些元素的高度
            var child = this.widgetEl.children();
            if(child.length > 1) {
                child.forEach(function(item){
                    item.getAttribute('data-role') != 'scroller' && (otherHeight += (+item.offsetHeight));
                });
            }
            var scrollerHeight = this._scroller[0].clientHeight;
            this._maxY = this._panelHeight - scrollerHeight - otherHeight;
            // 滑动容器高度不满外层容器高度时，是否需要滑动
            if(this._maxY >= 0) {
                if(this.get('scrollLock')) {
                    this._canScroll = false;
                } else {
                    this._canScroll = true;
                    this._maxY = 0;
                }
            } else {
                this._canScroll = true;
            }
        }
    },

    /**
     * 渲染panel
     *
     * @param html panel的内容
     */
    html: function(html) {
        this._body.html(html);
        this.resize();
    },

    /**
     * 添加panel
     *
     * @param html panel的内容
     */
    append: function(html) {
        this._body.append(html);
        this.resize();
    },

    /**
     * 是否允许加载更多
     *
     * @param result
     */
    setCanLoadmore: function(result) {
        this._canLoadmore = result;
    },

    /**
     * 滚动函数
     * @function scrollTo
     * @memberOf Panel
     * @param {Number} translateX 需要滚动的translateX值
     * @param {Number} translateY 需要滚动的translateY值
     * @param {Array} time  是transition-duration表示过渡效果需要多少毫秒
     * @param {String | Function} effect transition-timing-function过渡效果的速度曲线
     * @private
     */
    scrollTo: function(translateX, translateY, time, effect) {
        if(this.get('isTransition')) {
            effect = effect || 'cubic-bezier(0.1, 0.57, 0.1, 1)';
            setTransitionTimingFunc(this._scroller, effect);
            setTransitionTime(this._scroller, time);
            this._translate(translateX, translateY);
        } else {
            effect || (effect = function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            });
            if(time) {
                this._animate(translateX, translateY, time, effect);
            } else {
                this._translate(translateX, translateY);
            }
        }
        this._translateX = translateX;
        this._translateY = translateY;
    },

    /**
     * 停止动画
     * @function stopAnimate
     * @memberOf Panel
     * @private
     */
    stopAnimate: function() {
        var result = this._isAnimating;
        if(this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimate = true;
            if(this.get('scrollX')) {
                this._translateX = getTranslateX(this._scroller);
                this.scrollTo(this._translateX, 0, 0);
            } else if(this.get('scrollY')) {
                this._translateY = getTranslateY(this._scroller);
                this.scrollTo(0, this._translateY, 0);
            }
        }
        return result;
    },

    /**
     * 手动模拟刷新列表操作，组件滚动到头部
     * @function simulateRefresh
     * @memberOf Panel
     */
    simulateRefresh: function() {
        var self = this;
        var refreshActiveY = this.get('refreshActiveY');
        this.scrollTo(0, refreshActiveY, 300);
        this._changeRefreshStatus(refreshActiveY);
        setTimeout(function() {
            self._refreshInit();
        }, 300);
    },

 
    /**
     * 刷新组件的HTML
     * @function refresh
     * @memberOf Panel
     * @param {String} html 需要更新的html字符串
     * @param {Boolean} isFail 加载是否成功，如果加载数据碰到异常才设置成false，否则默认都为true
     */
    refresh: function(html, isFail) {
        this._loadEl.hide();
        if(!isFail) {
            this._pageNum = 1;
            this.html(html);
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
                self.scrollTo(0, 0, time);
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
     * @memberOf Panel
     * @param {Array} data 加载到的数据
     * @param {Boolean} isFail 加载失败，如果加载数据碰到异常才设置成true
     */
    loadMore: function(html, isFail) {
        var isMoreData = html && html.length;
        this._maxY += this.get('loadmoreContY');
        this._loadmoreEl.hide();
        if(!isFail) {
            if(isMoreData) {
                this._pageNum++;
                this.append(html);
            } else {// 加载不到更多数据
                this._endmoreEl.show();
            }
        }

        var self = this,
            delay = isMoreData ? 0 : 500,
            dist = isMoreData ? self._translateY - 20 : self._maxY;
        setTimeout(function() {
            if(isMoreData) {
                !self._moveWhenLoad && self.scrollTo(0, dist, 300);
            } else {
                self.scrollTo(0, dist, 300);
            }
            setTimeout(function() {
                self._loadmoreing = false;
                self._canLoadmore = isMoreData || isFail;
                self._moveWhenLoad = false;
            }, 300);
        }, delay);
    },

    /**
     * 获取滚动方向
     */
    getOrientation: function() {
        return this._orientation;
    },

   
    /**
     * 获得当前组件的是第几页
     * @function getPageNum
     * @memberOf Panel
     * @return {Number} 获得当前组件的是第几页
     */
    getPageNum: function() {
        return this._pageNum;
    },

    /**
     * 滑动超出最大范围，回弹到终点
     * @function _resetPosition
     * @private
     * @memberOf Panel
     */
    _resetPosition: function () {
        // 超出刷新激活高度后回弹到激活高度,而不是0
        if(this._refreshing && this._translateY == this.get('refreshActiveY')) {
            return false;
        } else if(this._loadmoreing && this._translateY == this._maxY - this.get('loadmoreContY')) {
            return false;
        }

        if(this.get('scrollX')) {
            var translateX = this._translateX;
            if(this._canScroll) {
                translateX = translateX > 0 ? 0 : translateX < this._maxX ? this._maxX : translateX;
            }
            if(translateX == this._translateX) {
                return false;
            }
            this._orientation = translateX < 0 ? 'left': 'right';
            this.scrollTo(translateX, 0, 600);
        } else if(this.get('scrollY')){
            var translateY = this._translateY;
            if(this._canScroll) {
                translateY = translateY > 0 ? 0 : translateY < this._maxY ? this._maxY : translateY;
            }
            if(translateY == this._translateY) {
                return false;
            }
            this._orientation = translateY < 0 ? 'up': 'down';
            this.scrollTo(0, translateY, 600);
        }

        return this._moveWhenLoad = true;
    },


    /**
     * 初始化私有属性
     * @function _initPrivate
     * @private
     * @memberOf Panel
     */
    _initPrivate: function() {
        this._scroller = null; // 滑动容器
        this._body = null; // panel容器
        this._panelWidth = 0; // 列表宽度
        this._panelHeight = 0; // 列表高度

        this._startY = 0; // 开始滑动时的pageY
        this._lastY = 0; // 上一次滑动事件的pageY
        this._distY = 0; // 一次滑动事件的总距离
        this._translateY = 0; // 当前纵向滑动的总距离
        this._maxY = 0; // 最大纵向滑动距离
        this._lockScrollY = false; // 是否锁定Y轴滚动

        this._startX = 0; // 开始滑动时的pageX
        this._lastX = 0; // 上一次滑动事件的pagex
        this._distX = 0; // 一次横向滑动事件的总距离
        this._translateX = 0; // 当前横向滑动的总距离
        this._maxX = 0; // 最大横向滑动距离

        this._orientation = ''; // 列表滑动方向（与手势滑动方向相反） up || down
        this._startTime = 0; // 开始滑动时间
        this._endTime = 0; // 结束滑动时间
        this._isMoving = false; // 是否滑动中
        this._isAnimating = false; // 是否动画中
        this._canScroll = true; //是否可以滑动
        this._stopAnimate = false; // 本次点击是否阻止了动画效果（transition || requrestAnimationFrame）

        this._cancelMove = false; // 取消滑动，目前只有一种情况，当pageY小于0
        // TODO 增加支持两个手指滑动的功能
        this._initiated = false; // 是否初始化（touchstart是否正常执行了，主要用来解决多点触发滑动的判断）

        this._refreshing = false; // 刷新中
        this._loadmoreing = false; // 加载更多中
        this._pageNum = 1; // 当前页码

        this._dragEl = null; // 下拉刷新
        this._endEl = null; // 释放更新
        this._loadEl = null; // 加载中
        this._successEl = null; // 加载成功
        this._failEl = null; // 加载失败
        this._loadmoreEl = null; // 加载更多
        this._endmoreEl = null; // 没有更多

        // 是否可以加载更多，下面条件成立时，_canLoadmore都等于false
        // useLoadmore == false || 加载不到更多数据
        this._canLoadmore = this.get('useLoadmore');

        // 刷新或加载更多时，是否发生了滑动。如果没有滑动，会有默认滚动动作
        this._moveWhenLoad = false;
    },

    /**
     * touchstart事件的处理函数，初始化参数，停止正在进行的动画
     * @function _touchStart
     * @private
     * @param  {HTMLDOMEvent} e touchstart事件的事件对象
     * @memberOf Panel
     */
    _touchStart: function(e) {

        var target = e.target;
        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(this._initiated) return;

        this.trigger('beforestart', e);

        setTransitionTime(this._scroller);
        this._isMoving = false;
        this._startTime = +new Date();
        this._stopAnimate = false;
        this.stopAnimate();

        // 目前只允许滚动一个方向
        if(this.get('scrollY')) {
            this._startY = this._translateY;
            this._distY = 0;
            this._lastY = e.touches[0].pageY;

            this._lastX = e.touches[0].pageX;
            this._lockScrollY = false;
            this._cancelMove = false;
            this._initiated = true;
        } else if(this.get('scrollX')) {
            this._startX = this._translateX;
            this._distX = 0;
            this._lastX = e.touches[0].pageX;

            this._lockScrollY = true;
            this._cancelMove = false;
            this._initiated = true;
        } else {
            this._initiated = false;
        }
    },

    /**
     * touchmove事件的处理函数，处理位移偏移，处理canLockY
     * @function _touchMove
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf Panel
     */
    _touchMove: function(e) {
        this.get('preventDefault') && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        if(!this._initiated) return;

        if(!this.trigger('beforemove', e)) {
            this._initiated = false;
            return;
        };

        if(this.get('scrollY')) {
            var translateY,
                timestamp = +new Date(),
                currY = e.touches[0].pageY,
                offsetY = currY - this._lastY;

            this._distY += offsetY;

            // 当滑动超出屏幕，自动触发touchend事件
            if(currY < 0) {
                this._initiated = false;
                if(this._cancelMove) {
                    return;
                }
                this._cancelMove = true;
                this._touchEnd(e);
                return;
            }

            if(this.get('canLockY')) {
                // 横向滚动超过比例，锁定纵向滚动
                if(this._lockScrollY) {
                    this._initiated = false;
                    return;
                }
                var currX = e.touches[0].pageX;
                var offsetX = currX - this._lastX;
                if(Math.abs(this._distY) < 30 && Math.abs(offsetX) / 3 > Math.abs(this._distY)) {
                    this._lockScrollY = true;
                    this._initiated = false;
                    return;
                }
            }

            // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
            // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
            if ( timestamp - this._endTime > 300 && Math.abs(this._distY) < 10 ) {
                return;
            }

            this._orientation = offsetY > 0 ? 'up': 'down';
            !this._canScroll && (offsetY = 0);
            translateY = this._translateY + offsetY;
            // 超出滑动容器范围，减少滑动高度
            if ( translateY > 0 || translateY < this._maxY) {
                translateY = this._translateY + offsetY / 3;
            }

            this._isMoving = true;
            this._translate(0, translateY);
            this._translateY = translateY;
            this._lastY = currY;
            if(timestamp - this._startTime > 300) {
                this._startTime = timestamp;
                this._startY = this._translateY;
            }
            this.trigger('aftermove', translateY);
        } else if(this.get('scrollX')) {
            var translateX,
                timestamp = +new Date(),
                currX = e.touches[0].pageX,
                offsetX = currX - this._lastX;

            this._distX += offsetX;

            // 当前时间大于上一次滑动的结束时间300毫秒，并且滑动距离不超过10像素，不触发move
            // 大于300毫秒的判断是为了能够处理手指在屏幕上快速搓动的效果
            if ( timestamp - this._endTime > 300 && Math.abs(this._distX) < 10 ) {
                return;
            }

            this._orientation = offsetX > 0 ? 'left': 'right';
            !this._canScroll && (offsetX = 0);
            translateX = this._translateX + offsetX;
            // 超出滑动容器范围，减少滑动高度
            if ( translateX > 0 || translateX < this._maxX) {
                translateX = this._translateX + offsetX / 3;
            }

            this._isMoving = true;
            this._translate(translateX, 0);
            this._translateX = translateX;
            this._lastX = currX;
            if(timestamp - this._startTime > 300) {
                this._startTime = timestamp;
                this._startX = this._translateX;
            }
            this.trigger('aftermove', translateX);
        }
    },

    /**
     * touchend事件的处理函数，添加active样式，处理组件的回弹，滚动到目标位置
     * @function _touchEnd
     * @param  {HTMLDOMEvent} e touchmove事件的事件对象
     * @private
     * @memberOf Panel
     */
    _touchEnd: function(e) {
        var target = e.target;

        this.get('preventDefault') && !Reg.test(target.tagName) && e.preventDefault();
        this.get('stopPropagation') && e.stopPropagation();

        this._initiated = false;
        this._endTime = +new Date();
        var duration = this._endTime - this._startTime;

        if(!this.trigger('beforeend', e)) {
            return;
        };

        // 1. 判断是否滑动回弹，回弹则return
        if(this._resetPosition()) {
            return;
        }

        // 2. 滑动到目标位置
        this.scrollTo(this._translateX, this._translateY);

        // 3. 没有滚动，并且没有还在惯性滑动中，才触发点击事件
        if(!this._isMoving ) {
            return;
        }

        // 4. 是否有惯性滑动，有则滑动到计算后的位置
        this._isMoving = false;
        if (duration < 300 && this._canScroll) {
            var result;
            if(this.get('scrollX')) {
                result = momentum(this._translateX, this._startX, duration, this._maxX, this._panelWidth);
                var newX = result.destination;
                if (newX != this._translateX ) {
                    var effect = null;
                    if(newX > 0 || newX < this._maxX) {
                        // 惯性滑动中超出边界回弹回来，切换动画效果函数
                        if(this.get('isTransition')) {
                            effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        } else {
                            effect = function (k) {
                                return k * ( 2 - k );
                            };
                        }
                    }
                    this.scrollTo(newX, 0, result.duration, effect);
                }
            } else if(this.get('scrollY')){
                result = momentum(this._translateY, this._startY, duration, this._maxY, this._panelHeight);
                var newY = result.destination;
                if (newY != this._translateY ) {
                    var effect = null;
                    if(newY > 0 || newY < this._maxY) {
                        // 惯性滑动中超出边界回弹回来，切换动画效果函数
                        if(this.get('isTransition')) {
                            effect = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        } else {
                            effect = function (k) {
                                return k * ( 2 - k );
                            };
                        }
                    }
                    this.scrollTo(0, newY, result.duration, effect);
                }
            }
            this._isAnimating = true;
        }
    },

    /**
     * transition动画结束后的处理函数
     * @function _transitionEnd
     * @memberOf Panel
     * @param  {HTMLDOMEvent} e transitionEnd结束时事件对象
     * @private
     */
    _transitionEnd: function(e) {
        if ( e.target != this._scroller[0] ) {
            return;
        }
        setTransitionTime(this._scroller);
        this._isAnimating = false;
        this._resetPosition();
    },

    /**
     * 不适用transition时的惯性动画函数
     * @function _animate
     * @memberOf Panel
     * @private
     * @param  {Number} translateX scroller要滚动的目标translateX
     * @param  {Number} translateY scroller要滚动的目标translateY
     * @param  {Number} time       scorller要滚动到
     * @param  {Function} effect     滚动的效果函数
     */
    _animate: function(translateX, translateY, time, effect) {
        var self = this,
            startX = this._translateX,
            startY = this._translateY,
            startTime = +new Date(),
            destTime = startTime + time;

        function step () {
            var now = +new Date(),
                newX, newY,
                easing;

            if ( now >= destTime ) {
                self._isAnimating = false;
                self._translate(translateX, translateY);
                self._translateX = translateX;
                self._translateY = translateY;
                self._resetPosition();
                return;
            }

            now = ( now - startTime ) / time;
            easing = effect(now);
            if(self.get('scrollX')) {
                newX = ( translateX - startX ) * easing + startX;
                self._translateX = newX;
                self._translate(newX, 0);
            } else if(self.get('scrollY')) {
                newY = ( translateY - startY ) * easing + startY;
                self._translateY = newY;
                self._translate(0, newY);
            }

            if ( self._isAnimating ) {
                rAF(step);
            }
        }
        this._isAnimating = true;
        step();
    },

     /**
     * 设置scroller的translateX和translateY值
     * @function _translate
     * @private
     * @param  {Number} translateX 要给scroller设置的translateX值
     * @param  {Number} translateY 要给scroller设置的translateY值
     * @memberOf Panel
     */
    _translate: function(translateX, translateY) {
        this._scroller[0].style.webkitTransform = 'translate(' + translateX + 'px, ' + translateY + 'px) translateZ(0)';
        this._scroller[0].style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) translateZ(0)';
        this.trigger('scroll', translateX, translateY, this._stopAnimate);
    },

    /**
     * 创建刷新和加载更多的操作图标
     * @function _createDragIcon
     * @memberOf Panel
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
            moreContainer.css({height: mh + 'px', lineHeight: mh + 'px', bottom: -mh}).appendTo(this._scroller);

            var child = moreContainer.children();
            this._loadmoreEl = child[0] && $(child[0]).hide();
            this._endmoreEl = child[1] && $(child[1]).hide();
        }
    },


    /**
     * 根据translateY改变刷新的显示状态（下拉刷新or释放更新）
     * @function _changeRefreshStatus
     * @memberOf Panel
     * @param {Number} translateY translateY的偏移
     * @private
     */
    _changeRefreshStatus: function(translateY) {
        var activeY = this.get('refreshActiveY');

        if(translateY >= activeY) {
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
     * @memberOf Panel
     * @param {String} direction 方向，上为up下位down
     * @private
     */
    _changeRefreshAnimate: function(direction) {
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
     * @memberOf Panel
     * @private
     */
    _refreshInit: function() {
        this._refreshing = true;
        this._dragEl.hide();
        this._endEl.hide();
        this._loadEl.show();
        this._changeRefreshAnimate('down');
        this.scrollTo(0, this.get('refreshActiveY'), 200);

        var self = this;
        setTimeout(function() {
            self.trigger('refresh', this._pageNum);
        }, 300);
    },

    /**
     * loadMore状态初始化
     * @function _loadMoreInit
     * @memberOf Panel
     * @private
     */
    _loadMoreInit: function() {
        this._loadmoreing = true;
        this._loadmoreEl.show();
        this._endmoreEl.hide();
        this._maxY -= this.get('loadmoreContY');
        this.trigger('loadmore', this._pageNum);
    },

    /**
     * 隐藏刷新和家在更多的状态
     * @function _reset
     * @memberOf Panel
     * @private
     */
    _reset: function() {
        if(this.get('useRefresh')) {
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
    }
});

// 滑动惯性计算
function momentum(current, start, time, lowerMargin, wrapperSize, deceleration) {
    var distance = current - start,
        speed = Math.abs(distance) / time,
        destination,
        duration;

    // 低版本安卓，降低惯性滑动速度
    var defaultDeceleration = 0.0006;
    $.os.android && $.os.version < '4.4' && (defaultDeceleration = 0.006);

    deceleration = deceleration === undefined ? defaultDeceleration : deceleration;

    destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
    duration = speed / deceleration;

    if ( destination < lowerMargin ) {
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
    } else if ( destination > 0 ) {
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
    }

    return {
        destination: Math.round(destination),
        duration: duration
    };
};

function setTransitionTime(elem, time) {
    time = time || 0;
    elem[0].style.webkitTransitionDuration = time + 'ms';
    elem[0].style.transitionDuration = time + 'ms';
}
function setTransitionTimingFunc(elem, effect) {
    elem[0].style.webkitTransitionTimingFunction = effect;
    elem[0].style.transitionTimingFunction = effect;
}

// 获取元素的translateX
function getTranslateX(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[12] || split[4]));
}

// 获取元素的translateY
function getTranslateY(elem) {
    var matrix = window.getComputedStyle(elem[0], null);
    var transform = matrix['webkitTransform'] || matrix['transform'];
    var split = transform.split(')')[0].split(', ');
    return Math.round(+(split[13] || split[5]));
}

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

module.exports = Panel;