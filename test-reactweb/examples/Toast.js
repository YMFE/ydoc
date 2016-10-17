'use strict';
var React = require('react-native');
var {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Toast,
} = React;


var Demo = React.createClass({
    render: function() {
        setTimeout(function(){
            Toast.show('hi,我会在2000ms后自动隐藏',2000)
        },1000)
        return (
            // 主视图 有一个背景颜色
            <View style={{flex:1, flexDirection: 'column',backgroundColor:'lightBlue'}}>
            </View>
        );
    }
});

AppRegistry.registerComponent('AwesomeProject', () => Demo)