/**
 * @component Popup
 * @version 3.0.0
 * @description
 *
 * 显示内容宽度为窗口的宽度, 动画会popup动画的Popup组件
 *
 * 可分别设置内容区域的偏移量和遮罩层背景的偏移量
 *
 * 复用modal组件
 * @author qingguo.xu
 */
import Modal from '../../modal/src'
import React, {Component, PropTypes} from 'react';
import './style.scss';

const defaultProps = {
    /**
     * @property show
     * @description 组件是否显示
     * @type {Boolean}
     * @default false, 默认不显示
     */
    show: false,
    /**
     * @property duration
     * @description 组件显隐过程中动画执行的时间
     * @type {Number}
     * @default 200, 默认200ms
     */
    duration: 200,
    /**
     * @property height
     * @description 弹出内容的高度
     * @type {String | Number}
     * @default auto, 内容的高度
     */
    height: 'auto',
    /**
     * @property zIndex
     * @description 组件的z-index
     * @type {Number}
     * @default 1000
     */
    zIndex: 1000,
    /**
     * @property contentOffset
     * @description 内容的偏移量
     * @type {Array} left, top
     * @default [0, 0]
     */
    contentOffset: [0, 0],
    /**
     * @property maskOffset
     * @description 遮罩层偏移量
     * @type {Array} left, top
     * @default [0, 0]
     */
    maskOffset: [0, 0],
    /**
     * @property onMaskClick
     * @description 点击遮罩层触发的回调函数
     * @type {Function}
     */
    onMaskClick: ()=> {
    },
    /**
     * @property extraClass
     * @description 额外样式类
     * @type {String}
     */
    extraClass: '',
}

const propTypes = {
    show: PropTypes.bool,
    duration: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zIndex: PropTypes.number,
    contentOffset: PropTypes.arrayOf(PropTypes.number),
    maskOffset: PropTypes.arrayOf(PropTypes.number),
    onMaskClick: PropTypes.func,
    extraClass: PropTypes.string,
}

export default class Popup extends Component {
    render() {
        let {show, duration, height, zIndex, contentOffset, maskOffset, onMaskClick, extraClass} = this.props;
        return (
            <Modal
                align="top"
                show={show}
                animation={{animation: ['popup-down', 'popup-up'], duration: duration}}
                width={window.screen.width}
                height={height}
                zIndex={zIndex}
                onMaskClick={onMaskClick.bind(this)}
                contentOffset={contentOffset}
                maskOffset={maskOffset}
                contentExtraClass={extraClass}
            >
                {this.props.children}
            </Modal>
        )
    }
}

Popup.defaultProps = defaultProps;
Popup.propTypes = propTypes;
