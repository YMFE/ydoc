/*
 * @providesModule UTooltip
 */
'use strict'

import React, {Component} from 'react';
import {TouchableOpacity, Animated, View, Text} from 'react-native';
import DefaultStyles from './Style';
import noop from 'lodash/noop';

/**
 * 提示框组件
 * **Author: qianjun.yang**
 *
 * ![](http://7xkm02.com1.z0.glb.clouddn.com/Tooltip.png)
 *
 * Install
 * -------
 * qnpm install @qnpm/react-native-ui-tooltip
 *
 * @example ../../examples/ToolTipExample.js[1-78]
 */

class ToolTip extends Component {
    constructor(props){
        super(props)
        this.state = {
            fadeAnim: new Animated.Value(0),
        }
    }

    componentWillReceiveProps(){
        const {isVisible} = this.props
        if(isVisible){
            Animated.timing(this.state.fadeAnim, {
                toValue: 0,
                duration: 0,
            }).start();
        }else{
            Animated.timing(this.state.fadeAnim, {
                toValue: 1,
                duration: 300,
            }).start();
        }
    }

    renderMask(){
        const {style} = this.props
        const styles = DefaultStyles;

        return (
            <View style={[styles.mask, style]}></View>
        )
    }

    renderBody(){
        const {onClose, children, boxStyle} = this.props
        const styles = DefaultStyles;
        return (<TouchableOpacity style={[styles.toolTipPannel]} onPress={onClose}>
                <View style={[styles.toolTip, boxStyle || {}]}>
                    <Text style={[styles.content, children.props.style]}>
                        {children}
                    </Text>
                </View>
            </TouchableOpacity>)
    }

    render(){

        const {isAutoHide, onClose, isVisible, isEffect, duration, mask} = this.props
        var styles = DefaultStyles;

        this.timer && clearTimeout(this.timer);

        if(!isVisible) {
            return <View />
        } else {
            if(isAutoHide && onClose){
                this.timer = setTimeout(()=>{onClose()}, duration || 2000);
            }
            return (
                <Animated.View style={[styles.container,{opacity: isEffect == false ? 1 : this.state.fadeAnim}]}>
                    {mask && this.renderMask()}
                    {this.renderBody()}
                </Animated.View>
            )
        }
    }
}

ToolTip.defaultProps = {
    isVisible: false,
    isEffect: true,
    onClose: noop,
    isAutoHide: false,
    mask: true,
}

ToolTip.propTypes = {
    /** 是否显示提示框 */
    isVisible: React.PropTypes.bool,

    /** 是否开启动画效果 默认为true*/
    isEffect: React.PropTypes.bool,

    /** 关闭组件时的回调 */
    onClose:  React.PropTypes.func,

    /** 遮罩样式 */
    style: View.propTypes.style,

    /** 弹框样式 **/
    boxStyle: View.propTypes.style,

    /** 是否自动隐藏 默认为false*/
    isAutoHide: React.PropTypes.bool,

    /** 是否显示遮罩 **/
    mask: React.PropTypes.bool,
}

module.exports = ToolTip
