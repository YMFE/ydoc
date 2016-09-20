/**
 * 搜索分组列表，类似微信通讯录
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Searchlist
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/searchlist/index.html
 */

var $ = require('../../../util/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var Suggest = require('../../../suggest/1.0.0/index.js');
var Grouplist = require('../../../grouplist/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');

var SearchlistTpl = require('./tpl/searchlist.string');

var SuggestTpl = require('./tpl/suggest.string');
var ResultListTpl = require('./tpl/result-list.string');
var ResultItemTpl = require('./tpl/result-item.string');

var ListTpl = require('./tpl/grouplist.string');
var ItemTpl = require('./tpl/grouplist-item.string');
var StickyTpl = require('./tpl/sticky.string');
var IndexlistTpl = require('./tpl/indexlist.string');

var Searchlist = Widget.extend({


    /**
     * @property {Boolean} resizable 是否可调整大小，默认为true
     * @property {Function} filter 自定义的过滤函数，默认为null，使用内置过滤函数
     * @property {Array} filterBy 过滤数据的字段，默认为['value']
     * @property {Boolean} modal 是否启用独占的模态框模式，默认为false
     * @property {Boolean} async 是否异步加载数据，默认为false，
     * @property {String} resultActiveClass 搜索结果被点击时的样式，默认为空
     * @property {Boolean} resultScrollLock 当数据项少于一屏时，是否锁定不允许滚动，默认为false，允许滚动
     * @property {String} suggestTpl suggest的组件的模板
     * @property {String} resultListTpl 搜索结果模板
     * @property {String} resultItemTpl 搜索结果选项模板
     * @property {String} groupBy 根据数据中的哪个字段分组进行分组，必填
     * @property {Array} notgroupData 没有分组的数据，默认展示在顶部
     * @property {Array} previousData 前置分组的数据，在未分组数据和分组数据之间
     * @property {Boolean} isTransition 默认滚动的动画效果，默认为false，true使用css的transition，false使用js动画
     * @property {Boolean} lazyload 是否延迟加载数据，默认为false，开启后先加载20条，然后在加载其余数据
     * @property {String} template 组件的外层模板，自定义模板时，需要传值
     * @property {String} itemTpl 组件分组数据模板，自定义模板时，需要传值
     * @property {String} stickyTpl 磁贴字母模板
     * @property {Boolean} hasIndexList 是否显示右侧字母索引列表，默认为true
     * @property {String} indexlistTpl 右侧索引字母模板
     * @property {Function} groupTitleRender 渲染分组数据title的渲染函数，默认取第一个字符
     * @memberOf Searchlist
     */
    

    options: {
        type: 'searchlist',
        // 组件模板
        template: SearchlistTpl,
        // 默认皮肤
        skin: '',
        // 可调整大小
        resizable: true,

        /** suggest */
        // 自定义的输出过滤
        filter: null,
        // 过滤数据的字段
        filterBy: ['value'],
        // 忽略大小写
        ignorecase: true,
        // 是否启用独占的模态框模式
        modal: false,
        // 是否异步加载数据
        async: false,
        // 当数据项少于一屏时，是否锁定不允许滚动，默认为false
        resultScrollLock: false,

        suggestTpl: SuggestTpl,
        // 搜索结果模板
        resultListTpl: ResultListTpl,
        // 搜索结果选项模板
        resultItemTpl: ResultItemTpl,

        // 搜索结果选择事件
        /**
         * 用户点击搜索结果时触发的事件
         * @event selectfilteritem
         * @memberOf Searchlist
         * @param  {Object} data 点击的搜索结果条目对应的数据
         * @memberOf Searchlist
         */
        onSelectFilterItem: function (data) {},

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Searchlist
         */
        //onselectitem: function() {}
        
        /**
         * 搜索值改变时触发的事件
         * @event changevalue
         * @param  {String} newVal 搜索的新值
         * @param  {String} oldVal 搜索的老值
         * @memberOf Searchlist
         */
        onChangeValue: function (newVal, oldVal) {},

        /** grouplist */
        // 分组字段，必填
        groupBy: '',
        // 没有分组数据，默认展示在顶部
        notgroupData: [],
        // 前置分组数据
        previousData: [],
        // 动画的效果，使用js动画
        isTransition: false,
        // 激活状态的样式
        activeClass: '',
        // 延迟加载数据
        lazyload: false,

        hasIndexList: true,
        // 组件模板
        listTpl: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,
        // 磁贴字母模板
        stickyTpl: StickyTpl,
        // 索引字母模板
        indexlistTpl: IndexlistTpl
    },


    /**
     * 处理组件数据
     * @function init
     * @memberOf Searchlist
     * @private
     */
    init: function() {
        this.initProp();
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Searchlist
     */
    render: function() {
        Searchlist.superClass.render.call(this);
        this.initUI();
        return this;
    },

    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf Searchlist
     * @private
     */
    initProp: function() {
        this._suggest = null;
        this._group = null;
    },

    /**
     * 处理组件样式
     * @function initUI
     * @memberOf Searchlist
     * @private
     */
    initUI: function() {
        var self = this;

        this._suggest = this._widgetMap['suggest'] = new Suggest({
            container: this.widgetEl.find('[data-role="suggest"]'),
            template: this.get('suggestTpl'),
            skin: this.get('skin'),
            resultListTpl: this.get('resultListTpl'),
            resultItemTpl: this.get('resultItemTpl'),
            datasource: this.get('datasource'),
            modal: this.get('modal'),
            resultActiveClass: this.get('activeClass'),
            resultScrollLock: this.get('resultScrollLock'),
            ignorecase: this.get('ignorecase'),
            filterBy: this.get('filterBy'),
            filter: this.get('filter'),
            async: this.get('async'),
            onSelectFilterItem: function(data) {
                self.trigger('selectfilteritem', data);
            },
            onChangeValue: function(newVal, oldVal) {
                self.trigger('changevalue', newVal, oldVal);
            }
        }).render();
        var groupOpt = {
            container: this.widgetEl.find('[data-role="searchlist"]'),
            datasource: this.get('datasource'),
            skin: this.get('skin'),
            lazyload: this.get('lazyload'),
            groupBy: this.get('groupBy'),
            previousData: this.get('previousData'),
            notgroupData: this.get('notgroupData'),
            template: this.get('listTpl'),
            itemTpl: this.get('itemTpl'),
            stickyTpl: this.get('stickyTpl'),
            indexlistTpl: this.get('indexlistTpl'),
            activeClass: this.get('activeClass'),
            hasIndexList: this.get('hasIndexList'),
            onSelectItem: function (data, itemEl, targetEl) {
                self.trigger('selectitem', data, itemEl, targetEl);
            }
        };
        this._suggest.on('focus', function () {
            return self.trigger('focus');
        });
        var groupTitleRender = this.get('groupTitleRender');
        if (groupTitleRender && typeof groupTitleRender === 'Function') {
            groupOpt['groupTitleRender'] = groupTitleRender;
        }
        this._group = this._widgetMap['grouplist'] = new Grouplist(groupOpt).render();
    },
    /**
     * 重新设置组件的数据
     * @function reload
     * @memberOf Searchlist
     * @param  {Array} ds 搜索框组件以及分组列表的数据
     */
    reload: function(ds) {
        this._suggest.set('datasource', ds);
        this._group.set('datasource', ds);
    },
    /**
     * 获取suggest内部的input元素
     * @function getSuggestInputEl
     * @memberOf Suggest
     * @return {HTMLElement} 组件内部的input元素
     */
    getSuggestInputEl: function() {
        return this._suggest.getInputEl();
    },
    /**
     * 根据标记找到相应的节点
     * @function getItemByFlag
     * @param {String} flag 节点的item-flag标记
     * @memberOf Searchlist
     * @private
     */
    getItemByFlag: function(flag) {
        return this._group.getItemByFlag(flag);
    },

    /**
     * 过滤数据
     * @param  {Array} data 需要过滤的数据
     * @function filterData
     * @private
     * @memberOf Searchlist
     */
    filterData: function(data) {
        this._suggest.filterData(data);
    },
    /**
     * 设置分组列表的前置数据
     * @param {Array} data 分组列表的前置数据
     * @function setPreviousData
     * @memberOf Searchlist
     */
    setPreviousData: function(data) {
        this._group.set('previousData', data);
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf Searchlist
     */
    resize: function() {
        this._group.resize();
    }
});

module.exports = Searchlist;