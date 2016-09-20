
/**
 * 选择列表，支持单选多选
 * @author zxiao <jiuhu.zh@gmail.com>
 * @class Selectlist
 * @constructor
 * @extends List
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/selectlist/index.html
 */
var $ = require('../../../util/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');
var List = require('../../../list/1.0.0/index.js');
var ListTpl = require('./tpl/selectlist.string');
var ItemTpl = require('./tpl/selectlist-item.string');

var Selectlist = List.extend({

    /**
     * @property {Boolean} multi 是否是多选，默认为false，false代表单选，true代表多选
     * @property {String} key 数据列表中，数据的唯一标记，如id
     * @property {String} selectedClass 列表项被用户选中项的样式
     * @property {Array} defaultSelected 组件初始化时默认选中的数据
     * @property {String} template 组件默认模板，自定义时需要传
     * @property {String} itemTpl 组件选项的模板，自定义时需要传
     * @memberOf Selectlist
     */
    
    /**
     * @event {function} selectitem 列表项点击时触发的事件
     * @memberOf Selectlist
     */
    options: {
        type: 'selectlist',
        // 是否多选
        multi: false,
        // 数据选项唯一标示符
        key: 'value',

        // 选中后的样式
        selectedClass: '',
        // 默认选中的数据
        defaultSelected: [],

        // 组件模板
        template: ListTpl,
        // 选项模板
        itemTpl: ItemTpl,

        /**
         * 用户选择某项数据时触发的事件
         * @event selectitem
         * @param  {Object} data     当前选择项目的数据
         * @param  {HTMLElement} itemEl   当前选择项目的节点
         * @param  {HTMLElement} targetEl 用户点击的实际节点
         * @memberOf Selectlist
         */
        //onselectitem: function() {}
        onTap: function(e) {
            var targetEl = $(e.target);
            var itemEl = this.getItemNode(targetEl);
            if(!itemEl) return;

            var input = itemEl.find('input'),
                dataIndex = itemEl.data('index'),
                dataSelected = +itemEl.data('selected'),
                data = this.get('datasource')[dataIndex];

            if(!dataSelected) {
                if(this.get('multi')) {
                    this._selected(itemEl, input, data);
                } else {
                    var selected = this.widgetEl.find('[data-selected="1"]');
                    if(selected) {
                        this._unselected(selected, selected.find('input'));
                    }
                    this._selected(itemEl, input, data);
                }
            } else {
                if(this.get('multi')) {
                    this._data.splice(this._data.indexOf(data), 1);
                    this._unselected(itemEl, input);
                }
            }
            this.trigger('selectitem', data, itemEl, targetEl);
        },
        events: {
            'click input': function() {
                return false;
            }
        }
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf Selectlist
     * @private
     */
    init: function() {
        Selectlist.superClass.init.call(this);
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Selectlist
     */
    render: function() {
        Selectlist.superClass.render.call(this);
        this._selectDefault();
        return this;
    },

    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf Selectlist
     * @private
     */
    initProp: function() {
        Selectlist.superClass.initProp.call(this);
        this._data = [];
    },

    /**
     * 生成列表选项Html，覆盖父类list的方法
     * @function createListItem
     * @memberOf Selectlist
     * @private
     */
    createListItem: function() {
        var itemHtml = '';
        var ds = this.get('datasource');
        var render = Template(this.get('itemTpl'));
        if(ds && ds.length) {
            var data = $.extend([], ds);
            var multi = this.get('multi');
            data.forEach(function(item, index) {
                var data = $.extend(true, {}, item);
                data['dataIndex'] = index;
                data['multi'] = multi;
                itemHtml += render(data);
            });
        }
        return itemHtml;
    },

    /**
     * 获取选中的数据
     * @function getValue
     * @memberOf Selectlist
     * @return {Array} 选中值的数组
     */
    getValue: function() {
        var result = [];
        for (var i = 0; i < this._data.length; i++) {
            result.push(this._data[i]);
        }
        return result;
    },

    /**
     * 设置selectlist的当前值
     * @function setValue
     * @memberOf Selectlist
     * @param {Array} valueArr 设置组件选中的值
     */
    setValue: function (valueArr) {
        this.clear();
        var arr = valueArr || [];
        !this.get('multi') && arr.length > 1 && (arr = arr.slice(0, 1));
        for (var i = 0; i < arr.length; i++) {
            var data = this._getDataByVal(arr[i]);
            if (data) {
                var elem = this.widgetEl.find('[data-index="' + data.index+'"]');
                var input = elem.find('input');
                this._selected(elem, input, data.data);
            }
        }
    },

    /**
     * 清空选中数据和选项
     * @function clear
     * @memberOf Selectlist
     */
    clear: function () {
        var self = this;
        this._data = [];
        this.widgetEl.find('[data-selected="1"]').forEach(function (item) {
            var itemEl = $(item);
            self._unselected(itemEl, itemEl.find('input'));
        });
    },

    /**
     * 初始化时根据默认defaultSelected的配置，设置选中值
     * @function _selectDefault
     * @memberOf Selectlist
     * @private
     */
    _selectDefault: function () {
        var arr = this.get('defaultSelected') || [];
        this.setValue(arr);
    },



    /**
     * 设置节点为选中状态
     * @function _selected
     * @memberOf Selectlist
     * @private
     * @param  {HTMLElement} elem  需要被选中的节点
     * @param  {HTMLElement} input item节点对应的input节点
     * @param  {Object} data  数据
     */
    _selected: function(elem, input, data) {
        this.get('multi') ? this._data.push(data) : (this._data[0] = data);
        this.get('selectedClass') && elem.addClass(this.get('selectedClass'));
        elem.data('selected', '1');
        input && input[0] &&(input[0].checked = true);
    },
    /**
     * 设置节点为未选中状态
     * @function _unselected
     * @memberOf Selectlist
     * @private
     * @param  {HTMLElement} elem  需要被选中的节点
     * @param  {HTMLElement} input item节点对应的input节点
     */
    _unselected: function (elem, input) {
        elem.data('selected', '0');
        this.get('selectedClass') && elem.removeClass(this.get('selectedClass'));
        input && input[0] &&(input[0].checked = false);
    },
    /**
     * 根据值获取整条数据
     * @param  {String | Number} val 需要获取的数据的唯一标识的值
     * @return {Object}     对应的整条数据
     */
    _getDataByVal: function(val) {
        var ds = this.get('datasource'),
            key = this.get('key');
        for(var i = 0; i < ds.length; i++) {
            if(ds[i][key] == val) {
                return {
                    index: i,
                    data: ds[i]
                };
            }
        }
        return null;
    }
});

module.exports = Selectlist;