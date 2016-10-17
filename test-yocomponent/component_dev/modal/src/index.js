/**
 * @component Modal
 * @description 带遮罩层的模态弹层组件
 * @author jiao.shen
 */
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import "./style.scss";
import "../../common/tapEventPluginInit";

const defaultProps = {
    show: false,
    extraClass: '',
    contentExtraClass: '',
    align: 'center',
    onMaskTap: (evt)=> {
        console.log(evt);
    },
    contentOffset: [0, 0],
    maskOffset: [0, 0],
    zIndex: 1001,
    maskExtraClass: '',
    animation: '',
    onShow: ()=> {
    },
    onHide: ()=> {
    },
    width: "auto",
    height: "auto"
};

const propTypes = {
    /**
     * @property show
     * @type bool
     * @default false
     * @description 是否显示模态框
     */
    show: PropTypes.bool,
    /**
     * @property extraClass
     * @type string
     * @default null
     * @description 附加给模态框容器(包含了内容区和蒙层)的额外class
     */
    extraClass: PropTypes.string,
    /**
     * @property contentExtraClass
     * @type string
     * @default null
     * @description 附加给模态框内容区的额外class
     */
    contentExtraClass: PropTypes.string,
    /**
     * @property align
     * @type string
     * @default center
     * @description 模态框的位置,默认为center。可选值为cetner/top/bottom
     */
    align: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
    /**
     * @property onMaskTap
     * @type function
     * @default ()=>{}
     * @description 点击蒙层时的回调
     */
    onMaskTap: PropTypes.func,
    /**
     * @property contentOffset
     * @type array
     * @default [0,0]
     * @description 内容区在水平/垂直方向上的偏移,例如[0,-100]可以使模态框内容区向上偏移100个像素
     */
    contentOffset: PropTypes.arrayOf(PropTypes.number),
    /**
     * @property maskOffset
     * @type array
     * @default [0,0]
     * @description 蒙层偏移,使用方式和contentOffset有所不同。
     * 这里的偏移量指的是蒙层遮盖容器的范围,例如[0,44]表示蒙层从top:44px处开始遮罩,直到容器底部
     */
    maskOffset: PropTypes.arrayOf(PropTypes.number),
    /**
     * @property zIndex
     * @type number
     * @default 1000
     * @description 内容区的zIndex,默认为1000
     */
    zIndex: PropTypes.number,
    /**
     * @property maskExtraClass
     * @type string
     * @default null
     * @description 蒙层的额外class
     */
    maskExtraClass: PropTypes.string,
    /**
     * @property onShow
     * @type function
     * @default ()=>{}
     * @description 打开模态框的事件回调
     */
    onShow: PropTypes.func,
    /**
     * @property onHide
     * @type function
     * @default ()=>{}
     * @description 关闭模态框的事件回调
     */
    onHide: PropTypes.func,
    /**
     * @property width
     * @type number/string
     * @default 'auto'
     * @description 内容区宽度,默认为auto,可以传入数字或者百分比
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * @property height
     * @type number/string
     * @default 'auto'
     * @description 内容区高度,默认为auto,可以传入数字或者百分比
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * @property animation
     * @type string/object
     * @default "none"
     * @description 打开/关闭动画
     * 有已经实现好的动画fade(淡入淡出效果),也可以自己传入classNames,实现定制的动画效果,例如
     * {animation:['action-sheet-up', 'action-sheet-down'],duration:200}
     * 数组中的第一个元素是打开模态框时附加到内容区的className,第二个是关闭时附加到内容区的className,duration是动画的持续时间,
     * action-sheet-up的css规则如下:
     * @keyframes action-sheet-up {
            0% {
                transform: translate3d(0, 100%, 0);
               }
            100% {
                transform: translate3d(0, 0, 0);
            }
          }
     */
    animation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            animation: PropTypes.arrayOf(PropTypes.string).isRequired,
            duration: PropTypes.number
        })
    ])
};

//默认提供的动画效果
const ANIMATION_MAP = {
    fade: {animation: ['fade-in', 'fade-out'], duration: 200}
};

class RealModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            animation: this.getAnimationClass(props.animation, props.show)
        };
    }

    /**
     * 根据动画名字和打开/关闭状态获取对应的animation属性配置
     * @param name
     * @param isShow
     * @returns {{name: string, duration: number}}
     */
    getAnimationClass(name, isShow) {
        let contentAnimation = '', duration = 0;

        if (name) {
            let targetMap = typeof this.props.animation === 'object' ? this.props.animation : ANIMATION_MAP[name];

            if (targetMap) {
                contentAnimation = targetMap.animation[isShow ? 0 : 1] + " ani";
                duration = targetMap.duration;
            }
        }

        return {name: contentAnimation, duration};
    }

    /**
     * 根据nextProps中的show属性更新内部state
     * @param nextProps
     */
    toggleShowStatus(nextProps) {
        const current = this.state.show;
        const next = nextProps.show;
        const {onShow, onHide}=this.props;
        //如果新属性的show是true并且模态框处于打开状态
        if (!next && current) {
            //提取需要指定的动画
            let animationData = this.getAnimationClass(nextProps.animation, next);
            clearTimeout(this.showTimeout);
            //先走关闭动画
            this.setState({animation: animationData});
            //等到动画结束后处理整个modal的show状态,并且保存timeout引用
            this.hideTimeout = setTimeout(()=> {
                this.setState({show: false});
                onHide();
            }, animationData.duration);
        }
        //on the opposite
        else if (next && !current) {
            //清理关闭timeout
            //写这一行的目的是用户可能在关闭的同时打开modal
            clearTimeout(this.hideTimeout);
            this.setState({show: next});
            this.contentDom.style.opacity = 0;

            //如果直接运行动画会出现闪烁,这里先将contentDom隐藏然后再运行动画
            this.showTimeout = setTimeout(()=> {
                this.setState({animation: this.getAnimationClass(nextProps.animation, next)});
                this.contentDom.style.opacity = 1;
                //动画完成后执行onShow回调
                setTimeout(()=> {
                    onShow();
                }, nextProps.animation.duration);
            }, 10);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.toggleShowStatus(nextProps);
    }

    componentDidMount() {
        if (this.props.show) {
            this.props.onShow();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.hideTimeout);
        clearTimeout(this.showTimeout);
    }

    render() {
        const {show, animation}=this.state;
        const {duration, name}=animation;
        const {
            extraClass,
            zIndex,
            onMaskTap,
            maskOffset,
            contentOffset,
            align,
            maskExtraClass,
            contentExtraClass,
            width,
            height
        }=this.props;
        const containerClass = ["yo-modal-container", extraClass, align].join(' ');
        const maskClass = ["yo-mask ui-mask", maskExtraClass].join(' ');
        const contentClass = ["yo-modal-content", contentExtraClass, name].join(' ');

        return (
            <div
                className={containerClass}
                style={Object.assign(
                    {
                        position: "absolute",
                        top: parseInt(maskOffset[1], 10),
                        left: parseInt(maskOffset[0], 10) || 0,
                        bottom: 0,
                        right: 0,
                        overflow: 'hidden'
                    },
                    show ? null : {display: 'none'}
                )}
            >
                <div
                    className={maskClass}
                    style={{
                        top: 0,
                        bottom: 0,
                        zIndex: zIndex - 1
                    }}
                    onTouchTap={(evt)=>onMaskTap(evt)}
                >
                </div>
                <div
                    className={contentClass}
                    ref={component=>this.contentDom = component}
                    style={{
                        position: 'relative',
                        marginTop: parseInt(contentOffset[1], 10) || 0,
                        marginLeft: parseInt(contentOffset[0], 10) || 0,
                        backgroundColor: 'white',
                        zIndex: zIndex,
                        WebkitAnimationDuration: duration + "ms",
                        animationDuration: duration + "ms",
                        width: width,
                        height: height
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

RealModal.defaultProps = defaultProps;
RealModal.propTypes = propTypes;

/**
 * 这个虚拟的组件将会利用renderSubtreeIntoContainer将Modal从原有的位置移动到body中
 */
export default class extends Component {

    appendWrapperToDocBody() {
        ReactDom.unstable_renderSubtreeIntoContainer(
            this,
            <RealModal {...this.props}>
                {this.props.children}
            </RealModal>,
            this.wrapper
        );
    }

    componentDidUpdate() {
        this.appendWrapperToDocBody();
    }

    componentDidMount() {
        this.wrapper = document.createElement('div');
        document.body.appendChild(this.wrapper);
        this.appendWrapperToDocBody();
    }

    componentWillUnmount() {
        document.body.removeChild(this.wrapper);
    }

    render() {
        return null;
    }
}
