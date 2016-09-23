/**
 * @providesModule QRefreshControl
 * @flow
 */
 'use strict';

import React, {Component, PropTypes, StyleSheet, View, Text, Animated, Easing} from 'react-native';

const PULLSTART = 'pullStartContent';
const PULLCONTINUE = 'pullContinueContent';
const REFRESHING = 'refreshingContent';
const SUCCESS = 'successContent';
const FAIL = 'failContent';

/**
 * 下拉刷新组件
 *
 * @component RefreshControl
 * @example ./Playground/js/Examples/RefreshControlExample.js[1-136]
 * @version >=v1.0.0
 * @description 这一组件用在 `ScrollView` 内部，作为 `refreshControl` 属性，为其添加下拉刷新的功能。
 *
 * 该组件分为五种展示状态：
 *
 * * PULLSTART：正在下拉，并未达到刷新所需高度，默认文本是『下拉可以刷新』
 * * PULLCONTINUE：正在下拉，并且达到了刷新所需高度，默认文本是『松开即可刷新』
 * * REFRESHING：正在刷新，此时用户已经松手，显示正在刷新状态，默认文本是『努力加载中』
 * * SUCCESS：刷新结束，加载成功，默认文本是『加载成功』（1.3.0开始支持）
 * * FAIL：刷新结束，加载失败，默认文本是『加载失败』（1.3.0开始支持）
 *
 * 当变成 `REFRESHING` 状态会触发 `onRefresh` 事件，此时，可以通过 `ScrollView` 的 `stopRefreshing` 方法来停止刷新。
 *
 * ![RefreshControl](./images/component-RefreshControl.png)
 */
class RefreshControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: PULLSTART,
            angle: 0,
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

    onScroll(offset) {
        if(this.props.isRefreshing || typeof this.props.refreshResult === 'boolean') {
            return;
        }

        const {height} = this.props;
        let angle = 0;

        if(offset.y >= 0.8 * height && offset.y <= height) {
            var step = 180 / ( (1 - 0.8) * height);
            angle = (offset.y - 0.8 * height) * step;
        } else if(offset.y < 0.8 * height) {
            angle = 0;
        } else {
            angle = 180;
        }

        if(offset.y >= height && this.state.status != PULLCONTINUE) {
            this.setState({
                status: PULLCONTINUE,
                angle: angle,
            });
        } else if(offset.y < height && this.state.status != PULLSTART) {
            this.setState({
                status: PULLSTART,
                angle: angle,
            });
        } else {
            this.setState({
                angle: angle,
            })
        }
    }

    // ScrollView ResponderRelease时触发的
    onRelease(offset, startFn, stopFn) {
        const {height} = this.props;

        if(this.props.isRefreshing) {
            return;
        }

        if(offset.y >= height) {
            startFn();
        }
    }

    onRefresh() {
        this.props.onRefresh && this.props.onRefresh();
    }

    componentWillUpdate(nextProps) {
        if (this.props.isRefreshing && !nextProps.isRefreshing) { // 如果之前有动画，之后没有动画，就停掉动画
            this.isAnimating = false;

            if(this._anim) {
                this._anim.stop();
                this._anim = null;
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isRefreshing && this.props.isRefreshing) { // 如果之前没有动画，之后有动画，就开始动画
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

    render() {
        const {style: customStyle, iconStyle: customIconStyle, textStyle: customTextStyle} = this.props;
        let iconContent, content;

        if(typeof this.props.refreshResult === 'boolean') { // 停止刷新后的有状态回弹
            iconContent = <Text style={[styles.icon, customIconStyle]}>{this.props.refreshResult ? this.props.successIcon : this.props.failIcon}</Text>;
            content = this.props.refreshResult ? this.props[SUCCESS] : this.props[FAIL];
        } else if(this.props.isRefreshing) { // 正在刷新
            iconContent = <Animated.Text style={[styles.icon, {
                transform: [{
                    rotate: this.state.loadingAngle.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                    })
                }],
            }, customIconStyle]}>{this.props.refreshingIcon}</Animated.Text>
            content = this.props[REFRESHING];
        } else { // 其他状态
            iconContent = <Text style={[styles.icon, {
                transform: [{
                    rotate: this.state.angle + 'deg',
                }]
            }, customIconStyle]}>{this.props.pullIcon}</Text>
            content = this.props[this.state.status];
        }

        return (
            <View style={[styles.container, customStyle, {height: this.props.height}]}>
                {iconContent}
                <Text style={[styles.content, customTextStyle]}>{content}</Text>
            </View>
        )
    }
}

RefreshControl.defaultProps = {
    height: 35,
    pullStartContent: '下拉可以刷新',
    pullContinueContent: '松开即可刷新',
    pullIcon: '\uf07b',
    refreshingContent: '努力加载中',
    refreshingIcon: '\uf089',
    successContent: '加载成功',
    successIcon: '\uf078',
    failContent: '加载失败',
    failIcon: '\uf077',
};

RefreshControl.propTypes = {
    /**
     * 高度
     *
     * @property height
	 * @type number
     * @default 35
	 * @description RefreshControl的高度，下拉距离超过该距离时松手，会开始刷新
     */
    height: PropTypes.number,
    /**
     * PULLSTART状态文本
     *
     * @property pullStartContent
	 * @type string
     * @default '下拉可以刷新'
	 * @description 正在下拉，未达到刷新高度时的文本
     */
    pullStartContent: PropTypes.string,
    /**
     * PULLCONTINUE状态文本
     *
     * @property pullContinueContent
	 * @type string
     * @default '松开即可刷新'
	 * @description 正在下拉，达到刷新高度时的文本
     */
    pullContinueContent: PropTypes.string,
    /**
     * PULL时的icon文本
     *
     * @property pullIcon
     * @version >=1.3.0
     * @type string
     * @default '\uf07b'
     * @description PULLSTART和PULLCONTINUE时旋转的icon
     */
    pullIcon: PropTypes.string,
    /**
     * REFRESHING状态文本
     *
     * @property refreshingContent
	 * @type string
     * @default '努力加载中'
	 * @description 正在刷新时的文本
     */
    refreshingContent: PropTypes.string,
    /**
     * REFRESHING时的icon文本
     *
     * @property refreshingIcon
     * @version >=1.3.0
     * @type string
     * @default '\uf089'
     * @description REFRESHING时的旋转的icon文本
     */
    refreshingIcon: PropTypes.string,
    /**
     * SUCCESS状态文本
     *
     * @property successContent
     * @version >= 1.3.0
	 * @type string
     * @default '加载成功'
	 * @description 加载成功时的文本
     */
    successContent: PropTypes.string,
    /**
     * SUCCESS状态icon文本
     *
     * @property successIcon
     * @version >=1.3.0
     * @type string
     * @default '\uf078'
     * @description 加载成功时的icon文本
     */
    successIcon: PropTypes.string,
    /**
     * FAIL状态文本
     *
     * @property failContent
     * @version >= 1.3.0
	 * @type string
     * @default '加载失败'
	 * @description 加载失败时的文本
     */
    failContent: PropTypes.string,
    /**
     * FAIL状态icon文本
     *
     * @property failIcon
     * @version >=1.3.0
     * @type string
     * @default '\uf077'
     * @description 加载失败时的icon文本
     */
    failIcon: PropTypes.string,
    /**
     * 刷新事件
     *
     * @property onRefresh
     * @type function
	 * @description
     *
     * 切换到正在刷新状态时触发的事件
     */
    onRefresh: PropTypes.func,
    /**
     * 样式
     *
     * @property style
	 * @type View.propTypes.style
	 * @description RefreshControl 容器样式
     */
    style: View.propTypes.style,
    /**
     * iconfont样式
     *
     * @property iconStyle
	 * @type Text.propTypes.style
	 * @description RefreshControl iconfont样式
     */
    iconStyle: Text.propTypes.style,
    /**
     * 提示文字样式
     *
     * @property textStyle
	 * @type Text.propTypes.style
	 * @description RefreshControl 提示文字样式
     */
    textStyle: Text.propTypes.style,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'transparent',
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

module.exports = RefreshControl;
