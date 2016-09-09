Suggest
=======

搜索提示组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Suggest.png)

Install
-------
qnpm install @qnpm/react-native-ui-suggest



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
recommend|array|[]|No|建议列表项（推荐项，靠前）
data|array|[]|No|建议列表项
config|object|{}|No|配置对象
onSelect|object||No|选中的回调

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, ScrollView, TextInput} from 'react-native'

import Suggest, {SuggestTrigger} from '@qnpm/react-native-ui-suggest'
import commonStyle from './layout/style.js'

class SuggestExample extends Component {
    constructor (props) {
        super(props)
        const me = this
        this.state = {
            cur1: false,
            value: '',
            suggestCnf: {
                valueGetter: function () {
                    return me.state.value
                },
                valueSetter: function (v) {
                    return me.setState({
                        value: v,
                    })
                },
                visibleSetter: function (visible) {
                    return me.setState({
                        cur1: visible,
                    })
                },
                visibleGetter: function () {
                    return me.state.cur1
                },
                onChangeText: function (value, cb) {
                    var obj = {},
                        data = []
                    while (data.length < 40) {
                        data.push(data.length + " " + value)
                    }
                    obj.data = data
                    obj.recommend = ['这个是推荐']
                    cb(obj)
                }
            },
            list: [],
            recommend: [],
        }
    }

    render() {
        const {navigator} = this.props,
            me = this,
            {state} = this,
            {suggestCnf} = state
        return (
            <View style={[{flex: 1, backgroundColor: '#fff'}]}>
                <Text style={{margin: 15}}>
                    点击输入框，触发suggest
                </Text>
                <View style={[styles.form]}>
                    <SuggestTrigger style={{
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#ddd'
                        }}
                        config={suggestCnf}
                    />
                </View>
                <Suggest
                    config={suggestCnf}
                />
            </View>
        )
    }

}


const styles = StyleSheet.create({
    form: {
        height: 30,
        margin: 15,
        marginTop: 0,
    },
    numberInput: {
        fontSize: 16,
        color: '#212121',
        textAlign: 'left',
        flex: 1,
        paddingLeft: 8,
    },
})


```