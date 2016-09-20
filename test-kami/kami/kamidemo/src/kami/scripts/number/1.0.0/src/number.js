
/**
 * 数字+-组件
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Number
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/number/index.html
 */

var Widget = require('../../../core/1.0.0/index.js');
var NumbersTpl = require('./number.string');
var Template = require('../../../template/1.0.0/index.js');
var tmp = {};
tmp['Number'] = Widget.extend({
    /**
     * @property {Number} max 允许的最大值，默认是10000
     * @property {Number} min 允许的最小值，默认是-10000
     * @property {Number} value 当前值
     * @property {Number} step 点击加减增加或者减少的值，默认为1
     * @property {Boolean} disable 组件是否不可用，默认为false
     * @memberOf Number
     */
    
    
    options: {
        type: 'number',
        max: 10000,
        min: -10000,
        value: 0,
        step: 1,
        disable: false,
        template: NumbersTpl,
        /**
         * 组件值改变时触发的事件
         * @event changevalue
         * @param  {Object} value     组件的当前值
         * @param  {Object} prevValue 组件之前的值
         * @memberOf Number
         */
        onchangevalue: function (value, prevValue) {
            // console.log(value);
        },
        events: {
            'tap [data-role=minus]': '_minusTapHandler',
            'tap [data-role=plus]': '_plusTapHandler',
            'blur input': '_inputTextBlurHandler',
            'focus input': '_inputTextFocusHandler'
        }
    },
    
    /**
     * 点击减号按钮事件的处理函数
     * @function _minusTapHandler
     * @memberOf Number
     * @private
     * @param  {HTMLDOMEvent} e 点击的事件对象
     */
    _minusTapHandler: function (e) {
        
        if (this.disable) {
            return;
        }
        var value = parseInt(this.getValue(), 10);
        var nextValue = value - this.step;
        if (nextValue >= this.min) {
            this.prevValue = value;//为了保存有效value
            this.setValue(nextValue);
            this.trigger('changevalue', nextValue, this.prevValue);
        }
        
        this._setClass(nextValue, true);
    },

    /**
     * 点击加号按钮事件的处理函数
     * @function _plusTapHandler
     * @memberOf Number
     * @private
     * @param  {HTMLDOMEvent} e 点击的事件对象
     */
    _plusTapHandler: function (e) {
        
        if (this.disable) {
            return;
        }
        
        var value = parseInt(this.getValue(), 10);
        var nextValue = value + this.step;
        if (nextValue <= this.max) {
            this.prevValue = value;
            this.setValue(nextValue, true);
            this.trigger('changevalue', nextValue, this.prevValue);    
        } 
        
        this._setClass(nextValue);
    },

    /**
     * 根据value获取合法的值，如果值非法，那么自动返回之前正确的值
     * @function _getValidateValue
     * @memberOf Number
     * @private
     * @param  {Number} value 需要转为正确值得value
     */
    _getValidateValue: function (value) {
        if (!(checkValue(value))) {
            // debugger
            // alert('value is not valid, change value to half automatically');
            // this.trigger('error', value);
            // value.replace(/^-?(\D*)/g, function(match, chr) {return ''});
            value = this.prevValue;
        }
        else {
            value = parseInt(value, 10);
            if (value > this.max) {
                value = this.max;
            }
            else if (value < this.min) {
                value = this.min;
            }
            else {

            }
            // this.prevValue = value;
        }
        return value;
    },

    /**
     * 文本框获得焦点时触发事件的处理函数
     * @function _inputTextFocusHandler
     * @memberOf Number
     * @private
     * @param  {HTMLDOMEvent} e 点击的事件对象
     */
    _inputTextFocusHandler: function (e) {
        if (this.disable) {
            return;
        }
        this.prevValue = this.getValue();
    },

    /**
     * 文本框失去焦点时触发事件的处理函数
     * @function _inputTextBlurHandler
     * @memberOf Number
     * @private
     * @param  {HTMLDOMEvent} e 点击的事件对象
     */
    _inputTextBlurHandler: function (e) {
        
        if (this.disable) {
            return;
        }
        
        var value = this.getValue();
        if (checkValue(value, [this.min, this.max])) {
            this.setValue(value, true);
            this._setClass(value);
            this.trigger('changevalue', value, this.prevValue);
        }
        else {
            this.setValue(this.prevValue);
        }
        

        
    },

    /**
     * 根据value值与最大值最小值的关系，设置组件样式
     * @function _setClass
     * @memberOf Number
     * @private
     * @param {Number} value 组件的值
     */
    _setClass: function (value) {
        
        if (value <= this.min) {
            this.minus.addClass('disabled');
        }
        else if (value > this.min && value < this.max) {
            this.minus.removeClass('disabled');
            this.plus.removeClass('disabled');
        }
        else {
            this.plus.addClass('disabled');
        }
    },
    
    /**
     * 设置组件的值
     * @function setValue
     * @memberOf Number
     * @param {Number} value   需要设置的组件的值
     * @param {Boolean} checked 是否校验过该值是否合法，默认为false
     */
    setValue: function (value, checked) {
        if (checkValue(value, this.min, this.max)) {
            if (this.inputText.val() !== '') {
                this.prevValue = this.inputText.val();
            }
            this.inputText.val(value);
        }
        else {
            throw new Error('value is not valid, must be number and must between max and min');
        }
        
        
    
    },

    /**
     * 获取组件的当前值
     * @function getValue
     * @memberOf Number
     * @return {String} 组件当前值
     */
    getValue: function () {
        return this.inputText.val();

    },
    
    /**
     * 解析模板
     * @function parseTemplate
     * @memberOf Number
     * @private
     * @param  {String} tpl 模板字符串
     * @return {String}     解析过的模板字符串
     */
    parseTemplate: function (tpl) {
        
        
        return Template(tpl || NumbersTpl, {
            uiClass: this.getClassName()
        });    
        
        
    },
    
    /**
     * 处理组件数据
     * @function init
     * @memberOf Number
     * @private
     */
    
    init: function () {
        // debugger
        var max = this.get('max');
        var min = this.get('min');
        this.disable = !!this.get('disable');
        
        var value = this.get('value');
        if (!checkValue(value)) {
            throw new Error('value is not valid , must be number');
        }
        else if (!checkValue(min)) {
            throw new Error('min is not valid , must be number');
        }
        else if (!checkValue(max)) {
            throw new Error('max is not valid , must be number');
        }
        else {
            value = parseInt(value, 10);
            max = parseInt(max, 10);
            min = parseInt(min, 10);
        }
        this.value = this.prevValue = value;
        this.min = min;
        this.max = max;
        this.step = parseInt(this.get('step') || 1, 10);
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Number
     */
    render: function () {
        tmp['Number'].superClass.render.call(this);

        this.initProp();

        this.initUi();
        
        this.setValue(this.value);
    },

    /**
     * 处理组件样式
     * @function initUi
     * @memberOf Number
     * @private
     */
    initUi: function () {
        
        if (this.disable) {
            this.inputText.attr('disabled', 'disabled');
            this.minus.addClass('disabled');
            this.plus.addClass('disabled');
        }
        else {
            this.inputText.attr('disabled');   
            this.minus.removeClass('disabled');
            this.plus.removeClass('disabled');
        }

        //根据min value max来设置加减号的样式
        if (this.value <= this.min) {
            this.minus.addClass('disabled');
        }
        
        if (this.value >= this.max) {
            this.plus.addClass('disabled');
        }
    },


    /**
     * 处理组件的和ui相关的属性
     * @function initProp
     * @memberOf Number
     * @private
     */
    initProp: function () {
        
        this.minus = this.widgetEl.find('[data-role=minus]');
        this.plus = this.widgetEl.find('[data-role=plus]');
        this.inputText = this.widgetEl.find('input');
    }
});
var NUMBER_REG = /^-?\d+$/;
function checkValue(value, range) {
    if (range && range.length) {
        return (NUMBER_REG.test(value) && value >= range[0] && value <= range[1]);
    } 
    else {
        return NUMBER_REG.test(value);
    }
}

module.exports = tmp['Number'];
