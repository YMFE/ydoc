/**
 * @providesModule QLoadControl
 * @flow
 */
 'use strict';

import React, {Component, PropTypes, StyleSheet, View, Text, Animated, Easing, TouchableWithoutFeedback} from 'react-native';

const NOTICE = 'noticeContent';
const NOMORE = 'noMoreContent';
const LOADING = 'loadingContent';

/**
 * 上拉加载组件
 *
 * @component LoadControl
 * @example ./Playground/js/Examples/LoadControlExample.js[1-188]
 * @version >=v1.0.0
 * @description 这一组件用在 `ScrollView` 内部，作为 `loadControl` 属性，为其添加上拉加载的功能。
 *
 * 该组件分为三种状态：
 *
 * * NOTICE：拉到底部显示，默认文本是『上拉加载更多』
 * * NOMORE：没有更多内容了，默认文本是『没有更多了』
 * * LOADING：拉到底部之后，继续上拉触发正在加载，默认文本是『努力加载中』
 *
 * 当变成 `LOADING` 状态会触发 `onLoad` 事件，此时，可以通过 `ScrollView` 的 `stopLoading` 方法来停止刷新。
 *
 * ![LoadControl](./images/component-LoadControl.png)
 */
class LoadControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingAngle: new Animated.Value(0),
        };

        this.isAnimating = false;
    }

    _animate() {
        if (!this.isAnimating) {
            return;
        }

        this.state.loadingAngle.setValue(0);
        this._anim = Animated.timing(this.state.loadingAngle, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear
        }).start(() => this._animate());
    }

    // ScrollView ResponderRelease时触发的
    onRelease(offset, startFn, stopFn) {
        const {height} = this.props;

        if(this.props.isLoading || this.props.noMore) {
            return;
        }

        if(offset.y > 0) {
            startFn();
        }
    }

    onLoad() {
        this.props.onLoad && this.props.onLoad();
    }

    componentWillUpdate(nextProps) {
        let needAnimate = !this.props.noMore && this.props.isLoading,
            needAnimate_next = !nextProps.noMore && nextProps.isLoading;

        if(needAnimate && needAnimate != needAnimate_next) {  // 如果之前有动画，之后没有动画，就停掉动画
            this.isAnimating = false;

            if(this._anim) {
                this._anim.stop();
                this._anim = null;
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let needAnimate = !this.props.noMore && this.props.isLoading,
            needAnimate_prev = !prevProps.noMore && prevProps.isLoading;

        if(!needAnimate_prev && needAnimate != needAnimate_prev) { // 如果之前没有动画，之后有动画，就开始动画
            this.isAnimating = true;

            this._animate();
        }
    }

    componentWillUnmount() {
        this.isAnimating = false;

        if(this._anim) {
            this._anim.stop();
            this._anim = null;
        }
    }

    onPress() {
        this.props.onPress && this.props.onPress();
    }

    render() {

        let content, isLoading;
        if(this.props.noMore) {
            content = this.props[NOMORE];
        } else if(this.props.isLoading) {
            content = this.props[LOADING];
        } else {
            content = this.props[NOTICE];
        }

        return (
            <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
                <View style={[styles.container, {
                    height: this.props.height,
                }]}>
                    <View style={styles.contentContaienr}>
                        {
                            !this.props.noMore && this.props.isLoading  ? <Animated.Text style={[styles.icon, this.props.iconStyle, {
                                    transform: [{
                                        rotate: this.state.loadingAngle.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg'],
                                        })
                                    }],
                                }]}>{this.props.loadingIcon}</Animated.Text> : null
                        }
                        <Text style={[styles.content, this.props.textStyle]}>{content}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

LoadControl.defaultProps = {
    height: 35,
    noMore: false,
    noticeContent: '上拉加载更多',
    loadingContent: '努力加载中',
    loadingIcon: '\uf089',
    noMoreContent: '没有更多了'
};

LoadControl.propTypes = {
    /**
     * 高度
     *
     * @property height
	 * @type number
     * @default 35
	 * @description LoadControl的高度
     */
    height: PropTypes.number,
    /**
     * 没有更多
     *
     * @property noMore
	 * @type bool
     * @default false
	 * @description 如果为true，则显示 `NOMORE` 状态
     */
    noMore: PropTypes.bool,
    /**
     * 提示文本
     *
     * @property noticeContent
	 * @type string
     * @default '上拉加载更多'
	 * @description 显示在最下方的提示文本
     */
    noticeContent: PropTypes.string,
    /**
     * 加载文本
     *
     * @property loadingContent
	 * @type string
     * @default '努力加载中'
	 * @description 加载时的文本
     */
    loadingContent: PropTypes.string,
    /**
     * 加载图标
     *
     * @property loadingIcon
	 * @type string
     * @default '\uf089'
	 * @description 加载时旋转的图标
     * @version >=1.3.0
     */
    loadingIcon: PropTypes.string,
    /**
     * 没有更多文本
     *
     * @property noMoreContent
	 * @type string
     * @default '没有更多了'
	 * @description 没有更多时显示的文本
     */
    noMoreContent: PropTypes.string,
    /**
     * 刷新事件
     *
     * @property onLoad
     * @type function
	 * @description
     *
     * 变成正在加载时触发的事件
     */
    onLoad: PropTypes.func,
    /**
     * 点击事件
     *
     * @property onPress
     * @type function
	 * @description
     *
     * 点击LoadControl时触发的事件
     */
    onPress: PropTypes.func,
    /**
     * 样式
     *
     * @property style
	 * @type View.propTypes.style
	 * @description LoadControl样式
     */
    style: View.propTypes.style,
    /**
     * 文本样式
     *
     * @property textStyle
     * @type Text.propTypes.style
     * @description LoadControl的文本样式
     * @version >=1.3.0
     */
    textStyle: Text.propTypes.style,
    /**
     * 按钮样式
     *
     * @property iconStyle
     * @type Text.propTypes.style
     * @description LoadControl的按钮样式
     * @version >=1.3.0
     */
    iconStyle: Text.propTypes.style,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContaienr: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        color: '#1ba9ba',
        fontSize: 14,
    },
    icon: {
        color: '#1ba9ba',
        fontSize: 16,
        fontFamily: 'qunar_react_native',
        width: 16,
        height: 16,
        marginRight: 3,
    }
});

module.exports = LoadControl;
