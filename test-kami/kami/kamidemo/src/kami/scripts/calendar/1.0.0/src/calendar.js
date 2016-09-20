
/**
 * 日历选择组件，不带弹出层，如果需要弹出层请参考popcalendar
 * 
 * @author  sharon.li <xuan.li@qunar.com>
 * @class Calendar
 * @constructor
 * @extends Widget
 * @category primary
 * @demo http://ued.qunar.com/mobile/kami/demos/src/html/calendar/index.html
 */

/**
 * datasource like
 * [
 *     {vale: value, text:text}
 * ]
 */

//depandance Select
//
var Select = require('../../../select/1.0.0/index.js');
var Widget = require('../../../core/1.0.0/index.js');
var $ = require('../../../util/1.0.0/index.js');
var CalendarTpl = require('./calendar.string');
var MONTH = {
    TWO: 1
};

var Calendar = Widget.extend({

    /**
     * @property {Number} displayCount 显示多少行，默认为5，修改此属性时，需要配合修改样式
     * @property {Array} dateRange 日期范围，如[2014-11-01,2015-12-31]
     * @property {String | Numer | Date} now 日历组件的当前时间
     * @memberOf Calendar
     */
    
    
    options: {
        type: 'calendar',
        displayCount: 5,
        template: CalendarTpl,
        dateRange: [],//两个日期[2014-11-01,2015-12-31]
        now: null,
        infinite: false//默认使用不循环的
    },
    
    /**
     * 处理组件数据
     * @function init
     * @memberOf Calendar
     * @private
     */
    init: function () {
        

        
        this.datasource = [
            {
                key: 'year',
                tag: '年',
                datasource: []
            },
            {
                key: 'month',
                tag: '月',
                datasource: [
                    
                ]

            },
            {
                key: 'date',
                tag: '日',
                datasource: [
                    
                ]

            }
        ];

        var now = this.get('now') || new Date();
        now = parseDate(now);
        this.now = new Date(now.getTime());

        this.dateRange = this.get('dateRange') || [];
        
        if (this.dateRange.length <= 0) {
            this.dateRange.push(new Date(now.getTime()));
            
            var future = new Date(now.setFullYear(now.getFullYear() + 10));
            this.dateRange.push(future);
        }
        if (typeof this.dateRange[0] == 'string' 
            || typeof this.dateRange[0] == 'number') {
            for (var i = 0;i < this.dateRange.length; i++) {
                this.dateRange[i] = parseDate(this.dateRange[i]);
            }
        }
        // this.now = this.get('now');
        if (!this.now || $.isEmptyObject(this.now)) {
            this.now = new Date();
        }
        if (typeof this.now == 'string') {
            this.now = parseDate(this.now);
        }
        if (this.now < this.dateRange[0] || this.now > this.dateRange[1]) {
            alert('now is not valid, now is must between dateRange');
            return;
        }

        var value = {
            year: this.now.getFullYear(),
            month: this.now.getMonth(),
            date: this.now.getDate()
        };
        
        this.datasource[0].datasource = _getYearDs(this.dateRange);
        this.datasource[1].datasource = _getMonthDs(this.dateRange, this.now, this.now.getFullYear());
        this.datasource[2].datasource = _getDateDs(this.dateRange, this.now, this.now.getFullYear(), this.now.getMonth());
        this.selectValue = value;
        // this.set('value', value);
    },

    /**
     * 获取组件的值
     * @function getValue
     * @memberOf Calendar
     * @return {Object} 返回组件当前的值
     */
    getValue: function () {
        return this.innerSelect.getValue();
    },


    /**
     * 将组件渲染到document中
     * @function render
     * @memberOf Calendar
     */
    render: function () {
        
        this._initUi();
        this.innerSelect.render();
    },
    /**
     * 渲染内部的select组件
     * @function _initUi
     * @memberOf Calendar
     * @private
     */
    _initUi: function () {
        var widget = this;
        this.innerSelect = this._widgetMap['select'] = new Select({
            template: widget.get('template'),
            displayCount: widget.get('displayCount'),
            datasource: widget.datasource,
            infinite: !!widget.get('infinite'),
            value: widget.selectValue,
            container: widget.get('container'),
            showline: true,//是否显示参考线
            onchangevalue: function (key, curItem, prevItem) {
                widget._changeValue(key, curItem, prevItem);
            }
        });
        
        this.widgetEl = this.innerSelect.widgetEl;
        this.widgetEl.addClass(this.getClassName());
    },
    /**
     * 设置组件的当前时间，时间需要在dateRange范围内
     * @function setNow
     * @param {String | Number | Date} now 要设置的组件时间
     * @memberOf Calendar
     */
    setNow: function (now) {
        
        
        var _now = parseDate(now);
        
        if (_now <= this.dateRange[1] && _now >= this.dateRange[0]) {
            var year = _now.getFullYear();
            var month = _now.getMonth();
            var date = _now.getDate();

            this.innerSelect.setValue(Calendar.YEAR, year);
            this.innerSelect.setValue(Calendar.MONTH, month);
            this.innerSelect.setValue(Calendar.DAY, date);
        }
        else {
            throw new Error('the now time parsed is not valid');
        }
    },
    /**
     * 获取组件当前时间
     * @return {Date} 返回当前calendar对应的时间
     * @function getNow
     * @memberOf Calendar
     */
    getNow: function () {
        var valueObj = this.getValue();
        var now = [];
        now.push(valueObj.year.value);
        now.push(1 + valueObj.month.value);
        now.push(valueObj.date.value);
        return Date.parse(now.join('-'));
    },
    /**
     * 内部组件select值改变时触发的回调
     * @function _changeValue
     * @memberOf Calendar
     * @private
     * @param  {String} key      calendar列的索引
     * @param  {Object} curItem  当前被选中的项
     * @param  {Object} prevItem 之前被选中的项
     */
    _changeValue: function (key, curItem, prevItem) {
        // console.log('chagnevalue');
        // debugger
        if (key === 'year') {
            var year = curItem.value;
            var prevYear = prevItem.value;
            var month = this.innerSelect.getValue('month').month.value;

            
            var ds = _getMonthDs(this.dateRange, this.now, year);
            this.innerSelect.setDataSource('month', ds);


            month = this.innerSelect.getValue('month').month.value;
            ds = _getDateDs(this.dateRange, this.now, year, month);
            this.innerSelect.setDataSource('date', ds);
            
            
        }
        else if (key === 'month') {

            var year = this.innerSelect.getValue('year').year.value;
            var month = curItem.value;
            
            var ds = _getDateDs(this.dateRange, this.now, year, month);
            this.innerSelect.setDataSource('date', ds);
        }
        else {
            // return
        }
        // console.log(this.getValue());
    }
});

/**
 * 常量key
 * 
 * @type {String}
 */
Calendar.YEAR = 'year';
Calendar.MONTH = 'month';
Calendar.DAY = 'date';


function parseDate(str) {
    try {
        if (typeof str == 'string') {
            return new Date(Date.parse(str));    
        }
        else if (typeof str == 'number') {
            return new Date(str);
        }
        else {
            return str;
        }
        
    }
    catch (e) {
        throw new Error((e.msg || '') + 'date formate is not support now!!');
    }
}
function _getYearDs(dateRange) {
    var result = [];
    var beginYear = dateRange[0].getFullYear();
    var endYear = dateRange[1].getFullYear();
    for (var i = beginYear; i <= endYear; i++) {
        result.push({
            text: i,
            value: i
        });
    }
    return result;

}

function _getMonthDs(dateRange,curDate, year) {
    // debugger
    
    var result = [];
    var beginYear = dateRange[0].getFullYear();
    var endYear = dateRange[1].getFullYear();
    var beginMonth = null;
    var endMonth = null;
    // debugger

    if (year < beginYear) {
        beginMonth = dateRange[0].getMonth();
        endMonth = 11;
    }
    else if (year >= beginYear && year <= endYear) {
        if (year == beginYear) {
            if (year == endYear) {
                beginMonth = dateRange[0].getMonth();
                endMonth = dateRange[1].getMonth();
            }
            else {
                beginMonth = dateRange[0].getMonth();
                endMonth = 11;   
            }
        }
        else if (year > beginYear) {
            if (year == endYear) {
                beginMonth = 0;
                endMonth = dateRange[1].getMonth();
            }
            else {
                beginMonth = 0;
                endMonth = 11;
            }
        }
        else {
            beginMonth = 0;
            endMonth = 11;
        }
    }
    else {
        beginMonth = 0;
        endMonth = dateRange[1].getMonth();
    }
    for(var i = beginMonth; i <= endMonth; i++) {
        result.push({
            text: i+1,
            value: i
        });
    }
    return result;
}
function _getDateDs(dateRange, curDate, year, month) {
    // debugger
    
    var result = [];
    var beginDate = null;
    var endDate = null;

    var beginYear = dateRange[0].getFullYear();
    var endYear = dateRange[1].getFullYear();

    var beginMonth = dateRange[0].getMonth();
    var endMonth = dateRange[1].getMonth();

    var days = _getDays(month, year);

    
    
    // debugger
    if (curDate < dateRange[0]) {
        beginDate = dateRange[0].getDate();
        endDate = days;
    }
    else if (curDate >= dateRange[0] && curDate <= dateRange[1]) {
        if (year == beginYear && month == beginMonth) {
            
            if( year == endYear && month == endMonth) {
                
                beginDate = dateRange[0].getDate();
                endDate = dateRange[1].getDate();
                
            }
            else {//< endYear
                beginDate = dateRange[0].getDate();
                endDate = days;  
            }
            
            
        }
        else if (year == beginYear && month > beginMonth) {
            if (year == endYear && month == endMonth) {
                beginDate = 1;
                endDate = dateRange[1].getDate();
            }
            else {
                beginDate = 1;
                endDate = days;
            }
        }
        else if (year > beginYear && year < endYear) {
            beginDate = 1;
            endDate = days;
        }
        else if (year == endYear && month < endMonth) {
            beginDate = 1;
            endDate = days;
        }
        else if (year == endYear && month == endMonth){
            beginDate = 1;
            endDate = dateRange[1].getDate();
        }
    }
    else {
        beginDate = 1;
        endDate = dateRange[1].getDate();
    }
    for(var i = beginDate; i <= endDate; i++) {
        result.push({
            text: i,
            value: i
        });
    }
    return result;
}
function _getDays(month, year) {

    var now = new Date();
    month = month == null ? (now.getMonth()) : month;
    year = year == null ? (now.getFullYear()) : year;
    switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
        return 31;
    case 1: 
        if ((year % 4) === 0) {
            return 29;
        }
        else {
            return 28;
        }
        break;
    default:
        return 30;

    }
}
module.exports = Calendar;
