/**
 * select选择组件，带弹出层
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class PopSelect
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/popselect/index.html
 */

var Widget = require('../../../core/1.0.0/index.js');
var Select = require('../../../select/1.0.0/index.js');
var Dialog = require('../../../dialog/1.0.0/index.js');
var PopSelectTpl = require('./popselect.string');

var $ = require('../../../util/1.0.0/index.js');

var PopSelect = Widget.extend({
    /**
     * @property {String | HTMLElement} title 弹出层的标题
     * @property {String} okText 弹出层右侧确定按钮的文案，默认为确定
     * @property {String} cancelText 弹出层左侧按钮的文案，默认为取消
     * @property {Number} displayCount 显示多少行，默认为5。修改此属性时，需要配合修改样式
     * @property {Array} datasource select的数据源，数组类型，每个数组项为object
     * @property {Object} value 当前组件的值
     * @property {Boolean} effect 弹出层弹出时是否启用动画效果，默认为true
     * @memberOf PopSelect
     */
    
    /**
     * @event {function} ok 点击右侧确定按钮触发的事件
     * @event {function} cancel 点击左侧按钮触发的事件
     * @event {function} changevalue 改变值时触发的事件
     * @memberOf PopSelect
     */
    options: {
        type: 'popselect',
        title: '',
        okText: '确定',
        cancelText: '取消',
        /**
         * 点击右侧确定按钮触发的事件
         * @event ok
         * @memberOf PopSelect
         */
        onok: function () {},
        /**
         * 点击左侧按钮触发的事件
         * @event cancel
         * @memberOf PopSelect
         */
        oncancel: function () {},
       
        /**
         * 改变值时触发的事件
         * @event changevalue
         * @memberOf PopSelect
         * @param  {String} key       滚动列的索引key
         * @param  {Object} value     当前组件对应索引key的值
         * @param  {Object} prevValue 组件对应索引key之前的值
         */
        onchangevalue: function (key, value, prevValue) {},
        template: PopSelectTpl,
        datasource: [],
        displayCount: 5,
        value: null,
        effect: true,
        infinite: true
    },
    /**
     * 处理组件数据
     * @function init
     * @memberOf PopSelect
     * @private
     */
    init: function () {
        var duration = this.get('duration');
        duration = parseInt(duration, 10);

        if (duration.toString() === 'NaN') {
            duration = 1;
        }
        this.duration = duration;
        this.effect = this.get('effect');
    },

    /**
     * 将组件渲染到document中，也可以使用show方法
     * @function render
     * @memberOf PopSelect
     */
    render: function () {
        
        this._initProp();
        this._getElement();
        this._initUi();
        this.renderEvent();
        this._isRender = true;
        this.resize();
    },

    /**
     * 处理组件内部的事件
     * @function renderEvent
     * @private
     * @memberOf PopSelect
     */
    renderEvent: function () {
        var widget = this;
        var _hide = function () {
            if (!widget._isShow) {
                
                widget._widgetMap.dialog.hide();
                widget.widgetEl.hide();
                widget._isInTransitioned = false;
            }
            
        };
        widget._hide = _hide;

        widget.widgetEl.on('transitionend', _hide);
        widget.widgetEl.on('webkitTransitionEnd', _hide);
    },
    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf PopSelect
     */
    resize: function () {
        
        this._widgetMap['dialog'].resize();
        this._widgetMap['select'].resize();
    },
    /**
     * 隐藏组件
     * @function hide
     * @memberOf PopSelect
     */
    hide: function () {
        
        var widget = this;

        if (widget.effect) {
            var widget = this;

            if (widget._isInTransitioned) {
                return;
            }
            widget._isInTransitioned = true;//表示在动画中


            var clientHeight = document.documentElement.clientHeight;
            widget.widgetEl.css({
                    
                'top': clientHeight
            });
            widget._isShow = false;
            
            
            
        }
        else {
            this.widgetEl.css('display', 'none');
            widget._isShow = false;
        }
    },
    /**
     * 显示组件
     * @function show
     * @memberOf PopSelect
     */
    show: function () {

        if (this._isShow) {
            return;
        }
        if (this.isDestroy) {
            console.error('widget is destroyed!');
            return;
        }

        //【TODO】处理在effect中
        //
        if (!this._isRender) {
            
            this.render();
            this._isRender = true;
        }
        else {
            
            this._widgetMap['dialog'].show();
            this._isShow = true;
        }
        
        
    },
    /**
     * 为组件的根节点添加样式命名空间
     * @function _getElement
     * @memberOf PopSelect
     * @private
     */
    _getElement: function () {

        this.widgetEl.addClass(this.getClassName());
    },

    /**
     * 处理组件的数据和ui显示
     * @function _initProp
     * @memberOf PopSelect
     * @private
     */
    _initProp: function () {

        this.title = this.get('title');
        this.okText = this.get('okText');
        this.cancelText = this.get('cancelText');
        
        
        this.datasource = this.get('datasource');
    },

    /**
     * 设置select的值
     * @function setValue
     * @memberOf PopSelect
     * @param {String} key   select列的索引
     * @param {Number | String} value 需要设置的值
     */
    setValue: function (key, value) {
        this._widgetMap['select'].setValue(key, value);
    },

    setDataSource: function (key, ds) {
        this._widgetMap['select'].setDataSource(key, ds);
    },

    /**
     * 获取当前列的值
     * @function getValue
     * @memberOf PopSelect
     * @return {Object}    该列对应的当前值
     */
    getValue: function () {
        return this._widgetMap['select'].getValue();
    },

    /**
     * 设置组件的样式，初始化内部组件
     * @function _initUi
     * @memberOf PopSelect
     */
    _initUi: function () {

        var widget = this;
        var screenHeight = window.screen.availHeight;
        var clientHeight = document.documentElement.clientHeight;
        console.log(screenHeight + "|" + clientHeight + '|' + window.innerHeight);
        var header = null;
        if (this.title || this.okText || this.cancelText) {
            header = {};
            // debugger
            if (this.okText) {
                header.okBtn = {};
                header.okBtn.text = this.okText;
            }

            if (this.cancelText) {
                header.cancelBtn = {};
                header.cancelBtn.text = this.cancelText;
            }
            
            this.title && (header['title'] = this.title);
        }

        // debugger
        var dialog = this._widgetMap['dialog'] = new Dialog({
            header: header,
            content: ' ',
            template: this.get('template'),
            onok: function () {
                widget.trigger('ok', function () {
                    widget.hide();
                });
                return false;
            },
            oncancel: function () {
                widget.trigger('cancel', function () {
                    widget.hide();
                });
                return false;
            },
            align: widget.get('align') || 'bottom'
        });
        this.widgetEl = dialog.widgetEl;
        this.widgetEl.addClass(this.getClassName());

        if (this.effect) {
            this.widgetEl.css({
                // 'opacity': 0,
                'transition': 'all ' + this.duration + 's',
                '-webkit-transition': 'all ' + this.duration + 's'
                // 'transform': 'translateY(100%)'
            });
        }
        this.widgetEl.css({
            top: clientHeight
            // visibility: 'hidden'
        });
        /**
         * 为了select渲染， 必须先出现dialog
         * 
         */
        // debugger
        dialog.show();
        

        var contentWrap = dialog.getContent();
        var select = this._widgetMap['select'] = new Select({
            container: contentWrap,
            datasource: widget.datasource,
            displayCount: widget.get('displayCount') || 5,
            value: widget.get('value') || null,
            infinite: !!widget.get('infinite'),
            onchangevalue: function (key, value, prevValue) {
                widget.trigger('changevalue', key, value, prevValue);
            }
        });
        select.render();
        widget._isShow = true;
        // this.widgetEl.hide();

        

    },
    /**
     * 销毁组件，对父类的destroy进行覆盖，如果当前动画在执行中，那么等待动画结束后再销毁
     * @function destroy
     * @memberOf PopSelect
     */
    destroy: function () {
        //如果在动画中那么等待一段时间
        var widget = this;

        if (this._isInTransitioned) {
            setTimeout(function () {
                widget.widgetEl.off('transitionend', widget._hide);
            
                widget.destroy.call(widget);
            }, this.duration * 1000  / 3);
        }
        else {
            
            PopSelect.superClass.destroy.call(this);
        }
    }
});

module.exports = PopSelect;