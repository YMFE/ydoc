/**
 * @component SwipeMenu
 * @version 3.0.0
 * @description SwipeMenu组件
 *
 * 支持向右或向左单向滑动,显示菜单按钮
 *
 * 默认拖动距离超过菜单按钮的一半时,组件自动打开,否则组件回到关闭状态
 *
 * 组件拖动条可拖离足够远位置
 *
 * 组件处于开启状态时,下次拖动不作响应,且组件会自动关闭,可通过轻点方式来关闭组件
 * @example
 * PropTypes.arrayOf(
 *     PropTypes.shape({
 *         text: PropTypes.string.isRequired,
 *         className: PropTypes.string,
 *         onTap: PropTypes.func.isRequired,
 *   })
 * )
 * @author qingguo.xu
 */
import '../../common/tapEventPluginInit.js';
import Drag, { setTransform } from '../../common/drag.js';
import React, { Component, PropTypes, isValidElement } from 'react';
import './style.scss';

const defaultProps = {
    action: [],
    direction: 'left',
    extraClass: '',
    disable: false,
    onTouchStart() {
    },
    onTouchMove() {
    },
    onTouchEnd() {
    },
    onOpen() {
    },
    onClose() {
    },
};

const propTypes = {
    /**
     * @property action
     * @example
     * PropTypes.arrayOf(
     *     PropTypes.shape({
     *         text: PropTypes.string.isRequired,
     *         className: PropTypes.string,
     *         onTap: PropTypes.func.isRequired,
     *   })
     * )
     * @description 滑动菜单按钮内容,类名,回调函数
     * @type Array
     */
    action: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            className: PropTypes.string,
            onTap: PropTypes.func.isRequired,
        })
    ),
    /**
     * @property open
     * @description 组件初始状态,是否打开
     * @type PropTypes.bool
     */
    open: PropTypes.bool,
    /**
     * @property direction
     * @description 拖动方向
     * @type PropTypes.oneOf(['left', 'right'])
     * @default left
     */
    direction: PropTypes.oneOf(['left', 'right']),
    /**
     * @property extraClass
     * @description 额外样式类
     * @type PropTypes.string
     */
    extraClass: PropTypes.string,
    /**
     * @property disable
     * @description 组件是否可用
     * @type PropTypes.bool
     */
    disable: PropTypes.bool,
    /**
     * @property onTouchStart
     * @description touchStart时期触发的回调
     * @type PropTypes.func
     */
    onTouchStart: PropTypes.func,
    /**
     * @property onTouchMove
     * @description touchMove时期触发的回调
     * @type PropTypes.func
     */
    onTouchMove: PropTypes.func,
    /**
     * @property onTouchEnd
     * @description touchEnd时期触发的回调
     * @type PropTypes.func
     */
    onTouchEnd: PropTypes.func,
    /**
     * @property onOpen
     * @description 按钮打开时期触发的回调
     * @type PropTypes.func
     */
    onOpen: PropTypes.func,
    /**
     * @property onClose
     * @description 按钮关闭时期触发的回调
     * @type PropTypes.func
     */
    onClose: PropTypes.func,
};

export default class SwipeMenu extends Component {
    constructor(props) {
        super(props);
        this.drag = null;

        // 标志, 组件是否在返回, 处理不能同时返回又向外拖的情况
        this.isBack = false;
        this.actBtn = null;

        // action菜单按钮的宽度
        this.actBtnWidth = 0;
        this.startX = 0;
        this.timer = null;
    }

    /**
     * reset 根据open的参数，确定组件关闭
     * @param open {boolean} 是否开启
     * @param direction {string} 组件拖动的方向
     */
    reset(open, direction) {
        if (open === undefined) {
            return;
        }
        const resetX = open ? direction == 'right' ? this.actBtnWidth : -this.actBtnWidth : 0;
        if (this.dragEvt) this.dragEvt.setMove(resetX);
        this.isBack = false;
        setTransform({ node: this.drag, distanceX: resetX });
    }

    componentDidMount() {
        const { open, direction } = this.props;
        this.actBtnWidth = this.actBtn.offsetWidth;
        this.reset(open, direction);
        this.dragEvt = new Drag({ node: this.drag, aniClass: 'transition' });
    }

    componentWillReceiveProps(nextProps) {
        this.reset(nextProps.open, this.props.direction);
    }

    /**
     * 获取拖动的距离, 作为common/drag.js 中dragMove的Middleware
     * 主要处理超过最大值时缓慢拖动效果
     * @param distanceX {Number} 实际拖动距离, 由drag.js传入
     * @returns {*} 组件translate距离
     */
    getMoveDistance(distanceX) {
        if (this.props.direction == 'right' && distanceX > 0) {
            if (distanceX > this.actBtnWidth * 1.5) {
                return this.actBtnWidth + 0.35 * distanceX;
            }
            return distanceX;
        }
        if (this.props.direction == 'left' && distanceX < 0) {
            if (Math.abs(distanceX) > this.actBtnWidth * 1.5) {
                return -this.actBtnWidth + 0.35 * distanceX;
            }
            return distanceX;
        }
        return 0;
    }

    /**
     * 组件最终拖动的距离, 由此决定组件最终状态
     * 作为common/drag.js里的dragEnd的middleware
     * @param distanceX dragEnd中实际拖动的距离
     * @returns {*} 组件最后的translate距离
     */
    getEndDistance(distanceX) {
        const dir = this.props.direction;
        const max = this.actBtnWidth;
        if ((dir == 'left' && distanceX > 0) || (dir == 'right' && distanceX < 0)) {
            this.props.onClose();
            return 0;
        }
        const full = dir == 'left' ? -max : max;
        if (Math.abs(distanceX) > max / 2) {
            this.isBack = true;
            this.props.onOpen();
            return full;
        }
        this.props.onClose();
        return 0;
    }

    /**
     * 组件的状态转换过程, 是否清楚过渡动画, 完毕之后再加上
     * @param toStatus {Boolean} 目的状态是否是打开状态, true => open
     * @param isClearTransition {Boolean} 是否清楚组件动画
     */
    toggle(toStatus, isClearTransition) {
        if (!isClearTransition) {
            this.reset(toStatus, this.props.direction);
            return;
        }
        if (this.drag) this.drag.className = 'front ';
        this.reset(toStatus, this.props.direction);
        this.timer = setTimeout(() => {
            if (this.drag) this.drag.className = 'front transition';
        }, 300);
    }

    /**
     * @method 组件打开,是否无过渡动画
     * 返回给外部的回调函数, 为swipeMenuList特制,
     * @param isClearTransition {Boolean} 默认false, 有过渡动画
     */
    open(isClearTransition = false) {
        this.isBack = true;
        this.toggle(true, isClearTransition);
        setTimeout(()=> {
            this.props.onOpen();
        }, isClearTransition ? 300 : 0);
    }

    /**
     * @method 组件关闭,无过渡动画
     * 返回给外部的回调函数, 为swipeMenuList特制,
     * @param isClearTransition {Boolean}
     */
    close(isClearTransition = false) {
        this.isBack = false;
        this.toggle(false, isClearTransition);
        // 动画结束时触发onClose
        setTimeout(()=> {
            this.props.onClose();
        }, !isClearTransition ? 300 : 0);
    }

    render() {
        const { action, extraClass, disable, direction, onTouchStart, onTouchMove, onTouchEnd } = this.props;
        const style = direction == 'left' ? {} : { left: 0 };
        const actionElement = isValidElement(action) ? action : action.map((item, i)=> {
            return (
                <span
                    className={"item " + (item.className || '')}
                    key={i}
                    onTouchTap={()=>item.onTap(this)}T
                >{item.text}</span>
            )
        });
        return (
            <div className={"yo-swipemenu " + extraClass}>
                <div
                    className="front transition"
                    ref={ref=>this.drag = ref}
                    onTouchStart={evt=> {
                        if (disable) {
                            return;
                        }
                        this.dragEvt.dragStart(evt);
                        if (Math.abs(this.dragEvt.getMove()) > this.actBtnWidth / 2) {
                            this.isBack = true;
                            this.drag.className += 'transition';
                            this.dragEvt.refreshDrag();
                        }
                        onTouchStart();
                    }}
                    onTouchMove={evt=> {
                        if (disable || this.isBack) {
                            return;
                        }
                        this.dragEvt.dragMove(evt, this.getMoveDistance.bind(this));
                        onTouchMove();
                    }
                    }
                    onTouchEnd={evt=> {
                        if (disable || this.isBack) {
                            this.isBack = false;
                            return;
                        }
                        onTouchEnd();
                        this.dragEvt.dragEnd(evt, this.getEndDistance.bind(this))
                    }
                    }
                    onTouchCancel={evt=>this.dragEvt.dragCancel(evt)}
                >
                    {this.props.children}
                </div>
                <div
                    className="action" ref={ref=>this.actBtn = ref}
                    style={style}
                >
                    {actionElement}
                </div>
            </div>
        );
    }
}

SwipeMenu.defaultProps = defaultProps;
SwipeMenu.propTypes = propTypes;
