'use strict'

/**
 * @providesModule Tab
 */

import React,{ Component } from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';

/**
 * 分段组件
 *
 * @component Tab
 * @example ./Playground/js/Examples/TabExample.js[1-93]
 * @version >=v1.0.0
 * @description iOS风格的分段组件（SegmentedControlIOS）。
 *
 * ![Tab](./images/component-Tab.png)
 */
class Tab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: this.props.selectedIndex,
            value: this.props.selectedIndex ? this.props.values[this.props.selectedIndex] : undefined,
        };
    }

    render() {
        let {enabled, values, tintColor, tintTextColor, momentary, style} = this.props,
            {selectedIndex, value} = this.state,
            len = values.length;

        return (
            <View style={[styles.container, style, enabled ? null : styles.disabled, {
                borderColor: tintColor,
            }]}>
                {values.map((item, i) =>
                    <TouchableHighlight
                        key={i}
                        activeOpacity={1}
                        underlayColor={i === selectedIndex && !momentary ? (enabled ? 'transparent' : tintColor) : (enabled ? tintColor : 'transparent')}
                        style={[styles.item, {
                            backgroundColor: i === selectedIndex && !momentary ? tintColor : 'transparent',
                        }, i > 0 ? {
                            borderLeftWidth: 1,
                            borderLeftColor: tintColor,
                        } : null]}
                        onPress={(event) => this._onPress(event, i, item)}>
                        <Text style={[styles.text, {
                            color: i === selectedIndex && !momentary ? tintTextColor : tintColor,
                        }]} numberOfLines={1}>{item}</Text>
                    </TouchableHighlight>
                )}
            </View>
        )
    }

    _onPress(event, selectedIndex, value) {
        if(this.props.enabled ) {
            if(selectedIndex != this.state.selectedIndex) {
                this.setState({
                    selectedIndex: selectedIndex,
                    value: value
                });
                this.props.onChange ? this.props.onChange(event, selectedIndex, value) : null;
            }
            this.props.onPress ? this.props.onPress(event, selectedIndex, value) : null;
        }
    }
};

Tab.defaultProps = {
    enabled: true,
    momentary: false,
    tintColor: '#007aff',
    tintTextColor: '#ffffff',
};

Tab.propTypes = {
    /**
     * 是否可用
     *
     * @property enabled
     * @type bool
     * @default true
     * @description 是否可用
     */
    enabled: React.PropTypes.bool,
    /**
     * 是否是临时状态
     *
     * @property momentary
     * @type bool
     * @default false
     * @description 选中的状态是否是临时的。如果为true，选中的段不会一直保持特效。但onValueChange回调还是会正常工作。
     */
    momentary: React.PropTypes.bool,
    /**
     * 点击后执行（值发生变化才触发）
     *
     * @property onChange
     * @type function
     * @param {event} event 点击事件
     * @param {number} selectedIndex 选中段的index
     * @param {string} value 选中段的值
     * @description (event, selectedIndex, value) => void
     *
     * 当用户点击某一段并且选项发生变化的时候调用。参数是event, selectedIndex, value。
     */
    onChange: React.PropTypes.func,
    /**
     * 点击后执行（无论值是否变化）
     *
     * @property onPress
     * @type function
     * @param {event} event 点击事件
     * @param {number} selectedIndex 选中段的index
     * @param {string} value 选中段的值
     * @description (event, selectedIndex, value) => void
     *
     * 当用户点击某一段的时候调用。参数是event, selectedIndex, value。
     */
    onPress: React.PropTypes.func,
    /**
     * 默认选中的index
     *
     * @property selectedIndex
     * @type number
     * @description 组件显示时，一开始被选中的段落的下标。
     */
    selectedIndex: React.PropTypes.number,
    /**
     * 选中的颜色
     *
     * @property tintColor
     * @type string
     * @description 被选中的段的颜色。
     */
    tintColor: React.PropTypes.string,
    /**
     * 选中的文字颜色
     *
     * @property tintTextColor
     * @type string
     * @description 被选中的段的文字颜色。
     */
    tintTextColor: React.PropTypes.string,
    /**
     * 每一段的值
     *
     * @property values
     * @type array
     * @description 按顺序每一段的标题文字（值）。
     */
    values: React.PropTypes.array,
    /**
     * 样式
     *
     * @property style
     * @type View.propTypes.style
     * @description 外层容器的样式。
     */
    style: View.propTypes.style,
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor:'transparent',
        borderRadius: 4,
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.5,
    },
    item: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    text: {
        textAlign: 'center',
    },
});

module.exports = Tab;
