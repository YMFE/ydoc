/**
 * @providesModule QScrollView
 * @flow
 */
'use strict';

import React, {Component, PropTypes, StyleSheet, View, Platform} from 'qunar-react-native';

import EdgeInsetsPropType from 'EdgeInsetsPropType';
import PointPropType from 'PointPropType';
import ViewStylePropTypes from 'ViewStylePropTypes';
import StyleSheetPropType from 'StyleSheetPropType';
import deprecatedPropType from 'deprecatedPropType';
import insetsDiffer from 'insetsDiffer';
import deepDiffer from 'deepDiffer';
import pointsDiffer from 'pointsDiffer';

import ReactNativeViewAttributes from 'ReactNativeViewAttributes';
import requireNativeComponent from 'requireNativeComponent';
import processDecelerationRate from 'processDecelerationRate';
import dismissKeyboard from 'dismissKeyboard';
import TextInputState from 'TextInputState';

const QRCTScrollView = requireNativeComponent('RCTScrollableView', ScrollView);

const SCROLLVIEW = 'ScrollView';
const INNERVIEW = 'InnerScrollView';
const REFRESHCONTROL = 'RefreshControl';
const LOADCONTROL = 'LoadControl';

const SCROLL_MOVE_THRESHOLD = 5; // 判定是否移动的距离临界点
const TOUCH_HISTORY_RECORD_NUM = 5; // 触摸历史记录的数量
const TOUCH_VELOCITY_CALCULATE_RANGE = 300; // release时计算速度的两次操作的时间差临界点 ms
const TOUCH_VELOCITY_THRESHOLD = 0.1; // release时判定是否需要惯性操作的速度临界点
const DECELERATE_INTERVAL = 16; // 时间片，每帧之间的时间差 ms
const SCROLLTO_DURATION = 300; // scrollTo时默认的时长

const INDICATOR_MIN_LENGTH = 10; // 超出滚动范围时，滚动条最小长度
const INDICATOR_MIN_SHOW_LENGTH = 40; // 不超出滚动范围时，滚动条最小长度
const INDICATOR_GAP = 6; // 滚动条距离两侧的距离（两头）
const INDICATOR_GAP_EDGE = 3; // 滚动条距离边界的距离（平行）
const INDICATOR_OPACITY = 0.4; // 滚动条透明度

/**
 * 滚动组件
 *
 * @component ScrollView
 * @example ./Playground/js/Examples/ScrollViewExample/01_vertical.js[1-151]
 * @version >=v1.0.0
 * @description 一个包装了平台的ScrollView（滚动视图）的组件，同时还集成了触摸锁定的“响应者”系统。
 *
 * * 记住ScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。
 * * 要给一个ScrollView确定一个高度的话，要么直接给它设置高度（不建议），要么确定所有的父容器都已经绑定了高度。
 * * 在视图栈的任意一个位置忘记使用{flex:1}都会导致错误，你可以使用元素查看器来查找问题的原因。
 *
 * ![ScrollView](./images/component-ScrollView.png)
 */

/* ScrollView 的主要实现思路和难点：
 *
 * ScrollView 的 主要渲染结构：
 * <View> ---------------------> 最外层容器，之所以有这一层，是因为滚动条是自己画出来的，需要父容器
 *   <RCTScrollableView> ------> native提供的滚动容器
 *     <View> -----------------> 内容的外层容器
 *       用户指定的内容
 *     </View>
 *   </RCTScrollableView>
 *   <View /> -----------------> 横向滚动条
 *   <View /> -----------------> 纵向滚动条
 * </View>
 *
 * RCTScrollableView 接收两个参数：scrollPosition 和 stickyHeaderIndices。
 *   - scrollPosition：即内容的偏移量，告诉native移动到什么位置。
 *   - stickyHeaderIndices：即stickyHeader的索引，stickyHeader的功能由native实现，这样性能比较好。其原理是，在每次位移之后，计算对应的stickyHeader，然后放到对应的位置。native可以在布局之后再次改变布局，这一点js是无法直接做到的。
 *
 * ScrollView 的核心逻辑就是处理各种触摸事件，即responder相关的事件。
 *   - responder的决定型事件：决定什么时候响应操作、什么时候不响应操作、什么时候交出控制权、什么时候不交出控制权。
 *   - responder的响应型事件：决定了在用户touch的过程中（甚至是touch结束后），应该做出什么反应。
 *
 * 关于 responder 比较坑的地方：
 * native本身对于各种操作只能有一个响应者，但是在rn里，有些事件是在native里响应的，有些事件是在js里响应的。
 * 这样就导致两边的事件响应不一致还无法互通，就会发生一个动作同时触发多个组件响应的情况。
 * 所以，qrn致力于将所有的事件统一都放到js层处理，来避免这个问题。这也决定了 ScrollView 的touch事件都是通过js来处理的。
 *
 * 详细说明一下 responder 事件：
 * 一个可以参考的背景资料是这个：http://reactnative.cn/docs/0.30/gesture-responder-system.html#content
 * 简单来说，就是：***SetResponderCapture 由外向内冒泡，***SetResponder 由内向外冒泡，然后决定谁来响应；之后通过 onResponderTerminationRequest 来判定要不要交出控制权。
 *
 * responder的决定型事件：（即通过返回值来决定是否响应/处理/阻止）
 *   - onStartShouldSetResponderCapture: 默认不阻止内层组件响应，除非正在动画
 *   - onStartShouldSetResponder: 默认响应，除非disabled了或者处于『不可打断』的动画中
 *   - onMoveShouldSetResponderCapture: 默认不阻止内层组件响应，除非正在动画
 *   - onMoveShouldSetResponder: 如果移动距离过小，则不响应；否则就响应
 *   - onResponderTerminationRequest: 只有在移动的方向上已经到顶了，才会交出控制权
 *
 * responder的响应型事件：（即一堆的回调）
 *   - onResponderGrant: 要开始响应时的回调（类似touchstart），主要初始化一些touch相关的数据，清理上一次touch遗留的数据
 *   - onResponderMove: 移动时的回调（类似touchmove），根据用户移动距离进行移动。未超出移动范围时，用户移动多少 ScrollView 移动多少；超出范围时，根据用户的移动计算移动距离（应该是超出的越多，越难移动）
 *   - onResponderRelease: 松手时的回调（类似touchend），在松手的时候，会发生这么几种可能：
 *         1. 有惯性移动
 *            1.1 惯性移动在滚动范围内：惯性移动
 *            1.2 惯性移动超出了滚动范围：先惯性移动，在移动出范围时，减速度变大；然后做回弹处理
 *         2. 没有惯性移动
 *            2.1 没有超出滚动范围：什么都不用做了
 *            2.2 超出了滚动范围：需要做回弹处理
 *   - onResponderTerminate: 控制权交出时的回调（现在就占位了，什么也没干......）
 *
 * 以上就是 ScrollView 基础功能的主要实现思路。有这些逻辑，就能实现一个能够滚动的容器。
 * ScrollView 在此基础上还添加了许多复杂的逻辑，下面会讲一些复杂或重要的附加功能的实现。
 *
 * 1. indicator 滚动条
 *    就是因为有了indicator，所以在render的时候，最外层多了一层容器。滚动条的计算比较简单：
 *        滚动条长度 / 滚动条区域长度 = 滚动容器长度（宽度） / 文本容器长度（宽度）
 *    (1) 滚动条有最小长度；
 *    (2) 滚动超出屏幕时，根据超出距离减少滚动条长度（此时不受最小长度限制）；
 *    (3) 当文本内容未达到容器长度时，不显示滚动条。
 *
 * 2. contentInset
 *    这个功能非常难描述。
 *
 * 3. pagingEnabled
 *
 * 4. refreshControl & loadControl
 *    开发过程就是一部血泪史，刚开始在 ios 上按照通常的思路，把下拉刷新的部分放到top为负值的地方藏起来，等下拉的时候正常显示出来。
 *    然后，开发完成之后上 android 上一测试，直接就跪了。这才发现 android 的 overflow 只能是hidden，藏起来的东西就再也不会出来了。
 *    最后还是老老实实的用最难搞的 contentInset 来实现。
 *
 * 5. horizontal 横向
 *    按照 ScrollView 的基本逻辑，横向和纵向滚动是没有什么区别的，但是因为 rn 布局方式的问题，横向和纵向的处理有一些不同。
 *    (1) 纵向时，内容容器会自动横向撑开；
 *    (2) 横向时，内容容器并不会纵向自动撑开，需要通过设置contentContainerStyle的flex或height来撑开（当然，给内容设置高度也可以解决这个问题）；
 *    (3) 由于各种弹性、惯性过程，横向和纵向是分别处理的，所以可能会出现，横向还在滚动纵向已经开始回弹的效果，这是正常的。
 */

let defaultProps = {
    contentInset: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    showsVerticalScrollIndicator: true,
    showsHorizontalScrollIndicator: true,
    horizontal: false,
    scrollEnabled: true,
    pagingEnabled: false,
    bounces: true,
    // removeClippedSubviews: false,
    keyboardDismissMode: 'none',
    keyboardShouldPersistTaps: true,
};

let propTypes = {
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
     * @version >=v1.1.0
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
     * 滚动事件回调
     *
     * @property onScroll
	 * @type function
     * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
	 * @description (event) => void
     *
     * 在滚动的过程中，每帧调用一次此回调函数。
     *
     * ** 如果使用了RefreshControl组件，则y包含RefreshControl组件的高度。即：在顶部时，正常是 `{contentOffset: {y: 0}}`，如果有RefreshControl组件，则为 `{contentOffset: {y: 0}}` （35为RefreshControl的默认高度）。**
     */
    onScroll: PropTypes.func,

    /**
     * 滚动动画结束回调
     *
     * @property onScrollAnimationEnd
	 * @type function
     * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
	 * @description (event) => void
     *
     * 当滚动动画结束之后调用此回调。
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
	 * @description 一个子视图下标的数组，用于决定哪些成员会在滚动之后固定在屏幕顶端。举个例子，传递stickyHeaderIndices={[0]}会让第一个成员固定在滚动视图顶端。这个属性不能和horizontal={true}一起使用。
     */
    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
    snapToInterval: PropTypes.number,
    snapToAlignment: PropTypes.oneOf([
      'start', // default
      'center',
      'end',
    ]),
    /**
     * 滚动时隐藏键盘
     *
     * @property keyboardDismissMode
     * @type enum('none', 'on-drag')
     * @description 用户拖拽滚动视图的时候，是否要隐藏软键盘。`none`(默认值)，拖拽时不隐藏软键盘。`on-drag`，当拖拽开始的时候隐藏软键盘。
     * @default 'none'
     * @version >=v1.2.0
     */
    keyboardDismissMode: PropTypes.oneOf(['none', 'on-drag']),
    /**
     * 点击其他区域时隐藏键盘
     *
     * @property keyboardShouldPersistTaps
     * @type PropTypes.bool
     * @description 默认值为true**（默认值与rn不一样，主要是为了兼容之前的版本）**。当此属性为`true`的时候，在软键盘激活之后，点击焦点文本输入框以外的地方，键盘不会自动消失。当此属性为`false`的时候，在软键盘激活之后，点击焦点文本输入框以外的地方，键盘就会隐藏。
     *
     * **注：该属性的默认值与官方相反，默认在点击其他区域时不会收起键盘。同时，该属性的表现也与官方有区别：官方版本，在点击其他区域时会首先收起键盘，再次点击才会触发对应的操作；qrn的版本，在点击其他区域时会同时收起键盘，触发对应的操作。
     * 比如：页面上有输入框和『提交』按钮时，键盘弹起时点击按钮：官方版本会收起键盘，再次点击按钮才会触发按钮的点击事件；qrn版本在第一次点击『提交』按钮时就会收起键盘并且触发按钮的点击事件。**
     * @default true
     * @version >=v1.3.0
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
     * @version >=v1.2.0
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
     * @version >=v1.2.0
     */
    onMomentumScrollEnd: PropTypes.func,
    /**
     * 惯性滚动开始的回调
     *
     * @property onScrollBeginDrag
     * @type function
     * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
     * @description (event) => void
     *
     * 拖拽滚动开始时的回调。
     * @version >=v1.2.0
     */
    onScrollBeginDrag: PropTypes.func,
    /**
     * 惯性滚动结束的回调
     *
     * @property onScrollEndDrag
     * @type function
     * @param {obj} event {nativeEvent: {contentOffset: {x: number, y: number}}
     * @description (event) => void
     *
     * 拖拽滚动结束时的回调。
     * @version >=v1.2.0
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
     * 内容容器尺寸改变回调
     *
     * @property onContentSizeChange
	 * @type function
     * @param {number} width 内容容器宽度
     * @param {number} height 内容容器高度
	 * @description (width, height) => void
     *
     * ScrollView内容容器onLayout时触发，所有的子视图都会包裹在内容容器内。
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
    scrollPosition: PointPropType, // 不写的话，native的RCTScrollableView校验会报奇怪的错误，简直不可理喻！
};

class ScrollView extends Component {

    constructor(props) {

        super(props);

        // alwaysBounce* 不需要render
        this.alwaysBounceHorizontal = props.alwaysBounceHorizontal !== undefined ? props.alwaysBounceHorizontal : props.horizontal;
        this.alwaysBounceVertical = props.alwaysBounceVertical !== undefined ? props.alwaysBounceVertical : !props.horizontal;
        if(props.horizontal && props.pagingEnabled) {
            this.alwaysBounceVertical = false;
        } else if(!props.horizontal && props.pagingEnabled) {
            this.alwaysBounceHorizontal = false;
        }

        // decelerationRate 不需要render
        if (props.decelerationRate) {
            this.decelerationRate = processDecelerationRate(props.decelerationRate);
        }

        this.contentOffset = { // 位移
            x: props.contentOffset && props.contentOffset.x ? props.contentOffset.x : 0,
            y: props.contentOffset && props.contentOffset.y ? props.contentOffset.y : 0,
        };
        this.contentInset = Object.assign({}, this.props.contentInset);

        this.isTouching = false; // 是否正在touch
        this.isAnimating = false; // 动画锁
        this.isAnimatingInterruptible = true // 当前动画是否可被手势打断
        this.fixOffset = null;
        this.contentOffsetLimit = {}; // 位移的界限 {left: 0, right: 0, top: 0, bottom: 0}

        this.initialTouchPoint = null;
        this._indicatorTimer = null;  // release时的减速timer
        this._decelerateTimer = null; // 隐藏滚动条的timer

        this.contentSize = { // 滚动内容size
            width: 0,
            height: 0,
        };

        this.scrollViewSize = { // 滚动容器size
            width: 0,
            height: 0,
        };

        // refreshControl 是通过 contentInset 和 contentOffset 来实现的，需要修正这两个值
        if(props.refreshControl) {
            const {height} = props.refreshControl.props;
            this.contentInset.top -= height;
            this.contentOffset.y += height;
        }

        this.indicator = {
            vertical: {
                showed: false,
                length: 0,
                offset: 0,
            },
            horizontal: {
                showed: false,
                length: 0,
                offset: 0,
            },
        };

        this.state =  {
            isRefreshing: false,
            isLoading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        // alwaysBounce* 不需要render
        this.alwaysBounceHorizontal = nextProps.alwaysBounceHorizontal !== undefined ? nextProps.alwaysBounceHorizontal : nextProps.horizontal;
        this.alwaysBounceVertical = nextProps.alwaysBounceVertical !== undefined ? nextProps.alwaysBounceVertical : !nextProps.horizontal;
        if(nextProps.horizontal && nextProps.pagingEnabled) {
            this.alwaysBounceVertical = false;
        } else if(nextProps.horizontal && nextProps.pagingEnabled) {
            this.alwaysBounceHorizontal = false;
        }

        // decelerationRate 不需要render
        if (nextProps.decelerationRate) {
            this.decelerationRate = processDecelerationRate(nextProps.decelerationRate);
        }

        // 如果contentOffset不一致就重新设置
        if(pointsDiffer(this.props.contentOffset, nextProps.contentOffset)) {
            this.contentOffset = { // 位移
                x: nextProps.contentOffset && nextProps.contentOffset.x ? nextProps.contentOffset.x : 0,
                y: nextProps.contentOffset && nextProps.contentOffset.y ? nextProps.contentOffset.y : 0,
            };
        }

        // 如果contentInset不一致就重新设置
        if(insetsDiffer(this.props.contentInset, nextProps.contentInset)) {
            this.contentInset = Object.assign({}, nextProps.contentInset);
        }

        // refreshControl 是通过 contentInset 和 contentOffset 来实现的，需要修正这两个值
        if(!this.props.refreshControl && nextProps.refreshControl) {
            const {height} = nextProps.refreshControl.props;
            this.contentInset.top -= height;
            this.contentOffset.y += height;
        }
    }

    /**
     * 滚动到
     *
     * @method scrollTo
     * @param {obj} config 滚动配置
     * @param {number} [config.x] 横向位移
     * @param {number} [config.y] 纵向位移
     * @param {bool} [config.animated] 是否动画
     * @param {number} [config.duration] <1.3.0> 动画时长
     * @description 滚动到某一位置，如果只在某一方向滚动，可以只传{x: x}或{y: y}。默认animated为true。
     *
     * ** 如果使用了RefreshControl组件，则y需要包含RefreshControl组件的高度。即：滚动到顶部，正常是 `scrollTo({y: 0})`，如果有RefreshControl组件，则 `scrollTo({y: 35})` （35为RefreshControl的默认高度）。**
     */
    scrollTo(options) {
        // 从外部调用scrollTo时，先把之前的手势动画清除
        if(this._decelerateTimer){
            clearInterval(this._decelerateTimer);
            this._decelerateTimer = null;
        }
        this._scrollTo(options, true); // fromUser: true
    }

    _scrollTo(options: {}, fromUser) { // fromUser 表示是外部调用的
        options.animated = typeof options.animated === 'undefined' ? true : options.animated

        let offset = {
            x:  typeof options.x !== 'undefined' ? options.x : this.contentOffset.x,
            y:  typeof options.y !== 'undefined' ? options.y : this.contentOffset.y,
        }

        let duration = options.duration || SCROLLTO_DURATION;

        if(options.animated === true && !this.isAnimating) {
            this.isAnimating = true

            let startTime = Date.now(),
                currentTime = 0

            const startPos = {
                    x: this.contentOffset.x,
                    y: this.contentOffset.y,
                },
                distance = {
                    x: offset.x - this.contentOffset.x,
                    y: offset.y - this.contentOffset.y,
                },
                direction = {
                    x: distance.x > 0 ? 1 : -1,
                    y: distance.y > 0 ? 1 : -1,
                }
            let currentPos = {
                x: this.contentOffset.x,
                y: this.contentOffset.y,
            }

            // console.log('onMomentumScrollBegin');
            this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin({
                nativeEvent: {
                    contentOffset: Object.assign({}, this.contentOffset)
                }
            });

            requestAnimationFrame(move.bind(this))

            function move() {
                const nextPos = {
                    x: TweenEaseOutCubic(currentTime, startPos.x, distance.x, duration),
                    y: TweenEaseOutCubic(currentTime, startPos.y, distance.y, duration),
                }

                const isAchievedX = (direction.x === 1 && nextPos.x >= offset.x) || (direction.x === -1 && nextPos.x <= offset.x),
                    isAchievedY = (direction.y === 1 && nextPos.y >= offset.y) || (direction.y === -1 && nextPos.y <= offset.y),
                    interruptedByTouch = this.isTouching && this.isAnimatingInterruptible

                isAchievedX ? nextPos.x = offset.x : null
                isAchievedY ? nextPos.y = offset.y : null

                this._scrollTo.bind(this)({
                    x: nextPos.x,
                    y: nextPos.y,
                    animated: false,
                }, fromUser)

                Object.assign(currentPos, nextPos)

                if(currentTime <= duration && !interruptedByTouch) {
                    currentTime = Date.now() - startTime
                    requestAnimationFrame(move.bind(this))
                } else {
                    this.isAnimating = false
                    if(fromUser){
                        this.hideIndicator()
                    }

                    var _evt = {
                        nativeEvent: {
                            contentOffset: Object.assign({}, this.contentOffset)
                        }
                    }

                    // console.log('onMomentumScrollEnd');
                    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(_evt);
                    this.props.onScrollAnimationEnd && this.props.onScrollAnimationEnd(_evt);
                }
            }

            function TweenEaseOutCubic(curTime, startPos, distance, duration){
				return distance * ((curTime= curTime / duration - 1) * curTime * curTime + 1) + startPos;
			}
        } else {
            this.contentOffset = Object.assign({}, offset);
            if(fromUser) {
                this.forceUpdate();
            } else {
                this.renderIndicator();
                this.forceUpdate();
                !this.isTouching && this.hideIndicator();
            }

            if(this.props.keyboardDismissMode == 'on-drag') {
                dismissKeyboard();
            }

            this.props.onScroll && this.props.onScroll({
                nativeEvent: {
                    contentOffset: Object.assign({}, offset)
                }
            });

            if(this.props.refreshControl) {
                this.refs[REFRESHCONTROL] && this.refs[REFRESHCONTROL].onScroll && this.refs[REFRESHCONTROL].onScroll({
                    y: this.contentOffsetLimit.minY - offset.y,
                });
            }
        }
    }

    onTouchStart(e: Event) {
        this.isTouching = true;
        this.props.onTouchStart && this.props.onTouchStart(e);
    }

    onTouchMove(e: Event) {
        this.props.onTouchMove && this.props.onTouchMove(e);
    }

    onTouchEnd(e: Event) {
        var nativeEvent = e.nativeEvent;
        this.isTouching = nativeEvent.touches.length !== 0;
        this.props.onTouchEnd && this.props.onTouchEnd(e);
    }

    onResponderTerminationRequest(e: Event) { // 必须在移动的方向上都已经到顶，才会交出控制权
        var {pageX, pageY} = e.nativeEvent,
            allowVertical = false,
            allowHorizontal = false;

        if(pageX > this.initialTouchPoint.x && this.contentOffset.x == this.contentOffsetLimit.minX) {
            allowHorizontal = true;
        } else if(pageX < this.initialTouchPoint.x && this.contentOffset.x == this.contentOffsetLimit.maxX) {
            allowHorizontal = true;
        } else if(pageX == this.initialTouchPoint.x) {
            allowHorizontal = true;
        }

        if(pageY > this.initialTouchPoint.y && this.contentOffset.y == this.contentOffsetLimit.minY) {
            allowVertical = true;
        } else if(pageY < this.initialTouchPoint.y && this.contentOffset.y == this.contentOffsetLimit.maxY) {
            allowVertical = true;
        } else if(pageY == this.initialTouchPoint.y) {
            allowVertical = true;
        }

        if(this.props.horizontal && allowHorizontal) {
            return true;
        } else if(!this.props.horizontal && allowVertical) {
            return true;
        }

        // if(allowVertical && allowHorizontal) {
        //     return true;
        // }
        return false;
    }

    onResponderTerminate(e: Event) {
    }

    handleContentOnLayout(e: Object) {
        var {width, height} = e.nativeEvent.layout;
        this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
    }

    onContentContainerLayout(e) {
        var {width, height} = e.nativeEvent.layout;
        this.contentSize = {width: width, height: height};

        this.contentOffsetLimit = {
            minX: -this.contentInset.left,
            maxX: Math.max(-this.contentInset.left, this.contentSize.width - this.scrollViewSize.width + this.contentInset.right),
            minY: -this.contentInset.top,
            maxY: Math.max(-this.contentInset.top, this.contentSize.height - this.scrollViewSize.height + this.contentInset.bottom),
        }

        if(!this._decelerateTimer && !this.isTouching) { // 修正 contentOffset
            var x = Math.min(this.contentOffsetLimit.maxX, Math.max(this.contentOffsetLimit.minX, this.contentOffset.x));
            var y = Math.min(this.contentOffsetLimit.maxY, Math.max(this.contentOffsetLimit.minY, this.contentOffset.y));

            if(x != this.contentOffset.x || y != this.contentOffset.y) {
                this.contentOffset = {
                    x: x,
                    y: y,
                }
                this.forceUpdate();
            }
        }
    }

    onScrollViewLayout(e) {
        this.props.onLayout && this.props.onLayout(e);

        var {width, height} = e.nativeEvent.layout;
        this.scrollViewSize = {width: width, height: height};

        this.contentOffsetLimit = {
            minX: -this.contentInset.left,
            maxX: Math.max(-this.contentInset.left, this.contentSize.width - this.scrollViewSize.width + this.contentInset.right),
            minY: -this.contentInset.top,
            maxY: Math.max(-this.contentInset.top, this.contentSize.height - this.scrollViewSize.height + this.contentInset.bottom),
        }
    }

    componentWillUpdate() {
        if(this.fixOffset) {
            this.contentOffset = {
                x: this.contentOffset.x - this.fixOffset.x,
                y: this.contentOffset.y - this.fixOffset.y,
            };

            if(this.startX) {
                this.startX -= this.fixOffset.x;
            }

            if(this.startY) {
                this.startY -= this.fixOffset.y;
            }

            if(this.contentOffsetWhenTouchStart) {
                this.contentOffsetWhenTouchStart.x -= this.fixOffset.x;
                this.contentOffsetWhenTouchStart.y -= this.fixOffset.y;
            }

             this.fixOffset = null;
        }
    }

    componentWillUnmount() {
        if(this._decelerateTimer) {
            clearInterval(this._decelerateTimer);
            this._decelerateTimer = null;
        }

        if(this._indicatorTimer) {
            clearTimeout(this._indicatorTimer);
            this._indicatorTimer = null;
        }
    }

    onStartShouldSetResponder(e) {
        if(!this.props.scrollEnabled || !this.isAnimatingInterruptible) {
            return false;
        }

        return true;
    }

    onStartShouldSetResponderCapture(e) { // 如果正在滚动，则阻止事件向内冒泡
        var {pageX, pageY} = e.nativeEvent;
        this.initialTouchPoint = {x: pageX, y:pageY};

        if(this._decelerateTimer) {
            return true;
        }

        // 如果开始响应时，键盘弹起了，则判断是否需要收起键盘
        var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
        if (!this.props.keyboardShouldPersistTaps &&
            currentlyFocusedTextInput != null &&
            e.target !== currentlyFocusedTextInput) {
            TextInputState.blurTextInput(currentlyFocusedTextInput);
        }

        return false;
    }

    onMoveShouldSetResponder(e) {
        if(!this.props.scrollEnabled || !this.isAnimatingInterruptible) {
            return false;
        }
        var {pageX, pageY} = e.nativeEvent;

        var deltaX = this.initialTouchPoint.x - pageX,
            deltaY = this.initialTouchPoint.y - pageY;

        var moveDistance;

        if(this.props.horizontal) {
            moveDistance = Math.abs(deltaX);
        } else {
            moveDistance = Math.abs(deltaY);
        }

        if (moveDistance < SCROLL_MOVE_THRESHOLD) {
            return false;
        }

        return true;
    }

    onMoveShouldSetResponderCapture(e) {
        var {pageX, pageY} = e.nativeEvent;


        if(!this.initialTouchPoint) {
            this.initialTouchPoint = {
                x: pageX,
                y: pageY,
            }
        }

        var deltaX = this.initialTouchPoint.x - pageX,
            deltaY = this.initialTouchPoint.y - pageY,
            moveDistance;

        if(this.props.horizontal) {
            moveDistance = Math.abs(deltaX);
        } else {
            moveDistance = Math.abs(deltaY);
        }

        if (this._decelerateTimer) {
            return true;
        } else {
            return false;
        }
        // else if (moveDistance < SCROLL_MOVE_THRESHOLD) {
        //     return false;
        // }
        //
        // return true;
    }

    onResponderGrant(e) {

        if (this._decelerateTimer) {
            clearInterval(this._decelerateTimer);
            this._decelerateTimer = null;
        }

        if(!this.props.scrollEnabled || !this.isAnimatingInterruptible) {
            return false;
        }

        var {pageX, pageY} = e.nativeEvent;


        if(this._indicatorTimer) {
            clearTimeout(this._indicatorTimer);
            this._indicatorTimer = null;
        }

        if(!this.initialTouchPoint) {
            this.initialTouchPoint = {x: pageX, y:pageY};
        }

        // 初始位置值应当在 on*ShouldSetResponderCapture 时记录，否则嵌套的时候，冒泡到外层时无法得到初始位置
        // this.initialTouchPoint = {x: pageX, y:pageY};
        this.contentOffsetWhenTouchStart = this.contentOffset;
        this.state._touchHistory = [];

        this.props.onResponderGrant && this.props.onResponderGrant(e);

        // console.log('onScrollBeginDrag');
        this.props.onScrollBeginDrag && this.props.onScrollBeginDrag({
            nativeEvent: {
                contentOffset: Object.assign({}, this.contentOffset)
            }
        });
    }

    onResponderMove(e) {
        if(!this.props.scrollEnabled || !this.isAnimatingInterruptible) {
            return false;
        }

        var {pageX, pageY, timestamp} = e.nativeEvent;
        var deltaX = this.initialTouchPoint.x - pageX,
            deltaY = this.initialTouchPoint.y - pageY;
        var x = this.initialTouchPoint.x + this.contentOffsetWhenTouchStart.x - pageX,
            y = this.initialTouchPoint.y + this.contentOffsetWhenTouchStart.y - pageY;
        var contentOffsetLimit = this.contentOffsetLimit;

        var moveDistance = deltaX*deltaX + deltaY*deltaY;

        if (moveDistance < SCROLL_MOVE_THRESHOLD*SCROLL_MOVE_THRESHOLD) {
            return;
        }

        this.state._touchHistory.push({x: pageX, y:pageY, t:timestamp});
        this.state._touchHistory = this.state._touchHistory.slice(-TOUCH_HISTORY_RECORD_NUM);

        if(x < contentOffsetLimit.minX) {
            if(!this.props.bounces) {
                x = contentOffsetLimit.minX;
            } else if(!this.alwaysBounceHorizontal && contentOffsetLimit.minX == contentOffsetLimit.maxX) {
                x = contentOffsetLimit.minX;
            } else {
                x = contentOffsetLimit.minX - 5 * Math.sqrt(contentOffsetLimit.minX - x);
            }
        } else if(x > contentOffsetLimit.maxX) {
            if(!this.props.bounces) {
                x = contentOffsetLimit.maxX;
            } else if(!this.alwaysBounceHorizontal && contentOffsetLimit.minX == contentOffsetLimit.maxX) {
                x = contentOffsetLimit.maxX;
            } else {
                x = contentOffsetLimit.maxX + 5 * Math.sqrt(x - contentOffsetLimit.maxX);
            }
        }

        if(y < contentOffsetLimit.minY) {
            if(!this.props.bounces) {
                y = contentOffsetLimit.minY;
            } else if(!this.alwaysBounceVertical && contentOffsetLimit.minY == contentOffsetLimit.maxY) {
                y = contentOffsetLimit.minY;
            } else {
                y = Math.max(y, contentOffsetLimit.minY - 5 * Math.sqrt(contentOffsetLimit.minY - y));
            }
        } else if(y > contentOffsetLimit.maxY) {
            if(!this.props.bounces) {
                y = contentOffsetLimit.maxY;
            } else if(!this.alwaysBounceVertical && contentOffsetLimit.minY == contentOffsetLimit.maxY) {
                y = contentOffsetLimit.maxY;
            } else {
                y = Math.min(y, contentOffsetLimit.maxY + 5 * Math.sqrt(y - contentOffsetLimit.maxY));
            }
        }

        this._scrollTo({x: x, y: y, animated: false,});
    }

    onResponderRelease(e) {
        var {pageX, pageY} = e.nativeEvent;
        var touches = this.state._touchHistory;

        var dt = 1,
            dx = 0,
            dy = 0;
        for (var i=touches.length-1; i>=0; i--) {
            if (e.nativeEvent.timestamp - touches[i].t > TOUCH_VELOCITY_CALCULATE_RANGE) {
                break;
            }
            dt = (e.nativeEvent.timestamp - touches[i].t); // seconds
            dx = touches[i].x - e.nativeEvent.pageX;
            dy = touches[i].y - e.nativeEvent.pageY;
        }
        var vx = dx/dt,
            vy = dy/dt;

        if(this.props.refreshControl) {
            let self = this;

            const {height} = this.props.refreshControl.props;
            let _over = this.contentOffsetLimit.minY - this.contentOffset.y;
            let refreshControl = this.refs[REFRESHCONTROL];

            refreshControl.onRelease && refreshControl.onRelease({
                y: _over,
            }, ()=>self.startRefreshing(true), ()=>self.stopRefreshing());
        }

        if(this.props.loadControl) {
            let self = this;

            const {height} = this.props.loadControl.props;
            let _over = this.contentOffset.y - this.contentOffsetLimit.maxY;
            let loadControl = this.refs[LOADCONTROL];

            loadControl.onRelease && loadControl.onRelease({
                y: _over,
            }, ()=>self.startLoading(), ()=>self.stopLoading());
        }
        // console.log('onScrollEndDrag');
        this.props.onScrollEndDrag && this.props.onScrollEndDrag({
            nativeEvent: {
                contentOffset: Object.assign({}, this.contentOffset)
            }
        });

        // 如果有惯性移动，则先惯性移动，再判断是否需要回弹；如果没有，则直接判断是否需要回弹
        if (Math.abs(vx) < TOUCH_VELOCITY_THRESHOLD && Math.abs(vy) < TOUCH_VELOCITY_THRESHOLD) {
            this.clearTouchStates();
            this.startBounce();
        } else {
            this.startDecelerateWithVelocity(vx, vy);
        }

        var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
        if (!this.props.keyboardShouldPersistTaps &&
            currentlyFocusedTextInput != null &&
            e.target !== currentlyFocusedTextInput
            // && !this.state.observedScrollSinceBecomingResponder
            // &&!this.state.becameResponderWhileAnimating
        ) {
            TextInputState.blurTextInput(currentlyFocusedTextInput);
        }
    }

    /**
     * 开始下拉刷新
     *
     * @method startRefreshing
     * @description 当前组件有refreshControl属性，并且没有正在下拉刷新，则强制触发下拉刷新，变成正在刷新的状态
     */
    startRefreshing(fromResponder) {  // fromResponder为true，表示是scroll时触发的；为false，表示是强制触发的
        if(this.props.refreshControl && !this.state.isRefreshing) {
            const {height} = this.props.refreshControl.props;

            this.contentInset.top += height;
            this.contentOffsetLimit.minY = -this.contentInset.top;
            this.contentOffsetLimit.maxY = Math.max(this.contentOffsetLimit.minY, this.contentOffsetLimit.maxY);  // 如果不到一屏，则需要修整maxY

            this.setState({
                isRefreshing: true,
            });

            let refreshControl = this.refs[REFRESHCONTROL];

            refreshControl.onRefresh();

            // 通知上层组件刷新动作
            if(this.props.onRefresh){
                this.props.onRefresh()
            }

            if(!fromResponder) {
                this._scrollTo({
                    y: this.contentOffsetLimit.minY,
                    animated: false,
                });
            }
        }
    }

    /**
     * 停止下拉刷新
     *
     * @method stopRefreshing
     * @param {obj} [config] 停止刷新时的配置项
     * @param {bool} [config.animated] 回到顶部是否需要动画
     * @param {number} [config.duration] <1.3.0> 回到顶部的动画时间，默认是300ms
     * @param {bool} [config.result] <1.3.0> 表示刷新成功还是失败。undefined：不显示刷新之后的状态；true：显示『加载成功』；false：显示『加载失败』
     * @description 当前组件有refreshControl属性，并且正在下拉刷新，则停止下拉刷新的状态。默认带有动画，可以设置{animated: false}取消。
     *
     * **停止刷新时，会自动ScrollTo顶部，所以不需要外部再调用。滚动到顶部的过程中，会禁止ScrollView响应。**
     */
    stopRefreshing(config = {}) {
        let duration = config.duration || SCROLLTO_DURATION;
        if(this.props.refreshControl && this.state.isRefreshing) {
            const {height} = this.props.refreshControl.props;

            if(config.animated === false){
                this.contentInset.top -= height;
                this.contentOffsetLimit.minY = -this.contentInset.top;
                this.contentOffsetLimit.maxY = Math.max(this.contentOffsetLimit.minY, this.contentOffsetLimit.maxY);  // 如果不到一屏，则需要修整maxY

                // 修正 contentInset.top 改变之后的位置
                this.setContentOffsetBeforeLayout({x: 0, y: -height});
            } else{
                setTimeout(() => {
                    this.contentInset.top -= height;
                    this.contentOffsetLimit.minY = -this.contentInset.top;
                    this.contentOffsetLimit.maxY = Math.max(this.contentOffsetLimit.minY, this.contentOffsetLimit.maxY);  // 如果不到一屏，则需要修整maxY
                    this.isAnimatingInterruptible = true;
                    this.setState({
                        refreshResult: null,
                    });
                }, duration)

                // 收起阶段不可被触摸打断
                this.isAnimatingInterruptible = false;
                this._scrollTo({y: height, duration: duration});
            }

            // 触发scrollView render校正contentInset，触发refreshControl render调整
            this.setState({
                isRefreshing: false,
                refreshResult: config.result,
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
        if(this.props.loadControl && !this.state.isLoading) {
            this.setState({
                isLoading: true,
            });

            let loadControl = this.refs[LOADCONTROL];
            loadControl.onLoad();
        }
    }

    /**
     * 停止加载更多
     *
     * @method stopLoading
     * @description 当前组件有loadControl属性，并且正在加载，则停止加载更多的状态
     */
    stopLoading() {
        if(this.props.loadControl && this.state.isLoading) {
            this.setState({
                isLoading: false,
            })
        }
    }

    /**
     * 在layout前设置offset
     *
     * @method setContentOffsetBeforeLayout
     * @param {PointPropType{x:x,y:y}} position 设置相对当前contentOffset的位移量
     * @description 本方法用来设置contentOffset相对当前的contentOffset偏移多少，在下一次render的时候会生效。本方法的主要使用场景是，当滚动内容的高度发生变化时（尤其是变小时），希望render之后，用户看到的内容位置是不变的。
     */
    setContentOffsetBeforeLayout(pos: Object) {
        this.fixOffset = pos;
    }

    getBounceEdge(vx, vy) {
        var {width, height} = this.scrollViewSize,
            {x, y} = this.contentOffset,
            contentOffsetLimit = this.contentOffsetLimit;

        var edge = {
            horizontal: x,
            vertical: y,
        };

        if(x < contentOffsetLimit.minX) {
            edge.horizontal = contentOffsetLimit.minX;
        } else if(x > contentOffsetLimit.maxX) {
            edge.horizontal = contentOffsetLimit.maxX;
        }
        if(y < contentOffsetLimit.minY) {
            edge.vertical = contentOffsetLimit.minY;
        } else if(y > contentOffsetLimit.maxY) {
            edge.vertical = contentOffsetLimit.maxY;
        }

        if(!this.props.pagingEnabled) {
            return edge;
        } else { // 前面已经处理了超出滚动范围的情况，这里只处理出于滚动范围内的情况即可
            if(this.props.horizontal) {
                var pageNum = Math.floor(x / width),
                    _left = Math.max(pageNum * width, contentOffsetLimit.minX),
                    _right = Math.min((pageNum + 1) * width, contentOffsetLimit.maxX); // 有可能最后一屏不全

                if(!vx) {
                    if((x - _left) / (_right - _left) < 0.5){
                        edge.horizontal = _left;
                    } else {
                        edge.horizontal = _right;
                    }
                } else if(vx > 0) {
                    edge.horizontal = _right;
                } else if(vx < 0){
                    edge.horizontal = _left;
                }
            } else {
                var pageNum = Math.floor(y / height),
                    _top = Math.max(pageNum * height, contentOffsetLimit.minY),
                    _bottom = Math.min((pageNum + 1) * height, contentOffsetLimit.maxY); // 有可能最后一屏不全

                if(!vy) {
                    if((y - _top) / (_bottom - _top) < 0.5){
                        edge.vertical = _top;
                    } else {
                        edge.vertical = _bottom;
                    }
                } else if(vy > 0) {
                    edge.vertical = _bottom;
                } else if(vy < 0){
                    edge.vertical = _top;
                }
            }
        }

        return edge;
    }

    startBounce() {
        var _y = this.contentOffset.y,
            _x = this.contentOffset.x;

        this.startX = _x;
        this.startY = _y;

        var edge = this.getBounceEdge();

        if(this.props.pagingEnabled && !this.props.horizontal) {
            this._scrollTo({y: edge.vertical});
            return;
        } else if(this.props.pagingEnabled && this.props.horizontal) {
            this._scrollTo({x: edge.horizontal});
            return;
        }

        if(_x != edge.horizontal || _y != edge.vertical) {
            var overHorizontal = typeof edge.horizontal !== 'undefined' ? Math.abs(_x - edge.horizontal) : 0,
                overVertical = typeof edge.vertical !== 'undefined' ? Math.abs(_y - edge.vertical) : 0;

            var currentPosition = 0,
                currentTime = 0,
                duration = this.getBounceDuration(overHorizontal, overVertical);

            // console.log('onMomentumScrollBegin');
            this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin({
                nativeEvent: {
                    contentOffset: Object.assign({}, this.contentOffset)
                }
            });

            this._decelerateTimer = setInterval(() => {

                edge = this.getBounceEdge();

                if((_x == edge.horizontal && _y == edge.vertical) || !this.props.scrollEnabled || !this.isAnimatingInterruptible){

                    // console.log('onMomentumScrollEnd')
                    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd({
                        nativeEvent: {
                            contentOffset: Object.assign({}, this.contentOffset)
                        }
                    });

                    clearInterval(this._decelerateTimer);
                    this._decelerateTimer = null;

                    this.hideIndicator();
                    this.startX = null;
                    this.startY = null;
                    return;
                }

                _x = this.getBouncePosition(edge.horizontal, _x, currentTime, this.startX, overHorizontal, duration);
                _y = this.getBouncePosition(edge.vertical, _y, currentTime, this.startY, overVertical, duration);

                this._scrollTo({x: _x, y: _y, animated: false,});

                currentTime += DECELERATE_INTERVAL;
            }, DECELERATE_INTERVAL);
        } else {
            this.hideIndicator();
        }
    }

    getBouncePosition(edge, currentPosition, currentTime, startPoistion, distance, duration) {
        let nextPosition
        if(currentPosition > edge) {
            nextPosition = easeOutCubic(currentTime, startPoistion, -distance, duration);
            return Math.max(edge, nextPosition);
        } else if(currentPosition < edge) {
            nextPosition = easeOutCubic(currentTime, startPoistion, distance, duration);
            return Math.min(edge, nextPosition);
        } else {
            return edge;
        }

        function easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        }
    }

    getBounceDuration(overHorizontal = 0, overVertical = 0){
        return Math.pow(Math.max(overHorizontal, overVertical), 2) / 50 + 300
    }

    startDecelerateWithVelocity(_vx, _vy) {
        var vx = _vx, vy = _vy;
        var sx = 0, sy = 0;
        var decelerationRate = this.decelerationRate ? this.decelerationRate : 0.998;
        var speed = 0.5;

        // 速度差
        var dvx = vx * (1-decelerationRate) * DECELERATE_INTERVAL/2,
            dvy = vy * (1-decelerationRate) * DECELERATE_INTERVAL/2;

        var startX,
            startY,
            currentTimeX = 0,
            currentTimeY = 0,
            durationX,
            durationY,
            overHorizontal,
            overVertical;

        var edge = this.getBounceEdge(_vx, _vy);

        if(this.props.pagingEnabled && !this.props.horizontal) {
            this._scrollTo({y: edge.vertical});
            return;
        } else if(this.props.pagingEnabled && this.props.horizontal) {
            this._scrollTo({x: edge.horizontal});
            return;
        }

        // console.log('onMomentumScrollBegin');
        this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin({
            nativeEvent: {
                contentOffset: Object.assign({}, this.contentOffset)
            }
        });

        this._decelerateTimer = setInterval(
            () => {
                if(!this.props.scrollEnabled || !this.isAnimatingInterruptible) {
                    clearInterval(this._decelerateTimer);
                    this._decelerateTimer = null;
                    this.clearTouchStates();

                    this.hideIndicator();
                }
                var contentOffsetLimit = this.contentOffsetLimit;

                // 如果某个方向上不到滚动的尺寸，并且禁止了bounce，则直接速度为0
                if(contentOffsetLimit.minX == contentOffsetLimit.maxX && !this.alwaysBounceHorizontal) {
                    vx = 0;
                }
                if(contentOffsetLimit.minY == contentOffsetLimit.maxY && !this.alwaysBounceVertical) {
                    vy = 0;
                }

                //  根据位置，计算惯性滚动的速度
                var _overX = 0, _overY = 0;
                var {x, y} = this.contentOffset;

                if(x < contentOffsetLimit.minX) {
                    _overX = contentOffsetLimit.minX - x;
                } else if(x > contentOffsetLimit.maxX) {
                    _overX = x - contentOffsetLimit.maxX;
                }

                if(y < contentOffsetLimit.minY) {
                    _overY = contentOffsetLimit.minY - y;
                } else if(y > contentOffsetLimit.maxY) {
                    _overY = y - contentOffsetLimit.maxY;
                }

                // 减速之后的速度，当超出滚动范围之后，会用 _overX/4 来修正减速度（即：超出范围越大，减速越快）
                var nvx = vx - dvx * (1 + _overX/4);
                var nvy = vy - dvy * (1 + _overY/4);
                // 一旦速度变成 0 或者反方向，则设置速度为 0
                if (vx * nvx <= 0) vx = 0; else vx = nvx;
                if (vy * nvy <= 0) vy = 0; else vy = nvy;

                // 计算滚动距离
                var dx = vx * DECELERATE_INTERVAL,
                    dy = vy * DECELERATE_INTERVAL;

                var edge = this.getBounceEdge();

                // 停止滚动，开始bounce过程
                if ( vy == 0 ) {
                    startY = typeof startY !== 'undefined' ? startY : y;
                    overVertical = typeof overVertical !== 'undefined'
                                ? overVertical
                                : typeof edge.vertical !== 'undefined' ? Math.abs(y - edge.vertical) : 0;
                    durationY = typeof durationY !== 'undefined' ? durationY : this.getBounceDuration(0, overVertical);

                    y = this.getBouncePosition(edge.vertical, y, currentTimeY, startY, overVertical, durationY);

                    currentTimeY += DECELERATE_INTERVAL
                }

                if ( vx == 0 ) {
                    startX = typeof startX !== 'undefined' ? startX : x;
                    overHorizontal = typeof overHorizontal !== 'undefined'
                                ? overHorizontal
                                : typeof edge.horizontal !== 'undefined' ? Math.abs(x - edge.horizontal) : 0;
                    durationX = typeof durationX !== 'undefined' ? durationX : this.getBounceDuration(overHorizontal, 0);

                    x = this.getBouncePosition(edge.horizontal, x, currentTimeX, startX, overHorizontal, durationX);

                    currentTimeX += DECELERATE_INTERVAL
                }

                var _x = x + dx,
                    _y = y + dy;

                if(!this.props.bounces) {
                    if(_x < contentOffsetLimit.minX) {
                        _x = contentOffsetLimit.minX;
                        vx = 0;
                    } else if(_x > contentOffsetLimit.maxX) {
                        _x = contentOffsetLimit.maxX;
                        vx = 0;
                    }

                    if(_y < contentOffsetLimit.minY) {
                        _y = contentOffsetLimit.minY;
                        vy = 0;
                    } else if(_y > contentOffsetLimit.maxY) {
                        _y = contentOffsetLimit.maxY;
                        vy = 0;
                    }
                }

                this._scrollTo({
                    y: _y,
                    x: _x,
                    animated: false,
                });

                if ( vy == 0 && vx == 0
                      && x == edge.horizontal
                      && y == edge.vertical
                  ) {
                      clearInterval(this._decelerateTimer);
                      this._decelerateTimer = null;
                      this.clearTouchStates();

                      this.hideIndicator();

                    //   console.log('onMomentumScrollEnd');
                      this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd({
                          nativeEvent: {
                              contentOffset: Object.assign({}, this.contentOffset)
                          }
                      });
                  }
            },
            DECELERATE_INTERVAL
        );
    }

    clearTouchStates() {
        this.contentOffsetWhenTouchStart = null;
        this.initialTouchPoint = null;
    }

    hideIndicator() {

        if(this._indicatorTimer) {
            clearTimeout(this._indicatorTimer);
            this._indicatorTimer = null;
        }

        this._indicatorTimer = setTimeout(() => {

            this.indicator.horizontal.showed = false;
            this.indicator.vertical.showed = false;

            this.forceUpdate();
        }, 100);
    }

    renderIndicator() {

        if(this._indicatorTimer) {
            clearTimeout(this._indicatorTimer);
            this._indicatorTimer = null;
        }

        let containerLength, contentLength, indicator_max_length, indicator_length, offset;

        if(this.props.showsHorizontalScrollIndicator) {
            if(this.contentOffsetLimit.minX == this.contentOffsetLimit.maxX) {
                this.indicator.horizontal.showed = false;
            } else {
                containerLength = this.scrollViewSize.width - this.contentInset.left - this.contentInset.right;
                contentLength = this.contentSize.width;

                indicator_max_length = containerLength - 2 * INDICATOR_GAP;
                indicator_length = Math.max(INDICATOR_MIN_SHOW_LENGTH, Math.floor(containerLength * indicator_max_length / contentLength));

                if(this.contentOffset.x < this.contentOffsetLimit.minX) {
                    indicator_length = Math.max(INDICATOR_MIN_LENGTH, indicator_length - (this.contentOffsetLimit.minX - this.contentOffset.x));
                    offset = 0;
                } else if(this.contentOffset.x > this.contentOffsetLimit.maxX) {
                    indicator_length = Math.max(INDICATOR_MIN_LENGTH, indicator_length - (this.contentOffset.x - this.contentOffsetLimit.maxX));
                    offset = indicator_max_length - indicator_length;
                } else {
                    offset =  (indicator_max_length - indicator_length) * (this.contentOffset.x - this.contentOffsetLimit.minX) / (contentLength - containerLength);
                }

                this.indicator.horizontal = {
                    length: indicator_length,
                    offset: offset,
                    showed: true,
                };
            }
        }

        if(this.props.showsVerticalScrollIndicator) {

            if(this.contentOffsetLimit.minY == this.contentOffsetLimit.maxY) {
                this.indicator.vertical.showed = false;
            } else {
                var _fix_height_for_refresh_control = 0;

                if(this.props.refreshControl && !this.state.isRefreshing) {
                    _fix_height_for_refresh_control = this.props.refreshControl.props.height;
                }

                containerLength = this.scrollViewSize.height - this.contentInset.top - this.contentInset.bottom - _fix_height_for_refresh_control;
                contentLength = this.contentSize.height - _fix_height_for_refresh_control;

                indicator_max_length = containerLength - 2 * INDICATOR_GAP;
                indicator_length = Math.max(INDICATOR_MIN_SHOW_LENGTH, Math.floor(containerLength * indicator_max_length / contentLength));

                if(this.contentOffset.y < this.contentOffsetLimit.minY + _fix_height_for_refresh_control) {
                    indicator_length = Math.max(INDICATOR_MIN_LENGTH, indicator_length - (this.contentOffsetLimit.minY + _fix_height_for_refresh_control - this.contentOffset.y));
                    offset = 0;
                } else if(this.contentOffset.y > this.contentOffsetLimit.maxY) {
                    indicator_length = Math.max(INDICATOR_MIN_LENGTH, indicator_length - (this.contentOffset.y - this.contentOffsetLimit.maxY));
                    offset = indicator_max_length - indicator_length;
                } else  {
                    offset = (indicator_max_length - indicator_length) * (this.contentOffset.y - _fix_height_for_refresh_control - this.contentOffsetLimit.minY) / (contentLength - containerLength);
                }

                this.indicator.vertical = {
                    length: indicator_length,
                    offset: offset + _fix_height_for_refresh_control,
                    showed: true,
                }
            }
        }
    }

    render() {

        var contentContainerStyle = [
            this.props.contentContainerStyle,
            this.props.horizontal ? styles.contentContainerHorizontal : null,
        ];

        var contentSizeChangeProps = {};
        if (this.props.onContentSizeChange) {
            contentSizeChangeProps = {
                onLayout: this.handleContentOnLayout,
            };
        }

        var refreshControl;
        if(this.props.refreshControl) {
            const {height} = this.props.refreshControl.props;
            refreshControl = React.cloneElement(this.props.refreshControl, {
                ref: REFRESHCONTROL,
                isRefreshing: this.state.isRefreshing,
                refreshResult: this.state.refreshResult,
            });
        }

        var loadControl;
        if(this.props.loadControl) {
            const {height} = this.props.loadControl.props;
            loadControl = React.cloneElement(this.props.loadControl, {
                ref: LOADCONTROL,
                isLoading: this.state.isLoading,
            });
        }

        var contentContainer =
            <View
                {...contentSizeChangeProps}
                ref={INNERVIEW}
                style={contentContainerStyle}
                removeClippedSubviews={false}
                onLayout={this.onContentContainerLayout.bind(this)}
                collapsable={false}>
                {refreshControl}
                {this.props.children}
                {loadControl}
            </View>;
        // android 和 ios 的native的scrollview的层级不一样，android要少一层，所以针对安卓多加了一层容器（为了不让这层容器被优化掉，加上了透明的背景色）
        // var contentContainerFixed = Platform.OS === 'ios' ? contentContainer : <View style={{flex: 1, backgroundColor: 'transparent'}}>{contentContainer}</View>;
        var contentContainerFixed = contentContainer;

        var stickyHeaderIndices = this.props.stickyHeaderIndices ? [] : null;
        if(this.props.stickyHeaderIndices) {
            this.props.stickyHeaderIndices.forEach((item) => {
                stickyHeaderIndices.push(this.props.refreshControl ? item + 1 : item);
            })
        }

        var props = {
            style: this.props.horizontal ? [styles.base, styles.baseHorizontal] : styles.base,

            scrollPosition: this.contentOffset,
            stickyHeaderIndices: stickyHeaderIndices,

            // 这三个事件即使当前的scrollview不是responder，也会触发，通过this.isTouch能够知道当前是否触摸了
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),

            onStartShouldSetResponderCapture: this.onStartShouldSetResponderCapture.bind(this),
            onStartShouldSetResponder: this.onStartShouldSetResponder.bind(this),
            onMoveShouldSetResponderCapture: this.onMoveShouldSetResponderCapture.bind(this),
            onMoveShouldSetResponder: this.onMoveShouldSetResponder.bind(this),
            onResponderGrant: this.onResponderGrant.bind(this),
            onResponderMove: this.onResponderMove.bind(this),
            onResponderRelease: this.onResponderRelease.bind(this),

            onResponderTerminationRequest: this.onResponderTerminationRequest.bind(this),
            onResponderTerminate: this.onResponderTerminate.bind(this),
        };

        var ScrollViewClass = QRCTScrollView;

        var indicator_horizontal = this.props.showsHorizontalScrollIndicator ?
            <View style={[styles.indicator, {
                opacity: this.indicator.horizontal.showed ? INDICATOR_OPACITY : 0,
                width: this.indicator.horizontal.length,
                left: this.indicator.horizontal.offset + INDICATOR_GAP + this.contentInset.left,
                bottom: this.contentInset.bottom + INDICATOR_GAP_EDGE,
            }]}></View> : null;
        var indicator_vertical = this.props.showsVerticalScrollIndicator ?
            <View style={[styles.indicator, {
                opacity: this.indicator.vertical.showed ? INDICATOR_OPACITY : 0,
                height: this.indicator.vertical.length,
                top: this.indicator.vertical.offset + INDICATOR_GAP + this.contentInset.top,
                right: this.contentInset.right + INDICATOR_GAP_EDGE,
            }]} /> : null;

        return (
            <View style={[styles.base, this.props.style]}>
                <ScrollViewClass {...props} onLayout={this.onScrollViewLayout.bind(this)} ref={SCROLLVIEW}>
                {contentContainerFixed}
                </ScrollViewClass>
                {indicator_horizontal}
                {indicator_vertical}
            </View>
        );
    }
}

ScrollView.defaultProps = defaultProps;
ScrollView.propTypes = propTypes;

const styles = StyleSheet.create({
    base: {
        flex: 1,
    },
    baseHorizontal: {
      flex: 1,
      flexDirection: 'row',
    },
    contentContainerHorizontal: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
    indicator: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 1,
        backgroundColor: '#444',
        opacity: 0,
        width: 2.5,
        height: 2.5,
    },
});

module.exports = ScrollView;
