// -*- mode: web; -*-

'use strict';

const {
    StyleSheet,
    CookieManager,
    Component,
    TextInput,
    Text,
    View
} = React;

var UIExplorerButton = require('./UIExplorerButton');

class CookieManagerExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            domain: '',
            value: '',
            cookie: {}
        }
    }

    getCookie() {
        const { key, domain } = this.state;
        CookieManager.getCookieForKey(
            key,
            `http://${domain}`,
            cookie => this.setState({cookie}),
            () => {}
        );
    }

    setCookie() {
        const { key, domain, value } = this.state;

        CookieManager.setCookie(
            { key, domain, value },
            () => console.log(arguments)
        );
    }

    render() {
        let cookie = JSON.stringify(this.state.cookie, null, 4);

        return (
            <View>
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

                <UIExplorerButton
                    onPress={this.getCookie.bind(this)}>
                    getCookies
                </UIExplorerButton>
                <UIExplorerButton
                    onPress={this.setCookie.bind(this)}>
                    setCookies
                </UIExplorerButton>

                <Text>cookies: {cookie}</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    }
});

module.exports = {
    title: 'CookieManager',
    examples: [
        {
            subtitle: 'cookies',
            render: () => <CookieManagerExample/>
        }
    ]
};

