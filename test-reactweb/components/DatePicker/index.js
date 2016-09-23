/*
 *  @providesModule DatePicker
 */

var React = require('react');
var View = require('View');
var NativeMethodsMixin = require('NativeMethodsMixin');
var MultiPicker = require('MultiPicker');
var PropTypes = React.PropTypes;
var range = require('lodash/range');


// 一天的毫秒数
const MS_PER_DAY = 1000 * 60 * 60 * 24;


const MODE = {
    time: 'time',
    date: 'date',
    datetime: 'datetime'
};
/**
 * DatePicker组件
 *
 * @component DatePicker
 * @example ./DatePicker.js
 * @version >=v1.3
 * @description  DatePicker 同 TimePicker, 为了和 rn 官方兼容,且和 qrn 兼容, TimePicker 只是 DatePicker 的一个 alias 。
 * DatePicker是一个时间选择器组件。这是一个受控组件，用户需要在 onDateChange 的回调中设置 date 属性
 * 才能修改 DatePicker 展示的时间, 否则 DatePicker 会在用户停止触摸后跳转至最初的 date 所对应的位置。
 *
 * ![DatePicker](./images/component/DatePicker.gif)
 *
 */

var DatePicker = React.createClass({
    mixins: [NativeMethodsMixin],
    propTypes: {
        ...View.propTypes,
        /**
         * @property date
         * @type Date
         * @description 一个 Date 对象的实例,用来指定 DatePicker 初始的时间
         */
        date: PropTypes.instanceOf(Date).isRequired,

        /**
         * @property onDateChange
         * @type function
         * @description 当用户改变了 DatePicker 的时间后调用, 调用时候带有唯一的参数
         * 该参数是一个 Date 对象,表示选择的时间
         */
        onDateChange: PropTypes.func.isRequired,

        /**
         * @property maximumDate
         * @type Date
         * @description 最大可选的时间
         */
        maximumDate: PropTypes.instanceOf(Date),

        /**
         * @property minimumDate
         * @type Date
         * @description 最小可选的时间
         */
        minimumDate: PropTypes.instanceOf(Date),

        /**
         * @property mode
         * @type string
         * @description DatePicker 的模式, 一个有三种模式可选:
         * - time : 仅展示一个时间选择器
         * - date : 仅展示一个日期选择器
         * - datetime : 展示一个同时具有日期和时间的选择器
         */
        mode: PropTypes.oneOf(['date', 'time', 'datetime']),

        /**
         * @property minuteInterval
         * @type number
         * @description 用来描述分钟的间隔, 可取的值为 `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`
         */
        minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),

        /**
         * @property timeZoneOffsetInMinutes
         * @type number
         * @description 默认情况下 DatePicker 使用设备本地的时区, 如果提供了这个参数,就可以强制使用另外一个时区
         * 比如要使用美国纽约的时区, 北京是比纽约快12个小时的, 所以你可以传入 -12 * 60
         */
        timeZoneOffsetInMinutes: PropTypes.number,
    },
    getDefaultProps: function() {
        return {
            mode: 'datetime',
            minuteInterval: 1,
        };
    },
    getInitialState: function() {
        this.onChange = this.onChange.bind(this);
        return {};
    },
    componentWillMount: function(){
        let date = this.props.date;
        if (this.props.timeZoneOffsetInMinutes){
            date = new Date(date.valueOf() + this.props.timeZoneOffsetInMinutes * 60 * 1000);
        }
        this.setState(this.getState(this.props, date));
    },
    componentWillReceiveProps: function(props){
        // 更新 state
        let date = props.date;
        this.setState(this.getState(props, date));
    },
    onChange: function(selectedValues) {
        // 得到当前选择的时间
        var date = this.getNewDate(selectedValues);
        // 通过当前选择的时间来获得新的 state
        this.setState(this.getState(this.props, date));
        if (this.props.onDateChange) {
            this.props.onDateChange(date);
        }
    },
    getNewDate: function(selectedValues){
        // 根据 selectedValues 和 mode 来得到一个当前选择的时间
        let mode = this.props.mode,
            date = new Date(this.state.date);
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes();

        if (mode === MODE.date || mode === MODE.datetime){
            year = selectedValues[0];
            month = selectedValues[1];
            day = selectedValues[2];
        }
        if (mode === MODE.time){
            hour = selectedValues[0];
            minute = selectedValues[1];
        }
        if (mode === MODE.datetime){
            hour = selectedValues[3];
            minute = selectedValues[4];
        }
        // 得到当月的天数, 用于调整 date 的 日期值
        let dayCount = (new Date(year, month + 1, 1) - new Date(year, month, 1)) / MS_PER_DAY;
        // 调整 day ,防止 day 的值大于当月最大日期
        if (day > dayCount){
            day = dayCount;
        }
        return new Date(year, month, day, hour, minute);
    },
    getState: function(props, date) {
        let minDate = props.minimumDate || new Date(1970, 0, 1),
            maxDate = props.maximumDate || new Date(2049, 11, 31),
            minuteInterval = props.minuteInterval || 5,
            mode = props.mode;

        if (date > maxDate){
            date = maxDate;
        }
        if (date < minDate){
            date = minDate;
        }

        // 处理上下边界问题, 当处于上下边界的时候, 要考虑可以展现的日期
        // start , end, now 分别记录了 minimumDate, maximumDate 和 当前选择的 date 的信息
        let start = {
                year: minDate.getFullYear(),
                month: minDate.getMonth(),
                day: minDate.getDate(),
                hour: minDate.getHours(),
                minute: minDate.getMinutes()
            },
            end = {
                year: maxDate.getFullYear(),
                month: maxDate.getMonth(),
                day: maxDate.getDate(),
                hour: maxDate.getHours(),
                minute: maxDate.getMinutes()
            },
            now = {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: Math.floor(date.getMinutes() / minuteInterval) * minuteInterval
            };

        // 得到当月的天数
        let dayCount = (new Date(now.year, now.month + 1, 1) - new Date(now.year, now.month, 1)) / MS_PER_DAY;

        // 如果当前选择的时间和最小允许选择的时间接近, 比如都是 2015 年, 那么这个时候月份一栏就不能是 1~12月了, 而是最小允许的月份~12月
        let sameYearWithStart = start.year === now.year,
            sameMonthWithStart = sameYearWithStart && start.month === now.month,
            sameDayWithStart = sameMonthWithStart && start.day === now.day,
            sameHourWithStart = sameDayWithStart && start.hour === now.hour;

        start.month = sameYearWithStart ? start.month : 0;
        start.day = sameMonthWithStart ? start.day : 1;
        start.hour = sameDayWithStart ? start.hour : 0;
        start.minute = sameHourWithStart ? start.minute : 0;

        // 同理, 如果当前选择的时间和最大允许选择的时间接近, 比如都是 2016 年, 这个时候月份一栏就应该是 1 ~ 最大允许的月份
        let sameYearWithEnd = end.year === now.year,
            sameMonthWithEnd = sameYearWithEnd && end.month === now.month,
            sameDayWithEnd = sameMonthWithEnd && end.day === now.day,
            sameHourWithEnd = sameDayWithEnd && end.hour === now.hour;

        end.month = sameYearWithEnd ? end.month : 11;
        end.day = sameMonthWithEnd ? end.day : dayCount;
        end.hour = sameDayWithEnd ? end.hour : 23;
        end.minute = sameHourWithEnd ? end.minute : 59;

        // 根据上面的区间, 得到具体要在 Picker 中展示数据
        let years = range(start.year, end.year + 1).map(value => ({value: value, label: value + '年'})),
            months = range(start.month, end.month + 1).map(value => ({value: value, label: value + 1 + '月'})),
            days = range(start.day, end.day + 1).map(value => ({value: value, label: value + '日'})),
            hours = range(start.hour, end.hour + 1).map(value => ({value: value, label: value + '时'})),
            minutes = range(start.minute, end.minute + 1, minuteInterval).map(value => ({value: value, label: value + '分'}));

        // 年 月 日 小时 分钟
        let selectedValues = [now.year, now.month, now.day, now.hour, now.minute];
        let componentData = [years, months, days, hours, minutes];

        // 根据 mode 的不同,选择需要展示的项目
        let showItem = [];
        if (mode === 'date'){
            // 展示 year, month, day
            showItem = [0, 1, 2];
        } else if (mode === 'time'){
            // 展示 hour, minute
            showItem = [3, 4];
        } else {
            // 展示 year, month, day, hour, minute
            showItem = [0, 1, 2, 3, 4];
        }
        // 返回 state ,根据 showItem 拿出需要的数据
        return {
            componentData: showItem.map((i) => componentData[i]),
            selectedValues: showItem.map((i) => selectedValues[i]),
            date: date
        };
    },
    render: function() {
        var state = this.state;
        return (
            <MultiPicker
                {...this.props}
                componentData={state.componentData}
                selectedValues={state.selectedValues}
                onChange={this.onChange}
            />
        );
    }
});

module.exports = DatePicker;
