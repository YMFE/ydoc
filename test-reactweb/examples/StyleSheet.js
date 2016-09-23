'use strict';
var React = require('react-native');
var {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
} = React;

var Demo = React.createClass({
    render() {
        return (
            // 使用
            <View style={styles.cell}>
                <Text style={styles.cellText}>
                    hello
                </Text>
                <Text style={[styles.cellText,styles.textSuccess,false && textWarning]}>
                    可接受数组形式的多个style，最右边的元素有限级最高，否定值会被忽略
                </Text>
                <Text style={{color:'red'}}>
                    直接在render方法中创建样式（不建议）
                </Text>  
            </View>
        )
    }
});
// 创建(注：样式表对象的键名应是驼峰风格)
var styles = StyleSheet.create({
    cell: {
        padding: 8,
        backgroundColor: '#fff',
        borderWidth:1,
        bolderColor:'#333',
        paddingHorizontal:10,
        shadowColor:'#f00',
        shadowOffset:{width:10,height:10},
        shadowRadius:0.4,
    },
    cellText: {
        fontSize: 16,
        fontWeight: 'bolder',
        color:'#333',
    },
    textSuccess:{
        color:'blue',
    },
    textWarning:{
        color:'red',
    },
});


AppRegistry.registerComponent('AwesomeProject', () => Demo)
