/**
 * @component Dialog
 * @version 3.0.0
 * @description
 *
 * 可自定义弹层内容的大小、显示位置和北京阴影遮罩层的上偏移、左偏移
 *
 * 弹层显隐的动画可使用自定义的css3动画或modal组件默认的fade动画
 *
 * 复用modal组件
 * @author qingguo.xu
 */
import React, {Component, PropTypes} from 'react';
import Modal from '../../modal/src';
import './style.scss';

let defaultProps = {
    show: false,
    effect: false,
    title: '',
    content: '',
    width: 'auto',
    height: 'auto',
    align: 'center',
    zIndex: 1000,
    contentOffset: [0, 0],
    maskOffset: [0, 0],
    extraClass: '',
    okText: '确定',
    cancelText: '取消',
    onOk: function () {
        console.warn("you haven't define the ok function, the dialog will not close!");
    },
    onCancel: function () {
        console.warn("you haven't define the cancel function, the dialog will not close!");
    },
};

let propTypes = {
    /**
     * @property show
     * @description 是否显示
     * @type PropTypes.bool
     * @default false
     */
    show: PropTypes.bool,
    /**
     * @property effect
     * @description 显隐时采用的动画
     * @type PropTypes.oneOfType([
     * PropTypes.bool,
     * PropTypes.string,
     * PropTypes.shape({
     *       animation: PropTypes.arrayOf(PropTypes.string).isRequired,
     *        duration: PropTypes.number.isRequired
     *    })
     * ]),
     * @default false
     */
    effect: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.shape({
            animation: PropTypes.arrayOf(PropTypes.string).isRequired,
            duration: PropTypes.number.isRequired
        })
    ]),
    /**
     * @property title
     * @description 标题
     * @type PropTypes.oneOfType([PropTypes.element, PropTypes.string])
     */
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
     * @property content
     * @description 内容
     * @type PropTypes.oneOfType([PropTypes.element, PropTypes.string])
     */
    content: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    /**
     * @property width
     * @description 宽度
     * @type PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
     * @default 'auto'
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * @property height
     * @description 高度
     * @type PropTypes.oneOfType([PropTypes.number, PropTypes.string])
     * @default 'auto'
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * @property align
     * @description 对话框垂直显示位置
     * @type PropTypes.oneOf(['top', 'center', 'bottom'])
     * @default "center"
     */
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    /**
     * @property zIndex
     * @description Modal组件的z-index
     * @type PropTypes.number
     * @default 1000
     */
    zIndex: PropTypes.number,
    /**
     * @property contentOffset
     * @description 弹层内容的X轴、Y轴偏移量
     * @type PropTypes.arrayOf(PropTypes.number)
     * @default [0, 0]
     */
    contentOffset: PropTypes.arrayOf(PropTypes.number),
    /**
     * @property maskOffset
     * @description 遮罩层的X轴、Y轴偏移量
     * @type PropTypes.arrayOf(PropTypes.number)
     * @default [0, 0]
     */
    maskOffset: PropTypes.arrayOf(PropTypes.number),
    /**
     * @property extraClass
     * @description 额外样式类
     * @type PropTypes.string
     */
    extraClass: PropTypes.string,
    /**
     * @property okText
     * @description 确定按钮显示文字
     * @type PropTypes.string
     */
    okText: PropTypes.string,
    /**
     * @property cancelText
     * @description 取消按钮显示文字
     * @type PropTypes.string
     */
    cancelText: PropTypes.string,
    /**
     * @property onOk
     * @description 是否显示确定按钮或者确定按钮的回调函数
     * @type PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
     */
    onOk: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    /**
     * @property onCancel
     * @description 是否显示取消按钮或者取消按钮的回调函数
     * @type PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
     */
    onCancel: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};

export default class Dialog extends Component {
    render() {
        let {show, title, effect, content, width, height, align, zIndex, contentOffset, maskOffset, extraClass, okText, cancelText, onOk, onCancel} = this.props,
            cancelBtnNode = onCancel ?
                <a href="javascript:void(0)" className="yo-btn yo-btn-dialog yo-btn-l " onTouchTap={onCancel}>{cancelText}</a>
                : null,
            okBtnNode = onOk ?
                <a href="javascript:void(0)" className="yo-btn yo-btn-dialog yo-btn-l " onTouchTap={onOk}>{okText}</a>
                : null;
        return (
            <Modal
                align={align}
                show={show}
                width={width}
                height={height}
                animation={effect ? effect : ''}
                zIndex={zIndex}
                contentOffset={contentOffset}
                maskOffset={maskOffset}
                onMaskClick={() => {
                }}
                extraClass="yo-dialog-component"
            >
                <div className={"yo-dialog " + extraClass} style={{width: width, height: height}}>
                    <header className="hd">
                        <h2 className="title ">{title}</h2>
                    </header>
                    <div className="bd ">{content}</div>
                    <footer className="ft">
                        {cancelBtnNode}
                        {okBtnNode}
                    </footer>
                </div>
            </Modal>
        );
    }
}

Dialog.defaultProps = defaultProps;
Dialog.propTypes = propTypes;
