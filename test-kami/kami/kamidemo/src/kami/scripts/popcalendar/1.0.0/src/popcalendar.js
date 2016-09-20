/**
 * 日历选择组件，带弹出层
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class PopCalendar
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/popcalendar/index.html
 */

var Widget = require('../../../core/1.0.0/index.js');
var Calendar = require('../../../calendar/1.0.0/index.js');
var Dialog = require('../../../dialog/1.0.0/index.js');
var PopCalendarTpl = require('./popcalendar.string');

var $ = require('../../../util/1.0.0/index.js');

var PopCalendar = Widget.extend({

    /**
     * @property {String | HTMLElement} title 弹出层的标题
     * @property {String} okText 弹出层右侧确定按钮的文案，默认为确定
     * @property {String} cancelText 弹出层左侧按钮的文案，默认为取消
     * @property {Number} displayCount 显示多少行，默认为5。修改此属性时，需要配合修改样式
     * @property {Array} dateRange 日期范围，如：[2014-11-01,2015-12-31]
     * @property {String | Numer | Date} now 日历组件的当前时间
     * @property {Boolean} effect 弹出层弹出时是否启用动画效果，默认为true
     * @memberOf PopCalendar
     */
    
   
    options: {
        type: 'popcalendar',
        title: '',
        okText: '确定',
        cancelText: '取消',
        /**
         * 点击右侧确定按钮触发的事件
         * @event ok
         * @memberOf PopCalendar
         */
        onok: function () {},
        /**
         * 点击左侧按钮触发的事件
         * @event cancel
         * @memberOf PopCalendar
         */
        oncancel: function () {},
        template: PopCalendarTpl,
        dateRange: [],
        now: null,
        displayCount: 5,
        value: {},
        effect: true
    },
    

    /**
     * 处理组件数据
     * @function init
     * @memberOf PopCalendar
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
     * @memberOf PopCalendar
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
     * @memberOf PopCalendar
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
     * 隐藏组件
     * @function hide
     * @memberOf PopCalendar
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
            
            widget._widgetMap['dialog'].hide();
            widget.widgetEl.hide();
            widget._isShow = false;
            // this.widgetEl.css('display', 'none');    
        }
    },
    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf PopCalendar
     */
    resize: function () {
        
        this._widgetMap['dialog'].resize();
        this._widgetMap['calendar'].resize();
    },
    /**
     * 显示组件
     * @function show
     * @memberOf PopCalendar
     */
    show: function () {
        //已经show的组件不需要再次show
        if (this._isShow) {
            return;
        }
        if (this.isDestroy) {
            console.error('widget is destroyed!');
            return;
        }
        this._isShow = true;
        //【TODO】处理在effect中
        //
        if (!this._isRender) {
            this.render(); 
            this._isRender = true;
            
        }
        else {
            this._widgetMap['dialog'].show();
            
        }
        
    },
    /**
     * 为组件的根节点添加样式命名空间
     * @function _getElement
     * @memberOf PopCalendar
     * @private
     */
    _getElement: function () {

        this.widgetEl.addClass(this.getClassName());
    },

    /**
     * 处理组件的数据和ui显示
     * @function _initProp
     * @memberOf PopCalendar
     * @private
     */
    _initProp: function () {

        this.title = this.get('title');
        this.okText = this.get('okText');
        this.cancelText = this.get('cancelText');

        
        
        this.datasource = this.get('datasource');
    },


    /**
     * 设置组件的当前时间，时间需要在dateRange范围内
     * @function setNow
     * @param {String | Number | Date} now 要设置的组件时间
     * @memberOf PopCalendar
     */
    setNow: function (now) {
        this._widgetMap['calendar'].setNow(now);
    },


    /**
     * 获取组件当前时间
     * @return {Date} 返回当前calendar对应的时间
     * @function getNow
     * @memberOf PopCalendar
     */
    getNow: function () {
        var value = this._widgetMap['calendar'].getValue();
        var now = new Date();
        now.setFullYear(value.year.value);
        now.setMonth(value.month.value);
        now.setDate(value.date.value);
        return now;
    },
    /**
     * 获取组件的值
     * @function getValue
     * @memberOf PopCalendar
     * @return {Object} 返回组件当前的值
     */
    getValue: function () {
        return this._widgetMap['calendar'].getValue();
    },
    /**
     * 销毁组件，对父类的destroy进行覆盖，如果当前动画在执行中，那么等待动画结束后再销毁
     * @function destroy
     * @memberOf PopCalendar
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
            
            PopCalendar.superClass.destroy.call(this);
        }

    },
    /**
     * 设置组件的样式，初始化内部组件
     * @function _initUi
     * @memberOf PopCalendar
     */
    _initUi: function () {
        var widget = this;


        
        var clientHeight = document.documentElement.clientHeight;

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
                // 'transform': 'translateY(100)'
            });
        }

        this.widgetEl.css({
            'top': clientHeight
        });
        /**
         * 为了select渲染， 必须先出现dialog
         * 
         */
        dialog.show();
        

        var contentWrap = dialog.getContent();
        var calendar = this._widgetMap['calendar'] = new Calendar({
            container: contentWrap,
            displayCount: widget.get('displayCount') || 5,
            value: widget.get('value') || {},
            dateRange: widget.get('dateRange'),
            now: widget.get('now'),
            onchangevalue: function (key, value, prevValue) {
                widget.trigger('changevalue', key, value, prevValue);
            }
        });
        calendar.render();
        widget._isShow = true;
        // this.widgetEl.hide();

        

        

    }
});

module.exports = PopCalendar;
