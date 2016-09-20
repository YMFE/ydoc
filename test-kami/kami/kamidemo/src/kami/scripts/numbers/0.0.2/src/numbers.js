(function () {
    var Widget = require('../../../core/0.0.1/index.js');
    var NumbersTpl = require('./numbers.string');
    var Template = require('../../../template/0.0.1/index.js');

    var Numbers = Widget.extend({
        options: {
            type: 'number',
            max: 10000,
            min: -10000,
            value: 0,
            step: 1,
            disable: false,
            template: NumbersTpl,
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
        
        _minusTapHandler: function (e) {
            
            if (this.disable) {
                return;
            }
            var value = parseInt(this.getValue(), 10);
            var nextValue = value - this.step;
            if (nextValue >= this.min) {
                this.prevValue = value;//为了保存有效value
                this.setValue(nextValue);
                this.trigger('change:value', nextValue, this.prevValue);
            }
            
            this._setClass(nextValue, true);
        },
        _plusTapHandler: function (e) {
            
            if (this.disable) {
                return;
            }
            
            var value = parseInt(this.getValue(), 10);
            var nextValue = value + this.step;
            if (nextValue <= this.max) {
                this.prevValue = value;
                this.setValue(nextValue, true);
                this.trigger('change:value', nextValue, this.prevValue);    
            } 
            
            this._setClass(nextValue);
        },
        _getValidateValue: function(value) {
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
        _inputTextFocusHandler: function (e) {
            if (this.disable) {
                return;
            }
            this.prevValue = this.getValue();
        },
        _inputTextBlurHandler: function (e) {
            
            if (this.disable) {
                return;
            }
            
            var value = this.getValue();
            if (checkValue(value, [this.min, this.max])) {
                this.setValue(value, true);
                this._setClass(value);
                this.trigger('change:value', value, this.prevValue);
            }
            else {
                this.setValue(this.prevValue);
            }
            

            
        },
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
        getValue: function () {
            return this.inputText.val();

        },
        
        parseTemplate: function (tpl) {
            
            
            return Template(tpl || NumbersTpl, {
                uiClass: this.getClassName()
            });    
            
            
        },
        
        
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
        render: function () {
            Numbers.superClass.render.call(this);

            this.initProp();

            this.initUi();
            
            this.setValue(this.value);
        },
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

    module.exports = Numbers;
}());