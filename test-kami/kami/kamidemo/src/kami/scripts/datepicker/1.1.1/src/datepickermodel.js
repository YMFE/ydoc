/*  {OPTIONS}               | [type]        | (default), values         | Explanation
 *  ------------------------| --------------| ------------------------- | -----------
 *  @data                   | [Object]      | ([])                      | 可以向每天都push一些数据，目前不支持递归拷贝
 *  @today                  | [String]      | (today)                   | 今天的日期，最好给服务器事件
 *  @isHoliday              | [Boolean]     | (true)                    | 默认是由节假日信息的，不需要传false
 *  @dataType               | [Number]      | (1)                       | 目前支持两种返回格式，便于渲染，具体参照真实回溯
 *  @beginDate              | [String]      | (today)                   | 日历展示开始日期，用于做diff
 *  @endDate                | [String]      | ('')                      | 日历展示结束日期，用于做diff
 *  @checkIn                | [String]      | ('')                      | 入住时间
 *  @checkOut               | [String]      | ('')                      | 离店时间
 */

var QunarDate = require('./qunardate.js');

/**
 * [DatepickerModel 获取日历基础数据层，可独立使用]
 * @param {[type]} opt [description]
 */
function DatepickerModel(opt) {

    this.opt = this.extend(opt, {
        data: [],
        today: QunarDate.format(QunarDate.today()),
        isHoliday: true,
        dataType: 1
    });
    this.processingData();
    this.config();
    this.getViewData();
    //暴露的数据类型，主要是用于渲染
    if (this.opt.dataType == 1) {
        return this.config['viewData']['1D'];
    } else {
        return this.config['viewData']['2D'];
    }
}

DatepickerModel.prototype = {

    /**
     * [processingData 处理数据]
     */
    processingData: function() {
        this.opt.date = this.opt.date || this.opt.today
        var date = QunarDate.parse(this.opt.date);
        this.opt.month = date.getMonth() + 1;
        this.opt.year = date.getFullYear();
        if (this.opt.month < 10) {
            this.opt._month = '0' + this.opt.month;
        } else {
            this.opt._month = this.opt.month;
        }
    },

    /**
     * [config 初始化一些需要的配置数据]
     */
    config: function() {
        this.config = {
            monthDates: {
                '1': 31,
                '3': 31,
                '4': 30,
                '5': 31,
                '6': 30,
                '7': 31,
                '8': 31,
                '9': 30,
                '10': 31,
                '11': 30,
                '12': 31
            }
        };
        this.config['today'] = this.opt.today;
        this.config['viewData'] = {
            '1D': [],
            '2D': []
        };
        this.config['weekData'] = [];
        this.config['X'] = 0; //当前日历各自属于第x行
        this.config['Y'] = 0; //当前日历各自属于第Y列

        this._getBeginAndEndDate();
    },

    /**
     * [_getBeginAndEndDate 获取展示开始时间和结束时间]
     */
    _getBeginAndEndDate: function(){
        // 可用的开始时间
        this.config['beginDate'] = this.opt['beginDate'];
        // 可用的结束时间
        this.config['endDate'] = this.opt['endDate'];
        // 如果开始时间没有写，默认开始时间为今天
        if(!this.config['beginDate']){
            this.config['beginDate'] = this.opt.today;
        }
        // 如果写了与开始时间最大的差值，则计算结束时间
        if(this.opt.offsetBegin && !this.config.endDate){
            this.config['endDate'] = QunarDate.format(QunarDate.plus(QunarDate.parse(this.config['beginDate']),this.opt.offsetBegin));
        }
        // 如果没有计算到结束时间,则结束时间默认为月末
        if(!this.config.endDate){
            this.config['endDate'] = QunarDate.format(QunarDate.getLastDaysOfMonth(QunarDate.parse(this.config['beginDate'])));
        }
    },

    /**
     * [getFebruaryDates 获取二月的天数]
     * @param  {[Number]} year [年份]
     * @return {[String]}      [二月天数]
     */
    getFebruaryDates: function(year) {
        var year = parseInt(year, 10);
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return 29;
        } else {
            return 28;
        }
    },

    /**
     * [getViewData 获取要展示成的数据]
     */
    getViewData: function() {
        var _this = this,
            firstDay = QunarDate.parse(this.opt.year + '-' + this.opt._month + '-01'),
            headEmptyDate = firstDay.getDay();
        if (headEmptyDate) {
            for (var i = headEmptyDate; i > 0; i--) {
                var today = QunarDate.plus(firstDay, -i),
                    obj = this.getOtherMonth(today);
                obj['isLastMonth'] = true;
                this.getWeekData(obj);
            }
        }

        if (this.opt.month == 2) {
            var monthDate = this.getFebruaryDates();
        } else {
            var monthDate = this.config.monthDates[this.opt.month];
        }

        for (var i = 1; i <= monthDate; i++) {
            var obj = {
                isNoEmpty: true,
                year: this.opt.year,
                month: this.opt.month,
                date: i,
                x: this.config['X'],
                y: this.config['Y'],
                isSelected: false
            }

            if (i < 10) {
                var today = this.opt.year + '-' + this.opt._month + '-0' + i;
            } else {
                var today = this.opt.year + '-' + this.opt._month + '-' + i;
            }

            obj['day'] = today;
            obj['isPast'] = this.getIsPast(QunarDate.parse(today));
            obj['isWeekend'] = this.getIsWeekend(QunarDate.parse(today))

            if (today == this.config['today']) {
                obj['isToday'] = true;
                obj['isPast'] = false;
            } else {
                obj['isToday'] = false;
            }

            if (this.opt.isHoliday) {
                var holiday = QunarDate.getHoliday(today);
                if (holiday){
                    obj['holiday'] = holiday['holidayName'];
                    obj['isHoliday'] = holiday['isHoliday'];
                }
            }

            if (this.opt.data && this.opt.data.length) {
                obj['isData'] = true;
                obj = this.extend(obj, _this.opt.data[i - 1]);
            } else {
                obj['isData'] = false;
            }

            this.getWeekData(obj);

        }

        var lastDate = QunarDate.parse(this.opt.year + '-' + this.opt._month + '-' + monthDate),
            footEmptyDate = lastDate.getDay();
        if (footEmptyDate != 6) {
            for (var i = 1; i <= 6 - footEmptyDate; i++) {
                var today = QunarDate.plus(lastDate, i),
                    obj = this.getOtherMonth(today);
                obj['isNextMonth'] = true;
                this.getWeekData(obj);
            }
        }

    },

    /**
     * [beforePush 在将数据推入viewData时需要做的统一处理]
     * @param  {[Object]} obj [每天的数据]
     */
    beforePush : function(obj){
        obj.diffBeginDate = QunarDate.compareDate(QunarDate.parse(obj.day),QunarDate.parse(this.config.beginDate));
        obj.diffEndDate = QunarDate.compareDate(QunarDate.parse(obj.day),QunarDate.parse(this.config.endDate));
        if(this.opt.checkIn === obj.day){
            obj.isCheckIn = true;
        }
        if(this.opt.checkOut === obj.day){
            obj.isCheckOut = true;
        }
    },

    /**
     * [getWeekData 获取是第在二维数据中的坐标，并为考虑一维的数据]
     * @param  {[Object]} obj [获取周末的数据]
     */
    getWeekData: function(obj) {
        this.beforePush(obj);
        this.config['weekData'].push(obj);
        this.config['viewData']['1D'].push(obj);
        this.config['X']++;

        if (this.config['weekData'].length == 7) {
            this.config['X'] = 0;
            this.config['Y']++;
            this.config['viewData']['2D'].push(this.config['weekData']);
            this.config['weekData'] = [];
        }
    },

    /**
     * [getIsPast 获取是否是过去时间]
     * @param  {[String]} today [今天的时间]
     * @return {[Boolean]}       [true为是，false不是]
     */
    getIsPast: function(today) {
        if (today > QunarDate.parse(this.config['today'])) {
            return false;
        } else {
            return true;
        }
    },

    //获取是否是周六和周日
    /**
     * [getIsWeekend description]
     * @param  {[String]} today [今天的时间]
     * @return {[Boolean]}       [true为周末，false不是周末]
     */
    getIsWeekend: function(today) {
        var weekDay = today.getDay();
        if (weekDay == 0 || weekDay == 6) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * [getOtherMonth 获取其他的一些基础数据]
     * @param  {[String]} today [今天的时间]
     * @return {[Object]}       [当天时间的数据]
     */
    getOtherMonth: function(today) {
        return {
            isNoEmpty: false,
            isPast: this.getIsPast(today),
            isWeekend: this.getIsWeekend(today),
            day: QunarDate.format(today),
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate(),
            x: this.config['X'],
            y: this.config['Y'],
            isSelected: false
        }
    },

    /**
     * [extend 简单的拷贝]
     * @param  {[Object]} objA [A对象]
     * @param  {[Object]} objB [B对象]
     * @return {[Object]}      [C对象]
     */
    extend: function(objA, objB) {
        for (x in objB) {
            if (!objA[x])
                objA[x] = objB[x];
        }
        return objA;
    }

}

module.exports = DatepickerModel;
