'use strict';

import React, {Component, View, Text, Button, CookieManager, StyleSheet, Alert} from 'qunar-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        margin: 10,
    },
    textContainer: {
        margin: 10,
    },
    textRow: {
        flexDirection: 'row',
        padding: 5,
    },
    textLeft: {
        width: 100,
    },
    textRight: {
        flex: 1
    },
})

class CookieManagerDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            key: '__testCookie',
            domain: '.qunar.com',
            url: 'http://wap.qunar.com',
            cookieValue: Math.random() + '',
            cookie_get: null,
        };
    }

    setCookie() {
        var cookie = {
            key: this.state.key,
            domain: this.state.domain,
            value: this.state.cookieValue,
        };

        CookieManager.setCookie(cookie, ()=> {
            Alert.alert('设置成功');
        });
    }

    getCookie() {
        CookieManager.getCookieForKey(this.state.key, this.state.url, (cookie)=>{
            this.setState({
                cookie_get: cookie,
            })
            console.log('success', cookie);
        }, (error)=>{
            console.log('error', error);
            this.setState({
                cookie_get: null,
            })
        })
    }

    removeCookie() {
        var cookie = {
            key: this.state.key,
            domain: this.state.domain,
            path: '/',
        };

        CookieManager.removeCookie(cookie, ()=> {
            Alert.alert('删除成功');
        });
    }

    removeCookieForKey() {
        //移除特定key和domain的cookie,第一个参数为key,第二个参数为domain
        CookieManager.removeCookieForKey(this.state.key, this.state.url, ()=> {
            Alert.alert('清除成功');
        });
    }

    render() {

        let context_get;

        if(this.state.cookie_get) {
            context_get =
                <View>
                    <View style={styles.textContainer}>
                        <Text>获取的cookie：</Text>
                    </View>
                    <View style={[styles.textRow, {backgroundColor: '#eeeeee'}]}>
                        <View style={styles.textLeft}><Text>key</Text></View>
                        <View style={styles.textRight}><Text>{this.state.cookie_get.key}</Text></View>
                    </View>
                    <View style={[styles.textRow, {backgroundColor: '#ffffff'}]}>
                        <View style={styles.textLeft}><Text>domain</Text></View>
                        <View style={styles.textRight}><Text>{this.state.cookie_get.domain}</Text></View>
                    </View>
                    <View style={[styles.textRow, {backgroundColor: '#eeeeee'}]}>
                        <View style={styles.textLeft}><Text>value</Text></View>
                        <View style={styles.textRight}><Text>{this.state.cookie_get.value}</Text></View>
                    </View>
                </View>

        }

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text>设置的cookie：</Text>
                </View>
                <View style={[styles.textRow, {backgroundColor: '#eeeeee'}]}>
                    <View style={styles.textLeft}><Text>key</Text></View>
                    <View style={styles.textRight}><Text>__testCookie</Text></View>
                </View>
                <View style={[styles.textRow, {backgroundColor: '#ffffff'}]}>
                    <View style={styles.textLeft}><Text>domain</Text></View>
                    <View style={styles.textRight}><Text>.qunar.com</Text></View>
                </View>
                <View style={[styles.textRow, {backgroundColor: '#eeeeee'}]}>
                    <View style={styles.textLeft}><Text>value</Text></View>
                    <View style={styles.textRight}><Text>{this.state.cookieValue}</Text></View>
                    <Button text="随机" onPress={()=>this.setState({cookieValue: Math.random() + ''})}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="设置cookie" style={styles.button} onPress={()=>this.setCookie()}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="获取设置的cookie" style={styles.button} onPress={()=>this.getCookie()}/>
                </View>
                {context_get}
                <View style={styles.buttonContainer}>
                    <Button text="删除cookie(removeCookie)" style={styles.button} onPress={()=>this.removeCookie()}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="删除cookie(removeCookieForKey)" style={styles.button} onPress={()=>this.removeCookieForKey()}/>
                </View>
            </View>
        );
    }
}

module.exports = {
    title: 'CookieManager',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <CookieManagerDemo />
            );
        },
    }]
};
