/**
 * @providesModule Loading
 * @flow
 */
'use strict'

import React, {Component, StyleSheet, View, Animated, Easing, Text} from 'react-native';

/**
 * 加载组件
 *
 * @component Loading
 * @example ./Playground/js/Examples/LoadingExample.js[1-100]
 * @version >=v1.0.0
 * @description 渲染出一个骆驼在走动的loading组件。
 *
 * ![Loading](./images/component-Loading.png)
 */
class Loading extends Component {

    constructor(props) {
        super(props);

        this.state = {
            angle: new Animated.Value(0),
        };

        this.isAnimating = false;
    }

    _animate() {
        if (!this.isAnimating) {
            return;
        }

        this.state.angle.setValue(0);
        this._anim = Animated.timing(this.state.angle, {
            toValue: 1,
            duration: this.props.speed,
            easing: Easing.linear
        }).start(() => this._animate());
    }

    componentDidMount() {
        if(this.props.animating) {
            this.isAnimating = true;
            this._animate();
        }
    }

    componentWillUpdate(nextProps) {
        if(this.props.animating && !nextProps.animating){ // 如果之前有动画，之后没有动画，就停掉动画
            this.isAnimating = false;

            if(this._anim) {
                this._anim.stop();
                this._anim = null;
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.animating && this.props.animating) { // 如果之前没有动画，之后有动画，就开始动画
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
        const {getLoadingContent, style, content, contentRender, contentStyle} = this.props;
        let color = (!this.props.animating && this.props.hidesWhenStopped) ? 'transparent' : this.props.color;
        let textStyle = [styles.content, contentStyle, {
            color: color,
            fontSize: this.props.size,
        }];

        return (
            <View style={[styles.container, style]}>
                <Animated.View style={{
                        transform: [{
                            rotate: this.state.angle.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })}],
                    }}>
                    {
                        contentRender ? contentRender() : <Text style={textStyle}>{content}</Text>
                    }
                </Animated.View>
            </View>
        );
    }
};

Loading.defaultProps = {
    color: '#cccccc',
    size: 24,
    speed: 1200,
    animating: true,
    hidesWhenStopped: true,
    content: '\uf089',
};

Loading.propTypes = {
    /**
     * 图标颜色
     *
     * @property color
	 * @type string
     * @default '#cccccc'
	 * @description loading图标的颜色
     */
    color: React.PropTypes.string,
    /**
     * 图标大小
     *
     * @property size
	 * @type number
     * @default 24
	 * @description loading图标文本的fontSize
     */
    size: React.PropTypes.number,
    /**
     * 旋转速度
     *
     * @property speed
	 * @type number
     * @default 1200
	 * @description loading图标旋转一周的时间，单位ms
     */
    speed: React.PropTypes.number,
    /**
     * 是否旋转
     *
     * @property animating
	 * @type bool
     * @default true
	 * @description loading图标是否旋转
     */
    animating: React.PropTypes.bool,
    /**
     * 动画停止时是否隐藏
     *
     * @property hidesWhenStopped
	 * @type bool
     * @default true
	 * @description loading图标停止旋转时是否隐藏
     */
    hidesWhenStopped: React.PropTypes.bool,
    /**
     * 图标内容
     *
     * @property content
	 * @type string
     * @default '\uf089'
	 * @description loading图标的文本内容，可以是文字或者iconfont
     */
    content: React.PropTypes.string,
    /**
     * 图标内容样式
     *
     * @property contentStyle
	 * @type Text.propTypes.style
     * @default '\uf089'
	 * @description loading图标的文本样式，如果是iconfont，可以通过这个属性设置fontFamily
     */
    contentStyle: Text.propTypes.style,
    /**
     * 图标内容渲染
     *
     * @property contentRender
	 * @type function
     * @return {element} 用来渲染loading内容的JSX
	 * @description () => renderable
     *
     * 用返回值来渲染loading内容，如果默认的Text方式无法满足需求，可以自己来设置渲染内容
     */
    contentRender: React.PropTypes.func,
    /**
     * 图标样式
     *
     * @property style
	 * @type View.propTypes.style
	 * @description loading图标容器的样式
     */
    style: View.propTypes.style,
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
    },
    content: {
        fontFamily: 'qunar_react_native',
    },
});

module.exports = Loading;
