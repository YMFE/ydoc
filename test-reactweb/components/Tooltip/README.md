Tooltip
=======

提示框组件
**Author: qianjun.yang**

![](http://7xkm02.com1.z0.glb.clouddn.com/Tooltip.png)

Install
-------
qnpm install @qnpm/react-native-ui-tooltip



Props
-----
Prop                  | Type     | Default                   | Required | Description
--------------------- | -------- | ------------------------- | -------- | -----------
isVisible|bool|false|No|是否显示提示框
isEffect|bool|true|No|是否开启动画效果 默认为true
onClose|func|() => {}|No|关闭组件时的回调
style|custom||No|遮罩样式
isAutoHide|bool|false|No|是否自动隐藏 默认为false

Example:
--------
```javascript

import React, {Component, StyleSheet, View, Text} from 'react-native'

import ToolTip from '@qnpm/react-native-ui-tooltip'


class TooltipExample extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isModalOpen: false
        }
    }

    openModal(){
        this.setState({isModalOpen: true})
    }

    closeModal() {
        this.setState({isModalOpen: false});
    }

    render() {
        const {navigator} = this.props

        return (
            <View style={styles.container}>
                <View style={styles.pannel}>
                    <Text onPress={() => this.openModal()}>
                        点击文字显示ToolTip
                    </Text>
                </View>

                <ToolTip
                    isVisible={this.state.isModalOpen}
                    isAutoHide={false}
                    onClose={() =>this.closeModal()}
                    style={styles.mask}

                >
                    {this.renderTipContent()}
                </ToolTip>

            </View>
        )
    }

    renderTipContent() {
        return (
            <Text style={styles.content}>
                弹出层内容。。。。。。。
            </Text>
        )
    }

}

const styles = StyleSheet.create({
    pannel: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    mask: {
        //backgroundColor: null,
        // opacity: .4,
    },
    content: {
        // color: 'red',
        // fontSize: 18,
        // lineHeight: 20,
    }
});


```