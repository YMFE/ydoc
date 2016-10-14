/**
 * 加载动画组件
 * @component Loading
 * @example
 * <Loading text="text" />
 * @description 加载动画组件
 * @author zongze.li
 */

import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import Modal from '../../modal/src';
import './style.scss';

const container = document.createElement('div');
document.body.appendChild(container);

let that = null;

const propTypes = {
    text: PropTypes.string,
    extraClass: PropTypes.string,
};
const LoadingDefaultProps = {
    /**
     * @property text
     * @type PropTypes.string
     * @default ''
     * @description 组件属性：loading伴随动画图标的文字
     */
    text: '',
    /**
     * @property extraClass
     * @type PropTypes.string
     * @default ''
     * @description 组件属性：附加给Loading组件的额外class
     */
    extraClass: '',
};

const Loading = props => (
    <div
        className={`yo-loading ${props.extraClass}`}
    >
        <i className="yo-ico" />
        {!!props.text.toString().length && <span>{props.text}</span>}
    </div>
);

Loading.propTypes = propTypes;
Loading.defaultProps = LoadingDefaultProps;
export default Loading;


const loadingApiPropTypes = {
    text: PropTypes.string,
    extraClass: PropTypes.string,
    show: PropTypes.bool,
};
const loadingApiDefaultProps = {
    /**
     * @skip
     * @property text
     * @type PropTypes.string
     * @default ''
     * @description loading伴随动画图标的文字
     */
    text: '',
    /**
     * @skip
     * @property extraClass
     * @type PropTypes.string
     * @default ''
     * @description 附加给Loading组件的额外class
     */
    extraClass: '',
    /**
     * @skip
     * @property show
     * @type PropTypes.bool
     * @default false
     * @description true为显示加载中动画，false为隐藏
     */
    show: false,
};

class LoadingApi extends Component {

    constructor(props) {
        super(props);
        const { text, extraClass, show } = props;
        this.state = {
            text,
            extraClass,
            show,
        };
        that = this;
    }

    render() {
        return (
            <Modal
                align="center"
                show={this.state.show}
            >
                <Loading
                    text={this.state.text}
                    extraClass={`${this.state.extraClass}`}
                />
            </Modal>
        );
    }
}
LoadingApi.propTypes = loadingApiPropTypes;
LoadingApi.defaultProps = loadingApiDefaultProps;

ReactDom.render(<LoadingApi />, container);

/**
 * 加载动画api
 * @component loading
 * @example
 * loading.show('加载中', 'extraClass');
 * loading.hide();
 * @type {Object}
 * @version 3.0
 * @author zongze.li
 */
export const loading = {
    /**
     * show展示
     * @method show
     * @category loading
     * @version 3.0
     * @param  {String} text       loading时显示的文字；如果不传此参数，会保留上次设置的text <3.0>
     * @param  {String} extraClass 额外样式类；如果不传此参数，会保留上次设置的text
     * @description api方法：显示Loding框
     */
    show: (text, extraClass) => {
        const data = { show: true };
        if (text !== undefined) data.text = text;
        if (extraClass !== undefined) data.extraClass = extraClass;

        that.setState(data);
    },
    /**
     * hide隐藏
     * @method hide
     * @category loading
     * @version 3.0
     * @description api方法：隐藏Loding框
     */
    hide: () => {
        that.setState({ show: false });
    }
};

