/**
 * 公历日期转农历日期
 * @author qingguo.xu
 */
/**
 * 农历1900-2100的润大小信息表
 * @Array Of Property
 * @return Hex
 */
const _lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
    0x0d520];//2100

/**
 * 返回农历y年一整年的总天数
 * @param lunar Year
 * @return Number
 */
const _lYearDays = y => {
    var i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += (_lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return (sum + _learDays(y));
};


/**
 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
 * @param lunar Year
 * @return Number (0-12)
 */
const _leapMonth = y => { //闰字编码 \u95f0
    return (_lunarInfo[y - 1900] & 0xf);
};


/**
 * 返回农历y年闰月的天数 若该年没有闰月则返回0
 * @param lunar Year
 * @return Number (0、29、30)
 */
const _learDays = y => {
    if (_leapMonth(y)) {
        return ((_lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    }
    return (0);
};


/**
 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用_learDays方法
 * @param lunar Year
 * @return Number (-1、29、30)
 */
const _monthDays = (y, m) => {
    if (m > 12 || m < 1) {
        return -1
    }//月份参数从1至12，参数错误返回-1
    return ((_lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29 );
};

/**
 * 将数字转成2个位数
 * @param num {number}
 * @returns {string}
 */
export const convert2digit = num => {
    return num > 9 ? num : '0' + num;
}

/**
 * 传入公历年月日获得详细的农历、农历object信息
 * @param y  solar year
 * @param m solar month
 * @param d  solar day
 * @return JSON object
 */
export default (y, m, d) => { //参数区间1900.1.31~2100.12.31
    var objDate = new Date(y, parseInt(m, 10) - 1, parseInt(d, 10))
    var i, temp = 0;
    //修正ymd参数
    var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
        temp = _lYearDays(i);
        offset -= temp;
    }
    if (offset < 0) {
        offset += temp;
        i--;
    }

    var year = i;

    var leap = _leapMonth(i); //闰哪个月
    var isLeap = false;

    //效验闰月
    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i == (leap + 1) && isLeap == false) {
            --i;
            isLeap = true;
            temp = _learDays(year); //计算农历闰月天数
        }
        else {
            temp = _monthDays(year, i);//计算农历普通月天数
        }
        //解除闰月
        if (isLeap == true && i == (leap + 1)) {
            isLeap = false;
        }
        offset -= temp;
    }

    if (offset == 0 && leap > 0 && i == leap + 1 && !isLeap) {
        --i;
    }
    if (offset < 0) {
        offset += temp;
        --i;
    }
    //农历月
    var month = i;
    //农历日
    var day = offset + 1;

    return convert2digit(month) + '-' + convert2digit(day);
};