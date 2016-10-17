'use strict';

var React = require('qunar-react-native');
var {
    View,
    StyleSheet,
    Text,
    AppRegistry,
    Vibration
} = React;


var Demo = React.createClass({
    render() {
        setTimeout(function(){
            Vibration.vibrate(1500);
        },1500);
        return (
            <View>
                <Text>如果window.navigator.vibrate()方法生效的话</Text>
                <Text>那么我会在1500ms后震动1500ms</Text>
            </View>
        );
    }
});

AppRegistry.registerComponent('AwesomeProject', () => Demo);

module.exports = Demo
