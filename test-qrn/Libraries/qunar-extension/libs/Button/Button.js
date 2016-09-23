'use strict'

import React, {Component, StyleSheet, View, Text, TouchableCustomFeedback} from 'qunar-react-native';

const defaultProps = {
    disabled: false,
    text: 'Button',
    style: {
        backgroundColor: '#ffffff',
        borderColor: '#1ba9ba',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    activedStyle: {
        opacity: 0.4,
    },
    disabledStyle: {
        opacity: 0.4,
    },
    textStyle: {
        color: '#1ba9ba',
        fontSize: 14,
    },
};

const propTypes = {
    /**
     * 是否禁用
     *
     * @property disabled
	 * @type bool
     * @default false
	 * @description 如果设为true，则禁止此组件的一切交互。
     */
    disabled: React.PropTypes.bool,
    /**
     * 点击事件
     *
     * @property onPress
	 * @type function
	 * @description 点击之后调用此方法。
     */
    onPress: React.PropTypes.func,
    /**
     * 长按事件
     *
     * @property onLongPress
	 * @type function
	 * @description 长按之后调用此方法。
     */
    onLongPress: React.PropTypes.func,
    /**
     * 按入事件
     *
     * @property onPressIn
	 * @type function
	 * @description 按入之后调用此方法。
     */
    onPressIn: React.PropTypes.func,
    /**
     * 按出事件
     *
     * @property onPressOut
	 * @type function
	 * @description 按出之后调用此方法。
     */
    onPressOut: React.PropTypes.func,
    /**
     * 按钮文本
     *
     * @property text
	 * @type string
     * @default 'Button'
	 * @description 按钮上显示的文字
     */
    text: React.PropTypes.string,
    /**
     * 按钮激活文本
     *
     * @property activedText
	 * @type string
     * @default 默认跟 text 属性值一样，除非单独指定
	 * @description 按钮激活时上面显示的文字
     */
    activedText: React.PropTypes.string,
    /**
     * 按钮禁止文本
     *
     * @property disabledText
	 * @type string
     * @default 默认跟 text 属性值一样，除非单独指定
	 * @description 按钮禁用时上面显示的文字
     */
    disabledText: React.PropTypes.string,
    /**
     * 按钮样式
     *
     * @property style
	 * @type View.propTypes.style
     * @default {
     *     backgroundColor: '#ffffff',
     *     borderColor: '#1ba9ba',
     *     borderWidth: 1,
     *     borderRadius: 5,
     *     padding: 5,
     *     alignItems: 'center',
     *     justifyContent: 'center',
     *     alignSelf: 'center',
     * }
	 * @description 按钮的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认padding为5，如果padding改为10，并不会影响其他的默认样式**
     */
    style: View.propTypes.style,
    /**
     * 按钮激活样式
     *
     * @property activedStyle
	 * @type View.propTypes.style
     * @default 此属性默认在 style 属性的基础上，加上了{opacity: 0.4}
	 * @description 按钮激活时的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认padding为5，如果padding改为10，并不会影响其他的默认样式**
     */
    activedStyle: View.propTypes.style,
    /**
     * 按钮禁止样式
     *
     * @property disabledStyle
	 * @type View.propTypes.style
     * @default 此属性默认在 style 属性的基础上，加上了{opacity: 0.4}
	 * @description 按钮禁止时的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认padding为5，如果padding改为10，并不会影响其他的默认样式**
     */
    disabledStyle: View.propTypes.style,
    /**
     * 文本样式
     *
     * @property textStyle
	 * @type View.propTypes.style
     * @default {
     *    color: '#1ba9ba',
     *    fontSize: 14,
     * }
	 * @description 文本的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认fontSize为14，如果fontSize改为18，并不会影响其他的默认样式**
     */
    textStyle: Text.propTypes.style,
    /**
     * 文本激活样式
     *
     * @property activedTextStyle
	 * @type View.propTypes.style
     * @default 此属性默认跟 textStyle 一样
	 * @description 文本激活时的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认fontSize为14，如果fontSize改为18，并不会影响其他的默认样式**
     */
    activedTextStyle: Text.propTypes.style,
    /**
     * 文本禁止样式
     *
     * @property disabledTextStyle
	 * @type View.propTypes.style
     * @default 此属性默认跟 textStyle 一样
	 * @description 文本禁止时的样式
     *
     * **注意：此属性的如果传入样式，会以merge的形式覆盖默认样式。即：默认fontSize为14，如果fontSize改为18，并不会影响其他的默认样式**
     */
    disabledTextStyle: Text.propTypes.style,
};

/**
 * 按钮组件
 *
 * @component Button
 * @example ./Playground/js/Examples/ButtonExample.js[1-90]
 * @version >=v1.0.0
 * @description 渲染出一个按钮。
 *
 * ![Loading](./images/component-Button.gif)
 */
class Button extends Component {

    _onPress() {
        const {onPress} = this.props;
        onPress && onPress.apply(this);
    }

    render() {
        const {disabled, text} = this.props;

        let style = [defaultProps.style, this.props.style],
            textStyle = [defaultProps.textStyle, this.props.textStyle];

        let activedStyle = [style, this.props.activedStyle],
            disabledStyle = [style, defaultProps.disabledStyle, this.props.disabledStyle],
            activedTextStyle = [textStyle, this.props.activedTextStyle],
            disabledTextStyle = [textStyle, this.props.disabledTextStyle],
            activedText = this.props.activedText || text,
            disabledText = this.props.disabledText || text;

        return (
            <TouchableCustomFeedback
                disabled={disabled}
                onPress={()=>{this.props.onPress && this.props.onPress.apply(this)}}
                onLongPress={()=>{this.props.onLongPress && this.props.onLongPress.apply(this)}}
                onPressIn={()=>{this.props.onPressIn && this.props.onPressIn.apply(this)}}
                onPressOut={()=>{this.props.onPressOut && this.props.onPressOut.apply(this)}}
                defaultContent={
                    <View style={style}>
                        <Text style={textStyle}>
                            {text}
                        </Text>
                    </View>
                }
                activedContent={
                    <View style={activedStyle}>
                        <Text style={activedTextStyle}>
                            {activedText}
                        </Text>
                    </View>
                }
                disabledContent={
                    <View style={disabledStyle}>
                        <Text style={disabledTextStyle}>
                            {disabledText}
                        </Text>
                    </View>
                }
            />
        );
    }
};

Button.defaultProps = defaultProps;
Button.propTypes = propTypes;

module.exports = Button;
