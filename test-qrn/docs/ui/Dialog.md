Dialog
======

弹窗组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Dialog.png)

Install
-------
qnpm install @qnpm/react-native-ui-dialog



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
type|string|'confirm'|No|弹窗类型，可选alert、confirm
title|string|''|No|弹窗title
content|union(string或element)|''|No|弹窗主体内容，也可传递比较复杂的contentJSX结构的时候，使用该配置
onConfirm|func||No|确认时触发的回调函数
onCancel|func||No|取消时触发的回调函数
onClose|func||No|关闭时触发的回调函数
onInit|func||No|初始化后触发的回调函数
showHeader|bool|true|No|是否显示header
header|object|{}|No|配置title的左边和右边显示的附加按钮，例如{cancle: {text: "X", hidden: false}, confirm: false}，cancel、confirm、close最多配置两个，配置成false或者hidden:true表示不展示，但是会占位置
footer|object|{confirm: {text: '确定'},cancel: {text: '取消'},}|No|配置底部的按钮
buttons|array|[]|No|配置底部的按钮，如果长度不为0，则会覆盖footer的配置
visible|bool||No|是否显示dialog
modal|bool|true|No|是否显示遮罩，注意，如果设置为false，dialog在竖直方向上就没法居中了，需要自己通过style的top【默认会被设置成视图高度的/2】, marginTop来调整dialog的位置
modelStyle|array||No|遮罩样式

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, ScrollView} from 'react-native'

import Dialog, {Alert, Confirm} from '@qnpm/react-native-ui-dialog'
import commonStyle from './layout/style.js'

var counter = 0

class DialogExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            _showDialog1: false,
            _showDialog2: false,
            _showDialog3: false,
            _showDialog4: false,
            _showAlert: false,
            _showConfirm: false,
        }
    }

    render() {
        const {navigator} = this.props

        const keys = ["_showDialog1", "_showDialog2", "_showDialog3", "_showDialog4"]

        const state = this.state

        const ex = this

        const content = (
            <View style={[{backgroundColor: "#09c", padding: 10, alignItems: 'center'}]}>
                <Text style={[{color: "#fff"}]}>
                    里面可嵌入复杂结构
                </Text>
            </View>
        )
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        return (
            <View style={{backgroundColor: "#fff", flex: 1}}>
                <ScrollView
                    style={{backgroundColor: "#fff", flex: 1}}
                    onScroll={(event) => console.log(event)}
                >
                    <View style={styles.intro}>
                        <Text style={styles.introText}>
                            由于React-Native是完全按照先后顺序渲染元素的，因此为了使该组件正常显示，应该把Dialog放在靠后的位置上。
                        </Text>
                    </View>
                    {
                        keys.map(function (item, index) {
                            return (
                                <View
                                    style={styles.section}
                                    key={item + index}
                                >
                                    <View>
                                        <TouchableOpacity
                                            onPress={(event) => ex.showDialog(item)}
                                            style={styles.button}
                                        >
                                            <Text>{"show dialog - " + (index + 1)}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={styles.section}>
                        <View>
                            <TouchableOpacity
                                onPress={(event) => ex.showDialog("_showAlert")}
                                style={styles.button}
                            >
                                <Text>{"show alert"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View>
                            <TouchableOpacity
                                onPress={(event) => ex.showDialog("_showConfirm")}
                                style={styles.button}
                            >
                                <Text>{"show confirm"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {
                    keys.map(function (item, index) {
                        if (index < 2) return (
                            <Dialog
                                key={item}
                                modalStyle={styles.modalStyle}
                                style={{marginTop: -160}}
                                title="一般配置"
                                content={counter + ". 严格说这一规定并不是完全合理，国际通行的标准是6岁以下儿童禁止观看成人音乐会，不过在音乐厅检票时审查年龄显然是一件很困难的事情。"}
                                onClose={() => ex.onClose(item)}
                                onCancel={() => console.log("取消" + item)}
                                onConfirm={() => console.log("确认" + item)}
                                visible={state[item]}
                                modal={false}
                                onShow={() => ex.onShow(item)}
                                type={index ? "alert" : "confirm"}
                                footer={index ? {confirm: {text: "确定"}, cancel: {text: "取消"}} : {confirm: {text: "愉快的接受"}, cancel: {text: "残忍的拒绝"}}}
                            />
                        )
                        if (index > 2) return (
                            <Dialog
                                key={item}
                                style={styles.dialogStyle}
                                title="contentJSX配置复杂结构"
                                content={content}
                                onClose={() => ex.onClose(item)}
                                onCancel={() => console.log("取消" + item)}
                                onConfirm={() => console.log("确认" + item)}
                                visible={state[item]}
                                onShow={() => ex.onShow(item)}
                                type={index ? "alert" : "confirm"}
                                footer={index ? {confirm: {text: "确定"}, cancel: {text: "取消"}} : {confirm: {text: "愉快的接受"}, cancel: {text: "残忍的拒绝"}}}
                            />
                        )
                        return (
                            <Dialog
                                key={item}
                                modalStyle={styles.modalStyle}
                                style={styles.dialogStyle}
                                content={counter + ". 不展示header，还随时变换类型"}
                                onClose={() => ex.onClose(item)}
                                onCancel={() => console.log("取消" + item)}
                                onConfirm={() => console.log("确认" + item)}
                                visible={state[item]}
                                showHeader={false}
                                onShow={() => ex.onShow(item)}
                                type={counter % 2 ? "alert" : "confirm"}
                                footer={index ? {confirm: {text: "确定"}, cancel: {text: "取消"}} : {confirm: {text: "愉快的接受"}, cancel: {text: "残忍的拒绝"}}}
                            />
                        )
                    })
                }
                <Alert
                    visible={state._showAlert}
                    modalStyle={styles.modalStyle}
                    onClose={() => ex.onClose("_showAlert")}
                    onShow={() => ex.onShow("_showAlert")}
                    content="这是消息主体"
                    title="这是个Alert"
                />
                <Confirm
                    visible={state._showConfirm}
                    onClose={() => ex.onClose("_showConfirm")}
                    onShow={() => ex.onShow("_showConfirm")}
                    content="这是消息主体"
                    title="这是个Confirm"
                />
            </View>
        )
    }

    showDialog (id) {
        counter++
        if (counter > 100000) counter = 0
        let state = {}
        state[id] = true
        this.setState(state)
    }

    onClose (id) {
        console.log("关闭" + id)
        let state = {}
        state[id] = false
        this.setState(state)
    }

    onShow (id) {
        console.log("显示" + id)
        let state = {}
        state[id] = true
        this.setState(state)
    }

}

const styles = StyleSheet.create({
    ...commonStyle,
    modalStyle: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    dialogStyle: {
        top: -20,
    },
})



```