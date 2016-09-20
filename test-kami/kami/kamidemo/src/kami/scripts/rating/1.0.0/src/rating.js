/**
 * 
 * @author  sharon<xuan.li@qunar.com>
 */
/**
 * 星星打分组件
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Rating
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/rating/index.html
 */

;(function (){
    var Widget = require('../../../core/1.0.0/index.js');
    var Template = require('../../../template/1.0.0/index.js');
    var RatingTpl = require('./rating.string');

    var Rating = Widget.extend({
        /**
         * @property {Number} total 组件的总得分
         * @property {Number} cur 当前组件的得分
         * @property {Boolean} readonly 组件是否只读
         * @memberOf Rating
         */
        
        
        options: {
            type: 'rating',
            template: RatingTpl,
            total: 5,
            cur: 0,
            // activeClass: 'item-on',
            readonly: false,
            events: {
                'tap [data-role="item"]': '_tapHandler'
            },
            /**
             * 改变值时触发的事件
             * @param  {String} value 当前租价的值
             * @memberOf Rating
             */
            onchangevalue: function (value) {

            }
            
        },
        /**
         * @event changevalue
         */
        
        /**
         * 处理数据并初始化方法
         * @memberOf Rating
         * @function init
         * @private 
         */
        init: function () {
            this.total = parseInt(this.get('total'), 10) || 5;
            this.cur = parseInt(this.get('cur'), 10) || 0;
            
            this.readonly = !!this.get('readonly');

        },
        /**
         * 处理数据并初始化方法
         * @memberOf Rating
         * @function _initProp
         * @private
         */
        _initProp: function () {
            this.itemList = this.widgetEl[0].querySelectorAll('[data-role="item"]');
            this.curIndexEl = this.widgetEl[0].querySelector('[data-role="curIndex"]');
            // console.log()
        },
        /**
         * 处理ui相关的方法
         * @memberOf Rating
         * @function _initUi
         * @private
         */
        _initUi: function () {
            this.setValue(this.cur);
            
            this.widgetEl[0].classList.add(this.getClassName());
            this.readonly && this.widgetEl[0].classList.add(this.getClassName('readonly'));
            this.curIndexEl.classList.add(this.getClassName('index'));
            _addAll(this.itemList, this.getClassName('item'));

        },
        /**
         * 渲染组件
         * @memberOf Rating
         * @function render
         */
        render: function () {
            Rating.superClass.render.call(this);
            this._initProp();
            this._initUi();
        },
        /**
         * 组件点击事件
         * @memberOf Rating
         * @function _tapHandler
         * @private
         */
        _tapHandler: function (e) {
            
            if (this.readonly) {
                return;
            }
            else {
                var index = e.target.getAttribute('index');
                this.setValue(index);
                
            }
        },
        /**
         * 设置rating为只读不可点击
         * @param {Boolean} readonly 是否只读
         * @memberOf Rating
         * @function setReadonly
         * @version 0.0.5
         */
        setReadonly: function (readonly) {
            this.readonly = !!readonly;
            var el = this.widgetEl[0];
            if (this.readonly) {
                el.classList.add(this.getClassName('readonly'));
            }
            else {
                el.classList.remove(this.getClassName('readonly'));
            }
        },

        
        setDisable: function (disabled) {
            this.disabled = !!disabled;
            var el = this.widgetEl[0];
            if (this.disabled) {
                el.classList.add(this.getClassName('disabled'));
            }
            else {
                el.classList.remove(this.getClassName('disabled'));
            }
        },
        /**
         * 设置组件值
         * @param {Number} value 组件的值
         * @memberOf Rating
         * @function setValue
         */
        setValue: function (value) {
            if (value < 0 || value > this.total) {
                return;
            }
            else {
                this.cur = value;
                this.curIndexEl.style.width = (value * 100 / this.total) + '%';
                this.trigger('changevalue', value);
            }
        },
        /**
         * 获取组件的值
         * @function getValue
         * @memberOf Rating
         * @return {Number} 组件当前的值
         */
        getValue: function () {
            return this.cur;
        },
        /**
         * 解析模板
         * @param  {String} tpl 待解析的模板
         * @function parseTemplate
         * @private
         * @memberOf Rating
         * @return {String}     解析后的模板
         */
        parseTemplate: function (tpl) {
            
            var widget = this;
            var _data = new Array(5);
            for (var i = 0; i < _data.length; i++) {
                var value = i + 1;
                _data[i] = {
                    index: i + 1
                };
            }
            
            var html = Template(tpl || RatingTpl, {
                list: _data
            });

            return html;
        }
    });
    function _removeAll(domList, className) {
        Array.prototype.forEach.call(domList, function (item, i) {
                
            item.classList.remove(className);    
        });
    }
    function _addAll(domList, className) {
        Array.prototype.forEach.call(domList, function (item, i) {
                
            item.classList.add(className);    
        });
    }
    function _addMatch(domList, index, className) {
        Array.prototype.forEach.call(domList, function (item, i) {
                
            var _index = item.getAttribute('index');
            if (_index == index) {
                
                item.classList.add(className);
                
            }
            
        });
    }
    module.exports = Rating;
}());