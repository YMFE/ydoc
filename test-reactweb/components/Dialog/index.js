/**
 * @providesModule UDialog
 */
 

import {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

var {
    height: deviceHeight,
    width: deviceWidth,
} = Dimensions.get('window')

function noop() {}

/**
 * 弹窗组件
 * **Author: qianjun.yang**
 *
 * ![](http://7xkm02.com1.z0.glb.clouddn.com/Dialog.png)
 *
 * Install
 * -------
 * qnpm install @qnpm/react-native-ui-dialog
 *
 * @example ../../examples/DialogExample.js[1-199]
 */
class Dialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: this.props.visible || false,
        }

        this.lastVisible = false
    }

    componentWillReceiveProps (props) {
        this.lastVisible = this.state.visible
        this.setState({
            visible: props.visible,
        })
    }

    render() {
        if (!this.state.visible) return null

        const props = this.props,
            dialog  = this,
            {header, content} = this.props,
            headerKeys = Object.keys(header)

        let Header = null
        // 定制是否要header
        if (props.showHeader) {
            Header = (
                <View style={[styles.title]}>
                    <Text style={[styles.titleText]}>{props.title}</Text>
                    {
                        headerKeys.map(function (item, index) {
                            let button = header[item]
                            // 通过该项来实现只展示一个选项，但是又能决定排序
                            if (!button || button.hidden) return null
                            const itemStyle = styles[index ? 'titleRight' : 'titleLeft'],
                                itemStyle2 = item == 'close' ? styles.titleButtonClose : {}

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.titleButton, itemStyle, itemStyle2]}
                                    onPress={(event) => dialog[item](event)}
                                >
                                    <Text style={[styles.titleButtonText]}>{header[item].text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }

        let _content = content

        if (typeof _content == 'string' || typeof _content === 'number') {
            _content = (
                <Text style={[styles.contentText]}>{content}</Text>
            )
        }
        let buttons = props.buttons
        if (!buttons.length) {
            buttons = []
            let footer = props.footer
            if (props.type == 'alert') {
                var tmp = {...props.footer.confirm}
                if (!tmp.onPress) {
                    tmp.onPress = function(event) {
                        return dialog.confirm(event)
                    }
                    tmp.callNoClose = true
                }
                buttons.push(tmp)
            } else {
                for (var action in footer) {
                    var tmp = {...footer[action]}
                    if (!tmp.onPress) {
                        (function(action) {
                            tmp.onPress = function(event) {
                                return (dialog[action].bind(dialog) || noop)(event)
                            }
                        })(action);
                        tmp.callNoClose = true
                    }
                    buttons.push(tmp)
                }
            }
        }

        const buttonsLength = buttons.length,
            {style, modalStyle, modal} = this.props,
            dialogNoModal = modal ? {} : styles.dialogNoModal,
            dialogNoModalDynamic = modal ? {} : {left: deviceWidth / 2, top: deviceHeight / 2, marginTop: -140}

        const main = (
            <View style={[styles.dialog, dialogNoModal, dialogNoModalDynamic, style || {}]}>
                {Header}
                <View style={[styles.content]}>
                    {_content}
                </View>
                <View style={[styles.footer, buttonsLength > 2 ? {flexDirection: "column"} : {}]}>
                    {
                        buttons.map(function (item, index) {
                            const itemStyle = styles[index || buttonsLength != 2 ? 'buttonRight' : 'buttonLeft']
                            return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#f9f9f9"
                                    style={[styles.button, itemStyle]}
                                    onPress={function(event) {if(item.onPress(event) !== false) !item.callNoClose && dialog.close()}}
                                >
                                    <Text style={[styles.buttonText]}>{item.text}</Text>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
            </View>
        )
        if (!modal) return main
        return (
            <View style={[styles.dialogLayout, modalStyle || {}]}>
                {main}
            </View>
        )
    }

    cancel(e) {
        if ( this.props.onCancel) {
            // 不关闭
            if (this.props.onCancel(e) === false) return
        }
        this.close()
    }

    confirm(e) {
        if (this.props.onConfirm && this.props.type != 'alert') {
            // 不关闭
            if (this.props.onConfirm(e) === false) return
        }
        this.close()
    }

    close() {
        if (this.state.visible) {
            this.setState({
                visible: false,
            })
            if (this.props.onClose) this.props.onClose()
        }
    }
}

Dialog.defaultProps = {
    type      : 'confirm',
    title     : '',
    content   : '',
    modal     : true,
    showHeader: true,
    header    : {},
    footer    : {confirm: {text: '确定'},cancel: {text: '取消'},},
    buttons   : [],
    modalStyle: {},
}

Dialog.propTypes = {
    /** 弹窗类型，可选alert、confirm */
    type        : PropTypes.string,
    /** 弹窗title */
    title       : PropTypes.string,
    /** 弹窗主体内容，也可传递比较复杂的contentJSX结构的时候，使用该配置 */
    content     : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** 确认时触发的回调函数 */
    onConfirm   : PropTypes.func,
    /** 取消时触发的回调函数 */
    onCancel    : PropTypes.func,
    /** 关闭时触发的回调函数 */
    onClose     : PropTypes.func,
    /** 初始化后触发的回调函数 */
    onInit      : PropTypes.func,
    /** 是否显示header */
    showHeader  : PropTypes.bool,
    /** 配置title的左边和右边显示的附加按钮，例如{cancle: {text: "X", hidden: false}, confirm: false}，cancel、confirm、close最多配置两个，配置成false或者hidden:true表示不展示，但是会占位置 */
    header      : PropTypes.object,
    /** 配置底部的按钮 */
    footer      : PropTypes.object,
    /** 配置底部的按钮，如果长度不为0，则会覆盖footer的配置 */
    buttons     : PropTypes.array,
    /** 是否显示dialog */
    visible     : PropTypes.bool,
    /** 是否显示遮罩，注意，如果设置为false，dialog在竖直方向上就没法居中了，需要自己通过style的top【默认会被设置成视图高度的/2】, marginTop来调整dialog的位置 */
    modal       : PropTypes.bool,
    /** 遮罩样式 */
    modalStyle  : PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
}

class Alert extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return <Dialog {...this.props} type="alert" />
    }
}

class Confirm extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        return <Dialog {...this.props} type="confirm" />
    }
}

const styles = require('./dialog.js').styles

Dialog.Alert = Alert
Dialog.Confirm = Confirm

module.exports = Dialog
