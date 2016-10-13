import ComponentCore from '../../common/ComponentCore';
import solar2lunar, { convert2digit } from './lunar.js';
import Holiday from './holiday.js';

/**
 * 继承ComponentCore组件, 主要基于观察者模式, 注册、触发自定义事件
 */
export default class CalendarCore extends ComponentCore {
    constructor(duration, checkIn, checkOut) {
        super('canlendar');
        this.checkIn = null;
        this.checkInDate = null;
        this.checkOut = null;
        this.checkOutDate = null;
        this.checkRange = []; // 缓存入、住店中间范围ITem对象的引用
        this.hasToday = false; // today 检测
        this.beforeToday = true; // beginDate是否在today之前
        this.isRender = false;
        this.dataSource = this.getData(duration, checkIn, checkOut);
    }

    /**
     * handleChange 点击日期时触发的函数
     * @param str {String} 点中的日期字符串 '2016-10-01'
     * @param allowSingle {Boolean} 是否允许单点情况
     * @returns {null}
     */
    handleChange(str, allowSingle) {
        let resObj = {
            selectionStart: '',
            selectionEnd: '',
        };
        if (!!this.checkOut || !this.checkIn || allowSingle) {
            resObj.selectionStart = str;
            return this.emitEvent('check', resObj);
        }
        if (!!this.checkIn) {
            // 处理IOS不兼容2016-10-01, 但不改变原有日期格式
            let tempStr = str.replace(/-/g, '/');
            if (this.compareDate(new Date(tempStr), this.checkInDate) < 0) {
                resObj.selectionStart = str;
                return this.emitEvent('check', resObj);
            } else {
                resObj.selectionStart = this.format(this.checkInDate);
                resObj.selectionEnd = str;
                return this.emitEvent('check', resObj);
            }
        }
        return this.emitEvent('check', resObj);
    }

    /**
     * getEndDate 获取间隔天数的最后一天日期
     * @param date {Date} 起始日期对象
     * @param offset {Number} 间隔天数
     * @returns {Date} 结束日期对象
     */
    getEndDate(date, offset) {
        let startTime = date.getTime();
        let endTime = startTime + offset * 24 * 3600 * 1000;
        return new Date(endTime);
    }

    /**
     * getFirstDayOfMonth 获取某年某月第一天
     * @param year {String} 年份
     * @param month {String} 月份
     * @returns {Date}
     */
    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    /**
     * getLastDayOfMonth 获取某年某月最后一天
     * @param year {String}
     * @param month {String}
     * @returns {Date}
     */
    getLastDayOfMonth(year, month) {
        return new Date(year, month, 0);
    }

    /**
     * isToday 某年某月某天是否是今天, this.hasToday存储结果
     * @param year {String}
     * @param month {String}
     * @param day {String}
     * @returns {Boolean}
     */
    isToday(year, month, day) {
        let tempDate = new Date();
        this.hasToday = tempDate.getFullYear() === year && (tempDate.getMonth() + 1) === month && tempDate.getDate() === day;
        return this.hasToday;
    }

    /**
     * isWeekend 确定某天是否周末
     * @param dayNum {Number} 日期号
     * @param firstDay {Number} 当月第一天的星期数
     * @return {Boolean}
     */
    isWeekend(dayNum, firstDay) {
        let num = (+dayNum + firstDay) % 7;
        return num === 0 || num === 1;

    }

    /**
     * format 格式化日期 eg: 2016-08-09
     * @param date {Date}
     * @returns {string}
     */
    format(date) {
        return date.getFullYear() + '-' + convert2digit(date.getMonth() + 1)
            + '-' + convert2digit(date.getDate());
    }

    /**
     * formatMonth 格式化某年某月月为指定格式, eg： 2016/08
     * @param year {String}
     * @param month {String}
     * @returns {string}
     */
    formatMonth(year, month) {
        return year + '/' + convert2digit(month);
    }

    /**
     * getHoliday 根据传入的参数,对应到holiday.js,返回节假日信息
     * @param str1 {string} 月-日 eg: '09-08'
     * @param str2 {string} solar | lunar
     * @returns {*|string} 节假日信息
     */
    getHoliday(str1, str2 = 'solar') {
        return Holiday[str2][str1] || '';
    }

    /**
     * isHoliday 判断是否是假期
     * @param year {number}
     * @param month {number}
     * @param day {number}
     * @returns {string} 节假日信息或者''
     */
    isHoliday(year, month, day) {
        let res = '';
        month = convert2digit(month);
        day = convert2digit(day);
        res += this.getHoliday(month + '-' + day);
        res += this.getHoliday(solar2lunar(year, month, day), 'lunar');
        return res;
    }

    /**
     * formatMonthChinese 中文格式： 2016年8月
     * @param year {String}
     * @param month {String}
     * @returns {string}
     */
    formatMonthChinese(year, month) {
        return year + "年" + month + "月";
    }

    /**
     * compareDate 对比两个日期的大小
     * @param date1 {Date}
     * @param date2 {Date}
     * @return {Number} [相差的天数]
     */
    compareDate(date1, date2) {
        return date1.getTime() - date2.getTime();
    }

    /**
     * getDateInfoArr 获取年、月、日、星期等信息
     * @param date {Date}
     * @returns {Array}
     */
    getDateInfoArr(date) {
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDay(),
            date.getDate(),
        ];
    }

    /**
     * getDate 获取满足需要的groupList格式数据
     * @param duration {Number | Array} 时间间隔或起始时间日期
     * @param checkIn {String} 入店时间, eg: 2016-10-01
     * @param checkOut {String} 离店时间, eg: 2016-10-01
     * @returns {Array}
     */
    getData(duration, checkIn, checkOut) {
        let beginDate = '';
        let endDate = '';
        const todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        if (typeof duration == 'object') {
            beginDate = new Date(duration[0].replace(/-/g, '/'));
            endDate = new Date(duration[1].replace(/-/g, '/'));
        } else {
            beginDate = todayDate;
            endDate = this.getEndDate(beginDate, duration);
        }

        this.checkIn = checkIn.replace(/-/g, '/');
        this.checkOut = checkOut.replace(/-/g, '/');
        this.checkInDate = new Date(this.checkIn);
        this.checkOutDate = new Date(this.checkOut);
        this.hasToday = false;
        this.beforeToday = this.compareDate(beginDate, todayDate);
        // 入店日期为今天之前的情况, 则重置为今天
        if (this.compareDate(this.checkInDate, todayDate) < 0) {
            this.checkInDate = todayDate;
            console.warn('the checkIn date has been reseted today!');
        }

        // 入店日期在离店日期之后, 则互换两者
        if (!!checkOut && this.compareDate(this.checkInDate, this.checkOutDate) > 0) {
            [this.checkInDate, this.checkOutDate] = [this.checkOutDate, this.checkInDate];
            console.warn('the checkIn and checkOut has been exchanged!');
        }

        return this.getCheckArr(beginDate, endDate);
    }

    /**
     * getCheckArr, 根据开始日期获取满足条件的dataSource
     * @param beginDate {Date} 开始日期对象
     * @param endDate {Date} 结束日期对象
     * @returns {Array}
     */
    getCheckArr(beginDate, endDate) {
        const [beginYear, beginMonth] = this.getDateInfoArr(beginDate);
        const [endYear, endMonth, endDay, endDayNum] = this.getDateInfoArr(endDate);
        let tempYear = beginYear;
        let tempMonth = beginMonth;
        let resArr = [];
        // 当月第一天的星期数
        let dayFirst = this.getFirstDayOfMonth(beginYear, beginMonth - 1).getDay();

        while (tempYear < endYear || (tempYear == endYear && tempMonth <= endMonth)) {
            const tempDateObj = this.getLastDayOfMonth(tempYear, tempMonth);

            //
            const dayLast = tempMonth === endMonth ? endDay : tempDateObj.getDay();
            const dayLength = tempMonth === endMonth ? endDayNum : tempDateObj.getDate();

            // 某月第一天之前的空格数
            const firstMonthArr = new Array(dayFirst).fill({ empty: true, disabled: true });

            // 某月最后一天之后的空格数
            const lastMonthArr = new Array(6 - dayLast).fill({ empty: true, disabled: true });

            // 某月具体每个天数的信息对象
            const tempMonthArr = new Array(dayLength).fill(0).map((item, i) => ({
                day: i + 1,
                date: this.formatMonth(tempYear, tempMonth),
                lunar: solar2lunar(tempYear, tempMonth, i + 1),
                today: this.hasToday ? false : this.isToday(tempYear, tempMonth, i + 1),
                isCheckIn: false,
                isCheck: false,
                isCheckOut: false,
                weekend: this.isWeekend(i + 1, dayFirst),
                holiday: this.isHoliday(tempYear, tempMonth, i + 1),
                disabled: this.beforeToday <= 0 && !this.hasToday,
            }));
            const monthArr = firstMonthArr.concat(tempMonthArr, lastMonthArr);
            const groupKey = this.formatMonthChinese(tempYear, tempMonth);
            resArr = resArr.concat(this.getMonthArr(monthArr, groupKey));
            if (tempMonth === 12) {
                tempMonth = 1;
                tempYear++;
            } else {
                tempMonth++;
            }
            // 下月的第一天的星期为当前月最后一天的星期+1
            dayFirst = (dayLast + 1) % 7;
        }
        return resArr;
    }

    /**
     * getMonthArr 将一个月的天数格式化成按周分组,一周一个对象
     * @param monthArr {Array}
     * @param groupKey {String}
     * @returns {Array}
     */
    getMonthArr(monthArr, groupKey) {
        let resMonthArr = [], tempWeekArr = [];
        monthArr.map((item, i) => {
            if (!item.empty && !!this.checkIn) {
                const itemStr = item.date + '/' + item.day;
                const itemDate = new Date(itemStr);
                const compareIn = this.compareDate(itemDate, this.checkInDate);
                const compareOut = !!this.checkOut && this.compareDate(itemDate, this.checkOutDate);
                if (!compareIn) {
                    this.checkIn = item;
                    item.isCheckIn = true;
                }
                if (compareIn > 0 && compareOut < 0) {
                    item.isCheck = true;
                    this.checkRange.push(item)
                }
                if (compareOut === 0) {
                    this.checkOut = item;
                    item.isCheckOut = true;
                }
            }

            if (i % 7 == 6) {
                tempWeekArr.push(item);
                resMonthArr.push(this.getWeekObj(tempWeekArr, groupKey));
                tempWeekArr = [];
            } else {
                tempWeekArr.push(item);
            }
        });
        return resMonthArr.map((item, i)=>({ ...item, key: item.groupKey + i }));
    }

    /**
     * 给每周对象上加isRender标志值, 该周是否更新,性能优化
     * @param weekArr {Array} 一周的数组
     * @param groupKey {String} 这周的groupKey
     * @returns {{week: array, isRender: boolean, groupKey: string}}
     */
    getWeekObj(weekArr, groupKey) {
        let resObj = {
            week: weekArr,
            isRender: false,
            groupKey,
        };
        if (!this.checkIn) {
            return resObj;
        }
        weekArr.map(item => {
            if (item.empty) {
                return;
            }
            const itemStr = item.date + '/' + item.day;
            const itemDate = new Date(itemStr);
            const compareIn = this.compareDate(itemDate, this.checkInDate);
            let compareOut = '';
            if (!!this.checkOut && this.isRender) {
                compareOut = this.compareDate(itemDate, this.checkOutDate);
                // 结束
                if (compareOut <= 0) {
                    this.isRender = !!compareOut;
                    resObj.isRender = true;
                }
            }
            if (compareIn == 0) {
                resObj.isRender = true;
                this.isRender = true;
            }
        });
        // console.log(this.isRender)
        return resObj;
    }
}
