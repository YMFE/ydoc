RangeSlider
===========

范围滑块组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/RangeSlider.png)

Install
-------
qnpm install @qnpm/react-native-ui-range-slider



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
thumbSize|number|28|No|滑块直径
maximumTrackTintColor|string|'#b6b6b6'|No|range区间外背景底色
minimumTrackTintColor|string|'#0b6aff'|No|range区间内底色
maximumValue|number|1|No|range最大值
minimumValue|number|0|No|range最小值
step|number|0|No|步长
value|union(number或array)|0|No|设置值
onValueChange|func||No|值改变的回调，释放拖动头之后才会触发一次
onUpdate|func||No|值改变的回调，拖动过程中触发多次
onSlidingComplete|func||No|滑动到边界回调

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import RangeSlider, {Slider} from '@qnpm/react-native-ui-range-slider'
import commonStyle from './layout/style.js'

class RangeSliderExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            values: props.settedValue,
        }
    }

    render() {
        const {settedValue, minimumValue, maximumValue} = this.props
        let {values} = this.state

        return (
            <View>
                <Text>{this.state.values.join(', ')}</Text>
                <RangeSlider
                    value={this.state.values}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    onUpdate={(v) => this.onUpdate(v)}
                    onChange={(v) => this.onChange(v)}
                    onSlidingComplete={(v) => console.log(v)}
                />
                <TouchableOpacity style={[styles.button, {marginTop: 10}]} onPress={() => this.setState({values: settedValue})}>
                    <Text>点击修改为{settedValue.join(', ')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    onUpdate(v) {
        let state = {}
        state['values'] = v
        this.setState(state)
    }

    onChange(v) {
        let state = {}
        state['values'] = v
        this.setState(state)
    }

}

const styles = StyleSheet.create({...commonStyle})

module.exports = {
    title: 'RangeSlider',
    examples: [{
        subtitle: 'set default value [0.2, 0.5]',
        render: () => {
            return (<RangeSliderExample settedValue={[0.2, 0.5]}/>)
        }
    }, {
        subtitle: 'set minimumValue -1, maximumValue 3',
        render: () => {
            return (<RangeSliderExample minimumValue={-1} maximumValue={3} settedValue={[0, 1]}/>)
        }
    }]
}


```