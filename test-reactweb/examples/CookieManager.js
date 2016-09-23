 'use strict';
var React = require('qunar-react-native');
var {
    Component,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    StyleSheet,
    CookieManager,
    AppRegistry,
} = React;

console.log(CookieManager);

var Demo = React.createClass({
    getInitialState:function(){
        return {
            key: '',
            domain: '',
            value: '',
            cookie: {}
        }
    },

    getCookie() {
        const { key, domain } = this.state;
        CookieManager.getCookieForKey(
            key,
            `http://${domain}`,
            cookie => this.setState({cookie}),
            () => {}
        );
    },

    setCookie() {
        const { key, domain, value } = this.state;

        CookieManager.setCookie(
            { key, domain, value },
            () => console.log(arguments)
        );
    },

    removeCookie(){
        const { key, domain, value } = this.state;
        CookieManager.removeCookie(key,()=>console.log(arguments));
    },



    render(){
        var cookies = JSON.stringify(this.state.cookie, null, 4);
        return(
            <View>
                <Text>CookieManager</Text>
                <Text>Key</Text>
                <TextInput
                    autoCapitalize="none"
                    style={style.textInput}
                    onChangeText={key => this.setState({key})}
                    value={this.state.key}
                />
                <Text>Domain</Text>
                <TextInput
                    autoCapitalize="none"
                    style={style.textInput}
                    onChangeText={domain => this.setState({domain})}
                    value={this.state.domain}
                />
                <Text>Value</Text>
                <TextInput
                    autoCapitalize="none"
                    style={style.textInput}
                    onChangeText={value => this.setState({value})}
                    value={this.state.value}
                />

                <TouchableHighlight
                    style={style.button}
                    onPress={this.getCookie}>
                    <Text>getCookie</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={style.button}
                    onPress={this.setCookie}>
                    <Text>setCookie</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={style.button}
                    onPress={this.removeCookie}>
                    <Text>removeCookie</Text>
                </TouchableHighlight>
                <View>
                    <Text>cookies: {cookies}</Text>
                </View>
                
            </View>
        )
    }
}) 

var style = StyleSheet.create({
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    button: {
        borderColor: '#999',
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      },
});

AppRegistry.registerComponent('Demo', () => Demo)
