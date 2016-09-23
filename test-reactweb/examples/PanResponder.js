'use strict';

var React = require('qunar-react-native');
var {
    View,
    StyleSheet,
    Text,
    AppRegistry,
    PanResponder
} = React;


var Demo = React.createClass({
    componentWillMount: function() {
        this._panResponder = PanResponder.create({
            onStartShouldSetResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e,g) => {console.log('onPanResponderGrant',e,g)},
            onPanResponderMove: (e,g) => {console.log('onPanResponderMove',e,g)},
            onPanResponderTerminationRequest: () => true,
            onPanResponderRelease: (e,g) => {console.log('onPanResponderRelease',e,g)},
            onPanResponderTerminate: (e,g) => {console.log('onPanResponderTerminate',e,g)},
        })
    },
    render: function() {
        return (
          <View  {...this._panResponder.panHandlers}  style={{flex:1,height:500,backgroundColor:'#f4f4f4'}}>
            <Text>打开开发者工具，随意在屏幕上拖动，在控制台中可看到输出</Text>
          </View>
        );
      },
});

AppRegistry.registerComponent('AwesomeProject', () => Demo);

module.exports = Demo
