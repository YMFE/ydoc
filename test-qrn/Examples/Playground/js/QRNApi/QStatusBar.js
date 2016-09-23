'use strict'

import React, {View, Component, Text, DeviceInfo, StyleSheet, QStatusBar, Button, Radio, Slider, Toast} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 5,
        padding: 5,
    },
    textContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    textRow: {
        flexDirection: 'row',
        padding: 5,
    },
    textLeft: {
        width: 100,
    },
    textMiddle: {
        width: 50,
    },
    textRight: {
        flex: 1
    },
})

class QStatusBarDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
        }
    }

    setHidden(status) {
        QStatusBar.setHidden(status, ()=>{
            Toast.show('设置成功', Toast.SHORT, Toast.MIDDLE);
        }, ()=>{
            Toast.show('设置失败', Toast.SHORT, Toast.MIDDLE);
        })
    }

    setStyle(style) {
        QStatusBar.setStyle(style, ()=>{
            Toast.show('设置成功', 1000, Toast.MIDDLE);
        }, ()=>{
            Toast.show('设置失败', 1000, Toast.MIDDLE);
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button text="显示状态栏" style={styles.button} onPress={()=>this.setHidden(false)}/>
                    <Button text="隐藏状态栏" style={styles.button} onPress={()=>this.setHidden(true)}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="iOS设置为light" style={styles.button} onPress={()=>this.setStyle('light')}/>
                    <Button text="iOS设置为default" style={styles.button} onPress={()=>this.setStyle('default')}/>
                </View>
            </View>
        )
    }
}

module.exports = {
    title: 'QStatusBar',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <QStatusBarDemo />
            );
        },
    }]
};
