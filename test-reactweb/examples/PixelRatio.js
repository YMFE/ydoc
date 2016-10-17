'use strict';
var React = require('qunar-react-native');
var {
    Component,
    Text,
    View,
    StyleSheet,
    PixelRatio,
    AppRegistry,
} = React;

var Demo = React.createClass({
    render(){
        return(
            <View>
                <Text>本设备的像素密度是：{PixelRatio.get()}</Text>  
                <Text>8.4dp在本设备上转化为px是: {PixelRatio.getPixelSizeForLayoutSize(8.4)}px</Text>
                <Text>8.4dp在本设备上转化为整数px值时最接近的dp值是: {PixelRatio.roundToNearestPixel(8.4)}dp</Text>
            </View>
        )
    }
}) 

AppRegistry.registerComponent('Demo', () => Demo)
