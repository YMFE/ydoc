'use strict';
var React = require('react-native');
var {
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    Image,
    AppRegistry,
    TextInput,
} = React;
 
var Demo = React.createClass({
    getInitialState() {
        return {
            defaultValue: 1,
        };
    },
    componentDidMount() {
        var me = this
        setTimeout(function() {
            me.setState({
                defaultValue: 13
            })
        }, 1500)
    },
    render() {
        var state = this.state,
            ps = {
                onSelectionChange: function(e) {
                    // console.log(e)
                },
                style: [styles.input],
                autoFocus: true,
                placeholder: 'nihao',
                selectTextOnFocus: true,
                onChangeText: function(value) {
                    console.log(value)
                },
                onChange: function(event) {
                },
                onBlur: function(event) {
                    console.log('onBlur ele')
                },
                onFocus: function(event) {
                    console.log('onFocus ele')
                },
                defaultValue: this.state.defaultValue,
                autoCapitalize: 'words',
                onKeyPress: function(event) {
                    // console.log(event.nativeEvent.keyCode)
                },
            },
            {navigator} = this.props
        return (
            <View 
                style={{flex: 1, 
        flexDirection: 'column'}}
            >
                <View 
                    style={[styles.demo]}
                >
                    <TextInput {...ps} style={[styles.input, {width: 100}]} maxLength={10} editable={false} value={this.state.defaultValue}><Text>内文字</Text></TextInput>
                    <View 
                        style={{flex:1, backgroundColor: 'yellow'}}
                    >
                        <Text>旁边的文字</Text>
                    </View>
                </View>
                <View 
                    style={[styles.demo]}
                >
                    <TextInput {...ps} secureTextEntry={true}><Text>密码</Text></TextInput>
                </View>
                <View 
                    style={[styles.demo]}
                >
                    <TextInput {...ps} multiline={true} numberOfLines={4}/>
                </View>
                <View 
                    style={[styles.demo]}
                >
                    <Text>{this.state.defaultValue}</Text>
                </View>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    demo: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        borderRightStyle: 'solid',
    },
    text: {
        fontSize: 30
    },
    input: {
        borderWidth: 1,
    },
    img: {
        width: 100,
        height: 100,
        tintColor: "red"
    },
    imgCover: {
        width: 50,
        height: 100,
        tintColor: "red"
    }
});

AppRegistry.registerComponent('AwesomeProject', () => Demo);


module.exports = Demo
