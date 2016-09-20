/**
 * [日期基础库]
 * @return {[Object]} [带有各种日期处理方法的东东]
 */
var QunarDate = (function(){
    var HolidayData = {
        "2015-05-01" : {isHoliday : 1, holidayName : "劳动节"},
        "2015-06-20" : {isHoliday : 1, holidayName : "端午节"},
        "2015-06-22" : {isHoliday : 1},
        "2015-08-20" : {isHoliday : 0, holidayName : "七夕"},
        "2015-09-03" : {isHoliday : 1, holidayName : "抗战胜利日"},
        "2015-09-04" : {isHoliday : 1},
        "2015-09-06" : {isHoliday : 0},
        "2015-09-27" : {isHoliday : 1, holidayName : "中秋节"},
        "2015-10-01" : {isHoliday : 1, holidayName : "国庆节"},
        "2015-10-02" : {isHoliday : 1},
        "2015-10-05" : {isHoliday : 1},
        "2015-10-06" : {isHoliday : 1},
        "2015-10-07" : {isHoliday : 1},
        "2015-10-10" : {isHoliday : 0},
        "2015-11-11" : {isHoliday : 0, holidayName : "光棍节"},
        "2015-12-24" : {isHoliday : 0, holidayName : "平安夜"},
        "2015-12-25" : {isHoliday : 0, holidayName : "圣诞节"},
        "2016-01-01" : {isHoliday : 0, holidayName : "元旦"},
        "2016-02-07" : {isHoliday : 1, holidayName : "除夕"},
        "2016-02-08" : {isHoliday : 0, holidayName : "春节"},
        "2016-02-14" : {isHoliday : 1, holidayName : "情人节"},
        "2016-04-04" : {isHoliday : 0, holidayName : "清明节"},
        "2016-05-01" : {isHoliday : 1, holidayName : "劳动节"},
        "2016-06-09" : {isHoliday : 0, holidayName : "端午节"},
        "2016-09-15" : {isHoliday : 0, holidayName : "中秋节"},
        "2016-10-01" : {isHoliday : 1, holidayName : "国庆节"},
        "2016-11-11" : {isHoliday : 0, holidayName : "光棍节"},
        "2016-12-24" : {isHoliday : 1, holidayName : "平安夜"},
        "2016-12-25" : {isHoliday : 1, holidayName : "圣诞节"}
    };
    var RoundDate=["今天","明天","后天"];
    var ONE_DAY = 24*60*60*1000;
    //星期配置
    var WeekArr = ["日","一","二","三","四","五","六"];
    //其他配置
    var TransDateEx = {
        week : "周",
        day : "天",
        before : "前",
        after : "后"
    };
    var language = {
        SECOND:"秒",
        MILLISECOND: "毫秒",
        MINUTE:"分钟",
        HOUR:"小时",
        DAY:"天",
        YEAR:"年"
    };
    var thisDate = null;
    var speciaDateTable = null;

    return {

        /**
         * [isHoliday 是否为节假日]
         * @param  {[String]}  key [时间字符串]
         * @return {Boolean}     [是否为节日]
         */
        isHoliday: function(key){
            return !!HolidayData[key];
        },

        /**
         * [getHoliday 获取节假日信息]
         * @param  {[String]} key [时间字符串]
         * @return {[Object]}     [带有节假日的数据]
         */
        getHoliday: function(key){
            return HolidayData[key];
        },

        /**
         * [getHoliday 替换节假日]
         * @param  {[Object]} key [被替换的节假日]
         */
        replaceHoliday: function(holidayData){
            HolidayData = holidayData;
        },

        /**
         * [parseTimeToNL_et 距离现在多久]
         * @param  {[Object]} t [时间值]
         * @return {[String]}   [多久]
         */
        parseTimeToNL_et : function(t) {
            if (t>=ONE_DAY){
                t=ONE_DAY;
            }
            return this.parseTimeToNL(t);
        },

        /**
         * [parseTimeToNL 时间到多久]
         * @param  {[Object]} time [时间值]
         * @return {[String]}      [多久]
         */
        parseTimeToNL : function(time) {
            var _ms = time % 1000;
            var _s = (time - _ms) % 60000;
            var _min = (time - _s * 1000 - _ms) % 3600000;
            var _hour = (time - _min * 60000 - _s * 1000 - _ms) % (24 * 3600000);
            var _day = (time - _hour * 3600000 - _min * 60000 - _s * 1000 - _ms) % (24 * 3600000);
            var utStr = "";
            if (time < 1000)
                utStr = time + language.MILLISECOND;
            else
                if (time < 60000)
                    utStr = parseInt(time / 1000) + language.SECOND;
                else
                    if (time < 3600000)
                        utStr = parseInt(time / 60000) + language.MINUTE;
                    else
                        if (time < (24 * 3600000))
                            utStr = parseInt(time / 3600000) + language.HOUR;
                        else
                            if (time < (365 * 24 * 3600000))
                                utStr = parseInt(time / (24 * 3600000)) + language.DAY;
                            else
                                utStr = parseInt(time / (365 * 24 * 3600000)) + language.YEAR;
            return utStr;
        },

        /**
         * [less 日期相减]
         * @param  {[String]} str1 [时间字符串]
         * @param  {[String]} str2 [时间字符串]
         * @return {[Number]}      [相差天数]
         */
        less: function(str1, str2){
            var str1 = this.parse(str1),
                str2 = this.parse(str2),
                diff = this.compareDate(str1, str2);
            return Math.abs(diff / (1000 * 60 * 60 *24));
        },

        /**
         * [plus 日期相加]
         * @param  {[Object]} date [日期对象]
         * @param  {[Number]} days [相加天数]
         * @return {[Object]}      [日期对象]
         */
        plus: function(date, days) {
            return new Date(date.getTime() + days * ONE_DAY);
        },

        /**
         * [today 获取今天时间]
         * @return {[Object]} [日期对象]
         */
        today: function(){
            if(thisDate) return thisDate;
            var tt = (window.SERVER_TIME && new Date(window.SERVER_TIME)) || new Date();
            return thisDate = new Date(tt.getFullYear(), tt.getMonth(), tt.getDate());
        },

        /**
         * [parse 将日期字符串转为日期对象]
         * @param  {[Object]} dateStr [日期字符串]
         * @return {[Object]}         [日期对象]
         */
        parse : function(dateStr){
            var datas = dateStr.split("-");
            return new Date(datas[0], datas[1]-1, datas[2]);
        },

        /**
         * [format 将日期对象转为日期字符串]
         * @param  {[Object]} date [日期对象]
         * @return {[Object]}      [日期字符串]
         */
        format: function(date) {
            return date.getFullYear()+"-"+this.convert2digit(date.getMonth()+1)+"-"+this.convert2digit(date.getDate());
        },

        /**
         * [format 转为中文格式2012年12月12日]
         * @param  {[Object]} date [日期对象]
         * @return {[Object]}      [日期字符串]
         */
        formatDateAsNumAndChinese : function(date){
            return [date.getFullYear(),"年",date.getMonth() + 1,"月", date.getDate(),"日"].join("");
        },

        /**
         * [convert2digit month和date < 10 转为 0X 格式]
         * @param  {[Number]} str [数字]
         * @return {[String]}     [字符串]
         */
        convert2digit: function(str){
            return str <10 ? "0"+str : str;
        },

        /**
         * [compareDate 对比两个日期的大小]
         * @param  {[Object]} date1 [日期对象]
         * @param  {[Object]} date2 [日期对象]
         * @return {[Number]}       [相差的天数]
         */
        compareDate: function(date1, date2) {
            return date1.getTime() - date2.getTime();
        },

        /**
         * [getFirstDaysOfMonth 获取当月第一天]
         * @param  {[Object]} date [日期对象]
         * @return {[Object]}      [日期对象]
         */
        getFirstDaysOfMonth : function(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        /**
         * [getLastDaysOfMonth 获取当月最后天]
         * @param  {[Object]} date [日期对象]
         * @return {[Object]}      [日期对象]
         */
        getLastDaysOfMonth : function(date) {
            return new Date(date.getFullYear(), date.getMonth()+1, 0);
        },

        /**
         * [getDateTip 获取一个日期的tip,基本上用不了，业务需求不同]
         * @param  {[Object]} dateStr [日期对象]
         * @return {[String]}         [字符串]
         */
        getDateTip: function(dateStr) {
            var date = this.parse(dateStr);
            var timeDif = (date.getTime() - this.today().getTime())/1000/3600/24;
            var tip = "";

            this.initDataTable();
            if (speciaDateTable[dateStr]) {
                tip = speciaDateTable[dateStr].holidayName;
            }
            if( tip == "" && timeDif < 3){
                tip = RoundDate[timeDif];
            }
            if (tip == ""){
                tip = TransDateEx.week + WeekArr[date.getDay()];
            }
            return tip;
        },

        /**
         * [initDataTable 日期table]
         */
        initDataTable: function(){
            if(speciaDateTable != null)
                return speciaDateTable;
            speciaDateTable = {};
            for(var key in HolidayData) {
                var _speciaDay = key;
                var _speciaDayEx = HolidayData[key];
                speciaDateTable[key] = _speciaDayEx;
                var _sDay = "";
                var _sName = "";
                if(_speciaDayEx.beforeTime > 0){
                    for(var i = 1; i <= _speciaDayEx.beforeTime;i++){
                        var _dex = {};
                        var _beforDay = new Date(this.parse(_speciaDay).getTime() - i*24*3600*1000);
                        var _beforDayStr = this.format(_beforDay);
                        _dex.holidayName = _speciaDayEx.holidayName + TransDateEx.before + i + TransDateEx.day;
                        _dex.dayindex = _speciaDayEx.dayindex;
                        if(!speciaDateTable[_beforDayStr]){
                            speciaDateTable[_beforDayStr] = _dex;
                        }else{
                            if((_speciaDayEx.dayindex > speciaDateTable[_beforDayStr].dayindex) && speciaDateTable[_beforDayStr].beforeTime == null){
                                speciaDateTable[_beforDayStr] = _dex;
                            }
                        }
                    }
                }
                if(_speciaDayEx.afterTime > 0){
                    for(var i = 1; i <= _speciaDayEx.afterTime;i++){
                        var _dex = {};
                        var _afterDay = new Date(this.parse(_speciaDay).getTime() + i*24*3600*1000);
                        var _afterDayStr = this.format(_afterDay);
                        _dex.holidayName = _speciaDayEx.holidayName + TransDateEx.after + i + TransDateEx.day;
                        _dex.dayindex = _speciaDayEx.dayindex;
                        if(!speciaDateTable[_afterDayStr]){
                            speciaDateTable[_afterDayStr] = _dex;
                        }else{
                            if((_speciaDayEx.dayindex > speciaDateTable[_afterDayStr].dayindex ) && speciaDateTable[this.format(new Date(_beforDay))].afterTime == null){
                                speciaDateTable[_afterDayStr] = _dex;
                            }
                        }
                    }
                }
            }
        }
    };
})();

module.exports = QunarDate;
