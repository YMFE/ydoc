/*
 * @providesModule QScrollView
 */
'use strict';

import React, {PropTypes,Component} from 'react';
import ReactDOM from 'ReactDOM';
import StyleSheet from 'StyleSheet';
import PanResponder from 'PanResponder';
import View from 'View';
import Resizable from './Resizable';
import {TextInputState} from 'TextInput';
import fastdom from 'fastdom';

import EdgeInsetsPropType from 'EdgeInsetsPropType';
import PointPropType from 'PointPropType';
import ViewStylePropTypes from 'ViewStylePropTypes';
import StyleSheetPropType from 'StyleSheetPropType';
import noop from 'lodash/noop';








// const DIRECTIONLOCK_THRESHOLD = 5;
const BOUNCETIME = 600;
const PAGEINGTIME = 300;
const SCROLLMOVE_THRESHOLD = 5;
// const INDICATOR_MIN_LENGTH = 10;
const INDICATOR_MIN_SHOW_LENGTH = 40;
const INDICATOR_MIN_SHOW_WIDTH = 40;
const INDICATOR_GAP = 6;
const INDICATOR_GAP_EDGE = 3;
const INDICATOR_OPACITY = 0.4;


let commonTransform = 'transform' in document.body.style ? 'transform' : 'webkitTransform';



StyleSheet.inject(`
    .rn-scroller-vert{
        min-height:100%;
        width:100%;
    }

    .rn-scroller-hori{
        min-width:100%;
        height:100%;
    }

    .rn-scroller-hori > *{
        flex-shrink:0;
        -webkit-flex-shrink:0;
    }`);

const styles = StyleSheet.create({
    scrollView: {
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
    },
    scrollViewInset: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    scroller: {
        transform: [{
            translateX: 0
        }, {
            translateY: 0
        }, {
            translateZ: 0
        }],
        position: 'absolute',
    },
    scrollerHorizontal: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        overflowY: 'hidden',
    },

    refreshControl: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -35,
    },

    loadControl: {
        maxHeight: 35,
        height: 35
    },

    indicator: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 1,
        backgroundColor: '#444',
        opacity: 0,
        width: 0,
        height: 0,
        transform: [{
            translateX: 0
        }, {
            translateY: 0
        }, {
            translateZ: 0
        }],
    },

    indicatorHorizontal: {
        height: 2.5,
        bottom: INDICATOR_GAP_EDGE,
        left: INDICATOR_GAP,
    },

    indicatorVertical: {
        width: 2.5,
        right: INDICATOR_GAP_EDGE,
        top: INDICATOR_GAP,
    }
});



const utils = {
    getTime: Date.now || function getTime() {
        return new Date().getTime();
    },
    ease: {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function (k) {
                return k * (2 - k);
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function (k) {
                return Math.sqrt(1 - (--k * k));
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function (k) {
                var b = 4;
                return (k = k - 1) * k * ((b + 1) * k + b) + 1;
            }
        },
        bounce: {
            style: '',
            fn: function (k) {
                if ((k /= 1) < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            }
        },
        elastic: {
            style: '',
            fn: function (k) {
                var f = 0.22,
                    e = 0.4;

                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }

                return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
            }
        }
    },
    momentum(current, start, time, lowerMargin, wrapperSize, deceleration) {
        var distance = current - start,
            speed = Math.abs(distance) / time,
            destination,
            duration;

        deceleration = deceleration === undefined ? 0.0006 : deceleration;

        destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        } else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }

        return {
            destination: Math.round(destination),
            duration: duration
        };
    },
    getDeceleration(deceleration) {
        const FAST = 0.9;
        const NORMAL = 0.9994;
        if (typeof deceleration === 'string') {
            if (deceleration === 'fast') {
                return (1 - FAST).toFixed(4);
            }
            if (deceleration === 'normal') {
                return (1 - NORMAL).toFixed(4);
            }
        }
        return (1 - deceleration).toFixed(4);
    },
};



/**
 * @component QScrollView
 * @version >=0.20.0
 * @example ./ScrollView.js[1-72]
 * @description 包含了平台的 ScrollView 组件，并集成了触摸锁定的“响应者”系统
 * - 需要记住 ScrollView 必须有一个确定的高度才能正常工作。因为其本质是将一系列高度不确定的子组件
 * 放进一个高度确定的容器，然后通过滚动来进行操作。
 * - 要让 ScrollView 高度确定，要么直接给它设置高度（不推荐），要么确定其所有的父容器都已经绑定了高度。
 * - 在视图栈中的任一视图中忘记使用 `{flex:1}` 都会导致错误，你可以通过元素审查器轻松地定位 bug。
 * - 如果你想使用嵌套，内层元素会在滚动方面没有滚动余地时释放控制权，但注意always*系列为true的情况下也会被视为有滚动余地
 * ![ScrollView](./images/component/ScrollView.gif)
 */






 /**
  * 本组件是一个仿照IScroll实现的滚动组件
  * View结构
  * <View> --- 最外层View  position:relative,flex:1 ScrollView.style
  *    <Scroller> --- 内层滚动  transform，absolute，props.contentContainerStyle
  *      {refreshControl}
  *      {this.props.children}
  *      {loadControl}
  *    </Scroller>
  *    <View> --- 横向滚动条
  *    <View> --- 纵向滚动条
  * </View>
  * 1 .UI的改变有两类，一类是滚动时触发，包括scroller，stickyItem和进度条的translate和opacity，因需要频繁改变，不纳入react不需render。另一类是常规的纳入React。
  * 2. 为解决
  *    a.外部的不通过render的改变wrapper的大小，比如全屏，华为荣耀6收起或打开虚拟home栏，以及业务线中其他各种情况。
  *    b.Scroller的size改变时，比如内部按了一个按键，出来一个新的东西。
  *   以上两个refresh问题，Wrapper和Scroller通过Resizable组件实现。
  *   Resizable可监视div中的size事件，它增加了一个div标签（含有两个子div）和一个绑定在组件中的onScroll的事件，但不会真的在手指滚动时触发，只会在onsize时触发一到两次，所以这个性能方面还好。
  * 3. 本组件的Refresh是隐藏在父元素的上方，下拉时显示，但由于qrn的实现方法不同，导致含RefreshControl时，ScrollTo和监听事件的contentOffset.y多出了35，在scrollTo和_execEvent中进行处理。
 */


class QScrollView extends Component {
    static defaultProps = {
        contentInset: {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
        contentOffset: {
            x: 0,
            y: 0,
        },
        bounces: true,
        horizontal: false,
        showsVerticalScrollIndicator: true,
        showsHorizontalScrollIndicator: false,
        scrollEnabled: true,
        pagingEnabled: false,
        keyboardDismissMode: 'none',
        keyboardShouldPersistTaps: false,
        decelerationRate: 'normal',
    };
    static PropTypes = {
        ...View.propTypes,
        /**
         * 内容位移
         *
         * @property contentInset
         * @type EdgeInsetsPropType
         * @default {top: 0, left: 0, bottom: 0, right: 0}
         * @description 内容范围相对滚动视图边缘的坐标。
         */
        contentInset: EdgeInsetsPropType,
        /**
         * 初始位移
         *
         * @property contentOffset
         * @type PointPropType
         * @default {x: 0, y: 0}
         * @description 用来手动设置初始的滚动坐标。
         */
        contentOffset: PointPropType,
        /**
         * 水平弹性滚动
         *
         * @property alwaysBounceHorizontal
         * @type bool
         * @default 当horizontal={true}时默认值为true，否则为false。
         * @description 当此属性为true时，水平方向即使内容比滚动视图本身还要小，也可以弹性地拉动一截。
         */
        alwaysBounceHorizontal: PropTypes.bool,
        /**
         * 垂直弹性滚动
         *
         * @property alwaysBounceVertical
         * @type bool
         * @default 当horizontal={true}时默认值为false，否则为true。
         * @description 当此属性为true时，垂直方向即使内容比滚动视图本身还要小，也可以弹性地拉动一截。
         */
        alwaysBounceVertical: PropTypes.bool,
        /**
         * 弹性滚动
         *
         * @property bounces
         * @type bool
         * @default true
         * @description 当值为true时，如果内容范围比滚动视图本身大，在到达内容末尾的时候，可以弹性地拉动一截。如果为false，尾部的所有弹性都会被禁用，即使alwaysBounce*属性为true。默认值为true。
         */
        bounces: PropTypes.bool,
        /**
         * 容器样式
         *
         * @property contentContainerStyle
         * @type View.propTypes.style
         * @description ScrollView内容容器的样式，所有的子视图都会包裹在内容容器内。
         */
        contentContainerStyle: View.propTypes.style,
        /**
         * 惯性减速度
         *
         * @property decelerationRate
         * @type number|'fast'|'normal'
         * @default 'normal'（即：0.998）
         * @description 一个浮点数，用于决定当用户抬起手指之后进行惯性滚动时，滚动视图减速停下的速度。normal为0.998，fast为0.9。
         */
        decelerationRate: PropTypes.oneOfType([
            PropTypes.oneOf(['fast', 'normal']),
            PropTypes.number,
        ]),
        /**
         * 水平滚动
         *
         * @property horizontal
         * @type bool
         * @default false
         * @description 水平滚动。当该属性为true的时候，所有的的子视图会在水平方向上排成一行，而不是默认的在垂直方向上排成一列。
         */
        horizontal: PropTypes.bool,
        /**
         * 滚动事件
         *
         * @property onScroll
         * @type function
         * @param {e} event 滚动事件，由nativeEvent({contentOffset: {x: x, y: y}})组成
         * @description 在滚动的过程中，每帧调用一次此回调函数。
         *
         */
        onScroll: PropTypes.func,

        /**
         * 滚动事件
         *
         * @property onScrollAnimationEnd
         * @type function
         * @param {e} event 由nativeEvent({contentOffset: {x: x, y: y}})组成
         * @description 当滚动动画结束之后调用此回调。
         */
        onScrollAnimationEnd: PropTypes.func,

        /**
         * 翻页滚动
         *
         * @property pagingEnabled
         * @type bool
         * @default false
         * @description 当值为true时，滚动条会停在滚动视图的尺寸的整数倍位置。这个可以用在水平或垂直的分页上。默认值为false。
         *
         * **注意：当使用pagingEnabled属性的时候，不允许在非scroll方向上使用 `alwaysBounce*` 属性。即：当 horizontal 为 true，pagingEnabled 为 true 的时候，不允许使用 alwaysBounceVertical ；当 horizontal 为 flase，pagingEnabled 为 true 的时候，不允许使用 alwaysBounceHorizontal**
         */
        pagingEnabled: PropTypes.bool,
        /**
         * 滚动事件
         *
         * @property scrollEnabled
         * @type bool
         * @default true
         * @description 当值为false的时候，内容不能滚动，默认值为true。
         */
        scrollEnabled: PropTypes.bool,
        /**
         * 水平滚动条
         *
         * @property showsHorizontalScrollIndicator
         * @type bool
         * @default false
         * @description 当此属性为true的时候，显示一个水平方向的滚动条。
         */
        showsHorizontalScrollIndicator: PropTypes.bool,
        /**
         * 垂直滚动条
         *
         * @property showsVerticalScrollIndicator
         * @type bool
         * @default true
         * @description 当此属性为true的时候，显示一个垂直方向的滚动条。
         */
        showsVerticalScrollIndicator: PropTypes.bool,
        /**
         * 吸顶
         *
         * @property stickyHeaderIndices
         * @type array[number]
         * @description 一个子视图下标的数组，用于决定哪些成员会在滚动之后固定在屏幕顶端。举个例子，传递stickyHeaderIndices={[0]}会让第一个成员固定在滚动视图顶端。
         */
        stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
        /**
         * 用户拖拽滚动视图的时候，是否要隐藏软键盘
         * @property keyboardDismissMode
         * @type one of [none, on-drag, interactive]
         * @ description none（默认值），拖拽时不隐藏软键盘。on-drag 当拖拽开始的时候隐藏软键盘。interactive 软键盘伴随拖拽操作同步地消失，并且如果往上滑动会恢复键盘。[interactive未实现]
         */
        keyboardDismissMode: PropTypes.oneOf('none', 'on-drag'),
        /**
         * 软键盘激活之后，点击焦点文本输入框以外的地方，是否要隐藏软键盘
         * @property keyboardShouldPersistTaps
         * @type bool
         * @ description 当此属性为false的时候，在软键盘激活之后，点击焦点文本输入框以外的地方，键盘就会隐藏。如果为true，滚动视图不会响应点击操作，并且键盘不会自动消失。默认值为false，现在也只支持false。
         */
        keyboardShouldPersistTaps: PropTypes.bool,
        /**
         * 惯性滚动开始的回调
         *
         * @property onMomentumScrollBegin
         * @type function
         * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
         * @description (event) => void
         *
         * 惯性滚动开始时的回调。
         */
        onMomentumScrollBegin: PropTypes.func,
        /**
         * 惯性滚动结束的回调
         *
         * @property onMomentumScrollEnd
         * @type function
         * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
         * @description (event) => void
         *
         * 惯性滚动结束时的回调。
         */
        onMomentumScrollEnd: PropTypes.func,
        /**
         * 拖拽滚动开始时的回调。
         *
         * @property onScrollBeginDrag
         * @type function
         * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
         * @description (event) => void
         *
         * 拖拽滚动开始时的回调。
         */
        onScrollBeginDrag: PropTypes.func,
        /**
         * 拖拽滚动结束时的回调。
         *
         * @property onScrollEndDrag
         * @type function
         * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
         * @description (event) => void
         *
         * 拖拽滚动结束时的回调。
         */
        onScrollEndDrag: PropTypes.func,
        /**
         * 下拉刷新
         *
         * @property refreshControl
         * @type element
         * @description 指定RefreshControl组件，用于为ScrollView提供下拉刷新功能。
         */
        refreshControl: PropTypes.element,
        /**
         * 上拉加载
         *
         * @property loadControl
         * @type element
         * @description 指定LoadControl组件，用于为ScrollView提供上拉加载功能。
         */
        loadControl: PropTypes.element,
        /**
         * 内容容器改变触发
         *
         * @property onContentSizeChange
         * @type function
         * @param {number} width 内容容器宽度
         * @param {number} height 内容容器高度
         * @description ScrollView内容容器onLayout时触发，所有的子视图都会包裹在内容容器内。
         */
        onContentSizeChange: PropTypes.func,
        /**
         * 样式
         *
         * @property style
         * @type View.propTypes.style
         * @description ScrollView的样式。
         */
        style: StyleSheetPropType(ViewStylePropTypes),
        scrollPosition: PointPropType,

    };
    constructor(props) {
        super(props);

        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        this.state = {
            isRefreshing: false,
            isLoading: false,
        };

        this._updateByProps(props);

        // 滚动条
        this.indicator = {
            vertical: {
                height: 0,
            },
            horizontal: {
                width: 0,
            }
        };
    }

    _updateByProps(props) {
        // 判断alwaysBounce
        this.alwaysBounceHorizontal = props.alwaysBounceHorizontal !== undefined ? props.alwaysBounceHorizontal : props.horizontal;
        this.alwaysBounceVertical = props.alwaysBounceVertical !== undefined ? props.alwaysBounceVertical : !props.horizontal;
        if (!props.bounces) {
            this.alwaysBounceHorizontal = false;
            this.alwaysBounceVertical = false;
        }

        if (props.pagingEnabled) {
            props.horizontal ? this.alwaysBounceVertical = false : this.alwaysBounceHorizontal = false;
        }

        // 判断滚动条是否显示
        this.showsVerticalScrollIndicator = !props.horizontal ? props.showsVerticalScrollIndicator : false;
        this.showsHorizontalScrollIndicator = props.horizontal ? props.showsHorizontalScrollIndicator : false;


        // 判断stickyHeaderIndices
        this.stickyHeaderIndices = [];
        if (props.stickyHeaderIndices && !props.horizontal) {
            props.stickyHeaderIndices.forEach((item) => {
                let newItem = props.refreshControl ? item + 1 : item;
                this.stickyHeaderIndices.push({
                    itemIndex: newItem,
                    itemDOM: null,
                    itemOffset: null,
                });
            });
        }

        //判断deceleration
        this.deceleration = utils.getDeceleration(props.decelerationRate);

        // 当前视图左上角坐标,defaultProps{0,0}
        // contentOffset和contentInset绑定到this上，是为了兼容业务线直接调用的用法，实际上此接口不对外开放，可以省略
        this.contentOffset = {
            x: props.contentOffset.x,
            y: props.contentOffset.y,
        };
        this.contentInset = Object.assign({}, props.contentInset);


        // 当前页
        this.curPage = 0;
    }


    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._onStartShouldSetPanResponder.bind(this),
            onStartShouldSetPanResponderCapture: this._onStartShouldSetPanResponderCapture.bind(this),
            onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder.bind(this),
            onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture.bind(this),
            onPanResponderGrant: this._onPanResponderGrant.bind(this),
            onPanResponderMove: this._onPanResponderMove.bind(this),
            onPanResponderRelease: this._onPanResponderRelease.bind(this),
            onPanResponderTerminationRequest: this._onPanResponderTerminationRequest.bind(this),
            onPanResponderTerminate: this._onPanResponderTerminate.bind(this),
        });
    }

    componentDidMount() {
        this.wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
        this.scroller = ReactDOM.findDOMNode(this.refs.scroller);

        this.refreshControl = this.refs.refreshControl;
        this.loadControl = this.refs.loadControl;

        this.indicatorVertical = ReactDOM.findDOMNode(this.refs.indicatorVertical);
        this.indicatorHorizontal = ReactDOM.findDOMNode(this.refs.indicatorHorizontal);

        // 将DOM更新到this.stickyHeaderIndices的DOM里
        if (this.stickyHeaderIndices.length > 0) {
            this.stickyHeaderIndices.forEach((item, index) => {
                let itemDOM = this.scroller.childNodes[item.itemIndex] || {};
                fastdom.mutate(() => {
                    itemDOM.style.zIndex = index + 10;
                });
                this.stickyHeaderIndices[index].itemDOM = itemDOM;
                this.stickyHeaderIndices[index].itemOffset = itemDOM.offsetTop;
            });
        }
        this._scrollTo(-this.contentOffset.x, -this.contentOffset.y);
    }

    componentWillReceiveProps(nextProps) {
        //清除上次sticky的style及相关style，如果有的话
        if (this.stickyHeaderIndices.length > 0) {
            let nextStickyHeaderIndices = nextProps.stickyHeaderIndices || [];
            this.stickyHeaderIndices.forEach((item) => {
                if (nextStickyHeaderIndices.indexOf(item.itemIndex) === -1){
                  item.itemDOM.style.zIndex = null;
                  item.itemDOM.style[commonTransform] = null;
                }
            });
        }
        this._updateByProps(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        // 如果新的contentOffset不同，则更新
        if (prevProps.contentOffset.x !== this.contentOffset.x || prevProps.contentOffset.y !== this.contentOffset.y) {
            this._scrollTo(-this.contentOffset.x, -this.contentOffset.y);
        }
        // 将DOM更新到this.stickyHeaderIndices的DOM里
        if (this.stickyHeaderIndices.length > 0) {
            this.stickyHeaderIndices.forEach((item, index) => {
                let itemDOM = this.scroller.childNodes[item.itemIndex] || {};
                fastdom.mutate(() => {
                    itemDOM.style.zIndex = index + 10;
                });
                this.stickyHeaderIndices[index].itemDOM = itemDOM;
                this.stickyHeaderIndices[index].itemOffset = itemDOM.offsetTop;
            });
        }
    }

    _onStartShouldSetPanResponder(e) {
        //console.info('_onStartShouldSetResponder', e, this.wrapper);
        return this.props.scrollEnabled;
    }

    _onStartShouldSetPanResponderCapture(e) {
        //console.info('_onStartShouldSetResponderCapture', e, this.wrapper);
        // 记录初始坐标
        let point = e.nativeEvent.touches[0];
        this.pointX = point.pageX;
        this.pointY = point.pageY;

        // 正在滚动，阻止内部组件相应
        return this.isMoving;
    }

    _onMoveShouldSetPanResponder(e) {
        //console.info('_onMoveShouldSetPanResponder', e, this.wrapper);
        if (!this.props.scrollEnabled) {
            return false;
        }

        // 比较当前坐标和初始坐标的距离，小于定值则返回false
        let point = e.nativeEvent.touches[0],
            deltaX = this.pointX - point.pageX,
            deltaY = this.pointY - point.pageY,
            distance = this.props.horizontal ? Math.abs(deltaX) : Math.abs(deltaY);

        if (distance < SCROLLMOVE_THRESHOLD) {
            return false;
        }
        this.pointX = point.pageX;
        this.pointY = point.pageY;

        return true;
    }

    _onMoveShouldSetPanResponderCapture(e) {
        //console.info('_onMoveShouldSetPanResponderCapture', e, this.wrapper);
        // 正在滚动，阻止内部组件响应
        return this.isMoving;
    }

    _onPanResponderGrant(e) {
        //console.info('_onPanResponderGrant', e, this.wrapper);

        let point = e.nativeEvent.touches[0];
        // 正在滚动则停止
        this.isAnimating = false;

        // 重置数据
        this.isMoving = false;

        this.distX = 0;
        this.distY = 0;

        this.directionX = 0;
        this.directionY = 0;


        this.startTime = utils.getTime();

        this.startX = this.x;
        this.startY = this.y;

        this.pointX = point.pageX;
        this.pointY = point.pageY;

        if (this.props.pagingEnabled && this.props.horizontal) {
            this.curPage = Math.floor(Math.abs(this.startX) / this.wrapperWidth);
        }

        if (this.props.pagingEnabled && !this.props.horizontal) {
            this.curPage = Math.floor(Math.abs(this.startY) / this.wrapperHeight);
        }

        this._toggleIndicator(true);

        this._execEvent('onScrollBeginDrag');
    }

    _onPanResponderMove(e) {
        //console.info('_onPanResponderMove', e, this.wrapper);

        let point = e.nativeEvent.touches[0],
            deltaX = point.pageX - this.pointX,
            deltaY = point.pageY - this.pointY,
            timestamp = utils.getTime(),
            newX, newY,
            absDistX, absDistY;

        this.pointX = point.pageX;
        this.pointY = point.pageY;

        this.distX += deltaX;
        this.distY += deltaY;
        absDistX = Math.abs(this.distX);
        absDistY = Math.abs(this.distY);

        // 移动距离大于10且距离上次相应结束大于300ms才相应
        if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
            return;
        }
        this.isMoving = true;
        // 判断是否需要隐藏软键盘
        this._checkDismissMode();

        newX = this.x + deltaX;
        newY = this.y + deltaY;

        // 超出了范围，减少移动距离或是保持原来的位置
        if (newX > this.minScrollX || newX < this.maxScrollX) {
            newX = this.alwaysBounceHorizontal ? this.x + deltaX / 3 : newX > this.minScrollX ? this.minScrollX : this.maxScrollX;
        }
        if (newY > this.minScrollY || newY < this.maxScrollY) {
            newY = this.alwaysBounceVertical ? this.y + deltaY / 3 : newY > this.minScrollY ? this.minScrollY : this.maxScrollY;
        }

        this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if (this.props.pagingEnabled && this.props.horizontal) {
            let newPageScrollerX = -(this.curPage + this.directionX) * this.wrapperWidth;
            if ((this.directionX < 0 && newX > newPageScrollerX) || (this.directionX > 0 && newX < newPageScrollerX)) {
                newX = newPageScrollerX;
            }
        }
        if (this.props.pagingEnabled && !this.props.horizontal) {
            let newPageScrollerY = -(this.curPage + this.directionY) * this.wrapperHeight;
            if ((this.directionY < 0 && newY > newPageScrollerY) || (this.directionY > 0 && newY < newPageScrollerY)) {
                newY = newPageScrollerY;
            }
        }


        this._translate(newX, newY);

        // move时间过长时，relase后的速度依赖于最后的300ms
        if (timestamp - this.startTime > 300) {
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;
        }
        this._execEvent('onScroll');
        return true;
    }

    _onPanResponderRelease(e) {
        //console.info('_onPanResponderRelease', e, this.wrapper);

        this._checkShouldPersistTaps(e);

        let momentumX,
            momentumY,
            duration,
            newX = Math.round(this.x),
            newY = Math.round(this.y),
            time = 0,
            // point = e.nativeEvent.changedTouches[0],
            easing;


        this.endTime = utils.getTime();
        duration = this.endTime - this.startTime;

        this.isMoving = false;

        // 触发refresh&load
        if (this.props.refreshControl) {
            if (!this.props.horizontal && newY > this.refreshControlHeight) {
                this.startRefreshing(true);
                this._scrollTo(0, this.refreshControlHeight, BOUNCETIME);
                return;
            }
        }

        if (this.props.loadControl) {
            if (!this.props.horizontal && newY < this.maxScrollY - this.loadControlHeight) {
                this.startLoading(true);
                this._scrollTo(0, this.maxScrollY, BOUNCETIME);
                return;
            }
        }

        // 已经超出边界的进行回弹
        if (this._resetPosition(BOUNCETIME)) {
            return;
        }

        // 处理pagingEnabled情况
        if (this.props.pagingEnabled && this.props.horizontal) {
            let vx = (this.x - this.startX) / duration,
                per = Math.abs(newX) / this.wrapperWidth - this.curPage;
            let newPage = per > 0.35 || Math.abs(vx) > 0.4 ? this.curPage += this.directionX : this.curPage;

            this._scrollTo(-newPage * this.wrapperWidth, newY, PAGEINGTIME, utils.ease.quadratic);
            return;
        }

        if (this.props.pagingEnabled && !this.props.horizontal) {
            let vy = (this.y - this.startY) / duration,
                per = Math.abs(newY) / this.wrapperHeight - this.curPage;
            let newPage = per > 0.35 || Math.abs(vy) > 0.4 ? this.curPage += this.directionY : this.curPage;

            this._scrollTo(newX, -newPage * this.wrapperHeight, PAGEINGTIME, utils.ease.quadratic);
            return;
        }

        // 移动到新地点
        this._scrollTo(newX, newY, 0);


        this._execEvent('onScrollEndDrag');

        // 惯性滚动
        if (duration < 300) {
            momentumX = this.props.horizontal ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.wrapperWidth, this.deceleration) : {
                destination: newX,
                duration: 0
            };
            momentumY = !this.props.horizontal ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.wrapperHeight, this.deceleration) : {
                destination: newY,
                duration: 0
            };
            newX = momentumX.destination;
            newY = momentumY.destination;
            time = Math.max(momentumX.duration, momentumY.duration);
        }

        if (newX !== this.x || newY !== this.y) {
            if (newX > this.minScrollX || newX < this.maxScrollX) {
                if (this.alwaysBounceHorizontal) {
                    easing = utils.ease.quadratic;
                } else {
                    newX = newX > this.minScrollX ? this.minScrollX : this.maxScrollX;
                }
            }

            if (newY > this.minScrollY || newY < this.maxScrollY) {
                if (this.alwaysBounceVertical) {
                    easing = utils.ease.quadratic;
                } else {
                    newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY;
                }
            }

            this._execEvent('onMomentumScrollBegin');
            this._scrollTo(newX, newY, time, easing);
            this._execEvent('onMomentumScrollEnd');
            return;
        }

        this._execEvent('onScrollAnimationEnd');
        this._toggleIndicator(false);
        return;
    }


    _onPanResponderTerminationRequest(e, gestureState) {
        // 控制权的交出：移动方向没有滚动，或是有滚动且在本方向上滚动到底才会交出(在滚动方向的always* 为false)
        // keyboardShouldPersistTaps 为true，不交出控制权，滚动视图不响应点击操作，键盘不会消失。
        if (this.props.keyboardShouldPersistTaps) {
            return false;
        }
        let point = e.nativeEvent,
            deltaX = point.pageX - this.pointX,
            deltaY = point.pageY - this.pointY,
            directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0,
            directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0,
            direction = Math.abs(deltaY) > Math.abs(deltaX) ? 'v' : 'h',
            allow = false;

        (this.props.horizontal && direction === 'v' && !this.alwaysBounceVertical) && (allow = true);
        (!this.props.horizontal && direction === 'h' && !this.alwaysBounceHorizontal ) && (allow = true);

        if (this.props.horizontal && direction === 'h' && !this.alwaysBounceHorizontal) {
            (directionX === 1 && this.x <= this.maxScrollX) && (allow = true);
            (directionX === -1 && this.x >= this.minScrollX) && (allow = true);
        }

        if (!this.props.horizontal && direction === 'v' && !this.alwaysBounceVertical) {
            (directionY === 1 && this.y <= this.maxScrollY) && (allow = true);
            (directionY === -1 && this.y >= this.minScrollY) && (allow = true);
        }
        return allow;
    }

    _onPanResponderTerminate(e) {
        //console.info('_onPanResponderTerminate', e, this.wrapper);
        //控制权交出后结束后归位
        if (this._resetPosition(BOUNCETIME)) {
            return;
        }
    }

    _execEvent(eventType) {
        // 参数为了和QRN保持一致
        this.props[eventType] && this.props[eventType].apply(this, [{
            nativeEvent: {
                contentOffset: {
                    x: -this.x,
                    y: -this.y + (this.props.refreshControl ? this.refreshControlHeight : 0),
                }
            }
        }]);
    }

    _checkDismissMode() {
        //为on-drag时，拖动时隐藏软键盘。
        if (this.props.keyboardDismissMode === 'on-drag') {
            TextInputState.blur(TextInputState.currentFocus());
        }
    }

    _checkShouldPersistTaps(e) {
        // 判断是否隐藏软键盘
        if (!this.isMoving) {
            if (!this.props.keyboardShouldPersistTaps) {
                var ele = e.nativeEvent.target,
                    focusEle = TextInputState.currentFocus();
                    (ele !== focusEle) && (TextInputState.blur(focusEle));

            }
        }

    }

    // 刷新布局
    _refresh() {
        //console.log('refresh');
        // 更新布局的width&hight
        this.wrapperWidth = this.wrapper.clientWidth;
        this.wrapperHeight = this.wrapper.clientHeight;

        this.scrollerWidth = this.scroller.offsetWidth;
        this.scrollerHeight = this.scroller.offsetHeight;

        this.minScrollX = this.contentInset.left;
        this.minScrollY = this.contentInset.top;

        this.maxScrollX = this.wrapperWidth - this.scrollerWidth - this.contentInset.right;
        this.maxScrollY = this.wrapperHeight - this.scrollerHeight - this.contentInset.bottom;

        this.endTime = 0;
        this.directionX = 0;
        this.directionY = 0;

        //更新stickyHeaderIndices的offset
        if (this.stickyHeaderIndices.length > 0) {
            this.stickyHeaderIndices.forEach((item, index) => {
                this.stickyHeaderIndices[index].itemOffset = this.stickyHeaderIndices[index].itemDOM.offsetTop;
            });
        }

        // 更新滚动条，如果不同则
        if (this.showsVerticalScrollIndicator) {
            let indicatorLength = 0;
            if (this.maxScrollY < 0) {
                this.ableShowsVerticalScrollIndicator = true;
                let indicatorMaxLength = this.wrapperHeight - 2 * INDICATOR_GAP;
                indicatorLength = Math.max(INDICATOR_MIN_SHOW_LENGTH, Math.floor(this.wrapperHeight * indicatorMaxLength / this.scrollerHeight));
            } else {
                this.ableShowsVerticalScrollIndicator = false;
            }
            if (this.indicator.vertical.height !== indicatorLength) {
                this.indicator.vertical.height = indicatorLength;
                this.forceUpdate();
            }
        }

        if (this.showsHorizontalScrollIndicator) {
            let indicatorWidth = 0;
            if (this.maxScrollX < 0) {
                this.ableShowsHorizontalScrollIndicator = true;
                let indicatorMaxWidth = this.wrapperWidth - 2 * INDICATOR_GAP;
                indicatorWidth = Math.max(INDICATOR_MIN_SHOW_WIDTH, Math.floor(this.wrapperWidth * indicatorMaxWidth / this.scrollerWidth));
            } else {
                this.ableShowsHorizontalScrollIndicator = false;
            }
            if (this.indicator.horizontal.width !== indicatorWidth) {
                this.indicator.horizontal.width = indicatorWidth;
                this.forceUpdate();
            }
        }

        // 重置定位
        if (this.y < this.maxScrollY || this.x < this.maxScrollX) {
            let newX, newY;
            (this.x < this.maxScrollX) && (newX = this.maxScrollX);
            (this.y < this.maxScrollY) && (newY = this.maxScrollY);
            this._scrollTo(newX, newY, 0);
        } else {
            this._scrollTo(this.x, this.y, 0);
        }
    }

    // 滚动条的显隐
    _toggleIndicator(type) {
        if (this.ableShowsVerticalScrollIndicator) {
            this.indicatorVertical.style.opacity = type ? INDICATOR_OPACITY : 0;
        }
        if (this.ableShowsHorizontalScrollIndicator) {
            this.indicatorHorizontal.style.opacity = type ? INDICATOR_OPACITY : 0;
        }
    }


    // 判断是否重新回到最顶端或最低端并归位
    _resetPosition(time = 0) {
        let x = this.x,
            y = this.y;

        if (!this.props.horizontal || this.x > this.minScrollX) {
            x = this.minScrollX;
        } else if (this.x < this.maxScrollX) {
            x = this.maxScrollX;
        }

        if (this.props.horizontal || this.y > this.minScrollY) {
            y = this.minScrollY;
        } else if (this.y < this.maxScrollY) {
            y = this.maxScrollY;
        }

        if (x === this.x && y === this.y) {
            return false;
        }


        this._scrollTo(x, y, time);
        return true;
    }

    // 从外部调用scrollTo时，先把之前的手势动画清除
    /**
     * 滚动到
     *
     * @method scrollTo
     * @param {obj} options 滚动配置
     * @param {number} [options.x] 横向位移
     * @param {number} [options.y] 纵向位移
     * @param {bool} [options.animated] 是否动画
     * @param {number} [options.duration] 动画时长
     * @description 滚动到某一位置，如果只在某一方向滚动，可以只传{x: x}或{y: y}。默认animated为true。
     *
     * ** 如果使用了RefreshControl组件，则y需要包含RefreshControl组件的高度。即：滚动到顶部，正常是 `scrollTo({y: 0})`
     */
    scrollTo(options) {
        options.x = options.x || 0;
        options.y = options.y || 0;
        (this.props.refreshControl) && (options.y -= this.refreshControlHeight);
        this.isAnimating = false;
        this._toggleIndicator(true);
        this._scrollTo(-options.x, -options.y, options.animated ? (options.duration ? options.duration : BOUNCETIME) : 0);
    }


    // 滚动到固定位置，time未定义则直接滚动没有动画效果
    _scrollTo(x = 0, y = 0, time = 0, easing = utils.ease.circular) {
        if (!time || time <= 0) {
            this._translate(x, y);
        } else {
            this._animate(x, y, time, easing.fn);
        }
    }

    // 移动到固定地点
    _translate(x, y) {
        fastdom.mutate(() => {
            this.scroller.style[commonTransform] = 'translate(' + x + 'px,' + y + 'px) translateZ(0)';
        });

        this.x = x;
        this.y = y;

        this.contentOffset.x = -x;
        this.contentOffset.y = -y;

        // 更新sticky
        if (this.stickyHeaderIndices.length > 0) {
            this.stickyHeaderIndices.forEach((item, index) => {
                let transformValue = item.itemOffset + y >= this.minScrollY ? 'translate(0px,0px) translateZ(0)' : 'translate(0px,' + Math.abs(y + item.itemOffset) + 'px) translateZ(0)';
                fastdom.mutate(() => {
                    this.stickyHeaderIndices[index].itemDOM.style[commonTransform] = transformValue;
                });
            });
        }
        // 更新滚动条
        if (this.ableShowsVerticalScrollIndicator) {
            let transformValue = 'translate(0px,' + (-this.y / this.scrollerHeight * (this.wrapperHeight - 2 * INDICATOR_GAP)) + 'px) translateZ(0)';
            fastdom.mutate(() => {
                this.indicatorVertical.style[commonTransform] = transformValue;
            });
        }

        if (this.ableShowsHorizontalScrollIndicator) {
            let transformValue = 'translate(' + (-this.x / this.scrollerWidth * (this.wrapperWidth - 2 * INDICATOR_GAP)) + 'px, 0px) translateZ(0)';
            fastdom.mutate(() => {
                this.indicatorHorizontal.style[commonTransform] = transformValue;
            });
        }
    }

    // 滚动with动画
    _animate(destX, destY, duration, easingFn) {
        let self = this,
            startX = this.x,
            startY = this.y,
            startTime = utils.getTime(),
            destTime = startTime + duration;

        function step() {
            let now = utils.getTime();
            //  清除上次的animatefreame，如果有的话
            (self.rAF) && (cancelAnimationFrame(self.rAF));
            // 时间结束，按需进行回弹，隐藏滚动条，return
            if (now >= destTime) {
                self.isAnimating = false;
                self._translate(destX, destY);
                if (!self._resetPosition(BOUNCETIME)) {
                    self._toggleIndicator(false);
                    self._execEvent('onScrollAnimationEnd');
                }
                return;
            }
            // 从外界通过置isAnimating为false的方法在下一帧停止
            if (!self.isAnimating){
                self._execEvent('onScrollAnimationEnd');
                return;
            }
            // 一般情况，继续动画，计算
            if (self.isAnimating) {
                let newX, newY,easing;
                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                self._translate(newX, newY);
                self.rAF = requestAnimationFrame(step);
                self._execEvent('onScroll');
            }
        }
        this.isAnimating = true;
        step();
    }


    /**
     * 在layout前设置offset
     *
     * @method setContentOffsetBeforeLayout
     * @param {PointPropType{x:x,y:y}} position 设置相对当前contentOffset的位移量
     * @description 本方法用来设置contentOffset相对当前的contentOffset偏移多少，在下一次render的时候会生效。本方法的主要使用场景是，当滚动内容的高度发生变化时（尤其是变小时），希望render之后，用户看到的内容位置是不变的。
     */
    setContentOffsetBeforeLayout(offset) {
        this.contentOffset.x = this.contentOffset.x - offset.x;
        this.contentOffset.y = this.contentOffset.y - offset.y;
        this.x = this.contentOffset.x;
        this.y = this.contentOffset.y;
     }


    /**
     * 开始下拉刷新
     *
     * @method startRefreshing
     * @param {bool} fromResponder 是否通过js强制刷新
     * @description 当前组件有refreshControl属性，并且没有正在下拉刷新，则强制触发下拉刷新，变成正在刷新的状态。fromResponder为true为通过手势scroll触发，false表示是强制触发的
     */
    startRefreshing(fromResponder) {
        // fromResponder为true，表示是scroll时触发的；为false，表示是强制触发的
        if (this.props.refreshControl && !this.state.isRefreshing) {
            this.setState({
                isRefreshing: true,
            });

            this.refreshControl.onRefresh();
            if (!fromResponder) {
                this._scrollTo(0, this.refreshControlHeight);
            }
        }
    }

    /**
     * 停止下拉刷新
     *
     * @method stopRefreshing
     * @description 当前组件有refreshControl属性，并且正在下拉刷新，则停止下拉刷新的状态。默认带有动画，可以设置{animated: false}取消。
     *
     */
    stopRefreshing() {
        if (this.props.refreshControl && this.state.isRefreshing) {
            this._resetPosition(BOUNCETIME);
            this.setState({
                isRefreshing: false,
            });
        }
    }


    /**
     * 开始加载更多
     *
     * @method startLoading
     * @description 当前组件有loadControl属性，并且没有正在加载，则强制触发加载更多，变成正在加载更多的状态
     */
    startLoading() {
        if (this.props.loadControl && !this.state.isLoading) {
            this.setState({
                isLoading: true,
            });
            this.loadControl.onLoad();
        }
    }

    /**
     * 停止加载更多
     *
     * @method stopLoading
     * @description 当前组件有loadControl属性，并且正在加载，则停止加载更多的状态
     */
    stopLoading() {
        if (this.props.loadControl && this.state.isLoading) {
            this.setState({
                isLoading: false,
            });
            this._resetPosition(BOUNCETIME);
        }
    }



    _onTouchStart(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.props.onTouchStart && this.props.onTouchStart();
    }

    _onTouchMove(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        this.props.onTouchMove && this.props.onTouchMove();
    }


    _onTouchEnd(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.props.onTouchEnd && this.props.onTouchEnd();
    }

    render() {
        //console.log('render');
        let scrollProps = {
            ...this.props,
            onScroll: noop, // 禁用掉自带onScroll
            // 禁用掉浏览器的默认下拉事件。
            onTouchStart: this._onTouchStart,
            onTouchMove: this._onTouchMove,
            onTouchEnd: this._onTouchEnd,
        };

        let refreshControl = this.props.refreshControl || null;
        this.refreshControlHeight = null;
        if (refreshControl) {
            this.refreshControlHeight = refreshControl.props.height;
            refreshControl = React.cloneElement(refreshControl, {
                ref: 'refreshControl',
                isRefreshing: this.state.isRefreshing,
                style: styles.refreshControl,
            });
        }

        let loadControl = this.props.loadControl || null;
        this.loadControlHeight = null;
        if (loadControl) {
            this.loadControlHeight = loadControl.props.height;
            let loadControlChild = React.cloneElement(loadControl, {
                ref: 'loadControl',
                isLoading: this.state.isLoading,
            });
            loadControl = (
              <View style={styles.loadControl}>
                  {loadControlChild}
              </View>
            );
            // 为了内容不够时的loadControl的布局正确，加上一个View
          }
        let indicator_horizontal = this.showsHorizontalScrollIndicator ?
            (<View
                 style={[styles.indicator, styles.indicatorHorizontal, {width:this.indicator.horizontal.width}]}
                 ref = 'indicatorHorizontal'
             />) : null;
        let indicator_vertical = this.showsVerticalScrollIndicator ?
             (<View
                 style={[styles.indicator, styles.indicatorVertical, {height:this.indicator.vertical.height}]}
                 ref = 'indicatorVertical'
             />) : null;
        return (
              <Resizable
                 ref='wrapper'
                 {...scrollProps}
                 {...this._panResponder.panHandlers}
                 style={[styles.scrollView,scrollProps.style]}
                 onResize = {(e)=>{this._refresh()}}
              >
                   <Resizable
                       className={scrollProps.horizontal ? 'rn-scroller-hori' : 'rn-scroller-vert'}
                       style = {[scrollProps.contentContainerStyle, styles.scroller,scrollProps.horizontal && styles.scrollerHorizontal, scrollProps.endFillColor && {backgroundColor:scrollProps.endFillColor}]}
                       ref='scroller'
                       onLayout = {(e)=>{
                           scrollProps.onContentSizeChange && scrollProps.onContentSizeChange({width:this.scrollerWidth,height:this.scrollerHeight});
                       }}
                       onResize = {(e)=>{
                           this._refresh();
                       }}
                   >
                       {refreshControl}
                       {this.props.children}
                       {loadControl}
                   </Resizable>
                   {indicator_horizontal}
                   {indicator_vertical}
             </Resizable>
        );

    }
}





module.exports = QScrollView;
