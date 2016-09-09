/**
 * @providesModule QTimePicker
 * @flow
 */

import React,{
    DatePickerIOS,
    Platform,
    PropTypes,
    Component
} from 'react-native';

const isIOS = Platform.OS === 'ios';
const Picker = isIOS
    ? require('./TimePickeriOS')
    : require('./TimePickerAndroid');

/**
 * 日期/时间选择组件
 *
 * @component TimePicker
 * @example ./Playground/js/Examples/TimePickerExample.js[1-146]
 * @version >=1.3.0
 * @description 渲染出一个可以选择日期/时间的组件。这是一个受控组件，需要在 onDateChange 的回调中设置 date。
 *
 * ![ScrollView](./images/component-TimePicker.png)
 */
class QTimePicker extends Component {

    _dateChange(evt) {
        this.props.onDateChange && this.props.onDateChange(evt);
    }

    render() {
        return isIOS
            ? <Picker {...this.props}
              date={this.props.date}
              onDateChange={(evt) => this._dateChange(evt)}
            />
            : <Picker {...this.props}
              date={this.props.date}
              onChange={(evt) => this._dateChange(evt)}
            />;
    }
}

QTimePicker.defaultProps = {
    mode: 'datetime',
    date: new Date(),
    minuteInterval: 1,
};

QTimePicker.propTypes = {
    /**
     * 显示模式
     *
     * @property mode
	 * @type 'date' / 'time' / 'datetime'
     * @default datetime
	 * @description 选择时间的模式，支持三种：datetime为日期和时间，time为时间，date为日期。
     */
    mode: PropTypes.oneOf([
        'date',
        'time',
        'datetime',
    ]),
    /**
     * 当前选中值
     *
     * @property date
	 * @type Date
     * @default new Date()
	 * @description 当前的选中值，由于这是一个受控组件，所以需要在 onDateChange 回调中每次修改这个值。
     */
    date: PropTypes.instanceOf(Date),
    /**
     * 最小值
     *
     * @property minimumDate
	 * @type Date
	 * @description 可选的最小值，超过范围会自动回弹。
     */
    minimumDate: PropTypes.instanceOf(Date),
    /**
     * 最大值
     *
     * @property maximumDate
	 * @type Date
	 * @description 可选的最大值，超过范围会自动回弹。
     */
    maximumDate: PropTypes.instanceOf(Date),
    /**
     * 最小的分钟单位
     *
     * @property minuteInterval
	 * @type oneOf([1, 2, 3, 5, 6, 10, 12, 15, 20, 30])
     * @default 1
	 * @description 可选的最小的分钟单位。
     */
    minuteInterval: PropTypes.oneOf([1, 2, 3, 5, 6, 10, 12, 15, 20, 30]),
    // /**
    //  * 时区差
    //  *
    //  * @property timeZoneOffsetInMinutes
	//  * @type PropTypes.number
	//  * @description 时区差，单位是分钟。默认情况下，选择器会选择设备的默认时区。通过此参数，可以指定一个时区。举个例子，要使用北京时间（东八区），可以传递8 * 60。
    //  */
    // timeZoneOffsetInMinutes: PropTypes.number,
    /**
     * 时间变化后的回调
     *
     * @property onDateChange
	 * @type function
     * @param {Date} date 当前选择的时间
	 * @description (date) => void
     *
     * 当选择的事件发生变化之后触发的回调
     */
    onDateChange: PropTypes.func,
};

module.exports = QTimePicker;
