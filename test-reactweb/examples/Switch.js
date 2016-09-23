'use strict';

var React = require('react');
var ReactNative = require('qunar-react-native');
var {
    Switch,
    Text,
    View,
    AppRegistry,
    StyleSheet,
} = ReactNative;


var Header = require('./Header');

var Example1 = React.createClass({
    getInitialState(){
        return {
            sw1: false,
            sw2: true,
        };
    },
    render(){
        return(
            <View>
                <Text style={styles.subtitle}>监听状态</Text>
                <View style={styles.switchContainer}>
                    <Switch
                        value={this.state.sw1}
                        onValueChange = {(value)=>this.setState({sw1:value})}
                    />
                    <Switch
                        value={this.state.sw2}
                        onValueChange = {(value)=>this.setState({sw2:value})}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text>{this.state.sw1 ? 'ON':'OFF'}</Text>
                    <Text>{this.state.sw2 ? 'ON':'OFF'}</Text>
                </View>
            </View>
        )
    }
})

var Example2 = React.createClass({
    render(){
        return(
            <View>
                <Text style={styles.subtitle}>禁用</Text>
                <View style={styles.switchContainer}>
                    <Switch disabled/>
                    <Switch disabled value/>
                </View>
            </View>
        )
    }
})

var Example3 = React.createClass({
    render(){
        return(
            <View>
                <Text style={styles.subtitle}>自定义颜色</Text>
                <View style={styles.switchContainer}>
                    <Switch 
                        value
                        onTintColor = {'#ccc'}
                        thumbTintColor = {'#1ba9ba'}
                    />
                    <Switch
                        tintColor = {'#f6f7f8'}
                        thumbTintColor = {'#1ba9ba'}
                    />
                </View>
            </View>
        )
    }
})

var Demo = React.createClass({
    render(){
        return (
            <View>
                <Header navigator={navigator} title="Switch"></Header>
                <View>
                    <Example1/>
                    <Example2/>
                    <Example3/>
                </View>
            </View>
        )
    }
})

var styles = StyleSheet.create({
    subtitle:{
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        backgroundColor: '#f6f7f8',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
})

AppRegistry.registerComponent('AwesomeProject', () => Demo);

module.exports = Demo;
