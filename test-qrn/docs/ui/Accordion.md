Accordion
=========

手风琴组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Accordion.png)

Install
-------
qnpm install @qnpm/react-native-ui-accordion



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
data|array|[]|No|每项的配置项，like: [{title: "", content: ""}]，title必须是字符串，content可以是字符串，也可以是element。
open|number|-1|No|默认展开的项目，设置成-1表示默认不展开，否则展开index === open的项目。
onChange|func||No|展开项目变化时候的回调。

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import Accordion from '@qnpm/react-native-ui-accordion'
import commonStyle from './layout/style.js'

class AccordionExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            open: -1,
        }
    }

    render() {
        const {navigator} = this.props
        return (
            <View>
                <Accordion
                    data={[{title: '标题1', content: '第一项内容'}, {title: '标题2', content: '第二项内容'}]}
                    open={this.state.open}
                    onChange={(v) => this.onChange(v)}
                />
                <TouchableOpacity
                    onPress={(event) => this.setState({open: 0})}
                    style={[styles.button, {marginTop: 10, width: 120}]}>
                    <Text>打开第一个</Text>
                </TouchableOpacity>
            </View>
        )
    }

    onChange(v) {
        console.log('打开', v)
    }
}

```