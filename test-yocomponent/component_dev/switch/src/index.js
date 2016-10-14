/**
 * @component Switch
 * @author eva.li
 */

import './style.scss';
import React, { Component, PropTypes } from 'react';
const ALLOWANCE = 4;
const propTypes = {
  /**
   * 禁用swirch组件
   * @property disabled
   * @type boolean
   */
    disabled: PropTypes.bool,
    /**
     * 当前switch组件的值
     * @property checkd
     * @type boolean
     */
    checked: PropTypes.bool,
    /**
     * extraClass 额外样式
     * @property extraClass
     * @type string
     */
    extraClass: PropTypes.string,
    /**
     * onChange 方法
     * @property onChange
     * @type function
     */
    onChange: PropTypes.func,
    /**
     * activeColour 响应颜色
     * @property activeColour
     * @type string
     */
    activeColour: PropTypes.string,
    /**
     * defaultColour 关闭时的颜色
     * @property defaultColour
     * @type string
     */
    defaultColour: PropTypes.string
};

const defaultProps = {
    disabled: false,
    checked: true,
    activeColour: '#4bd763',
    defaultColour: '#fafafa'
};

class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMoving: false
        };
        this.touchstart = this.touchstart.bind(this);
        this.touchmove = this.touchmove.bind(this);
        this.touchend = this.touchend.bind(this);
        this.touchcancel = this.touchcancel.bind(this);
    }

    componentDidMount() {
        this.handleDOM =
            this.handleDOM
                ? ''
                : this.widgetDOM.querySelector('.handle');
        this.trackDOM =
            !this.handleDOM
                ? ''
                : this.widgetDOM.querySelector('.track');
        const line = this.handleDOM.clientWidth;
        this.maxline = this.trackDOM.clientWidth - line * 1.2 - 2;
    }

    touchstart(e) {
        e.preventDefault();
        e.stopPropagation();
        this.touchLocateStart = e.touches[0].clientX;
        const translateX = this.props.checked
            ? this.maxline
            : 0;
        this._setCSS(translateX);
        this.setState({
            isMoving: true
        });
    }
    touchmove(e) {
        e.preventDefault();
        e.stopPropagation();
        const basic = this.props.checked ? this.maxline : 0;
        let translateX = e.touches[0].clientX - this.touchLocateStart + basic;
        if (Math.abs(translateX - basic) > ALLOWANCE) {
            translateX = translateX < this.maxline / 2 ? 0 : this.maxline;
            this._setCSS(translateX);
            this.touchmoved = true;
        }
    }
    touchend(e) {
        e.preventDefault();
        e.stopPropagation();
        const prevresult = this.props.checked;
        let result;
        if (this.touchmoved) {
            // 响应滑动事件
            const translateX = e.changedTouches[0].clientX - this.touchLocateStart + this.maxline;
            if (translateX < this.maxline / 2) {
                result = false;
            } else {
                result = true;
            }
        } else {
            // 响应tap事件
            result = !prevresult;
        }
        if (result !== prevresult) {
            this.props.onChange(result);
        }
        this.setState({
            isMoving: false
        });
        this._setCSS();
        this.touchmoved = false;
    }

    touchcancel(e) {
        e.preventDefault();
        e.stopPropagation();
        this._setCSS();
        this.touchmoved = false;
        this.setState({
            isMoving: false
        });
    }

    _setCSS(translateX) {
        if (arguments.length) {
            this.handleDOM.style.transform = `translateX(${translateX}px) translateZ(0)`;
            this.handleDOM.style.webkitTransform = `translateX(${translateX}px) translateZ(0)`;
            // debugger
            this.trackDOM.style.backgroundColor =
                translateX === 0
                    ? this.props.defaultColour
                    : this.props.activeColour;
        } else {
            this.handleDOM.style.transform = '';
            this.handleDOM.style.webkitTransform = '';
            this.trackDOM.style.backgroundColor = '';
        }
    }

    render() {
        const classlist = ['yo-switch'];
        if (this.props.extraClass) classlist.push(this.props.extraClass.split(' '));
        return (
          <label
            className={classlist.join(' ')}
            ref={(node) => {
                if (node) {
                    this.widgetDOM = node;
                }
            }}
            onTouchStart={
                this.props.disabled
                    ? null
                    : this.touchstart
            }
            onTouchEnd={
                this.props.disabled
                    ? null
                    : this.touchend
            }
            onTouchMove={
                this.props.disabled
                    ? null
                    : this.touchmove
            }
            onTouchCancel={
                this.props.disabled
                    ? null
                    : this.touchcancel
            }
          >
            <input
              type="checkbox"
              disabled={this.props.disabled}
              checked={this.props.checked}
              onChange={() => {
              }}
            />
            <div
              className={this.state.isMoving ? 'track moving' : 'track'}
            >
              <span className="handle"></span>
            </div>
          </label>
        );
    }
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;

export default Switch;
