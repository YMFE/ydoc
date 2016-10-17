'use strict';

var React = require('qunar-react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image
} = React;
var Header = require('./Header')

var AwesomeProject = React.createClass({
    _onPress: function(){
        console.log(111)
    },
    _onPressIn: function(){
        console.log(222)
    },
    _onPressOut: function(){
        console.log(333)
    },
    _onLongPress:function(){
        console.log('long')
    },
    render: function() {
        var {navigator} = this.props
        return (
            <View  style={styles.container}>
                <Header navigator={navigator} title="TouchableWithoutFeedback"></Header>
                <View style={styles.buttonCT}>
                    <TouchableWithoutFeedback 
                        onPress={this._onPress} 
                        onPressIn={this._onPressIn}
                        onPressOut={this._onPressOut}
                        onLongPress={this._onLongPress}
                    >
                        <Text style={styles.row_text}>TouchableWithoutFeedback</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonCT: {
        padding: 20,
    },
    row_text: {
        fontSize: 18,
        outline: 'none',
        color: 'red',
    }
})
AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);


module.exports = AwesomeProject
