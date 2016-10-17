/**
 * @providesModule Loading
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
var ReactDOM = require('react-dom');
// var animation = ['from', 1, 2, 3, 4, 5, 6, 7, 8, 9, 'to'].map(function(item, i) {
//     return (item > 0 ? item * 10 + '%' : item) + '{\ntransform: rotate(' + (i * 360 / 10) + 'deg)\n}'
// }).join('\n')
var animation = [0, 20, 40, 60, 80, 100].map(function(item, i) {
    return item + '% ' + '{\n-webkit-transform: rotate(' + (i * 360 / 5) + 'deg);\ntransform: rotate(' + (i * 360 / 5) + 'deg);}'
}).join('\n'), LOADING = 'LOADING'
require('StyleSheet').inject(`.rn-loading {
    animation: qrnloading 800ms infinite ease-in-out;
    -webkit-animation: qrnloading 800ms infinite ease-in-out; /* Safari 和 Chrome */
}
@keyframes qrnloading {
    ${animation}
}
@-webkit-keyframes qrnloading {
    ${animation}
}`, 'ensure inject')
/**
 * 加载组件
 *
 * @component Loading
 * @example ./Playground/js/Examples/LoadingExample.js[1-100]
 * @version >=0.20.0
 * @description 渲染出一个骆驼在走动的loading组件 - react web用纯css来实现。
 *
 * ![Loading](./images/component-Loading.png)
 */
class Loading extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.isAnimating = false;
    }

    _animate() {
        if (!this.isAnimating) {
            return;
        }
        var node = ReactDOM.findDOMNode(this.refs[LOADING])
        node.className = (node.className.replace(/rn-loading/g, '') + ' rn-loading').replace(/[ ]{2,}/g, ' ').trim()
        node = null
    }

    _stop() {
        var node = ReactDOM.findDOMNode(this.refs[LOADING])
        if (node) {
            node.className = node.className.replace(/rn-loading/g, '').replace(/[ ]{2,}/g, ' ').trim()
            node = null
        }
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
            this._stop()
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
        this._stop()
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
                <View ref={LOADING}>
                    {
                        contentRender ? contentRender() : <Text style={textStyle}>{content}</Text>
                    }
                </View>
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
     * @description 用返回值来渲染loading内容，如果默认的Text方式无法满足需求，可以自己来设置渲染内容
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
