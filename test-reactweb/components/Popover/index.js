/**
 * @providesModule UPopover
 */
'use strict'

import React, {Component, StyleSheet, View, Text, PropTypes, TouchableWithoutFeedback, TouchableHighlight, Animated, Dimensions} from 'react-native'

var {
    height: deviceHeight,
    width: deviceWidth,
} = Dimensions.get('window')

function noop() {}

/**
 * 弹出选项组件
 * **Author: qianjun.yang**
 *
 * ![](http://7xkm02.com1.z0.glb.clouddn.com/Popover.png)
 *
 * Install
 * -------
 * qnpm install @qnpm/react-native-ui-popover
 *
 * @example ../../examples/PopoverExample.js[1-182]
 */

class Popover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible : this.props.visible,
            over    : this.props.visible,
            animated: this.props.animated,
        }
    }

    // shouldComponentUpdate (nextProps, nextState)  {
    //     return this.state.visible !== nextState.visible || this.state.over !== nextState.over
    // }

    componentWillReceiveProps (props) {
        if (props.visible === this.state.visible) return
        if (this.state.visible) {
            // 先执行动画效果，动画效果结束后再去更新 visible
            let newState = {
                over    : props.visible,
                animated: props.animated,
            }
            this.setState(newState)
        } else {
            this.setState({
                visible : props.visible,
                over    : props.visible,
                animated: props.animated,
            })
        }
    }

    render() {
        const {modalStyle, modal, content} = this.props
        const {visible, over} = this.state
        if (!visible) return null

        let _content = content
        if (typeof _content === 'string' || typeof _content === 'number') {
            _content = <Text style={styles.popoverText}>{_content}</Text>
        }
        const Pop = (
            <Over
                {...this.props}
                visible={over}
                content={_content}
                onOver={(event) => this._onOver(event)}
            />
        )

        if (!modal) return Pop

        return (
            <View
                style={[styles.popoverLayout, modalStyle]}
                onPress={(event) => this._onPress(event)}
            >
                <TouchableWithoutFeedback
                    style={[styles.modal]}
                    onPress={(event) => this._onPress(event)}
                >
                    <View style={[styles.modal]} ></View>
                </TouchableWithoutFeedback>
                {Pop}
            </View>
        )
    }

    _onPress () {
        const {visible} = this.state
        if (visible) {
            this.setState({
                over: !visible,
            })
        }
    }

    _onOver () {
        const {visible} = this.state
        const {onClose} = this.props
        if (visible) {
            this.setState({
                visible: !visible,
            })
            if (onClose) onClose()
        }
    }
}

Popover.defaultProps = {
    visible   : false,
    modal     : true,
    modalStyle: {},
    direction : 'bottom',
    distance  : 200,
    initial   : 0,
    content   : '',
}

Popover.propTypes = {
    /** 是否显示 */
    visible   : PropTypes.bool,
    /** 是否显示遮罩 */
    modal     : PropTypes.bool,
    /** 关闭后回调 */
    onClose   : PropTypes.func,
    /** popover元素的高度，动画移动的距离 */
    distance  : PropTypes.number,
    /** 显示的时候超出direction方向上的距离 */
    initial   : PropTypes.number,
    /** 从哪个方向弹出 */
    direction : PropTypes.oneOf(['top', 'bottom']),
    /** 遮罩样式 */
    modalStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    /** 内容，可是react element */
    content   : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}


class Over extends Component {
    constructor (props) {
        super(props)
        const {initial, distance, visible, animated} = this.props
        this.state = {
            fadeAnim: new Animated.Value(visible ? -distance : initial),
            visible: visible,
        }
        this.animated = animated
    }

    componentWillReceiveProps(props) {
        this.animated = props.animated
    }

    componentDidMount () {
        const {initial, distance, visible} = this.props
        this._animated(visible ? initial : -distance)
    }

    _animated (to, cb) {
        const {fadeAnim} = this.state
        if (this.animated === false) {
            fadeAnim.setValue(to)
            return cb && cb()
        }
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: to,
            }
        ).start(function () {
            cb && cb()
        })
    }

    componentWillUpdate () {
        const me = this
        const {initial, distance, visible} = this.props
        this._animated(this.props.visible ? -distance : initial, function () {
            me.props.onOver()
        })
    }

    render () {
        const {style, direction, content} = this.props
        let ani = {}
        ani[direction] = this.state.fadeAnim
        return (
            <Animated.View style={[styles.popover, style || {}, ani]}>{content}</Animated.View>
        )
    }
}


class ActionSheet extends Component {
    constructor(props) {
        super(props)
        this.content = null
        this.state = {
            visible: this.props.visible,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            visible: props.visible,
        })
    }

    render() {
        const {menu, actionMenu, style, options, cancelButtonIndex, destructiveButtonIndex, callback, tintColor} = this.props,
            me = this,
            length = options && options.length
        if (this.state.visible) {
            let _menu = [], i = 0, _actionMenu = []
            if (length) {
                while(i < length) {
                    let item = {
                        text: options[i],
                        onPress: ((i) => {
                            return function(event) {
                                me.cancel && me.cancel(event, (event)=>((callback || noop)(i)))
                            }
                        })(i)
                    }
                    if (tintColor) item.style = {color: tintColor}
                    if (i === destructiveButtonIndex) {
                        item.style = {
                            color: 'red',
                        }
                    } else if (i === cancelButtonIndex) {
                        // 还是触发。。。
                        // item.onPress = me.cancel // 不触发 callback
                    }
                    if (i == length - 1) {
                        _actionMenu.push(item)
                    } else {
                        _menu.push(item)
                    }
                    i++
                }
            } else {
                menu.forEach(function(item) {
                    if (item) {
                        _menu.push({
                            // 保证this指向正确
                            onPress: () => {typeof item.action == 'function' ? item.action() : me[item.action]() || noop},
                            ...item,
                        })
                    }
                })
                actionMenu.forEach(function(item) {
                    if (item) {
                        _actionMenu.push({
                            // 保证this指向正确
                            onPress: () => {typeof item.action == 'function' ? item.action() : me[item.action]() || noop},
                            ...item,
                        })
                    }
                })
            }
            let _menuLength = _menu.length - 1,
                _actionMenuLength = _actionMenu.length - 1
            this.content = (
                <View
                    style={[styles.actionSheetLayout]}
                >
                    <View
                        style={[styles.actionSheetMenu]}
                    >
                        {
                            _menu.map(function (cell, index) {
                                let {text, action, style} = cell
                                if (typeof text === 'string' || typeof text === 'number') text = <Text style={[styles.actionSheetButtonText, style]}>{text}</Text>
                                const _style = index < _menuLength ? styles.actionSheetButtonBorder : {}
                                return (
                                    <TouchableHighlight
                                        style={[styles.actionSheetButton, _style, style]}
                                        underlayColor="#f9f9f9"
                                        onPress={cell.onPress}
                                        key={'cell' + index}
                                    >
                                        {text}
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                    <View
                        style={[styles.actionSheetAction]}
                    >
                        {
                            _actionMenu.map(function (cell, index) {
                                let {text, action, style} = cell
                                if (typeof text === 'string' || typeof text === 'number') text = <Text style={[styles.actionSheetButtonText, style]}>{text}</Text>
                                const _style = index < _actionMenuLength ? styles.actionSheetButtonBorder : {}
                                return (
                                    <TouchableHighlight
                                        style={[styles.actionSheetButton, _style, style]}
                                        underlayColor="#f9f9f9"
                                        onPress={cell.onPress}
                                        key={'action' + index}
                                    >
                                        {text}
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                </View>
            )
            this.__callback = this.props.onClose || noop
        }
        return (
            <Popover
                initial={4}
                {...this.props}
                style={[styles.actionSheet, style, {backgroundColor: 'transparent'}]}
                content={this.content}
                onClose={(event)=>me.__callback(event)}
            />
        )
    }

    cancel(event, callback) {
        if (this.state.visible) {
            let onClose = this.props.onClose
            this.__callback = function() {
                callback && callback()
                onClose && onClose()
            }
            this.setState({
                visible: false,
            })
        }
    }
}

ActionSheet.defaultProps = {
    options: [],
    cancelButtonIndex: -1,
    destructiveButtonIndex: -1,
    menu: [],
    actionMenu: [{text: "取消", action: "cancel"}],
}

ActionSheet.propTypes = {
    options: PropTypes.array,
    cancelButtonIndex: PropTypes.number,
    destructiveButtonIndex: PropTypes.number,
    menu: PropTypes.array,
    actionMenu: PropTypes.array,
}

const styles = require('./popover.js').styles

Popover.ActionSheet = ActionSheet
module.exports = Popover
