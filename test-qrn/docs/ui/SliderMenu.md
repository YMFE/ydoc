SliderMenu
==========

滑动菜单
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/SliderMenu.png)

Install
-------
qnpm install @qnpm/react-native-ui-slider-menu



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
data|array|[]|No|滑动菜单项，一个滑动菜单内可以有多个子项，like: [{menu: string/element, action: string/element, removed: bool, direction: left/right}] direction默认是left，如果removed为true或者item为假，则该子项空

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import SliderMenu from '@qnpm/react-native-ui-slider-menu'

class SliderMenuExample extends Component {

    constructor (props) {
        super(props)

        const me = this,
            action = function (id) {
                    return  (
                    <View style={[styles.action]}>
                        <TouchableOpacity onPress={(event) => me.look(id)}>
                            <Text style={[styles.text]}>查看详情{id}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={(event) => me.remove(id)}>
                            <Text style={[styles.text]}>删除{id}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        this.state = {
            data: [{menu: "左侧滑动", action: action(0)}, {menu: "右侧滑动", action: action(1), direction: 'right'}],
        }
    }

    look(id) {

    }

    remove(id) {
        this.state.data[id].removed = true

        this.setState({
            data: this.state.data,
        })
    }

    render() {
        const {navigator} = this.props
        return (
            <View>
                <SliderMenu
                    data={this.state.data}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    text: {
        textAlign: 'center'
    }
})

```
