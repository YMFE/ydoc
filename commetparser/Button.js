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
     * 滚动组件
     *
     * @component ScrollView
     * @examplelanguage js
     * @version >=0.20.0
     * @foldnumber 8 代码块折叠行数
     * @description 一个包装了平台的ScrollView（滚动视图）的组件，同时还集成了触摸锁定的“响应者”系统。
     *
     * * 记住ScrollView必须有一个确定的高度才能正常工作，因为它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）。
     * * 要给一个ScrollView确定一个高度的话，要么直接给它设置高度（不建议），要么确定所有的父容器都已经绑定了高度。
     * * 在视图栈的任意一个位置忘记使用{flex:1}都会导致错误，你可以使用元素查看器来查找问题的原因。
     *
     *
     */

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
