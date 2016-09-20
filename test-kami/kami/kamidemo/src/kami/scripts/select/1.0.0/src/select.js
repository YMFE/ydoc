
/**
 * select选择组件，不带弹出层，如果需要弹出层请参考popcalendar
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Select
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/select/index.html
 */

/**
 * datasource like
 * [
 *     {vale: value, text:text}
 * ]
 */

//depandance Widget
//
var Widget = require('../../../core/1.0.0/index.js');
var SelectItemList = require('./selectitemlist.js');
var SelectTpl = require('./select.string');
var Template = require('../../../template/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');


var Select = Widget.extend({
    /**
     * @property {Number} displayCount 显示多少行，默认为5，修改此属性时，需要配合修改样式
     * @property {Array} datasource @requireselect的数据源，数组类型，每个数组项为object
     * @property {Object} value 当前组件的值 
     * @memberOf Select
     * @type {Object}
     */
    
    /**
     * @event {function} changevalue 改变值时触发的事件
     * @memberOf Select
     */
    options: {
        type: 'select',
        displayCount: 5,
        datasource: [
            {
                key: '',
                tag: '',
                datasource: []

            },
            {
                key: '',
                tag: '',
                datasource: []

            }
        ],
        template: SelectTpl,
        value: {},
        infinite: true,
        /**
         * 改变值时触发的事件
         * @event changevalue
         * @memberOf Select
         * @param  {String} key       滚动列的索引key
         * @param  {Object} value     当前组件对应索引key的值
         * @param  {Object} prevValue 组件对应索引key之前的值
         */
        onchangevalue: function(key, value, pvalue) {

        }
        
    },
    /**
     * 处理组件事件，空方法
     * @function renderEvent
     * @private
     */
    renderEvent: function () {
        

    },
    
    /**
     * 处理组件数据
     * @function init
     * @memberOf Select
     * @private
     */
    init: function () {
        this.datasource = this.get('datasource') || [];
        
        this._widgetMap = this.get('_widgetMap') || {};


    },
    /**
     * 设置select的值
     * @function setValue
     * @memberOf Select
     * @param {String} key   select列的索引
     * @param {Number | String} value 需要设置的值
     */
    setValue: function (key, value) {
        var ctrl = this._widgetMap[_getChildCtrlName(key)];
        if (ctrl && ctrl instanceof SelectItemList) {
            
            ctrl.setValue(value);
        }
    },
    /**
     * 设置select列的数据源
     * @function setDataSource
     * @memberOf Select
     * @param {String} key   select列的索引
     * @param {Array} ds  新的数据源
     */
    setDataSource: function (key, ds) {
        // debugger
        var ctrl = this._widgetMap[_getChildCtrlName(key)];
        if (ctrl && ctrl instanceof SelectItemList) {
            // console.log('setValue 了');
            ctrl.setDataSource(ds);
        }
    },
    /**
     * 获取当前列的值
     * @function getValue
     * @memberOf Select
     * @param  {String} key 列的索引
     * @return {Object}    该列对应的当前值
     */
    getValue: function (key) {
        
        var value = {};
    
        for (var ctrlKey in this._widgetMap) {
            if (this._widgetMap.hasOwnProperty(ctrlKey)) {
                var curKey = _getKeyName(ctrlKey);
                var ctrl = this._widgetMap[ctrlKey];
                if (!key || key === curKey) {
                    value[curKey] = ctrl.getValue();    
                }
                
            }
        }    
        
        return value;

    },
    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Select
     * @private
     * @param  {String} tpl 待解析的模板
     * @return {String}     解析后的模板
     */
    parseTemplate: function (tpl) {
        var data = this.datasource;
        
        
        var html = Template(tpl || SelectTpl, {
            list: data,
            uiClass: this.getClassName(),
            itemClass: this.getClassName('item'),
            tagClass: this.getClassName('item-tag'),
            extraClass: this.get('extraClass') ? this.getClassName(this.get('extraClass')) : ''
        });
        return html;
    },
    
    
    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Select
     */
    render: function () {
        
        Select.superClass.render.call(this);

        this.initProp();

        this.initUi();

        var valueObj = this.get('value');

        if (!$.isEmptyObject(valueObj)) {
            for (var key in valueObj) {
                if (valueObj.hasOwnProperty(key)) {
                    this.setValue(key, valueObj[key]);
                }
            }
        }
        this.renderEvent();
    },
    /**
     * 设置组件样式，以及设置select组件遮罩的样式
     * @function initUi
     * @memberOf Select
     * @private
     */
    initUi: function () {
        
        
        
        if (!this.mask.length || (this.mask[0] == null)) {
            return;
        }
        // var str = '-webkit-linear-gradient(top,rgba(255,255,255,1),rgba(255,255,255,.3) {{part1}}%,rgba(255,255,255,.3) {{part1}}%,transparent {{part2}}%,rgba(255,255,255,.3) {{part2}}%,rgba(255,255,255,1));';
        var str = '-webkit-linear-gradient(top, rgb(255, 255, 255), ' +
                'rgba(255, 255, 255, .2) {{part1}}%, ' +
                'transparent {{part1}}%, transparent {{part2}}%, ' +
                'rgba(255, 255, 255, 0.2) {{part2}}%, rgb(255, 255, 255))';
        var displayCount = this.get('displayCount') || 5;
        var part1 = 100 * (displayCount - 1) / 2 / displayCount;
        var part2 = 100 - part1;
        str = str.replace(/\{\{part1\}\}/g, part1);
        str = str.replace(/\{\{part2\}\}/g, part2);
        // console.log(str);
        this.mask.css('background', str);
    },
    /**
     * 初始化组件与ui相关的属性
     * @function initProp
     * @memberOf Select
     * @private
     */
    initProp: function () {
        
        var widget = this;
        this.sectionItemListDom = this.widgetEl[0].querySelectorAll('[data-role=item]');
        this.mask = $(this.widgetEl).find('[data-role=mask]');
        
        for (var i = 0; i < this.sectionItemListDom.length; i++) {
            (function (dom, index) {
                // debugger
                var options = {
                    showline: false,
                    container: dom,
                    displayCount: widget.get('displayCount') || 3,
                    infinite: !!widget.get('infinite'),
                    onchangevalue: function (value, prevValue) {
                        // console.log(widget._event);
                        
                        widget.trigger('changevalue', widget.datasource[index].key, value, prevValue);
                    }
                };
                if (widget.get('itemTemplate')) {
                    options.template = widget.get('itemTemplate');
                }
                $.extend(options, widget.datasource[index]);

                widget._widgetMap[_getChildCtrlName(widget.datasource[index].key)] = new SelectItemList (
                
                    options
                );
                var ctrl = widget._widgetMap[_getChildCtrlName(widget.datasource[index].key)];
                ctrl.render();

            } (this.sectionItemListDom[i], i));
            
        }
        
    }
    
});
/**
 * 生成内部的子控件的名称
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function _getChildCtrlName(name) {
    return 'section_' + name;
}
/**
 * 获得控件的原始名字
 * @param  {[type]} ctrlName [description]
 * @return {[type]}          [description]
 */
function _getKeyName(ctrlName) {
    var index = ctrlName.indexOf('_');
    if (index !== -1) {
        return ctrlName.substr(index+1);
    }
}
module.exports = Select;
