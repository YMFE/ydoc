Carousel
========

轮播组件
**Author: yuhao.ju**

Install
-------
qnpm install @qnpm/react-native-ui-carousel



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
children|node||Yes|轮播的内容
dots|bool|true|No|是否显示面板指示点
style|custom||No|自定义样式
onChange|func|function(index){return index}|No|切换后的回调

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text, Image, Dimensions, TouchableOpacity} from 'react-native'

import Carousel from '@qnpm/react-native-ui-carousel'
import commonStyle from './layout/style.js'

class CarouselExample extends Component {
    constructor (props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <View style={styles.container}>
                <Carousel>
                    <View style={styles.page}>
                        <Image
                            style={styles.img}
                            source={{uri: 'http://7xkm02.com1.z0.glb.clouddn.com/page1.png'}}
                        />
                    </View>
                    <View style={styles.page}>
                        <Image
                            style={styles.img}
                            source={{uri: 'http://7xkm02.com1.z0.glb.clouddn.com/page2.png'}}
                        />
                    </View>
                    <View style={styles.page}>
                        <Image
                            style={styles.img}
                            source={{uri: 'http://7xkm02.com1.z0.glb.clouddn.com/page3.png'}}
                        />
                    </View>
                </Carousel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        width: Dimensions.get('window').width,
        flex: 1,
        alignItems: 'stretch',
    },
    img: {
        flex:1,
    },
});

module.exports = {
    title: 'Carousel',
    examples: [{
        render: () => {
            return (<CarouselExample />)
        }
    }]
}

```
