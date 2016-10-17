/**
 * @author qingguo.xu
 * 某一天的数据显示
 */
import '../../common/tapEventPluginInit.js';
import CalendarCore from './CalendarCore.js';
import React, { Component } from 'react';

export default class extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * 点击日期的函数
     * @param node {Object} 点击事件的目标节点
     */
    handleClick(node) {

        // 点击到具体的数字情况, 将node转成li节点
        if (node.dataset.parent) {
            node = node.parentNode;
        }
        node.dataset.date = node.dataset.date.replace(/\//g, '-');
        this.props.click(node.dataset.date)
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.isRender !== nextProps.isRender) {
            return true;
        }
        return nextProps.isRender;
    }

    render() {
        const weeks = this.props.week.map((item, i) => {
            const day = item.date + '-' + item.day;
            let classNames = '';
            if (item.today) {
                classNames += 'today ';
            }
            if (item.weekend) {
                classNames += 'weekend ';
            }
            if (!!item.holiday) {
                classNames += 'holiday ';
            }
            if (item.isCheckIn) {
                classNames += 'start ';
            }
            if (item.isCheckOut) {
                classNames += 'end ';
            }
            if (item.isCheck) {
                classNames += `range ${this.props.selectionExtraClass} `;
            }
            if (item.disabled) {
                classNames += 'disabled ';
            }
            return (
                <li
                    data-role="dpl-item"
                    key={i}
                    data-date={day}
                    onTouchTap={!item.disabled ? (evt)=>this.handleClick(evt.target) : null}
                    className={classNames}
                >
                    {!item.empty ? (<span data-parent={true} className="day">{item.day}</span>) : null}
                    {item.today ? (<ins data-parent={true} className="special">今天</ins>) : null}
                    {item.holiday ? (<ins data-parent={true} className="special">{item.holiday}</ins>) : null}
                </li>
            )
        });

        return (
            <ul className='week'>{weeks}</ul>
        )
    }
}
