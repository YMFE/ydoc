/**
 * @component Tooltip
 * @version 3.0.0
 * @description
 * 单一模式, 多个tooltip组件公用一个Div容器
 *
 * API形式, 返回一个对象,包含show/hide函数,支持简单的链式调用
 *
 * 传入提示内容通过show函数显示,默认显示2s,
 *
 * 可通过调用hide函数立刻取消Tooltip的显示
 * @author qingguo.xu
 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

let that = null,
    container = document.createElement('div'),

    defaultProps = {
        /**
         * @property show
         * @description 是否显示,默认false
         * @type {Boolean}
         * @default false
         * @skip
         */
        show: false,
    },

    propTypes = {
        show: PropTypes.bool,
    };

document.body.appendChild(container);

class TooltipReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            content: '',
            autoHideTime: 2000,
        };
        this._timer = null;
        that = this;
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.setState({ show: nextState.show });
        if (!!this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        this._timer = setTimeout(()=>this.setState({ show: false }), nextState.autoHideTime);
        return true;
    }

    componentWillUnmount() {
        clearTimeout(this._timer);
        document.body.removeChild(container);
    }

    render() {
        let { show, content } = this.state;
        return (
            <div
                className="yo-tooltip "
                style={{
                    display: this.state.show ? null : 'none'
                }}
            >{content}</div>
        )
    }
}

TooltipReact.propTypes = propTypes;
TooltipReact.defaultProps = defaultProps;

ReactDOM.render(<TooltipReact/>, container);

/**
 * Tooltip显隐函数
 * @returns {Object}
 */
export default {
    show(content = 'no content', autoHideTime = 2000) {
        that.setState({
            content: content,
            autoHideTime: autoHideTime,
            show: true,
        });
        return this;
    },
    hide: function () {
        that.setState({ show: false });
        return this;
    }
}
