/**
 * 双列表，类似于外卖的左右两列选菜列表，是通过组合两个pagelist来完成的
 * 左侧为分类列表右侧为主列表
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class DoubleList
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/doublelist/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var Pagelist = require('../../../pagelist/1.0.0/index.js');
var ImageLazyLoad = require('../../../imagelazyload/1.0.0/index.js');
var tpl = require('./tpl/doublelist.string');
var CategoryListTpl = require('./tpl/list-category.string');
var CategoryItemTpl = require('./tpl/list-category-item.string');
var MainListTpl = require('./tpl/list-main.string');
var MainItemTpl = require('./tpl/list-main-item.string');

var DoubleList = Widget.extend({

    /**
     * @property {String} categoryListActiveClass 分类列表激活状态的样式
     * @property {String} categoryListSelectedClass 分类列表选中后的样式
     * @property {String} mainListActiveClass 主列表激活状态的样式
     * @property {String} mainListSelectedClass 主列表选中后的样式
     * @property {Array} category 左侧分类列表数据
     * @property {String} key 分类数据与主列表数据关联字段，默认为null
     * @property {Boolean} selectFirst 是否默认选中分类列表第一项，默认为true
     * @property {Boolean} preventDefault 是否阻止浏览器默认事件，默认为true
     * @property {Boolean} resizable 窗口大小改变时，是否重新调节大小，默认为true
     * @property {Number} pagesize 主列表一页显示的条目树，默认为15
     * @property {Boolean} useRefresh 是否允许下拉刷新，默认为false
     * @property {Boolean} useLoadmore 是否允许下拉加载更多，默认为false
     * @property {Boolean} infinite 主列表是否加载大量数据，默认为false
     * @property {Boolean} imgLazyLoad 主列表图片是否延迟加载，默认为false
     * @property {String} template 组件模板，需要自定义时修改
     * @property {String} categoryListTpl 分类列表模板，需要自定义时修改
     * @property {String} categoryItemTpl 分类列表项模板，需要自定义时修改
     * @property {String} mainListTpl 主列表模板，需要自定义时修改
     * @property {String} mainItemTpl 主列表项模板，需要自定义时修改
     * @memberOf  DoubleList
     */
    

    options: {
        type: 'doublelist',
        // 分类列表激活状态的样式
        categoryListActiveClass: null,
        // 分类列表选中后的样式
        categoryListSelectedClass: null,
        // 数据列表激活状态的样式
        mainListActiveClass: null,
        // 数据列表选中后的样式
        mainListSelectedClass: null,
        // 分类数据
        category: [],
        // 分类数据与主列表数据关联字段
        key: null,
        // 默认选中分类列表第一项
        selectFirst: true,
        // 阻止浏览器默认事件
        preventDefault: false,
        // 可调整大小
        resizable: true,

        // 每页加载的数据量
        pagesize: 15,
        // 刷新激活高度
        refreshActiveY: 40,
        // 加载更多激活高度
        loadmoreActiveY: 40,
        // 刷新结果显示时间，0为不显示刷新结果
        refreshResultDelay: 0,
        // 是否启用刷新功能
        useRefresh: false,
        // 是否启用加载更多功能
        useLoadmore: false,
        // 是否加载大量数据
        infinite: false,
        // 主列表图片是否延迟加载
        imgLazyLoad: false,
        // 主列表tap事件点击间隔时间
        mainListTapInterval: 0,

        // 组件模板
        template: tpl,
        // 分类列表模板
        categoryListTpl: CategoryListTpl,
        // 分类列表项模板
        categoryItemTpl: CategoryItemTpl,
        // 数据列表模板
        mainListTpl: MainListTpl,
        // 数据列表项模板
        mainItemTpl: MainItemTpl,
        /**
         * 选择左侧分类列表时触发的事件
         * @event selectcategory
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf DoubleList
         */
        onSelectCategory: function (data, itemEl, targetEl) {},
        
        /**
         * 选择右侧主列表时触发的事件
         * @event selectmain
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf DoubleList
         */
        onSelectMain: function (data, itemEl, targetEl) {},
        // 刷新中，该接口必须调用Pagelist.refresh(true|false, data)方法通知Pagelist数据已加载
        /**
         * 下拉刷新时触发的事件
         * @event refresh
         * @param  {Number} pageNum 当前的页码
         * @memberOf DoubleList
         */
        onRefresh: function (pageNum) {},
        // 加载更多中，该接口必须调用Pagelist.loadMore(true|false, data)方法通知Pagelist数据已加载
        /**
         * 加载更多时触发的事件
         * @event loadmore
         * @param  {Number} pageNum 当前的页码
         * @memberOf DoubleList
         */
        onLoadMore: function(pageNum) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf DoubleList
     * @private
     */
    init: function() {
        this.initProp();
    },


    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf DoubleList
     */
    render: function() {
        DoubleList.superClass.render.call(this);
        this.initUI();
        return this;
    },

    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf DoubleList
     * @private
     */
    initProp: function() {
        this._categoryList = null;
        this._mainList = null;
        this._imgLazyLoader = null;
    },

    /**
     * 渲染组件样式
     * @function initUI
     * @memberOf DoubleList
     * @private
     */
    initUI: function() {
        var self = this;

        var category = this.get('category');
        if(!category || !category.length) return;

        var selectFirst = this.get('selectFirst');

        this._categoryList = this._widgetMap['categorylist'] = new Pagelist({
            container: this.widgetEl.find('[data-role="categorylist"]'),
            datasource: category,
            useRefresh: false,
            useLoadmore: false,
            isTransition: true,
            preventDefault: this.get('preventDefault'),
            template: this.get('categoryListTpl'),
            itemTpl: this.get('categoryItemTpl'),
            activeClass: this.get('categoryListActiveClass'),
            selectedClass: this.get('categoryListSelectedClass'),
            onSelectItem: function(data, itemEl, targetEl) {
                self.trigger('selectcategory', data, itemEl, targetEl);
                self._mainList.scrollTo(0);
            },
            onReady: function() {
                if(selectFirst) {
                    var selectedClass = this.get('selectedClass');
                    if(selectedClass) {
                        $(this._itemWrap.children().get(0)).addClass(selectedClass);
                    }
                }
            }
        }).render();

        this._mainList = this._widgetMap['mainlist'] = new Pagelist ({
            container: this.widgetEl.find('[data-role="mainlist"]'),
            datasource: [],
            useRefresh: false,
            pagesize: this.get('pagesize'),
            refreshActiveY: this.get('refreshActiveY'),
            loadmoreActiveY: this.get('loadmoreActiveY'),
            refreshResultDelay: this.get('refreshResultDelay'),
            useRefresh: this.get('useRefresh'),
            useLoadmore: this.get('useLoadmore'),
            preventDefault: this.get('preventDefault'),
            infinite: this.get('infinite'),
            tapInterval: this.get('mainListTapInterval'),
            template: this.get('mainListTpl'),
            itemTpl: this.get('mainItemTpl'),
            activeClass: this.get('mainListActiveClass'),
            selectedClass: this.get('mainListSelectedClass'),
            onRefresh: this.get('onRefresh'),
            onLoadMore: this.get('onLoadMore'),
            onSelectItem: function(data, itemEl, targetEl) {
                self.trigger('selectmain', data, itemEl, targetEl);
            }
        }).render();

        selectFirst &&self.trigger('selectcategory', category[0]);
    },

    /**
     * 重新加载主列表的数据
     * @function reloadMainList
     * @memberOf DoubleList
     * @param  {Array} data 主列表重新加载的数据
     */
    reloadMainList: function(data) {
        this._mainList.reloadData(data);

        if(this.get('imgLazyLoad')) {
            if(!this._imgLazyLoader) {
                var self = this;
                this._imgLazyLoader = new ImageLazyLoad({
                    container: this._mainList.widgetEl
                });
                this._mainList.on('scroll', function(y) {
                    self._imgLazyLoader.lazyload(y);
                })
            } else {
                this._imgLazyLoader.scan();
            }
        }
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf DoubleList
     */
    resize: function() {
        this._categoryList.resize();
        this._mainList.resize();
    }
});

module.exports = DoubleList;