Rating
======

星级评分组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Rating.png)

Install
-------
qnpm install @qnpm/react-native-ui-rating



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
cur|number|0|No|设置值
total|number|5|No|最高分值
readonly|bool|false|No|只读，无法进行交互
onStyle|union(object或number)|{}|No|选中的样式
offStyle|union(object或number)|{}|No|未选中的样式
style|custom||No|自定义样式
onChange|func||No|回调

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, TouchableOpacity} from 'react-native'

import Rating from '@qnpm/react-native-ui-rating'
import commonStyle from './layout/style.js'

class RatingExample extends Component {

    constructor (props) {
        super(props)

        this.state = {
            value: this.props.value
        }
    }

    render() {
        return (
            <View>
                <Text style={{marginBottom: 10}}>
                    当前分数：{this.state.value}
                </Text>
                <Rating
                    cur={this.state.value}
                    onChange={(v) => this.onChange(v)}
                    {...this.props}
                />
                <TouchableOpacity
                    onPress={() => this.setRandomValue()}
                    style={[styles.button, {marginTop: 10, width: 120}]}
                >
                    <Text>随机打分</Text>
                </TouchableOpacity>
            </View>
        )
    }

    setRandomValue() {
        this.setState({value: Math.round(Math.random() * 5)})
    }

    onChange(value) {
        this.setState({value})
    }

}


const styles = StyleSheet.create({...commonStyle})

module.exports = {
    title: 'Rating',
    examples: [{
        subtitle: 'Default settings',
        render: () => {
            return (<RatingExample value={3}/>)
        }
    }, {
        subtitle: 'readonly',
        render: () => {
            return (<RatingExample value={3} readonly={true} />)
        }
    }]
}


```