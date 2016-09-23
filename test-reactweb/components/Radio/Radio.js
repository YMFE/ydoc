/**
 * @providesModule Radio
 * @flow
 */
'use strict'

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

/**
 * 选择组件
 *
 * @component Radio
 * @example ./Playground/js/Examples/RadioExample.js[1-242]
 * @version >=v1.0.0
 * @description 注意：这是一个[受控组件](http://itbilu.com/javascript/react/4ki9qFFqg.html)，checked状态由React传进来，对它本身的操作并不会直接改变checked状态。
 *
 * ![Radio](./images/component-Radio.png)
 */
class Radio extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {hasBorder, checked, onPress, style, uncheckStyle, checkStyle} = this.props

        let hasBorderStyle = null,
            hasBorderTextStyle = null,
            selectedStyle = null,
            selectedTextStyle = null,
            customStyle = null,
            customTextStyle = null

        if(!hasBorder){
            if(checked){
                selectedTextStyle = {color: '#1ba9ba'}
            }
        } else {
            hasBorderStyle = styles.checkboxType
            hasBorderTextStyle = styles.checkboxTypeText

            if(checked) {
                selectedStyle = {borderColor: '#1ba9ba'}
                selectedTextStyle = {color: '#1ba9ba'}
            } else {
                selectedStyle = {borderColor: '#aaa'}
                selectedTextStyle = {color: '#aaa'}
            }
        }

        if(checked) {
            customStyle = Object.assign({}, style, checkStyle)
        } else if(!checked) {
            customStyle = Object.assign({}, style, uncheckStyle)
        }

        // get customTextStyle
        Object.keys(customStyle).map((key) => {
            if(key.indexOf('font') > -1 || key === 'color'){
                customTextStyle = Object.assign(customTextStyle || {}, {[key]: customStyle[key]})
                delete customStyle[key]
            }
        })

        return (
            <View style={[styles.checkedWrap, hasBorderStyle, selectedStyle, customStyle]}>
                <Text style={[styles.checkedText, hasBorderTextStyle, selectedTextStyle, customTextStyle]}
                    onPress={onPress ? (e) => onPress({target: {checked: checked}}) : null}
                >
                    {'\uf083'}
                </Text>
            </View>
        )
    }
}

Radio.defaultProps = {
    hasBorder: false,
    checked: false,
}

Radio.propTypes = {
    /**
     * @property hasBorder
     * @type React.PropTypes.bool
     * @description 是否为有border的形态
     */
    hasBorder: React.PropTypes.bool,

    /**
     * @property checked
     * @type React.PropTypes.bool
     * @description 选中状态
     */
    checked: React.PropTypes.bool,

    /**
     * @property onPress
     * @type React.PropTypes.func
     * @description 点击回调，可从e.target.checked中获取当前选中状态
     */
    onPress: React.PropTypes.func,

    /**
     * @property style
     * @type Text.propTypes.style
     * @description 组件样式，check/uncheck状态均生效
     */
    style: Text.propTypes.style,

    /**
     * @property checkStyle
     * @type Text.propTypes.style
     * @description 组件样式，只在check状态生效
     */
    checkStyle: Text.propTypes.style,

    /**
     * @property uncheckStyle
     * @type Text.propTypes.style
     * @description 组件样式，只在uncheck状态生效
     */
    uncheckStyle: Text.propTypes.style,
}

const styles = StyleSheet.create({
    checkedWrap: {
        width: 14,
        height: 14,
    },
    checkedText: {
        fontFamily: 'qunar_react_native',
        color: 'transparent',
        fontSize: 14,
    },
    checkboxType: {
        borderWidth: 1,
        borderColor: '#1ba9ba',
        borderRadius: 3,
    },
    checkboxTypeText: {
        fontSize: 10,
    },
})

module.exports = Radio;
