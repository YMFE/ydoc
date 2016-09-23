/**
 * @providesModule QLoadingError
 * @flow
 */
'use district'

import React, {PropTypes, Component, View, StyleSheet, Image, Text, TouchableOpacity} from 'qunar-react-native';

/**
 * Qunar骆驼加载失败组件
 *
 * @component QLoadingError
 * @example ./Playground/js/Examples/QLoadingErrorExample.js[1-39]
 * @version >=v1.0.0
 * @description 渲染出一个带问号的骆驼的组件。
 *
 * ![QLoadingError](./images/component-QLoadingError.png)
 */
class QLoadingError extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {style, titleText, titleStyle, hintText, hintStyle, buttonText, buttonStyle, buttonTextStyle, onPress, hideTitle, hideHint, hideButton, renderButton} = this.props;

        return (
            <View style={[style, styles.container]}>
                <Image source={{uri: 'http://s.qunarzz.com/qunar_react_native/component/error.png'}} style={{width: 95, height: 55}}/>
                {
                    hideTitle ? null : <Text style={[styles.content, titleStyle]}>{titleText}</Text>
                }
                {
                    hideHint ? null : <Text style={[styles.content, hintStyle]}>{hintText}</Text>
                }
                {
                    hideButton ? null : (renderButton ? renderButton() : <TouchableOpacity onPress={onPress}>
                        <View style={[styles.button, buttonStyle]}>
                            <Text style={[styles.buttonContent, buttonTextStyle]}>{buttonText}</Text>
                        </View>
                    </TouchableOpacity>)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'transparent',
        overflow: 'hidden',
    },
    content: {
        fontSize: 14,
        color: '#333333',
        marginTop: 8,
    },
    button: {
        width: 220,
        height: 40,
        backgroundColor: '#1ba9ba',
        marginTop: 8,
        borderColor: '#1ba9ba',
        borderRadius: 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContent: {
        fontSize: 18,
        color: '#ffffff',
    }
});

QLoadingError.defaultProps = {
    titleText: '获取数据失败',
    hintText: '请检查一下:网络是否通畅?',
    buttonText: '重试',
    hideTitle: false,
    hideHint: false,
    hideButton: false,
};

QLoadingError.propTypes = {
    /**
     * 标题内容
     *
     * @property titleText
	 * @type string
     * @default '获取数据失败'
	 * @description 骆驼下面显示的第一行文字
     */
    titleText: PropTypes.string,
    /**
     * 标题样式
     *
     * @property titleStyle
     * @type Text.propTypes.style
     * @default {fontSize: 14, color: '#333333', marginTop: 8}
     * @description 标题的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。**
     */
    titleStyle: Text.propTypes.style,
    /**
     * 提示内容
     *
     * @property hintText
	 * @type string
     * @default '请检查一下:网络是否通畅?'
	 * @description 骆驼下面显示的第二行文字
     */
    hintText: PropTypes.string,
    /**
     * 提示样式
     *
     * @property hintStyle
     * @type Text.propTypes.style
     * @default {fontSize: 14, color: '#333333', marginTop: 8}
     * @description 提示内容的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。**
     */
    hintStyle: Text.propTypes.style,
    /**
     * 按钮内容
     *
     * @property buttonText
	 * @type string
     * @default 努力加载中...
	 * @description 骆驼下面显示的按钮的文字
     */
    buttonText: PropTypes.string,
    /**
     * 按钮样式
     *
     * @property buttonStyle
     * @type View.propTypes.style
     * @default {width: 220, height: 40, backgroundColor: '#1ba9ba', marginTop: 8, borderColor: '#1ba9ba', borderRadius: 2, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}
     * @description 按钮的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。**
     */
    buttonStyle: View.propTypes.style,
    /**
     * 按钮文本样式
     *
     * @property buttonTextStyle
     * @type Text.propTypes.style
     * @default {fontSize: 18, color: '#ffffff',}
     * @description 按钮文本的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。**
     */
    buttonTextStyle: Text.propTypes.style,
    /**
     * 隐藏标题
     *
     * @property hideTitle
	 * @type bool
     * @default false
	 * @description 是否隐藏骆驼下面的第一行文字，默认为false不隐藏
     */
    hideTitle: PropTypes.bool,
    /**
     * 隐藏提示
     *
     * @property hideHint
	 * @type bool
     * @default false
	 * @description 是否隐藏骆驼下面的第二行文字，默认为false不隐藏
     */
    hideHint: PropTypes.bool,
    /**
     * 隐藏提示
     *
     * @property hideButton
	 * @type bool
     * @default false
	 * @description 是否隐藏骆驼下面的按钮，默认为false不隐藏
     */
    hideButton: PropTypes.bool,
    /**
     * 渲染按钮方法
     *
     * @property renderButton
	 * @type function
     * @return {element} 用来渲染按钮内容的JSX
	 * @description () => renderable
     *
     * 渲染按钮的方法，用来实现自定义的按钮（可以使用[Button](./component-Button.html)组件来渲染，它提供了更多的配置和更多的状态）
     */
    renderButton: PropTypes.func,
    /**
     * 点击事件
     *
     * @property onPress
	 * @type function
     * @param {event} event 点击事件
	 * @description (event) => void
     *
     * 点击骆驼下面的按钮时调用
     */
    onPress: PropTypes.func,
}

module.exports = QLoadingError;
