/**
 * @component ActionSheet
 * @description 从屏幕底部弹出的容器组件
 */
import React, {Component, PropTypes} from 'react';
import Modal from "../../modal/src";
import "./style.scss";
const noop = ()=> {
};
const defaultProps = {
    height: "auto",
    duration: 200,
    onMaskClick: noop,
    onShow: noop,
    onHide: noop
};

const propTypes = {
    /**
     * @property height
     * @type number/string
     * @default 'auto'
     * @description ActionSheet内容区的高度
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * @property show
     * visible?
     * @type bool
     * @description ActionSheet是否处于打开状态,必须
     */
    show: PropTypes.bool.isRequired,
    /**
     * @property onMaskTap
     * onMaskTap
     * @type function
     * @default ()=>{}
     * @description 点击遮罩的事件回调
     */
    onMaskTap: PropTypes.func,
    /**
     * @property duration
     * @type number
     * @default 200
     * @description 打开/收起动画持续时间
     */
    duration: PropTypes.number,
    /**
     * @property onShow
     * @type function
     * @default ()=>{}
     * @description 打开时触发的回调
     */
    onShow: PropTypes.func,
    /**
     * @property onHide
     * @type function
     * @default ()=>{}
     * @description 关闭时触发的回调
     */
    onHide: PropTypes.func,
    /**
     * @property maskExtraClass
     * 需要这么多extraclass吗?
     * @type string
     * @default null
     * @description 附加给遮罩层的额外类名
     */
    maskExtraClass: PropTypes.string,
    /**
     * @property contentExtraClass
     * @type string
     * @default null
     * @description 附加给模态框内容区的额外class
     */
    contentExtraClass: PropTypes.string,
    /**
     * @property maskOffset
     * @type array
     * @default [0,0]
     * @description 蒙层偏移,使用方式和contentOffset有所不同。
     * 这里的偏移量指的是蒙层遮盖页面的范围,例如[0,44]表示蒙层从top:44px处开始遮罩,直到容器底部。
     */
    maskOffset: PropTypes.arrayOf(PropTypes.number),
    /**
     * @property zIndex
     * @type number
     * @default 1000
     * @description 内容区的zIndex,默认为1000
     */
    zIndex: PropTypes.number
};

export default class ActionSheet extends Component {

    render() {
        const {
            show,
            height,
            onShow,
            onHide,
            duration,
            onMaskTap,
            maskExtraClass,
            maskOffset,
            contentExtraClass,
            zIndex
        }=this.props;

        return (
            <Modal
                show={show}
                onShow={onShow}
                onHide={onHide}
                align="bottom"
                height={height}
                width={'100%'}
                animation={{animation: ['action-sheet-up', 'action-sheet-down'], duration}}
                onMaskTap={onMaskTap}
                maskExtraClass={maskExtraClass}
                maskOffset={maskOffset}
                zIndex={zIndex}
            >
                {this.props.children}
            </Modal>
        );
    }
}

ActionSheet.defaultProps = defaultProps;
ActionSheet.propTypes = propTypes;
