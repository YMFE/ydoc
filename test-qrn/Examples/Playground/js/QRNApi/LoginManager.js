'use strict';

import React, {Component, View, Text, Button, LoginManager, StyleSheet, Image} from 'qunar-react-native';

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

class LoginManagerDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLogin: -2, // 0: yes -1: no -2: unkown
            userInfo: null,
        }
    }

    getLoginInfo() {
        LoginManager.getLoginInfo((data) => {
            this.setState({
                isLogin: 0,
                userInfo: data,
            });
        }, (data) => {
            this.setState({
                isLogin: -1,
                userInfo: null,
            });
        });
    }

    login() {
        LoginManager.login((data) => {
            this.setState({
                isLogin: 0,
                userInfo: data,
            });
        }, (data) => {
            this.setState({
                userInfo: null,
            });
        });
    }

    render() {

        let context;

        switch(this.state.isLogin) {
            case -2:
                context = '尚未获取用户登录信息。';
                break;
            case -1:
                context = '用户未登录。';
                break;
            case 0:
                context = '用户已登录。';
                break;
        }

        let userInfoContext = [];

        if(this.state.isLogin == 0 && this.state.userInfo) {

            const keys = {
                'userName': 'string',
                'userID': 'string',
                'userEmail': 'string',
                'userNickname': 'string',
                'userAvatar': 'string',
                'userUserID': 'string',
            };

            let counter = 0,
                {userInfo} = this.state;

            for(let prop in keys) {
                let checked = false;

                if(typeof userInfo[prop] !== 'undefined' && typeof userInfo[prop] === keys[prop]) {
                    checked = true;
                }

                let _backgroundColor = checked ? (counter % 2 == 1 ? '#ffffff' : '#eeeeee') : '#f9f2f4',
                    _fontColor = checked ? '#333333' : '#c7254e';

                let _image = (prop == 'userAvatar' && userInfo[prop]) ? <Image style={{width: 80, height: 80}} source={{uri: userInfo[prop]}} /> : null;

                userInfoContext.push(
                    <View key={counter} style={[styles.textRow, {backgroundColor: _backgroundColor}]}>
                        <View style={styles.textLeft}><Text style={{color: _fontColor}}>{prop}</Text></View>
                        <View style={styles.textRight}>{_image}<Text style={{color: _fontColor}}>{userInfo[prop]+''}</Text></View>
                    </View>);

                counter++;
            }
        }

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text>{context}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="点击获取登录信息" style={styles.button} onPress={this.getLoginInfo.bind(this)}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button text="点击登录" style={styles.button} onPress={this.login.bind(this)}/>
                </View>
                {userInfoContext}
            </View>
        );
    }
}

module.exports = {
    title: 'LoginManager',
    scroll: true,
    examples: [{
        render: () => {
            return (
                <LoginManagerDemo />
            );
        },
    }]
};
