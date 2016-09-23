Popover
=======

弹出选项组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Popover.png)

Install
-------
qnpm install @qnpm/react-native-ui-popover



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
visible|bool|false|No|是否显示
modal|bool|true|No|是否显示遮罩
onClose|func||No|关闭后回调
distance|number|200|No|popover元素的高度，动画移动的距离
initial|number|0|No|显示的时候超出direction方向上的距离
direction|enum('top'或'bottom')|'bottom'|No|从哪个方向弹出
modalStyle|union(object或number)|{}|No|遮罩样式
content|union(string或element)|''|No|内容，可是react element

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, ScrollView, TextInput} from 'react-native'

import Popover, {ActionSheet} from '@qnpm/react-native-ui-popover'
import commonStyle from './layout/style.js'

class PopoverExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            cur1: false,
            cur2: false,
            cur3: false,
            cur4: true,
        }

    }

    render() {
        const {navigator} = this.props,
            me = this
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const content = function (id) {
            return (
                <View style={{flex: 1}}>
                    <View style={[styles.section]}>
                        <View style={styles.sectionHeader}>
                            <Text>title</Text>
                            <TouchableOpacity
                                style={[styles.close]}
                                onPress={(event) => me.close(id)}
                            >
                                <Text>close</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionBody}>
                            <Text>content</Text>
                        </View>
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.sectionHeader}>
                            <Text>title</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            <Text>content</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={{backgroundColor: "#fff", flex: 1}}>
                <ScrollView
                    onScroll={(event) => console.log(event)}
                    onLayout={(event) => this.onLayout(event)}
                >
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text>例子 - Popover </Text>
                        </View>
                        <View style={styles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => this.change(1)}
                                style={styles.button}
                            >
                                <Text>toggle Popover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text>例子 - Popover modal:false</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => this.change(2)}
                                style={styles.button}
                            >
                                <Text>toggle Popover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text>例子 - Popover direction:top, 展示的时候有动画，隐藏的时候：如果是本身的update则保留动画，如果由父view传递的数据来决定则不展示动画</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => this.change(3)}
                                style={styles.button}
                            >
                                <Text>toggle Popover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text>例子 - ActionSheet</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            <TouchableOpacity
                                onPress={() => this.change(4)}
                                style={styles.button}
                            >
                                <Text>toggle Popover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Popover
                    visible={this.state.cur1}
                    style={{height: 280}}
                    initial={40}
                    onClose={(event) => this.onChange(false, 1)}
                    content="content"
                />
                <Popover
                    modal={false}
                    content={content(2)}
                    style={{backgroundColor: "lightblue"}}
                    visible={this.state.cur2}
                    onClose={(event) => this.onChange(false, 2)}
                />
                <Popover
                    direction="top"
                    content={content(3)}
                    animated={this.state.cur3}
                    modalStyle={{backgroundColor: "rgba(0, 255, 255, 0.2)"}}
                    visible={this.state.cur3}
                    onClose={(event) => this.onChange(false, 3)}
                />
                <ActionSheet
                    menu={[{text: "照相", action: function () {me.noop()}}, {text: "录音", action: function () {me.noop()}}]}
                    visible={this.state.cur4}
                    onClose={(event) => this.onChange(false, 4)}
                />
            </View>
        )
    }

    close(id, max) {
        let state = {}
        state["cur" + id] = false
        this.setState(state)
        console.log(state)
    }

    noop() {

    }

    change(id, max) {
        let state = {}
        state["cur" + id] = !this.state["cur" + id]
        this.setState(state)
        console.log(state)
    }

    onChange(v, id) {
        let state = {}
        state["cur" + id] = v
        this.setState(state)
        console.log("第" + id + "个:" + v)
    }

    onLayout (event) {
        this.vieHeight = event.nativeEvent.layout.height
    }

}

const styles = StyleSheet.create({
    ...commonStyle,
    close: {
        position: "absolute",
        right: 6,
        top: 6,
    }
})

```
