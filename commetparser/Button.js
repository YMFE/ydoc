'use strict'

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TouchableCustomFeedback from '../TouchableCustomFeedback/TouchableCustomFeedback.js';
import ColorConfig from '../../ColorConfig.js';

const defaultProps = {
    disabled: false,
    numberOfLines: 0,
    text: 'Button',
    style: {
        backgroundColor: ColorConfig['blue-light'],
        borderColor: ColorConfig['blue-main'],
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
        color: ColorConfig['blue-main'],
        fontSize: 14,
    },
};

const propTypes = {
    /**
     * 头部描述随意
     * 可以换行写描述
     * 
     * @component Button
     * @property disabled
     * @version >= 2.0
     * @type bool
     * @default false
	 * @param {React.PropTypes.any} rowData 数据源中的数据
     * @param {string} sectionID 所处section名
     * @param {number} rowID 所处section中的index
     * @param {function} highlightRow 通过调用该函数可通知ListView高亮该行
     * @description 渲染出一个通用的开关组件。这是一个受控组件，需要在 `onValueChange` 的回调中设置 `value`。
     * 渲染的效果 iOS 和 Android 是统一的。
     * @description 按钮内的文字最多显示的行数，如果超过则裁剪文本。默认值为 0，表示没有限制。
     */
  }
   
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
                onPress={() => { this.props.onPress && this.props.onPress.apply(this) } }
                onLongPress={() => { this.props.onLongPress && this.props.onLongPress.apply(this) } }
                onPressIn={() => { this.props.onPressIn && this.props.onPressIn.apply(this) } }
                onPressOut={() => { this.props.onPressOut && this.props.onPressOut.apply(this) } }
                defaultContent={
                    <View style={style}>
                        <Text numberOfLines={this.props.numberOfLines} style={textStyle}>
                            {text}
                        </Text>
                    </View>
                }
                activedContent={
                    <View style={activedStyle}>
                        <Text numberOfLines={this.props.numberOfLines} style={activedTextStyle}>
                            {activedText}
                        </Text>
                    </View>
                }
                disabledContent={
                    <View style={disabledStyle}>
                        <Text numberOfLines={this.props.numberOfLines} style={disabledTextStyle}>
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
