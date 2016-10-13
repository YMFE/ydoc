/**
 * @component DateTimePicker
 * @description 日期选择组件
 */
import React, { Component, PropTypes } from 'react';
import Picker from '../../picker/src';
import DateTimeCore from './DateTimeCore';
import './style.scss';

const propTypes = {
    /**
     * 容器高度
     *
     * @property height
     * @type PropTypes.number
     * @description 受控属性：决定容器展示的高度
     * @default 150
     */
    height: PropTypes.number,
    /**
     * 起止区间
     *
     * @property range
     * @type PropTypes.arrayOf(PropTypes.string)
     * @description 受控属性：区间范围开始于, 结束于；可以用/[-: ,/_]/正则表达式中括号里面的符号之一做为分隔符;
     * @default ['2000-07-23', '2016-8-28']
     */
    range: PropTypes.arrayOf(PropTypes.string),
    /**
     * 当前区间默认显示的点
     *
     * @property value
     * @type PropTypes.string
     * @description 受控属性：区间范围内当前默认值，可以用/[-: ,/_]/正则表达式中括号里面的符号之一做为分隔符；
     * @default '2016-8-28'
     */
    value: PropTypes.string,
    /**
     * 循环滚动模式
     *
     * @property loop
     * @type PropTypes.arrayOf(PropTypes.bool),
     * @description 受控属性：设置为true，为无限循环滚动模式，反之为有限模式；默认为true
     * @default []
     */
    loop: PropTypes.arrayOf(PropTypes.bool),
    /**
     * 内联单位
     *
     * @property unitsInline
     * @type PropTypes.arrayOf(PropTypes.string)
     * @description 受控属性：在对应栏里的每个选项里添加对应的单位；
     * @default []
     */
    unitsInline: PropTypes.arrayOf(PropTypes.string),
    /**
     * 右旁单位
     *
     * @property unitsAside
     * @type PropTypes.arrayOf(PropTypes.string)
     * @description 受控属性：在对应栏里的垂直居中，水平偏右位置，显示当前栏目对应的单位；
     * @default []
     */
    unitsAside: PropTypes.arrayOf(PropTypes.string),
    /**
     * 日期或者时间模式
     *
     * @property dateOrTime
     * @type PropTypes.oneOf(['date', 'time']),
     * @description 受控属性：'date'代表日期模式，即年月日模式，'time'代表时间模式，即时分模式
     * @default 'date'
     */
    dateOrTime: PropTypes.oneOf(['date', 'time']),
    /**
     * 数字映射字符串函数
     *
     * @property format
     * @type function
     * @description 受控属性：默认显示的date或者time是数字，传入该函数，会将数字作为参数，经该函数处理后，返回一个经过包装的字符串，这时将会以字符串作为默认的显示选项；该函数有两个参数(value, level)。
     * @param {PropTypes.number} value 对应栏目的序列中的单个值
     * @param {PropTypes.number} level 指代对应的栏目，从左往右递增，从0开始
     * @default (value, level) => value
     */
    format: PropTypes.func,
    /**
     * onChange回调函数
     *
     * @property onChange
     * @type function
     * @description onChange回调函数，用以将当前选择的项目传递给上层，来触发更新。回传的参数有两个(value, item)。
     * @param {PropTypes.object} value 为当前组件应更新到的状态
     * @param {PropTypes.object} item 为当前滑到最中间位置的，选中的数据，包含了一些可能有用的较为详细的信息
     * @default (value, item) => {}
     */
    onChange: PropTypes.func,
    /**
     * picker额外的类名
     *
     * @property pickerExtraClass
     * @type PropTypes.arrayOf(PropTypes.string),
     * @description 受控属性：额外的picker的css类，例如可以通过传入特定的类来达到使相应的picker显示与隐藏的切换；
     * @default []
     */
    pickerExtraClass: PropTypes.arrayOf(PropTypes.string),
    /**
     * 额外类名
     *
     * @property extraClass
     * @type PropTypes.string,
     * @description 受控属性：本组件额外的css类
     * @default []
     */
    extraClass: PropTypes.string,
};

const DateTimePickerDefaultProps = {
    height: 150,
    range: ['2000-07-23', '2016-09-10'],
    value: '2016-8-28',
    loop: [true, true, true],
    unitsInline: [],
    unitsAside: [],
    dateOrTime: 'date',
    format: (value, level) => value,
    onChange: (value, item) => {
        console.log(value, '请设置onChange函数，自行setState更新状态');
    },
    pickerExtraClass: [],
    extraClass: '',
};

export default class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.regxSplit = /[-: ,/_]/;
        this.splitStrToArray = str => str.split(this.regxSplit).map(cur => parseInt(cur, 10));
        const len = this.splitStrToArray(this.props.value).length;
        this.levels = new Array(len).fill(1).map((cur, index) => index);

        const { range, value, dateOrTime, format, unitsInline } = props,
            rangeArr = range.map(curr => this.splitStrToArray(curr));
        this.dateModel = new DateTimeCore(this.splitStrToArray(value), rangeArr,
            unitsInline, dateOrTime, format);
        this.state = {
            levels: this.levels,
            ...this.dateModel.multiPickerState,
        };
    }

    componentWillReceiveProps(nextProps) {
        const { range, dateOrTime, unitsInline, format, loop } = nextProps,
            nextValue = this.splitStrToArray(nextProps.value);
        if (this.props.format !== format ||
            this.props.dateOrTime !== dateOrTime ||
            this.props.range !== range ||
            this.props.unitsInline !== unitsInline ||
            this.props.loop !== loop
        ) {
            const rangeArr = range.map(curr => this.splitStrToArray(curr));
            if (this.props.dateOrTime !== dateOrTime) {
                this.levels = new Array(rangeArr[0].length).fill(1).map((cur, index) => index);
            }
            this.dateModel
                .refresh(nextValue, rangeArr, dateOrTime, unitsInline, format, loop)
                .deepUpdateMultiPickerState();
        } else {
            this.dateModel.updateDateTime(nextValue);
        }

        this.setState({ ...this.dateModel.multiPickerState, levels: this.levels });
    }

    _handleOnChange(item, level) {
        const levels = this.levels,
            dateModel = this.dateModel,
            onChangeValue = new Array(levels.length);
        onChangeValue[level] = item.value;
        dateModel.updateDateTime(onChangeValue);

        const newValueState = levels.map(cur => dateModel.multiPickerState[cur].value).join('-');
        this.props.onChange && this.props.onChange(newValueState, item, level);
    }

    render() {
        const isDateMode = this.props.dateOrTime === 'date';
        return (
            <div className={`yo-${isDateMode ? 'date' : 'time'}picker ${this.props.extraClass}`}>
                {this.state.levels.map((optId, level) =>
                    <Picker
                        key={`picker${level}`}
                        stopPropagation={true}
                        options={this.state[optId].options}
                        value={this.state[optId].value}
                        unit={this.props.unitsAside[level]}
                        looped={this.props.loop[level]}
                        onChange={item => {
                            this._handleOnChange(item, level);
                        }}
                        height={this.props.height}
                        extraClass={this.props.pickerExtraClass[level] || ''}
                    />
                )}
            </div>
        );
    }
}

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = DateTimePickerDefaultProps;
