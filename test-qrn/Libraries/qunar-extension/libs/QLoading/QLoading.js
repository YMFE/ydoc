/**
 * @providesModule QLoading
 * @flow
 */
'use strict'

import React, {Component, Animated, View, StyleSheet, Image, Easing, Text} from 'react-native';

/**
 * Qunar骆驼加载组件
 *
 * @component QLoading
 * @example ./Playground/js/Examples/QLoadingExample.js[1-42]
 * @version >=v1.0.0
 * @description 渲染出一个骆驼在走动的loading组件。
 *
 * ![QLoading](./images/component-QLoading.png)
 */
class QLoading extends Component {

    constructor(props) {
        super(props);

        this.state = {
            angle: new Animated.Value(0),
        }

        this.isAnimating = true;
    }

    _animate() {
        if(!this.isAnimating) {
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
        this._animate();
    }

    componentWillUnmount() {
        this.isAnimating = false;

        if(this._anim) {
            this._anim.stop();
            this._anim = null;
        }
    }

    render() {
        let {style, text, hideText} = this.props;

        return (
            <View style={[style, styles.container]}>
                <View style={styles.imageContainer}>
                    <Animated.Image source={{uri: 'http://s.qunarzz.com/qunar_react_native/component/background.png'}} style={{
                        transform: [{
                            rotate: this.state.angle.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })}],
                        width: 250,
                        height: 250,
                        position: 'absolute',
                        top: 16,
                    }}
                    >
                    </Animated.Image>
                    <Image source={{uri: 'http://s.qunarzz.com/qunar_react_native/component/camel.gif'}} style={{
                        width: 48,
                        height: 32,
                        position: 'relative',
                        top: 5,
                    }}/>
                </View>
                {
                    hideText ? null : <Text style={styles.content}>{text}</Text>
                }
            </View>
        );
    }
}

QLoading.defaultProps = {
    speed: 1200 * 20,
    text: '努力加载中...',
    hideText: false,
};

QLoading.propTypes = {
    /**
     * 隐藏文字
     *
     * @property hideText
	 * @type bool
     * @default false
	 * @description 是否隐藏骆驼下面的文字，默认为false不隐藏
     */
    hideText: React.PropTypes.bool,
    /**
     * 文字内容
     *
     * @property text
	 * @type string
     * @default '努力加载中...'
	 * @description 骆驼下面显示的文字，默认为『努力加载中...』
     */
    text: React.PropTypes.string,
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        overflow: 'hidden',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        height: 65,
        width: 250,
        overflow: 'hidden',
        position: 'relative',
    },
    content: {
        fontSize: 14,
        color: '#1ba9ba',
        marginTop: 10,
    }
});

module.exports = QLoading;
