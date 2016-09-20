/**
 * 
 * 整页的日历选择组件
 * @author zhongjie.wang<zhongjie.wang@qunar.com>
 * @class DatePicker
 * @constructor
 * @extends Widget
 * @category business
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/datepicker/index.html
 */





var $ = require('../../../util/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var Panel = require('../../../panel/1.0.0/index.js');
var Template = require('../../../template/1.0.0/index.js');

var QunarDate = require('./qunardate.js');
var DatepickerModel = require('./datepickermodel.js');

var ListTpl = require('./tpl/datepickerlist.string');
var ItemTpl = require('./tpl/datepickerlist-item.string');
var PanelTpl = require('./tpl/datepickerlist-panel.string');
var StickyTpl = require('./tpl/sticky.string');

var DatePicker = Widget.extend({
    /**
     * @property {String} today 今天的值，默认值为空
     * @property {Number} offsetCheckIn 入住时间相差的天数
     * @property {Number} offsetBegin 距离开始入店可选择的区间，默认90
     * @property {String} beginDate 开始选择的日期，默认为空
     * @property {String} endDate 结束选择的日期，默认为空
     * @property {String} checkIn 默认的入住日期
     * @property {String} checkOut 默认退房日期
     * @property {String} gapClass 选择区间日期样式，默认为gap
     * @memberOf DatePicker
     */

    /**
     * @template template
     * datepicker默认模板，用户自定义模板时data-role属性必须存在，
     * data-role="weeks"表示当前是周的列表
     * @memberOf DatePicker
     * @path ./tpl/datepickerlist.string
     */
    

    options: {
        type: 'datepicker',
        today: QunarDate.format(QunarDate.today()),
        template: ListTpl,
        // 入住时间相差的天数
        offsetCheckIn: 1,
        // 距离开始入店可选择的区间
        offsetBegin: 90,
        // 开始选择的日期
        beginDate: '',
        // 结束选择的日期
        endDate: '',
        // 默认checkin的日期
        checkIn: '',
        // 默认checkout的日期
        checkOut: '',
        // 选择区间日期样式
        gapClass: 'gap',
        /**
         * 渲染完成后触发
         * @event ready
         * @memberOf DatePicker
         */
        onready: function () {},
        /**
         * 选择成功后触发
         * @event checked
         * @param  {String} checkIn  选择的入住日期
         * @param  {String} checkOut 选择的离店日期
         * @param  {Numer} dateGap  两个日期的间隔
         * @memberOf DatePicker
         */
        onchecked: function (checkIn, checkOut, dateGap) {}
    },

    /**
     * 处理组件数据
     * @function init
     * @memberOf DatePicker
     * @private
     */
    init: function() {
        this.config = {
            isChooseCheckIn: false,
            isChooseCheckOut: false
        };
        // 数据相关
        this._getBeginAndEndDate();
        this._getCheckDate();
        this._getData();

        // 磁铁属性相关
        this.initProp();
    },

    // 
    /**
     * 初始化组件的私有参数
     * @function initProp
     * @memberOf DatePicker
     * @private
     */
    initProp: function() {

        // 列表分组标题
        this._letters = []; // 所有列表分组标题
        this._titleNodes = null; // 分组元素的DOM集合
        this._titleNodesTop = []; // 分组元素的offsetTop集合
        this._currIndex = 0; // 当前分组字母的索引
        this._nextLetterY = 0;
        this._lastLetterY = 0;
        this._length = 0;

        // 磁贴效果字母
        this._sticky = null; // 磁贴字母
        this._stickyHeight = 0; // 磁贴字母的高度，默认设置为分组字母的高度-1（为了默认显示border，移动起来没有border）
        this._stickyVisible = false; // 磁贴字母是否显示
        this._stickyTranslate = 0; // 磁贴字母translate

        // 索引列表
        this._indexListData = []; // 索引列表数据源
        this._lastIndex = -99;
    },

    /**
     * 获得根节点
     * @function _getMainElement
     * @memberOf DatePicker
     * @private
     */
    _getMainElement: function() {
        DatePicker.superClass._getMainElement.call(this);

        var panel = new Panel({
            container: this.widgetEl.find('[data-role="weeks"]'),
            template: PanelTpl
        });

        this.panel = panel;

        this._widgetMap['panel'] = panel;
    },

    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf DatePicker
     */
    render: function() {
        DatePicker.superClass.render.call(this);

        this.panel.render();
        this._renderContent();
        this._renderSticky();
        this._bindEvents();

        var checkIn = this.get('checkIn');
        var checkOut = this.get('checkOut');
        if(checkIn && checkOut){
            this._makeGap(checkIn, checkOut);
        }


        this.trigger('ready');

        return this;
    },

    // 
    /**
     * 根据数据渲染日历内容
     * @function _renderContent
     * @memberOf DatePicker
     */
    _renderContent: function() {
        var itemHtml = '',
            render = Template(ItemTpl);
        preData = this.config.datepickerData || [];

        itemHtml += render(preData);
        this._indexListData = preData.monthTitle || [];
        this._letters = this._indexListData;

        // 调用panel的渲染html
        this.panel.html(itemHtml);

        // 获取高度
        this._titleNodes = this.widgetEl.find('[data-role="title"]');

        var arr = this._titleNodesTop;
        this._titleNodes.each(function(index, node) {
            arr.push(node.offsetTop);
        });
        this._length = arr.length;
    },

    /**
     * 新增磁铁节点
     * @function _renderSticky
     * @memberOf DatePicker
     * @private
     */
    _renderSticky: function() {
        // 在列表顶部显示的字母
        this._sticky = $(Template(StickyTpl, {
            letter: this._indexListData[0]
        }));
        this.widgetEl.find('[data-role="weeks"]').append(this._sticky);
        if (this._length) {
            this._stickyHeight = this._titleNodes.first().height() - 1;
            this._hideSticky();


            this._switch();
        }
    },

    /**
     * 监听panel方法
     * @function _bindEvents
     * @memberOf DatePicker
     * @private
     */
    _bindEvents: function() {
        var self = this;
        this.panel.on('scroll', function(translateX, translateY, stopAnimate) {

            if (translateY >= 0) {
                self._stickyVisible && self._hideSticky();
                return;
            }

            var absY = Math.round(Math.abs(translateY));
            if (absY > self._titleNodesTop[0]) {
                !self._stickyVisible && self._showSticky();
                if (self._currIndex >= 0 && self._currIndex < self._length) {
                    self._changeSticky(absY, stopAnimate);
                }
            } else {
                self._hideSticky();
            }
        });

        this.panel.on('tap', function(e) {
            var target = $(e.target);
            var selector = '[data-role="dpl-item"]';

            var element = null;
            var parents = [];

            if (target.is(selector)) {
                element = target;
            } else if ((parents = target.parents(selector)).length > 0) {
                element = parents.first();
            }
            if (element && !element.is('.disabled')) {
                self._chooseDatepicker(element)
            }
        });
    },


    /**
     * 改变磁贴字母
     * @function _changeSticky
     * @memberOf DatePicker
     * @private
     */
    _changeSticky: function(currY, stopAnimate) {
        var orientation = this.panel.getOrientation();
        if (orientation == 'up') {
            this._up(currY, stopAnimate);
        } else if (orientation == 'down') {
            this._down(currY, stopAnimate);
        }
    },

    
    /**
     * 向上滑动时的处理函数
     * @function _up
     * @memberOf DatePicker
     * @private
     */
    _up: function(currY, stopAnimate) {
        var offsetY = this._lastLetterY - currY;
        if (offsetY >= 0) { // 达到可切换状态
            if (offsetY >= this._stickyHeight) { // 完成切换
                --this._currIndex;
                this._switch();
                this._setLetterY();
            } else { // 切换中
                var letterIndex = this._currIndex - 1 < 0 ? 0 : this._currIndex - 1;
                var currLetter = this._letters[letterIndex];
                if (this._sticky[0].innerText != currLetter) {
                    this._sticky[0].innerText = currLetter;
                }
                this._setLetterY(-this._stickyHeight + offsetY);
            }
        } else {
            // 向上滑动，发生在磁贴字母切换到下一个还未完成时
            if (this._stickyTranslate) {
                offsetY = this._nextLetterY - currY > 0 ? 0 : this._nextLetterY - currY;
                this._setLetterY(offsetY);
            } else if (stopAnimate) {
                if (this._letters[this._currIndex] != this._sticky.text()) {
                    this._sticky.text(this._letters[this._currIndex]);
                }
            }
        }
    },

    /**
     * 向下滑动时的处理函数
     * @function _down
     * @memberOf DatePicker
     * @private
     */
    _down: function(currY, stopAnimate) {
        var offsetY = currY - this._nextLetterY;
        if (offsetY >= 0) { // 达到可切换状态
            if (offsetY >= this._stickyHeight) { // 完成切换
                ++this._currIndex;
                this._switch();
                this._setLetterY();
            } else { // 切换中
                this._setLetterY(offsetY === 0 ? 0 : -offsetY);
            }
        } else {
            // 向下滑动，发生在磁贴字母切换到上一个还未完成时
            if (this._stickyTranslate) {
                offsetY = this._lastLetterY - currY;
                if (offsetY <= 0) {
                    this._setLetterY(0);
                    this._switch();
                } else {
                    this._setLetterY(offsetY - this._stickyHeight);
                }
            } else if (stopAnimate) {
                if (this._letters[this._currIndex] != this._sticky.text()) {
                    this._sticky.text(this._letters[this._currIndex]);
                }
            }
        }
    },

    /**
     * 设置磁贴字母的translateY
     * @function _setLetterY
     * @memberOf DatePicker
     * @private
     */
    _setLetterY: function(y) {
        y = y || 0;
        this._sticky[0].style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0px)';
        this._sticky[0].style.transform = 'translate(0px, ' + y + 'px) translateZ(0px)';
        this._stickyTranslate = y;
    },

    /**
     * 根据当前字母的索引，切换该字母上下字母的top值
     * @function _switch
     * @memberOf DatePicker
     * @private
     */
    _switch: function() {
        if (this._currIndex >= 0 && this._currIndex < this._length) {
            this._lastLetterY = this._titleNodesTop[this._currIndex];
            this._sticky.text(this._letters[this._currIndex]);
            var nextNodeTop = this._titleNodesTop[this._currIndex + 1];
            this._nextLetterY = nextNodeTop ? nextNodeTop - this._stickyHeight : 999999999;
        }
    },

    /**
     * 显示磁贴字母
     * @function _showSticky
     * @memberOf DatePicker
     * @private
     */
    _showSticky: function() {
        this._sticky.show();
        this._setLetterY();
        this._stickyVisible = true;
    },


    /**
     * 隐藏磁贴字母
     * @function _hideSticky
     * @memberOf DatePicker
     * @private
     */
    _hideSticky: function() {
        this._sticky.hide();
        this._stickyVisible = false;
        this._lastIndex = -99;
    },

    // 以下方法，初始化数据相关
    
    /**
     * 生成展示开始时间和结束时间
     * @function _getBeginAndEndDate
     * @memberOf DatePicker
     * @private
     */
    _getBeginAndEndDate: function() {
        var today = this.get('today');
        // 可用的开始时间
        this.config['beginDate'] = this.get('beginDate');
        // 可用的结束时间
        this.config['endDate'] = this.get('endDate');
        // 如果开始时间没有写，默认开始时间为今天
        if (!this.config['beginDate']) {
            this.config['beginDate'] = today;
        }
        // 如果写了与开始时间最大的差值，则计算结束时间
        if (this.get('offsetBegin') && !this.config.endDate) {
            this.config['endDate'] = QunarDate.format(QunarDate.plus(QunarDate.parse(this.config['beginDate']), this.get('offsetBegin')));
        }
        // 如果没有计算到结束时间,则结束时间默认为月末
        if (!this.config.endDate) {
            this.config['endDate'] = QunarDate.format(QunarDate.getLastDaysOfMonth(QunarDate.parse(this.config['beginDate'])));
        }
        var _months = getDateNums(this.config.endDate)[1] - getDateNums(this.config.beginDate)[1] + 1;
        while (_months <= 0) {
            _months += 12;
        }
        this.config.Months = _months;
    },

    
    /**
     * 生成入住时间
     * @function _getCheckDate
     * @memberOf DatePicker
     * @private
     */
    _getCheckDate: function() {
        if (!this.get('checkIn')) {
            this.set('checkIn', this.get('beginDate'));
        }
        if (!this.get('checkOut')) {
            if (!this.get('offsetCheckIn')) {
                this.set('offsetCheckIn', 1);
            }
            this.set('checkOut', QunarDate.format(QunarDate.plus(QunarDate.parse(this.get('checkIn')), this.get('offsetCheckIn'))));
        }
        if (this.get('checkIn') && this.get('checkOut') && QunarDate.compareDate(QunarDate.parse(this.get('checkIn')), QunarDate.parse(this.get('checkOut'))) >= 0) {
            this.set('checkOut', QunarDate.format(QunarDate.plus(QunarDate.parse(this.get('checkIn')), 1)));
        }
    },

    
    /**
     * 生成日历渲染数据
     * @function _getData
     * @memberOf DatePicker
     * @private
     */
    _getData: function() {
        this.config.datepickerData = {
            monthTitle: [],
            data: []
        };
        var MonthsLen = this.config.Months,
            date = getDateNums(this.config.endDate);
        if (MonthsLen < 0) {
            return
        }
        for (var i = MonthsLen; i--;) {
            var month = date[1] - i,
                year = date[0];
            while (month <= 0) {
                year -= 1;
                month += 12;
            }
            var data = {
                    month: year + '年' + month + '月',
                    weeks: []
                },
                _date = QunarDate.format(new Date(year, month - 1));
            data.weeks = new DatepickerModel({
                dataType: 2,
                date: _date,
                today: this.get('today'),
                beginDate: this.config.beginDate,
                endDate: this.config.endDate,
                checkIn: this.get('checkIn'),
                checkOut: this.get('checkOut')
            });
            this.config.datepickerData.monthTitle.push(data.month);
            this.config.datepickerData.data.push(data);
        }
    },


    // 以下方法日期选择相关
  
    /**
     * 选择日历
     * @function _chooseDatepicker
     * @memberOf DatePicker
     * @private
     * @param  {HTMLElement} element 用户点击的节点
     */
    _chooseDatepicker: function(element) {
        var date = element.data('date');
        if (!this.config.isChooseCheckIn) {
            this._clearHighLight();
            this._checkHighLight('checkIn', element);
            this.config.isChooseCheckIn = date;
        } else {
            var diffDate = QunarDate.compareDate(QunarDate.parse(date), QunarDate.parse(this.config.isChooseCheckIn));
            if (diffDate < 0) {
                this._clearHighLight();
                this._checkHighLight('checkIn', element);
                this.config.isChooseCheckIn = date;
            } else if (diffDate > 0) {
                this._checkHighLight('checkOut', element);
                this.config.isChooseCheckOut = date;
            }
        }
        if (this.config.isChooseCheckIn && this.config.isChooseCheckOut) {
            // 获取间隔日期
            var checkIn = this.config.isChooseCheckIn;
            var checkOut = this.config.isChooseCheckOut;
            var less = QunarDate.less(checkIn, checkOut);
            
            this._makeGap(checkIn, checkOut);

            this.trigger('checked', checkIn, checkOut, less)
            this.config.isChooseCheckIn = false;
            this.config.isChooseCheckOut = false;
        }
    },

    /**
     * 生成间隔日期区间
     * @function _makeGap
     * @memberOf DatePicker
     * @private
     */
    _makeGap: function(checkIn, checkOut){
        // 获取间隔日期
        var less = QunarDate.less(checkIn, checkOut);
        var gap = [], i = 0;
        while(++i < less){
            gap.push( QunarDate.format( QunarDate.plus( QunarDate.parse(checkIn) , i) ) );
        }
        this._dateGap = gap;
        // 更新日期节点状态
        this._updateGap();
    },

    /**
     * 更新间隔日期节点状态
     * @function _updateGap
     * @memberOf DatePicker
     * @private
     */
    _updateGap: function(){
        var widgetEl = this.widgetEl;
        var gapClass = this.get('gapClass');
        $.each(this._dateGap, function(i, date){
            widgetEl.find('[data-date="'+date+'"]').addClass( gapClass );
        });
    },


    /**
     * 入住和离店时增加高亮
     * @function _checkHighLight
     * @memberOf DatePicker
     * @private
     * @param  {String} type 入住 or 离店
     * @param  {Object} dom  dom节点
     */
    _checkHighLight: function(type, dom) {
        var cn = type === 'checkIn' ? 'start' : 'end';
        dom.addClass(cn);
    },


    
    /**
     * 清除高亮入住和离店
     * @function _clearHighLight
     * @memberOf DatePicker
     * @private
     */
    _clearHighLight: function() {
        // 清空日期间隔样式
        var gapClass = this.get('gapClass');
        this.widgetEl.find('.' + gapClass).removeClass( gapClass );
        // 清空开始日期和结束日期样式
        this.widgetEl.find('.start, .end').removeClass('start end');
        // 清空日期间隔数据
        this._dateGap = [];
    },

    /**
     * 根据窗口大小重新调整组件位置和大小
     * @function resize
     * @memberOf DatePicker
     */
    resize: function() {
        this.panel.resize();
        DatePicker.superClass.resize.call(this);
    }
});

function getDateNums(dateStr) {
    var date = [];
    date.push(parseInt(dateStr.slice(0, 4), 10),
        parseInt(dateStr.slice(5, 7), 10),
        parseInt(dateStr.slice(8, 11), 10));
    return date;
}


module.exports = DatePicker;