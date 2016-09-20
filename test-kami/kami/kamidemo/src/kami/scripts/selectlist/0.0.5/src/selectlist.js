/**
 * @description 选择列表，支持单选多选
 * @author zxiao <zx1943h@gmail.com>
 * @date 2014/12/17
 */
var $ = require('../../../util/0.0.1/index.js');
var Template = require('../../../template/0.0.1/index.js');
var List = require('../../../list/0.0.1/index.js');
var ListTpl = require('./tpl/selectlist.string');
var ItemTpl = require('./tpl/selectlist-item.string');

var Selectlist = List.extend({
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

    init: function() {
        Selectlist.superClass.init.call(this);
    },

    render: function() {
        Selectlist.superClass.render.call(this);
        this._selectDefault();
        return this;
    },

    // 初始化组件的私有参数
    initProp: function() {
        Selectlist.superClass.initProp.call(this);
        this._data = [];
    },

    // 覆盖父类方法
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

    // 获取选中的数据
    getValue: function() {
        var result = [];
        for (var i = 0; i < this._data.length; i++) {
            result.push(this._data[i]);
        }
        return result;
    },
    /**
     * 设置selectlist的当前值
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

    // 清空选中数据和选项
    clear: function () {
        var self = this;
        this._data = [];
        this.widgetEl.find('[data-selected="1"]').forEach(function (item) {
            var itemEl = $(item);
            self._unselected(itemEl, itemEl.find('input'));
        });
    },

    _selectDefault: function () {
        var arr = this.get('defaultSelected') || [];
        this.setValue(arr);
    },
    _selected: function(elem, input, data) {
        this.get('multi') ? this._data.push(data) : (this._data[0] = data);
        this.get('selectedClass') && elem.addClass(this.get('selectedClass'));
        elem.data('selected', '1');
        input && input[0] &&(input[0].checked = true);
    },
    _unselected: function(elem, input) {
        elem.data('selected', '0');
        this.get('selectedClass') && elem.removeClass(this.get('selectedClass'));
        input && input[0] &&(input[0].checked = false);
    },
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