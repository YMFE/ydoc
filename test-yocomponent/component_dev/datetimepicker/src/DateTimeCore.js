export default class DateTimeCore {

    constructor(values, range, units = [], dateOrTime = 'date',
        extraNumStrWrapper = (value => value)) {
        this.monthMapDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.refresh(values, range, dateOrTime, units, extraNumStrWrapper);
        this.deepUpdateMultiPickerState();
    }

    refresh(values = this.values, range = this.range, dateOrTime = this.dateOrTime,
        units = this.units, extraNumStrWrapper = this.extraNumStrWrapper.bind(this)) {
        this.values = values;
        this.range = range;
        this.dateOrTime = dateOrTime;
        this.levels = new Array(values.length).fill(1).map((cur, index) => index);
        this.units = units;
        this.extraNumStrWrapper = extraNumStrWrapper;
        this.rangeStore = this.calculateRange(this.range, this.dateOrTime);
        this.currRange = this.getCurrRange();
        return this;
    }

    deepUpdateMultiPickerState() {
        this.multiPickerState = this.levels.reduce((accState, level) => {
            accState[level] = this.genPickerState(level, this.currRange[level], this.values[level]);
            return accState;
        }, {});
    }

    // 只有value及currRange 发生变化时，只需从已有的状态中取出需要更新的new options即可。
    shallowUpdateMultiPickerState(level, currRange, value) {
        this.multiPickerState[level] = this.genPickerState(level, currRange, value);
    }

    updateDateTime(newValues) {
        const levels = this.levels;
        let startLevel;

        newValues.forEach((newValue, level) => {
            const pickerState = this.multiPickerState[level];
            if (newValue !== pickerState.value && pickerState.value !== undefined) {
                this.values[level] = newValue;
                if (startLevel === undefined) {
                    startLevel = level;
                }
            }
        });
        levels.forEach(level => {
            const pickerState = this.multiPickerState[level];
            if (level < startLevel || pickerState.value === undefined) return;
            const currRange = this.getCurrRange(),
                { min, max } = currRange[level],
                oldValue = this.values[level],
                newValue = oldValue > max ? max : oldValue < min ? min : oldValue,
                options = this.multiPickerState[level].options,
                minValue = options[0].value,
                maxValue = options[options.length - 1].value;

            this.values[level] = newValue || this.values[level];
            if (min !== minValue || max !== maxValue) {
                this.shallowUpdateMultiPickerState(level, currRange[level], newValue);
            } else {
                this.multiPickerState[level].value = this.values[level];
            }
        });
    }

    genPickerState(level, currRange, value, units = this.units) {
        const { min, max } = currRange;
        return {
            options: this.mapRangeToOptions(min, max, level, units[level] || ''),
            value,
        };
    }

    mapRangeToOptions(min, max, level, unit) {
        return new Array(max - min + 1).fill(1).map((cur, index) => ({
            value: index + min,
            text: this.extraNumStrWrapper(index + min, level) + unit,
        }));
    }

    /* range: [[2000,7, 23], [2016, 9, 3]],
        rangeStore: {
            2000: {
                min: 7,
                max: 12,
                7: {min: 23, max: 31},
            2016: {
                min: 1,
                max: 9,
                9: {min: 1, max: 3},
            }
        }
    */
    calculateRange(range = this.range, mode = this.dateOrTime) {
        const selectByMode = (dateNum, timeNum) => mode === 'date' ? dateNum : timeNum,
            rangeStore = {};
        range.forEach((cur, index) => {
            const high = cur[0],
                mid = cur[1],
                low = cur[2] || 0,
                days = this.getDaysByMonth(mid);

            if (index === 0) {
                rangeStore[high] === undefined
                    ? rangeStore[high] = { min: mid, max: selectByMode(12, 59) }
                    : rangeStore[high].min = mid;
                rangeStore[high][mid] === undefined
                    ? rangeStore[high][mid] = { min: low, max: selectByMode(days, 59) }
                    : rangeStore[high][mid].min = mid;
            } else {
                rangeStore[high] === undefined
                    ? rangeStore[high] = { min: selectByMode(1, 0), max: mid }
                    : rangeStore[high].max = mid;
                rangeStore[high][mid] === undefined
                    ? rangeStore[high][mid] = { min: selectByMode(1, 0), max: low }
                    : rangeStore[high][mid].max = low;
            }
        });
        return rangeStore;
    }

    getCurrRange(values = this.values, mode = this.dateOrTime, rangeStore = this.rangeStore) {
        const midRange = rangeStore[values[0]],
            lowRange = midRange && midRange[values[1]],
            highRange = { min: this.range[0][0], max: this.range[1][0] },
            monthRange = { min: 1, max: 12 },
            minsRange = { min: 0, max: 59 },
            dayRange = { min: 1, max: this.getDaysByMonth(values[1]) },
            range = {
                0: highRange,
                1: midRange ? { ...midRange } : mode === 'date' ? monthRange : minsRange,
                2: lowRange ? { ...lowRange } : mode === 'date' ? dayRange : minsRange,
            };
        return range;
    }

    isLeapYear(num) {
        const mod4 = num % 4,
            mod100 = num % 100,
            mod400 = num % 400;
        return !mod4 && (mod100 || (!mod100 && !mod400));
    }

    getDaysByMonth(month, year = this.values[0], isLeap = this.isLeapYear.bind(this),
        monthMapDays = this.monthMapDays) {
        const leap = isLeap(year);
        return !(leap && month === 2) ? monthMapDays[month - 1] : monthMapDays[month - 1] + 1;
    }
}
