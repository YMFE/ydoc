/**
 * @component Number
 * @version 3.0.0
 * @description
 *
 * 可设置组件显示的最大值、最小值,每次增加或减少的步长
 *
 * 每次点击加减按钮,数字加减一次步长,超过设置范围,按钮不可点击
 *
 * 同时,可手动输入任意字符,若输入的不是数字,会自动回退到之前的数字,
 *
 * 超过边界值,会自动设定为边界值。
 *
 * 如果输入'-'或'0',会自动格式化符合格式的0。
 *
 * 支持小数、负数形式
 * @author qingguo.xu
 */

import '../../common/tapEventPluginInit';
import React, {Component, PropTypes} from 'react';
import './style.scss';

let defaultProps = {
    value: 0,
    step: 1,
    min: -10000,
    max: 10000,
    dotNum: 0,
    extraClass: '',
    disable: false,
    inputDisable: false,
    onChange() {
    },
};

let propTypes = {
    /**
     * @property value
     * @description number显示的值
     * @type {number}
     * @default 0
     */
    value: PropTypes.number.isRequired,
    /**
     * @property step
     * @description 单次加减的步长
     * @type {Number}
     * @default 1
     */
    step: PropTypes.number,
    /**
     * @property min
     * @description 最小值
     * @type {Number}
     * @default -10000
     */
    min: PropTypes.number,
    /**
     * @property max
     * @description 最大值
     * @type {Number}
     * @default 10000
     */
    max: PropTypes.number,
    /**
     * @property dotNum
     * @description 显示的小数位数
     * @type {Number}
     * @default 0, 不显示小数
     */
    dotNum: PropTypes.number,
    /**
     * @property extraClass
     * @description 额外样式类名
     * @type {String}
     */
    extraClass: PropTypes.string,
    /**
     * @property disable
     * @description 组件可不可用
     * @type {Boolean}
     * @default false
     */
    disable: PropTypes.bool,
    /**
     * @property inputDisable
     * @description 是否可以手动输入修改数字
     * @type {Boolean}
     * @default false
     */
    inputDisable: PropTypes.bool,
    /**
     * @property onChange
     * @description 修改数字时触发的回调函数
     * @type {Function}
     */
    onChange: PropTypes.func.isRequired,
};

export default class Number extends Component {
    constructor(props) {
        super(props);
        const {value, step, min, max, dotNum, disable, inputDisable} = props;
        this.state = {
            min,
            max,
            step,
            value,
            dotNum,
            disable,
            inputDisable,
            plusDisable: false,
            minusDisable: false,
        };
        this._node = null;
        if (isNaN(value)) {
            throw new Error('不合法的value');
        }
        this.cachedInput = value;
    }

    /**
     * minusValue 减号触发的函数
     * @param val {String} input输入框的value值
     */
    minusValue(val) {
        if (this.state.minusDisable) {
            return;
        }
        val = parseFloat(val) || 0;
        val -= this.state.step;
        this.wrapChange(val);
    }

    /**
     * plusValue 加好触发的函数, 参数为string形式,通过'+'运算符转为Number类型
     * @param val {String}
     */
    plusValue(val) {
        if (this.state.plusDisable) {
            return;
        }
        val = parseFloat(val) || 0;
        val += this.state.step;
        this.wrapChange(val);
    }

    /**
     * 返回一个合法的value
     * 不合法的情况包括:
     * value是NaN,这时候返回上一个合法的value
     * value>max或者value<min,返回max或者min
     * 否则返回原来的value
     * @param value
     * @param min
     * @param max
     * @returns {Number}
     */
    getValidValue(value, min = this.props.min, max = this.props.max) {
        value = parseFloat(value);
        if (isNaN(value)) {
            return parseFloat(this.cachedInput);
        }
        else if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }
        return value;
    }

    /**
     * 重新渲染Number组件时更新组件的状态
     * @param obj {Object} this.state对象形式
     */
    resetState(obj) {
        obj.step = parseFloat(obj.step) || 0;
        obj.max = parseFloat(obj.max) || 0;
        obj.min = parseFloat(obj.min) || 0;
        let {disable, value, min, max, dotNum} = obj;
        // 格式化更新的数字
        value = this.getValidValue(value, min, max).toFixed(dotNum);

        // 组件不可用时, 输入框和加减按钮均不可用
        if (disable) {
            this.setState({value, disable, inputDisable: true, plusDisable: true, minusDisable: true});
            return;
        }
        //这里的比较要用toFixed以后的值
        //设想这种场景,用户输入0.3,min设为0,步长是0,那么显示在input的是0
        //但是value仍然是0.3,如果用0.3和min比较,显然0.3大于min,这时候minusDiable是false
        //结果就是input显示0,但是-按钮并没有被禁用,这是不正确的
        if (parseFloat(value) === max) {
            obj.plusDisable = true;
        }
        if (parseFloat(value) === min) {
            obj.minusDisable = true;
        }
        obj.value = value;
        this.setState(obj);
    }

    componentWillMount() {
        this.resetState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        const newState = Object.assign(
            {},
            this.state,
            nextProps,
            {
                plusDisable: false,
                minusDisable: false,
            },
        );
        this.resetState(newState);
    }

    /**
     * 在处理onChange的参数时要非常小心,因为允许用户通过键盘输入,可能会输入一个不符合dotNum的数字
     * 例如domNum=0,step=1,输入0.3的情况
     * 这时候实际上组件会自动纠错,将0.3转化成0,这时候onChange的应该是纠错以后的value
     * 还有可能出现用户输入非法字符例如aaa,这时候会通过getValidValue来恢复上一次的合法输入
     * @param value
     * @returns {Number}
     */
    wrapChange(value) {
        value = parseFloat(this.getValidValue(value).toFixed(this.state.dotNum));
        this.props.onChange(value);
    }

    render() {
        let {inputDisable, plusDisable, minusDisable} = this.state;
        return (
            <div className={"yo-number " + this.props.extraClass }>
                <span className={"minus " + (minusDisable ? "disabled" : "")}
                      onTouchTap={()=>this.minusValue(this._node.value)}>-</span>
                <input className="input " type="text" value={this.state.value}
                       disabled={inputDisable ? "disabled" : ""}
                       ref={target => this._node = target}
                       onChange={evt=> {
                           // 允许使用者输入任意字符,在blur的时候再去检测他的输入是否合法
                           this.setState({value: evt.target.value})
                       }}
                       onBlur={evt => {
                           this.wrapChange(evt.target.value);
                       }}
                       onFocus={evt=> {
                           // 保存当前的value,这个value一定是合法的
                           // 如果输入的字符不合法,就使用保存的value进行恢复
                           // 同时,需要禁止+-按钮的点击
                           this.cachedInput = evt.target.value;
                           this.setState({plusDisable: true, minusDisable: true});
                       }}
                />
                <span className={"plus " + (plusDisable ? "disabled" : "")}
                      onTouchTap={()=>this.plusValue(this._node.value)}>+</span>
            </div>
        )
    }
}

Number.defaultProps = defaultProps;
Number.propTypes = propTypes;
