/**
 * @component Calendar
 * @version 3.0.0
 * @description 日历组件,基于groupList组件实现
 *
 * 可通过以下两种方式定义日期范围:
 *  - 传入具体的起、始日期
 *  - 传入距离系统当日的间隔天数,默认90
 *
 * 默认selectionStart、selectionEnd可选择同一天
 * @author qingguo.xu
 */

import CalendarCore from './CalendarCore.js';
import CalendarItem from './CalendarItem.js';
import GroupList from '../../grouplist/src/';
import React, { PropTypes, Component } from 'react';
import './style.scss';

const defaultProps = {
    selectionExtraClass: '',
    duration: 90,
    extraClass: '',
    selectionStart: '',
    selectionEnd: '',
    allowSingle: false,
    onChange(obj) {
    }
};

const propTypes = {
    /**
     * @property selectionExtraClass
     * @description 选择区间日期样式
     * @type PropTypes.string
     */
    selectionExtraClass: PropTypes.string,
    /**
     * @property duration
     * @description 日期范围
     * @type PropTypes.oneOf([PropTypes.number, PropTypes.array])
     * @default 90
     */
    duration: PropTypes.oneOf([PropTypes.number, PropTypes.array]),
    /**
     * @property extraClass
     * @description 额外样式
     * @type PropTypes.string
     */
    extraClass: PropTypes.string,
    /**
     * @property selectionStart
     * @description 默认入住时间
     * @type PropTypes.string
     */
    selectionStart: PropTypes.string,
    /**
     * @property selectionEnd
     * @description 默认离店时间
     * @type PropTypes.string
     */
    selectionEnd: PropTypes.string,
    /**
     * @property allowSingle
     * @description 是否允许单点
     * @type PropTypes.bool
     */
    allowSingle: PropTypes.bool,
    /**
     * @property onChange
     * @type function
     * @param {Object} obj 入、离店日期
     * @description 日期点击时调用函数
     */
    onChange: PropTypes.func,
};

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        const { duration, selectionStart, selectionEnd } = props;
        this.calendarModel = new CalendarCore(duration, selectionStart, selectionEnd);
        this.state = {
            data: this.calendarModel.dataSource
        };
    }

    componentWillMount() {
        // 注册点击check事件, 在CalendarCore理触发
        this.calendarModel.registerEventHandler('check', obj => this.props.onChange(obj));
    }

    componentWillReceiveProps(nextProps) {
        const { duration, selectionStart, selectionEnd } = nextProps;
        this.setState({
            data: this.calendarModel.getData(duration, selectionStart, selectionEnd)
        });
    }

    render() {
        const { selectionExtraClass, extraClass, allowSingle } = this.props;
        return (
            <section className={`yo-calendar ${extraClass}`}>
                <ul className="week-bar">
                    <li className="weekend">日</li>
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li className="weekend">六</li>
                </ul>
                <GroupList
                    itemActiveClass={null}
                    renderGroupItem={item=><CalendarItem
                        selectionExtraClass={selectionExtraClass}
                        click={(str)=>this.calendarModel.handleChange(str, allowSingle)}
                        week={item.week}
                        isRender={item.isRender}
                    />}
                    dataSource={this.state.data}
                    extraClass="calendar-init"
                />
            </section>
        )
    }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
