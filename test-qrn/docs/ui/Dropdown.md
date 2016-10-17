Dropdown
========

下拉选择组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Dropdown.png)

Install
-------
qnpm install @qnpm/react-native-ui-dropdown



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
data|array|[]|No|下拉选项数据
config|object|{}|No|配置对象
onSelect|func||No|选中的回调

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, ScrollView, TextInput} from 'react-native'

import DropDown, {DropDownTrigger} from '@qnpm/react-native-ui-dropdown'
import commonStyle from './layout/style.js'

class DropdownExample extends Component {

    constructor (props) {
        super(props)
        const me =  this
        this.state = {
            opts: {
                visible: false,
                style: {
                    // width:
                    // left :
                    // top  :
                }
            },
            value: '点击下拉选择',
            drowDownCnf: {
                valueGetter: function () {
                    return me.state.value
                },
                valueSetter: function (value) {
                    return me.setState({
                        value: value,
                    })
                },
                visibleGetter: function () {
                    return me.state.opts
                },
                visibleSetter: function (visible, style) {
                    return me.setState({opts: {
                        visible: visible,
                        style: {...style}
                    }})
                },
            },
        }
    }

    render() {
        const {navigator} = this.props,
            {drowDownCnf, drowDownCnf2} = this.state
        return (
            <View
                style={{flex: 1}}
            >
                <View style={styles.intro}>
                    <Text style={styles.introText}>
                        组件分为DropDownTrigger和DropDown两部分。和Dialog类似，应该把DropDown放在靠后的结构上，以使其正常渲染。
                    </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text>例子</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        <DropDownTrigger
                            style={{backgroundColor: '#3ac'}}
                            config={drowDownCnf}
                        />
                    </View>
                </View>
                <DropDown
                    config={drowDownCnf}
                    data={[1, 2, ,3, 4, 5, 2, ,3, 4, 5, 2, ,3, 4, 5]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({...commonStyle})

```