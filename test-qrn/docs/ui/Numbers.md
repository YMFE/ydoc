Numbers
=======

数字选择组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Numbers.png)

Install
-------
qnpm install @qnpm/react-native-ui-numbers



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
max|number|10000|No|最大值。
min|number|-10000|No|最小值。
step|number|1|No|步长。
value|number|0|No|当前数，受控值。
readonly|bool|false|No|只读，无法进行交互。
onChange|func||No|回调。

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import Numbers from '@qnpm/react-native-ui-numbers'
import commonStyle from './layout/style.js'

class NumberExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            value: this.props.value
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <Numbers
                    value={this.state.value}
                    onChange={(v) => this.onChange(v)}
                    {...this.props}
                />
                <TouchableOpacity
                    onPress={() => this.change(10)}
                    style={[styles.button, {marginLeft: 10}]}
                >
                    <Text>随机赋值</Text>
                </TouchableOpacity>
            </View>
        )
    }

    change(max) {
        this.setState({
            value: parseInt(Math.random() * max)
        })
    }

    onChange(v) {
        this.setState({
            value: v
        })
    }


```